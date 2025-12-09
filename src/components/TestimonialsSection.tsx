import { Star, Award, Quote } from "lucide-react";
import { motion } from "framer-motion";

const testimonials = [
  {
    quote: "NexusMWI has revolutionized our procurement processes. We've reduced cycle times by 65% and improved vendor relationships significantly.",
    author: "Sarah Banda",
    position: "Chief Procurement Officer",
    company: "Global Tech Inc.",
    industry: "Technology",
    employees: "5,000+",
    savings: "$1.2M annually",
    rating: 5,
    avatar: "SB",
  },
  {
    quote: "The vendor management module has been a game-changer. We can now track performance metrics in real-time and make data-driven decisions.",
    author: "Michael Kaunda",
    position: "Supply Chain Director",
    company: "Nexus Manufacturing",
    industry: "Manufacturing",
    employees: "2,500+",
    savings: "$800K annually",
    rating: 5,
    avatar: "MK",
  },
  {
    quote: "Implementation was seamless, and the support team was exceptional. The system pays for itself through efficiency gains alone.",
    author: "Priya Patel",
    position: "CFO",
    company: "Horizon Healthcare",
    industry: "Healthcare",
    employees: "3,200+",
    savings: "$950K annually",
    rating: 5,
    avatar: "PP",
  },
];

export function TestimonialsSection() {
  return (
    <section
      id="testimonials"
      className="py-24 lg:py-32 bg-foreground relative overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 noise" />
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[150px]" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-accent/10 rounded-full blur-[120px]" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-primary/20 text-primary-foreground px-4 py-2 rounded-full text-sm font-medium mb-6 backdrop-blur-sm border border-primary-foreground/10">
            <Award className="w-4 h-4" />
            <span>Client Success Stories</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary-foreground mb-6 tracking-tight">
            What Our Clients Say
          </h2>
          <p className="text-lg text-primary-foreground/70 max-w-2xl mx-auto leading-relaxed">
            Join hundreds of satisfied organizations that have transformed their procurement process with measurable results.
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.author}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="bg-card rounded-2xl p-6 shadow-2xl hover:shadow-3xl transition-all duration-500 border border-border/50"
            >
              {/* Rating */}
              <div className="flex items-center gap-1 mb-5">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-metric-amber fill-metric-amber" />
                ))}
              </div>

              {/* Quote */}
              <div className="relative mb-6">
                <Quote className="w-10 h-10 text-primary/15 absolute -top-2 -left-1" />
                <p className="text-muted-foreground leading-relaxed pl-6 text-[15px]">
                  "{testimonial.quote}"
                </p>
              </div>

              {/* Author */}
              <div className="border-t border-border pt-5">
                <div className="flex items-center gap-4 mb-5">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
                    <span className="text-primary-foreground font-bold text-lg">{testimonial.avatar}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{testimonial.author}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.position}</p>
                    <p className="text-sm text-primary font-medium">{testimonial.company}</p>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-secondary/50 rounded-xl p-3 text-center">
                    <p className="text-xs text-muted-foreground mb-0.5">Industry</p>
                    <p className="text-sm font-semibold text-foreground">{testimonial.industry}</p>
                  </div>
                  <div className="bg-secondary/50 rounded-xl p-3 text-center">
                    <p className="text-xs text-muted-foreground mb-0.5">Employees</p>
                    <p className="text-sm font-semibold text-foreground">{testimonial.employees}</p>
                  </div>
                  <div className="col-span-2 bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl p-3 text-center border border-primary/20">
                    <p className="text-xs text-muted-foreground mb-0.5">Annual Savings</p>
                    <p className="text-lg font-bold text-primary">{testimonial.savings}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
