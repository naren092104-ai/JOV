import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Radio,
  Activity,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useAppContext } from "@/context/app-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

export const Route = createFileRoute("/admin/login")({
  component: AdminLoginRoute,
});

function AdminLoginRoute() {
  const { login } = useAppContext();
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [email, setEmail] = useState("ops@jovfleet.demo");
  const [password, setPassword] = useState("jovfleet123");
  const [rememberMe, setRememberMe] = useState(true);
  const [showManualLogin, setShowManualLogin] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const introSlides = [
    {
      badge: "Real-Time Telemetry",
      title: "Chennai Fleet Oversight",
      desc: "Live visibility over customer ride requests, driver availability, and real-time dispatch routes.",
      icon: <Radio className="size-6 text-blue-600" />,
      color: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    },
    {
      badge: "Dispatch Sync",
      title: "Zero-Latency Ride States",
      desc: "Watch customer and driver apps synchronize automatically through all 7 lifecycle stages.",
      icon: <Activity className="size-6 text-emerald-600" />,
      color: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % introSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [introSlides.length]);

  const handleLogin = async () => {
    setSubmitting(true);
    try {
      await login("admin");
      await navigate({ to: "/admin/dashboard" });
    } finally {
      setSubmitting(false);
    }
  };

  const slide = introSlides[currentSlide];

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4 py-8">
      <div className="w-full rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
        {/* Brand Header */}
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div className="flex items-center gap-3">
            <span className="brand-mark bg-blue-700">J</span>
            <div>
              <p className="font-display text-lg font-semibold tracking-tight">JOV FLEET</p>
              <p className="eyebrow text-blue-700 dark:text-blue-400">Operations suite</p>
            </div>
          </div>
          <span className="rounded-full bg-blue-500/15 px-2.5 py-0.5 text-[11px] font-medium text-blue-700 dark:text-blue-400">
            Admin
          </span>
        </div>

        {/* Sleek App Intro Carousel Card */}
        <div className="mt-6 rounded-xl border border-border bg-muted/40 p-5 transition-all">
          <div className="flex items-center justify-between">
            <div className={`flex size-11 items-center justify-center rounded-xl border ${slide.color}`}>
              {slide.icon}
            </div>
            <span className="eyebrow text-blue-700 dark:text-blue-400">{slide.badge}</span>
          </div>

          <h2 className="mt-4 font-display text-2xl font-semibold leading-tight text-foreground">
            {slide.title}
          </h2>
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
            {slide.desc}
          </p>

          {/* Dots Indicator & Controls */}
          <div className="mt-5 flex items-center justify-between pt-2">
            <div className="flex items-center gap-1.5">
              {introSlides.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setCurrentSlide(idx)}
                  className={`h-1.5 rounded-full transition-all ${
                    idx === currentSlide
                      ? "w-6 bg-blue-600"
                      : "w-1.5 bg-border hover:bg-muted-foreground"
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() =>
                  setCurrentSlide((prev) => (prev === 0 ? introSlides.length - 1 : prev - 1))
                }
                className="grid size-7 place-items-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
                aria-label="Previous slide"
              >
                <ChevronLeft className="size-4" />
              </button>
              <button
                type="button"
                onClick={() => setCurrentSlide((prev) => (prev + 1) % introSlides.length)}
                className="grid size-7 place-items-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
                aria-label="Next slide"
              >
                <ChevronRight className="size-4" />
              </button>
            </div>
          </div>
        </div>

        {/* 1-Click Demo Admin Access */}
        <div className="mt-6 space-y-3">
          <Button
            type="button"
            variant="default"
            size="lg"
            className="w-full bg-blue-700 font-semibold text-white shadow-xs hover:bg-blue-800"
            disabled={submitting}
            onClick={handleLogin}
          >
            <Sparkles className="mr-2 size-4 text-amber-300" />
            {submitting ? "Signing in..." : "Enter Operations Suite (Demo)"}
            <ArrowRight className="ml-2 size-4" />
          </Button>
          <p className="text-center text-[11px] text-muted-foreground">
            1-click instant login · Opens live dashboard & fleet telemetry
          </p>
        </div>

        {/* Toggle Manual Form */}
        <div className="mt-5 border-t border-border pt-4">
          {!showManualLogin ? (
            <button
              type="button"
              onClick={() => setShowManualLogin(true)}
              className="w-full text-center text-xs font-medium text-muted-foreground hover:text-foreground"
            >
              Or sign in with work email ↓
            </button>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleLogin();
              }}
              className="space-y-3 pt-1"
            >
              <label className="block">
                <span className="eyebrow mb-1.5 block">Work email</span>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ops@jovfleet.demo"
                  required
                />
              </label>
              <label className="block">
                <span className="eyebrow mb-1.5 block">Password</span>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                />
              </label>

              <div className="flex items-center justify-between text-xs">
                <label className="flex cursor-pointer items-center space-x-2">
                  <Checkbox
                    checked={rememberMe}
                    onCheckedChange={(val) => setRememberMe(Boolean(val))}
                  />
                  <span className="text-muted-foreground">Remember me</span>
                </label>
              </div>

              <Button
                type="submit"
                className="w-full bg-blue-700 text-white hover:bg-blue-800"
                disabled={submitting}
              >
                {submitting ? "Signing in..." : "Log in to operations"}
              </Button>
            </form>
          )}
        </div>

        {/* Back Link */}
        <div className="mt-6 border-t border-border pt-4 text-center">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/">Back to portal</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
