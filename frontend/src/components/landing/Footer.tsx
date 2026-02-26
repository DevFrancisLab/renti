const Footer = () => (
  <footer className="bg-card border-t border-border py-12">
    <div className="container mx-auto px-4">
      <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8 mb-10">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">K</span>
            </div>
            <span className="text-lg font-bold text-foreground">Renti</span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Simplifying property management for Kenyan landlords and tenants.
          </p>
        </div>

        <div>
          <h4 className="font-semibold text-foreground mb-3 text-sm">Product</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><a href="#features" className="hover:text-foreground transition-colors">Features</a></li>
            <li><a href="#" className="hover:text-foreground transition-colors">Pricing</a></li>
            <li><a href="#" className="hover:text-foreground transition-colors">Integrations</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-foreground mb-3 text-sm">Company</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><a href="#" className="hover:text-foreground transition-colors">About</a></li>
            <li><a href="#" className="hover:text-foreground transition-colors">Blog</a></li>
            <li><a href="#" className="hover:text-foreground transition-colors">Careers</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-foreground mb-3 text-sm">Contact</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>hello@renti.co.ke</li>
            <li>+254 700 123 456</li>
            <li>Nairobi, Kenya</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border pt-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Renti. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
