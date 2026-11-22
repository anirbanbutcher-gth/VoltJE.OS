'use client'

import { useCallback, useState, useSyncExternalStore } from 'react'
import type { Folder, Subject } from './types'

const PREFIX = 'volt:'
const SEED_VERSION_KEY = 'volt:master_curriculum_v11'
const listeners = new Map<string, Set<() => void>>()
const cache = new Map<string, { raw: string; value: unknown }>()

// ============================================================================
// 1. MASTER CHAPTERWISE JE SYLLABUS (44 EE CHAPTERS + JE EXTRAS + NON-TECH)
// ============================================================================
export const MASTER_JE_SYLLABUS: Subject[] = [
  {
    id: 'subj-ee-part1-basic',
    name: '1. EE Part I: Basic Electrical, AC Circuits & Measurements (Ch. 1–16)',
    color: '#22d3ee',
    units: [
      { id: 'ch-01', name: 'Ch 1. Basic Concepts — Charge, Free Electrons, Current, EMF/PD, Drift Velocity, Resistance, Resistivity, Conductance, Carbon Resistors, Temp Effect, Ohm’s Law, Power, Energy & Materials', done: false },
      { id: 'ch-02', name: 'Ch 2. D.C. Circuits — Direct Current, Series/Parallel/Mixed Resistors, Equivalent Resistance, Cell EMF & Terminal Voltage, Kirchhoff’s Laws (KCL/KVL) & Cell Grouping (Series/Parallel/Mixed)', done: false },
      { id: 'ch-03', name: 'Ch 3. Network Theorems — Ideal/Real Voltage & Current Sources, Source Conversion, Mesh Current, Nodal Analysis, Superposition, Thevenin, Norton, Max Power Transfer & Star-Delta (Y-Δ)', done: false },
      { id: 'ch-04', name: 'Ch 4. Electrical Work, Power & Energy — Physical Quantities, Mechanical/Electrical/Thermal Energy, Units of Power, Heating Effect of Current, Fuse, Resistor Power Rating & Efficiency', done: false },
      { id: 'ch-05', name: 'Ch 5. Electrostatics — Charge Properties, Coulomb’s Law, Permittivity, Electric Field & Lines, Field Intensity (E), Flux & Density, Dipole, Potential, Potential Gradient, PE & Electron-Volt (eV)', done: false },
      { id: 'ch-06', name: 'Ch 6. Capacitance — Parallel-Plate Air/Dielectric/Conducting-Slab Capacitors, Dielectric Strength, Energy & Energy Density, Combinations, Joining Charged Capacitors & RC Transients (Charging/Discharging)', done: false },
      { id: 'ch-07', name: 'Ch 7. Magnetism & Electromagnetism — Poles, Laws of Magnetic Force, Permeability, B-H Relation, Material Classification, Force on Conductor/Moving Charge, Parallel Currents, Loop Torque, Biot-Savart & Ampere’s Law', done: false },
      { id: 'ch-08', name: 'Ch 8. Magnetic Circuits — Analysis, Air-Gaps, Ampere-Turns, Leakage Flux, B-H Magnetisation Curve, Hysteresis Loop, Hysteresis Loss & Steinmetz Law', done: false },
      { id: 'ch-09', name: 'Ch 9. Electromagnetic Induction — Flux Linkages, Faraday’s Laws, Lenz’s Law, Dynamic & Static EMF, Self/Mutual Inductance, Coupling Coefficient, Coupled Coils, Series/Parallel Inductors, Energy & Eddy Current Loss', done: false },
      { id: 'ch-10', name: 'Ch 10. Chemical Effects of Electric Current — Electrolysis, Faraday’s Laws of Electrolysis, Relation Between E & z and Faraday Constant (F)', done: false },
      { id: 'ch-11', name: 'Ch 11. Alternating Currents — AC Terminology & Relations, Average & RMS Value, Form Factor & Peak Factor, Phase/Phase Difference and AC Through Pure R, L & C', done: false },
      { id: 'ch-12', name: 'Ch 12. Series A.C. Circuits — R-L, R-C & R-L-C Series Circuits, Impedance Triangle, Power Factor, True & Reactive Power, Choking Coil, Series Resonance, Q-Factor & Bandwidth', done: false },
      { id: 'ch-13', name: 'Ch 13. Phasor Algebra — Rectangular & Polar Notation, Operator j, Form Conversions, Addition/Subtraction, Complex Conjugate, Multiplication/Division & Complex Power', done: false },
      { id: 'ch-14', name: 'Ch 14. Parallel A.C. Circuits — Phasor Diagram, Phasor Algebra & Admittance (Y) Triangle Methods, Series-Parallel Conversion, Parallel Resonance, Q-Factor, Bandwidth & Series vs Parallel Comparison', done: false },
      { id: 'ch-15', name: 'Ch 15. Three-Phase Circuits — Polyphase Systems, Balanced Star (Y) & Delta (Δ) Voltages/Currents, Star vs Delta Advantages, Low PF Disadvantages & Power Factor Improvement/Correction', done: false },
      { id: 'ch-16', name: 'Ch 16. Electrical Measuring Instruments — Indicating Essentials, PMMC, Moving Iron & Dynamometer Ammeters/Voltmeters, Range Extension, Megger, Dynamometer/Induction Wattmeters & 1-φ Induction Energy Meter', done: false },
    ],
  },
  {
    id: 'subj-ee-part2-machines',
    name: '2. EE Part II: Electrical Machines — DC, Transformers, IM & Sync (Ch. 17–23)',
    color: '#3b82f6',
    units: [
      { id: 'ch-17', name: 'Ch 17. D.C. Generators — Principle, Construction, Lap/Wave Armature Windings, EMF Equation, Armature Resistance, Separately & Self-Excited Types, Constant/Variable Losses, Power Stages & Max Efficiency', done: false },
      { id: 'ch-18', name: 'Ch 18. D.C. Motors — Principle, Back EMF & Significance, Voltage/Power Equations, Max Mechanical Power, Types, Armature/Shaft Torque, BHP, Speed Relations, Speed Regulation, Losses, Efficiency & Applications', done: false },
      { id: 'ch-19', name: 'Ch 19. Transformers — Ideal & Practical (No-Load/Load), EMF Equation, Transformation Ratio (K), Losses, Efficiency & Tests, Max Efficiency kVA, All-Day Efficiency, Construction & Cooling', done: false },
      { id: 'ch-20', name: 'Ch 20. Three-Phase Induction Motors — Construction, RMF, Operation, Slip, Rotor Frequency/Current/Torque, Starting & Max Torque, Supply Voltage Effect, Torque-Slip Curve, Speed Control & Power Stages', done: false },
      { id: 'ch-21', name: 'Ch 21. Single-Phase Motors — Types, Self-Starting Methods, 2-Phase RMF, Split-Phase, Capacitor-Start, Capacitor-Start Capacitor-Run & Shaded-Pole Motors', done: false },
      { id: 'ch-22', name: 'Ch 22. Synchronous Generators (Alternators) — 3-Phase Alternator, Stationary Armature Advantages, Construction, Working, Frequency, EMF Equation, Losses & Approximate Output Power', done: false },
      { id: 'ch-23', name: 'Ch 23. Synchronous Motors — Construction, Operating Principle, Self-Starting, Load Behaviour, Pull-Out Torque, Power & Torque Relations, Power Factor, Synchronous Capacitor, Applications & Sync vs IM Comparison', done: false },
    ],
  },
  {
    id: 'subj-ee-part3-power-control',
    name: '3. EE Part III: Power System, Switchgear, Protection & Control (Ch. 24–32)',
    color: '#10b981',
    units: [
      { id: 'ch-24', name: 'Ch 24. Generation of Electrical Energy — Sources, Steam/Thermal Station Components & Efficiency, Hydro-Electric Schematic, Diesel & Nuclear Power Stations and Base vs Peak Load', done: false },
      { id: 'ch-25', name: 'Ch 25. Economics of Power Generation — Cost of Energy, Depreciation Methods, Tariffs & Types, Power Triangle, PF Correction Calculations, PF Improvement Equipment & Most Economical PF', done: false },
      { id: 'ch-26', name: 'Ch 26. Supply Systems — Typical AC Supply Scheme, DC vs AC Transmission, High Transmission Voltage Advantages, Transmission Systems Comparison, Economic Conductor Size & Transmission Voltage', done: false },
      { id: 'ch-27', name: 'Ch 27. Overhead Lines — Mechanical Design of Overhead Lines, Sag & Tension, Line Supports & Insulators', done: false },
      { id: 'ch-28', name: 'Ch 28. Distribution of Electric Power — Classification, AC & DC Distribution, Distributors Fed at One/Both Ends (Concentrated/Uniform), Ring Main with Interconnector & Substation Classification', done: false },
      { id: 'ch-29', name: 'Ch 29. Faults in Power System — Short-Circuit, Symmetrical & Unsymmetrical 3-Phase Faults, Symmetrical Components, Operator a, LG, LL & Double Line-to-Ground (LLG) Faults', done: false },
      { id: 'ch-30', name: 'Ch 30. Switchgear — Switchgear Equipment, Circuit Breakers, Arc Phenomenon & Extinction, CB Classification & Ratings, Fuse Characteristics/Materials/Types & Protective Relays (Timing & Functional Types)', done: false },
      { id: 'ch-31', name: 'Ch 31. Protection of Power System — Alternator Protection (Differential, Balanced Earth-Fault, Inter-Turn), Transformer Protection (Buchholz, Circulating Current), Line Distance/Overcurrent & Lightning Protection', done: false },
      { id: 'ch-32', name: 'Ch 32. Control System — Open/Closed Loop, Laplace/Inverse, Transfer Function (Poles/Zeros), Block Diagram Reduction, Signal Flow Graph (Mason’s Gain), 1st/2nd Order Time Response, Steady-State Error, Controllers, Routh-Hurwitz, Bode, Root Locus & Polar Plots', done: false },
    ],
  },
  {
    id: 'subj-ee-part4-electronics',
    name: '4. EE Part IV: Semiconductor, Analog, Digital & Power Electronics (Ch. 33–44)',
    color: '#f97316',
    units: [
      { id: 'ch-33', name: 'Ch 33. Semiconductor Physics — Intrinsic & Extrinsic Semiconductors, n-type & p-type, Hole Current, Temperature Effect, PN Junction, Forward/Reverse Bias & V-I Characteristics', done: false },
      { id: 'ch-34', name: 'Ch 34. Semiconductor Diodes — Crystal Diode Resistance & Equivalent Circuit, Half-Wave, Centre-Tap & Bridge Full-Wave Rectifiers, Ripple Factor, Filters, Zener, LED, Photodiode, Tunnel & Varactor Diodes', done: false },
      { id: 'ch-35', name: 'Ch 35. Transistors — Terminals, Transistor Action & Currents, CB, CE & CC Configurations, Comparison, CE Amplifier, Operating Point (Q-Point) & Power Rating', done: false },
      { id: 'ch-36', name: 'Ch 36. Transistor Biasing — Faithful Amplification, Stability Factor, Base Resistor, Emitter Bias, Collector Feedback Resistor & Voltage Divider Bias Method', done: false },
      { id: 'ch-37', name: 'Ch 37. Single Stage Transistor Amplifiers — Practical Circuit, Phase Reversal, Voltage Gain (With/Without CE), AC Emitter Resistance & Input Impedance', done: false },
      { id: 'ch-38', name: 'Ch 38. Multistage Transistor Amplifiers — Multistage Concepts, Role of Coupling/Bypass Capacitors & RC Coupled Transistor Amplifier', done: false },
      { id: 'ch-39', name: 'Ch 39. Transistor Audio Power Amplifiers — Small vs Large Signal, Voltage vs Power Amplifiers, Class A/B/AB/C Classification, Efficiency, Heat Sink, Stages & Push-Pull Amplifier', done: false },
      { id: 'ch-40', name: 'Ch 40. Amplifiers with Negative Feedback — Negative Voltage Feedback Principles, Gain, Advantages, Emitter Follower Gain, Input & Output Impedance', done: false },
      { id: 'ch-41', name: 'Ch 41. Sinusoidal Oscillators — Positive Feedback, Barkhausen Criterion, Tuned Collector, Colpitts, Hartley, Phase-Shift, Wien Bridge & Crystal Oscillators', done: false },
      { id: 'ch-42', name: 'Ch 42. Transistor Tuned Amplifiers — Parallel Tuned Circuit Analysis, Frequency Response, Q & Bandwidth Relation, Single-Tuned & Double-Tuned Amplifiers', done: false },
      { id: 'ch-43', name: 'Ch 43. Digital Electronics — Binary/Decimal/Hex/Octal Conversions & Arithmetic, 10’s Complement, SOP/POS, K-Map Minimization, Half/Full Adders & Subtractors, MUX/DEMUX, Decoder/Encoder, SR/D/JK/T/Master-Slave Flip-Flops, Counters & Memory', done: false },
      { id: 'ch-44', name: 'Ch 44. Power Electronics — Schottky Diode, Power BJT, MOSFET, IGBT, MCT, Thyristor (SCR) Modes, Latching & Holding Currents, Natural/Forced Commutation, Choppers, Series/Push-Pull/3-Phase Inverters, Cycloconverters & AC Voltage Controllers', done: false },
    ],
  },
  {
    id: 'subj-ee-part5-utilization-estimation',
    name: '5. EE Exam Extras: Utilization, Traction, Estimation & IE Rules',
    color: '#14b8a6',
    units: [
      { id: 'ue-1', name: 'Illumination & Electric Lamps — Lumen, Candela, Lux, Inverse Square & Lambert’s Laws, Fluorescent, Sodium/Mercury Vapour & LED Lamps', done: false },
      { id: 'ue-2', name: 'Electric Heating, Welding & Traction — Resistance/Arc/Induction/Dielectric Heating, Spot/Arc Welding, 25kV AC Traction & Speed-Time Curves', done: false },
      { id: 'ec-1', name: 'Estimation, Costing, IE Rules & Earthing (IS 3043) — Voltage/Frequency Tolerances, Clearances (Rules 77–80), Sub-Circuits (800W/3000W) & Pipe/Plate Earthing', done: false },
    ],
  },
  {
    id: 'subj-math-sahil',
    name: '6. Non-Tech: Quantitative Aptitude & Math (Sahil Sir)',
    color: '#eab308',
    units: [
      { id: 'math-1', name: 'Number System, Divisibility, Unit Digit, Remainder, AP/GP, Surds, HCF & LCM and Simplification', done: false },
      { id: 'math-2', name: 'Percentage, Ratio & Proportion, Partnership, Ages, Mixture/Alligation, Profit-Loss & Discounts', done: false },
      { id: 'math-3', name: 'Simple & Compound Interest (SI/CI), Time & Work, Pipes & Cisterns, Time-Speed-Distance, Trains & Boats', done: false },
      { id: 'math-4', name: 'Average, Data Interpretation, Statistics, Algebra, Trigonometry, Geometry & Mensuration (2D/3D)', done: false },
    ],
  },
  {
    id: 'subj-reasoning',
    name: '7. Non-Tech: General Intelligence & Reasoning',
    color: '#ec4899',
    units: [
      { id: 'reas-1', name: 'Series (Alphabet/Number), Coding-Decoding, Analogy, Classification & BODMAS Operations', done: false },
      { id: 'reas-2', name: 'Syllogism, Venn Diagrams, Blood Relations, Direction Sense, Seating Arrangement & Puzzles', done: false },
      { id: 'reas-3', name: 'Order & Ranking, Inequalities, Clock & Calendar, Dice/Cube, Figure Counting, Mirror/Paper Folding & Critical Reasoning', done: false },
    ],
  },
  {
    id: 'subj-science',
    name: '8. Non-Tech: General Science, Environment & Computer Basics',
    color: '#a78bfa',
    units: [
      { id: 'sci-1', name: 'Physics — Units, Kinematics, Newton’s Laws, Work/Energy, Optics, Sound, Heat & Electricity', done: false },
      { id: 'sci-2', name: 'Chemistry — Atomic Structure, Periodic Table, Acids/Bases/pH, Metals, Ores, Alloys & Carbon Compounds', done: false },
      { id: 'sci-3', name: 'Biology, Environment & Computers — Cell, Human Systems, Vitamins/Diseases, Ecology/Pollution, OS & Networking', done: false },
    ],
  },
  {
    id: 'subj-gk-gs',
    name: '9. Non-Tech: General Awareness (History, Polity, Geography & Static GK)',
    color: '#84cc16',
    units: [
      { id: 'gk-1', name: 'Indian Polity — Preamble, Fundamental Rights, DPSP, Duties, Union/Parliament/SC, Panchayats, 12 Schedules & Amendments (1st–106th)', done: false },
      { id: 'gk-2', name: 'History — Indus Valley, Buddhism/Jainism, Maurya/Gupta, Delhi Sultanate, Mughals, Marathas, 1857, INC & Modern India', done: false },
      { id: 'gk-3', name: 'Geography & Static GK — Rivers, Multipurpose Dams, National Parks, Tiger Reserves, Ramsar Wetlands, Passes, Heritage & WB Special', done: false },
      { id: 'gk-4', name: 'Indian Economy & Current Affairs — GDP, RBI Policy, Union Budget, GST, Schemes, Sports, Awards & ISRO/DRDO', done: false },
    ],
  },
]

// ============================================================================
// 2. MASTER TOPIC-WISE YOUTUBE LIBRARY
// ============================================================================
export const MASTER_JE_LIBRARY: Folder[] = [
  {
    id: 'folder-raman-sir-ead',
    name: '⚡ Electrical Tech · Raman Sir (EAD Online Classes)',
    links: [
      { id: 'ead-1', title: 'Basic Electrical: Ohm Law, KCL, KVL & Star-Delta', topic: 'Basic Electrical', url: 'https://www.youtube.com/results?search_query=Raman+Sir+EAD+Online+Classes+Basic+Electrical+KCL+KVL+Star+Delta+SSC+JE' },
      { id: 'ead-2', title: 'Network Theorems: Thevenin, Norton & Superposition', topic: 'Network Theorems', url: 'https://www.youtube.com/results?search_query=Raman+Sir+EAD+Online+Classes+Network+Theorems+Thevenin+Norton+SSC+JE' },
      { id: 'ead-3', title: 'AC Fundamentals, Resonance & 3-Phase Circuits', topic: 'AC & 3-Phase', url: 'https://www.youtube.com/results?search_query=Raman+Sir+EAD+Online+Classes+AC+Fundamentals+3+Phase+Resonance' },
      { id: 'ead-4', title: 'Transformers, DC Machines, Induction & Synchronous Motors', topic: 'Electrical Machines', url: 'https://www.youtube.com/results?search_query=Raman+Sir+EAD+Online+Classes+Electrical+Machines+Complete+SSC+JE' },
      { id: 'ead-5', title: 'Power Systems, Switchgear, Relays & Fault Analysis', topic: 'Power Systems', url: 'https://www.youtube.com/results?search_query=Raman+Sir+EAD+Online+Classes+Power+System+Switchgear+Protection' },
      { id: 'ead-6', title: 'Measurements, Analog/Digital/Power Electronics & Control Systems', topic: 'Measurements & Electronics', url: 'https://www.youtube.com/results?search_query=Raman+Sir+EAD+Online+Classes+Measurements+Electronics+Power+Electronics' },
    ],
  },
  {
    id: 'folder-nontech-je',
    name: '🌍 Non-Tech Math, Reasoning, Science & GK/GS',
    links: [
      { id: 'nt-1', title: 'Sahil Sir — Complete Quantitative Aptitude (RRB/SSC JE)', topic: 'Math', url: 'https://www.youtube.com/results?search_query=Sahil+Sir+Math+Complete+RRB+JE+One+Shot' },
      { id: 'nt-2', title: 'Reasoning Complete One-Shot (Piyush Sir / Vikramjeet Sir)', topic: 'Reasoning', url: 'https://www.youtube.com/results?search_query=Reasoning+Complete+One+Shot+SSC+JE+RRB+JE' },
      { id: 'nt-3', title: 'Neeraj Sir — Complete General Science Marathon', topic: 'General Science', url: 'https://www.youtube.com/results?search_query=Complete+Science+One+Shot+Marathon+Science+Magnet+Neeraj+Sir+RRB+JE' },
      { id: 'nt-4', title: 'Parmar SSC — Polity, History, Geography & Static GK', topic: 'GK/GS', url: 'https://www.youtube.com/results?search_query=Parmar+SSC+Complete+Polity+History+Geography+Static+GK+One+Shot' },
    ],
  },
]

// ============================================================================
// 3. NON-DESTRUCTIVE CURRICULUM & LIBRARY AUTO-MERGER
// ============================================================================
function mergeSyllabusWithMaster(existing: Subject[] | null | undefined): Subject[] {
  if (!Array.isArray(existing) || existing.length === 0) return MASTER_JE_SYLLABUS

  const doneIds = new Set<string>()
  const doneNames = new Set<string>()
  for (const subj of existing) {
    if (!subj || !Array.isArray(subj.units)) continue
    for (const u of subj.units) {
      if (u?.done) {
        doneIds.add(u.id)
        doneNames.add(u.name.trim().toLowerCase())
      }
    }
  }

  return MASTER_JE_SYLLABUS.map((masterSubj) => ({
    ...masterSubj,
    units: masterSubj.units.map((u) => ({
      ...u,
      done:
        doneIds.has(u.id) ||
        doneNames.has(u.name.trim().toLowerCase()) ||
        Array.from(doneNames).some((dn) => dn.length > 6 && u.name.toLowerCase().includes(dn)),
    })),
  }))
}

function mergeLibraryWithMaster(existing: Folder[] | null | undefined): Folder[] {
  if (!Array.isArray(existing) || existing.length === 0) return MASTER_JE_LIBRARY

  const byId = new Map<string, Folder>()
  for (const f of MASTER_JE_LIBRARY) byId.set(f.id, f)

  for (const userFolder of existing) {
    if (!userFolder?.id) continue
    if (!byId.has(userFolder.id)) {
      if (Array.isArray(userFolder.links) && userFolder.links.length > 0) {
        byId.set(userFolder.id, userFolder)
      }
    } else {
      const masterFolder = byId.get(userFolder.id)!
      const existingUrls = new Set(masterFolder.links.map((l) => l.url))
      const extraLinks = (userFolder.links || []).filter((l) => l?.url && !existingUrls.has(l.url))
      if (extraLinks.length > 0) {
        byId.set(userFolder.id, {
          ...masterFolder,
          links: [...masterFolder.links, ...extraLinks],
        })
      }
    }
  }

  return Array.from(byId.values())
}

function isSyllabusKey(key: string, fallback: unknown): boolean {
  const k = key.toLowerCase()
  if (k === 'subjects' || k === 'syllabus') return true
  if (Array.isArray(fallback) && fallback.length > 0 && typeof fallback[0] === 'object' && fallback[0] !== null) {
    return 'units' in fallback[0]
  }
  return false
}

function isLibraryKey(key: string, fallback: unknown): boolean {
  const k = key.toLowerCase()
  if (k === 'folders' || k === 'library' || k === 'links') return true
  if (Array.isArray(fallback) && fallback.length > 0 && typeof fallback[0] === 'object' && fallback[0] !== null) {
    return 'links' in fallback[0]
  }
  return false
}

let seededOnce = false
function ensureMasterCurriculumSeeded() {
  if (seededOnce || typeof window === 'undefined') return
  seededOnce = true
  try {
    if (window.localStorage.getItem(SEED_VERSION_KEY) === 'true') return

    for (const sKey of ['subjects', 'syllabus']) {
      const raw = window.localStorage.getItem(PREFIX + sKey)
      const parsed = raw ? (JSON.parse(raw) as Subject[]) : null
      window.localStorage.setItem(PREFIX + sKey, JSON.stringify(mergeSyllabusWithMaster(parsed)))
      cache.delete(sKey)
    }

    for (const lKey of ['folders', 'library']) {
      const raw = window.localStorage.getItem(PREFIX + lKey)
      const parsed = raw ? (JSON.parse(raw) as Folder[]) : null
      window.localStorage.setItem(PREFIX + lKey, JSON.stringify(mergeLibraryWithMaster(parsed)))
      cache.delete(lKey)
    }

    window.localStorage.setItem(SEED_VERSION_KEY, 'true')
  } catch {
    // Ignore storage errors
  }
}

// ============================================================================
// 4. CORE REACTIVE STORE ENGINE
// ============================================================================
function notify(key: string) {
  listeners.get(key)?.forEach((listener) => listener())
}

function subscribeKey(key: string, callback: () => void) {
  let set = listeners.get(key)
  if (!set) {
    set = new Set()
    listeners.set(key, set)
  }
  set.add(callback)
  const onStorage = (event: StorageEvent) => {
    if (event.key === null || event.key === PREFIX + key) callback()
  }
  window.addEventListener('storage', onStorage)
  return () => {
    set.delete(callback)
    window.removeEventListener('storage', onStorage)
  }
}

export function readStored<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback
  ensureMasterCurriculumSeeded()

  let effectiveFallback: T = fallback
  if (isSyllabusKey(key, fallback)) {
    effectiveFallback = MASTER_JE_SYLLABUS as unknown as T
  } else if (isLibraryKey(key, fallback)) {
    effectiveFallback = MASTER_JE_LIBRARY as unknown as T
  }

  let raw: string | null = null
  try {
    raw = window.localStorage.getItem(PREFIX + key)
  } catch {
    return effectiveFallback
  }

  if (raw === null) {
    try {
      const initRaw = JSON.stringify(effectiveFallback)
      window.localStorage.setItem(PREFIX + key, initRaw)
      cache.set(key, { raw: initRaw, value: effectiveFallback })
    } catch {
      // ignore
    }
    return effectiveFallback
  }

  const hit = cache.get(key)
  if (hit && hit.raw === raw) return hit.value as T

  let value: T = effectiveFallback
  try {
    const parsed = JSON.parse(raw) as T
    if (isSyllabusKey(key, fallback) && Array.isArray(parsed) && parsed.length < MASTER_JE_SYLLABUS.length) {
      value = mergeSyllabusWithMaster(parsed as unknown as Subject[]) as unknown as T
      raw = JSON.stringify(value)
      window.localStorage.setItem(PREFIX + key, raw)
    } else if (isLibraryKey(key, fallback) && Array.isArray(parsed) && parsed.length === 0) {
      value = MASTER_JE_LIBRARY as unknown as T
      raw = JSON.stringify(value)
      window.localStorage.setItem(PREFIX + key, raw)
    } else {
      value = parsed
    }
  } catch {
    value = effectiveFallback
  }

  cache.set(key, { raw, value })
  return value
}

export type Updater<T> = T | ((prev: T) => T)

export function writeStored<T>(key: string, next: Updater<T>, fallback: T) {
  const prev = readStored(key, fallback)
  const value = typeof next === 'function' ? (next as (p: T) => T)(prev) : next
  const raw = JSON.stringify(value)
  try {
    window.localStorage.setItem(PREFIX + key, raw)
  } catch (error) {
    console.warn('[volt] localStorage write failed', error)
    window.dispatchEvent(
      new CustomEvent('volt:toast', { detail: 'Storage is full — could not save. Export & clean old data.' })
    )
  }
  cache.set(key, { raw, value })
  notify(key)
}

export function useStored<T>(key: string, fallback: T): [T, (next: Updater<T>) => void] {
  const [initial] = useState(fallback)
  const subscribe = useCallback((cb: () => void) => subscribeKey(key, cb), [key])
  const value = useSyncExternalStore(
    subscribe,
    () => readStored(key, initial),
    () => initial
  )
  const setValue = useCallback((next: Updater<T>) => writeStored(key, next, initial), [key, initial])
  return [value, setValue]
}

export function exportAllStored(): Record<string, unknown> {
  const out: Record<string, unknown> = {}
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i)
    if (!k?.startsWith(PREFIX)) continue
    try {
      out[k.slice(PREFIX.length)] = JSON.parse(localStorage.getItem(k) ?? 'null')
    } catch {
      // skip unreadable entries
    }
  }
  return out
}

export function importAllStored(data: Record<string, unknown>) {
  for (const [k, v] of Object.entries(data)) {
    localStorage.setItem(PREFIX + k, JSON.stringify(v))
    cache.delete(k)
    notify(k)
  }
}

export function wipeAllStored(keep: string[] = []) {
  const keys: string[] = []
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i)
    if (k?.startsWith(PREFIX) && !keep.includes(k.slice(PREFIX.length))) keys.push(k)
  }
  keys.forEach((k) => {
    localStorage.removeItem(k)
    const short = k.slice(PREFIX.length)
    cache.delete(short)
    notify(short)
  })
  localStorage.removeItem(SEED_VERSION_KEY)
}

export function uid() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID()
  return Math.random().toString(36).slice(2) + Date.now().toString(36)
}
