'use client'

import React, { useState, useMemo, useEffect, useRef } from 'react'
import { Desktop } from '@/components/os/desktop'
import { ALL_HISTORY_EVENTS } from '@/lib/gs-history'
import type { HistoryEra, HistoryEventItem } from '@/lib/gs-history'
import { ALL_POLITY_LOCKERS } from '@/lib/gs-polity'
import type { PolityCategory } from '@/lib/gs-polity'
import { ALL_GEO_PINS } from '@/lib/gs-map'
import type { TopoCategory, GeoPin } from '@/lib/gs-map'

// ============================================================================
// 0. ANTIGRAVITY ₹500 NOTES LAYER FOR MAIN VOLT OS DESKTOP
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
// 1. GEOREFERENCED INDIA MAP GEOMETRY, 3D TERRAIN MASSIFS & RIVERS
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
  { id: 'ter-karakoram', coords: [[36.6, 74.6], [35.8, 76.4], [35.2, 77.9], [34.1, 78.8], [33.1, 78.7], [33.4, 76.8], [34.3, 75.1], [35.5, 74.4]] as [number, number][], baseColor: '#475569', ridgeColor: '#94a3b8', snowColor: '#f8fafc', extrudeDx: -4, extrudeDy: -9 },
  { id: 'ter-himalaya-west', coords: [[33.3, 75.6], [32.4, 77.4], [31.3, 79.1], [30.3, 80.6], [29.5, 80.1], [30.1, 78.3], [31.2, 76.9], [32.5, 75.4]] as [number, number][], baseColor: '#334155', ridgeColor: '#cbd5e1', snowColor: '#ffffff', extrudeDx: -3, extrudeDy: -8 },
  { id: 'ter-himalaya-east', coords: [[27.8, 88.1], [27.9, 88.8], [27.6, 91.8], [28.3, 93.8], [29.1, 95.8], [28.1, 96.9], [27.3, 94.2], [27.1, 91.5], [27.1, 88.3]] as [number, number][], baseColor: '#334155', ridgeColor: '#94a3b8', snowColor: '#f1f5f9', extrudeDx: -3, extrudeDy: -7 },
  { id: 'ter-aravalli', coords: [[24.4, 72.6], [25.6, 73.6], [26.8, 74.8], [27.9, 76.1], [27.5, 76.5], [26.2, 75.2], [24.9, 73.8], [24.2, 72.9]] as [number, number][], baseColor: '#78350f', ridgeColor: '#d97706', extrudeDx: -2, extrudeDy: -4 },
  { id: 'ter-vindhya-satpura', coords: [[21.6, 74.2], [22.5, 76.5], [23.1, 79.5], [22.8, 81.8], [21.9, 81.2], [21.7, 78.2], [21.3, 75.1]] as [number, number][], baseColor: '#713f12', ridgeColor: '#eab308', extrudeDx: -2, extrudeDy: -4 },
  { id: 'ter-western-ghats', coords: [[20.2, 73.5], [18.2, 73.6], [15.8, 74.2], [13.5, 75.2], [11.4, 76.6], [9.8, 77.1], [8.5, 77.4], [8.6, 76.9], [10.8, 76.1], [13.2, 74.9], [16.2, 73.7], [19.2, 73.1]] as [number, number][], baseColor: '#064e3b', ridgeColor: '#10b981', extrudeDx: -2, extrudeDy: -5 },
  { id: 'ter-eastern-ghats', coords: [[20.4, 84.8], [18.8, 83.2], [17.4, 81.8], [15.5, 79.4], [13.4, 78.8], [11.8, 78.2], [12.2, 78.9], [15.2, 79.9], [17.8, 82.6], [19.9, 85.1]] as [number, number][], baseColor: '#14532d', ridgeColor: '#4ade80', extrudeDx: -1.5, extrudeDy: -3.5 },
]

const GEO_RIVERS = [
  { id: 'riv-indus', color: '#38bdf8', mainCoords: [[32.4, 79.4], [34.2, 77.6], [35.6, 75.4], [34.5, 73.2]] as [number, number][], tributaries: [[[33.8, 75.2], [34.2, 74.4], [32.8, 73.6]], [[32.7, 77.2], [33.1, 75.8], [32.1, 74.1]], [[31.8, 78.7], [31.4, 76.4], [31.1, 74.5]]] as [number, number][][] },
  { id: 'riv-ganga', color: '#22d3ee', mainCoords: [[30.9, 79.1], [29.9, 78.2], [27.2, 79.9], [25.4, 81.85], [25.3, 83.0], [25.6, 85.1], [25.2, 87.8], [24.8, 87.9], [22.5, 88.3], [21.7, 88.1]] as [number, number][], tributaries: [[[31.0, 78.4], [28.6, 77.2], [27.2, 78.0], [25.4, 81.85]], [[22.5, 75.6], [24.6, 75.8], [26.5, 79.2]], [[23.7, 85.5], [23.6, 86.8], [22.4, 88.1]]] as [number, number][][] },
  { id: 'riv-brahmaputra', color: '#06b6d4', mainCoords: [[29.1, 95.1], [27.9, 95.4], [26.8, 93.6], [26.2, 91.7], [26.0, 89.9], [24.5, 89.7]] as [number, number][], tributaries: [[[27.9, 88.6], [26.5, 88.8], [25.6, 89.6]]] as [number, number][][] },
  { id: 'riv-narmada-tapi', color: '#f59e0b', mainCoords: [[22.67, 81.75], [22.8, 79.2], [22.2, 76.1], [21.8, 73.7], [21.65, 72.8]] as [number, number][], tributaries: [[[21.8, 78.2], [21.2, 75.5], [21.2, 72.7]]] as [number, number][][] },
  { id: 'riv-peninsular', color: '#10b981', mainCoords: [[19.9, 73.5], [19.1, 77.3], [18.7, 79.9], [17.0, 81.7], [16.5, 82.2]] as [number, number][], tributaries: [[[20.3, 81.9], [21.5, 83.9], [20.4, 85.8]], [[17.9, 73.66], [16.4, 75.9], [16.1, 78.9], [16.5, 80.6]], [[12.38, 75.5], [12.4, 76.6], [11.8, 77.8], [10.8, 78.7]]] as [number, number][][] },
]

// ============================================================================
// 2. ISOMETRIC 3D TERRAIN BLOCK VISUALIZER
// ============================================================================
function IsometricTerrainBlock({ type, metric }: { type: string; metric: string }) {
  return (
    <div className="relative flex flex-col items-center justify-center rounded-xl border border-cyan-400/35 bg-[#061527]/95 p-2 shadow-inner">
      <span className="mb-1 max-w-[140px] truncate rounded bg-cyan-500/20 px-1.5 py-0.5 font-mono text-[9px] font-bold text-amber-300">
        {metric}
      </span>
      {type === 'dam' && (
        <svg viewBox="0 0 180 110" className="h-20 w-32">
          <polygon points="15,65 90,25 165,65 90,102" fill="#3b2f26" stroke="#22d3ee" strokeWidth="1" />
          <polygon points="52,42 90,28 118,43 82,58" fill="#0284c7" />
          <polygon points="64,48 110,48 118,72 56,72" fill="#cbd5e1" stroke="#334155" strokeWidth="1.2" />
          <line x1="76" y1="52" x2="72" y2="74" stroke="#38bdf8" strokeWidth="2.5" />
          <line x1="88" y1="52" x2="88" y2="75" stroke="#38bdf8" strokeWidth="2.5" />
          <line x1="100" y1="52" x2="104" y2="74" stroke="#38bdf8" strokeWidth="2.5" />
          <polygon points="70,72 106,72 96,100 76,100" fill="#22d3ee" />
        </svg>
      )}
      {type === 'mountain' && (
        <svg viewBox="0 0 180 110" className="h-20 w-32">
          <polygon points="15,75 90,35 165,75 90,102" fill="#1e293b" stroke="#f59e0b" strokeWidth="1" />
          <polygon points="28,70 65,18 98,70" fill="#475569" />
          <polygon points="52,36 65,18 78,36 65,42" fill="#f8fafc" />
          <polygon points="82,74 125,12 158,74" fill="#64748b" />
          <polygon points="110,32 125,12 140,32 125,38" fill="#ffffff" />
        </svg>
      )}
      {type === 'bird' && (
        <svg viewBox="0 0 180 110" className="h-20 w-32">
          <polygon points="15,70 90,28 165,70 90,102" fill="#0c4a6e" stroke="#38bdf8" strokeWidth="1.2" />
          <ellipse cx="90" cy="65" rx="48" ry="22" fill="#0284c7" opacity="0.85" />
          <path d="M 65 28 Q 70 22 75 28 Q 80 22 85 28" fill="none" stroke="#fde047" strokeWidth="2" />
          <path d="M 95 22 Q 100 16 105 22 Q 110 16 115 22" fill="none" stroke="#fde047" strokeWidth="2" />
        </svg>
      )}
      {type === 'nuclear' && (
        <svg viewBox="0 0 180 110" className="h-20 w-32">
          <polygon points="15,72 90,32 165,72 90,104" fill="#1e1b4b" stroke="#a855f7" strokeWidth="1.2" />
          <path d="M 55 72 Q 62 48 58 34 L 78 34 Q 74 48 81 72 Z" fill="#94a3b8" stroke="#e2e8f0" strokeWidth="1" />
          <path d="M 122 74 A 14 14 0 0 1 150 74 Z" fill="#38bdf8" stroke="#bae6fd" strokeWidth="1.2" />
        </svg>
      )}
      {(type === 'park' || type === 'temple') && (
        <svg viewBox="0 0 180 110" className="h-20 w-32">
          <polygon points="15,68 90,28 165,68 90,102" fill="#14532d" stroke="#10b981" strokeWidth="1.2" />
          <circle cx="62" cy="44" r="9" fill="#22c55e" />
          <circle cx="78" cy="38" r="11" fill="#16a34a" />
          <circle cx="115" cy="48" r="10" fill="#22c55e" />
        </svg>
      )}
    </div>
  )
}

// ============================================================================
// 3. ZERO-QUOTA BUILT-IN 20-QUESTION EXAM QUIZ GENERATOR
// ============================================================================
interface ExamQuestion {
  tag: 'History' | 'Polity' | 'Static GK'
  q: string
  options: string[]
  ans: number
}

function shuffleArray<T>(arr: T[]): T[] {
  const copy = [...arr]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const tmp = copy[i]
    copy[i] = copy[j]
    copy[j] = tmp
  }
  return copy
}

function generateExamQuiz(count = 20): ExamQuestion[] {
  const pool: ExamQuestion[] = []

  const histShuffled = shuffleArray(ALL_HISTORY_EVENTS).slice(0, 8)
  for (const ev of histShuffled) {
    const distractors = shuffleArray(
      ALL_HISTORY_EVENTS.filter((x) => x.year !== ev.year && x.era === ev.era)
    )
      .map((x) => x.year)
      .filter((v, i, a) => a.indexOf(v) === i)
      .slice(0, 3)
    if (distractors.length === 3) {
      const opts = shuffleArray([ev.year, ...distractors])
      pool.push({
        tag: 'History',
        q: `In which year/period did "${ev.title}" occur?`,
        options: opts,
        ans: opts.indexOf(ev.year),
      })
    }
  }

  const allPolityItems = ALL_POLITY_LOCKERS.flatMap((l) => l.items)
  const polShuffled = shuffleArray(allPolityItems).slice(0, 7)
  for (const item of polShuffled) {
    const distractors = shuffleArray(
      allPolityItems.filter((x) => x.code !== item.code && x.title !== item.title)
    )
      .map((x) => x.title)
      .filter((v, i, a) => a.indexOf(v) === i)
      .slice(0, 3)
    if (distractors.length === 3) {
      const opts = shuffleArray([item.title, ...distractors])
      pool.push({
        tag: 'Polity',
        q: `What does "${item.code}" of the Indian Constitution deal with?`,
        options: opts,
        ans: opts.indexOf(item.title),
      })
    }
  }

  const mapShuffled = shuffleArray(ALL_GEO_PINS).slice(0, 7)
  for (const pin of mapShuffled) {
    const distractors = shuffleArray(
      ALL_GEO_PINS.filter((x) => x.state !== pin.state)
    )
      .map((x) => x.state)
      .filter((v, i, a) => a.indexOf(v) === i)
      .slice(0, 3)
    if (distractors.length === 3) {
      const opts = shuffleArray([pin.state, ...distractors])
      pool.push({
        tag: 'Static GK',
        q: `Where is "${pin.title}" (${pin.typeLabel}) located?`,
        options: opts,
        ans: opts.indexOf(pin.state),
      })
    }
  }

  return shuffleArray(pool).slice(0, count)
}

// ============================================================================
// 4. MAIN VOLT OS + 3-TAB UNCOMPRESSED GK/GS STUDIO PAGE
// ============================================================================
export default function Page() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])

  const [studioOpen, setStudioOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'chrono' | 'vault' | 'topograph'>('chrono')

  // Tab 1: Chrono-Roots State
  const [selectedEra, setSelectedEra] = useState<HistoryEra>('Modern')
  const [polityLinkedOnly, setPolityLinkedOnly] = useState(false)
  const [historySearch, setHistorySearch] = useState('')
  const [selectedHistoryId, setSelectedHistoryId] = useState<string>('mod-36')
  const [showChronoPopup, setShowChronoPopup] = useState<boolean>(true)

  // Tab 2: Constitutional Vault State
  const [vaultFilter, setVaultFilter] = useState<PolityCategory>('All')
  const [vaultSearch, setVaultSearch] = useState('')
  const [openLockerId, setOpenLockerId] = useState<string>('pv-3')

  // Tab 3: TopoGraph 3D Map State
  const [topoFilter, setTopoFilter] = useState<TopoCategory>('All')
  const [mapSearch, setMapSearch] = useState('')
  const [showMapSidebar, setShowMapSidebar] = useState(true)
  const [pitch3D, setPitch3D] = useState<number>(22)
  const [zoom, setZoom] = useState<number>(1.15)
  const [panX, setPanX] = useState<number>(0)
  const [panY, setPanY] = useState<number>(0)
  const [isDragging, setIsDragging] = useState<boolean>(false)
  const [dragOrigin, setDragOrigin] = useState<{ x: number; y: number }>({ x: 0, y: 0 })
  const [showTerrain3D, setShowTerrain3D] = useState<boolean>(true)
  const [showRivers, setShowRivers] = useState<boolean>(true)
  const [labelMode, setLabelMode] = useState<'all' | 'smart'>('smart')
  const [selectedPinId, setSelectedPinId] = useState<string>('park-7')
  const [selectedRiverId, setSelectedRiverId] = useState<string>('riv-ganga')
  const [showTopoPopup, setShowTopoPopup] = useState<boolean>(true)

  // Built-in 20-Q Rapid Exam Quiz Modal State
  const [showQuizModal, setShowQuizModal] = useState(false)
  const [quizQuestions, setQuizQuestions] = useState<ExamQuestion[]>([])
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({})

  const mapStageRef = useRef<HTMLDivElement | null>(null)

  const polityById = useMemo(
    () => new Map(ALL_POLITY_LOCKERS.map((l) => [l.id, l])),
    []
  )

  const eraCounts = useMemo(() => {
    const counts: Record<HistoryEra, number> = { Ancient: 0, Medieval: 0, Modern: 0, World: 0 }
    for (const ev of ALL_HISTORY_EVENTS) counts[ev.era] += 1
    return counts
  }, [])

  const linkedCount = useMemo(
    () => ALL_HISTORY_EVENTS.filter((ev) => Boolean(ev.polityId)).length,
    []
  )

  const visibleHistoryEvents = useMemo(() => {
    const q = historySearch.trim().toLowerCase()
    let list = q
      ? ALL_HISTORY_EVENTS.filter(
          (ev) =>
            ev.year.toLowerCase().includes(q) ||
            ev.title.toLowerCase().includes(q) ||
            ev.note.toLowerCase().includes(q) ||
            (ev.polityReason ? ev.polityReason.toLowerCase().includes(q) : false)
        )
      : polityLinkedOnly
      ? ALL_HISTORY_EVENTS.filter((ev) => Boolean(ev.polityId))
      : ALL_HISTORY_EVENTS.filter((ev) => ev.era === selectedEra)

    if (q && polityLinkedOnly) {
      list = list.filter((ev) => Boolean(ev.polityId))
    }
    return list
  }, [selectedEra, historySearch, polityLinkedOnly])

  const activeHistoryEvent = useMemo<HistoryEventItem | null>(() => {
    return (
      ALL_HISTORY_EVENTS.find((ev) => ev.id === selectedHistoryId) ||
      visibleHistoryEvents[0] ||
      ALL_HISTORY_EVENTS[0] ||
      null
    )
  }, [selectedHistoryId, visibleHistoryEvents])

  const activeHistoryPolity = useMemo(() => {
    if (!activeHistoryEvent?.polityId) return null
    return polityById.get(activeHistoryEvent.polityId) || null
  }, [activeHistoryEvent, polityById])

  const visibleLockers = useMemo(() => {
    return vaultFilter === 'All'
      ? ALL_POLITY_LOCKERS
      : ALL_POLITY_LOCKERS.filter((l) => l.category === vaultFilter)
  }, [vaultFilter])

  const activeLocker = useMemo(() => {
    return ALL_POLITY_LOCKERS.find((l) => l.id === openLockerId) || ALL_POLITY_LOCKERS[0]
  }, [openLockerId])

  const globalPolityMatches = useMemo(() => {
    const q = vaultSearch.trim().toLowerCase()
    if (!q) return []
    const hits: { lockerId: string; lockerCode: string; code: string; title: string; note: string }[] = []
    for (const locker of ALL_POLITY_LOCKERS) {
      for (const item of locker.items) {
        if (
          item.code.toLowerCase().includes(q) ||
          item.title.toLowerCase().includes(q) ||
          item.note.toLowerCase().includes(q)
        ) {
          hits.push({
            lockerId: locker.id,
            lockerCode: locker.lockerCode,
            code: item.code,
            title: item.title,
            note: item.note,
          })
        }
      }
    }
    return hits
  }, [vaultSearch])

  const mapCategoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: ALL_GEO_PINS.length }
    for (const p of ALL_GEO_PINS) {
      counts[p.category] = (counts[p.category] || 0) + 1
    }
    return counts
  }, [])

  const visiblePins = useMemo(() => {
    const q = mapSearch.trim().toLowerCase()
    return ALL_GEO_PINS.filter((p) => {
      if (topoFilter !== 'All' && p.category !== topoFilter) return false
      if (!q) return true
      return (
        p.shortLabel.toLowerCase().includes(q) ||
        p.title.toLowerCase().includes(q) ||
        p.state.toLowerCase().includes(q) ||
        p.typeLabel.toLowerCase().includes(q) ||
        p.note.toLowerCase().includes(q)
      )
    })
  }, [topoFilter, mapSearch])

  const activePin = useMemo(() => {
    return ALL_GEO_PINS.find((p) => p.id === selectedPinId) || visiblePins[0] || ALL_GEO_PINS[0]
  }, [selectedPinId, visiblePins])

  const activeRiver = useMemo(() => {
    return (
      GEO_RIVERS.find((r) => r.id === (selectedRiverId || activePin?.riverSystemId || 'riv-ganga')) ||
      GEO_RIVERS[1]
    )
  }, [selectedRiverId, activePin])

  const indiaMainlandPath = useMemo(() => coordsToSvgPath(INDIA_BOUNDARY_LATLNG, true), [])
  const tropicOfCancerY = useMemo(() => latLngToXY(23.5, 78.0).y, [])
  const istMeridianX = useMemo(() => latLngToXY(25.15, 82.5).x, [])
  const invScale = 1 / Math.pow(zoom, 0.55)

  const applyClampedZoom = (nextZoom: number) => {
    const clamped = Math.min(4.0, Math.max(1.0, Math.round(nextZoom * 100) / 100))
    setZoom(clamped)
    if (clamped <= 1.05) {
      setPanX(0)
      setPanY(0)
    }
  }

  useEffect(() => {
    if (!studioOpen || activeTab !== 'topograph') return
    const el = mapStageRef.current
    if (!el) return
    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      setZoom((prev) => {
        const next = Math.min(4.0, Math.max(1.0, Math.round((prev + (e.deltaY < 0 ? 0.2 : -0.2)) * 100) / 100))
        if (next <= 1.05) {
          setPanX(0)
          setPanY(0)
        }
        return next
      })
    }
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [studioOpen, activeTab])

  const focusOnPin = (pin: GeoPin, targetZoom = 2.4) => {
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
    setVaultSearch('')
    setOpenLockerId(lockerId)
    setActiveTab('vault')
  }

  const jumpToChronoEvent = (era: HistoryEra, eventId: string) => {
    setPolityLinkedOnly(false)
    setSelectedEra(era)
    setHistorySearch('')
    setSelectedHistoryId(eventId)
    setShowChronoPopup(true)
    setActiveTab('chrono')
    setTimeout(() => {
      const target = document.getElementById(`hist-node-${eventId}`)
      target?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }, 80)
  }

  const openRapidQuiz = () => {
    setQuizQuestions(generateExamQuiz(20))
    setQuizAnswers({})
    setShowQuizModal(true)
  }

  const quizScore = useMemo(() => {
    let correct = 0
    const answered = Object.keys(quizAnswers).length
    for (const [idxStr, optIdx] of Object.entries(quizAnswers)) {
      const q = quizQuestions[Number(idxStr)]
      if (q && q.ans === optIdx) correct += 1
    }
    return { correct, answered }
  }, [quizAnswers, quizQuestions])

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

      {/* 1. VOLT OS DESKTOP (ALWAYS OPENS FIRST) */}
      <Desktop />

     {/* 2. CLEAN TOP-BAR LAUNCHER (HIGH Z-INDEX — 100% CLICKABLE ON DESKTOP & MOBILE) */}
   {!studioOpen && (
     <div className="fixed top-1.5 left-1/2 z-[9990] -translate-x-1/2">
       <button
         onClick={() => setStudioOpen(true)}
         title="Open Chrono-Roots, Constitutional Vault & 3D TopoGraph"
         className="group flex h-7 items-center gap-1.5 rounded-full border border-cyan-400/55 bg-gradient-to-r from-[#081c2e]/95 via-[#0d273f]/95 to-[#162138]/95 px-2.5 text-[11px] font-bold tracking-wide text-cyan-100 shadow-[0_0_16px_rgba(34,211,238,0.28)] backdrop-blur-md transition hover:border-cyan-300 hover:shadow-[0_0_22px_rgba(34,211,238,0.55)] sm:h-8 sm:gap-2 sm:px-3.5 sm:text-xs"
       >
         <svg
           viewBox="0 0 24 24"
           fill="none"
           className="size-3.5 shrink-0 text-cyan-300 transition-transform duration-300 group-hover:rotate-12 sm:size-4"
           aria-hidden="true"
         >
           <circle cx="12" cy="12" r="9.5" stroke="currentColor" strokeWidth="1.7" />
           <ellipse cx="12" cy="12" rx="4.2" ry="9.5" stroke="currentColor" strokeWidth="1.4" />
           <path d="M2.8 12h18.4" stroke="currentColor" strokeWidth="1.4" />
           <path d="M12 2.5l1.6 4.4L18 8.5l-4.4 1.6L12 14.5l-1.6-4.4L6 8.5l4.4-1.6L12 2.5z" fill="#fbbf24" opacity="0.9" />
         </svg>
         <span className="bg-gradient-to-r from-cyan-100 via-white to-amber-200 bg-clip-text text-transparent">
           <span className="sm:hidden">GS Studio</span>
           <span className="hidden sm:inline">GK/GS Studio</span>
         </span>
       </button>
     </div>
   )}
      {/* 3. FULL-SCREEN 3-TAB UNCOMPRESSED GK/GS STUDIO */}
      {studioOpen && (
        <div className="fixed inset-0 z-[9999] flex flex-col overflow-hidden bg-[#06101e] text-slate-100 select-none">
          <header
            className={`flex flex-wrap items-center justify-between gap-2 border-b px-3 py-2 transition-colors sm:px-4 ${
              activeTab === 'chrono'
                ? 'border-cyan-500/30 bg-[#050e1a]'
                : activeTab === 'vault'
                ? 'border-amber-500/40 bg-[#140e05]'
                : 'border-cyan-500/30 bg-[#040b16]'
            }`}
          >
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <button
                onClick={() => setActiveTab('chrono')}
                className={`rounded-lg border px-2.5 py-1.5 text-xs font-bold tracking-wide transition sm:px-3 sm:text-sm ${
                  activeTab === 'chrono'
                    ? 'border-cyan-400 bg-cyan-500/20 text-cyan-200 shadow-[0_0_18px_rgba(34,211,238,0.5)]'
                    : 'border-slate-700/80 bg-slate-900/60 text-slate-400 hover:text-white'
                }`}
              >
                🌿 Chrono-Roots ({ALL_HISTORY_EVENTS.length})
              </button>

              <button
                onClick={() => setActiveTab('vault')}
                className={`rounded-lg border px-2.5 py-1.5 text-xs font-bold tracking-wide transition sm:px-3 sm:text-sm ${
                  activeTab === 'vault'
                    ? 'border-amber-400 bg-amber-500/25 text-amber-200 shadow-[0_0_18px_rgba(245,158,11,0.5)]'
                    : 'border-slate-700/80 bg-slate-900/60 text-slate-400 hover:text-white'
                }`}
              >
                ⚖️ Constitutional Vault ({ALL_POLITY_LOCKERS.reduce((s, l) => s + l.items.length, 0)})
              </button>

              <button
                onClick={() => setActiveTab('topograph')}
                className={`rounded-lg border px-2.5 py-1.5 text-xs font-bold tracking-wide transition sm:px-3 sm:text-sm ${
                  activeTab === 'topograph'
                    ? 'border-cyan-400 bg-cyan-500/20 text-cyan-200 shadow-[0_0_18px_rgba(34,211,238,0.5)]'
                    : 'border-slate-700/80 bg-slate-900/60 text-slate-400 hover:text-white'
                }`}
              >
                🛰️ TopoGraph 3D ({ALL_GEO_PINS.length})
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={openRapidQuiz}
                className="rounded-lg border border-purple-400/60 bg-purple-500/20 px-3 py-1 text-xs font-bold text-purple-200 hover:bg-purple-500/35"
              >
                ⚡ 20-Q Exam Quiz
              </button>
              <button
                onClick={() => setStudioOpen(false)}
                className="rounded-lg border border-rose-400/50 bg-rose-500/20 px-3 py-1 text-xs font-bold text-rose-200 hover:bg-rose-500/35"
              >
                ⬅ Back to Volt OS
              </button>
            </div>
          </header>

          {/* ============================================================== */}
          {/* TAB 1: CHRONO-ROOTS MAP (VERIFIED POLITY LINKS ONLY)           */}
          {/* ============================================================== */}
          {activeTab === 'chrono' && (
            <div className="relative flex flex-1 flex-col overflow-hidden bg-[#060f1d]">
              <div className="z-20 flex flex-wrap items-center justify-between gap-2 border-b border-cyan-500/20 bg-[#081525]/95 px-4 py-2.5 backdrop-blur-xl">
                <div className="flex flex-wrap items-center gap-1.5">
                  {(['Ancient', 'Medieval', 'Modern', 'World'] as const).map((era) => {
                    const active = !historySearch.trim() && !polityLinkedOnly && selectedEra === era
                    return (
                      <button
                        key={era}
                        onClick={() => {
                          setPolityLinkedOnly(false)
                          setHistorySearch('')
                          setSelectedEra(era)
                          const first = ALL_HISTORY_EVENTS.find((e) => e.era === era)
                          if (first) {
                            setSelectedHistoryId(first.id)
                            setShowChronoPopup(true)
                          }
                        }}
                        className={`rounded-lg border px-3 py-1 text-xs font-bold transition ${
                          active
                            ? 'border-cyan-400 bg-cyan-500/25 text-cyan-100 shadow-[0_0_12px_rgba(34,211,238,0.4)]'
                            : 'border-slate-700/80 bg-slate-900/70 text-slate-400 hover:text-white'
                        }`}
                      >
                        {era} <span className="ml-1 font-mono text-[10px] opacity-75">({eraCounts[era]})</span>
                      </button>
                    )
                  })}

                  <button
                    onClick={() => setPolityLinkedOnly((v) => !v)}
                    className={`rounded-lg border px-3 py-1 text-xs font-bold transition ${
                      polityLinkedOnly
                        ? 'border-amber-300 bg-amber-500/25 text-amber-100 shadow-[0_0_12px_rgba(245,158,11,0.4)]'
                        : 'border-amber-700/60 bg-amber-950/30 text-amber-300/85 hover:border-amber-400 hover:text-amber-100'
                    }`}
                  >
                    ⚖️ Polity-Linked Only ({linkedCount})
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={historySearch}
                    onChange={(e) => setHistorySearch(e.target.value)}
                    placeholder="Search year, battle, ruler, or constitutional link..."
                    className="w-64 rounded-lg border border-cyan-500/35 bg-slate-950/90 px-3 py-1.5 text-xs text-white placeholder:text-slate-500 focus:border-cyan-300 focus:outline-none sm:w-80"
                  />
                  {historySearch && (
                    <button
                      onClick={() => setHistorySearch('')}
                      className="rounded-lg border border-slate-700 bg-slate-900 px-2 py-1 text-xs text-slate-300 hover:text-white"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>

              {/* Neural Trunk Timeline */}
              <div className="flex-1 overflow-y-auto px-3 py-6 pb-52 sm:px-6">
                <div className="relative mx-auto max-w-5xl">
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute top-0 bottom-0 left-5 w-1.5 rounded-full bg-gradient-to-b from-cyan-400 via-cyan-500 to-rose-500 opacity-75 shadow-[0_0_18px_rgba(34,211,238,0.55)] md:left-1/2 md:-translate-x-1/2"
                  />

                  <div className="space-y-4">
                    {visibleHistoryEvents.map((ev) => {
                      const isSel = activeHistoryEvent?.id === ev.id
                      const linkedPolity = ev.polityId ? polityById.get(ev.polityId) || null : null
                      return (
                        <div
                          key={ev.id}
                          id={`hist-node-${ev.id}`}
                          className="relative grid grid-cols-1 items-center gap-2 pl-12 md:grid-cols-[1fr_120px_1fr] md:gap-4 md:pl-0"
                        >
                          {/* Left Amber Polity Root — ONLY rendered when a verified historical reference exists */}
                          <div className="hidden justify-end md:flex">
                            {linkedPolity ? (
                              <button
                                onClick={() => jumpToVaultLocker(linkedPolity.id)}
                                className="group flex max-w-sm flex-col items-end rounded-xl border border-amber-500/60 bg-[#241808]/92 px-3 py-2 text-right transition hover:border-amber-300 hover:bg-[#33220c]"
                              >
                                <p className="font-mono text-[10px] font-bold text-amber-400">
                                  ⚖️ {linkedPolity.articlesRange} · Open Vault ↗
                                </p>
                                <p className="text-[11px] font-extrabold text-amber-100">
                                  {linkedPolity.title}
                                </p>
                                {ev.polityReason && (
                                  <p className="mt-0.5 line-clamp-2 text-[10px] leading-snug text-amber-200/80">
                                    {ev.polityReason}
                                  </p>
                                )}
                              </button>
                            ) : (
                              <div className="pr-2 font-mono text-[10px] text-slate-600/70">
                                {ev.era} Chronicle
                              </div>
                            )}
                          </div>

                          {/* Center Year Hub */}
                          <div className="absolute left-0 flex items-center md:static md:justify-center">
                            <button
                              onClick={() => {
                                setSelectedHistoryId(ev.id)
                                setShowChronoPopup(true)
                              }}
                              className={`z-10 min-w-[44px] rounded-xl border-2 px-2 py-1.5 text-center font-mono text-[10px] font-extrabold shadow-lg transition md:min-w-[106px] md:text-xs ${
                                ev.scarred
                                  ? 'border-rose-400 bg-[#4c0519] text-rose-100 shadow-[0_0_14px_rgba(244,63,94,0.45)]'
                                  : isSel
                                  ? 'border-cyan-200 bg-cyan-900 text-white shadow-[0_0_16px_rgba(34,211,238,0.65)]'
                                  : 'border-cyan-400/80 bg-[#082f49] text-cyan-100 hover:border-white'
                              }`}
                            >
                              {ev.year}
                            </button>
                          </div>

                          {/* Right Cyan/Rose History Event Leaf */}
                          <button
                            onClick={() => {
                              setSelectedHistoryId(ev.id)
                              setShowChronoPopup(true)
                            }}
                            className={`w-full rounded-xl border p-3 text-left transition ${
                              ev.scarred
                                ? isSel
                                  ? 'border-rose-300 bg-[#3a0c1d] shadow-[0_0_20px_rgba(244,63,94,0.4)]'
                                  : 'border-rose-500/60 bg-[#2a0a16]/90 hover:border-rose-300'
                                : isSel
                                ? 'border-cyan-300 bg-[#0c2d42] shadow-[0_0_20px_rgba(34,211,238,0.35)]'
                                : 'border-cyan-500/35 bg-[#0b1d2c]/90 hover:border-cyan-300'
                            }`}
                          >
                            <div className="flex items-center justify-between gap-2">
                              <span className="font-mono text-[10px] font-bold text-cyan-300 uppercase">
                                {ev.era} · {ev.year}
                              </span>
                              {linkedPolity && (
                                <span className="rounded bg-amber-500/20 px-1.5 py-0.5 font-mono text-[9px] font-bold text-amber-300">
                                  ⚖️ {linkedPolity.lockerCode}
                                </span>
                              )}
                            </div>
                            <h3 className="mt-0.5 text-sm font-extrabold text-white">{ev.title}</h3>
                            <p className="mt-0.5 text-xs text-slate-300">{ev.note}</p>
                          </button>
                        </div>
                      )
                    })}

                    {visibleHistoryEvents.length === 0 && (
                      <div className="rounded-2xl border border-slate-700 bg-slate-900/80 p-8 text-center text-sm text-slate-400">
                        No historical dates matched "{historySearch}". Try searching a year like 1757, 1919, or 1947.
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Floating Detail Card */}
              {showChronoPopup && activeHistoryEvent && (
                <div className="fixed right-4 bottom-4 z-40 w-[92vw] max-w-md rounded-2xl border border-cyan-300/65 bg-[#0b1929]/95 p-4 shadow-[0_0_45px_rgba(6,182,212,0.4)] backdrop-blur-2xl">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-mono text-xs font-bold text-cyan-300">
                        {activeHistoryEvent.era.toUpperCase()} · {activeHistoryEvent.year}
                      </p>
                      <h3 className="mt-0.5 text-base font-extrabold text-white sm:text-lg">
                        {activeHistoryEvent.title}
                      </h3>
                    </div>
                    <button
                      onClick={() => setShowChronoPopup(false)}
                      className="rounded-lg border border-slate-600 bg-slate-800/80 px-2 py-0.5 text-sm font-bold text-slate-300 hover:text-white"
                    >
                      ×
                    </button>
                  </div>

                  <p className="mt-2.5 text-xs leading-relaxed text-slate-200">
                    <strong className="text-cyan-300">Key Exam Note:</strong> {activeHistoryEvent.note}
                  </p>

                  {activeHistoryPolity && (
                    <button
                      onClick={() => jumpToVaultLocker(activeHistoryPolity.id)}
                      className="mt-3 w-full rounded-xl border border-amber-400/70 bg-amber-950/60 px-3 py-2 text-left text-xs text-amber-100 transition hover:bg-amber-900/70"
                    >
                      <p className="font-bold text-amber-300">
                        ⚖️ Connected Polity Vault: {activeHistoryPolity.title} ({activeHistoryPolity.articlesRange}) ↗
                      </p>
                      {activeHistoryEvent.polityReason && (
                        <p className="mt-1 text-[11px] leading-relaxed text-amber-100/90">
                          <strong>Historical Reference:</strong> {activeHistoryEvent.polityReason}
                        </p>
                      )}
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ============================================================== */}
          {/* TAB 2: CONSTITUTIONAL VAULT (ALL ARTICLES, SCHEDULES & 34 AMENDS) */}
          {/* ============================================================== */}
          {activeTab === 'vault' && (
            <div className="relative flex-1 overflow-y-auto bg-[#0e0904] p-4 text-amber-50 sm:p-5">
              <svg
                aria-hidden="true"
                viewBox="0 0 200 200"
                className="pointer-events-none fixed top-1/2 left-1/2 size-[460px] -translate-x-1/2 -translate-y-1/2 opacity-[0.05]"
              >
                <circle cx="100" cy="100" r="88" fill="none" stroke="#f59e0b" strokeWidth="6" />
                <circle cx="100" cy="100" r="16" fill="#f59e0b" />
                {Array.from({ length: 24 }).map((_, i) => {
                  const angle = (i * 15 * Math.PI) / 180
                  return (
                    <line
                      key={i}
                      x1="100"
                      y1="100"
                      x2={100 + 88 * Math.cos(angle)}
                      y2={100 + 88 * Math.sin(angle)}
                      stroke="#f59e0b"
                      strokeWidth="2"
                    />
                  )
                })}
              </svg>

              <div className="relative z-10 mx-auto max-w-6xl pb-16">
                <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border-2 border-amber-500/45 bg-gradient-to-r from-[#1f1508] via-[#140d05] to-[#1f1508] px-4 py-3 shadow-[0_0_30px_rgba(245,158,11,0.2)]">
                  <div>
                    <span className="font-mono text-[10px] font-bold tracking-widest text-amber-400 uppercase">
                      🏛️ REPUBLIC OF INDIA · UNCOMPRESSED CONSTITUTIONAL VAULT
                    </span>
                    <h2 className="text-base font-extrabold text-amber-100 sm:text-lg">
                      All Articles (1–395), 5 Writs, 12 Schedules & 34 Landmark Amendments
                    </h2>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <input
                      type="text"
                      value={vaultSearch}
                      onChange={(e) => setVaultSearch(e.target.value)}
                      placeholder="Search Art. 21A, CAG, GST, 106th..."
                      className="w-56 rounded-lg border border-amber-500/45 bg-[#120c05] px-3 py-1.5 text-xs text-amber-50 placeholder:text-amber-500/60 focus:border-amber-300 focus:outline-none"
                    />
                    <div className="flex flex-wrap gap-1">
                      {(['All', 'Core Parts', '12 Schedules', 'Top Amendments'] as const).map((vf) => (
                        <button
                          key={vf}
                          onClick={() => {
                            setVaultSearch('')
                            setVaultFilter(vf)
                          }}
                          className={`rounded-lg border px-2.5 py-1 font-mono text-xs font-bold transition ${
                            !vaultSearch.trim() && vaultFilter === vf
                              ? 'border-amber-300 bg-amber-500/30 text-amber-100 shadow-[0_0_12px_rgba(245,158,11,0.4)]'
                              : 'border-amber-800/50 bg-[#171006] text-amber-400/75 hover:text-amber-200'
                          }`}
                        >
                          {vf}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {vaultSearch.trim() ? (
                  <div className="rounded-2xl border-2 border-amber-400 bg-[#191106]/95 p-4">
                    <div className="mb-3 flex items-center justify-between border-b border-amber-500/30 pb-2">
                      <p className="font-mono text-xs font-bold text-amber-300">
                        🔍 SEARCH MATCHES FOR "{vaultSearch}" ({globalPolityMatches.length})
                      </p>
                      <button
                        onClick={() => setVaultSearch('')}
                        className="rounded border border-amber-500/50 bg-amber-500/15 px-2 py-0.5 text-xs font-bold text-amber-200"
                      >
                        Clear Search
                      </button>
                    </div>
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                      {globalPolityMatches.map((m, idx) => (
                        <div key={`${m.lockerId}-${idx}`} className="rounded-xl border border-amber-500/40 bg-[#120c05] p-3.5">
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-mono text-xs font-extrabold text-amber-300">⚖️ {m.code}</span>
                            <button
                              onClick={() => {
                                setVaultSearch('')
                                setOpenLockerId(m.lockerId)
                              }}
                              className="rounded bg-amber-500/20 px-1.5 py-0.5 font-mono text-[9px] font-bold text-amber-200 hover:bg-amber-500/35"
                            >
                              {m.lockerCode} ↗
                            </button>
                          </div>
                          <p className="mt-1 text-xs font-bold text-white">{m.title}</p>
                          <p className="mt-1 text-xs text-amber-100/85">{m.note}</p>
                        </div>
                      ))}
                      {globalPolityMatches.length === 0 && (
                        <p className="col-span-full py-6 text-center text-xs text-amber-300/70">
                          No matching Article, Schedule, or Amendment found.
                        </p>
                      )}
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                      {visibleLockers.map((locker) => {
                        const isUnlocked = locker.id === openLockerId
                        return (
                          <div key={locker.id} className="pt-4">
                            <button
                              onClick={() => setOpenLockerId(locker.id)}
                              className={`group relative flex h-full w-full flex-col justify-between rounded-b-2xl rounded-tr-2xl border-2 p-4 text-left transition-all ${
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

                              <div>
                                <div className="flex items-center justify-between gap-1">
                                  <span className="truncate font-mono text-[10px] font-bold text-amber-400">
                                    {locker.partBadge}
                                  </span>
                                  <span className="shrink-0 rounded border border-amber-400/40 bg-amber-500/15 px-1.5 py-0.5 font-mono text-[9px] font-bold text-amber-200">
                                    {locker.items.length} ENTRIES
                                  </span>
                                </div>

                                <h3 className="mt-2 text-sm font-extrabold text-white">{locker.title}</h3>
                                <p className="mt-0.5 font-mono text-[11px] font-bold text-amber-300">
                                  {locker.articlesRange}
                                </p>
                              </div>

                              <div className="mt-3 border-t border-amber-500/25 pt-2 text-[10.5px] text-amber-200/90">
                                <span className="block truncate">🔗 {locker.historyLabel}</span>
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
                              🔓 UNLOCKED DOSSIER · {activeLocker.lockerCode} ({activeLocker.items.length} ITEMS)
                            </span>
                            <h3 className="text-lg font-extrabold text-white sm:text-xl">
                              {activeLocker.title} · {activeLocker.articlesRange}
                            </h3>
                          </div>

                          <button
                            onClick={() => jumpToChronoEvent(activeLocker.historyEra, activeLocker.historyId)}
                            className="rounded-xl border-2 border-cyan-400 bg-cyan-950/80 px-3.5 py-2 text-xs font-bold text-cyan-200 shadow-[0_0_18px_rgba(34,211,238,0.35)] hover:bg-cyan-900"
                          >
                            🌿 Trace Historical Root: {activeLocker.historyLabel} ⬅
                          </button>
                        </div>

                        <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
                          {activeLocker.items.map((art) => (
                            <div
                              key={art.code}
                              className="rounded-xl border border-amber-500/40 bg-[#120c05]/95 p-3.5 transition hover:border-amber-300"
                            >
                              <p className="font-mono text-xs font-extrabold text-amber-300">⚖️ {art.code}</p>
                              <p className="mt-1 text-xs font-bold text-white">{art.title}</p>
                              <p className="mt-1 text-[11px] leading-relaxed text-amber-100/80">{art.note}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* TAB 3: TOPOGRAPH 3D MAP (ALL 160+ INDIA PINS + 3D TERRAIN)      */}
          {/* ============================================================== */}
          {activeTab === 'topograph' && (
            <div className="relative flex-1 overflow-hidden bg-[#040b16]">
              <button
                onClick={() => setShowMapSidebar((v) => !v)}
                className="fixed top-14 left-3 z-40 rounded-lg border border-cyan-400/60 bg-[#071426]/95 px-2.5 py-1 font-mono text-[10px] font-bold text-cyan-200 shadow-lg hover:bg-cyan-500/25"
              >
                {showMapSidebar ? '◀ Hide List' : `▶ Locations (${visiblePins.length})`}
              </button>

              {showMapSidebar && (
                <aside className="fixed top-22 left-3 z-30 flex max-h-[80vh] w-64 flex-col gap-2 rounded-2xl border border-cyan-400/35 bg-[#071426]/92 p-3 shadow-2xl backdrop-blur-xl">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[11px] font-bold tracking-wider text-cyan-300 uppercase">
                      🛰️ INDIA GK ({visiblePins.length})
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
                    value={mapSearch}
                    onChange={(e) => setMapSearch(e.target.value)}
                    placeholder="Search park, Ramsar, dam, city..."
                    className="w-full rounded-lg border border-slate-700 bg-slate-950/90 px-2.5 py-1.5 text-xs text-white placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none"
                  />

                  <div className="space-y-1">
                    {(
                      [
                        { id: 'All', dot: 'bg-white' },
                        { id: 'Sanctuaries & National Parks', dot: 'bg-emerald-400' },
                        { id: 'Ramsar Wetlands', dot: 'bg-yellow-400' },
                        { id: 'Tiger Reserves', dot: 'bg-orange-400' },
                        { id: 'Dams & Power Projects', dot: 'bg-cyan-400' },
                        { id: 'Heritage, Cities & Industry', dot: 'bg-rose-400' },
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
                            <span className={`size-2 shrink-0 rounded-full ${cat.dot}`} />
                            <span className="truncate">{cat.id}</span>
                          </span>
                          <span className="ml-1 font-mono text-[9.5px] opacity-75">
                            {mapCategoryCounts[cat.id] || 0}
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
                          <span className="truncate text-cyan-300">{pin.state}</span>
                          <span className="ml-1 shrink-0 text-slate-400">
                            {pin.lat.toFixed(1)}°N
                          </span>
                        </div>
                        <p className="truncate text-[11px] font-bold">{pin.shortLabel}</p>
                      </button>
                    ))}
                  </div>
                </aside>
              )}

              <div className="fixed top-14 right-4 z-30 flex flex-col gap-2 rounded-2xl border border-cyan-400/35 bg-[#071426]/92 p-3 shadow-2xl backdrop-blur-xl">
                <div className="flex items-center justify-between gap-3">
                  <span className="font-mono text-[10px] font-bold text-cyan-300 uppercase">
                    🔍 ZOOM: {zoom.toFixed(2)}x
                  </span>
                  <div className="flex gap-1">
                    <button
                      onClick={() => applyClampedZoom(zoom - 0.35)}
                      disabled={zoom <= 1.0}
                      className="rounded border border-slate-700 bg-slate-900 px-2 py-0.5 text-xs font-bold text-white disabled:opacity-40"
                    >
                      −
                    </button>
                    <button
                      onClick={() => applyClampedZoom(zoom + 0.35)}
                      disabled={zoom >= 4.0}
                      className="rounded border border-slate-700 bg-slate-900 px-2 py-0.5 text-xs font-bold text-white disabled:opacity-40"
                    >
                      +
                    </button>
                  </div>
                </div>
                <input
                  type="range"
                  min={1.0}
                  max={4.0}
                  step={0.05}
                  value={zoom}
                  onChange={(e) => applyClampedZoom(parseFloat(e.target.value))}
                  className="h-1.5 w-44 cursor-pointer accent-cyan-400 sm:w-48"
                />

                <div className="flex items-center justify-between text-[10px] font-mono text-amber-300">
                  <span>⛰️ 3D TILT: {pitch3D}°</span>
                  <button
                    onClick={() => setPitch3D((p) => (p > 0 ? 0 : 24))}
                    className="rounded border border-amber-400/40 bg-amber-500/20 px-1.5 py-0.5 text-[9.5px] font-bold text-amber-200"
                  >
                    {pitch3D > 0 ? '2D Flat' : '3D Tilt'}
                  </button>
                </div>
                <input
                  type="range"
                  min={0}
                  max={30}
                  step={1}
                  value={pitch3D}
                  onChange={(e) => setPitch3D(parseInt(e.target.value, 10))}
                  className="h-1.5 w-44 cursor-pointer accent-amber-400 sm:w-48"
                />

                <div className="grid grid-cols-3 gap-1 pt-0.5 text-[10px] font-bold">
                  <button
                    onClick={() => setShowTerrain3D((v) => !v)}
                    className={`rounded-lg border py-1 ${
                      showTerrain3D
                        ? 'border-amber-400 bg-amber-500/25 text-amber-200'
                        : 'border-slate-800 bg-slate-900 text-slate-500'
                    }`}
                  >
                    3D Relief
                  </button>
                  <button
                    onClick={() => setShowRivers((v) => !v)}
                    className={`rounded-lg border py-1 ${
                      showRivers
                        ? 'border-cyan-400 bg-cyan-500/25 text-cyan-200'
                        : 'border-slate-800 bg-slate-900 text-slate-500'
                    }`}
                  >
                    Rivers
                  </button>
                  <button
                    onClick={() => setLabelMode((m) => (m === 'all' ? 'smart' : 'all'))}
                    className={`rounded-lg border py-1 ${
                      labelMode === 'all'
                        ? 'border-emerald-400 bg-emerald-500/25 text-emerald-200'
                        : 'border-slate-700 bg-slate-900 text-slate-300'
                    }`}
                  >
                    {labelMode === 'all' ? 'All Names' : 'Smart'}
                  </button>
                </div>
              </div>

              <div
                ref={mapStageRef}
                onMouseDown={(e) => {
                  setIsDragging(true)
                  setDragOrigin({ x: e.clientX - panX, y: e.clientY - panY })
                }}
                onMouseMove={(e) => {
                  if (!isDragging) return
                  const maxPan = Math.max(140, (zoom - 1) * 360)
                  setPanX(Math.min(maxPan, Math.max(-maxPan, e.clientX - dragOrigin.x)))
                  setPanY(Math.min(maxPan, Math.max(-maxPan, e.clientY - dragOrigin.y)))
                }}
                onMouseUp={() => setIsDragging(false)}
                onMouseLeave={() => setIsDragging(false)}
                onTouchStart={(e) => {
                  if (e.touches.length !== 1) return
                  const t = e.touches[0]
                  setIsDragging(true)
                  setDragOrigin({ x: t.clientX - panX, y: t.clientY - panY })
                }}
                onTouchMove={(e) => {
                  if (!isDragging || e.touches.length !== 1) return
                  const t = e.touches[0]
                  const maxPan = Math.max(140, (zoom - 1) * 360)
                  setPanX(Math.min(maxPan, Math.max(-maxPan, t.clientX - dragOrigin.x)))
                  setPanY(Math.min(maxPan, Math.max(-maxPan, t.clientY - dragOrigin.y)))
                }}
                onTouchEnd={() => setIsDragging(false)}
                className={`flex h-full w-full touch-none items-center justify-center overflow-hidden ${
                  isDragging ? 'cursor-grabbing' : 'cursor-grab'
                }`}
              >
                <div
                  className="transition-transform duration-150 ease-out"
                  style={{
                    transform: `perspective(1300px) rotateX(${pitch3D}deg) translate3d(${panX}px, ${panY}px, 0px) scale(${zoom})`,
                  }}
                >
                  <svg
                    viewBox="0 0 1000 1080"
                    className="h-[86vh] min-h-[540px] w-auto select-none drop-shadow-[0_30px_50px_rgba(6,182,212,0.32)]"
                  >
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
                    <path
                      d={indiaMainlandPath}
                      fill="url(#india3DBase)"
                      stroke="#22d3ee"
                      strokeWidth="2.8"
                      strokeLinejoin="round"
                    />

                    <g opacity="0.45">
                      <line
                        x1="110"
                        y1={tropicOfCancerY}
                        x2="860"
                        y2={tropicOfCancerY}
                        stroke="#f59e0b"
                        strokeWidth="1.4"
                        strokeDasharray="6 6"
                      />
                      <text x="115" y={tropicOfCancerY - 6} fill="#fcd34d" fontSize="10" fontFamily="monospace">
                        Tropic of Cancer (23.5°N)
                      </text>
                      <line
                        x1={istMeridianX}
                        y1="80"
                        x2={istMeridianX}
                        y2="960"
                        stroke="#38bdf8"
                        strokeWidth="1.2"
                        strokeDasharray="5 7"
                      />
                      <text x={istMeridianX + 6} y="945" fill="#7dd3fc" fontSize="10" fontFamily="monospace">
                        IST Meridian (82.5°E)
                      </text>
                    </g>

                    {showTerrain3D &&
                      TERRAIN_MASSIFS.map((ter) => {
                        const basePath = coordsToSvgPath(ter.coords, true)
                        return (
                          <g key={ter.id}>
                            <path d={basePath} fill="#020617" opacity="0.45" transform="translate(3, 5)" />
                            <path d={basePath} fill={ter.baseColor} opacity="0.82" stroke={ter.ridgeColor} strokeWidth="1" />
                            <path
                              d={basePath}
                              fill={ter.ridgeColor}
                              opacity="0.55"
                              transform={`translate(${ter.extrudeDx}, ${ter.extrudeDy})`}
                            />
                            {'snowColor' in ter && ter.snowColor && (
                              <path
                                d={basePath}
                                fill="none"
                                stroke={ter.snowColor}
                                strokeWidth="3"
                                strokeDasharray="8 6"
                                opacity="0.8"
                                transform={`translate(${ter.extrudeDx * 1.3}, ${ter.extrudeDy * 1.3})`}
                              />
                            )}
                          </g>
                        )
                      })}

                    {showRivers &&
                      GEO_RIVERS.map((riv) => {
                        const isSel = activeRiver.id === riv.id
                        return (
                          <g key={riv.id} onClick={() => setSelectedRiverId(riv.id)} className="cursor-pointer">
                            <path
                              d={coordsToSvgPath(riv.mainCoords, false)}
                              fill="none"
                              stroke={riv.color}
                              strokeWidth={(isSel ? 5.2 : 3) * invScale}
                              strokeLinecap="round"
                            />
                            {riv.tributaries.map((tc, i) => (
                              <path
                                key={i}
                                d={coordsToSvgPath(tc, false)}
                                fill="none"
                                stroke={riv.color}
                                strokeWidth={(isSel ? 2.8 : 1.7) * invScale}
                                strokeDasharray="5 3"
                              />
                            ))}
                          </g>
                        )
                      })}

                    {visiblePins.map((pin) => {
                      const pt = latLngToXY(pin.lat, pin.lng)
                      const isSel = pin.id === selectedPinId
                      const pinColor =
                        pin.category === 'Sanctuaries & National Parks'
                          ? '#10b981'
                          : pin.category === 'Ramsar Wetlands'
                          ? '#facc15'
                          : pin.category === 'Tiger Reserves'
                          ? '#fb923c'
                          : pin.category === 'Dams & Power Projects'
                          ? '#22d3ee'
                          : '#fb7185'

                      const showThisLabel =
                        labelMode === 'all' ||
                        isSel ||
                        Boolean(mapSearch.trim()) ||
                        zoom >= 2.15 ||
                        (topoFilter !== 'All' && pin.stars === 3)

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
                          {isSel && <circle cx="0" cy="0" r="20" fill="none" stroke={pinColor} strokeWidth="3" />}
                          <path
                            d="M 0 0 C -8 -12, -10 -24, 0 -24 C 10 -24, 8 -12, 0 0 Z"
                            fill={pinColor}
                            stroke="#020617"
                            strokeWidth="1.8"
                          />
                          <circle cx="0" cy="-15" r="3.2" fill="#020617" />
                          {showThisLabel && (
                            <g transform="translate(10, -12)">
                              <rect
                                x="-3"
                                y="-10"
                                width={Math.min(220, pin.shortLabel.length * 6.2 + 10)}
                                height="15"
                                rx="4"
                                fill="#020617"
                                fillOpacity="0.92"
                                stroke={isSel ? pinColor : '#334155'}
                                strokeWidth="1"
                              />
                              <text x="2" y="0" fill="#ffffff" fontSize="10" fontWeight="bold">
                                {pin.shortLabel.slice(0, 32)}
                              </text>
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
                          {activePin.typeLabel} · {activePin.lat.toFixed(2)}°N, {activePin.lng.toFixed(2)}°E
                        </span>
                        <h3 className="mt-1 text-base font-extrabold text-white">{activePin.title}</h3>
                        <p className="text-xs font-semibold text-amber-300">{activePin.state}</p>
                      </div>
                      <button
                        onClick={() => setShowTopoPopup(false)}
                        className="rounded border border-slate-700 bg-slate-800 px-2 py-0.5 text-xs font-bold text-slate-300 hover:text-white"
                      >
                        ×
                      </button>
                    </div>
                    <p className="text-xs leading-relaxed text-slate-200">
                      <strong className="text-cyan-300">Key Note:</strong> {activePin.note}
                    </p>
                    <p className="font-mono text-[10px] text-emerald-300">
                      Category: {activePin.category}
                    </p>
                  </div>
                  <IsometricTerrainBlock type={activePin.landscapeType} metric={activePin.typeLabel} />
                </div>
              )}
            </div>
          )}

          {/* ============================================================== */}
          {/* BUILT-IN ZERO-QUOTA 20-QUESTION EXAM QUIZ MODAL                */}
          {/* ============================================================== */}
          {showQuizModal && (
            <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/80 p-3 backdrop-blur-sm">
              <div className="flex max-h-[88vh] w-full max-w-3xl flex-col rounded-2xl border border-purple-400/50 bg-[#071222] p-5 shadow-2xl">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
                  <div>
                    <h2 className="text-base font-extrabold text-purple-200 sm:text-lg">
                      ⚡ 20-Question Random Exam Quiz (History · Polity · Static GK)
                    </h2>
                    <p className="font-mono text-xs text-cyan-300">
                      Score: {quizScore.correct} / {quizQuestions.length} · Answered: {quizScore.answered}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={openRapidQuiz}
                      className="rounded-lg border border-purple-400/60 bg-purple-500/20 px-3 py-1 text-xs font-bold text-purple-200 hover:bg-purple-500/35"
                    >
                      🔄 New 20 Questions
                    </button>
                    <button
                      onClick={() => setShowQuizModal(false)}
                      className="rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-1 text-xs font-bold text-slate-300 hover:text-white"
                    >
                      ✕ Close
                    </button>
                  </div>
                </div>

                <div className="mt-4 flex-1 space-y-4 overflow-y-auto pr-1">
                  {quizQuestions.map((q, qIdx) => {
                    const picked = quizAnswers[qIdx]
                    const isAnswered = picked !== undefined
                    return (
                      <div key={qIdx} className="rounded-xl border border-slate-800 bg-slate-900/65 p-4">
                        <div className="mb-2 flex items-center justify-between">
                          <span className="rounded bg-cyan-500/20 px-2 py-0.5 font-mono text-[10px] font-bold text-cyan-300">
                            Q{qIdx + 1} · {q.tag}
                          </span>
                          {isAnswered && (
                            <span
                              className={`font-mono text-[10px] font-bold ${
                                picked === q.ans ? 'text-emerald-400' : 'text-rose-400'
                              }`}
                            >
                              {picked === q.ans ? '✓ Correct' : '✗ Incorrect'}
                            </span>
                          )}
                        </div>
                        <p className="mb-3 text-sm font-bold text-slate-100">{q.q}</p>
                        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                          {q.options.map((opt, optIdx) => {
                            let cls =
                              'border-slate-700 bg-slate-950/70 text-slate-300 hover:border-cyan-400 cursor-pointer'
                            if (isAnswered) {
                              if (optIdx === q.ans) {
                                cls = 'border-emerald-400 bg-emerald-500/20 text-emerald-200 font-bold'
                              } else if (optIdx === picked) {
                                cls = 'border-rose-500 bg-rose-500/20 text-rose-200'
                              } else {
                                cls = 'border-slate-800 bg-slate-950/40 text-slate-500'
                              }
                            }
                            return (
                              <button
                                key={opt}
                                disabled={isAnswered}
                                onClick={() => setQuizAnswers((prev) => ({ ...prev, [qIdx]: optIdx }))}
                                className={`w-full rounded-lg border p-2.5 text-left text-xs transition ${cls}`}
                              >
                                {isAnswered && optIdx === q.ans
                                  ? '✓ '
                                  : isAnswered && optIdx === picked
                                  ? '✗ '
                                  : '○ '}
                                {opt}
                              </button>
                            )
                          })}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  )
}
