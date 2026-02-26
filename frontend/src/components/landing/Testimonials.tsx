import { Star } from "lucide-react";

const testimonials = [
  {
    name: "James Mwangi",
    role: "Landlord, Kilimani",
    quote: "Renti has transformed how I manage my 12-unit apartment. Rent collection used to be a nightmare — now it's automatic via M-Pesa.",
  },
  {
    name: "Aisha Odhiambo",
    role: "Property Manager, Westlands",
    quote: "The maintenance tracking alone saved me hours every week. My tenants love how easy it is to submit requests.",
  },
  {
    name: "Peter Kamau",
    role: "Tenant, South B",
    quote: "I can pay rent, check my lease, and report issues all from my phone. Finally, a platform that works for Kenyan renters!",
  },
];

const Testimonials = () => (
  <section id="testimonials" className="py-20 md:py-28">
    <div className="container mx-auto px-4">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <span className="inline-block px-4 py-1.5 mb-4 text-xs font-semibold tracking-wider uppercase rounded-full bg-primary/10 text-primary">
          Testimonials
        </span>
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
          Trusted by Landlords & Tenants
        </h2>
      </div>

      <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {testimonials.map((t) => (
          <div
            key={t.name}
            className="rounded-2xl bg-card border border-border p-6 shadow-card"
          >
            <div className="flex gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={16} className="fill-accent text-accent" />
              ))}
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6 italic">
              "{t.quote}"
            </p>
            <div>
              <p className="font-semibold text-foreground text-sm">{t.name}</p>
              <p className="text-xs text-muted-foreground">{t.role}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default Testimonials;
