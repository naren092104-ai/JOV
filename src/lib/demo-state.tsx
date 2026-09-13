import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import {
  type RideStatus,
  type SharedRide,
  type DemoStoreState,
  initialDemoState,
  readStoredState,
  updateStoredState,
  subscribeToStore,
} from "./ride-store";

export type { RideStatus, SharedRide, DemoStoreState };

export const demoRide: SharedRide = {
  id: "JF10248",
  rideId: "JF10248",
  customer: "Priya",
  customerPhone: "+91 98765 43210",
  driver: "Arun Kumar",
  driverPhone: "+91 98765 67890",
  vehicle: "Hyundai Grand i10",
  registration: "TN 01 AB 1234",
  pickup: "T Nagar",
  destination: "Chennai Airport",
  distance: "12.8 km",
  duration: "34 min",
  fare: 248,
  driverEarnings: 228,
  platform: 20,
  platformAmount: 20,
  extraCharges: 0,
  payment: "Cash",
  paymentMethod: "Cash",
  status: "SEARCHING_DRIVER",
  pin: "4821",
  createdAt: 0,
};

export interface CallState {
  open: boolean;
  role: "customer" | "driver";
  recipientName: string;
  recipientPhone: string;
}

export interface DemoContextValue {
  rideStatus: RideStatus;
  setRideStatus: (status: RideStatus) => void;
  pickup: string | null;
  setPickup: (value: string | null) => void;
  destination: string | null;
  setDestination: (value: string | null) => void;
  vehicle: string | null;
  setVehicle: (value: string | null) => void;
  payment: string | null;
  setPayment: (value: string | null) => void;
  fare: number | null;
  setFare: (value: number | null) => void;
  activeRide: SharedRide | null;
  setActiveRide: (ride: SharedRide | null) => void;
  driverOnline: boolean;
  setDriverOnline: (value: boolean) => void;
  messages: string[];
  addMessage: (message: string) => void;
  toast: string;
  showToast: (message: string) => void;
  // Shared actions
  bookRide: (details: Partial<SharedRide>) => SharedRide;
  acceptRide: (driverName?: string) => void;
  arriveRide: () => void;
  verifyPin: (pin: string) => boolean;
  startRide: () => void;
  completeRide: () => void;
  declineRide: () => void;
  cancelRide: () => void;
  resetDemo: () => void;
  // Call modal
  callModal: CallState | null;
  openCall: (role: "customer" | "driver") => void;
  closeCall: () => void;
}

const DemoContext = createContext<DemoContextValue | null>(null);

export function DemoProvider({ children }: { children: ReactNode }) {
  const [rideStatus, setRideStatusState] = useState<RideStatus>(initialDemoState.rideStatus);
  const [pickup, setPickupState] = useState<string | null>(initialDemoState.pickup);
  const [destination, setDestinationState] = useState<string | null>(initialDemoState.destination);
  const [vehicle, setVehicleState] = useState<string | null>(initialDemoState.vehicle);
  const [payment, setPaymentState] = useState<string | null>(initialDemoState.payment);
  const [fare, setFareState] = useState<number | null>(initialDemoState.fare);
  const [activeRide, setActiveRideState] = useState<SharedRide | null>(initialDemoState.activeRide);
  const [driverOnline, setDriverOnlineState] = useState<boolean>(initialDemoState.driverOnline);
  const [messages, setMessagesState] = useState<string[]>(
    initialDemoState.messages.map((m) => m.text),
  );
  const [toast, setToast] = useState<string>("");
  const [callModal, setCallModal] = useState<CallState | null>(null);

  // Initialize from storage on client mount
  useEffect(() => {
    const stored = readStoredState();
    setRideStatusState(stored.rideStatus);
    setPickupState(stored.pickup);
    setDestinationState(stored.destination);
    setVehicleState(stored.vehicle);
    setPaymentState(stored.payment);
    setFareState(stored.fare);
    setActiveRideState(stored.activeRide);
    setDriverOnlineState(stored.driverOnline);
    setMessagesState(stored.messages.map((m) => m.text));
  }, []);

  // Subscribe to updates from other tabs (via BroadcastChannel + storage events + 150ms poller)
  useEffect(() => {
    const unsubscribe = subscribeToStore((remoteState) => {
      setRideStatusState(remoteState.rideStatus);
      setPickupState(remoteState.pickup);
      setDestinationState(remoteState.destination);
      setVehicleState(remoteState.vehicle);
      setPaymentState(remoteState.payment);
      setFareState(remoteState.fare);
      setActiveRideState(remoteState.activeRide);
      setDriverOnlineState(remoteState.driverOnline);
      setMessagesState(remoteState.messages.map((m) => m.text));
    });
    return unsubscribe;
  }, []);

  // Atomic state update helper
  const updateStore = (patch: Partial<DemoStoreState>) => {
    const updated = updateStoredState(patch);
    if (patch.rideStatus !== undefined) setRideStatusState(patch.rideStatus);
    if (patch.pickup !== undefined) setPickupState(patch.pickup);
    if (patch.destination !== undefined) setDestinationState(patch.destination);
    if (patch.vehicle !== undefined) setVehicleState(patch.vehicle);
    if (patch.payment !== undefined) setPaymentState(patch.payment);
    if (patch.fare !== undefined) setFareState(patch.fare);
    if (patch.activeRide !== undefined) setActiveRideState(patch.activeRide);
    if (patch.driverOnline !== undefined) setDriverOnlineState(patch.driverOnline);
    if (patch.messages !== undefined) setMessagesState(patch.messages.map((m) => m.text));
    return updated;
  };

  const showToast = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2600);
  };

  const setRideStatus = (status: RideStatus) => {
    const current = readStoredState();
    const updatedRide = current.activeRide ? { ...current.activeRide, status } : null;
    updateStore({
      rideStatus: status,
      activeRide: updatedRide,
    });
  };

  const setPickup = (value: string | null) => {
    updateStore({ pickup: value });
  };

  const setDestination = (value: string | null) => {
    updateStore({ destination: value });
  };

  const setVehicle = (value: string | null) => {
    updateStore({ vehicle: value });
  };

  const setPayment = (value: string | null) => {
    updateStore({ payment: value });
  };

  const setFare = (value: number | null) => {
    updateStore({ fare: value });
  };

  const setActiveRide = (ride: SharedRide | null) => {
    const newStatus = ride ? ride.status : "IDLE";
    updateStore({
      activeRide: ride,
      rideStatus: newStatus,
    });
  };

  // Driver toggling online/offline NEVER touches activeRide or customer state!
  const setDriverOnline = (isOnline: boolean) => {
    setDriverOnlineState(isOnline);
    updateStore({ driverOnline: isOnline });
  };

  const addMessage = (message: string) => {
    const nextMessages = [...messages, message];
    setMessagesState(nextMessages);
    updateStore({
      messages: nextMessages.map((text) => ({ sender: "customer", text, time: "Just now" })),
    });
  };

  // State Transition Actions
  const bookRide = (details: Partial<SharedRide>): SharedRide => {
    const rideFare = details.fare ?? fare ?? 248;
    const platform = 20;
    const driverEarnings = Math.max(0, rideFare - platform);

    const newRide: SharedRide = {
      id: "JF10248",
      rideId: "JF10248",
      customer: "Priya",
      customerPhone: "+91 98765 43210",
      driver: null, // Driver not assigned yet
      driverPhone: "+91 98765 67890",
      vehicle: details.vehicle ?? vehicle ?? "Mini",
      registration: "TN 01 AB 1234",
      pickup: details.pickup ?? pickup ?? "Guindy Metro, Chennai",
      destination: details.destination ?? destination ?? "T Nagar, Chennai",
      distance: details.distance ?? "6.4 km",
      duration: details.duration ?? "18 min",
      fare: rideFare,
      driverEarnings,
      platform,
      platformAmount: platform,
      extraCharges: 0,
      payment: details.paymentMethod ?? payment ?? "Cash",
      paymentMethod: details.paymentMethod ?? payment ?? "Cash",
      status: "SEARCHING_DRIVER",
      pin: "4821",
      createdAt: Date.now(),
    };

    // Book the ride into the shared store. The driver must already be online in the other tab
    // before the request card can be shown from the driver live-home view.
    updateStore({
      rideStatus: "SEARCHING_DRIVER",
      activeRide: newRide,
      pickup: newRide.pickup,
      destination: newRide.destination,
      vehicle: newRide.vehicle,
      payment: newRide.paymentMethod,
      fare: rideFare,
    });

    showToast("Finding a driver near you…");
    return newRide;
  };

  const acceptRide = (driverName: string = "Arun Kumar") => {
    const current = readStoredState();
    const ride = current.activeRide ?? activeRide;
    if (!ride) return;

    const updated: SharedRide = {
      ...ride,
      driver: driverName,
      driverPhone: "+91 98765 67890",
      registration: "TN-09-CB-4821",
      status: "DRIVER_ASSIGNED",
    };

    updateStore({
      activeRide: updated,
      rideStatus: "DRIVER_ASSIGNED",
    });
    showToast(`Ride accepted for ${updated.customer}`);
  };

  const arriveRide = () => {
    const current = readStoredState();
    const ride = current.activeRide ?? activeRide;
    if (!ride) return;

    const updated: SharedRide = {
      ...ride,
      status: "DRIVER_ARRIVED",
    };

    updateStore({
      activeRide: updated,
      rideStatus: "DRIVER_ARRIVED",
    });
    showToast("Driver has arrived at pickup");
  };

  const verifyPin = (enteredPin: string): boolean => {
    const current = readStoredState();
    const ride = current.activeRide ?? activeRide;
    if (!ride) return false;

    const isValid = enteredPin.trim() === ride.pin.trim();
    if (isValid) {
      const updated: SharedRide = {
        ...ride,
        status: "PIN_VERIFIED",
      };
      updateStore({
        activeRide: updated,
        rideStatus: "PIN_VERIFIED",
      });
      showToast("Trip PIN verified");
    }
    return isValid;
  };

  const startRide = () => {
    const current = readStoredState();
    const ride = current.activeRide ?? activeRide;
    if (!ride) return;

    const updated: SharedRide = {
      ...ride,
      status: "RIDE_STARTED",
    };

    updateStore({
      activeRide: updated,
      rideStatus: "RIDE_STARTED",
    });
    showToast("Ride started");
  };

  const completeRide = () => {
    const current = readStoredState();
    const ride = current.activeRide ?? activeRide;
    if (!ride) return;

    const updated: SharedRide = {
      ...ride,
      status: "RIDE_COMPLETED",
    };

    updateStore({
      activeRide: updated,
      rideStatus: "RIDE_COMPLETED",
    });
    showToast("Ride completed successfully");
  };

  const declineRide = () => {
    updateStore({
      activeRide: null,
      rideStatus: "IDLE",
    });
    showToast("Ride request declined");
  };

  const cancelRide = () => {
    const current = readStoredState();
    const ride = current.activeRide ?? activeRide;
    const cancelledRide = ride ? { ...ride, status: "CANCELLED" as RideStatus } : null;

    updateStore({
      activeRide: cancelledRide,
      rideStatus: "CANCELLED",
      pickup: null,
      destination: null,
      vehicle: null,
      payment: null,
      fare: null,
    });
    showToast("Ride cancelled");
  };

  const resetDemo = () => {
    updateStore({
      rideStatus: "IDLE",
      pickup: null,
      destination: null,
      vehicle: null,
      payment: null,
      fare: null,
      activeRide: null,
      driverOnline: false,
    });
    showToast("Demo state reset to clean initial state");
  };

  const openCall = (role: "customer" | "driver") => {
    const current = readStoredState();
    const ride = current.activeRide ?? activeRide;
    setCallModal({
      open: true,
      role,
      recipientName: role === "customer" ? (ride?.driver ?? "Arun Kumar") : (ride?.customer ?? "Priya"),
      recipientPhone: role === "customer" ? (ride?.driverPhone ?? "+91 98765 67890") : (ride?.customerPhone ?? "+91 98765 43210"),
    });
  };

  const closeCall = () => {
    setCallModal(null);
  };

  const value = useMemo<DemoContextValue>(
    () => ({
      rideStatus,
      setRideStatus,
      pickup,
      setPickup,
      destination,
      setDestination,
      vehicle,
      setVehicle,
      payment,
      setPayment,
      fare,
      setFare,
      activeRide,
      setActiveRide,
      driverOnline,
      setDriverOnline,
      messages,
      addMessage,
      toast,
      showToast,
      bookRide,
      acceptRide,
      arriveRide,
      verifyPin,
      startRide,
      completeRide,
      declineRide,
      cancelRide,
      resetDemo,
      callModal,
      openCall,
      closeCall,
    }),
    [
      rideStatus,
      pickup,
      destination,
      vehicle,
      payment,
      fare,
      activeRide,
      driverOnline,
      messages,
      toast,
      callModal,
    ],
  );

  return (
    <DemoContext.Provider value={value}>
      {children}
      {toast ? (
        <div
          className="fixed bottom-5 left-1/2 z-50 -translate-x-1/2 border border-primary/20 bg-foreground px-4 py-3 text-sm font-medium text-background shadow-xl"
          role="status"
        >
          {toast}
        </div>
      ) : null}

      {/* Demo Call Modal */}
      {callModal?.open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm rounded-xl border border-border bg-card p-6 text-center shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="mx-auto grid size-16 place-items-center rounded-full bg-primary/10 text-primary animate-pulse">
              <span className="text-2xl">📞</span>
            </div>
            <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {callModal.role === "customer" ? "Calling driver" : "Calling customer"}
            </p>
            <h3 className="mt-1 font-display text-2xl font-semibold text-foreground">
              {callModal.recipientName}
            </h3>
            <p className="text-sm text-muted-foreground">{callModal.recipientPhone}</p>

            <div className="mt-6 rounded-lg bg-secondary/50 p-3 text-xs text-muted-foreground">
              <span className="inline-block size-2 rounded-full bg-emerald-500 mr-2 animate-ping" />
              Connected · Encrypted Demo Voice Call
            </div>

            <button
              type="button"
              onClick={closeCall}
              className="mt-6 w-full rounded-lg bg-destructive px-4 py-2.5 font-medium text-destructive-foreground transition hover:bg-destructive/90"
            >
              End call
            </button>
          </div>
        </div>
      ) : null}
    </DemoContext.Provider>
  );
}

export function useDemo() {
  const context = useContext(DemoContext);
  if (!context) throw new Error("DemoProvider is missing");
  return context;
}

export const useDemoState = useDemo;
