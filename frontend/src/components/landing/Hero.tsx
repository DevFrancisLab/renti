import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import heroDashboard from "@/assets/hero-dashboard.png";

const Hero = () => {
  const navigate = useNavigate();
  return (
  <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
    {/* Background gradient blob */}
    <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-primary/10 blur-3xl pointer-events-none" />
    <div className="absolute -bottom-32 -left-32 w-[400px] h-[400px] rounded-full bg-secondary/10 blur-3xl pointer-events-none" />

    <div className="container mx-auto px-4">
      <div className="flex flex-col lg:flex-row items-center gap-12">
        <div className="flex-1 text-center lg:text-left animate-fade-in-up">
          <span className="inline-block px-4 py-1.5 mb-6 text-xs font-semibold tracking-wider uppercase rounded-full bg-primary/10 text-primary">
            #1 Property Management in Kenya
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight text-foreground mb-6">
            Manage Rent & Tenants{" "}
            <span className="text-gradient">Effortlessly</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto lg:mx-0 mb-8">
            Renti simplifies rent collection, tenant tracking, and maintenance requests — all from one beautiful dashboard built for Kenyan landlords.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <Button size="lg" className="gap-2 text-base px-8" onClick={() => navigate("/dashboard")}>
              Get Started <ArrowRight size={18} />
            </Button>
            <Button size="lg" variant="outline" className="text-base px-8">
              Learn More
            </Button>
          </div>
        </div>

        <div className="flex-1 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
          <div className="rounded-2xl overflow-hidden shadow-card border border-border bg-card">
            <img
              src={heroDashboard}
              alt="Renti property management dashboard showing rent collection and tenant tracking"
              className="w-full h-auto"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
  );
};

export default Hero;
