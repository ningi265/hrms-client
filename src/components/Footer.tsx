import { Layers, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

const footerLinks = {
  product: [
    { label: "Features", href: "#features" },
    { label: "Pricing", href: "#pricing" },
    { label: "Integrations", href: "#integrations" },
    { label: "API", href: "#api" },
    { label: "Security", href: "#security" },
  ],
  resources: [
    { label: "Documentation", href: "#docs" },
    { label: "Help Center", href: "#help" },
    { label: "Blog", href: "#blog" },
    { label: "Case Studies", href: "#case-studies" },
    { label: "Webinars", href: "#webinars" },
  ],
  company: [
    { label: "About Us", href: "#about" },
    { label: "Careers", href: "#careers", badge: "Hiring" },
    { label: "Contact", href: "#contact" },
    { label: "Partners", href: "#partners" },
    { label: "Press", href: "#press" },
  ],
};

const socialLinks = [
  { label: "Twitter", icon: "𝕏" },
  { label: "LinkedIn", icon: "in" },
  { label: "GitHub", icon: "⌘" },
  { label: "YouTube", icon: "▶" },
];

export function Footer() {
  return (
    <footer className="bg-foreground text-primary-foreground relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 noise" />
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-[150px]" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 lg:gap-16 mb-16">
          {/* Brand */}
          <div className="col-span-2">
            <a href="/" className="flex items-center gap-3 mb-6 group">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                <Layers className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="text-2xl font-bold">NexusMWI</span>
            </a>
            <p className="text-primary-foreground/60 text-sm leading-relaxed mb-8 max-w-sm">
              Streamlining procurement processes for modern enterprises with intelligent automation, comprehensive analytics, and seamless integrations.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.label}
                  href="#"
                  whileHover={{ y: -3 }}
                  className="w-11 h-11 rounded-xl bg-primary-foreground/5 hover:bg-primary hover:text-primary-foreground flex items-center justify-center transition-colors border border-primary-foreground/10"
                  aria-label={social.label}
                >
                  <span className="text-sm font-medium">{social.icon}</span>
                </motion.a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold mb-5 text-primary-foreground">Product</h3>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-primary-foreground/60 hover:text-primary-foreground text-sm transition-colors inline-flex items-center gap-1 group"
                  >
                    {link.label}
                    <ArrowUpRight className="w-3 h-3 opacity-0 -translate-y-0.5 translate-x-0.5 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-5 text-primary-foreground">Resources</h3>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-primary-foreground/60 hover:text-primary-foreground text-sm transition-colors inline-flex items-center gap-1 group"
                  >
                    {link.label}
                    <ArrowUpRight className="w-3 h-3 opacity-0 -translate-y-0.5 translate-x-0.5 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-5 text-primary-foreground">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-primary-foreground/60 hover:text-primary-foreground text-sm transition-colors inline-flex items-center gap-2 group"
                  >
                    {link.label}
                    {link.badge && (
                      <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-primary text-primary-foreground">
                        {link.badge}
                      </span>
                    )}
                    <ArrowUpRight className="w-3 h-3 opacity-0 -translate-y-0.5 translate-x-0.5 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-primary-foreground/10 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-primary-foreground/50 text-sm">
              © {new Date().getFullYear()} NexusMWI. All rights reserved.
            </p>
            <div className="flex flex-wrap justify-center gap-x-8 gap-y-2">
              {["Privacy Policy", "Terms of Service", "Cookie Policy", "GDPR"].map((item) => (
                <a
                  key={item}
                  href="#"
                  className="text-primary-foreground/50 hover:text-primary-foreground text-sm transition-colors"
                >
                  {item}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
