import { TrendingUp, CheckCircle, Clock, Shield, DollarSign, Gauge, Target } from "lucide-react";
import { motion } from "framer-motion";

const benefits = [
  {
    icon: TrendingUp,
    title: "Increase Efficiency",
    description: "Reduce procurement cycle times by up to 70% through intelligent automation.",
    metric: "70%",
    subtext: "faster processing",
    color: "text-metric-blue",
    bgColor: "bg-metric-blue/10",
    gradient: "from-metric-blue to-metric-cyan",
  },
  {
    icon: CheckCircle,
    title: "Improve Compliance",
    description: "Ensure all purchases adhere to organizational policies with automated compliance checks.",
    metric: "99.9%",
    subtext: "compliance rate",
    color: "text-metric-emerald",
    bgColor: "bg-metric-emerald/10",
    gradient: "from-metric-emerald to-accent",
  },
  {
    icon: Clock,
    title: "Save Time",
    description: "Eliminate manual processes with end-to-end digital workflows and automated approvals.",
    metric: "8 hrs",
    subtext: "saved daily",
    color: "text-metric-amber",
    bgColor: "bg-metric-amber/10",
    gradient: "from-metric-amber to-metric-orange",
  },
  {
    icon: Shield,
    title: "Reduce Risk",
    description: "Minimize procurement risks with built-in compliance controls and fraud detection.",
    metric: "95%",
    subtext: "risk reduction",
    color: "text-metric-rose",
    bgColor: "bg-metric-rose/10",
    gradient: "from-metric-rose to-destructive",
  },
  {
    icon: DollarSign,
    title: "Cost Savings",
    description: "Achieve significant cost reductions through better vendor negotiations.",
    metric: "$2.4M",
    subtext: "average savings",
    color: "text-primary",
    bgColor: "bg-primary/10",
    gradient: "from-primary to-accent",
  },
  {
    icon: Gauge,
    title: "Performance Boost",
    description: "Monitor and improve procurement performance with advanced analytics.",
    metric: "45%",
    subtext: "improvement",
    color: "text-metric-violet",
    bgColor: "bg-metric-violet/10",
    gradient: "from-metric-violet to-primary",
  },
];

export function BenefitsSection() {
  return (
    <section id="benefits" className="py-24 lg:py-32 bg-background relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(var(--primary)/0.05),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,hsl(var(--accent)/0.05),transparent_50%)]" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-metric-violet/10 text-metric-violet px-4 py-2 rounded-full text-sm font-medium mb-6 border border-metric-violet/20">
            <Target className="w-4 h-4" />
            <span>Proven Results</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6 tracking-tight">
            Measurable <span className="gradient-text">Business Impact</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Our procurement system delivers tangible business benefits that directly impact your bottom line.
          </p>
        </motion.div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="group bg-card rounded-2xl border border-border p-6 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500"
            >
              {/* Header */}
              <div className="flex items-start gap-4 mb-5">
                <div className={`w-14 h-14 rounded-xl ${benefit.bgColor} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <benefit.icon className={`w-7 h-7 ${benefit.color}`} />
                </div>
                <h3 className="text-lg font-semibold text-foreground pt-3 group-hover:text-primary transition-colors">
                  {benefit.title}
                </h3>
              </div>

              {/* Metric */}
              <div className="text-center py-5 mb-5 rounded-xl bg-secondary/50 border border-border/50 group-hover:border-primary/20 transition-colors">
                <div className={`text-4xl font-bold bg-gradient-to-r ${benefit.gradient} bg-clip-text text-transparent`}>
                  {benefit.metric}
                </div>
                <div className="text-sm text-muted-foreground font-medium mt-1">
                  {benefit.subtext}
                </div>
              </div>

              {/* Description */}
              <p className="text-muted-foreground text-sm leading-relaxed text-center">
                {benefit.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
