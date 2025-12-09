import { useState } from "react";
import { Mail, ArrowRight, CheckCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubmitted(true);
      setEmail("");
      setTimeout(() => setIsSubmitted(false), 3000);
    }
  };

  return (
    <section className="py-20 bg-gradient-to-r from-primary via-primary to-accent relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 noise" />
      <div className="absolute top-0 left-1/4 w-64 h-64 bg-white/10 rounded-full blur-[80px]" />
      <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-white/10 rounded-full blur-[60px]" />
      
      {/* Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:64px_64px]" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-primary-foreground px-4 py-2 rounded-full text-sm font-medium mb-6 border border-white/20">
            <Sparkles className="w-4 h-4" />
            <span>Stay Updated</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl font-bold text-primary-foreground mb-4 tracking-tight">
            Get Procurement Insights Delivered
          </h2>
          <p className="text-lg text-primary-foreground/80 mb-8 max-w-xl mx-auto">
            Join 10,000+ procurement professionals receiving weekly tips, trends, and best practices.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
            <div className="relative flex-1">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full h-14 pl-12 pr-4 rounded-xl bg-card text-foreground placeholder:text-muted-foreground border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-base"
                required
              />
            </div>
            <Button 
              type="submit" 
              variant="dark" 
              size="lg" 
              className="h-14 px-8 text-base group whitespace-nowrap"
              disabled={isSubmitted}
            >
              {isSubmitted ? (
                <>
                  <CheckCircle className="w-5 h-5" />
                  Subscribed!
                </>
              ) : (
                <>
                  Subscribe
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </Button>
          </form>

          <p className="text-sm text-primary-foreground/60 mt-4">
            No spam. Unsubscribe anytime. Read our privacy policy.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
