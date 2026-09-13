import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Check,
  ChevronDown,
  Clock3,
  CreditCard,
  Download,
  MapPin,
  MessageCircle,
  Phone,
  Plus,
  Search,
  Send,
  ShieldAlert,
  Sparkles,
  Star,
  WalletCards,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AppShell, MapPanel, RideStatusBadge, SectionHeading } from "@/components/jov-shell";
import { useAppContext } from "@/context/app-context";
import { demoRide, useDemo, type RideStatus } from "@/lib/demo-state";
import { locationSearchService, type DemoLocation } from "@/services/location.service";

const places = [
  "Chennai Airport",
  "T Nagar",
  "Anna Nagar",
  "Velachery",
  "Adyar",
  "Guindy",
  "OMR",
  "Coimbatore",
  "Madurai",
  "Bengaluru",
  "Hyderabad",
  "Mumbai",
  "Delhi",
];
const vehicles = [
  { name: "Bike", seats: "1 seat", eta: "3 min", fare: 118 },
  { name: "Auto", seats: "3 seats", eta: "5 min", fare: 162 },
  { name: "Mini", seats: "4 seats", eta: "6 min", fare: 248 },
  { name: "Sedan", seats: "4 seats", eta: "8 min", fare: 312 },
  { name: "SUV", seats: "6 seats", eta: "9 min", fare: 376 },
];

function getRouteMetrics(pickup: string | null, destination: string | null) {
  if (!pickup || !destination) return { distance: 12.8, duration: 34 };

  const locations = [pickup, destination].join(" ").toLowerCase();
  const distance = locations.includes("airport")
    ? locations.includes("velachery")
      ? 9.4
      : locations.includes("anna nagar")
        ? 16.2
        : 12.8
    : locations.includes("velachery") && locations.includes("anna nagar")
      ? 11.6
      : locations.includes("t nagar") && locations.includes("velachery")
        ? 7.8
        : 8.6;

  return { distance, duration: Math.round(distance * 2.65) };
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  icon = <MapPin className="size-4" />,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  icon?: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="eyebrow mb-2 block">{label}</span>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-primary">{icon}</span>
        <Input
          value={value ?? ""}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className="h-12 pl-10"
        />
      </div>
    </label>
  );
}

function LocationSearchField({
  label,
  value,
  placeholder,
  icon,
  onSelect,
}: {
  label: string;
  value: string | null;
  placeholder: string;
  icon?: React.ReactNode;
  onSelect: (location: DemoLocation) => void;
}) {
  const [query, setQuery] = useState(value ?? "");
  const [open, setOpen] = useState(false);
  const results = locationSearchService.search(query);

  return (
    <label className="relative block">
      <span className="eyebrow mb-2 block">{label}</span>
      <div className="relative">
        <span className="absolute left-3 top-1/2 z-10 -translate-y-1/2 text-primary">
          {icon ?? <MapPin className="size-4" />}
        </span>
        <Input
          value={query}
          placeholder={placeholder}
          className="h-12 pl-10"
          onFocus={() => setOpen(true)}
          onChange={(event) => {
            setQuery(event.target.value);
            setOpen(true);
          }}
          onBlur={() => window.setTimeout(() => setOpen(false), 150)}
        />
      </div>
      {open ? (
        <div className="absolute inset-x-0 top-full z-20 mt-1 max-h-64 overflow-auto border border-border bg-card p-1 shadow-xl">
          {results.length ? (
            results.map((location) => (
              <button
                key={location.id}
                type="button"
                className="flex w-full items-start gap-3 px-3 py-2 text-left hover:bg-secondary"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => {
                  setQuery(`${location.name}, ${location.city}`);
                  setOpen(false);
                  onSelect(location);
                }}
              >
                <MapPin className="mt-0.5 size-4 shrink-0 text-primary" />
                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold">{location.name}</span>
                  <span className="block text-xs text-muted-foreground">
                    {location.type} · {location.city}
                  </span>
                </span>
              </button>
            ))
          ) : (
            <div className="px-3 py-3 text-sm text-muted-foreground">
              <strong className="block text-foreground">No matching places found</strong>
              <span>Try a city, area or landmark.</span>
            </div>
          )}
        </div>
      ) : null}
    </label>
  );
}
function StatCard({
  label,
  value,
  detail,
  tone = "default",
}: {
  label: string;
  value: string;
  detail?: string;
  tone?: "default" | "good" | "warn";
}) {
  return (
    <div
      className={`soft-panel p-4 ${tone === "good" ? "border-primary/30 bg-primary/5" : tone === "warn" ? "border-accent/40 bg-accent/5" : ""}`}
    >
      <p className="eyebrow">{label}</p>
      <p className="stat-number mt-2">{value}</p>
      {detail ? <p className="mt-1 text-xs text-muted-foreground">{detail}</p> : null}
    </div>
  );
}
function Tabs({
  options,
  selected,
  onChange,
}: {
  options: string[];
  selected: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex w-fit max-w-full gap-1 overflow-auto border-b border-border">
      {options.map((option) => (
        <Button
          key={option}
          variant="ghost"
          className={`rounded-none border-b-2 px-3 ${selected === option ? "border-primary text-primary" : "border-transparent text-muted-foreground"}`}
          onClick={() => onChange(option)}
        >
          {option}
        </Button>
      ))}
    </div>
  );
}
function RideRow({ status = "Completed", action }: { status?: string; action?: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-3 border-b border-border py-4 last:border-0 sm:flex-row sm:items-center">
      <div className="grid size-10 shrink-0 place-items-center bg-secondary text-primary">
        <CarGlyph />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="font-semibold">
            {demoRide.pickup} <span className="text-muted-foreground">→</span>{" "}
            {demoRide.destination}
          </p>
          <RideStatusBadge status={status} />
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          {demoRide.id} · Today, 6:10 PM · {demoRide.vehicle}
        </p>
      </div>
      <div className="flex items-center gap-3">
        <span className="font-semibold">₹{demoRide.fare}</span>
        {action}
      </div>
    </div>
  );
}
function CarGlyph() {
  return <span className="text-lg">▰</span>;
}

export function CustomerLogin() {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(false);
  return (
    <AuthPage
      kind="customer"
      title="Welcome to JOV FLEET"
      copy="Simple rides. Clear fares. No surprises."
    >
      {otp ? (
        <>
          <p className="text-sm text-muted-foreground">
            Enter the code sent to +91 {phone || "98765 43210"}
          </p>
          <div className="mt-6 grid grid-cols-6 gap-2">
            {[0, 1, 2, 3, 4, 5].map((index) => (
              <Input
                key={index}
                maxLength={1}
                aria-label={`OTP digit ${index + 1}`}
                className="h-12 px-0 text-center text-lg font-semibold"
                defaultValue={
                  index === 0 ? "4" : index === 1 ? "8" : index === 2 ? "2" : index === 3 ? "1" : ""
                }
              />
            ))}
          </div>
          <Button className="mt-5 w-full" asChild>
            <Link to="/customer/home">Verify and continue</Link>
          </Button>
          <Button variant="link" className="mt-3 w-full" onClick={() => setOtp(false)}>
            Change number
          </Button>
        </>
      ) : (
        <>
          <Field
            label="Mobile number"
            value={phone}
            onChange={setPhone}
            placeholder="98765 43210"
            icon={<span className="text-xs font-semibold">+91</span>}
          />
          <Button className="mt-5 w-full" onClick={() => setOtp(true)}>
            Continue <ArrowRight />
          </Button>
          <Button variant="outline" className="mt-3 w-full" onClick={() => setOtp(true)}>
            Continue with Google
          </Button>
          <Button variant="secondary" className="mt-3 w-full" asChild>
            <Link to="/customer/home">Open customer demo</Link>
          </Button>
        </>
      )}
    </AuthPage>
  );
}
export function DriverLogin() {
  const [otp, setOtp] = useState(false);
  return (
    <AuthPage
      kind="driver"
      title="Drive more. Earn fairly."
      copy="A clear workday starts with a clear app."
    >
      {otp ? (
        <>
          <p className="text-sm text-muted-foreground">Demo code sent to Arun Kumar</p>
          <Input
            className="mt-5 h-12 text-center tracking-[0.5em]"
            defaultValue="4821"
            aria-label="Driver OTP"
          />
          <Button className="mt-5 w-full" asChild>
            <Link to="/driver/home">Enter the driver app</Link>
          </Button>
        </>
      ) : (
        <>
          <Field
            label="Mobile number"
            value=""
            onChange={() => undefined}
            placeholder="98765 43210"
            icon={<span className="text-xs font-semibold">+91</span>}
          />
          <Button className="mt-5 w-full" onClick={() => setOtp(true)}>
            Continue <ArrowRight />
          </Button>
          <Button variant="secondary" className="mt-3 w-full" asChild>
            <Link to="/driver/home">Open driver demo</Link>
          </Button>
        </>
      )}
    </AuthPage>
  );
}
export function AdminLogin() {
  const [logged, setLogged] = useState(false);
  return (
    <AuthPage kind="admin" title="JOV FLEET OPERATIONS" copy="Authorized personnel only.">
      {logged ? (
        <>
          <p className="text-sm text-muted-foreground">
            Welcome back. Your operations desk is ready.
          </p>
          <Button className="mt-5 w-full" asChild>
            <Link to="/admin/dashboard">Open operations</Link>
          </Button>
        </>
      ) : (
        <>
          <label className="block">
            <span className="eyebrow mb-2 block">Work email</span>
            <Input className="h-12" placeholder="admin@jovfleet.demo" />
          </label>
          <label className="mt-4 block">
            <span className="eyebrow mb-2 block">Password</span>
            <Input className="h-12" type="password" placeholder="••••••••" />
          </label>
          <label className="mt-4 flex items-center gap-2 text-sm">
            <input type="checkbox" className="size-4 accent-primary" /> Remember me
          </label>
          <Button className="mt-5 w-full" onClick={() => setLogged(true)}>
            Log in <ArrowRight />
          </Button>
          <Button variant="secondary" className="mt-3 w-full" asChild>
            <Link to="/admin/dashboard">Open admin demo</Link>
          </Button>
        </>
      )}
    </AuthPage>
  );
}
function AuthPage({
  kind,
  title,
  copy,
  children,
}: {
  kind: "customer" | "driver" | "admin";
  title: string;
  copy: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-screen bg-background lg:grid-cols-[0.9fr_1.1fr]">
      <div className="hidden bg-primary p-12 text-primary-foreground lg:flex lg:flex-col lg:justify-between">
        <div>
          <span className="grid size-12 place-items-center bg-primary-foreground font-display text-2xl font-semibold text-primary">
            J
          </span>
          <p className="mt-8 font-display text-6xl font-semibold leading-none">
            {kind === "customer"
              ? "Move through your day with less to think about."
              : kind === "driver"
                ? "Your workday, made clearer."
                : "A closer view of every ride."}
          </p>
        </div>
        <p className="max-w-sm text-sm leading-6 text-primary-foreground/70">
          Smart Rides. Fair Fares. Better Earnings.
        </p>
      </div>
      <div className="flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          <div className="mb-10 flex items-center gap-3 lg:hidden">
            <span className="brand-mark">J</span>
            <span className="font-display text-xl font-semibold">JOV FLEET</span>
          </div>
          <p className="eyebrow text-primary">
            {kind === "admin" ? "Operations access" : `${kind} app`}
          </p>
          <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight">{title}</h1>
          <p className="mt-3 text-muted-foreground">{copy}</p>
          <div className="mt-8">{children}</div>
          <p className="mt-10 text-xs leading-5 text-muted-foreground">
            By continuing, you agree to the JOV FLEET terms and privacy policy. This is a fictional
            demo.
          </p>
        </div>
      </div>
    </div>
  );
}

export function CustomerHome() {
  const {
    pickup,
    setPickup,
    destination,
    setDestination,
    vehicle,
    setVehicle,
    payment,
    rideStatus,
    activeRide,
    bookRide,
    openCall,
    cancelRide,
    resetDemo,
    showToast,
  } = useDemo();
  const [locationMode, setLocationMode] = useState<"pickup" | "drop">("pickup");
  const effectivePickup = pickup || "Guindy Metro, Chennai";
  const effectiveDestination = destination || "T Nagar, Chennai";
  const selected = vehicles.find((item) => item.name === vehicle) ?? vehicles[2];
  const route = getRouteMetrics(effectivePickup, effectiveDestination);
  const selectedFare = Math.round(selected.fare * (route.distance / 12.8));
  const ready = Boolean(effectivePickup && effectiveDestination);

  const isSearching =
    activeRide &&
    (activeRide.status === "SEARCHING_DRIVER" ||
      activeRide.status === "searching" ||
      rideStatus === "SEARCHING_DRIVER" ||
      rideStatus === "searching");
  const isAssigned =
    activeRide &&
    (activeRide.status === "DRIVER_ASSIGNED" ||
      activeRide.status === "assigned" ||
      activeRide.status === "DRIVER_ARRIVING" ||
      rideStatus === "DRIVER_ASSIGNED" ||
      rideStatus === "assigned" ||
      rideStatus === "DRIVER_ARRIVING");
  const isArrived =
    activeRide &&
    (activeRide.status === "DRIVER_ARRIVED" ||
      activeRide.status === "arrived" ||
      rideStatus === "DRIVER_ARRIVED" ||
      rideStatus === "arrived");
  const isStarted =
    activeRide &&
    (activeRide.status === "RIDE_STARTED" ||
      activeRide.status === "in_progress" ||
      activeRide.status === "PIN_VERIFIED" ||
      rideStatus === "RIDE_STARTED" ||
      rideStatus === "in_progress" ||
      rideStatus === "PIN_VERIFIED");
  const isCompleted =
    activeRide &&
    (activeRide.status === "RIDE_COMPLETED" ||
      activeRide.status === "completed" ||
      rideStatus === "RIDE_COMPLETED" ||
      rideStatus === "completed");
  const isCancelled =
    activeRide &&
    (activeRide.status === "CANCELLED" || rideStatus === "CANCELLED");
  const bookingInProgress = Boolean(activeRide && !isCompleted && !isCancelled);

  return (
    <AppShell kind="customer">
      <SectionHeading
        eyebrow="Customer home"
        title="Where are you going, Priya?"
        copy="Simple rides. Clear fares. No surprises."
        action={
          <Button
            variant="outline"
            onClick={() => {
              setPickup("Current location, Chennai");
              setLocationMode("drop");
              showToast("Pickup set to your current location");
            }}
          >
            ◎ Current location
          </Button>
        }
      />
      <div className="grid gap-5 xl:grid-cols-[1fr_390px]">
        <MapPanel
          label={`Chennai · Select ${locationMode}`}
          markers={4}
          distance={ready ? `${route.distance} km` : "Select pickup and drop"}
          duration={ready ? `${route.duration} min` : ""}
          locations={[
            { name: "T Nagar", left: "28%", top: "62%" },
            { name: "Airport", left: "75%", top: "28%" },
            { name: "Anna Nagar", left: "52%", top: "34%" },
            { name: "Velachery", left: "66%", top: "70%" },
          ]}
          onSelectLocation={(location) => {
            if (locationMode === "pickup") {
              setPickup(`${location}, Chennai`);
              setLocationMode("drop");
              showToast(`Pickup selected: ${location}`);
            } else {
              setDestination(location === "Airport" ? "Chennai Airport" : `${location}, Chennai`);
              const nextDestination = location === "Airport" ? "Chennai Airport" : `${location}, Chennai`;
              const nextRoute = getRouteMetrics(pickup, nextDestination);
              showToast(`Drop selected: ${location} · ${nextRoute.distance} km`);
            }
          }}
        />
        <div className="space-y-4">
          <div className="soft-panel p-5">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl font-semibold">Book a ride</h2>
              <span className="status-badge">No hidden charges</span>
            </div>
            <div className="mt-5 space-y-4">
              <LocationSearchField
                label="Pickup"
                value={pickup}
                onSelect={(location) => {
                  setPickup(`${location.name}, ${location.city}`);
                  setLocationMode("pickup");
                }}
                placeholder="Search pickup location"
              />
              <LocationSearchField
                label="Drop"
                value={destination}
                onSelect={(location) => {
                  setDestination(`${location.name}, ${location.city}`);
                  setLocationMode("drop");
                }}
                placeholder="Where are you going?"
                icon={<Search className="size-4" />}
              />
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {["Home", "Work", "Airport", "Velachery"].map((place) => (
                <Button
                  key={place}
                  variant="secondary"
                  size="sm"
                  onClick={() =>
                    place === "Airport"
                      ? setDestination("Chennai Airport")
                      : setPickup(
                          place === "Home"
                            ? "T Nagar, Chennai"
                            : place === "Work"
                              ? "Guindy, Chennai"
                              : "Velachery, Chennai",
                        )
                  }
                >
                  {place}
                </Button>
              ))}
            </div>
          </div>
          <div className="soft-panel p-5">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl font-semibold">Choose your ride</h2>
              <span className="text-xs text-muted-foreground">
                {ready ? `${route.duration} min · ${route.distance} km` : "Select route"}
              </span>
            </div>
            <div className="mt-3 space-y-2">
              {vehicles.slice(1).map((item) => (
                <button
                  key={item.name}
                  type="button"
                  onClick={() => setVehicle(item.name)}
                  className={`flex min-h-14 w-full items-center gap-3 border px-3 text-left transition ${vehicle === item.name ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"}`}
                >
                  <span className="grid size-8 place-items-center bg-secondary text-primary">
                    ▰
                  </span>
                  <span className="flex-1">
                    <span className="block text-sm font-semibold">{item.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {item.seats} · {item.eta}
                    </span>
                  </span>
                  <span className="font-semibold">
                    {ready ? `₹${Math.round(item.fare * (route.distance / 12.8))}` : "—"}
                  </span>
                </button>
              ))}
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
              <span className="text-sm text-muted-foreground">Your fare</span>
              <span className="font-display text-2xl font-semibold">{ready ? `₹${selectedFare}` : "—"}</span>
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              {effectivePickup} → {effectiveDestination} · Extra charges ₹0
            </div>
            <Button
              className="mt-4 w-full"
              disabled={bookingInProgress}
              onClick={() => {
                bookRide({
                  pickup: effectivePickup,
                  destination: effectiveDestination,
                  vehicle: selected.name,
                  distance: `${route.distance} km`,
                  duration: `${route.duration} min`,
                  fare: selectedFare,
                  paymentMethod: payment ?? "Cash",
                });
              }}
            >
              {isSearching
                ? "Finding a driver…"
                : isAssigned
                  ? "Driver assigned"
                  : isArrived
                    ? "Driver arrived"
                    : isStarted
                      ? "Ride in progress"
                      : isCompleted
                        ? "Book another ride"
                        : isCancelled
                          ? "Book another ride"
                          : "Book ride"} {!bookingInProgress ? <ArrowRight /> : null}
            </Button>
            <Button variant="outline" className="mt-2 w-full" asChild>
              <Link to="/customer/schedule">Schedule ride</Link>
            </Button>
          </div>
        </div>
      </div>

      {isSearching ? (
        <div className="mt-5 rounded-lg border border-accent/40 bg-accent/5 p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="size-3 animate-ping rounded-full bg-accent" />
              <span className="font-semibold text-accent">Finding a driver near you…</span>
            </div>
            <span className="status-badge">Searching</span>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            Looking for a nearby driver for{" "}
            <strong className="text-foreground">
              {activeRide?.pickup ?? effectivePickup} → {activeRide?.destination ?? effectiveDestination}
            </strong>
            . Open the driver app in another tab to accept this ride.
          </p>
          <div className="mt-4 rounded-lg border border-border bg-card p-4">
            <div className="flex items-center justify-between">
              <p className="font-semibold text-foreground">3 drivers nearby</p>
              <span className="text-xs text-emerald-600">Checking availability</span>
            </div>
            <div className="mt-3 grid gap-2 sm:grid-cols-3">
              {[
                ["Arun Kumar", "2.1 km", "4 min"],
                ["Siva Raj", "3.4 km", "7 min"],
                ["Deepak M", "4.8 km", "9 min"],
              ].map(([name, distance, eta]) => (
                <div key={name} className="flex items-center gap-2 border border-border/70 px-3 py-2">
                  <span className="size-2 rounded-full bg-emerald-500" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-xs font-semibold text-foreground">{name}</span>
                    <span className="block text-[11px] text-muted-foreground">{distance} · {eta} away</span>
                  </span>
                </div>
              ))}
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              Waiting for one of these drivers to accept. No driver is assigned yet.
            </p>
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-border/60 pt-3 text-xs text-muted-foreground">
            <span>Ride ID: <strong>{activeRide?.rideId ?? "JF10248"}</strong> · Fare: <strong>₹{activeRide?.fare ?? selectedFare}</strong></span>
            <Button size="sm" variant="ghost" onClick={cancelRide}>
              Cancel request
            </Button>
          </div>
        </div>
      ) : null}

      {isAssigned ? (
        <div className="mt-5 rounded-lg border border-primary/30 bg-primary/5 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="eyebrow text-primary">Driver assigned</p>
              <h3 className="mt-1 font-display text-2xl font-semibold">Arun is on the way.</h3>
            </div>
            <span className="status-badge">4 min away</span>
          </div>
          <div className="mt-4 flex flex-col gap-3 rounded-lg border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <span className="grid size-12 place-items-center bg-secondary font-semibold text-primary">AK</span>
              <div>
                <p className="font-semibold">Arun Kumar <span className="text-xs text-accent">★ 4.9</span></p>
                <p className="text-xs text-muted-foreground">Hyundai Grand i10 · TN 01 AB 1234</p>
              </div>
            </div>
            <div className="text-sm">
              <span className="block text-xs text-muted-foreground">Share PIN with driver:</span>
              <span className="font-mono text-xl font-bold tracking-widest text-primary">{activeRide.pin}</span>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button size="sm" variant="outline" onClick={() => openCall("customer")}>
              <Phone className="mr-1 size-3.5" /> Call driver
            </Button>
            <Button size="sm" variant="outline" asChild>
              <Link to="/customer/book">Open ride details & chat</Link>
            </Button>
          </div>
        </div>
      ) : null}

      {isArrived ? (
        <div className="mt-5 rounded-lg border border-emerald-500/40 bg-emerald-500/10 p-5">
          <div className="flex items-center gap-3">
            <span className="size-3 animate-ping rounded-full bg-emerald-500" />
            <h3 className="font-display text-xl font-semibold text-emerald-900 dark:text-emerald-200">
              Your driver has arrived!
            </h3>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            Arun Kumar is waiting at your pickup point. Share your Trip PIN: <strong className="font-mono text-foreground text-base">{activeRide.pin}</strong>
          </p>
          <div className="mt-4 flex gap-2">
            <Button size="sm" variant="outline" onClick={() => openCall("customer")}>
              <Phone className="mr-1 size-3.5" /> Call driver
            </Button>
          </div>
        </div>
      ) : null}

      {isStarted ? (
        <div className="mt-5 rounded-lg border border-primary/30 bg-primary/5 p-5">
          <div className="flex items-center gap-3">
            <span className="size-3 animate-pulse rounded-full bg-primary" />
            <h3 className="font-display text-xl font-semibold text-primary">Ride in progress</h3>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            Heading to <strong className="text-foreground">{activeRide.destination}</strong>. Estimated trip time: {activeRide.duration}.
          </p>
          <div className="mt-3 text-xs text-muted-foreground border-t border-border/60 pt-3">
            Driver: Arun Kumar · Vehicle: Hyundai Grand i10 · Fare: ₹{activeRide.fare}
          </div>
        </div>
      ) : null}

      {isCompleted ? (
        <div className="mt-5 rounded-lg border border-emerald-500/40 bg-emerald-500/10 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="eyebrow text-emerald-600 dark:text-emerald-400">Completed</p>
              <h3 className="mt-1 font-display text-2xl font-semibold text-foreground">
                You’ve reached your destination.
              </h3>
            </div>
            <span className="font-display text-3xl font-semibold">₹{activeRide.fare}</span>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            Your trip from {activeRide.pickup} to {activeRide.destination} has finished.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Button onClick={resetDemo}>Book another ride</Button>
            <Button variant="outline" asChild>
              <Link to="/customer/trips">Rate & view receipts</Link>
            </Button>
          </div>
        </div>
      ) : null}
    </AppShell>
  );
}

export function CustomerBook() {
  const {
    pickup,
    setPickup,
    destination,
    setDestination,
    vehicle,
    setVehicle,
    payment,
    setPayment,
    rideStatus,
    setRideStatus,
    activeRide,
    bookRide,
    openCall,
    showToast,
  } = useDemo();
  const [step, setStep] = useState(1);
  const [share, setShare] = useState(false);
  const selected = vehicles.find((item) => item.name === vehicle) ?? vehicles[2];
  const statusCopy: Record<RideStatus, string> = {
    idle: "Choose your route to begin.",
    searching: "Finding a driver near you…",
    assigned: "Arun Kumar is on the way.",
    arrived: "Your driver has arrived.",
    in_progress: "Ride in progress.",
    completed: "You’ve reached your destination.",
  };
  return (
    <AppShell kind="customer">
      <SectionHeading
        eyebrow="Book a ride"
        title="A clear ride, step by step."
        copy="Pickup → drop → route → vehicle → fare → payment → confirm."
      />
      <div className="mb-5 grid grid-cols-4 gap-1 sm:grid-cols-7">
        {["Pickup", "Drop", "Route", "Vehicle", "Fare", "Payment", "Confirm"].map(
          (label, index) => (
            <button
              key={label}
              type="button"
              onClick={() => setStep(index + 1)}
              className={`border-b-2 px-1 py-3 text-[10px] font-semibold uppercase tracking-wider ${step === index + 1 ? "border-primary text-primary" : "border-border text-muted-foreground"}`}
            >
              {index + 1}. {label}
            </button>
          ),
        )}
      </div>
      <div className="grid gap-5 xl:grid-cols-[1fr_410px]">
        <MapPanel
          label={rideStatus === "idle" ? "Route preview" : statusCopy[rideStatus]}
          markers={rideStatus === "assigned" ? 5 : 2}
        />
        <div className="space-y-4">
          {step <= 2 ? (
            <div className="soft-panel space-y-4 p-5">
              <LocationSearchField
                label="Pickup location"
                value={pickup}
                onSelect={(location) => setPickup(`${location.name}, ${location.city}`)}
                placeholder="Search pickup location"
              />
              <div className="flex flex-wrap gap-2">
                {["T Nagar", "Current location", "Main Gate"].map((item) => (
                  <Button
                    key={item}
                    variant="secondary"
                    size="sm"
                    onClick={() =>
                      setPickup(
                        item === "Current location"
                          ? "Current location, Chennai"
                          : `${item}, Chennai`,
                      )
                    }
                  >
                    {item}
                  </Button>
                ))}
              </div>
              <LocationSearchField
                label="Where are you going?"
                value={destination}
                onSelect={(location) => setDestination(`${location.name}, ${location.city}`)}
                placeholder="Search any city, street, or landmark"
                icon={<Search className="size-4" />}
              />
              <div className="grid grid-cols-2 gap-2">
                {places.slice(0, 8).map((place) => (
                  <Button
                    key={place}
                    variant="outline"
                    className="justify-start text-xs"
                    onClick={() => setDestination(place)}
                  >
                    {place}
                  </Button>
                ))}
              </div>
              <Button
                className="w-full"
                disabled={!pickup || !destination}
                onClick={() => setStep(3)}
              >
                See route <ArrowRight />
              </Button>
            </div>
          ) : null}
          {step >= 3 && step < 4 ? (
            <div className="soft-panel p-5">
              <p className="eyebrow">Route</p>
              <h2 className="mt-2 font-display text-2xl font-semibold">
                {pickup || "T Nagar"} → {destination || "Chennai Airport"}
              </h2>
              <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                <div className="bg-secondary p-3">
                  <Clock3 className="mx-auto size-4 text-primary" />
                  <p className="mt-1 font-semibold">34 min</p>
                  <p className="text-xs text-muted-foreground">Light traffic</p>
                </div>
                <div className="bg-secondary p-3">
                  <MapPin className="mx-auto size-4 text-primary" />
                  <p className="mt-1 font-semibold">12.8 km</p>
                  <p className="text-xs text-muted-foreground">Best route</p>
                </div>
                <div className="bg-secondary p-3">
                  <ShieldAlert className="mx-auto size-4 text-primary" />
                  <p className="mt-1 font-semibold">₹0</p>
                  <p className="text-xs text-muted-foreground">Extra charges</p>
                </div>
              </div>
              <Button className="mt-5 w-full" onClick={() => setStep(4)}>
                Choose vehicle
              </Button>
            </div>
          ) : null}
          {step === 4 ? (
            <VehiclePicker selected={vehicle} onChange={setVehicle} onContinue={() => setStep(5)} />
          ) : null}
          {step === 5 ? (
            <FareCard vehicle={selected.name} fare={selected.fare} onContinue={() => setStep(6)} />
          ) : null}
          {step === 6 ? (
            <div className="soft-panel p-5">
              <p className="eyebrow">Payment</p>
              <h2 className="mt-2 font-display text-2xl font-semibold">
                How would you like to pay?
              </h2>
              <div className="mt-4 space-y-2">
                {["UPI", "Card", "Cash"].map((method) => (
                  <label
                    key={method}
                    className={`flex items-center gap-3 border p-3 ${payment === method ? "border-primary bg-primary/5" : "border-border"}`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={payment === method}
                      onChange={() => setPayment(method)}
                      className="accent-primary"
                    />{" "}
                    <span className="font-medium">{method}</span>
                    <span className="ml-auto text-xs text-muted-foreground">
                      {method === "UPI"
                        ? "priya@upi"
                        : method === "Card"
                          ? "•••• 4242"
                          : "Pay after ride"}
                    </span>
                  </label>
                ))}
              </div>
              <Button variant="outline" className="mt-4 w-full">
                <Plus /> Add payment method
              </Button>
              <Button className="mt-2 w-full" onClick={() => setStep(7)}>
                Review booking
              </Button>
            </div>
          ) : null}
          {step === 7 ? (
            <div className="soft-panel p-5">
              <p className="eyebrow">Confirm booking</p>
              <h2 className="mt-2 font-display text-2xl font-semibold">Ready for your ride?</h2>
              <div className="mt-4 space-y-3 text-sm">
                <Summary label="Pickup" value={pickup || demoRide.pickup} />
                <Summary label="Drop" value={destination || demoRide.destination} />
                <Summary label="Vehicle" value={selected.name} />
                <Summary label="Payment" value={payment} />
                <Summary label="Your fare" value={`₹${selected.fare}`} />
              </div>
              <label className="mt-5 flex items-start gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={share}
                  onChange={(event) => setShare(event.target.checked)}
                  className="mt-0.5 size-4 accent-primary"
                />{" "}
                Share this ride with my emergency contact
              </label>
              <Button
                className="mt-5 w-full"
                onClick={() => {
                  bookRide({
                    pickup: pickup || "T Nagar, Chennai",
                    destination: destination || "Chennai Airport",
                    vehicle: selected.name,
                    fare: selected.fare,
                    paymentMethod: payment || "Cash",
                  });
                  showToast("Ride booked successfully. Finding a driver near you…");
                }}
              >
                Confirm ride
              </Button>
            </div>
          ) : null}
          {rideStatus !== "idle" && rideStatus !== "IDLE" && activeRide ? (
            <div className="border border-primary/30 bg-primary/5 p-4 rounded-lg">
              <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                <span className="size-2 animate-pulse rounded-full bg-primary" />
                {rideStatus === "SEARCHING_DRIVER" || rideStatus === "searching"
                  ? "Finding a driver near you…"
                  : rideStatus === "DRIVER_ASSIGNED" || rideStatus === "assigned"
                    ? "Arun Kumar is on the way."
                    : rideStatus === "DRIVER_ARRIVED" || rideStatus === "arrived"
                      ? "Your driver has arrived."
                      : rideStatus === "RIDE_STARTED" || rideStatus === "in_progress" || rideStatus === "PIN_VERIFIED"
                        ? "Ride in progress."
                        : "You’ve reached your destination."}
              </div>
              {rideStatus === "searching" || rideStatus === "SEARCHING_DRIVER" ? (
                <div className="mt-3 text-xs text-muted-foreground">
                  Your ride request is broadcasting to nearby drivers. Switch to the Driver app to accept.
                </div>
              ) : null}
              {rideStatus === "assigned" || rideStatus === "DRIVER_ASSIGNED" ? (
                <AssignedCard onAction={() => {}} />
              ) : null}
              {rideStatus === "arrived" || rideStatus === "DRIVER_ARRIVED" ? (
                <div className="mt-3 border border-emerald-500/30 bg-card p-3 rounded text-xs text-muted-foreground">
                  Driver has arrived at pickup. Please tell your driver the Trip PIN: <strong className="font-mono text-primary text-sm font-bold">{activeRide.pin}</strong>
                </div>
              ) : null}
              {rideStatus === "in_progress" || rideStatus === "RIDE_STARTED" || rideStatus === "PIN_VERIFIED" ? (
                <div className="mt-3 text-xs text-muted-foreground">
                  Ride currently in progress to {activeRide.destination}. Driver is monitoring route.
                </div>
              ) : null}
              {rideStatus === "completed" || rideStatus === "RIDE_COMPLETED" ? (
                <Button className="mt-3 w-full" asChild>
                  <Link to="/customer/trips">Rate and view receipt</Link>
                </Button>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </AppShell>
  );
}
function VehiclePicker({
  selected,
  onChange,
  onContinue,
}: {
  selected: string;
  onChange: (value: string) => void;
  onContinue: () => void;
}) {
  return (
    <div className="soft-panel p-5">
      <p className="eyebrow">Vehicle</p>
      <h2 className="mt-2 font-display text-2xl font-semibold">What suits your ride?</h2>
      <div className="mt-4 space-y-2">
        {vehicles.slice(1).map((item) => (
          <button
            type="button"
            key={item.name}
            onClick={() => onChange(item.name)}
            className={`flex w-full items-center gap-3 border p-3 text-left ${selected === item.name ? "border-primary bg-primary/5" : "border-border"}`}
          >
            <span className="text-primary">▰</span>
            <span className="flex-1">
              <span className="block font-semibold">{item.name}</span>
              <span className="text-xs text-muted-foreground">
                {item.seats} · {item.eta}
              </span>
            </span>
            <span className="font-semibold">₹{item.fare}</span>
          </button>
        ))}
      </div>
      <Button className="mt-4 w-full" onClick={onContinue}>
        Continue
      </Button>
    </div>
  );
}
function FareCard({
  vehicle,
  fare,
  onContinue,
}: {
  vehicle: string;
  fare: number;
  onContinue: () => void;
}) {
  return (
    <div className="soft-panel p-5">
      <p className="eyebrow">Fare transparency</p>
      <div className="mt-2 flex items-end justify-between">
        <h2 className="font-display text-2xl font-semibold">Your fare</h2>
        <span className="font-display text-3xl font-semibold text-primary">₹{fare}</span>
      </div>
      <div className="mt-5 space-y-3 text-sm">
        <Summary label="Base fare" value="₹90" />
        <Summary label="Distance · 12.8 km" value="₹118" />
        <Summary label="Time · 34 min" value="₹60" />
        <Summary label="Discount" value="−₹20" />
        <Summary label="Extra charges" value="₹0" />
      </div>
      <div className="mt-4 border-t border-border pt-4 text-xs font-semibold text-primary">
        ✓ Fare shown before booking · No water charge · No bargaining
      </div>
      <Button className="mt-4 w-full" onClick={onContinue}>
        Choose payment
      </Button>
    </div>
  );
}
function Summary({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
function AssignedCard({ onAction }: { onAction?: () => void }) {
  const { activeRide, addMessage, openCall, showToast } = useDemo();
  return (
    <div className="mt-3 border border-border bg-card p-4 rounded-lg">
      <div className="flex items-center gap-3">
        <span className="grid size-11 place-items-center bg-secondary font-semibold text-primary">
          AK
        </span>
        <div className="flex-1">
          <p className="font-semibold">
            {activeRide?.driver ?? "Arun Kumar"} <span className="text-xs text-accent">★ 4.9</span>
          </p>
          <p className="text-xs text-muted-foreground">
            {activeRide?.vehicle ?? "Hyundai Grand i10"} · {activeRide?.registration ?? "TN 01 AB 1234"}
          </p>
        </div>
        <span className="status-badge">4 min away</span>
      </div>
      <p className="mt-3 text-sm">
        Trip PIN <strong className="font-mono text-primary text-base">{activeRide?.pin ?? "4821"}</strong> · Verified driver
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <Button size="sm" variant="outline" onClick={() => openCall("customer")}>
          <Phone className="mr-1 size-3.5" /> Call
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            addMessage("I’m at the pickup point.");
            showToast("Message sent to driver");
          }}
        >
          <MessageCircle className="mr-1 size-3.5" /> Chat
        </Button>
        <Button size="sm" variant="outline" onClick={() => showToast("Share link copied to clipboard")}>
          Share
        </Button>
      </div>
    </div>
  );
}

export function CustomerTrips() {
  const { rideStatus, setRideStatus, showToast } = useDemo();
  const [tab, setTab] = useState("All");
  return (
    <AppShell kind="customer">
      <SectionHeading
        eyebrow="Trips"
        title="Your rides, all in one place."
        action={
          <Button asChild>
            <Link to="/customer/book">Book a ride</Link>
          </Button>
        }
      />
      <Tabs
        options={["All", "Upcoming", "Ongoing", "Completed", "Cancelled"]}
        selected={tab}
        onChange={setTab}
      />
      <div className="mt-5 soft-panel p-5">
        <RideRow
          status={rideStatus === "idle" ? "Completed" : rideStatus.replace("_", " ")}
          action={
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setRideStatus("idle");
                showToast("Ride details opened");
              }}
            >
              View
            </Button>
          }
        />
        <div className="mt-4 flex flex-wrap gap-2">
          <Button
            size="sm"
            onClick={() => {
              showToast("Route prefilled. Ready to book again.");
            }}
          >
            <ArrowRight /> Ride again
          </Button>
          <Button size="sm" variant="outline" onClick={() => showToast("Receipt downloaded")}>
            <Download /> Receipt
          </Button>
        </div>
      </div>
      <div className="mt-5 grid gap-4 md:grid-cols-3">
        <StatCard label="Total rides" value="24" detail="Since joining JOV FLEET" />
        <StatCard
          label="Saved this month"
          value="₹420"
          detail="Clear fares, every time"
          tone="good"
        />
        <StatCard label="Usual ride" value="Airport" detail="6 trips · ₹248 average" />
      </div>
    </AppShell>
  );
}
export function CustomerSchedule() {
  const { showToast } = useDemo();
  const [type, setType] = useState("One way");
  return (
    <AppShell kind="customer">
      <SectionHeading
        eyebrow="Schedule a ride"
        title="Plan ahead, at your pace."
        copy="Your fare stays clear before you confirm."
      />
      <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
        <div className="soft-panel p-5">
          <div className="grid gap-4 md:grid-cols-2">
            <Field
              label="Pickup"
              value="T Nagar, Chennai"
              onChange={() => undefined}
              placeholder="Choose pickup"
            />
            <Field
              label="Drop"
              value="Chennai Airport"
              onChange={() => undefined}
              placeholder="Where to?"
            />
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <label>
              <span className="eyebrow mb-2 block">Date</span>
              <Input type="date" className="h-12" defaultValue="2026-09-13" />
            </label>
            <label>
              <span className="eyebrow mb-2 block">Time</span>
              <Input type="time" className="h-12" defaultValue="06:30" />
            </label>
          </div>
          <p className="eyebrow mt-6">Ride type</p>
          <div className="mt-2 flex gap-2">
            {["One way", "Round trip"].map((item) => (
              <Button
                key={item}
                variant={type === item ? "default" : "outline"}
                onClick={() => setType(item)}
              >
                {item}
              </Button>
            ))}
          </div>
          <div className="mt-5 flex items-center gap-3 border border-border p-3 text-sm">
            <input type="checkbox" className="size-4 accent-primary" defaultChecked /> Notify me
            before pickup
          </div>
          <Button className="mt-5 w-full" onClick={() => showToast("Your ride is scheduled.")}>
            Schedule ride <ArrowRight />
          </Button>
        </div>
        <div className="soft-panel p-5">
          <p className="eyebrow">Upcoming ride</p>
          <h2 className="mt-2 font-display text-2xl font-semibold">Tomorrow · 6:30 AM</h2>
          <p className="mt-3 text-sm text-muted-foreground">T Nagar → Chennai Airport</p>
          <p className="mt-5 font-display text-3xl font-semibold">₹248</p>
          <span className="status-badge mt-2 inline-flex">Mini · {type}</span>
        </div>
      </div>
    </AppShell>
  );
}

export function CustomerOffers() {
  const { showToast } = useDemo();
  const [coupon, setCoupon] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [offerName, setOfferName] = useState("Weekend Special");
  const [offerValue, setOfferValue] = useState("₹75 OFF");
  const [offerRegion, setOfferRegion] = useState("Chennai");

  return (
    <AppShell kind="customer">
      <SectionHeading eyebrow="Offers" title="A little more value in every ride." />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {[
          ["20% OFF", "Airport Special", "Valid until 30 Sep"],
          ["₹75 OFF", "Weekend ride", "For rides above ₹250"],
          ["10% OFF", "New places, same clarity", "For your next 2 rides"],
        ].map(([discount, title, detail]) => (
          <div key={title} className="soft-panel p-5">
            <span className="status-badge">{discount}</span>
            <h2 className="mt-5 font-display text-2xl font-semibold">{title}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{detail}</p>
            <Button
              className="mt-6"
              onClick={() => {
                setCoupon(discount);
                showToast(`${discount} applied to your next ride`);
              }}
            >
              Apply offer
            </Button>
          </div>
        ))}
      </div>
      <div className="mt-6 soft-panel p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="eyebrow">Create offer</p>
            <h2 className="mt-2 font-display text-2xl font-semibold">Launch a new promotion</h2>
          </div>
          <Button variant={isCreating ? "secondary" : "default"} onClick={() => setIsCreating((open) => !open)}>
            {isCreating ? "Close" : "Create offer"}
          </Button>
        </div>
        {isCreating ? (
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            <label>
              <span className="eyebrow mb-2 block">Offer name</span>
              <Input value={offerName} onChange={(event) => setOfferName(event.target.value)} placeholder="Airport bump" />
            </label>
            <label>
              <span className="eyebrow mb-2 block">Offer value</span>
              <Input value={offerValue} onChange={(event) => setOfferValue(event.target.value)} placeholder="₹100 OFF" />
            </label>
            <label>
              <span className="eyebrow mb-2 block">Region</span>
              <Input value={offerRegion} onChange={(event) => setOfferRegion(event.target.value)} placeholder="All cities" />
            </label>
            <div className="md:col-span-3 flex justify-end">
              <Button
                onClick={() => {
                  setCoupon(offerValue);
                  setOfferName("Weekend Special");
                  setOfferValue("₹75 OFF");
                  setOfferRegion("Chennai");
                  setIsCreating(false);
                  showToast(`${offerName} created and ready to use`);
                }}
              >
                Save offer
              </Button>
            </div>
          </div>
        ) : null}
      </div>
      <div className="mt-6 flex max-w-xl gap-2">
        <Input
          value={coupon}
          onChange={(event) => setCoupon(event.target.value)}
          placeholder="Have a coupon code?"
        />
        <Button
          variant="outline"
          onClick={() => showToast(coupon ? "Coupon applied" : "Enter a coupon first")}
        >
          Apply
        </Button>
      </div>
    </AppShell>
  );
}
export function CustomerWallet() {
  const { showToast } = useDemo();
  const [amount, setAmount] = useState("₹250");
  return (
    <AppShell kind="customer">
      <SectionHeading eyebrow="Wallet" title="Your money, easy to see." />
      <div className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="soft-panel bg-primary p-6 text-primary-foreground">
          <p className="eyebrow text-primary-foreground/70">Available balance</p>
          <p className="mt-2 font-display text-5xl font-semibold">₹1,250</p>
          <Button
            className="mt-8 bg-primary-foreground text-primary hover:bg-primary-foreground/90"
            onClick={() => showToast(`${amount} added to wallet`)}
          >
            <Plus /> Add money
          </Button>
        </div>
        <div className="soft-panel p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl font-semibold">Add money</h2>
            <span className="text-xs text-muted-foreground">Demo only</span>
          </div>
          <div className="mt-4 grid grid-cols-4 gap-2">
            {["₹100", "₹250", "₹500", "₹1,000"].map((item) => (
              <Button
                key={item}
                variant={amount === item ? "default" : "outline"}
                onClick={() => setAmount(item)}
              >
                {item}
              </Button>
            ))}
          </div>
          <label className="mt-4 block">
            <span className="eyebrow mb-2 block">Custom amount</span>
            <Input
              placeholder="₹ Enter amount"
              onChange={(event) => setAmount(`₹${event.target.value}`)}
            />
          </label>
          <h2 className="mt-8 font-display text-xl font-semibold">Recent transactions</h2>
          <div className="mt-3">
            <Summary label="Ride JF10247 · Today" value="−₹182" />
            <Summary label="Wallet top-up · Yesterday" value="+₹500" />
            <Summary label="Ride JF10243 · 08 Sep" value="−₹248" />
          </div>
        </div>
      </div>
    </AppShell>
  );
}
export function CustomerAccount() {
  const { showToast } = useDemo();
  const [language, setLanguage] = useState("English");
  const links = [
    ["Personal details", "Priya Sharma · +91 98765 43210"],
    ["Saved places", "Home · Work · Airport"],
    ["Payment methods", "UPI · Card · Cash"],
    ["Emergency contacts", "Ravi Sharma · automatically shared"],
    ["Notifications", "Ride updates enabled"],
    ["Help & Support", "Need a hand?"],
  ];
  return (
    <AppShell kind="customer">
      <SectionHeading eyebrow="Account" title="Make JOV FLEET yours." />
      <div className="grid gap-5 lg:grid-cols-[0.75fr_1.25fr]">
        <div className="soft-panel p-6">
          <div className="flex items-center gap-4">
            <span className="grid size-16 place-items-center bg-secondary font-display text-2xl font-semibold text-primary">
              P
            </span>
            <div>
              <h2 className="font-display text-2xl font-semibold">Priya Sharma</h2>
              <p className="text-sm text-muted-foreground">Member since June 2026</p>
            </div>
          </div>
          <label className="mt-8 block">
            <span className="eyebrow mb-2 block">Language</span>
            <select
              value={language}
              onChange={(event) => {
                setLanguage(event.target.value);
                showToast(`Language changed to ${event.target.value}`);
              }}
              className="h-11 w-full border border-input bg-background px-3 text-sm"
            >
              <option>English</option>
              <option>தமிழ்</option>
              <option>हिन्दी</option>
              <option>ಕನ್ನಡ</option>
              <option>తెలుగు</option>
            </select>
          </label>
        </div>
        <div className="soft-panel divide-y divide-border">
          {links.map(([title, detail]) => (
            <button
              key={title}
              type="button"
              onClick={() => showToast(`${title} opened`)}
              className="flex w-full items-center gap-4 p-4 text-left hover:bg-secondary"
            >
              <span className="grid size-9 place-items-center bg-secondary text-primary">○</span>
              <span className="flex-1">
                <span className="block font-semibold">{title}</span>
                <span className="text-xs text-muted-foreground">{detail}</span>
              </span>
              <ArrowRight className="size-4 text-muted-foreground" />
            </button>
          ))}
          <button
            type="button"
            onClick={() => showToast("You are logged out of the demo")}
            className="flex w-full items-center gap-4 p-4 text-left text-destructive hover:bg-destructive/5"
          >
            <span className="grid size-9 place-items-center bg-destructive/10">↗</span>
            <span className="font-semibold">Log out</span>
          </button>
        </div>
      </div>
    </AppShell>
  );
}
export function CustomerSupport() {
  const { showToast } = useDemo();
  const [category, setCategory] = useState("My ride");
  const [message, setMessage] = useState("");
  return (
    <AppShell kind="customer">
      <SectionHeading
        eyebrow="Support"
        title="How can we help?"
        copy="A real person’s tone, even in a demo."
      />
      <div className="grid gap-5 lg:grid-cols-[0.7fr_1.3fr]">
        <div className="soft-panel p-5">
          <div className="grid grid-cols-2 gap-2">
            {[
              "My ride",
              "My driver",
              "Fare",
              "Payment",
              "Cancellation",
              "Lost item",
              "Safety",
              "Account",
            ].map((item) => (
              <Button
                key={item}
                variant={category === item ? "default" : "outline"}
                className="justify-start"
                onClick={() => setCategory(item)}
              >
                {item}
              </Button>
            ))}
          </div>
        </div>
        <div className="soft-panel p-5">
          <p className="eyebrow">New ticket · {category}</p>
          <h2 className="mt-2 font-display text-2xl font-semibold">Tell us what happened.</h2>
          <Textarea
            className="mt-5 min-h-32"
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder="Write a message for the support team"
          />
          <Button
            className="mt-4"
            onClick={() => {
              setMessage("");
              showToast("Your support ticket is open");
            }}
          >
            Create ticket <Send />
          </Button>
          <div className="mt-8 border-t border-border pt-5">
            <div className="flex items-center justify-between">
              <p className="font-semibold">Ticket #JF-2048</p>
              <RideStatusBadge status="In progress" />
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              We’ll keep the conversation here. Last reply: “We’re looking into this for you.”
            </p>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

export function DriverHome() {
  const {
    driverOnline,
    setDriverOnline,
    rideStatus,
    activeRide,
    acceptRide,
    declineRide,
    bookRide,
    showToast,
  } = useDemo();
  const [driverLanguage, setDriverLanguage] = useState("English");
  const [voiceReady, setVoiceReady] = useState(true);

  const isCancelled =
    Boolean(activeRide && (activeRide.status === "CANCELLED" || rideStatus === "CANCELLED"));

  const isSearching =
    activeRide &&
    (activeRide.status === "SEARCHING_DRIVER" ||
      activeRide.status === "searching" ||
      rideStatus === "SEARCHING_DRIVER" ||
      rideStatus === "searching");
  const hasRideRequest = Boolean(isSearching) && !isCancelled;

  const hasActiveJob =
    !isCancelled &&
    Boolean(
      activeRide &&
        (activeRide.status === "DRIVER_ASSIGNED" ||
          activeRide.status === "assigned" ||
          activeRide.status === "DRIVER_ARRIVING" ||
          activeRide.status === "DRIVER_ARRIVED" ||
          activeRide.status === "arrived" ||
          activeRide.status === "PIN_VERIFIED" ||
          activeRide.status === "RIDE_STARTED" ||
          activeRide.status === "in_progress" ||
          activeRide.status === "RIDE_COMPLETED" ||
          activeRide.status === "completed" ||
          rideStatus === "DRIVER_ASSIGNED" ||
          rideStatus === "assigned" ||
          rideStatus === "DRIVER_ARRIVING" ||
          rideStatus === "DRIVER_ARRIVED" ||
          rideStatus === "arrived" ||
          rideStatus === "PIN_VERIFIED" ||
          rideStatus === "RIDE_STARTED" ||
          rideStatus === "in_progress" ||
          rideStatus === "RIDE_COMPLETED" ||
          rideStatus === "completed"),
    );

  const [countdown, setCountdown] = useState(30);

  useEffect(() => {
    if (!hasRideRequest) {
      setCountdown(30);
      return;
    }
    const interval = setInterval(() => {
      setCountdown((c) => (c > 0 ? c - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [hasRideRequest]);

  return (
    <AppShell kind="driver">
      <SectionHeading
        eyebrow="Driver home"
        title="Good evening, Arun."
        copy="Drive more. Earn fairly."
        action={
          <Button
            variant={driverOnline ? "secondary" : "default"}
            onClick={() => {
              if (driverOnline) {
                if (window.confirm("Go offline?")) {
                  setDriverOnline(false);
                  showToast("You are offline");
                }
                return;
              }
              setDriverOnline(true);
              showToast("You are online");
            }}
          >
            {driverOnline ? "GO OFFLINE" : "GO ONLINE"}
          </Button>
        }
      />
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Today" value="₹1,840" detail="+₹220 from yesterday" tone="good" />
        <StatCard label="Trips" value="8" detail="6h 20m online" />
        <StatCard label="Average" value="₹290/hr" detail="Your best this week" />
      </div>
      <div className="mt-5 grid gap-5 xl:grid-cols-[1fr_390px]">
        <MapPanel
          label={driverOnline ? "Online · Demand nearby" : "Offline · Go online to receive rides"}
          markers={driverOnline ? 6 : 1}
        />
        <div className="soft-panel p-5">
          <div className="mb-4 rounded-xl border border-border bg-secondary/40 p-3">
            <div className="flex items-center justify-between gap-3">
              <label className="block flex-1">
                <span className="eyebrow mb-2 block">Driver language</span>
                <select
                  value={driverLanguage}
                  onChange={(event) => {
                    setDriverLanguage(event.target.value);
                    showToast(`Language changed to ${event.target.value}`);
                  }}
                  className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                >
                  <option>English</option>
                </select>
              </label>
              <button
                type="button"
                onClick={() => setVoiceReady(!voiceReady)}
                className={`mt-6 inline-flex items-center gap-2 rounded-md border px-4 py-2 text-xs font-semibold transition ${
                  voiceReady
                    ? "border-emerald-500 bg-emerald-600 text-white"
                    : "border-border bg-background text-foreground hover:bg-secondary"
                }`}
              >
                <span className="size-2 rounded-full bg-current" />
                {voiceReady ? "Voice ready" : "Voice off"}
              </button>
            </div>
          </div>
          {isCancelled && activeRide ? (
            <div className="animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div>
                  <p className="eyebrow text-primary">Ride cancelled</p>
                  <h2 className="mt-1 font-display text-2xl font-semibold">Customer cancelled the trip</h2>
                </div>
                <span className="status-badge">Cancelled</span>
              </div>
              <div className="mt-4 space-y-2.5 text-sm">
                <Summary label="Customer" value={activeRide.customer ?? "Priya"} />
                <Summary label="Pickup" value={activeRide.pickup || "Guindy Metro, Chennai"} />
                <Summary label="Dropoff" value={activeRide.destination || "Pondy Bazaar, T. Nagar"} />
                <Summary label="Trip ID" value={activeRide.rideId ?? "JF10248"} />
              </div>
              <div className="mt-5">
                <Button className="w-full" variant="outline" onClick={declineRide}>
                  Clear cancelled request
                </Button>
              </div>
            </div>
          ) : hasRideRequest && activeRide ? (
            <div className="animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div>
                  <p className="eyebrow text-primary">New ride request</p>
                  <h2 className="mt-1 font-display text-2xl font-semibold">{activeRide.distance || "2.1 km"} away</h2>
                </div>
                <div className="text-right">
                  <span className="font-mono text-sm font-bold text-accent">
                    00:{countdown < 10 ? `0${countdown}` : countdown}
                  </span>
                  <span className="block text-[10px] uppercase tracking-wider text-muted-foreground">ETA</span>
                </div>
              </div>
              <div className="mt-4 space-y-2.5 text-sm">
                <Summary label="Customer" value={activeRide.customer ?? "Priya"} />
                <Summary label="Pickup" value={activeRide.pickup || "Guindy Metro, Chennai"} />
                <Summary label="Dropoff" value={activeRide.destination || "Pondy Bazaar, T. Nagar"} />
                <Summary label="Distance · Time" value={`${activeRide.distance || "6.4 km"} · ${activeRide.duration || "18 min"}`} />
                <Summary label="Payment" value={activeRide.paymentMethod || "Cash"} />
                <Summary label="Fare" value={`₹${activeRide.fare || 248}`} />
                <div className="border-t border-border pt-2">
                  <Summary label="Your earnings" value={`₹${activeRide.driverEarnings || 228}`} highlight />
                </div>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    declineRide();
                  }}
                >
                  Decline
                </Button>
                <Button
                  className="bg-emerald-600 text-white hover:bg-emerald-700 font-bold shadow-md"
                  size="lg"
                  onClick={() => {
                    acceptRide("Arun Kumar");
                  }}
                >
                  Accept
                </Button>
              </div>
            </div>
          ) : hasActiveJob && activeRide ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div>
                  <p className="eyebrow text-primary">செயலில் உள்ள பயணம்</p>
                  <h2 className="mt-1 font-display text-2xl font-semibold">{activeRide.customer ?? "Priya"}</h2>
                </div>
                <RideStatusBadge status={rideStatus} />
              </div>
              <div className="space-y-2 text-sm">
                <Summary label="இங்கிருந்து" value={activeRide.pickup} />
                <Summary label="இங்கேக்கு" value={activeRide.destination} />
                <Summary label="பயண PIN" value={activeRide.pin} highlight />
                <Summary label="உங்கள் வருவாய்" value={`₹${activeRide.driverEarnings}`} highlight />
              </div>
              <div className="rounded-lg bg-secondary/60 p-3 text-xs text-muted-foreground">
                பயணம் நடைபெறுகிறது. PIN-ஐ சரிபார்க்க அல்லது முடிக்க கீழே செல்லுங்கள்.
              </div>
            </div>
          ) : driverOnline ? (
            <div className="py-6 text-center">
              <div className="mx-auto grid size-14 place-items-center rounded-full bg-secondary text-2xl text-primary animate-pulse">
                ◎
              </div>
              <h2 className="mt-4 font-display text-2xl font-semibold">Waiting for ride requests</h2>
              <p className="mt-2 text-xs text-muted-foreground">
                You’re online. When Priya books a ride in Customer App, it will appear here automatically.
              </p>
              <div className="mt-5 rounded-xl border border-primary/20 bg-primary/5 p-4 text-center">
                <p className="text-[11px] font-semibold text-primary uppercase tracking-wider mb-1">
                  Instant Test Dispatch
                </p>
                <p className="text-xs text-muted-foreground mb-3">
                  Trigger incoming request from Priya Sharma to test the Accept flow:
                </p>
                <Button
                  className="w-full font-semibold shadow-xs"
                  onClick={() => {
                    bookRide({
                      pickup: "Guindy Metro Station, Chennai",
                      destination: "Pondy Bazaar, T. Nagar",
                      vehicle: "Mini",
                      distance: "6.4 km",
                      duration: "18 min",
                      fare: 248,
                      paymentMethod: "Cash",
                    });
                    showToast("Test ride request dispatched from Priya!");
                  }}
                >
                  <Sparkles className="mr-2 size-4 text-amber-300" />
                  Dispatch Demo Ride (Priya · ₹248)
                </Button>
              </div>
            </div>
          ) : (
            <div className="py-10 text-center">
              <div className="mx-auto grid size-14 place-items-center rounded-full bg-secondary text-2xl text-muted-foreground">◎</div>
              <h2 className="mt-4 font-display text-2xl font-semibold">You’re offline</h2>
              <p className="mt-2 text-sm text-muted-foreground">Go online when you’re ready to receive customer ride requests.</p>
              <Button className="mt-5" onClick={() => setDriverOnline(true)}>Go online</Button>
            </div>
          )}
        </div>
      </div>
      {hasActiveJob ? <DriverRidePanel /> : null}
    </AppShell>
  );
}

function DriverRidePanel() {
  const {
    activeRide,
    rideStatus,
    arriveRide,
    verifyPin,
    startRide,
    completeRide,
    resetDemo,
    openCall,
    showToast,
    messages,
    addMessage,
    cancelRide,
  } = useDemo();
  const [pin, setPin] = useState("");
  const [chat, setChat] = useState("");

  const isAssignedOnly =
    rideStatus === "DRIVER_ASSIGNED" ||
    rideStatus === "assigned" ||
    rideStatus === "DRIVER_ARRIVING";
  const isArrived =
    rideStatus === "DRIVER_ARRIVED" ||
    rideStatus === "arrived" ||
    rideStatus === "PIN_VERIFIED";
  const isStarted = rideStatus === "RIDE_STARTED" || rideStatus === "in_progress";
  const isCompleted = rideStatus === "RIDE_COMPLETED" || rideStatus === "completed";
  const pinValid = pin.trim() === (activeRide?.pin ?? "4821");

  return (
    <div className="mt-5 grid gap-5 lg:grid-cols-2">
      <div className="soft-panel p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="eyebrow text-primary">
              {isCompleted
                ? "Trip completed"
                : isStarted
                  ? "Ride in progress"
                  : isArrived
                    ? "At pickup point"
                    : "Drive to pickup"}
            </p>
            <h2 className="mt-2 font-display text-2xl font-semibold">
              {activeRide?.customer ?? "Priya"} · 4.8 ★
            </h2>
          </div>
          <RideStatusBadge status={rideStatus} />
        </div>

        <p className="mt-4 text-sm text-muted-foreground">
          Pickup: <strong>{activeRide?.pickup ?? "T Nagar"}</strong> → Drop: <strong>{activeRide?.destination ?? "Chennai Airport"}</strong>
        </p>

        {!isCompleted ? (
          <div className="mt-5 flex flex-wrap gap-2">
            <Button
              variant="outline"
              onClick={() =>
                showToast(`Navigating to ${isStarted ? activeRide?.destination : activeRide?.pickup}`)
              }
            >
              Navigate
            </Button>
            <Button variant="outline" onClick={() => openCall("driver")}>
              <Phone className="mr-1 size-3.5" /> Call
            </Button>
            <Button variant="outline" onClick={() => showToast("Chat focused")}>
              <MessageCircle className="mr-1 size-3.5" /> Chat
            </Button>
            <Button variant="destructive" onClick={() => cancelRide()}>
              Cancel ride
            </Button>
          </div>
        ) : null}

        {isAssignedOnly ? (
          <Button className="mt-5 w-full font-semibold" onClick={arriveRide}>
            I’ve arrived
          </Button>
        ) : null}

        {isArrived ? (
          <div className="mt-4 rounded-lg border border-accent/40 bg-accent/5 p-4">
            <p className="font-semibold text-foreground">Enter Trip PIN from customer</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Ask customer for their 4-digit verification PIN (Demo PIN: <strong>4821</strong>)
            </p>
            <Input
              className="mt-3 font-mono text-center text-lg font-bold tracking-widest"
              value={pin}
              maxLength={4}
              onChange={(event) => {
                const val = event.target.value;
                setPin(val);
                if (val.length === 4) {
                  verifyPin(val);
                }
              }}
              placeholder="4-digit PIN"
            />
            <Button
              className="mt-3 w-full font-semibold"
              disabled={!pinValid}
              onClick={startRide}
            >
              Start ride
            </Button>
            {!pinValid && pin.length > 0 ? (
              <p className="mt-1 text-xs text-destructive text-center">Incorrect PIN. Enter 4821.</p>
            ) : null}
          </div>
        ) : null}

        {isStarted ? (
          <Button
            className="mt-5 w-full bg-emerald-600 font-semibold text-white hover:bg-emerald-700"
            onClick={completeRide}
          >
            Complete ride
          </Button>
        ) : null}

        {rideStatus === "CANCELLED" || activeRide?.status === "CANCELLED" ? (
          <div className="mt-4 rounded-lg border border-destructive/40 bg-destructive/5 p-4 text-sm">
            <p className="font-semibold text-foreground">Ride cancelled</p>
            <p className="mt-1 text-muted-foreground">The customer cancelled this ride. Clear it from the demo store.</p>
            <Button className="mt-3 w-full" variant="outline" onClick={cancelRide}>
              Clear cancelled ride
            </Button>
          </div>
        ) : null}

        {isCompleted ? (
          <div className="mt-4 space-y-3 rounded-lg border border-border bg-card p-4 text-sm">
            <div className="flex justify-between border-b border-border pb-2">
              <span className="text-muted-foreground">Customer paid</span>
              <span className="font-semibold">₹{activeRide?.fare ?? 248}</span>
            </div>
            <div className="flex justify-between border-b border-border pb-2">
              <span className="text-muted-foreground">Your earnings</span>
              <span className="font-semibold text-emerald-600">₹{activeRide?.driverEarnings ?? 228}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Platform fee</span>
              <span className="font-semibold">₹{activeRide?.platformAmount ?? 20}</span>
            </div>
            <Button className="mt-4 w-full font-semibold" onClick={resetDemo}>
              Ready for next ride
            </Button>
          </div>
        ) : null}
      </div>

      <div className="soft-panel p-5">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold">Ride chat</h2>
          <span className="text-xs text-primary">{activeRide?.customer ?? "Priya"} · Online</span>
        </div>
        <div className="mt-4 max-h-60 space-y-2 overflow-y-auto">
          {messages.map((message, index) => (
            <div
              key={`${message}-${index}`}
              className={`max-w-[85%] rounded-md p-3 text-sm ${index % 2 === 0 ? "bg-secondary text-foreground" : "ml-auto bg-primary text-primary-foreground"}`}
            >
              {message}
            </div>
          ))}
        </div>
        <div className="mt-4 flex gap-2">
          <Input
            value={chat}
            onChange={(event) => setChat(event.target.value)}
            placeholder="Type a message…"
            onKeyDown={(event) => {
              if (event.key === "Enter" && chat.trim()) {
                addMessage(chat.trim());
                setChat("");
              }
            }}
          />
          <Button
            size="icon"
            onClick={() => {
              if (chat.trim()) {
                addMessage(chat.trim());
                setChat("");
              }
            }}
            aria-label="Send message"
          >
            <Send className="size-4" />
          </Button>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {[
            "I’m on the way.",
            "I’ll be there shortly.",
            "Please share your landmark.",
            "I’ve arrived.",
          ].map((item) => (
            <Button key={item} size="sm" variant="outline" onClick={() => addMessage(item)}>
              {item}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
export function DriverTrips() {
  const { rideStatus } = useDemo();
  return (
    <AppShell kind="driver">
      <SectionHeading eyebrow="Trips" title="Your day, ride by ride." />
      <Tabs
        options={["Today", "Upcoming", "Completed", "Cancelled"]}
        selected="Today"
        onChange={() => undefined}
      />
      <div className="mt-5 soft-panel p-5">
        <RideRow status={rideStatus === "idle" ? "Completed" : rideStatus.replace("_", " ")} />
        <RideRow status="Completed" />
        <RideRow status="Completed" />
      </div>
    </AppShell>
  );
}
export function DriverEarnings() {
  const { showToast } = useDemo();
  return (
    <AppShell kind="driver">
      <SectionHeading
        eyebrow="Earnings"
        title="See what your work is worth."
        action={<Button onClick={() => showToast("Withdrawal request created")}>Withdraw</Button>}
      />
      <Tabs
        options={["Today", "This week", "This month"]}
        selected="Today"
        onChange={() => undefined}
      />
      <div className="mt-5 grid gap-4 sm:grid-cols-4">
        <StatCard label="Gross earnings" value="₹1,840" />
        <StatCard label="Platform amount" value="₹160" detail="Clear every trip" />
        <StatCard label="Incentives" value="₹220" tone="good" />
        <StatCard label="Net earnings" value="₹1,680" />
      </div>
      <div className="mt-5 grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="soft-panel p-5">
          <h2 className="font-display text-xl font-semibold">Weekly earnings</h2>
          <div className="mt-8 flex h-48 items-end gap-3 border-b border-border pb-0">
            {[42, 68, 54, 78, 62, 86, 72].map((height, index) => (
              <div key={index} className="flex flex-1 flex-col items-center gap-2">
                <div
                  className={`w-full ${index === 6 ? "bg-primary" : "bg-secondary"}`}
                  style={{ height: `${height}%` }}
                />
                <span className="text-[10px] text-muted-foreground">
                  {["M", "T", "W", "T", "F", "S", "S"][index]}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="soft-panel p-5">
          <h2 className="font-display text-xl font-semibold">Withdraw to</h2>
          <label className="mt-4 flex items-center gap-3 border border-primary bg-primary/5 p-3">
            <input type="radio" defaultChecked name="withdraw" className="accent-primary" />
            <span className="flex-1">
              <strong>UPI</strong>
              <span className="block text-xs text-muted-foreground">arun@upi</span>
            </span>
            <WalletCards className="size-4 text-primary" />
          </label>
          <label className="mt-2 flex items-center gap-3 border border-border p-3">
            <input type="radio" name="withdraw" className="accent-primary" />
            <span className="flex-1">
              <strong>Bank account</strong>
              <span className="block text-xs text-muted-foreground">•••• 2341</span>
            </span>
            <CreditCard className="size-4 text-primary" />
          </label>
        </div>
      </div>
    </AppShell>
  );
}
export function DriverIncentives() {
  const { showToast } = useDemo();
  return (
    <AppShell kind="driver">
      <SectionHeading eyebrow="Incentives" title="A little extra for going further." />
      <div className="grid gap-4 md:grid-cols-2">
        <div className="soft-panel p-5">
          <div className="flex justify-between">
            <div>
              <p className="eyebrow">Current goal</p>
              <h2 className="mt-2 font-display text-2xl font-semibold">10 rides · ₹150 bonus</h2>
            </div>
            <span className="font-display text-2xl font-semibold text-primary">8/10</span>
          </div>
          <div className="mt-5 h-3 bg-secondary">
            <div className="h-full w-4/5 bg-primary" />
          </div>
          <p className="mt-2 text-xs text-muted-foreground">Two more rides before midnight.</p>
          <Button className="mt-5" onClick={() => showToast("Goal details opened")}>
            View goal
          </Button>
        </div>
        <div className="soft-panel p-5">
          <p className="eyebrow">Next milestone</p>
          <h2 className="mt-2 font-display text-2xl font-semibold">20 rides · ₹350 bonus</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Peak-hour incentive is active from 5–8 PM.
          </p>
          <Button
            variant="outline"
            className="mt-5"
            onClick={() => showToast("Peak-hour details opened")}
          >
            See details
          </Button>
        </div>
      </div>
    </AppShell>
  );
}
export function DriverAccount() {
  const { showToast } = useDemo();
  const { logout } = useAppContext();
  return (
    <AppShell kind="driver">
      <SectionHeading eyebrow="Account" title="Everything about your workday." />
      <div className="grid gap-3 md:grid-cols-2">
        {[
          ["Personal details", "Arun Kumar · +91 98765 43210"],
          ["Vehicle", "Hyundai Grand i10 · TN 01 AB 1234"],
          ["Documents", "4 verified · Insurance expires in 18 days"],
          ["Bank / UPI", "UPI ending in 4821"],
          ["Safety", "Emergency support ready"],
          ["Support", "Open a ticket"],
          ["Settings", "Notifications · Language"],
          ["Log out", "Exit driver demo"],
        ].map(([title, detail]) => (
          title === "Support" ? (
            <Link
              key={title}
              to="/driver/support"
              className="soft-panel flex items-center gap-4 p-5 text-left hover:border-primary/40"
            >
              <span className="grid size-10 place-items-center bg-secondary text-primary">○</span>
              <span className="flex-1">
                <span className="block font-semibold">{title}</span>
                <span className="text-xs text-muted-foreground">{detail}</span>
              </span>
              <ArrowRight className="size-4 text-muted-foreground" />
            </Link>
          ) : (
            <button
              key={title}
              type="button"
              className={`soft-panel flex items-center gap-4 p-5 text-left hover:border-primary/40 ${title === "Log out" ? "text-destructive" : ""}`}
              onClick={async () => {
                if (title === "Log out") {
                  await logout();
                  window.location.href = "/driver/login";
                  return;
                }
                showToast(`${title} opened`);
              }}
            >
              <span className="grid size-10 place-items-center bg-secondary text-primary">○</span>
              <span className="flex-1">
                <span className="block font-semibold">{title}</span>
                <span className="text-xs text-muted-foreground">{detail}</span>
              </span>
              <ArrowRight className="size-4 text-muted-foreground" />
            </button>
          )
        ))}
      </div>
    </AppShell>
  );
}
export function DriverSupport() {
  return (
    <AppShell kind="driver">
      <SectionHeading eyebrow="Support" title="Need a hand on the road?" />
      <CustomerSupportBody title="What can we help with?" />{" "}
    </AppShell>
  );
}
function CustomerSupportBody({ title }: { title: string }) {
  const { showToast } = useDemo();
  const [message, setMessage] = useState("");
  return (
    <div className="soft-panel max-w-2xl p-5">
      <h2 className="font-display text-2xl font-semibold">{title}</h2>
      <div className="mt-4 grid grid-cols-2 gap-2">
        {[
          "Ride issue",
          "Customer",
          "Payment",
          "Vehicle",
          "Documents",
          "Safety",
          "Account",
          "App issue",
        ].map((item) => (
          <Button
            key={item}
            variant="outline"
            className="justify-start"
            onClick={() => showToast(`${item} selected`)}
          >
            {item}
          </Button>
        ))}
      </div>
      <Textarea
        className="mt-5 min-h-28"
        value={message}
        onChange={(event) => setMessage(event.target.value)}
        placeholder="Tell us what happened"
      />
      <Button
        className="mt-4"
        onClick={() => {
          setMessage("");
          showToast("Ticket created. We’ll take a look.");
        }}
      >
        Create ticket <Send />
      </Button>
    </div>
  );
}

const adminRows = [
  {
    id: "JF10248",
    customer: "Priya",
    driver: "Arun Kumar",
    route: "T Nagar → Airport",
    fare: "₹248",
    status: "In progress",
  },
  {
    id: "JF10247",
    customer: "Meera",
    driver: "Siva Raj",
    route: "Anna Nagar → Velachery",
    fare: "₹182",
    status: "Completed",
  },
  {
    id: "JF10246",
    customer: "Karthik",
    driver: "Deepak M",
    route: "Guindy → OMR",
    fare: "₹132",
    status: "Pending",
  },
  {
    id: "JF10245",
    customer: "Anu",
    driver: "Ravi K",
    route: "Adyar → T Nagar",
    fare: "₹156",
    status: "Completed",
  },
];
export function AdminDashboard() {
  return (
    <AdminPage
      title="Operations overview"
      eyebrow="Dashboard"
      copy="A clear view of the city, with the details close at hand."
    >
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Active rides" value="142" detail="+6.2% today" tone="good" />
        <StatCard label="Today’s rides" value="1,284" detail="Across 7 cities" />
        <StatCard label="Gross booking value" value="₹3.84L" detail="+4.1% from yesterday" />
        <StatCard label="Active drivers" value="3,920" detail="2,140 available" />
      </div>
      <div className="mt-5 grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="soft-panel p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl font-semibold">Ride volume</h2>
            <Button size="sm" variant="outline">
              Today <ChevronDown />
            </Button>
          </div>
          <div className="mt-8 flex h-56 items-end gap-2 border-b border-border">
            {[32, 45, 38, 58, 66, 52, 74, 64, 83, 76, 92, 86].map((height, index) => (
              <div key={index} className="flex flex-1 items-end">
                <div className="w-full bg-primary/80" style={{ height: `${height}%` }} />
              </div>
            ))}
          </div>
          <div className="mt-3 flex justify-between text-xs text-muted-foreground">
            <span>6 AM</span>
            <span>Noon</span>
            <span>6 PM</span>
            <span>Now</span>
          </div>
        </div>
        <div className="soft-panel p-5">
          <h2 className="font-display text-xl font-semibold">Needs attention</h2>
          <div className="mt-4 space-y-3">
            <button className="flex w-full items-start gap-3 border border-accent/30 bg-accent/5 p-3 text-left">
              <ShieldAlert className="mt-0.5 size-4 text-accent" />
              <span>
                <strong className="block text-sm">1 SOS active</strong>
                <span className="text-xs text-muted-foreground">
                  Ride JF10248 needs a safety review.
                </span>
              </span>
            </button>
            <button className="flex w-full items-start gap-3 border border-border p-3 text-left">
              <Clock3 className="mt-0.5 size-4 text-primary" />
              <span>
                <strong className="block text-sm">18 documents expiring</strong>
                <span className="text-xs text-muted-foreground">Review before tomorrow.</span>
              </span>
            </button>
          </div>
        </div>
      </div>
      <div className="mt-5">
        <AdminRideTable />
      </div>
    </AdminPage>
  );
}
export function AdminLive() {
  const { activeRide, rideStatus, showToast } = useDemo();

  const getStatusLabel = () => {
    switch (rideStatus) {
      case "SEARCHING_DRIVER":
      case "searching":
        return "Searching driver";
      case "DRIVER_ASSIGNED":
      case "assigned":
      case "DRIVER_ARRIVING":
        return "Driver assigned";
      case "DRIVER_ARRIVED":
      case "arrived":
        return "Driver arrived";
      case "PIN_VERIFIED":
        return "PIN verified";
      case "RIDE_STARTED":
      case "in_progress":
        return "In progress";
      case "RIDE_COMPLETED":
      case "completed":
        return "Completed";
      default:
        return "Idle";
    }
  };

  return (
    <AdminPage
      eyebrow="Live operations"
      title="See the fleet as it moves."
      copy="Click a marker to inspect a ride, a driver, or a safety event."
    >
      <div className="grid gap-5 xl:grid-cols-[1fr_380px]">
        <MapPanel label="142 active rides · 2,140 available drivers" markers={12} />
        <div className="soft-panel p-5">
          <div className="flex items-center justify-between">
            <p className="eyebrow">Selected marker</p>
            <RideStatusBadge status={getStatusLabel()} />
          </div>
          <h2 className="mt-2 font-display text-2xl font-semibold">
            Ride {activeRide?.rideId ?? "JF10248"}
          </h2>
          <div className="mt-5 space-y-3 text-sm">
            <Summary label="Customer" value={activeRide?.customer ?? "Priya"} />
            <Summary label="Driver" value={activeRide?.driver ?? "Unassigned"} />
            <Summary label="Vehicle" value={activeRide?.vehicle ?? "Hyundai Grand i10"} />
            <Summary
              label="Route"
              value={`${activeRide?.pickup ?? "T Nagar"} → ${activeRide?.destination ?? "Airport"}`}
            />
            <Summary
              label="Fare"
              value={`₹${activeRide?.fare ?? 248} · earns ₹${activeRide?.driverEarnings ?? 228}`}
            />
            <Summary label="Status" value={getStatusLabel()} />
          </div>
          <div className="mt-5 grid grid-cols-2 gap-2">
            <Button onClick={() => showToast("Ride detail opened")}>View ride</Button>
            <Button variant="outline" onClick={() => showToast("Safety review assigned")}>
              Safety review
            </Button>
          </div>
        </div>
      </div>
    </AdminPage>
  );
}

function AdminRideTable() {
  const { activeRide, rideStatus } = useDemo();
  const [query, setQuery] = useState("");

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "SEARCHING_DRIVER":
      case "searching":
        return "Searching";
      case "DRIVER_ASSIGNED":
      case "assigned":
      case "DRIVER_ARRIVING":
        return "Assigned";
      case "DRIVER_ARRIVED":
      case "arrived":
        return "Arrived";
      case "PIN_VERIFIED":
        return "PIN verified";
      case "RIDE_STARTED":
      case "in_progress":
        return "In progress";
      case "RIDE_COMPLETED":
      case "completed":
        return "Completed";
      default:
        return "Idle";
    }
  };

  const dynamicRows = activeRide
    ? [
        {
          id: activeRide.rideId,
          customer: activeRide.customer,
          driver: activeRide.driver ?? "Unassigned",
          route: `${activeRide.pickup} → ${activeRide.destination}`,
          fare: `₹${activeRide.fare}`,
          status: getStatusLabel(rideStatus),
        },
        ...adminRows.filter((r) => r.id !== activeRide.rideId),
      ]
    : adminRows;

  const filtered = dynamicRows.filter((row) =>
    Object.values(row).join(" ").toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div className="soft-panel overflow-hidden">
      <div className="flex flex-col gap-3 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="font-display text-xl font-semibold">Recent rides</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="w-full pl-9 sm:w-64"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search rides"
          />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px] text-left text-sm">
          <thead className="bg-secondary text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              {["Ride ID", "Customer", "Driver", "Route", "Fare", "Status"].map((heading) => (
                <th key={heading} className="px-4 py-3 font-semibold">
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((row) => (
              <tr key={row.id} className="border-t border-border">
                <td className="px-4 py-4 font-semibold">{row.id}</td>
                <td className="px-4 py-4">{row.customer}</td>
                <td className="px-4 py-4">{row.driver}</td>
                <td className="px-4 py-4 text-muted-foreground">{row.route}</td>
                <td className="px-4 py-4 font-semibold">{row.fare}</td>
                <td className="px-4 py-4">
                  <RideStatusBadge status={row.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {filtered.length === 0 ? (
        <div className="p-8 text-center text-sm text-muted-foreground">
          No rides match that search.
        </div>
      ) : null}
    </div>
  );
}
export function AdminRides() {
  return (
    <AdminPage
      eyebrow="Ride management"
      title="Every ride, searchable."
      copy="Search, filter, and open the same shared demo ride used across JOV FLEET."
    >
      <AdminRideTable />
    </AdminPage>
  );
}
function AdminPage({
  eyebrow,
  title,
  copy,
  children,
}: {
  eyebrow: string;
  title: string;
  copy?: string;
  children: React.ReactNode;
}) {
  return (
    <AppShell kind="admin" title={title} subtitle={copy}>
      <SectionHeading eyebrow={eyebrow} title={title} copy={copy} />
      {children}
    </AppShell>
  );
}

export function AdminDataPage({
  type,
}: {
  type:
    | "customers"
    | "drivers"
    | "vehicles"
    | "payments"
    | "settlements"
    | "offers"
    | "support"
    | "safety"
    | "fraud"
    | "corporate"
    | "analytics"
    | "notifications"
    | "settings"
    | "pricing";
}) {
  const { showToast } = useDemo();
  const configs: Record<
    typeof type,
    { eyebrow: string; title: string; copy: string; rows: string[][] }
  > = {
    customers: {
      eyebrow: "Customer management",
      title: "Know the people you move.",
      copy: "Search profiles, trips, payments, and support history.",
      rows: [
        ["Priya Sharma", "24 trips", "₹5,480", "Active"],
        ["Meera Krishnan", "18 trips", "₹3,210", "Active"],
        ["Karthik R", "9 trips", "₹1,840", "Review"],
      ],
    },
    drivers: {
      eyebrow: "Driver management",
      title: "Support the people on the road.",
      copy: "Verification, earnings, ratings, and safety in one view.",
      rows: [
        ["Arun Kumar", "4.9 ★", "8 trips today", "Online"],
        ["Siva Raj", "4.8 ★", "12 trips today", "Online"],
        ["Deepak M", "4.7 ★", "5 trips today", "Offline"],
      ],
    },
    vehicles: {
      eyebrow: "Vehicle management",
      title: "A fleet you can trust.",
      copy: "Keep categories, registrations, and status in order.",
      rows: [
        ["Hyundai Grand i10", "Mini · TN 01 AB 1234", "Arun Kumar", "Verified"],
        ["Maruti Suzuki Dzire", "Sedan · TN 09 CD 4521", "Siva Raj", "Verified"],
        ["TVS Auto", "Auto · TN 11 EF 8820", "Deepak M", "Review"],
      ],
    },
    payments: {
      eyebrow: "Payments",
      title: "Follow every rupee.",
      copy: "Successful, pending, failed, and refunded payments.",
      rows: [
        ["JF10248", "Priya", "UPI", "₹248 · Successful"],
        ["JF10247", "Meera", "Card", "₹182 · Successful"],
        ["JF10246", "Karthik", "Cash", "₹132 · Pending"],
      ],
    },
    settlements: {
      eyebrow: "Settlements",
      title: "Payouts without guesswork.",
      copy: "Driver gross, platform share, incentives, and net.",
      rows: [
        ["Arun Kumar", "8 trips", "₹1,680", "Ready"],
        ["Siva Raj", "12 trips", "₹2,410", "Paid"],
        ["Deepak M", "5 trips", "₹920", "Review"],
      ],
    },
    offers: {
      eyebrow: "Offers",
      title: "Make good rides go further.",
      copy: "Create and monitor clear offers for every city.",
      rows: [
        ["Airport Special", "20%", "Chennai", "Active"],
        ["Weekend ride", "₹75", "All cities", "Active"],
        ["Welcome ride", "10%", "New customers", "Draft"],
      ],
    },
    support: {
      eyebrow: "Support",
      title: "Keep help human.",
      copy: "Assign, reply, escalate, and resolve support tickets.",
      rows: [
        ["#JF-2048", "My ride · Priya", "High", "In progress"],
        ["#JF-2047", "Payment · Meera", "Normal", "Open"],
        ["#JF-2046", "Lost item · Karthik", "Normal", "Resolved"],
      ],
    },
    safety: {
      eyebrow: "Safety center",
      title: "Watch the moments that matter.",
      copy: "Review SOS events, route deviations, and incidents.",
      rows: [
        ["SOS Active", "JF10248 · Priya", "Arun Kumar", "Assign"],
        ["Route deviation", "JF10233 · Meera", "Siva Raj", "Investigate"],
        ["Safety review", "JF10214 · Anu", "Ravi K", "Resolved"],
      ],
    },
    fraud: {
      eyebrow: "Fraud & risk",
      title: "Spot the unusual early.",
      copy: "Review signals without losing the human context.",
      rows: [
        ["Coupon abuse", "12 accounts", "High", "Review"],
        ["Repeated cancellations", "Karthik R", "Medium", "Flag"],
        ["GPS anomaly", "JF10211", "Low", "Dismiss"],
      ],
    },
    corporate: {
      eyebrow: "Corporate",
      title: "Move teams with clarity.",
      copy: "Companies, budgets, policies, invoices, and approvals.",
      rows: [
        ["Northstar Labs", "48 employees", "₹84,200 budget", "Active"],
        ["Harbor Health", "22 employees", "₹32,400 budget", "Active"],
        ["Cedar Works", "12 employees", "₹18,600 budget", "Review"],
      ],
    },
    analytics: {
      eyebrow: "Analytics",
      title: "Understand the shape of the city.",
      copy: "Bookings, revenue, retention, ETA, and driver utilisation.",
      rows: [
        ["Bookings", "1,284", "+8.4%", "Today"],
        ["Average fare", "₹286", "+2.1%", "Today"],
        ["Driver utilisation", "74%", "+4.8%", "Today"],
      ],
    },
    notifications: {
      eyebrow: "Notifications",
      title: "Say the right thing at the right time.",
      copy: "Create, preview, schedule, and send updates.",
      rows: [
        ["Driver arriving", "Customers", "Chennai", "Sent"],
        ["Document reminder", "Drivers", "All cities", "Scheduled"],
        ["Weekend offer", "Both", "Chennai", "Draft"],
      ],
    },
    settings: {
      eyebrow: "Settings",
      title: "Shape how JOV FLEET works.",
      copy: "Roles, permissions, cities, pricing, safety, and audit logs.",
      rows: [
        ["Super Admin", "View · Create · Edit · Delete", "All areas", "Enabled"],
        ["Operations", "View · Create · Edit", "Live operations", "Enabled"],
        ["Support", "View · Reply · Resolve", "Support", "Enabled"],
      ],
    },
    pricing: {
      eyebrow: "Pricing",
      title: "Fair fares, made visible.",
      copy: "No water charge. No hidden fee. No random service fee.",
      rows: [
        ["Mini · Chennai", "₹90 base", "₹14/km · ₹2/min", "Saved"],
        ["Sedan · Chennai", "₹110 base", "₹18/km · ₹3/min", "Saved"],
        ["Auto · Chennai", "₹45 base", "₹10/km · ₹1/min", "Saved"],
      ],
    },
  };

  const [rows, setRows] = useState<string[][]>(() => configs[type].rows);
  const [isCreating, setIsCreating] = useState(false);
  const [draft, setDraft] = useState({
    name: "New entry",
    detail: "Freshly created",
    context: "Live operations",
    status: "Active",
  });

  const createFields: Record<
    typeof type,
    { label: string; key: keyof typeof draft; placeholder: string }[]
  > = {
    customers: [
      { label: "Customer name", key: "name", placeholder: "Asha Nair" },
      { label: "Trip info", key: "detail", placeholder: "12 trips" },
      { label: "Balance", key: "context", placeholder: "₹2,400" },
      { label: "Status", key: "status", placeholder: "Active" },
    ],
    drivers: [
      { label: "Driver name", key: "name", placeholder: "Rahul N" },
      { label: "Rating", key: "detail", placeholder: "4.9 ★" },
      { label: "Trips today", key: "context", placeholder: "9 trips today" },
      { label: "Status", key: "status", placeholder: "Online" },
    ],
    vehicles: [
      { label: "Vehicle name", key: "name", placeholder: "Mahindra XUV" },
      { label: "Registration", key: "detail", placeholder: "TN 12 XY 9090" },
      { label: "Assigned to", key: "context", placeholder: "Rahul N" },
      { label: "Status", key: "status", placeholder: "Verified" },
    ],
    payments: [
      { label: "Ride ID", key: "name", placeholder: "JF10249" },
      { label: "Customer", key: "detail", placeholder: "Asha Nair" },
      { label: "Mode", key: "context", placeholder: "UPI" },
      { label: "Status", key: "status", placeholder: "Successful" },
    ],
    settlements: [
      { label: "Driver name", key: "name", placeholder: "Rahul N" },
      { label: "Trips", key: "detail", placeholder: "10 trips" },
      { label: "Net payout", key: "context", placeholder: "₹2,540" },
      { label: "Status", key: "status", placeholder: "Ready" },
    ],
    offers: [
      { label: "Offer name", key: "name", placeholder: "Festival ride" },
      { label: "Value", key: "detail", placeholder: "₹120 OFF" },
      { label: "Region", key: "context", placeholder: "All cities" },
      { label: "Status", key: "status", placeholder: "Active" },
    ],
    support: [
      { label: "Ticket ID", key: "name", placeholder: "#JF-2049" },
      { label: "Topic", key: "detail", placeholder: "My ride · Asha" },
      { label: "Severity", key: "context", placeholder: "Normal" },
      { label: "Status", key: "status", placeholder: "Open" },
    ],
    safety: [
      { label: "Event", key: "name", placeholder: "SOS active" },
      { label: "Ride", key: "detail", placeholder: "JF10249 · Asha" },
      { label: "Driver", key: "context", placeholder: "Rahul N" },
      { label: "Status", key: "status", placeholder: "Assign" },
    ],
    fraud: [
      { label: "Issue", key: "name", placeholder: "Coupon abuse" },
      { label: "Scope", key: "detail", placeholder: "15 accounts" },
      { label: "Severity", key: "context", placeholder: "High" },
      { label: "Status", key: "status", placeholder: "Review" },
    ],
    corporate: [
      { label: "Company", key: "name", placeholder: "Nexa Labs" },
      { label: "Employees", key: "detail", placeholder: "36 employees" },
      { label: "Budget", key: "context", placeholder: "₹56,000 budget" },
      { label: "Status", key: "status", placeholder: "Active" },
    ],
    analytics: [
      { label: "Metric", key: "name", placeholder: "Bookings" },
      { label: "Value", key: "detail", placeholder: "1,420" },
      { label: "Trend", key: "context", placeholder: "+7.9%" },
      { label: "Status", key: "status", placeholder: "Today" },
    ],
    notifications: [
      { label: "Title", key: "name", placeholder: "Driver arriving" },
      { label: "Audience", key: "detail", placeholder: "Customers" },
      { label: "City", key: "context", placeholder: "Chennai" },
      { label: "Status", key: "status", placeholder: "Sent" },
    ],
    settings: [
      { label: "Role", key: "name", placeholder: "Finance" },
      { label: "Permissions", key: "detail", placeholder: "View · Create · Edit" },
      { label: "Scope", key: "context", placeholder: "Payments" },
      { label: "Status", key: "status", placeholder: "Enabled" },
    ],
    pricing: [
      { label: "Category", key: "name", placeholder: "Mini · Chennai" },
      { label: "Base fare", key: "detail", placeholder: "₹95 base" },
      { label: "Rate", key: "context", placeholder: "₹14/km · ₹2/min" },
      { label: "Status", key: "status", placeholder: "Saved" },
    ],
  };

  const resetDraft = () =>
    setDraft({
      name: "New entry",
      detail: "Freshly created",
      context: "Live operations",
      status: "Active",
    });

  const config = configs[type];
  const createLabel =
    type === "settings"
      ? "Add role"
      : type === "notifications"
        ? "Create notification"
        : type === "pricing"
          ? "Add rule"
          : "Add new";

  return (
    <AdminPage eyebrow={config.eyebrow} title={config.title} copy={config.copy}>
      <div className="mb-5 flex flex-wrap gap-2">
        <Input className="max-w-xs" placeholder={`Search ${config.eyebrow.toLowerCase()}`} />
        <Button onClick={() => setIsCreating((value) => !value)}>
          <Plus /> {isCreating ? "Close" : createLabel}
        </Button>
        <Button variant="outline" onClick={() => showToast("Filters opened")}>
          Filters
        </Button>
      </div>
      {isCreating ? (
        <div className="mb-5 soft-panel p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="eyebrow">Create entry</p>
              <h2 className="mt-2 font-display text-2xl font-semibold">Add a new {config.eyebrow.toLowerCase()}</h2>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {createFields[type].map((field) => (
              <label key={field.key}>
                <span className="eyebrow mb-2 block">{field.label}</span>
                <Input
                  value={draft[field.key]}
                  onChange={(event) =>
                    setDraft((current) => ({
                      ...current,
                      [field.key]: event.target.value,
                    }))
                  }
                  placeholder={field.placeholder}
                />
              </label>
            ))}
          </div>
          <div className="mt-5 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsCreating(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                const nextRow = [draft.name, draft.detail, draft.context, draft.status];
                setRows((current) => [nextRow, ...current]);
                resetDraft();
                setIsCreating(false);
                showToast(`${draft.name} created successfully`);
              }}
            >
              Save entry
            </Button>
          </div>
        </div>
      ) : null}
      <div className="soft-panel overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="bg-secondary text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              {["Name / ID", "Details", "Owner / context", "Status", "Action"].map((heading) => (
                <th key={heading} className="px-4 py-3 font-semibold">
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row[0]} className="border-t border-border">
                <td className="px-4 py-4 font-semibold">{row[0]}</td>
                <td className="px-4 py-4 text-muted-foreground">{row[1]}</td>
                <td className="px-4 py-4">{row[2]}</td>
                <td className="px-4 py-4">
                  <RideStatusBadge status={row[3]} />
                </td>
                <td className="px-4 py-4">
                  <Button size="sm" variant="outline" onClick={() => showToast(`${row[0]} opened`)}>
                    View
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminPage>
  );
}
