"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity, AlertTriangle, ArrowUpRight, Check, ChevronRight, Clock3,
  Droplets, GraduationCap, HeartPulse, Leaf, MapPin, Radio, Route,
  ShieldCheck, Sparkles, UtilityPole, Zap, Quote, TrendingDown, Building2
} from "lucide-react";

type ScenarioKey = "evacuate" | "wait" | "none";

const scenarios = {
  evacuate: {
    label: "Evacuate now", short: "Act now", tone: "safe", score: 34, lives: "1,840",
    confidence: 91, uncertainty: "Low", assumptionNote: "Evacuation begins within 45 minutes.",
    summary: "Early evacuation keeps the eastern corridor open and moves high-risk communities before peak flooding.",
    action: "Authorize phased evacuation of Sectors 4–7", cost: "$1.2M", exposure: "12%",
    memory: [
      "The eastern bridge remained open because evacuation began before the river crossed its threshold.",
      "Hospital occupancy stayed below 70%, preserving emergency capacity.",
      "More than 18,000 residents avoided direct flood exposure."
    ],
    outcomes: ["+1,600", "9 of 10", "64%", "94%", "420 ha", "$1.2M"],
    impacts: [18, 12, 26, 22, 15, 29],
    priority: ["Open Route A7 before 10:30", "Move hospital backup generators", "Pre-position water at Kalo Primary"],
    hours: [18, 24, 31, 38, 34, 29, 25],
  },
  wait: {
    label: "Wait 6 hours", short: "Delay 6h", tone: "warn", score: 68, lives: "930",
    confidence: 84, uncertainty: "Medium", assumptionNote: "Rainfall intensity remains within the current forecast band.",
    summary: "A six-hour delay reduces route capacity. Two low crossings become unavailable before evacuation completes.",
    action: "Prepare shelters; decision deadline 14:00", cost: "$2.8M", exposure: "43%",
    memory: [
      "Two major roads became inaccessible before the final evacuation buses cleared Sector 6.",
      "Emergency response slowed as traffic converged on the remaining northern route.",
      "Hospital occupancy reached 86%, leaving little capacity for a second surge."
    ],
    outcomes: ["+690", "6 of 10", "86%", "71%", "870 ha", "$2.8M"],
    impacts: [46, 38, 57, 61, 42, 55],
    priority: ["Stage buses at Sector 5", "Close the lower N2 crossing", "Issue mobile flood alert"],
    hours: [18, 28, 43, 58, 68, 72, 65],
  },
  none: {
    label: "No action", short: "No action", tone: "critical", score: 92, lives: "240",
    confidence: 88, uncertainty: "Medium", assumptionNote: "No additional emergency resources arrive during the 24-hour window.",
    summary: "Without intervention, flash flooding isolates three communities and overwhelms local response capacity.",
    action: "Emergency response becomes reactive", cost: "$8.6M", exposure: "81%",
    memory: [
      "Three communities were isolated after the eastern bridge closed overnight.",
      "Emergency response shifted from prevention to rescue as hospital capacity exceeded safe limits.",
      "Floodwater reached farms and water points, extending recovery by several weeks."
    ],
    outcomes: ["Baseline", "3 of 10", "118%", "38%", "1,740 ha", "$8.6M"],
    impacts: [76, 81, 88, 72, 84, 91],
    priority: ["Rescue access becomes limited", "Hospital reaches surge capacity", "Power isolation likely in Sector 6"],
    hours: [18, 31, 52, 74, 88, 92, 89],
  },
} as const;

const impactMeta = [
  [GraduationCap, "Schools", "14 facilities"],
  [HeartPulse, "Hospitals", "4 facilities"],
  [Route, "Roads", "186 km"],
  [Droplets, "Water", "8 systems"],
  [UtilityPole, "Power", "12 substations"],
  [Leaf, "Agriculture", "2,460 ha"],
] as const;

const times = ["Now", "+4h", "+8h", "+12h", "+16h", "+20h", "+24h"];

function scoreColor(value: number) {
  return value < 40 ? "var(--green)" : value < 75 ? "var(--amber)" : "var(--red)";
}

export default function Home() {
  const [selected, setSelected] = useState<ScenarioKey>("evacuate");
  const [hour, setHour] = useState(8);
  const [calculating, setCalculating] = useState(false);
  const active = scenarios[selected];
  const timelineIndex = Math.min(6, Math.round(hour / 4));
  const currentRisk = active.hours[timelineIndex];
  const avoided = scenarios.none.score - active.score;

  const comparison = useMemo(() => (Object.entries(scenarios) as [ScenarioKey, typeof active][]), [active]);

  useEffect(() => {
    setCalculating(true);
    const timer = window.setTimeout(() => setCalculating(false), 520);
    return () => window.clearTimeout(timer);
  }, [selected]);

  return (
    <main>
      <header className="topbar">
        <div className="brand">
          <div className="brandmark"><span /></div>
          <div><b>FutureEcho</b><em>AI</em></div>
        </div>
        <div className="event-title">
          <span className="live-dot" /> MANDERA FLOOD RESPONSE
          <span className="event-id">DECISION WINDOW 08:00–14:00 EAT</span>
        </div>
        <div className="header-actions">
          <button className="icon-btn" aria-label="Live monitoring"><Radio size={17} /></button>
          <div className="avatar">AO</div>
        </div>
      </header>

      <section className="hero">
        <div>
          <div className="eyebrow"><Sparkles size={14} /> AI FUTURES EXPLORER · FLOOD EVENT 072</div>
          <h1>Don’t predict one future.<br /><span>Choose a better one.</span></h1>
          <p>FutureEcho simulates the consequences of a decision—before it becomes irreversible.</p>
        </div>
        <div className="decision-clock">
          <Clock3 size={18} />
          <div><span>Critical decision window</span><strong>05:42:18</strong></div>
        </div>
      </section>

      <section className="futures-explorer">
        <div className="explorer-head">
          <div>
            <span className="section-kicker">DECISION POINT · 08:18 EAT</span>
            <h2>Compare the next 24 hours</h2>
          </div>
          <p>Select a future to inspect the chain of consequences</p>
        </div>
        <div className="now-node">
          <span>NOW</span>
          <strong>River at 4.8m and rising</strong>
          <small>18,420 people exposed · 6 hours to threshold</small>
        </div>
        <div className="branch-lines" aria-hidden="true"><i /><i /><i /></div>
        <div className="scenario-grid">
          {comparison.map(([key, item], i) => (
            <motion.button
              key={key}
              whileHover={{ y: -3 }}
              onClick={() => setSelected(key)}
              className={`scenario-card ${selected === key ? "selected" : ""} ${item.tone}`}
              aria-pressed={selected === key}
            >
              <div className="scenario-top">
                <span className="option-index">FUTURE {String.fromCharCode(65 + i)}</span>
                {selected === key && <span className="selected-pill"><Check size={12} /> INSPECTING</span>}
              </div>
              <div className="scenario-name">{item.label}</div>
              <div className="future-outcome">
                <div><span>Population risk</span><strong style={{ color: scoreColor(item.score) }}>{item.score}<small>/100</small></strong></div>
                <div><span>Road access</span><strong>{100 - item.impacts[2]}%</strong></div>
                <div><span>Hospital load</span><strong>{item.impacts[1]}%</strong></div>
              </div>
              <div className="future-verdict" style={{ borderColor: scoreColor(item.score) }}>
                <Activity size={14} />
                <span>{key === "evacuate" ? "1,600 more people protected" : key === "wait" ? "Two crossings lost by +8h" : "Response capacity exceeded"}</span>
              </div>
              <div className="scenario-footer"><span>People protected</span><b>{item.lives}</b></div>
            </motion.button>
          ))}
        </div>
        <div className="comparison-ruler">
          <span>LOWER HUMAN IMPACT</span><i /><b>Decision changes outcome by 58 risk points</b><i /><span>HIGHER HUMAN IMPACT</span>
        </div>
      </section>

      <section className="memory-section" aria-live="polite" aria-busy={calculating}>
        <AnimatePresence mode="wait">
          <motion.div
            className={`future-memory ${active.tone}`}
            key={`memory-${selected}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: .28 }}
          >
            <div className="memory-label"><Quote size={15} /> FUTURE MEMORY · GENERATED FROM {active.label.toUpperCase()}</div>
            <div className="memory-time">
              <span>24</span>
              <div><strong>hours later…</strong><small>A dispatch from tomorrow</small></div>
            </div>
            <div className="memory-copy">
              {active.memory.map((line, i) => (
                <motion.p key={line} initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: .08 + i * .09 }}>
                  <i>{String(i + 1).padStart(2, "0")}</i>{line}
                </motion.p>
              ))}
            </div>
            <div className="memory-foot">
              <span><Sparkles size={12} /> AI-simulated retrospective</span>
              <small>This memory has not happened yet. Your decision determines whether it does.</small>
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="difference-panel">
          <div className="difference-head">
            <div><span className="section-kicker">OUTCOME DIFFERENCE</span><h2>Compared with no action</h2></div>
            <div className="delta-badge"><TrendingDown size={14} /> {avoided} risk points</div>
          </div>
          <div className="difference-grid">
            {[
              [ShieldCheck, "Lives protected", active.outcomes[0], "people"],
              [Route, "Roads remaining open", active.outcomes[1], "critical routes"],
              [HeartPulse, "Hospital capacity", active.outcomes[2], "projected occupancy"],
              [Droplets, "Water access", active.outcomes[3], "population served"],
              [Leaf, "Agricultural impact", active.outcomes[4], "land affected"],
              [Building2, "Economic loss", active.outcomes[5], "estimated"],
            ].map(([Icon, label, value, note]) => (
              <motion.div className="difference-item" key={String(label)} layout>
                <div className="diff-icon">{typeof Icon !== "string" && <Icon size={15} />}</div>
                <span>{label as string}<small>{note as string}</small></span>
                <strong>{value as string}</strong>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="confidence-layer">
        <div className="confidence-summary">
          <div className="confidence-title">
            <div className="trust-icon"><ShieldCheck size={20} /></div>
            <div><span className="section-kicker">DECISION CONFIDENCE</span><h2>Why the model believes this future</h2></div>
          </div>
          <div className="confidence-score">
            <span>AI CONFIDENCE</span><strong>{active.confidence}<small>%</small></strong>
            <div className="confidence-track"><motion.i animate={{ width: `${active.confidence}%` }} /></div>
          </div>
          <div className={`uncertainty ${active.uncertainty.toLowerCase()}`}>
            <span>UNCERTAINTY</span><strong>{active.uncertainty}</strong><small>Model spread at +24h</small>
          </div>
        </div>
        <div className="confidence-details">
          <div>
            <span>DATA SOURCES USED</span>
            <ul>
              {["ICPAC hazard forecast", "County road network", "Population density", "Hospital capacity", "Historical flood patterns"].map(source => <li key={source}><Check size={11} />{source}</li>)}
            </ul>
          </div>
          <div>
            <span>MODEL ASSUMPTIONS</span>
            <ul className="assumptions">
              <li>Rainfall follows the current forecast.</li>
              <li>Roads remain open until predicted closure.</li>
              <li>{active.assumptionNote}</li>
            </ul>
          </div>
          <div className="confidence-note">
            <AlertTriangle size={15} />
            <p><strong>Decision support, not certainty.</strong> FutureEcho exposes assumptions so coordinators can challenge the model before acting.</p>
          </div>
        </div>
        <AnimatePresence>
          {calculating && <motion.div className="recalculating" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Sparkles size={14} /><span>Recomputing evidence chain…</span><i />
          </motion.div>}
        </AnimatePresence>
      </section>

      <section className="workspace">
        <div className="map-panel">
          <div className="panel-head">
            <div><span className="section-kicker">PROJECTED AT +{hour} HOURS</span><h2>Impact footprint</h2></div>
            <div className="map-legend"><span><i className="safe-dot" />Safe</span><span><i className="warn-dot" />At risk</span><span><i className="critical-dot" />Critical</span></div>
          </div>
          <div className={`map-stage ${active.tone}`}>
            <div className="map-grid" />
            <div className="river river-one" /><div className="river river-two" />
            <div className="road road-one" /><div className="road road-two" />
            <div className="zone zone-a" /><div className="zone zone-b" /><div className="zone zone-c" />
            <div className="map-label label-a"><MapPin size={12} /> RHAMU</div>
            <div className="map-label label-b"><MapPin size={12} /> ELWAK</div>
            <div className="map-label label-c"><MapPin size={12} /> MANDERA</div>
            <div className="route-line"><span /><span /><span /><span /></div>
            <motion.div
              className="forecast-wave"
              key={`${selected}-${hour}`}
              initial={{ opacity: 0, scale: .8 }}
              animate={{ opacity: .7, scale: 1 }}
            />
            <div className="map-callout">
              <span>EXPECTED EXPOSURE</span>
              <strong>{active.exposure}</strong>
              <small>of population</small>
            </div>
            <div className="map-controls"><button aria-label="Zoom in">+</button><button aria-label="Zoom out">−</button></div>
          </div>
          <div className="time-control">
            <div className="time-labels"><span>NOW</span><strong>+{hour} HOURS</strong><span>+24H</span></div>
            <input aria-label="Forecast hour" type="range" min="0" max="24" step="4" value={hour} onChange={e => setHour(Number(e.target.value))} />
            <div className="timeline-dots">{times.map((t, i) => <span key={t} className={i <= timelineIndex ? "past" : ""}>{t}</span>)}</div>
          </div>
        </div>

        <aside className="briefing">
          <div className="brief-head">
            <div className="ai-orb"><Sparkles size={18} /></div>
            <div><span>AI BRIEFING</span><small>Updated for +{hour}h forecast</small></div>
            <span className="confidence">{active.confidence}% confidence</span>
          </div>
          <AnimatePresence mode="wait">
            <motion.div key={`${selected}-${hour}`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div className="risk-readout">
                <div className="risk-ring" style={{ "--score": currentRisk, "--ring": scoreColor(currentRisk) } as React.CSSProperties}>
                  <strong>{currentRisk}</strong><span>/100</span>
                </div>
                <div><span>PROJECTED RISK</span><h3 style={{ color: scoreColor(currentRisk) }}>{currentRisk < 40 ? "MANAGEABLE" : currentRisk < 75 ? "SEVERE" : "CRITICAL"}</h3>
                <small>{avoided > 0 ? `${avoided} points lower than no action` : "Maximum projected exposure"}</small></div>
              </div>
              <p className="brief-summary">{active.summary}</p>
              <div className="recommendation">
                <span>RECOMMENDED DECISION</span>
                <strong>{active.action}</strong>
                <div><span>Estimated response cost</span><b>{active.cost}</b></div>
              </div>
              <div className="priorities">
                <span>TOP PRIORITIES</span>
                {active.priority.map((p, i) => <div key={p}><i>{i + 1}</i><p>{p}</p><ChevronRight size={15} /></div>)}
              </div>
              <button className="brief-btn">Open full action brief <ArrowUpRight size={16} /></button>
            </motion.div>
          </AnimatePresence>
        </aside>
      </section>

      <section className="impact-section">
        <div className="section-title">
          <div><span className="section-kicker">COMMUNITY IMPACT</span><h2>What changes on the ground</h2></div>
          <span className="scenario-context">Scenario: <b>{active.label}</b></span>
        </div>
        <div className="impact-grid">
          {impactMeta.map(([Icon, name, count], i) => {
            const value = active.impacts[i];
            return <motion.div layout className="impact-card" key={name}>
              <div className="impact-icon"><Icon size={19} /></div>
              <div className="impact-main"><span>{name}</span><small>{count}</small></div>
              <div className="impact-value"><strong style={{ color: scoreColor(value) }}>{value}%</strong><small>affected</small></div>
              <div className="impact-bar"><motion.i animate={{ width: `${value}%` }} style={{ background: scoreColor(value) }} /></div>
            </motion.div>;
          })}
        </div>
      </section>

      <footer>
        <div><ShieldCheck size={15} /> Decision support only · Model FE-2.6 · Data refreshed 2 min ago</div>
        <span>ICPAC Climate Intelligence Prototype</span>
      </footer>
    </main>
  );
}
