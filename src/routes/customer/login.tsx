import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Zap,
  TrendingDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useAppContext } from "@/context/app-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/customer/login")({
  component: CustomerLoginRoute,
});

function CustomerLoginRoute() {
  const { login } = useAppContext();
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [phone, setPhone] = useState("+91 98765 43210");
  const [showManualLogin, setShowManualLogin] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const introSlides = [
    {
      badge: "Zero Surge Fares",
      title: "Smart Rides. Fair Fares.",
      desc: "Transparent upfront pricing. No hidden fees or sudden 2x surge spikes across Chennai.",
      icon: <TrendingDown className="size-6 text-emerald-600" />,
      color: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    },
    {
      badge: "Real-Time Dispatch",
      title: "Instant Driver Matching",
      desc: "Connect directly to nearby verified drivers like Arun Kumar with live cross-tab demo sync.",
      icon: <Zap className="size-6 text-amber-500" />,
      color: "bg-amber-500/10 text-amber-600 border-amber-500/20",
    },
    {
      badge: "4-Digit PIN Security",
      title: "Safe & Verified Boarding",
      desc: "Every trip is secured with PIN 4821. Rides start only when your driver confirms the code.",
      icon: <ShieldCheck className="size-6 text-primary" />,
      color: "bg-primary/10 text-primary border-primary/20",
    },
  ];

  // Optional subtle auto-advance every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % introSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [introSlides.length]);

  const handleLogin = async () => {
    setSubmitting(true);
    try {
      await login("customer");
      await navigate({ to: "/customer/home" });
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
            <span className="brand-mark">J</span>
            <div>
              <p className="font-display text-lg font-semibold tracking-tight">JOV FLEET</p>
              <p className="eyebrow text-primary">Customer app</p>
            </div>
          </div>
          <span className="rounded-full bg-secondary px-2.5 py-0.5 text-[11px] font-medium text-secondary-foreground">
            Chennai
          </span>
        </div>

        {/* Sleek App Intro Carousel Card */}
        <div className="mt-6 rounded-xl border border-border bg-muted/40 p-5 transition-all">
          <div className="flex items-center justify-between">
            <div className={`flex size-11 items-center justify-center rounded-xl border ${slide.color}`}>
              {slide.icon}
            </div>
            <span className="eyebrow text-primary">{slide.badge}</span>
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
                      ? "w-6 bg-primary"
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

        {/* 1-Click Demo Customer Access */}
        <div className="mt-6 space-y-3">
          <Button
            type="button"
            variant="default"
            size="lg"
            className="w-full font-semibold shadow-xs"
            disabled={submitting}
            onClick={handleLogin}
          >
            <Sparkles className="mr-2 size-4 text-amber-300" />
            {submitting ? "Signing in..." : "Enter as Priya Sharma (Demo)"}
            <ArrowRight className="ml-2 size-4" />
          </Button>
          <p className="text-center text-[11px] text-muted-foreground">
            1-click instant login · Opens booking screen directly
          </p>
        </div>

        {/* Toggle Manual Phone Login */}
        <div className="mt-5 border-t border-border pt-4">
          {!showManualLogin ? (
            <button
              type="button"
              onClick={() => setShowManualLogin(true)}
              className="w-full text-center text-xs font-medium text-muted-foreground hover:text-foreground"
            >
              Or sign in with mobile number ↓
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
                <span className="eyebrow mb-1.5 block">Mobile number</span>
                <Input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  required
                />
              </label>
              <Button type="submit" className="w-full" disabled={submitting}>
                {submitting ? "Signing in..." : "Continue"}
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
