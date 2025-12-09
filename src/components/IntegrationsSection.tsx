import { ArrowRight, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const integrations = [
  { name: "SAP", type: "ERP", abbr: "SAP" },
  { name: "Oracle", type: "ERP", abbr: "ORC" },
  { name: "Microsoft", type: "Office Suite", abbr: "MS" },
  { name: "Salesforce", type: "CRM", abbr: "SF" },
  { name: "QuickBooks", type: "Accounting", abbr: "QB" },
  { name: "NetSuite", type: "ERP", abbr: "NS" },
];

export function IntegrationsSection() {
  return (
    <section className="py-24 lg:py-32 bg-card border-y border-border relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.02] via-transparent to-accent/[0.02]" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6 border border-primary/20">
            <Layers className="w-4 h-4" />
            <span>Seamless Integrations</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6 tracking-tight">
            Connect with Your <span className="gradient-text">Existing Tools</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            NexusMWI integrates seamlessly with your existing business systems, ensuring a smooth transition and unified workflow.
          </p>
        </motion.div>

        {/* Integrations Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 max-w-4xl mx-auto mb-12">
          {integrations.map((integration, index) => (
            <motion.div
              key={integration.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              className="bg-background rounded-2xl p-5 border border-border hover:border-primary/30 hover:shadow-xl transition-all duration-300 group text-center"
            >
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-muted to-secondary flex items-center justify-center mx-auto mb-4 group-hover:from-primary/15 group-hover:to-accent/15 transition-all duration-300 group-hover:scale-110">
                <span className="text-base font-bold text-muted-foreground group-hover:text-primary transition-colors">
                  {integration.abbr}
                </span>
              </div>
              <p className="font-semibold text-foreground text-sm mb-1">{integration.name}</p>
              <p className="text-xs text-muted-foreground">{integration.type}</p>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center"
        >
          <p className="text-muted-foreground mb-5">Need a custom integration? Our API makes it possible.</p>
          <Button variant="dark" size="lg" className="group">
            View All Integrations
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
