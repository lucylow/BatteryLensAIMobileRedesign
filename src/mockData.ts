export type DeviceId = "phone-01" | "laptop-01" | "station-01"
export type SessionId = "session-phone-live" | "session-phone-previous" | "session-laptop-01"

export type DemoDevice = {
  id: DeviceId
  name: string
  kind: "phone" | "laptop" | "station"
  level: number
  state: "charging" | "discharging" | "idle"
  connectivity: "connected" | "stale" | "disconnected"
  observedAt: string
  observedLabel: string
  historyCoverage: string
  capabilities: string[]
  limitations: string[]
}

export const DEMO_NOW = "2025-02-18T14:14:00"

export const devices: Record<DeviceId, DemoDevice> = {
  "phone-01": {
    id: "phone-01",
    name: "My Phone",
    kind: "phone",
    level: 82,
    state: "charging",
    connectivity: "connected",
    observedAt: DEMO_NOW,
    observedLabel: "2:14 PM",
    historyCoverage: "6d 14h of 7 days",
    capabilities: ["Battery level", "Charging state", "History", "Target reminders"],
    limitations: ["App-level usage", "Battery temperature"],
  },
  "laptop-01": {
    id: "laptop-01",
    name: "Work Laptop",
    kind: "laptop",
    level: 46,
    state: "discharging",
    connectivity: "stale",
    observedAt: "2025-02-18T14:02:00",
    observedLabel: "2:02 PM",
    historyCoverage: "18d of 30 days",
    capabilities: ["Battery level", "Charging state", "Session history"],
    limitations: ["App-level usage", "Temperature", "Charge control"],
  },
  "station-01": {
    id: "station-01",
    name: "Travel Power Station",
    kind: "station",
    level: 67,
    state: "idle",
    connectivity: "disconnected",
    observedAt: "2025-02-18T11:20:00",
    observedLabel: "11:20 AM",
    historyCoverage: "3 isolated observations",
    capabilities: ["Battery level"],
    limitations: ["Live connection", "Charging state", "Session history", "Predictions"],
  },
}

export const primaryDevice = devices["phone-01"]

export const readings = {
  "phone-01": [
    { id: "obs-p-0800", at: "8:00 AM", level: 91, state: "discharging" },
    { id: "obs-p-1000", at: "10:00 AM", level: 68, state: "discharging" },
    { id: "obs-p-1120", at: "11:20 AM", level: 42, state: "charging" },
    { id: "obs-p-1208", at: "12:08 PM", level: 76, state: "discharging" },
    { id: "obs-p-1342", at: "1:42 PM", level: 62, state: "discharging" },
    { id: "obs-p-1414", at: "2:14 PM", level: 82, state: "charging" },
  ],
  "laptop-01": [
    { id: "obs-l-0900", at: "9:00 AM", level: 88, state: "discharging" },
    { id: "obs-l-1100", at: "11:00 AM", level: 69, state: "discharging" },
    { id: "obs-l-1300", at: "1:00 PM", level: 53, state: "discharging" },
    { id: "obs-l-1402", at: "2:02 PM", level: 46, state: "discharging" },
  ],
  "station-01": [
    { id: "obs-s-mon", at: "Mon", level: 71, state: "idle" },
    { id: "obs-s-tue", at: "Tue", level: 69, state: "idle" },
    { id: "obs-s-now", at: "11:20 AM", level: 67, state: "idle" },
  ],
} as const

export const sessions = {
  "session-phone-live": {
    id: "session-phone-live" as SessionId,
    deviceId: "phone-01" as DeviceId,
    title: "Current charging session",
    start: "1:02 PM",
    end: "In progress",
    startLevel: 56,
    endLevel: 82,
    duration: "1h 12m",
    rate: "22% / hr",
    target: 90,
    estimate: "38 min",
    status: "Charging normally",
  },
  "session-phone-previous": {
    id: "session-phone-previous" as SessionId,
    deviceId: "phone-01" as DeviceId,
    title: "Late-morning charge",
    start: "11:20 AM",
    end: "12:08 PM",
    startLevel: 42,
    endLevel: 76,
    duration: "48 min",
    rate: "42% / hr",
    target: 80,
    estimate: "Completed",
    status: "Completed",
  },
  "session-laptop-01": {
    id: "session-laptop-01" as SessionId,
    deviceId: "laptop-01" as DeviceId,
    title: "Yesterday’s desk charge",
    start: "3:18 PM",
    end: "4:31 PM",
    startLevel: 24,
    endLevel: 79,
    duration: "1h 13m",
    rate: "45% / hr",
    target: 80,
    estimate: "Completed",
    status: "Completed",
  },
}

export const baseline = {
  deviceId: "phone-01" as DeviceId,
  windows: {
    "7D": { typical: "6.4–7.8% / hr", observations: 43, coverage: "6d 14h", maturity: "Learning" },
    "30D": { typical: "6.1–8.2% / hr", observations: 126, coverage: "18d 9h", maturity: "Developing" },
  },
  currentRate: "8.7% / hr",
  deviation: "+12.4%",
  maturityTarget: "14 days to mature",
}

export const anomaly = {
  id: "anomaly-discharge-01",
  deviceId: "phone-01" as DeviceId,
  window: "12:08–1:42 PM",
  severity: "Moderate deviation",
  observedRate: "8.7% / hr",
  baselineRange: baseline.windows["7D"].typical,
  confidence: "Medium",
  confidenceScore: 68,
  evidenceIds: ["obs-p-1208", "obs-p-1342", "feature-rate-01", "baseline-7d-01"],
  explanation: "The observation window is above the personal 7-day range.",
  limitation: "Available telemetry cannot identify a specific app or hardware cause.",
}

export const evidence = [
  { id: "obs-p-1208", label: "Observation", value: "76% at 12:08 PM", provenance: "Measured" },
  { id: "obs-p-1342", label: "Observation", value: "62% at 1:42 PM", provenance: "Measured" },
  { id: "feature-rate-01", label: "Derived feature", value: anomaly.observedRate, provenance: "Calculated" },
  { id: "baseline-7d-01", label: "Historical reference", value: anomaly.baselineRange, provenance: "Calculated" },
  { id: "claim-discharge-01", label: "AI claim", value: "Above typical range", provenance: "AI-generated" },
] as const

export const prediction = {
  id: "prediction-evening-01",
  deviceId: "phone-01" as DeviceId,
  generatedAt: primaryDevice.observedLabel,
  horizon: "6:00 PM",
  estimate: "57%",
  uncertainty: "54–61%",
  evidenceCount: baseline.windows["7D"].observations,
  confidence: "Medium",
  limitation: "Unexpected usage or charging will change the outcome.",
}

export const reminderSettings = {
  deviceId: "phone-01" as DeviceId,
  enabled: true,
  target: 90,
  limitation: "A reminder cannot control or stop device charging.",
}

export const copilotAnswers = [
  {
    question: "Why did my battery discharge faster?",
    title: "Recent discharge was above your baseline.",
    body: `The ${anomaly.window} window averaged ${anomaly.observedRate}, compared with your typical ${anomaly.baselineRange} range. The evidence does not establish a specific app or hardware cause.`,
    evidence: `${baseline.windows["7D"].observations} observations`,
    limitation: "App usage unavailable",
    destination: "insight",
  },
  {
    question: "Explain my latest charging session.",
    title: "The current session is within your usual range.",
    body: `My Phone rose from ${sessions["session-phone-live"].startLevel}% to ${sessions["session-phone-live"].endLevel}% over ${sessions["session-phone-live"].duration}. Its ${sessions["session-phone-live"].rate} rate is within the illustrative 19–24%/hr charging range.`,
    evidence: "Current session + 8 prior sessions",
    limitation: "Power adapter details unavailable",
    destination: "charging",
  },
  {
    question: "How does today compare with my baseline?",
    title: "Today is modestly above your 7-day range.",
    body: `The latest unplugged window is ${baseline.deviation} above the upper part of your personal range. The baseline is still learning, so this is a comparison rather than a diagnosis.`,
    evidence: "7-day baseline · 43 observations",
    limitation: "Baseline not yet mature",
    destination: "baseline",
  },
  {
    question: "What changed this week?",
    title: "One repeatable change is visible this week.",
    body: "Two afternoon discharge windows were faster than the earlier-week median. Available evidence does not show whether usage, signal conditions, or another factor caused the change.",
    evidence: "6d 14h history coverage",
    limitation: "No app or network telemetry",
    destination: "history",
  },
  {
    question: "Explain this prediction.",
    title: `The illustrative evening range is ${prediction.uncertainty}.`,
    body: `The estimate uses recent discharge windows and ${prediction.evidenceCount} observations. It assumes behavior similar to recent history and is not a guaranteed outcome.`,
    evidence: `${prediction.evidenceCount} observations`,
    limitation: prediction.limitation,
    destination: "prediction",
  },
  {
    question: "What evidence is missing?",
    title: "Several useful signals are unavailable.",
    body: "BatteryLens has battery level, timestamps, and charging state for My Phone. App activity, battery temperature, adapter details, and verified hardware-health metrics are unavailable, so no specific cause is claimed.",
    evidence: "Capability record · My Phone",
    limitation: "Hardware diagnosis unsupported",
    destination: "devices",
  },
] as const

export function getCopilotAnswer(question: string) {
  return copilotAnswers.find((item) => item.question === question) ?? {
    question,
    title: "There is not enough evidence to answer that safely.",
    body: "This local demo only answers from the predefined illustrative battery history. It will not invent a cause when supporting observations are missing.",
    evidence: "No matching evidence",
    limitation: "AI response unavailable for this question",
    destination: "history" as const,
  }
}

export const demoStates = [
  { label: "Loading", detail: "Reviewing illustrative local history" },
  { label: "Empty", detail: "No charging sessions in this range" },
  { label: "Stale", detail: "Travel Power Station · last observation 11:20 AM" },
  { label: "Offline", detail: "Local history remains available" },
  { label: "Unavailable", detail: "Temperature is not exposed" },
  { label: "AI unavailable", detail: "Measured data remains available" },
  { label: "Invalid AI response", detail: "Response hidden; evidence preserved" },
  { label: "Insufficient history", detail: "Prediction waits for more observations" },
] as const
