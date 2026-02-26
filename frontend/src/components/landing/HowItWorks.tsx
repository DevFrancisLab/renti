import { UserPlus, LayoutDashboard, TrendingUp } from "lucide-react";

const steps = [
  {
    icon: UserPlus,
    step: "01",
    title: "Sign Up & Add Properties",
    description: "Create your free account and add your rental properties in minutes.",
  },
  {
    icon: LayoutDashboard,
    step: "02",
    title: "Manage Tenants & Leases",
    description: "Add tenants, assign rooms, and set up lease agreements from your dashboard.",
  },
  {
    icon: TrendingUp,
    step: "03",
    title: "Collect Rent & Track Performance",
    description: "Automate rent collection via M-Pesa and monitor your property portfolio.",
  },
];

const HowItWorks = () => (
  <section id="how-it-works" className="py-20 md:py-28 bg-card">
    <div className="container mx-auto px-4">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <span className="inline-block px-4 py-1.5 mb-4 text-xs font-semibold tracking-wider uppercase rounded-full bg-accent/20 text-accent-foreground">
          How It Works
        </span>
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
          Get Started in 3 Simple Steps
        </h2>
      </div>

      <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
        {steps.map((s, i) => (
          <div key={s.step} className="text-center relative">
            {/* Connector line */}
            {i < steps.length - 1 && (
              <div className="hidden md:block absolute top-10 left-[60%] w-[80%] h-[2px] bg-border" />
            )}
            <div className="relative z-10 w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <s.icon size={32} className="text-primary" />
              <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-accent text-accent-foreground text-xs font-bold flex items-center justify-center">
                {s.step}
              </span>
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">{s.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{s.description}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default HowItWorks;
