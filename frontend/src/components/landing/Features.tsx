import { Banknote, Users, Wrench, FileText } from "lucide-react";

const features = [
  {
    icon: Banknote,
    title: "Digital Rent Collection",
    description: "Collect rent via M-Pesa and bank transfers. Automated reminders and real-time payment tracking.",
  },
  {
    icon: Users,
    title: "Tenant & Room Tracking",
    description: "Manage tenant details, lease agreements, and room occupancy from a single dashboard.",
  },
  {
    icon: Wrench,
    title: "Maintenance Requests",
    description: "Tenants submit requests digitally. Track status, assign tasks, and resolve issues faster.",
  },
  {
    icon: FileText,
    title: "Lease Management",
    description: "Create, store, and manage lease agreements with automated renewal reminders.",
  },
];

const Features = () => (
  <section id="features" className="py-20 md:py-28">
    <div className="container mx-auto px-4">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <span className="inline-block px-4 py-1.5 mb-4 text-xs font-semibold tracking-wider uppercase rounded-full bg-secondary/10 text-secondary">
          Features
        </span>
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
          Everything You Need to Manage Properties
        </h2>
        <p className="text-muted-foreground">
          From rent collection to maintenance — Renti has you covered.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((f) => (
          <div
            key={f.title}
            className="group rounded-2xl bg-card border border-border p-6 shadow-card hover:shadow-card-hover transition-shadow duration-300"
          >
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors">
              <f.icon size={24} className="text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">{f.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default Features;
