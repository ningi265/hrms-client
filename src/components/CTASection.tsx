import { ArrowRight, CheckCircle, Zap, Calendar, Building2, Clock, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export function CTASection() {
  return (
    <section className="py-24 lg:py-32 bg-background relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 mesh-gradient" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[150px]" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-accent text-primary-foreground px-5 py-2.5 rounded-full text-sm font-medium mb-8 shadow-lg glow">
            <Zap className="w-4 h-4" />
            <span>Limited Time: 20% Off Annual Plans</span>
          </div>
        </motion.div>

        {/* Heading */}
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-foreground mb-6 tracking-tight leading-tight"
        >
          Ready to Transform Your{" "}
          <span className="gradient-text">Procurement Process</span>?
        </motion.h2>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-lg sm:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed"
        >
          Start your 14-day free trial today or schedule a personalized demo with our product specialists.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row justify-center gap-4 mb-10"
        >
          <Button variant="hero" size="xl" className="group text-base">
            Start Free Trial
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
          <Button variant="outline" size="xl" className="group text-base">
            <Calendar className="w-5 h-5" />
            Schedule Demo
          </Button>
        </motion.div>

        {/* Trust indicators */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm text-muted-foreground mb-12"
        >
          {["No credit card required", "Easy setup in minutes", "Cancel anytime", "Dedicated support"].map((text) => (
            <div key={text} className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-primary" />
              <span>{text}</span>
            </div>
          ))}
        </motion.div>

        {/* Stats Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="glass rounded-2xl p-8 max-w-2xl mx-auto border-gradient"
        >
          <div className="grid grid-cols-3 gap-8">
            <div>
              <div className="flex items-center justify-center gap-2 mb-2">
                <Building2 className="w-6 h-6 text-primary" />
                <span className="text-3xl font-bold text-foreground">500+</span>
              </div>
              <p className="text-sm text-muted-foreground">Companies served</p>
            </div>
            <div className="border-x border-border">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Shield className="w-6 h-6 text-primary" />
                <span className="text-3xl font-bold text-foreground">99.9%</span>
              </div>
              <p className="text-sm text-muted-foreground">Uptime guarantee</p>
            </div>
            <div>
              <div className="flex items-center justify-center gap-2 mb-2">
                <Clock className="w-6 h-6 text-primary" />
                <span className="text-3xl font-bold text-foreground">24/7</span>
              </div>
              <p className="text-sm text-muted-foreground">Expert support</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
