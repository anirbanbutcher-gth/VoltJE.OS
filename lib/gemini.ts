'use client'

import { readStored } from './store'
import {
  DEFAULT_MODEL,
  DEFAULT_SETTINGS,
  IDLE_STOPWATCH,
  formatDuration,
  type Session,
  type Settings,
  type StopwatchState,
} from './types'

export type GeminiPart = { text: string } | { inline_data: { mime_type: string; data: string } }
export type GeminiContent = { role: 'user' | 'model'; parts: GeminiPart[] }

export class MissingKeyError extends Error {
  constructor() {
    super('Add your Gemini API key in Settings (sliders icon, top bar) to enable AI features.')
  }
}

type GenerateOptions = {
  contents: GeminiContent[]
  system?: string
  json?: boolean
  signal?: AbortSignal
}

const HALF_HOUR_MS = 30 * 60 * 1000
const QUARTER_HOUR_MS = 15 * 60 * 1000

// Builds an ordered model fallback list so 429 (rate limit), 503 (high demand), or 404 (-preview suffix) never break AI chat
function buildModelFallbackChain(preferred?: string): string[] {
  const clean = (preferred || DEFAULT_MODEL).replace(/^models\//, '').trim()
  const base = clean.replace(/-preview$/, '')

  const candidates = [
    clean,
    `${base}-preview`,
    base,
    'gemini-3.1-flash-lite',
    'gemini-3.1-flash-lite-preview',
    'gemini-3.5-flash-lite',
    'gemini-3.5-flash-lite-preview',
    'gemini-3-flash-preview',
    'gemini-3-flash',
    'gemini-2.5-flash-lite',
    'gemini-2.5-flash',
  ]

  return Array.from(new Set(candidates.filter(Boolean)))
}

// Computes live Time-is-Money Glass Vault telemetry & YouTube Educator instructions for the Master Agent
function buildVoltOSTelemetryAddendum(isJsonMode?: boolean): string {
  if (isJsonMode) return ''

  try {
    const sw = readStored<StopwatchState>('stopwatch', IDLE_STOPWATCH)
    const sessions = readStored<Session[]>('sessions', [])

    const calcNet = (focusMs: number, breakMs: number, rating: number) => {
      const earned = Math.floor(focusMs / HALF_HOUR_MS) * (rating >= 4 ? 100 : rating === 3 ? 50 : 0)
      const burned = Math.floor(breakMs / QUARTER_HOUR_MS) * 100
      return earned - burned
    }

    const savedTotal = sessions.reduce((acc, s) => acc + calcNet(s.focusMs, s.breakMs, s.rating), 0)
    const now = Date.now()
    const liveFocusMs =
      sw.mode === 'focus' && sw.segmentStart ? sw.focusMs + (now - sw.segmentStart) : sw.focusMs
    const liveBreakMs =
      sw.mode === 'break' && sw.segmentStart ? sw.breakMs + (now - sw.segmentStart) : sw.breakMs
    const liveNet = calcNet(liveFocusMs, liveBreakMs, 4)
    const totalVaultRupees = Math.max(0, savedTotal + liveNet)
    const fiveHundredBundles = Math.floor(totalVaultRupees / 500)

    return [
      '\n\n[VOLT OS LIVE TELEMETRY & GLASS VAULT]:',
      `- Glass Vault Balance: ₹${totalVaultRupees} (${fiveHundredBundles} × ₹500 physical notes locked, ₹${totalVaultRupees % 500} in collector tray).`,
      `- Vault Rules: <30m focus = ₹0 | 4★ Focus = ₹200/hr (+₹100/30m) | 3★ Focus = ₹100/hr (+₹50/30m) | Break Mode = -₹100 burned every 15m.`,
      `- Live Stopwatch State: ${sw.mode.toUpperCase()} (Current Focus: ${formatDuration(liveFocusMs, false)}, Current Break: ${formatDuration(liveBreakMs, false)}).`,
      '\n[YOUTUBE LECTURE LINK PROTOCOL]:',
      '- Whenever the user asks for a video lecture, revision video, or class link, ALWAYS provide direct clickable Markdown links formatted as `https://www.youtube.com/results?search_query=<URL_ENCODED_QUERY>` tailored to their preferred educators:',
      '  1. Technical Electrical (SSC JE / RRB JE / WBSEDCL / WBPSC JE): **Raman Sir (EAD Online Classes)** — e.g. `[▶️ Watch Raman Sir (EAD) Lecture on Topic](https://www.youtube.com/results?search_query=Raman+Sir+EAD+Online+Classes+<Topic>+SSC+JE+Electrical)` and `[⚡ One-Shot Revision](https://www.youtube.com/results?search_query=<Topic>+One+Shot+Revision+Electrical+JE+Raman+Sir+EAD)`',
      '  2. Non-Tech Quantitative Aptitude / Math: **Sahil Sir (Quick Tricks by Sahil Sir)** — e.g. `[▶️ Watch Sahil Sir Math Lecture](https://www.youtube.com/results?search_query=Sahil+Sir+Math+<Topic>+RRB+JE+SSC)`',
      '  3. Reasoning: **Piyush Varshney / Deepak Sir /Vikramjeet Sir** — e.g. `[▶️ Watch JE Reasoning Lecture](https://www.youtube.com/results?search_query=<Topic>+Reasoning+SSC+JE+RRB+JE+One+Shot)`',
      '  4. GK / GS & General Science: **Parmar SSC / Khan Sir / Science Magnet (Neeraj Sir)** — e.g. `[▶️ Watch GK/GS & Science Lecture](https://www.youtube.com/results?search_query=<Topic>+GK+GS+SSC+JE+RRB+JE+Parmar+SSC)`',
    ].join('\n')
  } catch {
    return ''
  }
}

export async function generate({ contents, system, json, signal }: GenerateOptions): Promise<string> {
  const { apiKey, model } = readStored<Settings>('settings', DEFAULT_SETTINGS)
  if (!apiKey) throw new MissingKeyError()

  const fallbackModels = buildModelFallbackChain(model)
  const fullSystem = (system || '') + buildVoltOSTelemetryAddendum(json)

  let lastError = 'Gemini request failed.'

  for (let i = 0; i < fallbackModels.length; i++) {
    const candidateModel = fallbackModels[i]
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(candidateModel)}:generateContent`

    const res = await fetch(url, {
      method: 'POST',
      signal,
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
      body: JSON.stringify({
        contents,
        ...(fullSystem.trim() ? { systemInstruction: { parts: [{ text: fullSystem }] } } : {}),
        generationConfig: {
          temperature: 0.6,
          ...(json ? { responseMimeType: 'application/json' } : {}),
        },
      }),
    })

    const data = await res.json().catch(() => null)

    if (!res.ok) {
      const errMsg = data?.error?.message ?? `Gemini request failed (HTTP ${res.status})`
      lastError = errMsg
      // Automatically retry next Flash model on 404 (model name variant), 429 (rate limit), or 503 (high demand)
      if ((res.status === 404 || res.status === 429 || res.status === 503) && i < fallbackModels.length - 1) {
        continue
      }
      throw new Error(errMsg)
    }

    const parts: { text?: string }[] = data?.candidates?.[0]?.content?.parts ?? []
    const text = parts.map((p) => p.text ?? '').join('')
    if (!text) {
      const reason = data?.promptFeedback?.blockReason ?? data?.candidates?.[0]?.finishReason
      throw new Error(reason ? `Gemini returned no text (${reason}).` : 'Gemini returned an empty response.')
    }
    return text
  }

  throw new Error(lastError)
}

export async function generateJSON<T>(prompt: string, system?: string): Promise<T> {
  const text = await generate({ contents: [{ role: 'user', parts: [{ text: prompt }] }], system, json: true })
  const cleaned = text.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/, '').trim()
  return JSON.parse(cleaned) as T
}

export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = String(reader.result)
      resolve(result.slice(result.indexOf(',') + 1))
    }
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(file)
  })
}

export function aiErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'Something went wrong talking to Gemini.'
}