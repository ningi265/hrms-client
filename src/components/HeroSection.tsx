import { ArrowRight, Play, CheckCircle, Building2, DollarSign, TrendingUp, Star, Activity, Clock, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const stats = [
  { label: "Companies Trust Us", value: "500+", icon: Building2 },
  { label: "Transactions Processed", value: "$2.8B+", icon: DollarSign },
  { label: "Average Savings", value: "32%", icon: TrendingUp },
  { label: "Customer Satisfaction", value: "98%", icon: Star },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center pt-20 lg:pt-0 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 mesh-gradient noise" />
      
      {/* Animated Blobs */}
      <div className="absolute top-1/4 -left-20 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px] animate-blob" />
      <div className="absolute top-1/3 -right-20 w-[400px] h-[400px] bg-accent/15 rounded-full blur-[100px] animate-blob animation-delay-2000" />
      <div className="absolute bottom-1/4 left-1/3 w-[300px] h-[300px] bg-metric-cyan/10 rounded-full blur-[80px] animate-blob animation-delay-4000" />
      
      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.015)_1px,transparent_1px)] bg-[size:72px_72px]" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Content */}
          <motion.div 
            className="max-w-2xl"
            variants={container}
            initial="hidden"
            animate="show"
          >
            {/* Badge */}
            <motion.div variants={item}>
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6 border border-primary/20">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
                </span>
                <Sparkles className="w-3.5 h-3.5" />
                Now with AI-Powered Analytics
              </div>
            </motion.div>

            <motion.h1 
              variants={item}
              className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-foreground leading-[1.1] tracking-tight mb-6"
            >
              Transform Your{" "}
              <span className="gradient-text">Procurement</span>{" "}
              Process
            </motion.h1>

            <motion.p 
              variants={item}
              className="text-lg sm:text-xl text-muted-foreground mb-8 leading-relaxed max-w-xl"
            >
              A comprehensive cloud-based solution that streamlines requisitions, 
              vendor management, purchase orders, and invoice processing for modern enterprises.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div variants={item} className="flex flex-col sm:flex-row gap-4 mb-8">
              <Button variant="hero" size="lg" className="group text-base">
                Get Started Free
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button variant="glass" size="lg" className="group text-base">
                <Play className="w-4 h-4 fill-primary text-primary" />
                Watch Demo
              </Button>
            </motion.div>

            {/* Trust indicators */}
            <motion.div variants={item} className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
              {["14-day free trial", "No credit card required", "Cancel anytime"].map((text) => (
                <div key={text} className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-primary" />
                  <span>{text}</span>
                </div>
              ))}
            </motion.div>

            {/* Stats Grid */}
            <motion.div variants={item} className="grid grid-cols-2 gap-3 mt-10">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  className="glass rounded-xl p-4 card-hover cursor-default"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                      <stat.icon className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-xl font-bold text-foreground">{stat.value}</span>
                  </div>
                  <p className="text-xs text-muted-foreground font-medium">{stat.label}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Dashboard Preview */}
          <motion.div 
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            className="relative"
          >
            <div className="relative">
              {/* Glow effect behind card */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-accent/30 rounded-3xl blur-3xl opacity-40" />
              
              {/* Main Dashboard Card */}
              <motion.div 
                className="relative bg-card rounded-2xl shadow-2xl border border-border/50 overflow-hidden"
                whileHover={{ y: -8, transition: { duration: 0.4 } }}
              >
                {/* Header */}
                <div className="bg-gradient-to-r from-primary to-accent p-6 text-primary-foreground">
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary-foreground/20 flex items-center justify-center backdrop-blur-sm">
                        <Activity className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-semibold">Procurement Dashboard</h3>
                        <p className="text-xs text-primary-foreground/70">Real-time overview</p>
                      </div>
                    </div>
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-primary-foreground/40 hover:bg-primary-foreground/60 transition-colors" />
                      <div className="w-3 h-3 rounded-full bg-primary-foreground/40 hover:bg-primary-foreground/60 transition-colors" />
                      <div className="w-3 h-3 rounded-full bg-primary-foreground/40 hover:bg-primary-foreground/60 transition-colors" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <div className="text-3xl font-bold tracking-tight">$2.4M</div>
                      <div className="text-sm opacity-80 flex items-center gap-1 mt-1">
                        <TrendingUp className="w-3 h-3" />
                        Total Savings
                      </div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold tracking-tight">94%</div>
                      <div className="text-sm opacity-80 flex items-center gap-1 mt-1">
                        <Star className="w-3 h-3" />
                        Efficiency Rate
                      </div>
                    </div>
                  </div>
                </div>

                {/* Mini Chart */}
                <div className="px-6 py-4 border-b border-border/50">
                  <div className="flex items-end justify-between h-16 gap-1">
                    {[40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 88].map((height, i) => (
                      <motion.div
                        key={i}
                        initial={{ height: 0 }}
                        animate={{ height: `${height}%` }}
                        transition={{ duration: 0.5, delay: 0.5 + i * 0.05 }}
                        className="flex-1 bg-gradient-to-t from-primary to-accent rounded-sm"
                        style={{ opacity: 0.6 + (height / 100) * 0.4 }}
                      />
                    ))}
                  </div>
                  <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                    <span>Jan</span>
                    <span>Dec</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-3">
                  {/* Order items */}
                  {[
                    { id: "#1234", status: "Approved", statusColor: "bg-metric-emerald", textColor: "text-metric-emerald", icon: CheckCircle },
                    { id: "#1235", status: "Pending", statusColor: "bg-metric-amber", textColor: "text-metric-amber", icon: Clock },
                    { id: "#1236", status: "In Review", statusColor: "bg-metric-blue", textColor: "text-metric-blue", icon: Activity },
                  ].map((order, index) => (
                    <motion.div
                      key={order.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 0.8 + index * 0.1 }}
                      className="flex items-center justify-between p-4 rounded-xl bg-secondary/30 border border-border/30 hover:border-primary/20 hover:bg-secondary/50 transition-all duration-300"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-full ${order.statusColor} flex items-center justify-center`}>
                          <order.icon className="w-4 h-4 text-primary-foreground" />
                        </div>
                        <div>
                          <span className="font-medium text-foreground text-sm">Purchase Order {order.id}</span>
                          <p className="text-xs text-muted-foreground">Updated 2h ago</p>
                        </div>
                      </div>
                      <span className={`text-xs font-semibold px-3 py-1.5 rounded-full ${order.statusColor}/15 ${order.textColor}`}>
                        {order.status}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Floating elements */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.2 }}
                className="absolute -top-6 -right-6 glass rounded-xl p-4 shadow-xl animate-float border-gradient"
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-metric-emerald/20 flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-metric-emerald" />
                  </div>
                  <div>
                    <span className="text-sm font-bold text-foreground">+32%</span>
                    <p className="text-xs text-muted-foreground">savings</p>
                  </div>
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.4 }}
                className="absolute -bottom-6 -left-6 glass rounded-xl p-4 shadow-xl animate-float-delayed border-gradient"
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-metric-amber/20 flex items-center justify-center">
                    <Star className="w-4 h-4 text-metric-amber fill-metric-amber" />
                  </div>
                  <div>
                    <span className="text-sm font-bold text-foreground">4.9/5</span>
                    <p className="text-xs text-muted-foreground">rating</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
