import { Link, useRouterState } from "@tanstack/react-router";
import { Bell, ChevronLeft, CircleHelp, LogOut, Menu, Settings, X } from "lucide-react";
import { useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { useAppContext } from "@/context/app-context";
import { demoRide, useDemo } from "@/lib/demo-state";

type AppKind = "customer" | "driver" | "admin";

const nav: Record<AppKind, { label: string; to: string; icon: string }[]> = {
  customer: [
    { label: "Home", to: "/customer/home", icon: "⌂" },
    { label: "Trips", to: "/customer/trips", icon: "↗" },
    { label: "Offers", to: "/customer/offers", icon: "%" },
    { label: "Wallet", to: "/customer/wallet", icon: "₹" },
    { label: "Account", to: "/customer/account", icon: "○" },
  ],
  driver: [
    { label: "Home", to: "/driver/home", icon: "⌂" },
    { label: "Trips", to: "/driver/trips", icon: "↗" },
    { label: "Earnings", to: "/driver/earnings", icon: "₹" },
    { label: "Incentives", to: "/driver/incentives", icon: "★" },
    { label: "Account", to: "/driver/account", icon: "○" },
  ],
  admin: [
    { label: "Dashboard", to: "/admin/dashboard", icon: "▦" },
    { label: "Live operations", to: "/admin/live", icon: "◎" },
    { label: "Rides", to: "/admin/rides", icon: "↗" },
    { label: "Customers", to: "/admin/customers", icon: "○" },
    { label: "Drivers", to: "/admin/drivers", icon: "◉" },
    { label: "Vehicles", to: "/admin/vehicles", icon: "▰" },
    { label: "Pricing", to: "/admin/pricing", icon: "₹" },
    { label: "Payments", to: "/admin/payments", icon: "$" },
    { label: "Settlements", to: "/admin/settlements", icon: "≡" },
    { label: "Offers", to: "/admin/offers", icon: "%" },
    { label: "Support", to: "/admin/support", icon: "?" },
    { label: "Safety center", to: "/admin/safety", icon: "!" },
    { label: "Fraud & risk", to: "/admin/fraud", icon: "△" },
    { label: "Corporate", to: "/admin/corporate", icon: "□" },
    { label: "Analytics", to: "/admin/analytics", icon: "⌁" },
    { label: "Notifications", to: "/admin/notifications", icon: "◌" },
    { label: "Settings", to: "/admin/settings", icon: "⚙" },
  ],
};

export function AppShell({
  kind,
  children,
  title,
  subtitle,
}: {
  kind: AppKind;
  children: ReactNode;
  title?: string;
  subtitle?: string;
}) {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAppContext();
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const items = nav[kind];
  const isAdmin = kind === "admin";
  return (
    <div className={`min-h-screen bg-background text-foreground ${isAdmin ? "admin-density" : ""}`}>
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 border-r border-border bg-card p-5 transition-transform lg:translate-x-0 overflow-y-auto ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex items-center justify-between">
          <Link
            to={
              kind === "admin"
                ? "/admin/dashboard"
                : kind === "driver"
                  ? "/driver/home"
                  : "/customer/home"
            }
            className="flex items-center gap-3"
          >
            <span className="brand-mark">J</span>
            <div>
              <p className="font-display text-lg font-semibold">JOV FLEET</p>
              <p className="eyebrow">
                {kind === "customer" ? "Customer" : kind === "driver" ? "Driver" : "Operations"}
              </p>
            </div>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setOpen(false)}
            aria-label="Close navigation"
          >
            <X />
          </Button>
        </div>
        <div className="mt-10 space-y-1">
          {items.map((item) => {
            const isActive = pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to as never}
                onClick={() => setOpen(false)}
                className={`nav-link ${isActive ? "nav-link-active" : ""}`}
              >
                <span className="grid size-6 place-items-center text-sm font-semibold">
                  {item.icon}
                </span>
                {item.label}
              </Link>
            );
          })}
        </div>
        <div className="absolute inset-x-5 bottom-5 border-t border-border pt-4">
          <Link to={`/${kind}/support` as never} className="nav-link">
            <CircleHelp className="size-4" />
            Need a hand?
          </Link>
          <button
            type="button"
            onClick={async () => {
              await logout();
              window.location.href = `/${kind}/login`;
            }}
            className="nav-link flex w-full items-center text-left"
          >
            <LogOut className="size-4" />
            Log out
          </button>
        </div>
      </aside>
      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 border-b border-border bg-background/90 backdrop-blur">
          <div className="flex min-h-16 items-center justify-between px-4 sm:px-8">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setOpen(true)}
                aria-label="Open navigation"
              >
                <Menu />
              </Button>
              <div>
                <p className="font-display text-xl font-semibold">
                  {title ??
                    (kind === "customer"
                      ? `Good evening, ${user?.name ? user.name.split(" ")[0] : "Priya"}`
                      : kind === "driver"
                        ? `Good evening, ${user?.name ? user.name.split(" ")[0] : "Arun"}`
                        : "Operations overview")}
                </p>
                <p className="hidden text-xs text-muted-foreground sm:block">
                  {subtitle ??
                    (kind === "customer"
                      ? "Simple rides. Clear fares. No surprises."
                      : kind === "driver"
                        ? "Drive more. Earn fairly."
                        : "Chennai · Saturday, 12 September 2026")}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" aria-label="Notifications">
                <Bell />
              </Button>
              <div className="hidden items-center gap-2 border-l border-border pl-3 sm:flex">
                <span className="grid size-8 place-items-center bg-secondary text-sm font-semibold text-primary">
                  {user?.avatar ?? (kind === "admin" ? "JF" : kind === "driver" ? "AK" : "P")}
                </span>
                <span className="text-sm font-medium">
                  {user?.name ??
                    (kind === "admin"
                      ? "JOV Fleet Admin"
                      : kind === "driver"
                        ? "Arun Kumar"
                        : "Priya")}
                </span>
              </div>
            </div>
          </div>
        </header>
        <main className="px-4 py-6 sm:px-8">{children}</main>
      </div>
      <nav className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-5 border-t border-border bg-card/95 pb-safe lg:hidden">
        {items.slice(0, 5).map((item) => (
          <Link
            key={item.to}
            to={item.to as never}
            className={`flex min-h-16 flex-col items-center justify-center gap-1 text-[10px] ${pathname === item.to ? "font-semibold text-primary" : "text-muted-foreground"}`}
          >
            <span className="text-lg">{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="sr-only">
        Shared ride {demoRide.id}: {demoRide.pickup} to {demoRide.destination}
      </div>
    </div>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  copy,
  action,
}: {
  eyebrow?: string;
  title: string;
  copy?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {eyebrow ? <p className="eyebrow text-primary">{eyebrow}</p> : null}
        <h1 className="mt-1 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          {title}
        </h1>
        {copy ? (
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">{copy}</p>
        ) : null}
      </div>
      {action}
    </div>
  );
}
export function MapPanel({
  label = "Live map",
  markers = 3,
  locations = [],
  onSelectLocation,
  distance = "12.8 km",
  duration = "34 min",
}: {
  label?: string;
  markers?: number;
  locations?: { name: string; left: string; top: string }[];
  onSelectLocation?: (name: string) => void;
  distance?: string;
  duration?: string;
}) {
  return (
    <div className="map-surface relative min-h-72 overflow-hidden border border-border p-4 sm:min-h-96">
      <div className="flex items-center justify-between">
        <span className="border border-primary/20 bg-card/90 px-3 py-1.5 text-xs font-semibold text-primary">
          {label}
        </span>
        <span className="bg-card/90 px-3 py-1.5 text-xs text-muted-foreground">
          Chennai · Light traffic
        </span>
      </div>
      <div className="map-route absolute left-[20%] top-[40%] h-28 w-2/3" />
      <span className="map-pin left-[18%] top-[68%]" />
      <span className="map-pin pin-amber right-[14%] top-[23%]" />
      {Array.from({ length: markers }).map((_, index) => (
        <span
          key={index}
          className="map-dot"
          style={{ left: `${35 + index * 14}%`, top: `${28 + (index % 2) * 28}%` }}
        />
      ))}
      {locations.map((location) => (
        <button
          key={location.name}
          type="button"
          className="absolute z-10 -translate-x-1/2 -translate-y-1/2"
          style={{ left: location.left, top: location.top }}
          onClick={() => onSelectLocation?.(location.name)}
          aria-label={`Select ${location.name}`}
        >
          <span className="map-pin block" />
          <span className="mt-1 block whitespace-nowrap border border-primary/20 bg-card/95 px-2 py-1 text-[10px] font-semibold text-primary shadow-sm">
            {location.name}
          </span>
        </button>
      ))}
      <div className="absolute bottom-4 left-4 border border-border bg-card/90 px-3 py-2 text-xs text-muted-foreground">
        {duration ? `${distance} · ${duration} · No hidden charges` : distance}
      </div>
      <div className="absolute bottom-4 right-4 flex flex-col gap-1">
        <Button variant="outline" size="icon" aria-label="Zoom in">
          +
        </Button>
        <Button variant="outline" size="icon" aria-label="Zoom out">
          −
        </Button>
        <Button variant="outline" size="icon" aria-label="Recenter map">
          ◎
        </Button>
      </div>
    </div>
  );
}
export function RideStatusBadge({ status }: { status: string }) {
  return <span className="status-badge">{status}</span>;
}
