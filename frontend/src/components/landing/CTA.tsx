import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const CTA = () => {
  const navigate = useNavigate();
  return (
  <section className="py-20 md:py-28">
    <div className="container mx-auto px-4">
      <div className="relative rounded-3xl overflow-hidden bg-primary px-8 py-16 md:py-20 text-center">
        {/* Decorative circles */}
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-primary-foreground/5 -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-primary-foreground/5 translate-y-1/2 -translate-x-1/2" />

        <div className="relative z-10 max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
            Start Managing Your Properties Today
          </h2>
          <p className="text-primary-foreground/80 mb-8 text-lg">
            Join thousands of Kenyan landlords already using Renti to simplify property management.
          </p>
          <Button
            size="lg"
            variant="secondary"
            className="gap-2 text-base px-8"
            onClick={() => navigate("/dashboard")}
          >
            Get Started Free <ArrowRight size={18} />
          </Button>
        </div>
      </div>
    </div>
  </section>
  );
};

export default CTA;
