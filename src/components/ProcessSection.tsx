import { FileCheck, CheckCircle, Users, ShoppingCart, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const steps = [
  {
    step: "01",
    title: "Create Requisition",
    description: "Employees submit procurement requests through intuitive digital forms with automated routing.",
    icon: FileCheck,
    color: "from-metric-blue to-metric-cyan",
  },
  {
    step: "02",
    title: "Approval Workflow",
    description: "Smart routing ensures requests go to the right approvers based on amount, category, and policies.",
    icon: CheckCircle,
    color: "from-metric-emerald to-accent",
  },
  {
    step: "03",
    title: "Vendor Selection",
    description: "Choose from pre-approved vendors or add new ones with comprehensive evaluation criteria.",
    icon: Users,
    color: "from-metric-violet to-primary",
  },
  {
    step: "04",
    title: "Purchase Order",
    description: "Generate professional POs with automated delivery to suppliers and internal stakeholders.",
    icon: ShoppingCart,
    color: "from-metric-orange to-metric-amber",
  },
];

export function ProcessSection() {
  return (
    <section id="process" className="py-24 lg:py-32 bg-secondary/30 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 noise" />
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-[100px] translate-x-1/2 translate-y-1/2" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-2 rounded-full text-sm font-medium mb-6 border border-accent/20">
            <ArrowRight className="w-4 h-4" />
            <span>Simple Process</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6 tracking-tight">
            How It <span className="gradient-text">Works</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Get up and running in minutes with our streamlined procurement workflow.
          </p>
        </motion.div>

        {/* Process Steps */}
        <div className="relative">
          {/* Connection Line (Desktop) */}
          <div className="hidden lg:block absolute top-24 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20" />
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((item, index) => (
              <motion.div 
                key={item.step} 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative"
              >
                <motion.div
                  whileHover={{ y: -8, transition: { duration: 0.3 } }}
                  className="bg-card rounded-2xl border border-border p-6 h-full hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 group"
                >
                  {/* Step Number */}
                  <div className="relative mb-6">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${item.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <span className="text-2xl font-bold text-primary-foreground">{item.step}</span>
                    </div>
                    {/* Dot on the line */}
                    <div className="hidden lg:block absolute -top-3 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-card border-4 border-primary shadow-md" />
                  </div>

                  {/* Icon */}
                  <div className="w-11 h-11 rounded-lg bg-secondary flex items-center justify-center mb-4 group-hover:bg-primary/10 transition-colors">
                    <item.icon className="w-5 h-5 text-primary" />
                  </div>

                  {/* Content */}
                  <h3 className="text-lg font-semibold text-foreground mb-3 group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {item.description}
                  </p>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
