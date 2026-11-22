'use client'

import React, { useState, useMemo, useEffect } from 'react'
import { Desktop } from '@/components/os/desktop'
import {
  MASTER_CHRONO_ROOTS,
  MASTER_POLITY_VAULT,
  GEO_STATIC_PINS,
  type GeoStaticPin,
  type TopoCategory,
} from '@/lib/store'

// ============================================================================
// 0. WIKIMEDIA ₹500 ANTIGRAVITY CASH FOR MAIN VOLT OS DESKTOP
// ============================================================================
const NOTE_FRONT =
  'https://commons.wikimedia.org/wiki/Special:FilePath/India_new_500_INR,_MG_series,_2016,_obverse.jpg'
const NOTE_BACK =
  'https://commons.wikimedia.org/wiki/Special:FilePath/India_new_500_INR,_MG_series,_2016,_reverse.jpg'

const NOTES = [
  { id: 1, src: NOTE_FRONT, left: '4%', width: '110px', delay: '0s', duration: '15s' },
  { id: 2, src: NOTE_BACK, left: '16%', width: '95px', delay: '-4s', duration: '18s' },
  { id: 3, src: NOTE_FRONT, left: '29%', width: '120px', delay: '-9s', duration: '16s' },
  { id: 4, src: NOTE_BACK, left: '43%', width: '105px', delay: '-2s', duration: '20s' },
  { id: 5, src: NOTE_FRONT, left: '58%', width: '115px', delay: '-11s', duration: '15s' },
  { id: 6, src: NOTE_BACK, left: '72%', width: '95px', delay: '-6s', duration: '19s' },
  { id: 7, src: NOTE_FRONT, left: '86%', width: '110px', delay: '-13s', duration: '17s' },
]

// ============================================================================
// 1. SMART STORE ADAPTERS
// ============================================================================
type Era = 'Ancient' | 'Medieval' | 'Modern'

interface NormalizedHistoryLeaf {
  id: string
  dateBadge: string
  title: string
  subtitle: string
  stars: 1 | 2 | 3
  scarred?: boolean
  cause: string
  effect: string
  polityLinkText: string
  polityLockerId: string
  quizQ: string
  quizOpts: string[]
  quizAns: number
}

interface NormalizedPolityLeaf {
  id: string
  title: string
  articleBadge: string
  lockerId: string
}

interface NormalizedTrunkHub {
  id: string
  era: Era
  yearLabel: string
  scarred?: boolean
  polityLeaves: NormalizedPolityLeaf[]
  historyLeaves: NormalizedHistoryLeaf[]
}

type VaultFilter = 'All' | 'Core Parts' | '12 Schedules' | 'Top Amendments'

interface NormalizedVaultLocker {
  id: string
  category: Exclude<VaultFilter, 'All'>
  lockerCode: string
  partBadge: string
  title: string
  articlesRange: string
  sealText: string
  stars: 1 | 2 | 3
  borrowedFrom: string
  scheduleLink: string
  historyEra: Era
  historyLeafId: string
  historyLinkLabel: string
  articles: { code: string; summary: string }[]
}

function normalizeChronoHubs(rawList: unknown[]): NormalizedTrunkHub[] {
  if (!Array.isArray(rawList) || rawList.length === 0) return []
  const first = rawList[0] as Record<string, unknown>
  if (first && Array.isArray(first.historyLeaves)) {
    return rawList as NormalizedTrunkHub[]
  }
  const byEra: Record<Era, Record<string, unknown>[]> = { Ancient: [], Medieval: [], Modern: [] }
  for (const item of rawList as Record<string, unknown>[]) {
    const era = (item.era as Era) || 'Modern'
    byEra[era]?.push(item)
  }
  const hubs: NormalizedTrunkHub[] = []
  ;(['Ancient', 'Medieval', 'Modern'] as const).forEach((era) => {
    const items = byEra[era]
    for (let i = 0; i < items.length; i += 3) {
      const chunk = items.slice(i, i + 3)
      if (!chunk.length) continue
      const firstYr = String(chunk[0].year || '')
      const lastYr = String(chunk[chunk.length - 1].year || '')
      hubs.push({
        id: `hub-${era}-${i}`,
        era,
        yearLabel: chunk.length > 1 ? `${firstYr.split('–')[0]}–${lastYr.split('–').pop()}` : firstYr,
        scarred: chunk.some((c) => Boolean(c.scarred)),
        polityLeaves: chunk.slice(0, 2).map((c, idx) => ({
          id: `pl-${String(c.id)}-${idx}`,
          title: String(c.polityTitle || 'Constitutional Link'),
          articleBadge: 'Open in Constitutional Vault',
          lockerId: String(c.polityPartId || 'pv-3'),
        })),
        historyLeaves: chunk.map((c) => ({
          id: String(c.id),
          dateBadge: String(c.date || c.year || ''),
          title: String(c.title || ''),
          subtitle: String(c.polityTitle || ''),
          stars: (Number(c.stars) || 3) as 1 | 2 | 3,
          scarred: Boolean(c.scarred),
          cause: String(c.cause || ''),
          effect: String(c.effect || ''),
          polityLinkText: String(c.polityLink || ''),
          polityLockerId: String(c.polityPartId || 'pv-3'),
          quizQ: String(c.quizQuestion || 'Which option is correct?'),
          quizOpts: Array.isArray(c.quizOptions) ? (c.quizOptions as string[]) : ['Option A', 'Option B'],
          quizAns: Number(c.quizAnswerIndex) || 0,
        })),
      })
    }
  })
  return hubs
}

function normalizeVaultLockers(rawList: unknown[]): NormalizedVaultLocker[] {
  if (!Array.isArray(rawList) || rawList.length === 0) return []
  return (rawList as Record<string, unknown>[]).map((item, idx) => {
    if (Array.isArray(item.articles)) {
      return item as unknown as NormalizedVaultLocker
    }
    const rawArts = Array.isArray(item.articlesList)
      ? (item.articlesList as { art: string; desc: string }[])
      : []
    const partStr = String(item.part || '')
    const cat: Exclude<VaultFilter, 'All'> = partStr.toLowerCase().includes('schedule')
      ? '12 Schedules'
      : partStr.toLowerCase().includes('amendment')
      ? 'Top Amendments'
      : 'Core Parts'

    return {
      id: String(item.id || `pv-${idx}`),
      category: cat,
      lockerCode: `VAULT-0${idx + 1}`,
      partBadge: partStr.toUpperCase(),
      title: String(item.title || ''),
      articlesRange: String(item.article || ''),
      sealText: 'SOVEREIGN ARCHIVE',
      stars: (Number(item.stars) || 3) as 1 | 2 | 3,
      borrowedFrom: String(item.borrowedFrom || ''),
      scheduleLink: String(item.scheduleLink || ''),
      historyEra: 'Modern',
      historyLeafId: String(item.historyNodeId || 'hl-1919'),
      historyLinkLabel: String(item.historyLink || ''),
      articles: rawArts.map((a) => ({ code: a.art, summary: a.desc })),
    }
  })
}

// ============================================================================
// 2. TAB 3 ENGINE: TRUE LATITUDE / LONGITUDE GEOREFERENCED 3D INDIA MAP
// ============================================================================
function latLngToXY(lat: number, lng: number): { x: number; y: number } {
  const safeLat = Number.isFinite(lat) ? lat : 22.5
  const safeLng = Number.isFinite(lng) ? lng : 79.0
  const x = 90 + ((safeLng - 68.0) / 29.5) * 820
  const y = 55 + ((37.2 - safeLat) / 30.2) * 960
  return { x: Math.round(x * 10) / 10, y: Math.round(y * 10) / 10 }
}

function coordsToSvgPath(coords: [number, number][], close = false): string {
  if (!coords || coords.length === 0) return ''
  const pts = coords.map(([lat, lng]) => latLngToXY(lat, lng))
  const d = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
  return close ? `${d} Z` : d
}

const INDIA_BOUNDARY_LATLNG: [number, number][] = [
  [37.05, 74.8], [36.8, 75.9], [35.9, 76.6], [35.5, 77.8], [35.1, 78.9],
  [34.3, 79.2], [33.2, 79.1], [32.7, 79.4], [32.1, 78.6],
  [31.5, 78.9], [31.1, 79.6], [30.4, 80.9], [29.8, 80.3],
  [28.8, 80.1], [28.0, 81.8], [27.5, 83.5], [27.3, 84.8], [26.6, 86.8], [26.4, 88.1],
  [27.2, 88.0], [27.95, 88.2], [28.05, 88.8], [27.3, 88.9],
  [26.8, 89.1], [26.8, 91.6], [27.6, 91.7],
  [27.9, 92.5], [28.4, 93.8], [29.1, 94.9], [29.3, 96.1], [28.2, 97.35],
  [27.1, 96.2], [26.1, 95.2], [24.8, 94.7], [23.8, 93.4], [22.1, 92.9], [23.2, 92.2],
  [24.3, 92.3], [23.2, 91.2], [24.2, 91.5], [25.1, 92.1], [25.2, 89.9], [26.2, 89.8],
  [25.2, 88.8], [24.1, 88.6], [22.6, 88.9], [21.65, 88.8], [21.6, 87.6],
  [20.8, 86.9], [19.8, 85.8], [19.2, 84.8],
  [18.2, 83.9], [17.7, 83.3], [16.5, 82.2], [15.8, 80.9], [15.4, 80.1], [13.6, 80.2],
  [13.1, 80.3], [11.7, 79.8], [10.3, 79.85], [9.28, 79.3], [9.1, 78.4], [8.08, 77.54],
  [8.6, 76.85], [9.95, 76.25], [11.25, 75.77], [12.3, 75.1],
  [12.9, 74.8], [14.8, 74.1], [15.5, 73.8], [17.0, 73.3], [18.95, 72.8], [20.4, 72.85],
  [21.6, 72.6], [21.1, 72.1], [20.7, 70.9], [21.6, 69.6], [22.3, 69.0], [22.5, 70.1],
  [22.8, 69.2], [23.3, 68.4], [23.9, 68.8], [24.2, 70.2], [24.4, 71.1],
  [25.5, 70.4], [26.8, 69.6], [27.9, 70.5], [29.4, 72.8], [30.2, 73.9],
  [31.2, 74.5], [32.1, 75.3], [32.8, 74.7], [33.8, 73.9], [34.6, 73.8], [35.4, 74.1], [36.4, 74.3],
]

const TERRAIN_MASSIFS = [
  { id: 'ter-karakoram', name: 'Karakoram, Ladakh & Zanskar', coords: [[36.6, 74.6], [35.8, 76.4], [35.2, 77.9], [34.1, 78.8], [33.1, 78.7], [33.4, 76.8], [34.3, 75.1], [35.5, 74.4]] as [number, number][], baseColor: '#475569', ridgeColor: '#94a3b8', snowColor: '#f8fafc', extrudeDx: -4, extrudeDy: -9 },
  { id: 'ter-himalaya-west', name: 'Great Himalayan Arc (West)', coords: [[33.3, 75.6], [32.4, 77.4], [31.3, 79.1], [30.3, 80.6], [29.5, 80.1], [30.1, 78.3], [31.2, 76.9], [32.5, 75.4]] as [number, number][], baseColor: '#334155', ridgeColor: '#cbd5e1', snowColor: '#ffffff', extrudeDx: -3, extrudeDy: -8 },
  { id: 'ter-himalaya-east', name: 'Eastern Himalayas', coords: [[27.8, 88.1], [27.9, 88.8], [27.6, 91.8], [28.3, 93.8], [29.1, 95.8], [28.1, 96.9], [27.3, 94.2], [27.1, 91.5], [27.1, 88.3]] as [number, number][], baseColor: '#334155', ridgeColor: '#94a3b8', snowColor: '#f1f5f9', extrudeDx: -3, extrudeDy: -7 },
  { id: 'ter-aravalli', name: 'Aravalli Fold Ridge', coords: [[24.4, 72.6], [25.6, 73.6], [26.8, 74.8], [27.9, 76.1], [27.5, 76.5], [26.2, 75.2], [24.9, 73.8], [24.2, 72.9]] as [number, number][], baseColor: '#78350f', ridgeColor: '#d97706', extrudeDx: -2, extrudeDy: -4 },
  { id: 'ter-vindhya-satpura', name: 'Vindhya & Satpura', coords: [[21.6, 74.2], [22.5, 76.5], [23.1, 79.5], [22.8, 81.8], [21.9, 81.2], [21.7, 78.2], [21.3, 75.1]] as [number, number][], baseColor: '#713f12', ridgeColor: '#eab308', extrudeDx: -2, extrudeDy: -4 },
  { id: 'ter-western-ghats', name: 'Western Ghats (Sahyadri)', coords: [[20.2, 73.5], [18.2, 73.6], [15.8, 74.2], [13.5, 75.2], [11.4, 76.6], [9.8, 77.1], [8.5, 77.4], [8.6, 76.9], [10.8, 76.1], [13.2, 74.9], [16.2, 73.7], [19.2, 73.1]] as [number, number][], baseColor: '#064e3b', ridgeColor: '#10b981', extrudeDx: -2, extrudeDy: -5 },
  { id: 'ter-eastern-ghats', name: 'Eastern Ghats', coords: [[20.4, 84.8], [18.8, 83.2], [17.4, 81.8], [15.5, 79.4], [13.4, 78.8], [11.8, 78.2], [12.2, 78.9], [15.2, 79.9], [17.8, 82.6], [19.9, 85.1]] as [number, number][], baseColor: '#14532d', ridgeColor: '#4ade80', extrudeDx: -1.5, extrudeDy: -3.5 },
]

const GEO_RIVERS = [
  { id: 'riv-indus', name: 'Indus & Panjnad', tributaries: 'Jhelum, Chenab, Ravi, Beas, Sutlej', color: '#38bdf8', mainCoords: [[32.4, 79.4], [34.2, 77.6], [35.6, 75.4], [34.5, 73.2]] as [number, number][], tributaryLines: [{ name: 'Jhelum', coords: [[33.8, 75.2], [34.2, 74.4], [32.8, 73.6]] as [number, number][] }, { name: 'Chenab', coords: [[32.7, 77.2], [33.1, 75.8], [32.1, 74.1]] as [number, number][] }, { name: 'Sutlej', coords: [[31.8, 78.7], [31.4, 76.4], [31.1, 74.5]] as [number, number][] }] },
  { id: 'riv-ganga', name: 'Ganga–Yamuna System (NW-1)', tributaries: 'Yamuna, Chambal, Son, Damodar, Kosi', color: '#22d3ee', mainCoords: [[30.9, 79.1], [29.9, 78.2], [27.2, 79.9], [25.4, 81.85], [25.3, 83.0], [25.6, 85.1], [25.2, 87.8], [24.8, 87.9], [22.5, 88.3], [21.7, 88.1]] as [number, number][], tributaryLines: [{ name: 'Yamuna', coords: [[31.0, 78.4], [28.6, 77.2], [27.2, 78.0], [25.4, 81.85]] as [number, number][] }, { name: 'Chambal', coords: [[22.5, 75.6], [24.6, 75.8], [26.5, 79.2]] as [number, number][] }, { name: 'Son', coords: [[22.7, 81.75], [24.5, 83.2], [25.6, 84.9]] as [number, number][] }, { name: 'Kosi', coords: [[27.2, 87.1], [26.2, 86.9], [25.4, 87.2]] as [number, number][] }, { name: 'Damodar', coords: [[23.7, 85.5], [23.6, 86.8], [22.4, 88.1]] as [number, number][] }] },
  { id: 'riv-brahmaputra', name: 'Brahmaputra–Teesta System (NW-2)', tributaries: 'Subansiri, Manas, Teesta, Lohit', color: '#06b6d4', mainCoords: [[29.1, 95.1], [27.9, 95.4], [26.8, 93.6], [26.2, 91.7], [26.0, 89.9], [24.5, 89.7]] as [number, number][], tributaryLines: [{ name: 'Teesta', coords: [[27.9, 88.6], [26.5, 88.8], [25.6, 89.6]] as [number, number][] }, { name: 'Lohit', coords: [[28.1, 96.8], [27.8, 95.5]] as [number, number][] }] },
  { id: 'riv-narmada-tapi', name: 'Narmada, Tapi & Mahi (West-Flowing)', tributaries: 'Mahi cuts Tropic of Cancer twice', color: '#f59e0b', mainCoords: [[22.67, 81.75], [22.8, 79.2], [22.2, 76.1], [21.8, 73.7], [21.65, 72.8]] as [number, number][], tributaryLines: [{ name: 'Tapi', coords: [[21.8, 78.2], [21.2, 75.5], [21.2, 72.7]] as [number, number][] }, { name: 'Mahi', coords: [[22.6, 75.1], [23.8, 74.4], [22.3, 72.9]] as [number, number][] }] },
  { id: 'riv-peninsular', name: 'Mahanadi, Godavari, Krishna & Cauvery', tributaries: 'Godavari, Krishna, Cauvery (East-Flowing Deltas)', color: '#10b981', mainCoords: [[19.9, 73.5], [19.1, 77.3], [18.7, 79.9], [17.0, 81.7], [16.5, 82.2]] as [number, number][], tributaryLines: [{ name: 'Mahanadi', coords: [[20.3, 81.9], [21.5, 83.9], [20.4, 85.8], [20.3, 86.7]] as [number, number][] }, { name: 'Krishna', coords: [[17.9, 73.66], [16.4, 75.9], [16.1, 78.9], [16.5, 80.6], [15.9, 80.9]] as [number, number][] }, { name: 'Cauvery', coords: [[12.38, 75.5], [12.4, 76.6], [11.8, 77.8], [10.8, 78.7], [11.1, 79.85]] as [number, number][] }] },
]

function IsometricTerrainBlock({ type, metric }: { type: string; metric: string }) {
  return (
    <div className="relative flex flex-col items-center justify-center rounded-xl border border-cyan-400/35 bg-[#061527]/95 p-2 shadow-inner">
      <span className="mb-1 rounded bg-cyan-500/20 px-1.5 py-0.5 font-mono text-[9px] font-bold text-amber-300">
        {metric}
      </span>
      {type === 'dam' && (
        <svg viewBox="0 0 180 110" className="h-24 w-36">
          <polygon points="15,65 90,25 165,65 90,102" fill="#3b2f26" stroke="#22d3ee" strokeWidth="1" />
          <polygon points="15,65 55,35 90,25 68,56" fill="#3f6212" />
          <polygon points="90,25 135,34 165,65 112,56" fill="#365314" />
          <polygon points="52,42 90,28 118,43 82,58" fill="#0284c7" />
          <polygon points="64,48 110,48 118,72 56,72" fill="#cbd5e1" stroke="#334155" strokeWidth="1.2" />
          <line x1="76" y1="52" x2="72" y2="74" stroke="#38bdf8" strokeWidth="2.5" />
          <line x1="88" y1="52" x2="88" y2="75" stroke="#38bdf8" strokeWidth="2.5" />
          <line x1="100" y1="52" x2="104" y2="74" stroke="#38bdf8" strokeWidth="2.5" />
          <polygon points="70,72 106,72 96,100 76,100" fill="#22d3ee" />
        </svg>
      )}
      {type === 'mountain' && (
        <svg viewBox="0 0 180 110" className="h-24 w-36">
          <polygon points="15,75 90,35 165,75 90,102" fill="#1e293b" stroke="#f59e0b" strokeWidth="1" />
          <polygon points="28,70 65,18 98,70" fill="#475569" />
          <polygon points="52,36 65,18 78,36 65,42" fill="#f8fafc" />
          <polygon points="82,74 125,12 158,74" fill="#64748b" />
          <polygon points="110,32 125,12 140,32 125,38" fill="#ffffff" />
          <path d="M 75 52 Q 92 62 110 48" fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeDasharray="3 2" />
        </svg>
      )}
      {type === 'bird' && (
        <svg viewBox="0 0 180 110" className="h-24 w-36">
          <polygon points="15,70 90,28 165,70 90,102" fill="#0c4a6e" stroke="#38bdf8" strokeWidth="1.2" />
          <ellipse cx="90" cy="65" rx="48" ry="22" fill="#0284c7" opacity="0.85" />
          <circle cx="58" cy="52" r="8" fill="#15803d" />
          <circle cx="122" cy="58" r="9" fill="#166534" />
          <path d="M 65 28 Q 70 22 75 28 Q 80 22 85 28" fill="none" stroke="#fde047" strokeWidth="2" />
          <path d="M 95 22 Q 100 16 105 22 Q 110 16 115 22" fill="none" stroke="#fde047" strokeWidth="2" />
          <path d="M 80 36 Q 85 30 90 36 Q 95 30 100 36" fill="none" stroke="#ffffff" strokeWidth="1.8" />
        </svg>
      )}
      {type === 'nuclear' && (
        <svg viewBox="0 0 180 110" className="h-24 w-36">
          <polygon points="15,72 90,32 165,72 90,104" fill="#1e1b4b" stroke="#a855f7" strokeWidth="1.2" />
          <path d="M 55 72 Q 62 48 58 34 L 78 34 Q 74 48 81 72 Z" fill="#94a3b8" stroke="#e2e8f0" strokeWidth="1" />
          <path d="M 92 75 Q 99 50 95 36 L 115 36 Q 111 50 118 75 Z" fill="#cbd5e1" stroke="#f8fafc" strokeWidth="1" />
          <path d="M 122 74 A 14 14 0 0 1 150 74 Z" fill="#38bdf8" stroke="#bae6fd" strokeWidth="1.2" />
        </svg>
      )}
      {(type === 'park' || type === 'temple') && (
        <svg viewBox="0 0 180 110" className="h-24 w-36">
          <polygon points="15,68 90,28 165,68 90,102" fill="#14532d" stroke="#10b981" strokeWidth="1.2" />
          <path d="M 45 48 Q 90 58 135 84" fill="none" stroke="#22d3ee" strokeWidth="7" strokeLinecap="round" />
          <circle cx="62" cy="44" r="9" fill="#22c55e" />
          <circle cx="78" cy="38" r="11" fill="#16a34a" />
          <circle cx="115" cy="48" r="10" fill="#22c55e" />
          <circle cx="90" cy="62" r="5" fill="#f59e0b" />
        </svg>
      )}
    </div>
  )
}

// ============================================================================
// 3. MAIN PAGE COMPONENT (VOLT OS FIRST + MINIMAL SWITCH TO 3-TAB STUDIO)
// ============================================================================
export default function Page() {
  // Starts false so Volt OS opens first with a minimal launcher pill
  const [studioOpen, setStudioOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'chrono' | 'vault' | 'topograph'>('chrono')

  const chronoHubs = useMemo(() => normalizeChronoHubs(MASTER_CHRONO_ROOTS as unknown[]), [])
  const vaultLockers = useMemo(() => normalizeVaultLockers(MASTER_POLITY_VAULT as unknown[]), [])
  const staticPins = useMemo(() => (GEO_STATIC_PINS || []) as GeoStaticPin[], [])

  // Tab 1 State
  const [selectedEra, setSelectedEra] = useState<Era>('Modern')
  const [selectedLeafId, setSelectedLeafId] = useState<string>('hl-1919')
  const [showChronoPopup, setShowChronoPopup] = useState<boolean>(true)
  const [quizOpen, setQuizOpen] = useState<boolean>(false)
  const [pickedOpt, setPickedOpt] = useState<number | null>(null)
  const [quizChecked, setQuizChecked] = useState<boolean>(false)

  // Tab 2 State
  const [vaultFilter, setVaultFilter] = useState<VaultFilter>('All')
  const [openLockerId, setOpenLockerId] = useState<string>('pv-3')

  // Tab 3 State
  const [topoFilter, setTopoFilter] = useState<TopoCategory>('All')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [pitch3D, setPitch3D] = useState<number>(22)
  const [zoom, setZoom] = useState<number>(1.15)
  const [panX, setPanX] = useState<number>(0)
  const [panY, setPanY] = useState<number>(0)
  const [isDragging, setIsDragging] = useState<boolean>(false)
  const [dragOrigin, setDragOrigin] = useState<{ x: number; y: number }>({ x: 0, y: 0 })
  const [showTerrain3D, setShowTerrain3D] = useState<boolean>(true)
  const [showRivers, setShowRivers] = useState<boolean>(true)
  const [labelMode, setLabelMode] = useState<'all' | 'smart'>('smart')
  const [selectedPinId, setSelectedPinId] = useState<string>('bs-keoladeo')
  const [selectedRiverId, setSelectedRiverId] = useState<string>('riv-ganga')
  const [showTopoPopup, setShowTopoPopup] = useState<boolean>(true)

  const eraHubs = useMemo(
    () => chronoHubs.filter((h) => h.era === selectedEra),
    [chronoHubs, selectedEra]
  )

  const activeLeaf = useMemo(() => {
    for (const h of chronoHubs) {
      const found = h.historyLeaves.find((l) => l.id === selectedLeafId)
      if (found) return found
    }
    return chronoHubs[0]?.historyLeaves[0] || null
  }, [chronoHubs, selectedLeafId])

  const visibleLockers = useMemo(
    () =>
      vaultFilter === 'All'
        ? vaultLockers
        : vaultLockers.filter((l) => l.category === vaultFilter),
    [vaultFilter, vaultLockers]
  )

  const activeLocker = useMemo(
    () => vaultLockers.find((l) => l.id === openLockerId) || vaultLockers[0] || null,
    [openLockerId, vaultLockers]
  )

  const visiblePins = useMemo(() => {
    return staticPins.filter((p) => {
      const catMatch = topoFilter === 'All' || p.category === topoFilter
      if (!catMatch) return false
      if (!searchQuery.trim()) return true
      const q = searchQuery.toLowerCase()
      return (
        p.shortLabel?.toLowerCase().includes(q) ||
        p.title?.toLowerCase().includes(q) ||
        p.state?.toLowerCase().includes(q) ||
        p.primaryFact?.toLowerCase().includes(q) ||
        p.tributaryOrRange?.toLowerCase().includes(q)
      )
    })
  }, [topoFilter, searchQuery, staticPins])

  const activePin = useMemo(
    () => staticPins.find((p) => p.id === selectedPinId) || staticPins[0] || null,
    [selectedPinId, staticPins]
  )

  const activeRiver = useMemo(
    () =>
      GEO_RIVERS.find((r) => r.id === (selectedRiverId || activePin?.riverSystemId || 'riv-ganga')) ||
      GEO_RIVERS[1],
    [selectedRiverId, activePin]
  )

  const indiaMainlandPath = useMemo(() => coordsToSvgPath(INDIA_BOUNDARY_LATLNG, true), [])
  const tropicOfCancerY = useMemo(() => latLngToXY(23.5, 78.0).y, [])
  const istMeridianX = useMemo(() => latLngToXY(25.15, 82.5).x, [])

  const applyClampedZoom = (nextZoom: number) => {
    const clamped = Math.min(4.0, Math.max(1.0, Math.round(nextZoom * 100) / 100))
    setZoom(clamped)
    if (clamped <= 1.05) {
      setPanX(0)
      setPanY(0)
    }
  }

  const focusOnPin = (pin: GeoStaticPin, targetZoom = 2.4) => {
    if (!pin) return
    const pt = latLngToXY(pin.lat, pin.lng)
    setSelectedPinId(pin.id)
    if (pin.riverSystemId) setSelectedRiverId(pin.riverSystemId)
    setShowTopoPopup(true)
    const z = Math.min(4.0, Math.max(1.0, targetZoom))
    setZoom(z)
    setPanX(Math.round((500 - pt.x) * 0.65))
    setPanY(Math.round((520 - pt.y) * 0.65))
  }

  const resetMapCamera = () => {
    setZoom(1.15)
    setPanX(0)
    setPanY(0)
    setPitch3D(22)
  }

  const jumpToVaultLocker = (lockerId: string) => {
    setVaultFilter('All')
    setOpenLockerId(lockerId)
    setActiveTab('vault')
  }

  const jumpToChronoLeaf = (era: Era, leafId: string) => {
    setSelectedEra(era)
    setSelectedLeafId(leafId)
    setShowChronoPopup(true)
    setPickedOpt(null)
    setQuizChecked(false)
    setActiveTab('chrono')
  }

  const svgTreeHeight = Math.max(780, eraHubs.length * 360 + 80)
  const invScale = 1 / Math.pow(zoom, 0.55)

  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  return (
    <>
      <style>{`
        @keyframes antigravityCash {
          0% { transform: translate3d(0, -15vh, 0) rotateX(0deg) rotateY(0deg) rotateZ(-12deg); opacity: 0; }
          12% { opacity: 0.28; }
          50% { transform: translate3d(35px, 50vh, 0) rotateX(180deg) rotateY(140deg) rotateZ(20deg); opacity: 0.34; }
          88% { opacity: 0.28; }
          100% { transform: translate3d(-25px, 115vh, 0) rotateX(360deg) rotateY(360deg) rotateZ(-15deg); opacity: 0; }
        }
        .money-rain-layer { position: fixed; inset: 0; overflow: hidden; pointer-events: none; z-index: 30; perspective: 1000px; }
        html.light .money-rain-layer, body.light .money-rain-layer, .light .money-rain-layer { display: none; }
        .falling-rupee { position: absolute; top: -120px; height: auto; border-radius: 4px; box-shadow: 0 12px 28px rgba(0, 0, 0, 0.45); animation-name: antigravityCash; animation-timing-function: linear; animation-iteration-count: infinite; will-change: transform, opacity; }
      `}</style>

      {!studioOpen && (
        <div className="money-rain-layer" aria-hidden="true">
          {NOTES.map((note) => (
            <img
              key={note.id}
              src={note.src}
              alt="500 INR Note"
              className="falling-rupee"
              style={{
                left: note.left,
                width: note.width,
                animationDelay: note.delay,
                animationDuration: note.duration,
              }}
            />
          ))}
        </div>
      )}

      {/* 1. EXISTING VOLT OS DESKTOP */}
      <Desktop />

      {/* 2. MINIMAL SWITCH PILL ON VOLT OS */}
      {!studioOpen && (
        <div className="fixed top-2.5 left-1/2 z-[90] -translate-x-1/2">
          <button
            onClick={() => setStudioOpen(true)}
            title="Open Chrono-Roots, Constitutional Vault & 3D TopoGraph"
            className="flex items-center gap-1.5 rounded-full border border-cyan-400/50 bg-slate-950/85 px-3 py-1 text-[11px] font-semibold tracking-wide text-cyan-200 shadow-[0_0_16px_rgba(34,211,238,0.25)] backdrop-blur-md transition hover:border-cyan-300 hover:bg-slate-900 hover:text-white"
          >
            <span className="size-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]" />
            GK/GS Studio
          </button>
        </div>
      )}

      {/* 3. FULL-SCREEN 3-TAB STUDIO */}
      {studioOpen && (
        <div className="fixed inset-0 z-[9999] flex flex-col overflow-hidden bg-[#06101e] text-slate-100 select-none">
          <header
            className={`flex flex-wrap items-center justify-between gap-2 border-b px-4 py-2 transition-colors ${
              activeTab === 'chrono'
                ? 'border-cyan-500/30 bg-[#050e1a]'
                : activeTab === 'vault'
                ? 'border-amber-500/40 bg-[#140e05]'
                : 'border-cyan-500/30 bg-[#040b16]'
            }`}
          >
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('chrono')}
                className={`rounded-lg border px-3 py-1.5 text-xs font-bold tracking-wide transition sm:text-sm ${
                  activeTab === 'chrono'
                    ? 'border-cyan-400 bg-cyan-500/20 text-cyan-200 shadow-[0_0_18px_rgba(34,211,238,0.5)]'
                    : 'border-slate-700/80 bg-slate-900/60 text-slate-400 hover:text-white'
                }`}
              >
                🌿 Chrono-Roots Map
              </button>

              <button
                onClick={() => setActiveTab('vault')}
                className={`rounded-lg border px-3 py-1.5 text-xs font-bold tracking-wide transition sm:text-sm ${
                  activeTab === 'vault'
                    ? 'border-amber-400 bg-amber-500/25 text-amber-200 shadow-[0_0_18px_rgba(245,158,11,0.5)]'
                    : 'border-slate-700/80 bg-slate-900/60 text-slate-400 hover:text-white'
                }`}
              >
                ⚖️ Constitutional Vault
              </button>

              <button
                onClick={() => setActiveTab('topograph')}
                className={`rounded-lg border px-3 py-1.5 text-xs font-bold tracking-wide transition sm:text-sm ${
                  activeTab === 'topograph'
                    ? 'border-cyan-400 bg-cyan-500/20 text-cyan-200 shadow-[0_0_18px_rgba(34,211,238,0.5)]'
                    : 'border-slate-700/80 bg-slate-900/60 text-slate-400 hover:text-white'
                }`}
              >
                🛰️ TopoGraph 3D Map
              </button>
            </div>

            <button
              onClick={() => setStudioOpen(false)}
              className="rounded-lg border border-rose-400/50 bg-rose-500/20 px-3 py-1 text-xs font-bold text-rose-200 hover:bg-rose-500/35"
            >
              ⬅ Volt OS
            </button>
          </header>

          {/* TAB 1: CHRONO-ROOTS MAP */}
          {activeTab === 'chrono' && (
            <div className="relative flex-1 overflow-auto bg-[#060f1d]">
              <div className="fixed top-16 left-4 z-30 w-52 rounded-2xl border border-cyan-400/35 bg-[#091728]/90 p-3 shadow-2xl backdrop-blur-xl">
                <p className="text-[11px] font-bold tracking-wider text-slate-200 uppercase">
                  HISTORY & POLITY ERAS
                </p>
                <div className="mt-2 grid grid-cols-3 gap-1 rounded-xl border border-slate-700/80 bg-slate-950/80 p-1">
                  {(['Ancient', 'Medieval', 'Modern'] as const).map((era) => (
                    <button
                      key={era}
                      onClick={() => {
                        setSelectedEra(era)
                        const firstHub = chronoHubs.find((h) => h.era === era)
                        if (firstHub?.historyLeaves[0]) {
                          setSelectedLeafId(firstHub.historyLeaves[0].id)
                          setShowChronoPopup(true)
                        }
                      }}
                      className={`rounded-lg py-1 text-[11px] font-bold transition ${
                        selectedEra === era
                          ? 'border border-cyan-400 bg-cyan-500/25 text-cyan-200 shadow-[0_0_10px_rgba(34,211,238,0.4)]'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {era}
                    </button>
                  ))}
                </div>
                <p className="mt-2 text-[10px] leading-relaxed text-slate-400">
                  <span className="font-bold text-amber-300">Left Amber Roots:</span> Constitutional
                  Parts. <br />
                  <span className="font-bold text-cyan-300">Right Cyan Roots:</span> Multi-branch
                  History triggers.
                </p>
              </div>

              <div className="flex min-w-[780px] justify-center px-4 py-4 pb-44">
                <svg viewBox={`0 0 1150 ${svgTreeHeight}`} className="w-full max-w-[1150px] select-none">
                  <defs>
                    <filter id="cyanGlow" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="5" result="blur" />
                      <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                    <linearGradient id="trunkGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#22d3ee" />
                      <stop offset="60%" stopColor="#06b6d4" />
                      <stop offset="82%" stopColor="#f43f5e" />
                      <stop offset="100%" stopColor="#22d3ee" />
                    </linearGradient>
                  </defs>

                  <path
                    d={`M 520 20 C 495 180, 545 340, 515 520 C 490 700, 545 880, 520 ${svgTreeHeight - 20}`}
                    fill="none"
                    stroke="url(#trunkGrad)"
                    strokeWidth="22"
                    strokeOpacity="0.25"
                    strokeLinecap="round"
                  />
                  <path
                    d={`M 520 20 C 495 180, 545 340, 515 520 C 490 700, 545 880, 520 ${svgTreeHeight - 20}`}
                    fill="none"
                    stroke="url(#trunkGrad)"
                    strokeWidth="9"
                    strokeLinecap="round"
                    filter="url(#cyanGlow)"
                  />

                  {eraHubs.map((hub, hubIdx) => {
                    const hubY = 185 + hubIdx * 350
                    const hubX = hubIdx % 2 === 0 ? 512 : 526

                    return (
                      <g key={hub.id}>
                        {hub.polityLeaves.map((pl, pIdx) => {
                          const pY =
                            hub.polityLeaves.length === 1
                              ? hubY - 22
                              : pIdx === 0
                              ? hubY - 78
                              : hubY + 35
                          return (
                            <g key={pl.id} onClick={() => jumpToVaultLocker(pl.lockerId)} className="cursor-pointer">
                              <path
                                d={`M ${hubX - 42} ${hubY} C ${hubX - 110} ${hubY}, 395 ${pY + 22}, 335 ${pY + 22}`}
                                fill="none"
                                stroke="#fbbf24"
                                strokeWidth="2.5"
                              />
                              <circle cx="335" cy={pY + 22} r="4.5" fill="#fbbf24" />
                              <rect x="65" y={pY} width="268" height="46" rx="10" fill="#271b09" fillOpacity="0.9" stroke="#f59e0b" strokeWidth="1.5" />
                              <text x="78" y={pY + 19} fill="#fde68a" fontSize="12" fontWeight="bold">{pl.title}</text>
                              <text x="78" y={pY + 35} fill="#f59e0b" fontSize="10.5" fontFamily="monospace">{pl.articleBadge} · Open Vault ↗</text>
                            </g>
                          )
                        })}

                        {hub.historyLeaves.map((hl, lIdx) => {
                          const leafY = hubY - 135 + lIdx * 84
                          const isSelected = hl.id === selectedLeafId
                          const isScar = hl.scarred
                          const branchColor = isScar ? '#f43f5e' : isSelected ? '#67e8f9' : '#22d3ee'

                          return (
                            <g
                              key={hl.id}
                              onClick={() => {
                                setSelectedLeafId(hl.id)
                                setShowChronoPopup(true)
                                setPickedOpt(null)
                                setQuizChecked(false)
                              }}
                              className="cursor-pointer"
                            >
                              <path
                                d={`M ${hubX + 42} ${hubY} C ${hubX + 115} ${hubY}, 620 ${leafY + 26}, 695 ${leafY + 26}`}
                                fill="none"
                                stroke={branchColor}
                                strokeWidth={isSelected || isScar ? '3.5' : '2.2'}
                              />
                              <circle cx="695" cy={leafY + 26} r="5" fill={branchColor} />
                              <rect
                                x="698"
                                y={leafY}
                                width="415"
                                height="54"
                                rx="11"
                                fill={isScar ? '#2d0a16' : isSelected ? '#0b293b' : '#0b1d2c'}
                                fillOpacity="0.94"
                                stroke={branchColor}
                                strokeWidth={isSelected || isScar ? '2.2' : '1.2'}
                              />
                              <text x="712" y={leafY + 18} fill={isScar ? '#fda4af' : '#67e8f9'} fontSize="10.5" fontFamily="monospace" fontWeight="bold">
                                {hl.dateBadge} {'★'.repeat(hl.stars)}
                              </text>
                              <text x="712" y={leafY + 34} fill="#ffffff" fontSize="13" fontWeight="bold">{hl.title}</text>
                              <text x="712" y={leafY + 47} fill="#94a3b8" fontSize="10.5">{hl.subtitle}</text>
                            </g>
                          )
                        })}

                        <g>
                          <rect
                            x={hubX - 48}
                            y={hubY - 20}
                            width="96"
                            height="40"
                            rx="10"
                            fill={hub.scarred ? '#4c0519' : '#082f49'}
                            stroke={hub.scarred ? '#f43f5e' : '#22d3ee'}
                            strokeWidth="2.5"
                          />
                          <text x={hubX} y={hubY + 5} textAnchor="middle" fill="#ffffff" fontSize="13" fontWeight="bold" fontFamily="monospace">
                            {hub.yearLabel}
                          </text>
                        </g>
                      </g>
                    )
                  })}
                </svg>
              </div>

              {showChronoPopup && activeLeaf && (
                <div className="fixed right-5 bottom-5 z-40 w-[92vw] max-w-md rounded-2xl border border-cyan-300/65 bg-[#0b1929]/95 p-4 shadow-[0_0_45px_rgba(6,182,212,0.4)] backdrop-blur-2xl">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-mono text-xs text-cyan-300">{activeLeaf.dateBadge}</p>
                      <h3 className="text-lg font-extrabold text-white">{activeLeaf.title}</h3>
                      <div className="mt-0.5 flex items-center gap-2">
                        <span className="text-sm text-amber-400">{'★'.repeat(activeLeaf.stars)}</span>
                        <button
                          onClick={() => setQuizOpen((v) => !v)}
                          className="rounded border border-cyan-400/50 bg-cyan-500/20 px-2 py-0.5 font-mono text-[10px] font-bold text-cyan-200 hover:bg-cyan-500/35"
                        >
                          {quizOpen ? 'Hide MCQ' : '⚡ Practice MCQ'}
                        </button>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowChronoPopup(false)}
                      className="rounded-lg border border-slate-600 bg-slate-800/80 px-2 py-0.5 text-sm font-bold text-slate-300 hover:text-white"
                    >
                      ×
                    </button>
                  </div>

                  <div className="mt-3 space-y-2 text-xs leading-relaxed text-slate-200">
                    <p><strong className="text-white">Cause:</strong> {activeLeaf.cause}</p>
                    <p><strong className="text-white">Effect:</strong> {activeLeaf.effect}</p>
                  </div>

                  <button
                    onClick={() => jumpToVaultLocker(activeLeaf.polityLockerId)}
                    className="mt-3 w-full rounded-xl border border-amber-400/70 bg-amber-950/60 px-3 py-2 text-left text-xs font-semibold text-amber-200 transition hover:bg-amber-900/70"
                  >
                    <strong className="text-amber-300">Polity Link:</strong> {activeLeaf.polityLinkText}{' '}
                    <span className="underline">(Open Vault ↗)</span>
                  </button>

                  {quizOpen && (
                    <div className="mt-3 rounded-xl border border-cyan-500/40 bg-slate-950/90 p-3">
                      <p className="text-xs font-bold text-cyan-200">{activeLeaf.quizQ}</p>
                      <div className="mt-2 space-y-1.5">
                        {activeLeaf.quizOpts.map((opt, idx) => {
                          const isPicked = pickedOpt === idx
                          const isRight = idx === activeLeaf.quizAns
                          let cls = 'border-slate-700 bg-slate-900 text-slate-300'
                          if (quizChecked) {
                            if (isRight) cls = 'border-emerald-400 bg-emerald-500/25 text-emerald-200'
                            else if (isPicked) cls = 'border-rose-500 bg-rose-500/25 text-rose-200'
                          }
                          return (
                            <button
                              key={opt}
                              onClick={() => {
                                setPickedOpt(idx)
                                setQuizChecked(true)
                              }}
                              className={`w-full rounded-lg border px-2.5 py-1.5 text-left text-xs ${cls}`}
                            >
                              {opt}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: CONSTITUTIONAL VAULT */}
          {activeTab === 'vault' && (
            <div className="relative flex-1 overflow-y-auto bg-[#0e0904] p-5 text-amber-50">
              <div className="relative z-10 mx-auto max-w-6xl pb-16">
                <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border-2 border-amber-500/45 bg-gradient-to-r from-[#1f1508] via-[#140d05] to-[#1f1508] px-4 py-3 shadow-[0_0_30px_rgba(245,158,11,0.2)]">
                  <div>
                    <span className="font-mono text-[10px] font-bold tracking-widest text-amber-400 uppercase">
                      🏛️ REPUBLIC OF INDIA · CONSTITUTIONAL SECURITY VAULT
                    </span>
                    <h2 className="text-base font-extrabold text-amber-100 sm:text-lg">
                      Select Any Classified Folder to Unlock Articles, Schedules & Amendments
                    </h2>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {(['All', 'Core Parts', '12 Schedules', 'Top Amendments'] as const).map((vf) => (
                      <button
                        key={vf}
                        onClick={() => setVaultFilter(vf)}
                        className={`rounded-lg border px-3 py-1 font-mono text-xs font-bold transition ${
                          vaultFilter === vf
                            ? 'border-amber-300 bg-amber-500/30 text-amber-100 shadow-[0_0_12px_rgba(245,158,11,0.4)]'
                            : 'border-amber-800/50 bg-[#171006] text-amber-400/75 hover:text-amber-200'
                        }`}
                      >
                        {vf}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {visibleLockers.map((locker) => {
                    const isUnlocked = locker.id === openLockerId
                    return (
                      <div key={locker.id} className="pt-4">
                        <button
                          onClick={() => setOpenLockerId(locker.id)}
                          className={`group relative flex w-full flex-col justify-between rounded-b-2xl rounded-tr-2xl border-2 p-4 text-left transition-all ${
                            isUnlocked
                              ? 'border-amber-300 bg-gradient-to-b from-[#2c1e0b] to-[#160f05] shadow-[0_0_30px_rgba(245,158,11,0.45)]'
                              : 'border-amber-600/40 bg-gradient-to-b from-[#1b1207] to-[#110b04] hover:border-amber-400'
                          }`}
                        >
                          <div
                            className={`absolute -top-4 left-[-2px] flex items-center gap-2 rounded-t-xl border-t-2 border-r-2 border-l-2 px-3 py-0.5 font-mono text-[10px] font-extrabold tracking-wider uppercase ${
                              isUnlocked
                                ? 'border-amber-300 bg-[#2c1e0b] text-amber-200'
                                : 'border-amber-600/40 bg-[#1b1207] text-amber-400'
                            }`}
                          >
                            <span>{isUnlocked ? '🔓' : '🔒'} {locker.lockerCode}</span>
                            <span className="text-amber-300">{'★'.repeat(locker.stars)}</span>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="font-mono text-[11px] font-bold text-amber-400">{locker.partBadge}</span>
                            <span className="rounded border border-amber-400/40 bg-amber-500/15 px-2 py-0.5 font-mono text-[9px] font-bold text-amber-200">
                              {locker.sealText}
                            </span>
                          </div>

                          <h3 className="mt-2 text-base font-extrabold text-white">{locker.title}</h3>
                          <p className="font-mono text-xs font-bold text-amber-300">{locker.articlesRange}</p>

                          <div className="mt-3 flex items-center justify-between border-t border-amber-500/25 pt-2.5 text-[11px] text-amber-200/90">
                            <span className="truncate">🔗 {locker.historyLinkLabel}</span>
                            <span className="ml-2 rounded bg-amber-500/25 px-2 py-0.5 font-mono text-[10px] font-bold text-amber-200">
                              {locker.articles.length} FILES
                            </span>
                          </div>
                        </button>
                      </div>
                    )
                  })}
                </div>

                {activeLocker && (
                  <div className="mt-7 rounded-2xl border-2 border-amber-400 bg-gradient-to-b from-[#251909] to-[#120c04] p-5 shadow-[0_0_45px_rgba(245,158,11,0.3)]">
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-amber-500/30 pb-3.5">
                      <div>
                        <span className="font-mono text-xs font-bold text-amber-300 uppercase">
                          🔓 ACTIVE CONSTITUTIONAL DOSSIER · {activeLocker.lockerCode} ({activeLocker.partBadge})
                        </span>
                        <h3 className="text-xl font-extrabold text-white">
                          {activeLocker.title} · {activeLocker.articlesRange}
                        </h3>
                        <p className="mt-0.5 text-xs text-amber-200/85">
                          <strong>Source:</strong> {activeLocker.borrowedFrom} | <strong>Schedule:</strong> {activeLocker.scheduleLink}
                        </p>
                      </div>

                      <button
                        onClick={() => jumpToChronoLeaf(activeLocker.historyEra, activeLocker.historyLeafId)}
                        className="rounded-xl border-2 border-cyan-400 bg-cyan-950/80 px-3.5 py-2 text-xs font-bold text-cyan-200 shadow-[0_0_18px_rgba(34,211,238,0.35)] hover:bg-cyan-900"
                      >
                        🌿 Trace Root in Chrono-Roots: {activeLocker.historyLinkLabel} ⬅
                      </button>
                    </div>

                    <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
                      {activeLocker.articles.map((art) => (
                        <div key={art.code} className="rounded-xl border border-amber-500/40 bg-[#120c05]/95 p-3.5">
                          <p className="font-mono text-xs font-extrabold text-amber-300">⚖️ {art.code}</p>
                          <p className="mt-1.5 text-xs leading-relaxed text-amber-50/95">{art.summary}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: TOPOGRAPH 3D MAP */}
          {activeTab === 'topograph' && (
            <div className="relative flex-1 overflow-hidden bg-[#040b16]">
              <aside className="fixed top-14 left-3 z-30 flex max-h-[85vh] w-64 flex-col gap-2 rounded-2xl border border-cyan-400/35 bg-[#071426]/92 p-3 shadow-2xl backdrop-blur-xl">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] font-bold tracking-wider text-cyan-300 uppercase">
                    🛰️ STATIC GK ({visiblePins.length})
                  </span>
                  <button
                    onClick={resetMapCamera}
                    className="rounded border border-cyan-400/50 bg-cyan-500/20 px-2 py-0.5 font-mono text-[10px] font-bold text-cyan-200 hover:bg-cyan-500/35"
                  >
                    Reset
                  </button>
                </div>

                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search bird, park, dam, state..."
                  className="w-full rounded-lg border border-slate-700 bg-slate-950/90 px-2.5 py-1.5 text-xs text-white placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none"
                />

                <div className="space-y-1">
                  {(
                    [
                      { id: 'All', dot: 'bg-white' },
                      { id: 'Bird Sanctuaries & Ramsar', dot: 'bg-yellow-400' },
                      { id: 'National Parks & Tigers', dot: 'bg-emerald-400' },
                      { id: 'Rivers & Hydro Dams', dot: 'bg-cyan-400' },
                      { id: 'Mountains & Passes', dot: 'bg-amber-500' },
                      { id: 'Nuclear, Ports & ISRO', dot: 'bg-purple-400' },
                      { id: 'UNESCO, Temples & Dances', dot: 'bg-rose-400' },
                      { id: 'WB JE Special', dot: 'bg-pink-400' },
                    ] as const
                  ).map((cat) => {
                    const active = topoFilter === cat.id
                    return (
                      <button
                        key={cat.id}
                        onClick={() => setTopoFilter(cat.id)}
                        className={`flex w-full items-center justify-between rounded-xl border px-2.5 py-1 text-[11px] font-bold transition ${
                          active
                            ? 'border-cyan-400 bg-cyan-500/25 text-white shadow-[0_0_12px_rgba(34,211,238,0.35)]'
                            : 'border-slate-800 bg-slate-950/70 text-slate-400 hover:text-white'
                        }`}
                      >
                        <span className="flex items-center gap-1.5 truncate">
                          <span className={`size-2 rounded-full ${cat.dot}`} />
                          {cat.id}
                        </span>
                      </button>
                    )
                  })}
                </div>

                <div className="mt-1 flex-1 space-y-1 overflow-y-auto border-t border-slate-800 pt-1.5 pr-1">
                  {visiblePins.map((pin) => (
                    <button
                      key={pin.id}
                      onClick={() => focusOnPin(pin, 2.3)}
                      className={`w-full rounded-lg border px-2 py-1.5 text-left transition ${
                        selectedPinId === pin.id
                          ? 'border-cyan-400 bg-cyan-500/25 text-white'
                          : 'border-slate-800/80 bg-slate-950/60 text-slate-300 hover:border-cyan-500/40'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[9.5px] font-mono">
                        <span className="text-cyan-300">{pin.state}</span>
                        <span className="text-slate-400">
                          {Number(pin.lat || 22).toFixed(1)}°N, {Number(pin.lng || 79).toFixed(1)}°E
                        </span>
                      </div>
                      <p className="truncate text-[11px] font-bold">{pin.shortLabel}</p>
                    </button>
                  ))}
                </div>
              </aside>

              {/* TOP-RIGHT CAMERA CONTROLLER */}
              <div className="fixed top-14 right-4 z-30 flex flex-col gap-2 rounded-2xl border border-cyan-400/35 bg-[#071426]/92 p-3 shadow-2xl backdrop-blur-xl">
                <div className="flex items-center justify-between gap-3">
                  <span className="font-mono text-[10px] font-bold text-cyan-300 uppercase">
                    🔍 ZOOM: {zoom.toFixed(2)}x
                  </span>
                  <div className="flex gap-1">
                    <button onClick={() => applyClampedZoom(zoom - 0.35)} disabled={zoom <= 1.0} className="rounded border border-slate-700 bg-slate-900 px-2 py-0.5 text-xs font-bold text-white disabled:opacity-40">−</button>
                    <button onClick={() => applyClampedZoom(zoom + 0.35)} disabled={zoom >= 4.0} className="rounded border border-slate-700 bg-slate-900 px-2 py-0.5 text-xs font-bold text-white disabled:opacity-40">+</button>
                  </div>
                </div>
                <input type="range" min={1.0} max={4.0} step={0.05} value={zoom} onChange={(e) => applyClampedZoom(parseFloat(e.target.value))} className="h-1.5 w-48 cursor-pointer accent-cyan-400" />

                <div className="flex items-center justify-between text-[10px] font-mono text-amber-300">
                  <span>⛰️ 3D TILT: {pitch3D}°</span>
                  <button onClick={() => setPitch3D((p) => (p > 0 ? 0 : 24))} className="rounded border border-amber-400/40 bg-amber-500/20 px-1.5 py-0.5 text-[9.5px] font-bold text-amber-200">
                    {pitch3D > 0 ? '2D Flat' : '3D Tilt'}
                  </button>
                </div>
                <input type="range" min={0} max={30} step={1} value={pitch3D} onChange={(e) => setPitch3D(parseInt(e.target.value, 10))} className="h-1.5 w-48 cursor-pointer accent-amber-400" />

                <div className="grid grid-cols-3 gap-1 pt-0.5 text-[10px] font-bold">
                  <button onClick={() => setShowTerrain3D((v) => !v)} className={`rounded-lg border py-1 ${showTerrain3D ? 'border-amber-400 bg-amber-500/25 text-amber-200' : 'border-slate-800 bg-slate-900 text-slate-500'}`}>3D Relief</button>
                  <button onClick={() => setShowRivers((v) => !v)} className={`rounded-lg border py-1 ${showRivers ? 'border-cyan-400 bg-cyan-500/25 text-cyan-200' : 'border-slate-800 bg-slate-900 text-slate-500'}`}>Rivers</button>
                  <button onClick={() => setLabelMode((m) => (m === 'all' ? 'smart' : 'all'))} className={`rounded-lg border py-1 ${labelMode === 'all' ? 'border-emerald-400 bg-emerald-500/25 text-emerald-200' : 'border-slate-700 bg-slate-900 text-slate-300'}`}>
                    {labelMode === 'all' ? 'All Names' : 'Smart'}
                  </button>
                </div>
              </div>

              {/* 3D TERRAIN INDIA MAP STAGE */}
              <div
                onMouseDown={(e) => {
                  setIsDragging(true)
                  setDragOrigin({ x: e.clientX - panX, y: e.clientY - panY })
                }}
                onMouseMove={(e) => {
                  if (!isDragging) return
                  const maxPan = Math.max(120, (zoom - 1) * 340)
                  setPanX(Math.min(maxPan, Math.max(-maxPan, e.clientX - dragOrigin.x)))
                  setPanY(Math.min(maxPan, Math.max(-maxPan, e.clientY - dragOrigin.y)))
                }}
                onMouseUp={() => setIsDragging(false)}
                onMouseLeave={() => setIsDragging(false)}
                onWheel={(e) => {
                  e.preventDefault()
                  applyClampedZoom(zoom + (e.deltaY < 0 ? 0.2 : -0.2))
                }}
                className={`flex h-full w-full items-center justify-center overflow-hidden ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
              >
                <div
                  className="transition-transform duration-150 ease-out"
                  style={{ transform: `perspective(1300px) rotateX(${pitch3D}deg) translate3d(${panX}px, ${panY}px, 0px) scale(${zoom})` }}
                >
                  <svg viewBox="0 0 1000 1080" className="h-[86vh] min-h-[540px] w-auto select-none drop-shadow-[0_30px_50px_rgba(6,182,212,0.32)]">
                    <defs>
                      <linearGradient id="india3DBase" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#1e324a" />
                        <stop offset="50%" stopColor="#122033" />
                        <stop offset="100%" stopColor="#091322" />
                      </linearGradient>
                    </defs>

                    <path d={indiaMainlandPath} transform="translate(18, 30)" fill="#082f49" opacity="0.45" />
                    <path d={indiaMainlandPath} transform="translate(12, 20)" fill="#0c4a6e" opacity="0.55" />
                    <path d={indiaMainlandPath} transform="translate(6, 10)" fill="#0369a1" opacity="0.7" />
                    <path d={indiaMainlandPath} fill="url(#india3DBase)" stroke="#22d3ee" strokeWidth="2.8" strokeLinejoin="round" />

                    <g opacity="0.45">
                      <line x1="110" y1={tropicOfCancerY} x2="860" y2={tropicOfCancerY} stroke="#f59e0b" strokeWidth="1.4" strokeDasharray="6 6" />
                      <text x="115" y={tropicOfCancerY - 6} fill="#fcd34d" fontSize="10" fontFamily="monospace">Tropic of Cancer (23.5°N)</text>
                      <line x1={istMeridianX} y1="80" x2={istMeridianX} y2="960" stroke="#38bdf8" strokeWidth="1.2" strokeDasharray="5 7" />
                      <text x={istMeridianX + 6} y="945" fill="#7dd3fc" fontSize="10" fontFamily="monospace">IST Meridian (82.5°E)</text>
                    </g>

                    {showTerrain3D &&
                      TERRAIN_MASSIFS.map((ter) => {
                        const basePath = coordsToSvgPath(ter.coords, true)
                        return (
                          <g key={ter.id}>
                            <path d={basePath} fill="#020617" opacity="0.45" transform="translate(3, 5)" />
                            <path d={basePath} fill={ter.baseColor} opacity="0.82" stroke={ter.ridgeColor} strokeWidth="1" />
                            <path d={basePath} fill={ter.ridgeColor} opacity="0.55" transform={`translate(${ter.extrudeDx}, ${ter.extrudeDy})`} />
                          </g>
                        )
                      })}

                    {showRivers &&
                      GEO_RIVERS.map((riv) => {
                        const isSel = activeRiver.id === riv.id
                        return (
                          <g key={riv.id} onClick={() => setSelectedRiverId(riv.id)} className="cursor-pointer">
                            <path d={coordsToSvgPath(riv.mainCoords, false)} fill="none" stroke={riv.color} strokeWidth={(isSel ? 5.2 : 3) * invScale} strokeLinecap="round" />
                            {riv.tributaryLines.map((tl) => (
                              <path key={tl.name} d={coordsToSvgPath(tl.coords, false)} fill="none" stroke={riv.color} strokeWidth={(isSel ? 2.8 : 1.7) * invScale} strokeDasharray="5 3" />
                            ))}
                          </g>
                        )
                      })}

                    {visiblePins.map((pin) => {
                      const pt = latLngToXY(pin.lat, pin.lng)
                      const isSel = pin.id === selectedPinId
                      const pinColor =
                        pin.category === 'Bird Sanctuaries & Ramsar' ? '#facc15' :
                        pin.category === 'National Parks & Tigers' ? '#10b981' :
                        pin.category === 'Rivers & Hydro Dams' ? '#22d3ee' :
                        pin.category === 'Mountains & Passes' ? '#f59e0b' :
                        pin.category === 'Nuclear, Ports & ISRO' ? '#a855f7' :
                        pin.category === 'UNESCO, Temples & Dances' ? '#fb7185' : '#ec4899'

                      const showThisLabel = labelMode === 'all' || isSel || topoFilter !== 'All' || zoom >= 1.55 || pin.stars === 3

                      return (
                        <g
                          key={pin.id}
                          transform={`translate(${pt.x}, ${pt.y}) scale(${invScale})`}
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedPinId(pin.id)
                            if (pin.riverSystemId) setSelectedRiverId(pin.riverSystemId)
                            setShowTopoPopup(true)
                          }}
                          className="cursor-pointer"
                        >
                          {isSel && <circle cx="0" cy="0" r="22" fill="none" stroke={pinColor} strokeWidth="3" />}
                          <path d="M 0 0 C -10 -14, -12 -28, 0 -28 C 12 -28, 10 -14, 0 0 Z" fill={pinColor} stroke="#020617" strokeWidth="2" />
                          <circle cx="0" cy="-18" r="3.8" fill="#020617" />
                          {showThisLabel && (
                            <g transform="translate(12, -14)">
                              <rect x="-3" y="-11" width={(pin.shortLabel?.length || 10) * 6.4 + 10} height="16" rx="4" fill="#020617" fillOpacity="0.9" stroke={isSel ? pinColor : '#334155'} strokeWidth="1" />
                              <text x="2" y="0" fill="#ffffff" fontSize="10.5" fontWeight="bold">{pin.shortLabel}</text>
                            </g>
                          )}
                        </g>
                      )
                    })}
                  </svg>
                </div>
              </div>

              {showTopoPopup && activePin && (
                <div className="fixed right-4 bottom-4 z-30 flex max-w-xl flex-wrap items-center gap-3 rounded-2xl border border-cyan-300/65 bg-[#071628]/95 p-4 shadow-[0_0_45px_rgba(6,182,212,0.45)] backdrop-blur-2xl sm:flex-nowrap">
                  <div className="max-w-sm space-y-1.5">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="rounded bg-cyan-500/20 px-2 py-0.5 font-mono text-[10px] font-bold text-cyan-300 uppercase">
                          {activePin.category} · {Number(activePin.lat || 22).toFixed(2)}°N, {Number(activePin.lng || 79).toFixed(2)}°E
                        </span>
                        <h3 className="mt-1 text-base font-extrabold text-white">{activePin.title}</h3>
                        <p className="text-xs font-semibold text-amber-300">{activePin.state}</p>
                      </div>
                      <button onClick={() => setShowTopoPopup(false)} className="rounded border border-slate-700 bg-slate-800 px-2 py-0.5 text-xs font-bold text-slate-300 hover:text-white">×</button>
                    </div>
                    <p className="text-xs leading-relaxed text-slate-200"><strong className="text-cyan-300">Core Fact:</strong> {activePin.primaryFact}</p>
                    <p className="text-xs leading-relaxed text-amber-200/95"><strong className="text-amber-300">System:</strong> {activePin.tributaryOrRange}</p>
                    <p className="rounded-lg border border-emerald-500/40 bg-emerald-950/50 px-2.5 py-1.5 text-[11px] text-emerald-200">
                      <strong>⚡ JE Pointer:</strong> {activePin.examHighlight}
                    </p>
                  </div>
                  <IsometricTerrainBlock type={activePin.landscapeType} metric={activePin.elevationOrCapacity} />
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </>
  )
}