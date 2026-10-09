import { useEffect, useState, type ReactNode } from "react"
import {
  anomaly,
  baseline,
  copilotAnswers,
  demoStates,
  devices,
  evidence,
  getCopilotAnswer,
  prediction,
  primaryDevice,
  readings,
  reminderSettings,
  sessions,
  type DeviceId,
  type SessionId,
} from "./mockData"

type Tab = "home" | "intelligence" | "history" | "devices" | "settings"
type Screen = Tab | "insight" | "baseline" | "prediction" | "charging" | "copilot"
type IconName = "home" | "spark" | "chart" | "devices" | "settings" | "chevron" | "arrow" | "bolt" | "shield" | "clock" | "info" | "send" | "phone" | "laptop" | "tablet" | "bell"

const navItems: { id: Tab label: string icon: IconName }[] = [
  { id: "home", label: "Home", icon: "home" },
  { id: "intelligence", label: "Intelligence", icon: "spark" },
  { id: "history", label: "History", icon: "chart" },
  { id: "devices", label: "Devices", icon: "devices" },
  { id: "settings", label: "Settings", icon: "settings" },
]

function BrandMark({ lockup = false }: { lockup?: boolean }) {
  return <span className={`brand ${lockup ? "brand-lockup" : ""}`}>
    <svg className="brand-mark" viewBox="0 0 24 24" aria-hidden="true">
      <rect x="2.5" y="6.5" width="16" height="11" rx="3" />
      <path d="M18.5 10h2.4v4h-2.4" />
      <circle cx="11" cy="12" r="5.2" />
      <path className="brand-trace" d="M6.8 12h2l1.2-2.2 2.1 4.1 1.2-1.9h2" />
    </svg>
    {lockup && <span>BatteryLens</span>}
  </span>
}

function Icon({ name, size = 20 }: { name: IconName size?: number }) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  }
  const paths: Record<IconName, ReactNode> = {
    home: (
      <>
        <path d="m3 11 9-8 9 8" />
        <path d="M5 10v10h14V10M9 20v-6h6v6" />
      </>
    ),
    spark: (
      <>
        <path d="m12 2 1.4 5.1L18 9l-4.6 1.9L12 16l-1.4-5.1L6 9l4.6-1.9L12 2Z" />
        <path d="m19 15 .7 2.3L22 18l-2.3.7L19 21l-.7-2.3L16 18l2.3-.7L19 15Z" />
      </>
    ),
    chart: (
      <>
        <path d="M4 19V5" />
        <path d="M4 19h16" />
        <path d="m7 15 4-5 3 2 5-7" />
      </>
    ),
    devices: (
      <>
        <rect x="3" y="4" width="13" height="16" rx="2" />
        <path d="M7 17h5M19 8h2v9a2 2 0 0 1-2 2" />
      </>
    ),
    settings: (
      <>
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.8 2.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.2h-4V21a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1L4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9A1.7 1.7 0 0 0 3 14H3v-4h.2a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.9L4.2 7 7 4.2l.1.1a1.7 1.7 0 0 0 1.9.3A1.7 1.7 0 0 0 10 3V3h4v.2a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1L19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.2v4H21a1.7 1.7 0 0 0-1.6 1Z" />
      </>
    ),
    chevron: <path d="m9 18 6-6-6-6" />,
    arrow: (
      <>
        <path d="m15 18-6-6 6-6" />
        <path d="M9 12h10" />
      </>
    ),
    bolt: <path d="m13 2-8 12h7l-1 8 8-12h-7l1-8Z" />,
    shield: (
      <>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
        <path d="m9 12 2 2 4-4" />
      </>
    ),
    clock: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </>
    ),
    info: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 11v5M12 8h.01" />
      </>
    ),
    send: (
      <>
        <path d="m22 2-7 20-4-9-9-4 20-7Z" />
        <path d="M22 2 11 13" />
      </>
    ),
    phone: (
      <>
        <rect x="6" y="2" width="12" height="20" rx="3" />
        <path d="M10 18h4" />
      </>
    ),
    laptop: (
      <>
        <rect x="4" y="4" width="16" height="12" rx="2" />
        <path d="M2 20h20M9 20v-1h6v1" />
      </>
    ),
    tablet: (
      <>
        <rect x="5" y="2" width="14" height="20" rx="2" />
        <path d="M11 18h2" />
      </>
    ),
    bell: (
      <>
        <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
        <path d="M10 21h4" />
      </>
    ),
  }
  return <svg {...common}>{paths[name]}</svg>
}

function Action({
  children,
  onClick,
  variant = "primary",
  className = "",
  label,
}: {
  children: ReactNode
  onClick?: () => void
  variant?: "primary" | "secondary" | "ghost"
  className?: string
  label?: string
}) {
  return (
    <button
      className={`action action-${variant} ${className}`}
      onClick={onClick}
      aria-label={label}
    >
      {children}
    </button>
  )
}

function Tag({
  children,
  tone = "default",
}: {
  children: ReactNode
  tone?: "default" | "cyan" | "green" | "amber" | "violet"
}) {
  return <span className={`tag tag-${tone}`}>{children}</span>
}

function Header({
  title,
  subtitle,
  onBack,
  action,
}: {
  title: ReactNode
  subtitle?: string
  onBack?: () => void
  action?: ReactNode
}) {
  return (
    <header className="page-header">
      <div className="header-row">
        {onBack && (
          <Action
            variant="ghost"
            className="icon-action"
            onClick={onBack}
            label="Go back"
          >
            <Icon name="arrow" />
          </Action>
        )}
        <div className="header-copy">
          {subtitle && <p className="eyebrow">{subtitle}</p>}
          <h1>{title}</h1>
        </div>
        {action}
      </div>
    </header>
  )
}

function MiniChart({ forecast = false }: { forecast?: boolean }) {
  const [selected, setSelected] = useState(false)
  return (
    <button
      className={`chart-interactive ${selected ? "selected" : ""}`}
      onClick={() => setSelected(!selected)}
      aria-label={`${forecast ? "Prediction" : "Battery behavior"} chart. Tap for contextual values.`}
    >
      {selected && (
        <span className="chart-tooltip">
          <small>{forecast ? "Estimated · 6:00 PM" : "Observed · 1:42 PM"}</small>
          <strong>{forecast ? "54–61% possible range" : "8.7% per hour"}</strong>
        </span>
      )}
      <svg
        className="mini-chart"
        viewBox="0 0 320 110"
        role="img"
        aria-label={
          forecast
            ? "Observed and estimated battery trend"
            : "Battery behavior chart"
        }
      >
        <defs>
          <linearGradient
            id={forecast ? "areaForecast" : "area"}
            x1="0"
            y1="0"
            x2="0"
            y2="1"
          >
            <stop offset="0" stopColor="var(--cyan)" stopOpacity=".28" />
            <stop offset="1" stopColor="var(--cyan)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <g className="grid-lines">
          <path d="M0 18h320M0 54h320M0 90h320" />
        </g>
        {forecast && (
          <path
            className="uncertainty"
            d="M184 52C220 45 250 48 320 66L320 94C264 80 229 76 184 71Z"
          />
        )}
        <path
          className="chart-area"
          fill={`url(#${forecast ? "areaForecast" : "area"})`}
          d="M0 93C30 88 48 69 75 73S112 60 140 63s31-7 45-12v59H0Z"
        />
        <path
          className="observed-line"
          d="M0 93C30 88 48 69 75 73S112 60 140 63s31-7 45-12"
        />
        {forecast && (
          <path
            className="forecast-line"
            d="M185 51c37 1 58 8 79 18s35 7 56 12"
          />
        )}
        {!forecast && (
          <>
            <path
              className="baseline-line"
              d="M0 83C40 77 64 72 100 70s69-8 100-13 72-9 120-17"
            />
            <circle className="chart-dot" cx="185" cy="51" r={selected ? "6" : "4"} />
          </>
        )}
        {selected && <path className="selection-line" d="M185 12v84" />}
      </svg>
    </button>
  )
}

function BatteryRing({ level = primaryDevice.level }: { level?: number }) {
  return (
    <div className="battery-ring" aria-label={`Battery level ${level} percent`}>
      <svg viewBox="0 0 120 120">
        <circle className="ring-ticks" cx="60" cy="60" r="57" pathLength="100" />
        <circle className="ring-track" cx="60" cy="60" r="51" />
        <circle
          className="ring-value"
          cx="60"
          cy="60"
          r="51"
          pathLength="100"
        />
        <circle className="ring-energy" cx="60" cy="60" r="51" pathLength="100" />
      </svg>
      <div className="ring-content">
        <Icon name="bolt" size={17} />
        <strong>{level}</strong>
        <span>%</span>
      </div>
    </div>
  )
}

function Home({ go }: { go: (screen: Screen) => void }) {
  return (
    <div className="screen-content home-screen">
      <Header
        subtitle="Battery intelligence"
        title={<BrandMark lockup />}
        action={
          <div className="header-actions">
            <Action
              variant="ghost"
              className="icon-action ai-orb"
              onClick={() => go("copilot")}
              label="Open AI Copilot"
            >
              <Icon name="spark" />
            </Action>
            <Action
              variant="ghost"
              className="icon-action"
              onClick={() => go("settings")}
              label="Open settings"
            >
              <Icon name="settings" />
            </Action>
          </div>
        }
      />

      <section className="battery-card card">
        <div className="hero-kicker">
          <span>{primaryDevice.name}</span>
          <span><i /> Demo data · {primaryDevice.observedLabel}</span>
        </div>
        <div className="battery-top">
          <BatteryRing />
          <div className="battery-copy">
            <div className="status-line">
              <span className="pulse-dot" />
              Charging
            </div>
            <h2>About {sessions["session-phone-live"].estimate} to {reminderSettings.target}%</h2>
            <p>Illustrative reading · {primaryDevice.observedLabel}</p>
            <div className="tag-row">
              <Tag tone="cyan">Measured</Tag>
              <Tag tone="green">Up to date</Tag>
            </div>
          </div>
        </div>
        <div className="charge-line">
          <span />
          <i />
        </div>
        <div className="card-foot">
          <span>Target reminder</span>
          <strong>{reminderSettings.target}% enabled</strong>
        </div>
      </section>

      <section className="ai-summary card">
        <div className="section-heading">
          <div className="title-with-icon">
            <span className="soft-icon">
              <Icon name="spark" size={16} />
            </span>
            <div>
              <p className="eyebrow">AI daily summary</p>
              <h2>A change worth noticing</h2>
            </div>
          </div>
          <Tag tone="violet">AI-generated</Tag>
        </div>
        <p className="summary-text">
          {anomaly.explanation} {anomaly.limitation}
        </p>
        <div className="evidence-grid">
          <div>
            <span>Compared with baseline</span>
            <strong>{evidence[4].value}</strong>
          </div>
          <div>
            <span>Confidence</span>
            <strong>
              <i className="confidence medium" />
              Medium
            </strong>
          </div>
        </div>
        <Action variant="secondary" onClick={() => go("insight")}>
          See why <Icon name="chevron" size={17} />
        </Action>
      </section>

      <div className="section-title">
        <div>
          <p className="eyebrow">Today</p>
          <h2>Intelligence at a glance</h2>
        </div>
        <span>Demo data</span>
      </div>
      <div className="module-list">
        <button className="module-card card" onClick={() => go("baseline")}>
          <span className="module-icon cyan">
            <Icon name="chart" />
          </span>
          <span className="module-copy">
            <strong>Battery behavior</strong>
            <small>{baseline.deviation} faster discharge than your 7-day range</small>
          </span>
          <span className="trend-pill up">{baseline.deviation}</span>
          <Icon name="chevron" size={18} />
        </button>
        <button className="module-card card" onClick={() => go("charging")}>
          <span className="module-icon green">
            <Icon name="bolt" />
          </span>
          <span className="module-copy">
            <strong>Charging intelligence</strong>
            <small>Session is tracking within your typical range</small>
          </span>
          <Tag tone="green">Normal</Tag>
          <Icon name="chevron" size={18} />
        </button>
        <button className="module-card card" onClick={() => go("prediction")}>
          <span className="module-icon violet">
            <Icon name="spark" />
          </span>
          <span className="module-copy">
            <strong>Predicted trends</strong>
            <small>Estimated range based on {prediction.evidenceCount} observations</small>
          </span>
          <Tag tone="violet">Medium</Tag>
          <Icon name="chevron" size={18} />
        </button>
      </div>

      <section className="recommendation card">
        <div className="rec-icon">
          <Icon name="shield" />
        </div>
        <div>
          <p className="eyebrow">Recommended next step</p>
          <h3>Keep observing this pattern</h3>
          <p>
            No immediate action is needed. BatteryLens will compare the next
            discharge window.
          </p>
        </div>
      </section>
    </div>
  )
}

function Intelligence({ go }: { go: (screen: Screen) => void }) {
  const [segment, setSegment] = useState("Overview")
  const segments = ["Overview", "Anomalies", "Predictions", "Baseline"]
  return (
    <div className="screen-content">
      <Header
        subtitle="BatteryLens AI"
        title="Intelligence"
        action={
          <Action
            variant="secondary"
            className="icon-action"
            onClick={() => go("copilot")}
            label="Ask AI"
          >
            <Icon name="spark" />
          </Action>
        }
      />
      <div className="segment-control">
        {segments.map((item) => (
          <button
            key={item}
            className={segment === item ? "active" : ""}
            onClick={() => setSegment(item)}
          >
            {item}
          </button>
        ))}
      </div>
      {segment === "Overview" && (
        <div className="intelligence-overview">
          <section className="overview-lead">
            <div>
              <p className="eyebrow">Today’s focus</p>
              <h2>One change is outside your usual range</h2>
              <p>BatteryLens found a moderate discharge deviation supported by {baseline.windows["7D"].observations} observations.</p>
            </div>
            <Action variant="secondary" onClick={() => go("insight")}>
              Review insight <Icon name="chevron" size={16} />
            </Action>
          </section>
          <div className="overview-stats">
            <div><span>Model readiness</span><strong>{baseline.windows["7D"].maturity}</strong><small>{baseline.windows["7D"].coverage} coverage</small></div>
            <div><span>Active insights</span><strong>1</strong><small>Medium confidence</small></div>
            <div><span>Data quality</span><strong>Fresh</strong><small>Demo reading · {primaryDevice.observedLabel}</small></div>
          </div>
          <div className="section-title">
            <h2>Latest analysis</h2>
            <span>Illustrative data</span>
          </div>
          <button className="explanation-row card" onClick={() => go("insight")}>
            <span className="module-icon amber"><Icon name="chart" /></span>
            <span><strong>Discharge above personal baseline</strong><small>Moderate relevance · 4 evidence points</small></span>
            <Icon name="chevron" />
          </button>
          <button className="explanation-row quiet-row" onClick={() => go("prediction")}>
            <span className="module-icon violet"><Icon name="spark" /></span>
            <span><strong>Possible range through this evening</strong><small>Prediction · Medium confidence</small></span>
            <Icon name="chevron" />
          </button>
        </div>
      )}
      {segment === "Anomalies" && (
        <>
          <section className="hero-insight card" onClick={() => go("insight")}>
            <div className="insight-top">
              <Tag tone="amber">{anomaly.severity}</Tag>
              <span>2h ago</span>
            </div>
            <h2>Discharge rate above personal baseline</h2>
            <p>
              The latest observation window is outside your typical 7-day range.
            </p>
            <MiniChart />
            <div className="metric-row">
              <div>
                <span>Observed</span>
                <strong>{anomaly.observedRate}</strong>
              </div>
              <div>
                <span>Typical</span>
                <strong>{anomaly.baselineRange}</strong>
              </div>
              <div>
                <span>Confidence</span>
                <strong>{anomaly.confidence}</strong>
              </div>
            </div>
            <div className="limitation">
              <Icon name="info" size={16} /> {anomaly.limitation}
            </div>
          </section>
          <div className="section-title">
            <h2>Recent explanations</h2>
            <span>Last 7 days</span>
          </div>
          <button
            className="explanation-row card"
            onClick={() => go("charging")}
          >
            <span className="module-icon green">
              <Icon name="bolt" />
            </span>
            <span>
              <strong>Charging session within range</strong>
              <small>Yesterday · 4 evidence points</small>
            </span>
            <Icon name="chevron" />
          </button>
          <button
            className="explanation-row card"
            onClick={() => go("insight")}
          >
            <span className="module-icon violet">
              <Icon name="spark" />
            </span>
            <span>
              <strong>New behavior pattern detected</strong>
              <small>Monday · Medium confidence</small>
            </span>
            <Icon name="chevron" />
          </button>
        </>
      )}
      {segment === "Predictions" && <PredictionContent go={go} compact />}
      {segment === "Baseline" && <BaselineContent compact go={go} />}
    </div>
  )
}

function EvidenceStep({
  number,
  label,
  value,
  tag,
}: {
  number: string
  label: string
  value: string
  tag: string
}) {
  return (
    <div className="evidence-step">
      <span className="step-number">{number}</span>
      <div>
        <small>{label}</small>
        <strong>{value}</strong>
        <Tag
          tone={
            tag === "Estimated"
              ? "violet"
              : tag === "Calculated"
                ? "cyan"
                : "default"
          }
        >
          {tag}
        </Tag>
      </div>
    </div>
  )
}

function Insight({ go }: { go: (screen: Screen) => void }) {
  const [expanded, setExpanded] = useState(false)
  const [evidenceOpen, setEvidenceOpen] = useState(false)
  const [confidenceOpen, setConfidenceOpen] = useState(false)
  return (
    <div className="screen-content">
      <Header
        subtitle="Explainable intelligence"
        title="AI Insight"
        onBack={() => go("home")}
      />
      <div className="insight-lead">
        <Tag tone="amber">Above typical range</Tag>
        <h2>Discharge behavior is above your usual range</h2>
        <p>Today, {anomaly.window} · {anomaly.confidence} confidence</p>
        <div className="insight-actions">
          <Action variant="secondary" onClick={() => go("history")}>View chart</Action>
          <Action variant="ghost" onClick={() => go("baseline")}>See baseline <Icon name="chevron" size={16} /></Action>
        </div>
      </div>
      <section className="detail-section">
        <p className="eyebrow">What we observed</p>
        <div className="fact-card card">
          <span className="fact-value">{anomaly.observedRate.replace(" / hr", "")}</span>
          <div>
            <strong>Discharge per hour</strong>
            <small>Latest 94-minute observation window</small>
          </div>
          <Tag tone="cyan">Calculated</Tag>
        </div>
      </section>
      <section className="detail-section">
        <p className="eyebrow">What we compared</p>
        <div className="comparison-card card">
          <div>
            <span>Latest window</span>
            <strong>{anomaly.observedRate}</strong>
          </div>
          <span className="versus">vs</span>
          <div>
            <span>7-day baseline</span>
            <strong>{anomaly.baselineRange}</strong>
          </div>
        </div>
      </section>
      <section className="detail-section">
        <p className="eyebrow">What it could mean</p>
        <p className="body-copy">
          A higher discharge rate can shorten the time between charges. This
          change is measurable, but {anomaly.limitation.toLowerCase()}
        </p>
      </section>
      <section className="detail-section">
        <div className="section-title">
          <div><p className="eyebrow">See evidence</p><h2>4 supporting steps</h2></div>
          <Action variant="ghost" onClick={() => setEvidenceOpen(!evidenceOpen)} label={`${evidenceOpen ? "Hide" : "Open"} supporting evidence`}>{evidenceOpen ? "Hide" : "Open"}</Action>
        </div>
        {evidenceOpen && <div className="evidence-trail card disclosure">
          {evidence.slice(1).map((item, index) => (
            <EvidenceStep
              key={item.id}
              number={`0${index + 1}`}
              label={item.label}
              value={item.value}
              tag={item.provenance}
            />
          ))}
        </div>}
      </section>
      <section className="confidence-card card">
        <div className="confidence-head">
          <div>
            <p className="eyebrow">Confidence & limitations</p>
            <h3>{anomaly.confidence} confidence</h3>
          </div>
          <span className="score-ring">{anomaly.confidenceScore}</span>
        </div>
        <div className="confidence-bar">
          <span />
        </div>
        <p>
          {baseline.windows["7D"].observations} relevant observations · Fresh telemetry · App-level usage
          unavailable
        </p>
        <Action variant="ghost" className="confidence-help" onClick={() => setConfidenceOpen(!confidenceOpen)} label="Explain the confidence level">Why this confidence?</Action>
        {confidenceOpen && <p className="disclosure-copy">Some supporting observations are available, but app-level activity is missing, so BatteryLens cannot establish the exact cause.</p>}
      </section>
      <section className="next-step-panel">
        <span className="rec-icon"><Icon name="shield" /></span>
        <div><p className="eyebrow">What you can do next</p><h3>Keep observing this pattern</h3><p>No immediate action is needed. Compare the next unplugged window before drawing a conclusion.</p></div>
      </section>
      <Action
        variant="secondary"
        className="full-action"
        onClick={() => setExpanded(!expanded)}
      >
        How was this generated? <Icon name="chevron" />
      </Action>
      {expanded && (
        <div className="expanded-info card">
          <p>
            BatteryLens compared timestamped battery-level changes with the
            middle 80% of similar unplugged observation windows from the last
            seven days. Demo calculation only.
          </p>
        </div>
      )}
      <Action className="full-action" onClick={() => go("baseline")}>
        Explore personal baseline
      </Action>
    </div>
  )
}

function BaselineContent({
  compact = false,
  go,
}: {
  compact?: boolean
  go: (screen: Screen) => void
}) {
  const [range, setRange] = useState("7D")
  return (
    <div className={compact ? "embedded-content" : ""}>
      <section className="chart-card card">
        <div className="chart-head">
          <div>
            <p className="eyebrow">Personal discharge baseline</p>
            <h2>Typical range & current behavior</h2>
          </div>
          <Tag tone="cyan">Illustrative</Tag>
        </div>
        <div className="range-control">
          {["24H", "7D", "30D"].map((r) => (
            <button
              key={r}
              className={range === r ? "active" : ""}
              onClick={() => setRange(r)}
            >
              {r}
            </button>
          ))}
        </div>
        <MiniChart />
        <div className="chart-legend">
          <span>
            <i className="legend-dot current" />
            Current
          </span>
          <span>
            <i className="legend-dot baseline" />
            Baseline
          </span>
          <span>
            <i className="legend-dot range" />
            Typical range
          </span>
        </div>
      </section>
      <div className="stat-grid">
        <div className="stat-card card">
          <span>Baseline confidence</span>
          <strong>Good</strong>
          <small>{baseline.windows[range === "30D" ? "30D" : "7D"].observations} observations</small>
        </div>
        <div className="stat-card card">
          <span>Current deviation</span>
          <strong>{baseline.deviation}</strong>
          <small>Above range</small>
        </div>
        <div className="stat-card card">
          <span>Coverage</span>
          <strong>{baseline.windows[range === "30D" ? "30D" : "7D"].coverage}</strong>
          <small>of last 7 days</small>
        </div>
        <div className="stat-card card">
          <span>Maturity</span>
          <strong>{baseline.windows[range === "30D" ? "30D" : "7D"].maturity}</strong>
          <small>{baseline.maturityTarget}</small>
        </div>
      </div>
      {compact && (
        <Action
          variant="secondary"
          className="full-action"
          onClick={() => go("baseline")}
        >
          Open baseline details
        </Action>
      )}
    </div>
  )
}

function Baseline({ go }: { go: (screen: Screen) => void }) {
  return (
    <div className="screen-content">
      <Header
        subtitle="Personal model"
        title="Your baseline"
        onBack={() => go("insight")}
      />
      <BaselineContent go={go} />
      <section className="recommendation card">
        <div className="rec-icon">
          <Icon name="info" />
        </div>
        <div>
          <p className="eyebrow">How to read this</p>
          <h3>Your baseline is still learning</h3>
          <p>
            BatteryLens has enough history for useful comparisons, but
            confidence will improve with more complete observations.
          </p>
        </div>
      </section>
    </div>
  )
}

function PredictionContent({
  compact = false,
  go,
}: {
  compact?: boolean
  go: (screen: Screen) => void
}) {
  const [range, setRange] = useState("Next 6h")
  return (
    <div className={compact ? "embedded-content" : ""}>
      <section className="chart-card card">
        <div className="chart-head">
          <div>
            <p className="eyebrow">Estimated trend</p>
            <h2>Possible battery range</h2>
          </div>
          <Tag tone="violet">Estimated</Tag>
        </div>
        <div className="range-control wide">
          {["Next 3h", "Next 6h", "Today"].map((r) => (
            <button
              key={r}
              className={range === r ? "active" : ""}
              onClick={() => setRange(r)}
            >
              {r}
            </button>
          ))}
        </div>
        <MiniChart forecast />
        <div className="forecast-labels">
          <span>Now · {primaryDevice.level}%</span>
          <span>Possible range · {prediction.uncertainty}</span>
        </div>
        <div className="chart-legend">
          <span>
            <i className="legend-dot current" />
            Observed
          </span>
          <span>
            <i className="legend-dot estimate" />
            Estimated
          </span>
          <span>
            <i className="legend-dot range" />
            Possible range
          </span>
        </div>
      </section>
      <div className="forecast-facts card">
        <div>
          <Icon name="shield" />
          <span>
            Confidence<strong>{prediction.confidence}</strong>
          </span>
        </div>
        <div>
          <Icon name="chart" />
          <span>
            Evidence<strong>{prediction.evidenceCount} observations</strong>
          </span>
        </div>
        <div>
          <Icon name="clock" />
          <span>
            Updated<strong>{prediction.generatedAt}</strong>
          </span>
        </div>
      </div>
      <div className="limitation card">
        <Icon name="info" />
        <span>
          <strong>Important limitation</strong>This range assumes behavior
          similar to recent history. {prediction.limitation}
        </span>
      </div>
      {compact && (
        <Action className="full-action" onClick={() => go("prediction")}>
          Explore prediction
        </Action>
      )}
    </div>
  )
}

function Prediction({ go }: { go: (screen: Screen) => void }) {
  return (
    <div className="screen-content">
      <Header
        subtitle="Predictive intelligence"
        title="Your battery outlook"
        onBack={() => go("home")}
      />
      <PredictionContent go={go} />
      <p className="demo-note">
        Illustrative demo prediction. Not a hardware diagnosis or guaranteed
        outcome.
      </p>
    </div>
  )
}

function Charging({
  go,
  sessionId,
}: {
  go: (screen: Screen) => void
  sessionId: SessionId
}) {
  const session = sessions[sessionId]
  const device = devices[session.deviceId]
  const [setupOpen, setSetupOpen] = useState(false)
  const [target, setTarget] = useState(reminderSettings.target)
  const [saved, setSaved] = useState(false)
  return (
    <div className="screen-content">
      <Header
        subtitle={`${device.name} · Illustrative session`}
        title={session.title}
        onBack={() => go(sessionId === "session-phone-live" ? "home" : "history")}
      />
      <section className="charge-hero card">
        <div className="charge-status">
          <span className="module-icon green">
            <Icon name="bolt" />
          </span>
          <div>
            <p className="eyebrow">{session.status}</p>
            <h2>
              {session.endLevel}% <span>· {session.start}–{session.end}</span>
            </h2>
          </div>
          <Tag tone="green">Demo data</Tag>
        </div>
        <MiniChart />
        <div className="metric-row">
          <div>
            <span>Session</span>
            <strong>{session.duration}</strong>
          </div>
          <div>
            <span>Rate</span>
            <strong>{session.rate}</strong>
          </div>
          <div>
            <span>Estimate</span>
            <strong>{session.estimate}</strong>
          </div>
        </div>
      </section>
      <section className="card">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Session comparison</p>
            <h2>Within your typical range</h2>
          </div>
          <Tag tone="cyan">Calculated</Tag>
        </div>
        <div className="comparison-bars">
          <div>
            <span>Selected session</span>
            <i>
              <b className="bar-current" />
            </i>
            <strong>{session.rate}</strong>
          </div>
          <div>
            <span>Personal baseline</span>
            <i>
              <b className="bar-base" />
            </i>
            <strong>19–24%/hr</strong>
          </div>
        </div>
      </section>
      <section className="setting-row card">
        <span className="module-icon violet">
          <Icon name="bell" />
        </span>
        <span>
          <strong>{target}% target reminder</strong>
          <small>{reminderSettings.limitation}</small>
        </span>
        <Action variant="ghost" onClick={() => { setSetupOpen(!setupOpen); setSaved(false) }}>Edit</Action>
      </section>
      {setupOpen && <section className="reminder-setup card">
        <div className="section-heading"><div><p className="eyebrow">Reminder target</p><h2>Choose a battery level</h2></div><Tag>Reminder only</Tag></div>
        <div className="target-options">{[80, 90, 100].map(value => <button key={value} className={target === value ? "active" : ""} onClick={() => setTarget(value)}>{value}%</button>)}</div>
        <p>BatteryLens sends one notification at {target}%. {reminderSettings.limitation}</p>
        <div className="setup-actions"><Action variant="secondary" onClick={() => setSetupOpen(false)}>Cancel</Action><Action onClick={() => { setSaved(true); setSetupOpen(false) }}>Save reminder</Action></div>
      </section>}
      {saved && <div className="inline-confirmation" role="status"><Icon name="shield" size={17} /><span><strong>Reminder saved</strong>You’ll be notified at {target}%.</span><button onClick={() => setSaved(false)}>Dismiss</button></div>}
      <Action variant="ghost" className="history-link" onClick={() => go("history")}>
        View charging history <Icon name="chevron" size={16} />
      </Action>
      <p className="demo-note">
        Completion time is estimated from this session and recent illustrative
        charging history.
      </p>
    </div>
  )
}

function History({
  go,
  deviceId,
  openSession,
}: {
  go: (screen: Screen) => void
  deviceId: DeviceId
  openSession: (id: SessionId) => void
}) {
  const device = devices[deviceId]
  const deviceReadings = readings[deviceId]
  const [day, setDay] = useState("24H")
  const [selectedEvent, setSelectedEvent] = useState(false)
  return (
    <div className="screen-content">
      <Header subtitle={`${device.name} · Illustrative data`} title="Battery history" />
      <div className="day-tabs">
        {["24H", "7D", "30D"].map((d) => (
          <button
            className={day === d ? "active" : ""}
            onClick={() => setDay(d)}
            key={d}
          >
            {d}
          </button>
        ))}
      </div>
      <section className="history-chart card">
        <div className="chart-head">
          <div>
            <p className="eyebrow">{day}</p>
            <h2>{deviceReadings.length} timestamped readings</h2>
          </div>
          <Tag tone="cyan">Measured</Tag>
        </div>
        <button className="history-chart-button" onClick={() => setSelectedEvent(!selectedEvent)} aria-label={`Select the latest ${device.name} event`}>
        {selectedEvent && <span className="history-tooltip"><small>{device.observedLabel} · Latest observation</small><strong>{device.level}% · {device.state}</strong></span>}
        <svg viewBox="0 0 320 180" role="img" aria-label="Battery history timeline">
          <g className="grid-lines">
            <path d="M0 30h320M0 80h320M0 130h320" />
          </g>
          <path
            className="history-area"
            d="M0 35 50 55 92 90 117 112 129 58 170 68 210 104 235 121 253 84 286 70 320 75V180H0Z"
          />
          <path
            className="observed-line"
            d="M0 35 50 55 92 90 117 112 129 58 170 68 210 104 235 121 253 84 286 70 320 75"
          />
          <path className="charge-segment" d="M117 112 129 58M235 121 253 84" />
          <circle className="anomaly-marker" cx="210" cy="104" r="7" />
          <path
            className="marker-spark"
            d="m210 99 1 4 4 1-4 1-1 4-1-4-4-1 4-1Z"
          />
        </svg>
        </button>
        <div className="time-labels">
          <span>8 AM</span>
          <span>12 PM</span>
          <span>4 PM</span>
          <span>Now</span>
        </div>
      </section>
      <div className="section-title">
        <h2>Timeline</h2>
        <span>{deviceReadings.length} readings</span>
      </div>
      <div className="timeline">
        {deviceId === "phone-01" ? <>
        <button onClick={() => go("insight")}>
          <i className="timeline-dot anomaly" />
          <span>
            <small>1:42 PM</small>
            <strong>Discharge anomaly detected</strong>
            <em>Above personal baseline · Medium confidence</em>
          </span>
          <Tag tone="amber">Insight</Tag>
        </button>
        <button onClick={() => openSession("session-phone-previous")}>
          <i className="timeline-dot charge" />
          <span>
            <small>12:08 PM</small>
            <strong>Charging session ended</strong>
            <em>76% · 48 minute session</em>
          </span>
          <Icon name="chevron" />
        </button>
        <button onClick={() => openSession("session-phone-previous")}>
          <i className="timeline-dot charge" />
          <span>
            <small>11:20 AM</small>
            <strong>Charging started</strong>
            <em>42% · Power connected</em>
          </span>
          <Icon name="chevron" />
        </button>
        <button>
          <i className="timeline-dot neutral" />
          <span>
            <small>8:00 AM</small>
            <strong>Observation window began</strong>
            <em>91% · Fresh telemetry</em>
          </span>
          <Tag>Measured</Tag>
        </button>
        </> : deviceId === "laptop-01" ? <>
        <button onClick={() => openSession("session-laptop-01")}>
          <i className="timeline-dot charge" />
          <span><small>Yesterday · 4:31 PM</small><strong>Desk charging session</strong><em>24% → 79% · 1h 13m</em></span>
          <Icon name="chevron" />
        </button>
        <button>
          <i className="timeline-dot neutral" />
          <span><small>{device.observedLabel}</small><strong>Latest battery observation</strong><em>{device.level}% · Stale demo telemetry</em></span>
          <Tag>Measured</Tag>
        </button>
        </> : <div className="empty-state card">
          <Tag>Insufficient history</Tag>
          <strong>No session history available</strong>
          <p>Three isolated battery-level observations are preserved, but charging state and predictions are unavailable for this disconnected demo device.</p>
        </div>}
      </div>
    </div>
  )
}

function Devices({
  openHistory,
}: {
  openHistory: (id: DeviceId) => void
}) {
  const phone = devices["phone-01"]
  const secondaryDevices = [devices["laptop-01"], devices["station-01"]]
  return (
    <div className="screen-content">
      <Header subtitle="Device intelligence" title="Your devices" />
      <section className="primary-device card">
        <div className="device-head">
          <span className="device-icon">
            <Icon name="phone" size={26} />
          </span>
          <div>
            <p className="eyebrow">Primary device</p>
            <h2>{phone.name}</h2>
            <span>Demo reading · {phone.observedLabel}</span>
          </div>
          <Tag tone="green">Connected</Tag>
        </div>
        <div className="device-battery">
          <strong>{phone.level}%</strong>
          <div>
            <i>
              <b />
            </i>
            <span>Charging · {sessions["session-phone-live"].estimate} to target</span>
          </div>
        </div>
        <div className="device-facts">
          <span>
            <small>History</small>
            <strong>{phone.historyCoverage}</strong>
          </span>
          <span>
            <small>Active insights</small>
            <strong>1</strong>
          </span>
          <span>
            <small>Capabilities</small>
            <strong>{phone.capabilities.length} available</strong>
          </span>
        </div>
        <Action variant="secondary" className="full-action" onClick={() => openHistory(phone.id)}>
          View device history <Icon name="chevron" size={16} />
        </Action>
      </section>
      <div className="section-title">
        <div>
          <p className="eyebrow">Connected devices</p>
          <h2>One intelligence layer</h2>
        </div>
        <span>Concept preview</span>
      </div>
      <div className="device-list">
        {secondaryDevices.map((device) => (
          <button className="device-row card" key={device.id} onClick={() => openHistory(device.id)}>
            <span className="device-icon small">
              <Icon name={device.kind === "laptop" ? "laptop" : "bolt"} />
            </span>
            <span>
              <strong>{device.name}</strong>
              <small>Demo device · Last observation {device.observedLabel}</small>
            </span>
            <span className="device-level">
              <strong>{device.level}%</strong>
              <small>{device.state} · {device.connectivity}</small>
            </span>
          </button>
        ))}
      </div>
      <section className="capability-card card">
        <p className="eyebrow">Capability status</p>
        {secondaryDevices.map((device) => (
          <div key={device.id}>
            <strong>{device.name}</strong>
            <span>{device.historyCoverage} · Unavailable: {device.limitations.join(", ")}</span>
          </div>
        ))}
      </section>
      <section className="limitation card">
        <Icon name="info" />
        <span>
          <strong>About demo devices</strong>All three devices use deterministic
          illustrative values. No live hardware integration is connected.
        </span>
      </section>
    </div>
  )
}

function Settings() {
  const [localAI, setLocalAI] = useState(true)
  const [alerts, setAlerts] = useState(true)
  const [details, setDetails] = useState(false)
  const groups = [
    {
      title: "Intelligence & privacy",
      rows: [
        {
          icon: "spark" as IconName,
          title: "Local intelligence",
          sub: "Rules and baseline comparisons stay on device",
          state: localAI,
          set: setLocalAI,
        },
        {
          icon: "shield" as IconName,
          title: "Secure cloud AI",
          sub: "Optional · Not enabled in this prototype",
          badge: "Off",
        },
      ],
    },
    {
      title: "Notifications",
      rows: [
        {
          icon: "bell" as IconName,
          title: "Meaningful alerts",
          sub: "Anomalies and charging target reminders",
          state: alerts,
          set: setAlerts,
        },
      ],
    },
    {
      title: "Explanation preferences",
      rows: [
        {
          icon: "info" as IconName,
          title: "Show technical details",
          sub: "Expand calculations and evidence by default",
          state: details,
          set: setDetails,
        },
      ],
    },
  ]
  return (
    <div className="screen-content">
      <Header subtitle="Controls & transparency" title="Settings" />
      {groups.map((group) => (
        <section className="settings-group" key={group.title}>
          <p className="eyebrow">{group.title}</p>
          {group.rows.map((row) => (
            <div className="setting-row card" key={row.title}>
              <span className="module-icon violet">
                <Icon name={row.icon} />
              </span>
              <span>
                <strong>{row.title}</strong>
                <small>{row.sub}</small>
              </span>
              {row.set ? (
                <button
                  className={`toggle ${row.state ? "on" : ""}`}
                  onClick={() => row.set?.(!row.state)}
                  aria-label={`Toggle ${row.title}`}
                >
                  <i />
                </button>
              ) : (
                <Tag>{row.badge}</Tag>
              )}
            </div>
          ))}
        </section>
      ))}
      <section className="settings-group">
        <p className="eyebrow">Data quality</p>
        <div className="quality-card card">
          <div>
            <Tag tone="cyan">Measured</Tag>
            <span>Direct device reading</span>
          </div>
          <div>
            <Tag tone="cyan">Calculated</Tag>
            <span>Derived from measurements</span>
          </div>
          <div>
            <Tag tone="violet">Estimated</Tag>
            <span>Possible outcome, not guaranteed</span>
          </div>
          <div>
            <Tag>Unavailable</Tag>
            <span>Not exposed by this device</span>
          </div>
        </div>
      </section>
      <section className="settings-group">
        <p className="eyebrow">Demo state reference</p>
        <div className="state-gallery card">
          {demoStates.map((state) => (
            <div key={state.label}>
              <Tag tone={state.label.includes("AI") ? "amber" : "default"}>{state.label}</Tag>
              <span>{state.detail}</span>
            </div>
          ))}
        </div>
        <p className="demo-note">Illustrative states only. No live device or AI service is connected.</p>
      </section>
      <p className="demo-note">
        Export, deletion, and cloud processing controls are planned concepts and
        are not connected to production services.
      </p>
    </div>
  )
}

function Onboarding({ onFinish }: { onFinish: () => void }) {
  const [step, setStep] = useState(0)
  const content = [
    ["Understand your battery", "See more than a percentage.", "BatteryLens organizes available battery and charging information, then adds context when enough evidence exists."],
    ["Build useful history", "Build your personal battery picture.", "Comparisons improve as relevant observations accumulate. You can start using the app immediately."],
    ["Choose your intelligence", "Choose what works for you.", "Insights stay available locally. Reminders and supported integrations are optional."],
    ["Ready when you are", "Your battery, at a glance.", "See current status, one useful insight, and the next relevant action without digging through settings."],
  ]
  const item = content[step]
  return <div className="onboarding">
    <div className="onboarding-top"><strong><BrandMark lockup /></strong><button onClick={onFinish}>Skip</button></div>
    <div className="onboarding-illustration" aria-label="Illustrative battery intelligence preview"><span className="demo-battery"><i /></span><span className="demo-line" /></div>
    <div className="onboarding-copy"><p className="eyebrow">Step {step + 1} of 4 · {item[0]}</p><h1>{item[1]}</h1><p>{item[2]}</p>{step === 1 && <Tag tone="cyan">Example history</Tag>}{step === 2 && <div className="feature-list"><span><Icon name="spark" />Battery insights <Tag tone="green">Available</Tag></span><span><Icon name="bell" />Charging reminders <Tag>Optional</Tag></span><span><Icon name="devices" />Device integrations <Tag>Supported devices</Tag></span></div>}</div>
    <div className="onboarding-footer"><div className="step-dots">{content.map((_, index) => <i key={index} className={index === step ? "active" : ""} />)}</div><Action onClick={() => step === 3 ? onFinish() : setStep(step + 1)}>{step === 3 ? "Get started" : "Continue"} <Icon name="chevron" size={16} /></Action></div>
  </div>
}

function Copilot({ go }: { go: (screen: Screen) => void }) {
  const [question, setQuestion] = useState<string | null>(null)
  const [prompt, setPrompt] = useState("")
  const [responding, setResponding] = useState(false)
  const ask = (value: string) => {
    setQuestion(value)
    setResponding(true)
    window.setTimeout(() => setResponding(false), 600)
  }
  const submitPrompt = () => {
    const nextQuestion = prompt.trim()
    if (!nextQuestion) return
    ask(nextQuestion)
    setPrompt("")
  }
  const questions = copilotAnswers.map((item) => item.question)
  const answer = question ? getCopilotAnswer(question) : null
  return (
    <div className="screen-content copilot">
      <Header
        subtitle="Ask about your battery behavior"
        title="BatteryLens AI"
        onBack={() => go("home")}
        action={<span className="online-dot">Local demo</span>}
      />
      {!question ? (
        <>
          <div className="copilot-intro">
            <span className="copilot-orb">
              <Icon name="spark" size={30} />
            </span>
            <h2>Ask about your battery</h2>
            <p>
              I’ll answer from available observations and show the evidence I
              use.
            </p>
          </div>
          <div className="question-list" aria-label="Suggested questions">
            {questions.map((q) => (
              <button key={q} onClick={() => ask(q)}>
                {q}
                <Icon name="chevron" />
              </button>
            ))}
          </div>
        </>
      ) : (
        <>
          <div className="user-bubble">{question}</div>
          {responding ? <section className="answer-loading card" aria-live="polite"><span /><span /><p>Reviewing illustrative local history…</p></section> : <section className="answer-card card">
            <div className="answer-label">
              <span className="soft-icon">
                <Icon name="spark" />
              </span>
              <div>
                <p className="eyebrow">BatteryLens answer</p>
                <span>Generated from demo history</span>
              </div>
              <Tag tone="violet">AI-generated</Tag>
            </div>
            <h2>{answer?.title}</h2>
            <p>{answer?.body}</p>
            <div className="answer-evidence">
              <div>
                <span>Evidence</span>
                <strong>{answer?.evidence}</strong>
              </div>
              <div>
                <span>Confidence</span>
                <strong>{answer?.evidence === "No matching evidence" ? "Unavailable" : anomaly.confidence}</strong>
              </div>
              <div>
                <span>Limitation</span>
                <strong>{answer?.limitation}</strong>
              </div>
            </div>
            <Action
              variant="secondary"
              className="full-action"
              onClick={() => go((answer?.destination ?? "history") as Screen)}
            >
              Open evidence used <Icon name="chevron" />
            </Action>
          </section>}
          <p className="follow-label">Suggested follow-up</p>
          <button className="follow-up" onClick={() => go("baseline")}>
            Show me my personal baseline <Icon name="chevron" />
          </button>
        </>
      )}
      <div className="prompt-bar">
        <input
          value={prompt}
          onChange={(event) => setPrompt(event.target.value)}
          onKeyDown={(event) => event.key === "Enter" && submitPrompt()}
          placeholder={question ? "Ask a follow-up…" : "Ask about your battery…"}
          aria-label="Ask BatteryLens AI"
        />
        <button
          aria-label="Send question"
          onClick={submitPrompt}
          disabled={!prompt.trim()}
        >
          <Icon name="send" size={18} />
        </button>
      </div>
    </div>
  )
}

export default function App() {
  const [screen, setScreen] = useState<Screen>("home")
  const [selectedDevice, setSelectedDevice] = useState<DeviceId>("phone-01")
  const [selectedSession, setSelectedSession] = useState<SessionId>("session-phone-live")
  const [showSplash, setShowSplash] = useState(true)
  const [showOnboarding, setShowOnboarding] = useState(() => localStorage.getItem("batterylens-onboarding") !== "complete")
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const timer = window.setTimeout(() => setShowSplash(false), reduced ? 80 : 720)
    return () => window.clearTimeout(timer)
  }, [])
  const finishOnboarding = () => {
    localStorage.setItem("batterylens-onboarding", "complete")
    setShowOnboarding(false)
  }
  const navigate = (next: Screen) => {
    if (next === "charging") setSelectedSession("session-phone-live")
    setScreen(next)
  }
  const openSession = (id: SessionId) => {
    setSelectedSession(id)
    setSelectedDevice(sessions[id].deviceId)
    setScreen("charging")
  }
  const openDeviceHistory = (id: DeviceId) => {
    setSelectedDevice(id)
    setScreen("history")
  }
  const activeTab: Tab = [
    "home",
    "intelligence",
    "history",
    "devices",
    "settings",
  ].includes(screen)
    ? screen as Tab
    : screen === "insight" ||
        screen === "baseline" ||
        screen === "prediction" ||
        screen === "charging" ||
        screen === "copilot"
      ? "home"
      : "home"
  const renderScreen = () => {
    switch (screen) {
      case "home":
        return <Home go={navigate} />
      case "intelligence":
        return <Intelligence go={navigate} />
      case "history":
        return <History go={navigate} deviceId={selectedDevice} openSession={openSession} />
      case "devices":
        return <Devices openHistory={openDeviceHistory} />
      case "settings":
        return <Settings />
      case "insight":
        return <Insight go={navigate} />
      case "baseline":
        return <Baseline go={navigate} />
      case "prediction":
        return <Prediction go={navigate} />
      case "charging":
        return <Charging go={navigate} sessionId={selectedSession} />
      case "copilot":
        return <Copilot go={navigate} />
    }
  }
  if (showSplash) return <main className="app-shell"><div className="phone-frame splash"><div className="app-icon"><BrandMark /></div><BrandMark lockup /><span className="splash-trace" /><small>Battery intelligence</small></div></main>
  return (
    <main className="app-shell">
      <div className="phone-frame">
        <div className="status-bar">
          <span>9:41</span>
          <div>
            <span className="signal">•••</span>
            <span className="wifi">⌁</span>
            <span className="battery-status">{primaryDevice.level}</span>
          </div>
        </div>
        {showOnboarding ? <Onboarding onFinish={finishOnboarding} /> : renderScreen()}
        {!showOnboarding && <nav className="bottom-nav" aria-label="Main navigation">
          {navItems.map((item) => (
            <button
              key={item.id}
              className={activeTab === item.id ? "active" : ""}
              onClick={() => setScreen(item.id)}
              aria-current={activeTab === item.id ? "page" : undefined}
              aria-label={`${item.label}${activeTab === item.id ? ", current tab" : ""}`}
            >
              <span>
                <Icon name={item.icon} />
              </span>
              <small>{item.label}</small>
            </button>
          ))}
        </nav>}
      </div>
    </main>
  )
}
