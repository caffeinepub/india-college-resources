import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { STATES_AND_UTS, STATE_EMOJI } from "../data/indiaData";

interface StatesPageProps {
  onNavigate: (page: string, params?: Record<string, unknown>) => void;
}

export function StatesPage({ onNavigate }: StatesPageProps) {
  const [search, setSearch] = useState("");

  const filtered = STATES_AND_UTS.filter((s) =>
    s.toLowerCase().includes(search.toLowerCase()),
  );

  // Split into states (first 28) and UTs (last 9)
  const states = filtered.filter((s) => STATES_AND_UTS.indexOf(s) < 28);
  const uts = filtered.filter((s) => STATES_AND_UTS.indexOf(s) >= 28);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Select Your State
        </h1>
        <p className="text-muted-foreground">
          Choose a state or union territory to explore colleges
        </p>
      </div>

      <div className="relative max-w-md mb-10">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          className="pl-9 rounded-full"
          placeholder="Search states..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          data-ocid="states.search_input"
        />
      </div>

      {states.length > 0 && (
        <div className="mb-10">
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <span className="w-1 h-5 bg-primary rounded-full" />
            States
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {states.map((state, idx) => (
              <motion.button
                key={state}
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.02 }}
                onClick={() => onNavigate("state-detail", { state })}
                className="flex items-center gap-3 p-4 rounded-xl border border-border bg-card hover:border-primary hover:shadow-card transition-all text-left"
                data-ocid={`states.state.item.${idx + 1}`}
              >
                <span className="text-2xl">{STATE_EMOJI[state] ?? "🏛️"}</span>
                <span className="text-sm font-medium text-foreground leading-tight">
                  {state}
                </span>
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {uts.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <span className="w-1 h-5 bg-green-500 rounded-full" />
            Union Territories
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {uts.map((state, idx) => (
              <motion.button
                key={state}
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.02 }}
                onClick={() => onNavigate("state-detail", { state })}
                className="flex items-center gap-3 p-4 rounded-xl border border-border bg-card hover:border-primary hover:shadow-card transition-all text-left"
                data-ocid={`states.ut.item.${idx + 1}`}
              >
                <span className="text-2xl">{STATE_EMOJI[state] ?? "🏛️"}</span>
                <span className="text-sm font-medium text-foreground leading-tight">
                  {state}
                </span>
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {filtered.length === 0 && (
        <div
          className="text-center py-20 text-muted-foreground"
          data-ocid="states.empty_state"
        >
          <p className="text-lg">No states found for "{search}"</p>
        </div>
      )}
    </div>
  );
}
