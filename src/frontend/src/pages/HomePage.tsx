import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  BookOpen,
  Building2,
  Download,
  FileText,
  GraduationCap,
  MapPin,
  Search,
} from "lucide-react";
import { motion } from "motion/react";

interface HomePageProps {
  onNavigate: (page: string, params?: Record<string, unknown>) => void;
}

const STATS = [
  {
    label: "Colleges",
    value: "1,000+",
    icon: Building2,
    color: "text-blue-600",
  },
  { label: "States & UTs", value: "37", icon: MapPin, color: "text-green-600" },
  {
    label: "Subjects",
    value: "5,000+",
    icon: BookOpen,
    color: "text-purple-600",
  },
  {
    label: "Resources",
    value: "20,000+",
    icon: FileText,
    color: "text-orange-600",
  },
];

const HOW_TO_STEPS = [
  {
    step: "01",
    title: "Select Your State",
    desc: "Choose from all 37 Indian states and union territories.",
    icon: MapPin,
  },
  {
    step: "02",
    title: "Find Your College",
    desc: "Browse or search for your institution by name or type.",
    icon: Building2,
  },
  {
    step: "03",
    title: "Pick Year & Subject",
    desc: "Navigate to the academic year and specific subject.",
    icon: GraduationCap,
  },
  {
    step: "04",
    title: "Download Resources",
    desc: "Access notes and previous year papers instantly.",
    icon: Download,
  },
];

const EXPLORE_CARDS = [
  {
    title: "IITs",
    desc: "Indian Institutes of Technology",
    color: "bg-blue-50 border-blue-200",
    badge: "bg-blue-600",
    nav: "states",
  },
  {
    title: "NITs",
    desc: "National Institutes of Technology",
    color: "bg-green-50 border-green-200",
    badge: "bg-green-600",
    nav: "states",
  },
  {
    title: "AIIMS",
    desc: "Medical excellence institutes",
    color: "bg-red-50 border-red-200",
    badge: "bg-red-600",
    nav: "states",
  },
  {
    title: "State Universities",
    desc: "Public universities across India",
    color: "bg-cyan-50 border-cyan-200",
    badge: "bg-cyan-600",
    nav: "states",
  },
  {
    title: "Arts & Science",
    desc: "Liberal arts and pure sciences",
    color: "bg-purple-50 border-purple-200",
    badge: "bg-purple-600",
    nav: "states",
  },
  {
    title: "Management",
    desc: "Business and management schools",
    color: "bg-orange-50 border-orange-200",
    badge: "bg-orange-600",
    nav: "states",
  },
];

export function HomePage({ onNavigate }: HomePageProps) {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-hero-bg py-20 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
              <GraduationCap className="h-4 w-4" />
              India's Largest Academic Resource Hub
            </span>
            <h1 className="text-4xl md:text-6xl font-extrabold text-foreground mb-6 leading-tight">
              Notes & Papers for
              <br />
              <span className="text-primary">Every College in India</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10">
              Access study notes and previous year question papers for thousands
              of colleges across all 37 states and union territories of India.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                size="lg"
                className="rounded-full px-8 gap-2"
                onClick={() => onNavigate("states")}
                data-ocid="home.primary_button"
              >
                Explore States <ArrowRight className="h-4 w-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="rounded-full px-8 gap-2"
                onClick={() => onNavigate("search")}
                data-ocid="home.secondary_button"
              >
                <Search className="h-4 w-4" /> Search Resources
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white border-y border-border">
        <div className="max-w-5xl mx-auto px-4 py-10 grid grid-cols-2 md:grid-cols-4 gap-6">
          {STATS.map((stat) => (
            <div key={stat.label} className="text-center">
              <stat.icon className={`h-7 w-7 mx-auto mb-2 ${stat.color}`} />
              <p className="text-3xl font-bold text-foreground">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Explore Cards */}
      <section className="max-w-5xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Browse by Institution Type
        </h2>
        <p className="text-muted-foreground mb-8">
          Find resources for your specific type of college
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {EXPLORE_CARDS.map((card, idx) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08 }}
              onClick={() => onNavigate(card.nav)}
              className={`p-5 rounded-xl border cursor-pointer hover:shadow-card transition-all ${card.color}`}
              data-ocid={`home.explore_card.${idx + 1}`}
            >
              <span
                className={`inline-block w-3 h-3 rounded-full ${card.badge} mb-3`}
              />
              <h3 className="font-semibold text-foreground">{card.title}</h3>
              <p className="text-sm text-muted-foreground mt-1">{card.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How To */}
      <section className="bg-hero-bg py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-foreground mb-2 text-center">
            How It Works
          </h2>
          <p className="text-muted-foreground mb-12 text-center">
            Four simple steps to find what you need
          </p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {HOW_TO_STEPS.map((step, idx) => (
              <div key={step.step} className="text-center">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <step.icon className="h-6 w-6 text-primary" />
                </div>
                <span className="text-xs font-bold text-primary uppercase tracking-widest">
                  {step.step}
                </span>
                <h3 className="font-semibold text-foreground mt-1 mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-muted-foreground">{step.desc}</p>
                {idx < HOW_TO_STEPS.length - 1 && (
                  <div className="hidden md:block mt-6">
                    <ArrowRight className="h-5 w-5 text-muted-foreground mx-auto" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
