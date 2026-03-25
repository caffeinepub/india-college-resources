import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";
import {
  BookOpen,
  GraduationCap,
  MapPin,
  Menu,
  Search,
  Shield,
  X,
} from "lucide-react";
import { useState } from "react";
import type { College, Subject } from "./backend";
import { AdminPage } from "./pages/AdminPage";
import { CollegeDetailPage } from "./pages/CollegeDetailPage";
import { HomePage } from "./pages/HomePage";
import { SearchPage } from "./pages/SearchPage";
import { StateDetailPage } from "./pages/StateDetailPage";
import { StatesPage } from "./pages/StatesPage";
import { SubjectDetailPage } from "./pages/SubjectDetailPage";
import { YearDetailPage } from "./pages/YearDetailPage";

type PageName =
  | "home"
  | "states"
  | "state-detail"
  | "college-detail"
  | "year-detail"
  | "subject-detail"
  | "search"
  | "admin";

interface NavParams {
  state?: string;
  college?: College;
  year?: bigint;
  subject?: Subject;
}

const NAV_LINKS = [
  { id: "home", label: "Home", icon: GraduationCap },
  { id: "states", label: "States", icon: MapPin },
  { id: "search", label: "Search", icon: Search },
  { id: "admin", label: "Admin", icon: Shield },
];

export default function App() {
  const [page, setPage] = useState<PageName>("home");
  const [params, setParams] = useState<NavParams>({});
  const [menuOpen, setMenuOpen] = useState(false);

  const navigate = (newPage: string, newParams?: Record<string, unknown>) => {
    setPage(newPage as PageName);
    setParams((newParams as NavParams) ?? {});
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const renderPage = () => {
    switch (page) {
      case "home":
        return <HomePage onNavigate={navigate} />;
      case "states":
        return <StatesPage onNavigate={navigate} />;
      case "state-detail":
        return params.state ? (
          <StateDetailPage state={params.state} onNavigate={navigate} />
        ) : (
          <StatesPage onNavigate={navigate} />
        );
      case "college-detail":
        return params.college ? (
          <CollegeDetailPage college={params.college} onNavigate={navigate} />
        ) : (
          <StatesPage onNavigate={navigate} />
        );
      case "year-detail":
        return params.college && params.year !== undefined ? (
          <YearDetailPage
            college={params.college}
            year={params.year}
            onNavigate={navigate}
          />
        ) : (
          <StatesPage onNavigate={navigate} />
        );
      case "subject-detail":
        return params.college && params.year !== undefined && params.subject ? (
          <SubjectDetailPage
            college={params.college}
            year={params.year}
            subject={params.subject}
            onNavigate={navigate}
          />
        ) : (
          <StatesPage onNavigate={navigate} />
        );
      case "search":
        return <SearchPage onNavigate={navigate} />;
      case "admin":
        return <AdminPage />;
      default:
        return <HomePage onNavigate={navigate} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-border shadow-xs">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate("home")}
            className="flex items-center gap-2 font-extrabold text-xl text-primary"
            data-ocid="nav.home.link"
          >
            <GraduationCap className="h-6 w-6" />
            EduBharat
          </button>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <button
                type="button"
                key={link.id}
                onClick={() => navigate(link.id)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  page === link.id ||
                  (
                    page.startsWith(link.id.replace("home", "")) &&
                      link.id !== "home"
                  )
                    ? "bg-primary text-white"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
                data-ocid={`nav.${link.id}.link`}
              >
                <link.icon className="h-4 w-4" />
                {link.label}
              </button>
            ))}
          </nav>

          {/* Mobile menu toggle */}
          <button
            type="button"
            className="md:hidden p-2 rounded-lg hover:bg-muted"
            onClick={() => setMenuOpen(!menuOpen)}
            data-ocid="nav.menu_toggle.button"
          >
            {menuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-border bg-white px-4 py-3 flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <button
                type="button"
                key={link.id}
                onClick={() => navigate(link.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors text-left ${
                  page === link.id
                    ? "bg-primary text-white"
                    : "text-muted-foreground hover:bg-muted"
                }`}
                data-ocid={`nav.mobile.${link.id}.link`}
              >
                <link.icon className="h-4 w-4" />
                {link.label}
              </button>
            ))}
          </div>
        )}
      </header>

      {/* Main */}
      <main className="flex-1">{renderPage()}</main>

      {/* Footer */}
      <footer className="bg-navy text-white mt-auto">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 font-extrabold text-xl mb-3">
                <GraduationCap className="h-6 w-6 text-blue-400" />
                EduBharat
              </div>
              <p className="text-sm text-blue-200 leading-relaxed">
                India's most comprehensive academic resource platform for
                college students across all states.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-3 text-blue-100">Quick Links</h3>
              <ul className="space-y-2">
                {NAV_LINKS.map((link) => (
                  <li key={link.id}>
                    <button
                      type="button"
                      onClick={() => navigate(link.id)}
                      className="text-sm text-blue-300 hover:text-white transition-colors"
                      data-ocid={`footer.${link.id}.link`}
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3 text-blue-100">Features</h3>
              <ul className="space-y-2 text-sm text-blue-300">
                <li className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" /> Notes & Study Materials
                </li>
                <li className="flex items-center gap-2">
                  <Search className="h-4 w-4" /> Previous Year Papers
                </li>
                <li className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" /> 37 States & UTs
                </li>
                <li className="flex items-center gap-2">
                  <GraduationCap className="h-4 w-4" /> 1000+ Colleges
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-blue-900 pt-6 text-center">
            <p className="text-sm text-blue-400">
              © {new Date().getFullYear()}. Built with ❤️ using{" "}
              <a
                href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-white transition-colors"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </footer>

      <Toaster />
    </div>
  );
}
