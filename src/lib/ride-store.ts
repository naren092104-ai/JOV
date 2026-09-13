export type RideStatus =
  | "IDLE"
  | "SEARCHING_DRIVER"
  | "DRIVER_ASSIGNED"
  | "DRIVER_ARRIVING"
  | "DRIVER_ARRIVED"
  | "PIN_VERIFIED"
  | "RIDE_STARTED"
  | "RIDE_COMPLETED"
  | "CANCELLED";

export interface SharedRide {
  id: string;
  rideId: string;
  customer: string;
  customerPhone?: string;
  driver: string | null;
  driverPhone?: string;
  vehicle: string;
  registration: string;
  pickup: string;
  destination: string;
  distance: string;
  duration: string;
  fare: number;
  driverEarnings: number;
  platform: number;
  platformAmount: number;
  extraCharges: number;
  payment: string;
  paymentMethod: string;
  status: RideStatus;
  pin: string;
  createdAt: number;
}

export interface DemoStoreState {
  rideStatus: RideStatus;
  pickup: string | null;
  destination: string | null;
  vehicle: string | null;
  payment: string | null;
  fare: number | null;
  activeRide: SharedRide | null;
  driverOnline: boolean;
  messages: Array<{ sender: "customer" | "driver"; text: string; time: string }>;
}

const STORAGE_KEY = "jov-fleet-shared-demo-state";
const BROADCAST_CHANNEL_NAME = "jov-fleet-sync";

export const initialDemoState: DemoStoreState = {
  rideStatus: "IDLE",
  pickup: null,
  destination: null,
  vehicle: null,
  payment: null,
  fare: null,
  activeRide: null,
  driverOnline: false, // Driver strictly starts OFFLINE
  messages: [
    { sender: "customer", text: "I’m near the main gate.", time: "Just now" },
    { sender: "driver", text: "Okay, I’m coming.", time: "Just now" },
  ],
};

// Keep persistent channel open across application lifetime
let globalChannel: BroadcastChannel | null = null;
function getPersistentChannel(): BroadcastChannel | null {
  if (typeof window === "undefined" || !("BroadcastChannel" in window)) return null;
  if (!globalChannel) {
    try {
      globalChannel = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
    } catch {
      globalChannel = null;
    }
  }
  return globalChannel;
}

export function readStoredState(): DemoStoreState {
  if (typeof window === "undefined") return initialDemoState;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return initialDemoState;
    const parsed = JSON.parse(raw);
    return {
      rideStatus: parsed.rideStatus ?? "IDLE",
      pickup: parsed.pickup ?? null,
      destination: parsed.destination ?? null,
      vehicle: parsed.vehicle ?? null,
      payment: parsed.payment ?? null,
      fare: parsed.fare ?? null,
      activeRide: parsed.activeRide ?? null,
      driverOnline: Boolean(parsed.driverOnline),
      messages: Array.isArray(parsed.messages) ? parsed.messages : initialDemoState.messages,
    };
  } catch {
    return initialDemoState;
  }
}

export function updateStoredState(patch: Partial<DemoStoreState>): DemoStoreState {
  if (typeof window === "undefined") return initialDemoState;
  try {
    const current = readStoredState();
    const updated: DemoStoreState = {
      ...current,
      ...patch,
    };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    // 1. Broadcast to other browser tabs
    const channel = getPersistentChannel();
    try {
      channel?.postMessage({ type: "SYNC_STATE", payload: updated });
    } catch (e) {
      console.warn("BroadcastChannel postMessage error", e);
    }

    // 2. Dispatch local custom event for instant same-tab listeners
    try {
      window.dispatchEvent(new CustomEvent("jov-fleet-sync-event", { detail: updated }));
    } catch {}

    return updated;
  } catch (error) {
    console.error("Failed to update shared demo state", error);
    return readStoredState();
  }
}

export function persistState(state: DemoStoreState) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    const channel = getPersistentChannel();
    try {
      channel?.postMessage({ type: "SYNC_STATE", payload: state });
    } catch {}
    try {
      window.dispatchEvent(new CustomEvent("jov-fleet-sync-event", { detail: state }));
    } catch {}
  } catch (error) {
    console.error("Failed to persist shared demo state", error);
  }
}

export function subscribeToStore(callback: (state: DemoStoreState) => void): () => void {
  if (typeof window === "undefined") return () => {};

  let lastSerialized = window.localStorage.getItem(STORAGE_KEY);
  const channel = getPersistentChannel();

  const handleBroadcast = (event: MessageEvent) => {
    if (event.data?.type === "SYNC_STATE" && event.data.payload) {
      lastSerialized = JSON.stringify(event.data.payload);
      callback(event.data.payload);
    }
  };

  const handleStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY && event.newValue) {
      try {
        lastSerialized = event.newValue;
        const parsed = JSON.parse(event.newValue);
        callback(parsed);
      } catch {
        // Ignore parse error
      }
    }
  };

  const handleLocalSync = (event: Event) => {
    const custom = event as CustomEvent<DemoStoreState>;
    if (custom.detail) {
      lastSerialized = JSON.stringify(custom.detail);
      callback(custom.detail);
    }
  };

  if (channel) {
    channel.addEventListener("message", handleBroadcast);
  }
  window.addEventListener("storage", handleStorage);
  window.addEventListener("jov-fleet-sync-event", handleLocalSync);

  // High-frequency 100ms fallback poller
  const pollTimer = window.setInterval(() => {
    try {
      const serialized = window.localStorage.getItem(STORAGE_KEY);
      if (!serialized || serialized === lastSerialized) return;
      lastSerialized = serialized;
      const parsed = JSON.parse(serialized);
      callback(parsed as DemoStoreState);
    } catch {
      // Ignore parse errors
    }
  }, 100);

  return () => {
    if (channel) {
      channel.removeEventListener("message", handleBroadcast);
    }
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener("jov-fleet-sync-event", handleLocalSync);
    window.clearInterval(pollTimer);
  };
}
