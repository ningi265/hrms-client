import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";

const companies = [
  { name: "Tech Global", abbr: "TG" },
  { name: "Acme Corp", abbr: "AC" },
  { name: "Nexus Health", abbr: "NH" },
  { name: "Pinnacle Finance", abbr: "PF" },
  { name: "Vertex Solutions", abbr: "VS" },
  { name: "EcoTech", abbr: "ET" },
  { name: "Global Industries", abbr: "GI" },
  { name: "Smart Systems", abbr: "SS" },
  { name: "DataFlow", abbr: "DF" },
  { name: "CloudNine", abbr: "CN" },
  { name: "TechVista", abbr: "TV" },
  { name: "InnovateCo", abbr: "IC" },
];

export function TrustedBySection() {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible) return;

    let start = 0;
    const end = 500;
    const duration = 2000;
    const stepTime = 20;

    const timer = setInterval(() => {
      start += Math.ceil(end / (duration / stepTime));
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [isVisible]);

  return (
    <section ref={sectionRef} className="py-20 bg-card border-y border-border relative overflow-hidden">
      {/* Subtle gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/[0.02] via-transparent to-accent/[0.02]" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-3">
            Trusted by Industry Leaders
          </p>
          <p className="text-xl text-foreground font-medium">
            Join over <span className="font-bold text-primary">{count}+</span> companies transforming their procurement
          </p>
        </motion.div>

        {/* Marquee Container */}
        <div className="relative">
          {/* Gradient Masks */}
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-card to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-card to-transparent z-10" />
          
          {/* Marquee */}
          <div className="overflow-hidden">
            <div className="flex animate-marquee">
              {[...companies, ...companies].map((company, index) => (
                <div
                  key={`${company.name}-${index}`}
                  className="flex-shrink-0 mx-4"
                >
                  <div className="flex flex-col items-center justify-center p-5 rounded-2xl bg-background border border-border hover:border-primary/30 transition-all duration-300 group w-32">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-muted to-secondary flex items-center justify-center mb-3 group-hover:from-primary/10 group-hover:to-accent/10 transition-all duration-300 group-hover:scale-110">
                      <span className="text-sm font-bold text-muted-foreground group-hover:text-primary transition-colors">
                        {company.abbr}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground text-center font-medium group-hover:text-foreground transition-colors">
                      {company.name}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
