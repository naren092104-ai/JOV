import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { ArrowRight, CarFront, ShieldCheck, Truck } from "lucide-react";
import { useAppContext } from "@/context/app-context";
import { useDemo } from "@/lib/demo-state";
import { Button } from "@/components/ui/button";



export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "JOV FLEET — Smart rides. Fair fares." },
      {
        name: "description",
        content:
          "A complete JOV FLEET ride experience for customers, drivers, and operations teams.",
      },
      { property: "og:title", content: "JOV FLEET — Smart rides. Fair fares." },
      {
        property: "og:description",
        content: "Explore the JOV FLEET customer, driver, and operations demo.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Portal,
});

function Portal() {
  const { login } = useAppContext();
  const { resetDemo, showToast } = useDemo();

  const handleDemoAccess = async (role: "customer" | "driver" | "admin") => {
    await login(role);
    if (role === "customer") {
      window.location.href = "/customer/home";
    } else if (role === "driver") {
      window.location.href = "/driver/home";
    } else {
      window.location.href = "/admin/dashboard";
    }
  };

  return (
    <main className="min-h-screen bg-background px-4 py-8 text-foreground sm:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <header className="flex items-center justify-between border-b border-border pb-6">
          <div className="flex items-center gap-3">
            <span className="brand-mark">J</span>
            <div>
              <p className="font-display text-xl font-semibold tracking-tight">JOV FLEET</p>
              <p className="eyebrow">Smart rides. Fair fares.</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden text-sm text-muted-foreground sm:block">
              Smart Rides. Fair Fares. Better Earnings.
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                resetDemo();
                showToast("Demo state reset to clean initial state");
              }}
            >
              Reset demo state
            </Button>
          </div>
        </header>

        <section className="grid gap-10 py-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-center lg:py-16">
          <div>
            <p className="eyebrow text-primary">Ride better, together</p>
            <h1 className="mt-4 max-w-3xl font-display text-5xl font-semibold leading-[0.98] tracking-tight sm:text-7xl">
              Simple rides. Clear fares. No surprises.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-muted-foreground">
              A fairer way to move through India. Choose the experience that fits your day — book a ride, make a living, or monitor city operations.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Button size="lg" className="px-6 font-semibold" asChild>
                <Link to="/customer/login">
                  Book a ride <ArrowRight className="ml-2 size-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="px-6 font-semibold" asChild>
                <Link to="/driver/login">
                  Drive with JOV Fleet
                </Link>
              </Button>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div>
                <p className="eyebrow text-primary">Instant demo access</p>
                <h3 className="mt-1 font-display text-xl font-semibold">1-click test environments</h3>
              </div>
              <span className="status-badge">Ready</span>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
              Pre-configured fictional accounts and realistic workflows. Open Customer and Driver in separate tabs to test live dispatch synchronization:
            </p>

            <div className="mt-5 space-y-2.5">
              <Button
                className="w-full justify-between"
                variant="secondary"
                onClick={() => handleDemoAccess("customer")}
              >
                <span className="flex items-center gap-2">
                  <CarFront className="size-4 text-primary" />
                  <strong>Customer demo</strong> (Priya)
                </span>
                <span className="text-xs text-muted-foreground">/customer/home →</span>
              </Button>

              <Button
                className="w-full justify-between"
                variant="secondary"
                onClick={() => handleDemoAccess("driver")}
              >
                <span className="flex items-center gap-2">
                  <Truck className="size-4 text-primary" />
                  <strong>Driver demo</strong> (Arun · Starts offline)
                </span>
                <span className="text-xs text-muted-foreground">/driver/home →</span>
              </Button>

              <Button
                className="w-full justify-between"
                variant="secondary"
                onClick={() => handleDemoAccess("admin")}
              >
                <span className="flex items-center gap-2">
                  <ShieldCheck className="size-4 text-primary" />
                  <strong>Admin demo</strong> (Operations)
                </span>
                <span className="text-xs text-muted-foreground">/admin/dashboard →</span>
              </Button>
            </div>
          </div>
        </section>

        <div className="border-t border-border pt-8 pb-4">
          <p className="eyebrow mb-6">Choose your portal</p>
          <div className="grid gap-4 md:grid-cols-3">
            <PortalCard
              to="/customer/login"
              icon={<CarFront />}
              label="Customer"
              title="Book without second-guessing."
              copy="Clear fares, saved places, easy rebooking, and a human ride experience."
            />
            <PortalCard
              to="/driver/login"
              icon={<Truck />}
              label="Driver"
              title="Drive more. Earn fairly."
              copy="A fast work surface for requests, trips, payouts, and everyday support."
            />
            <PortalCard
              to="/admin/login"
              icon={<ShieldCheck />}
              label="Operations"
              title="Keep every ride moving."
              copy="Live fleet visibility, safety review, pricing, support, and city operations."
            />
          </div>
        </div>

        <footer className="mt-12 flex flex-col gap-2 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row sm:justify-between">
          <span>JOV FLEET · Chennai demo environment</span>
          <span>Smart Rides. Fair Fares. Better Earnings.</span>
        </footer>
      </div>
    </main>
  );
}

function PortalCard({
  to,
  icon,
  label,
  title,
  copy,
}: {
  to: "/customer/login" | "/driver/login" | "/admin/login";
  icon: React.ReactNode;
  label: string;
  title: string;
  copy: string;
}) {
  return (
    <Link
      to={to}
      className="group flex min-h-64 flex-col justify-between border border-border bg-card p-6 transition hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg"
    >
      <div>
        <div className="flex items-center justify-between">
          <span className="grid size-11 place-items-center bg-primary/10 text-primary">{icon}</span>
          <ArrowRight className="size-5 text-muted-foreground transition group-hover:translate-x-1 group-hover:text-primary" />
        </div>
        <p className="eyebrow mt-8 text-primary">{label}</p>
        <h2 className="mt-2 font-display text-2xl font-semibold">{title}</h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">{copy}</p>
      </div>
      <span className="mt-6 text-sm font-semibold text-primary">
        Open demo <ArrowRight className="ml-1 inline size-4" />
      </span>
    </Link>
  );
}
