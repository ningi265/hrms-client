import { FileText, Users, ShoppingCart, CreditCard, BarChart3, Layers, CheckCircle, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: FileText,
    title: "Smart Requisition Management",
    description: "AI-powered requisition workflows with intelligent approval routing and real-time tracking.",
    benefits: ["Auto-routing approvals", "Real-time tracking", "Mobile accessibility", "Custom templates"],
    color: "text-metric-blue",
    bgColor: "bg-metric-blue/10",
    borderColor: "group-hover:border-metric-blue/30",
  },
  {
    icon: Users,
    title: "Advanced Vendor Management",
    description: "Comprehensive vendor lifecycle management with performance analytics and risk assessment.",
    benefits: ["Performance tracking", "Risk assessment", "Contract management", "Vendor portal"],
    color: "text-metric-emerald",
    bgColor: "bg-metric-emerald/10",
    borderColor: "group-hover:border-metric-emerald/30",
  },
  {
    icon: ShoppingCart,
    title: "Automated Purchase Orders",
    description: "Generate professional purchase orders with customizable templates and automated approvals.",
    benefits: ["Custom templates", "Auto-approvals", "Supplier integration", "Order tracking"],
    color: "text-metric-violet",
    bgColor: "bg-metric-violet/10",
    borderColor: "group-hover:border-metric-violet/30",
  },
  {
    icon: CreditCard,
    title: "Intelligent Invoice Processing",
    description: "AI-powered invoice matching and verification with automated payment processing.",
    benefits: ["AI-powered matching", "Auto-payments", "Audit trails", "Exception handling"],
    color: "text-metric-orange",
    bgColor: "bg-metric-orange/10",
    borderColor: "group-hover:border-metric-orange/30",
  },
  {
    icon: BarChart3,
    title: "Advanced Analytics & Reporting",
    description: "Comprehensive dashboards with real-time insights and predictive analytics.",
    benefits: ["Real-time dashboards", "Custom reports", "Predictive analytics", "KPI tracking"],
    color: "text-primary",
    bgColor: "bg-primary/10",
    borderColor: "group-hover:border-primary/30",
  },
  {
    icon: Layers,
    title: "Enterprise Integrations",
    description: "Seamless integration with ERP systems and business applications through robust APIs.",
    benefits: ["ERP integration", "API access", "Pre-built connectors", "Data synchronization"],
    color: "text-accent",
    bgColor: "bg-accent/10",
    borderColor: "group-hover:border-accent/30",
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 lg:py-32 bg-background relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.01)_1px,transparent_1px)] bg-[size:64px_64px]" />
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent/5 rounded-full blur-[100px]" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6 border border-primary/20">
            <Layers className="w-4 h-4" />
            <span>Powerful Features</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6 tracking-tight">
            Everything You Need in <span className="gradient-text">One Platform</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Our comprehensive solution covers the entire procurement lifecycle with advanced automation and intelligent insights.
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div 
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              variants={item}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className={`group bg-card rounded-2xl border border-border p-6 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5 ${feature.borderColor}`}
            >
              {/* Icon */}
              <div className={`w-14 h-14 rounded-xl ${feature.bgColor} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className={`w-7 h-7 ${feature.color}`} />
              </div>

              {/* Content */}
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                <ArrowUpRight className="w-5 h-5 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:text-primary transition-all duration-300 -translate-y-1 translate-x-1 group-hover:translate-y-0 group-hover:translate-x-0" />
              </div>
              <p className="text-muted-foreground text-sm mb-5 leading-relaxed">
                {feature.description}
              </p>

              {/* Benefits List */}
              <div className="space-y-2.5">
                {feature.benefits.map((benefit) => (
                  <div key={benefit} className="flex items-center gap-2.5">
                    <div className={`w-5 h-5 rounded-full ${feature.bgColor} flex items-center justify-center`}>
                      <CheckCircle className={`w-3 h-3 ${feature.color}`} />
                    </div>
                    <span className="text-sm text-muted-foreground">{benefit}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
