'use client'

import { useCallback, useState, useSyncExternalStore } from 'react'
import type { Folder, Subject } from './types'

const PREFIX = 'volt:'
const SEED_VERSION_KEY = 'volt:master_curriculum_v8'
const listeners = new Map<string, Set<() => void>>()
const cache = new Map<string, { raw: string; value: unknown }>()

// ============================================================================
// 1. MASTER ELABORATED JE SYLLABUS (TECHNICAL ELECTRICAL + NON-TECH)
// ============================================================================
export const MASTER_JE_SYLLABUS: Subject[] = [
  {
    id: 'subj-basic-ee',
    name: '1. Basic Electrical & Network Theory (Raman Sir · EAD)',
    color: '#22d3ee',
    units: [
      { id: 'be-1', name: "Ohm's Law, KCL, KVL, Temp. Coefficient of Resistance, Star-Delta (Y-Δ) Conversion & Color Coding", done: false },
      { id: 'be-2', name: "Network Theorems: Superposition, Thevenin's, Norton's, Max Power Transfer, Millman's, Reciprocity & Tellegen's", done: false },
      { id: 'be-3', name: 'DC & AC Transients: RL, RC & RLC Circuits, Time Constants (L/R, RC), Initial & Final Conditions', done: false },
      { id: 'be-4', name: "Electrostatics & Capacitors: Coulomb's Law, Gauss Law, Electric Flux, Composite Dielectric Capacitors & Energy Stored", done: false },
      { id: 'be-5', name: 'Magnetic & Coupled Circuits: MMF, Reluctance, B-H Curve, Hysteresis & Eddy Current Losses, Self/Mutual Inductance & Dot Rule', done: false },
      { id: 'be-6', name: 'AC Fundamentals: RMS, Average, Form Factor (1.11), Peak Factor (1.414), Phasors, RL/RC/RLC Circuits, Active/Reactive/Apparent Power & PF', done: false },
      { id: 'be-7', name: 'Resonance & Locus Diagrams: Series & Parallel Resonance (Tank Circuit), Q-Factor, Bandwidth, Half-Power Frequencies & Selectivity', done: false },
      { id: 'be-8', name: 'Three-Phase (3-φ) Systems: Star (Y) & Delta (Δ) Balanced/Unbalanced Connections, Line-Phase Relations & Two-Wattmeter Method', done: false },
      { id: 'be-9', name: 'Two-Port Networks (Z, Y, ABCD, h-Parameters), Graph Theory (Incidence Matrix, Tie-Set, Cut-Set) & Passive Filters', done: false },
    ],
  },
  {
    id: 'subj-machines-1',
    name: '2. Electrical Machines — I: Transformers & DC Machines (Raman Sir · EAD)',
    color: '#3b82f6',
    units: [
      { id: 'em1-1', name: 'DC Machine Construction, Lap (A=P) vs Wave (A=2) Windings, EMF Equation, Armature Reaction & Commutation (Interpoles/Compensating Winding)', done: false },
      { id: 'em1-2', name: 'DC Generators: Separate, Shunt, Series & Compound Characteristics, Critical Resistance/Speed for Voltage Build-Up & Parallel Operation', done: false },
      { id: 'em1-3', name: 'DC Motors: Torque Equation, Speed-Torque Characteristics, 3-Point & 4-Point Starters, Armature & Field Flux Speed Control', done: false },
      { id: 'em1-4', name: "DC Braking (Rheostatic, Plugging, Regenerative), Losses, Efficiency & Testing (Swinburne's, Hopkinson's Regenerative & Retardation Tests)", done: false },
      { id: 'em1-5', name: '1-Phase Transformers: Core vs Shell, CRGO Lamination, Phasor Diagrams, Equivalent Circuit, Voltage Regulation & Per-Unit Impedance', done: false },
      { id: 'em1-6', name: "Transformer Losses, Max Efficiency Condition, All-Day Efficiency, OC & SC Tests, Sumpner's Back-to-Back Test, Inrush Current & Humming", done: false },
      { id: 'em1-7', name: 'Auto-Transformer (Copper Saving = k, Conductive vs Inductive Power), Parallel Operation Conditions & Load Sharing', done: false },
      { id: 'em1-8', name: '3-Phase Transformers: Star/Delta Connections, Open-Delta (V-V = 57.7%), Scott Connection (3φ-to-2φ), Vector Groups, Harmonics & Tap Changers', done: false },
    ],
  },
  {
    id: 'subj-machines-2',
    name: '3. Electrical Machines — II: Induction, Synchronous & Special Motors (Raman Sir · EAD)',
    color: '#f59e0b',
    units: [
      { id: 'em2-1', name: '3-Phase Induction Motors: Rotating Magnetic Field (1.5 Φm, Ns = 120f/P), Slip (s), Rotor Frequency (fr = sf), Squirrel Cage vs Slip-Ring', done: false },
      { id: 'em2-2', name: 'Induction Motor Power Flow (Pin : Pcu : Pm = 1 : s : 1-s), Torque-Slip Curve, Max Torque Condition (sm = R2/X2), Circle Diagram, No-Load & Blocked-Rotor Tests', done: false },
      { id: 'em2-3', name: 'IM Starters & Speed Control: DOL, Auto-Transformer (x²), Star-Delta Starter (1/3 I & T), Rotor Resistance, V/f Control, Cogging & Crawling (5th/7th Harmonics)', done: false },
      { id: 'em2-4', name: 'Alternators (Synchronous Generators): Salient vs Cylindrical Rotor, Pitch Factor (Kp) & Distribution Factor (Kd), EMF Equation & Harmonic Elimination', done: false },
      { id: 'em2-5', name: "Alternator Armature Reaction (Unity, Lagging, Leading PF), Voltage Regulation (EMF, MMF, ZPF/Potier Methods) & Blondel's Two-Reaction Theory (Xd, Xq)", done: false },
      { id: 'em2-6', name: 'Parallel Operation of Alternators: Dark/Bright Lamp & Synchroscope, Synchronizing Power/Torque, Excitation (MVAr) vs Governor (MW) Control, Hunting & Dampers', done: false },
      { id: 'em2-7', name: 'Synchronous Motors: Starting Methods, V-Curves & Inverted V-Curves, Over-Excited Synchronous Condenser (PF Correction) & Pull-Out Torque', done: false },
      { id: 'em2-8', name: '1-Phase & Fractional kW Motors: Double Revolving Field Theory, Split-Phase, Capacitor-Start/Run, Shaded-Pole, Universal, Reluctance, Hysteresis & Stepper Motors', done: false },
    ],
  },
  {
    id: 'subj-power-systems',
    name: '4. Power Systems: Generation, Transmission & Distribution (Raman Sir · EAD)',
    color: '#10b981',
    units: [
      { id: 'ps1-1', name: 'Power Generation: Thermal (Rankine Cycle, Economizer, Superheater, Air Preheater, ESP), Hydro (Pelton, Francis, Kaplan, Surge Tank), Nuclear, Solar & Wind', done: false },
      { id: 'ps1-2', name: 'Generation Economics & Tariffs: Load Factor, Diversity Factor, Demand Factor, Plant Capacity & Utilization Factors, Base vs Peak Load & Two-Part/PF Tariffs', done: false },
      { id: 'ps1-3', name: 'Transmission Line Parameters: Inductance & Capacitance of 1-φ & 3-φ Lines, GMD & GMR, Bundled Conductors & Transposition', done: false },
      { id: 'ps1-4', name: 'Short, Medium (Nominal-T, Nominal-π) & Long Lines: ABCD Parameters, Ferranti Effect, Surge Impedance Loading (SIL = V²/Z0) & Voltage Regulation', done: false },
      { id: 'ps1-5', name: "Skin Effect, Proximity Effect, Corona (Critical Disruptive & Visual Voltage, Corona Power Loss, Remedies) & Kelvin's Law for Economic Conductor Size", done: false },
      { id: 'ps1-6', name: 'Mechanical Design & Insulators: Sag & Tension (Equal/Unequal Supports, Wind & Ice), Pin/Suspension/Strain/Shackle Insulators, String Efficiency & Grading Ring', done: false },
      { id: 'ps1-7', name: 'Underground Cables: Construction, Insulation Resistance, Capacitance, Dielectric Stress (gmax/gmin), Capacitance & Intersheath Grading, Belted/H/SL/Oil-Filled Cables', done: false },
      { id: 'ps1-8', name: 'Distribution Systems (Radial, Ring Main, Interconnected; 3-φ 4-Wire), Feeder vs Distributor, HVDC Transmission & PF Improvement Methods', done: false },
    ],
  },
  {
    id: 'subj-switchgear',
    name: '5. Switchgear, Protection & Power System Faults (Raman Sir · EAD)',
    color: '#ec4899',
    units: [
      { id: 'ps2-1', name: 'Fault Analysis: Per-Unit (p.u.) System, Current Limiting Reactors, Symmetrical Components (+, -, 0 Sequence Networks), L-G, L-L, L-L-G & 3-φ Faults', done: false },
      { id: 'ps2-2', name: 'Circuit Breakers Physics: Arc Phenomenon, Arc Interruption Theories, Restriking Voltage, RRRV, Recovery Voltage, Current Chopping & Resistance Switching', done: false },
      { id: 'ps2-3', name: 'Circuit Breaker Types & Ratings: Air Break, Air Blast, Oil (BOCB/MOCB), SF6 & Vacuum Circuit Breakers (VCB); Breaking, Making (2.55×) & Short-Time Ratings', done: false },
      { id: 'ps2-4', name: 'Protective Relays: PSM & TSM Calculations, Induction Disc/Cup Relays, Overcurrent, Directional, Distance (Impedance, Reactance, Mho) & Translay Relays', done: false },
      { id: 'ps2-5', name: 'Equipment Protection: Merz-Price Differential Protection (Alternators & Transformers), Buchholz Relay, Harmonic Restraint & Feeder Protection', done: false },
      { id: 'ps2-6', name: 'Fuses (HRC, Rewirable, Fusing Factor > 1, Fuse Law I² ∝ d³), Isolators, Neutral Earthing (Resistance, Arc Suppression / Peterson Coil) & Lightning Arresters (ZnO/Thyrite)', done: false },
    ],
  },
  {
    id: 'subj-measurements',
    name: '6. Electrical & Electronic Measurements (Raman Sir · EAD)',
    color: '#a78bfa',
    units: [
      { id: 'mi-1', name: 'Instrument Characteristics & Errors: Accuracy, Precision, Sensitivity, Resolution, Limiting Errors, Deflecting/Controlling (Spring/Gravity)/Damping Torques', done: false },
      { id: 'mi-2', name: 'Ammeters & Voltmeters: PMMC (DC, Linear), Moving Iron (AC/DC, Non-Linear θ ∝ I²), Electrodynamometer, Hot-Wire, Electrostatic & Range Extension (Shunts/Multipliers)', done: false },
      { id: 'mi-3', name: 'Wattmeters & Energy Meters: Dynamometer Wattmeter Errors & LPF Wattmeter, 1-φ & 3-φ Induction Energy Meter (Creeping Error & Anti-Creep Holes), Phantom Loading', done: false },
      { id: 'mi-4', name: 'Resistance Measurement: Low (<1Ω: Kelvin Double Bridge, Potentiometer), Medium (1Ω–100kΩ: Wheatstone Bridge, Ohmmeter) & High (>100kΩ: Megger, Loss of Charge)', done: false },
      { id: 'mi-5', name: "AC Bridges: Inductance (Maxwell, Hay's High-Q, Anderson Low-Q, Owen), Capacitance (De-Sauty, Schering Bridge & Dissipation Factor tan δ) & Wien Frequency Bridge", done: false },
      { id: 'mi-6', name: 'Instrument Transformers (CT & PT Ratio/Phase Errors, Why CT Secondary Never Open), DC/AC Potentiometers, PF Meter, Weston Frequency Meter & Synchroscope', done: false },
      { id: 'mi-7', name: 'CRO (CRT, Time Base, Lissajous Patterns for Phase & Frequency), Digital Voltmeters (DVM), Q-Meter & Transducers (LVDT, Strain Gauge, RTD, Thermistor, Thermocouple, Hall Effect)', done: false },
    ],
  },
  {
    id: 'subj-electronics',
    name: '7. Basic, Analog, Digital & Power Electronics (Raman Sir · EAD)',
    color: '#f97316',
    units: [
      { id: 'el-1', name: 'Semiconductor Physics & Diodes: P-N Junction, Forward/Reverse Bias, Depletion Layer, Zener Diode (Breakdown & Regulator), LED, Photodiode, Tunnel & Varactor Diodes', done: false },
      { id: 'el-2', name: 'Rectifiers & Filters: Half-Wave, Center-Tapped & Bridge Full-Wave Rectifiers (Efficiency η, Ripple Factor, PIV, Form Factor, TUF), Capacitor/Choke Filters, Clippers & Clampers', done: false },
      { id: 'el-3', name: 'BJT Transistors: NPN/PNP, CB/CE/CC Configurations, α-β-γ Relations, Load Line & Q-Point, Thermal Runaway, Fixed & Voltage-Divider Biasing (Stability Factor S)', done: false },
      { id: 'el-4', name: 'FET, MOSFET, Amplifiers & Oscillators: JFET (Pinch-off, gm, rd, μ), MOSFET, Class A/B/AB/C Amplifiers, Barkhausen Criterion, Hartley, Colpitts, Wien Bridge & Crystal Oscillators', done: false },
      { id: 'el-5', name: 'Operational Amplifiers (Op-Amp 741): Ideal vs Practical Characteristics, Virtual Ground, Inverting/Non-Inverting, Adder, Integrator, Differentiator, CMRR & Slew Rate', done: false },
      { id: 'el-6', name: "Digital Electronics (RRB/State JE): Number Systems, 1's/2's Complement, Boolean Algebra, De-Morgan's Law, K-Map, Logic Gates (NAND/NOR Universal), Adders, Mux & Flip-Flops", done: false },
      { id: 'el-7', name: 'Power Electronics (WBSEDCL/RRB JE): SCR/Thyristor V-I Characteristics, Holding vs Latching Current, Turn-On/Commutation, DIAC, TRIAC, UJT, IGBT, Choppers & Inverters', done: false },
    ],
  },
  {
    id: 'subj-utilization',
    name: '8. Utilization of Electrical Energy, Traction & Heating (Raman Sir · EAD)',
    color: '#84cc16',
    units: [
      { id: 'ue-1', name: "Illumination Fundamentals: Luminous Flux (Lumen), Intensity (Candela), Lux, Space-Height Ratio, Utilization/Depreciation Factors, Inverse Square & Lambert's Cosine Law", done: false },
      { id: 'ue-2', name: 'Electric Lamps: Incandescent, Fluorescent Tube (Choke/Ballast, Starter, Stroboscopic Effect), Sodium Vapour, HPMV, Metal Halide, Neon & LED Lamps', done: false },
      { id: 'ue-3', name: 'Electric Heating: Resistance (Nichrome/Kanthal), Arc Furnaces (Direct/Indirect), Induction Heating (Core/Coreless/Ajax-Wyatt) & High-Frequency Dielectric Heating', done: false },
      { id: 'ue-4', name: 'Electric Welding: Resistance Welding (Spot, Seam, Projection, Butt, Flash), Arc Welding (Carbon/Metal Arc, TIG, MIG) & Drooping Characteristic Welding Transformers', done: false },
      { id: 'ue-5', name: 'Electric Drives & Traction: 25kV 50Hz AC Traction, DC Series Traction Motors, Speed-Time Curves (Trapezoidal & Quadrilateral), Crest/Average/Schedule Speed & Specific Energy', done: false },
      { id: 'ue-6', name: "Electrolysis & Batteries: Faraday's Laws of Electrolysis, Electroplating, Lead-Acid vs Alkaline/Ni-Cd Cells, Ah vs Wh Efficiency, Sulphation & Trickle Charging", done: false },
    ],
  },
  {
    id: 'subj-estimation',
    name: '9. Estimation, Costing, IE Rules & Earthing (Raman Sir · EAD)',
    color: '#14b8a6',
    units: [
      { id: 'ec-1', name: 'Indian Electricity (IE) Rules & CEA Norms: Voltage Variations (±6% LV/MV, +10%/-12.5% HV), Frequency (±3%), Ground Clearances (Rule 77) & Building Clearances (Rule 79/80)', done: false },
      { id: 'ec-2', name: 'Internal Wiring & Sub-Circuits: Cleat, Batten, Casing-Capping & Conduit Wiring; Light/Fan Sub-Circuit (Max 10 Points / 800W) vs Power Sub-Circuit (Max 2 Points / 3000W)', done: false },
      { id: 'ec-3', name: 'Motor & Power Installation Estimation: Service Mains, Motor Cable & Fuse Sizing (1.5x–2x Full Load Current), Main Switch, Starter & Distribution Board (DB) Layout', done: false },
      { id: 'ec-4', name: 'Overhead Line & Substation Estimation: Pole Types, Stay/Guy Sets, Cross-Arms, Pole-Mounted (11kV/415V) vs Plinth Substation Schedule of Materials', done: false },
      { id: 'ec-5', name: 'Earthing Systems (IS 3043): Pipe & Plate Earthing Dimensions, Charcoal/Salt Layers, Permissible Earth Resistance (Power Station 0.5Ω, Major Sub 1Ω, Domestic 5–8Ω)', done: false },
    ],
  },
  {
    id: 'subj-math-sahil',
    name: '10. Non-Tech: Quantitative Aptitude & Math (Sahil Sir)',
    color: '#eab308',
    units: [
      { id: 'math-1', name: 'Number System, Divisibility Rules, Unit Digit, Remainder Theorem, Factors, AP/GP & Surds/Indices', done: false },
      { id: 'math-2', name: 'HCF & LCM, Simplification, BODMAS, Recurring Decimals & Square/Cube Roots', done: false },
      { id: 'math-3', name: 'Percentage, Ratio & Proportion, Partnership, Problems on Ages & Mixture/Alligation', done: false },
      { id: 'math-4', name: 'Profit & Loss, Successive Discounts, Dishonest Shopkeeper & Marked Price', done: false },
      { id: 'math-5', name: 'Simple Interest (SI) & Compound Interest (CI), 2-Year/3-Year CI-SI Difference & Installments', done: false },
      { id: 'math-6', name: 'Time & Work, Work & Wages, MDH Chain Rule & Pipes and Cisterns', done: false },
      { id: 'math-7', name: 'Time, Speed & Distance, Relative Speed, Problems on Trains, Boats & Streams & Circular Tracks', done: false },
      { id: 'math-8', name: 'Average, Data Interpretation (Tables, Pie, Bar, Line Graphs) & Statistics (Mean, Median, Mode, SD, Variance)', done: false },
      { id: 'math-9', name: 'Algebra (Linear/Quadratic Equations, Identities, Polynomials) & Trigonometry (Identities, Max/Min, Height & Distance)', done: false },
      { id: 'math-10', name: 'Geometry (Lines, Triangles, Congruence/Similarity, Circles, Chords, Tangents) & Mensuration 2D/3D (Area, Volume, Prism, Pyramid, Cone, Cylinder, Sphere)', done: false },
    ],
  },
  {
    id: 'subj-reasoning',
    name: '11. Non-Tech: General Intelligence & Reasoning (SSC JE / RRB JE)',
    color: '#ec4899',
    units: [
      { id: 'reas-1', name: 'Alphabetical/Alphanumeric Series & Coding-Decoding (Letter, Number, Mixed & Substitution Coding)', done: false },
      { id: 'reas-2', name: 'Number Series (Missing/Wrong Term), Number Set Analogy & Mathematical Operations (BODMAS Sign Swap)', done: false },
      { id: 'reas-3', name: 'Semantic, Word, Number & Figural Analogy; Classification (Odd One Out)', done: false },
      { id: 'reas-4', name: 'Syllogism (All, Some, No, Only a Few, Possibility Cases) & Logical Venn Diagrams', done: false },
      { id: 'reas-5', name: 'Blood Relations (Family Tree & Coded Relations) & Direction/Distance (Shadow & Degree Rotation)', done: false },
      { id: 'reas-6', name: 'Seating Arrangement (Linear, Circular, Facing In/Out, Parallel Rows) & Floor/Box/Day Puzzles', done: false },
      { id: 'reas-7', name: 'Order & Ranking, Coded Inequalities (>, <, ≥, ≤) & Clock/Calendar (Angle, Mirror Time, Odd Days, Leap Year)', done: false },
      { id: 'reas-8', name: 'Non-Verbal Reasoning: Dice (Open/Closed), Cube Cutting, Figure Counting (Triangles/Squares), Mirror/Water Image, Paper Folding & Embedded Figures', done: false },
      { id: 'reas-9', name: 'Critical Reasoning: Statement & Conclusion, Assumptions, Arguments, Course of Action & Cause-Effect', done: false },
    ],
  },
  {
    id: 'subj-science',
    name: '12. Non-Tech: General Science & Environment (RRB JE / SSC JE)',
    color: '#22d3ee',
    units: [
      { id: 'sci-1', name: "Physics — I: Units & Dimensions, Kinematics, Newton's Laws, Work/Energy/Power, Gravitation, Pressure, Buoyancy & Surface Tension", done: false },
      { id: 'sci-2', name: 'Physics — II: Light & Optics (Mirrors, Lenses, Refraction, TIR, Human Eye), Sound Waves, Heat & Thermodynamics, Electricity & Magnetism', done: false },
      { id: 'sci-3', name: 'Chemistry — I: Atomic Structure, Periodic Table Trends, Chemical Bonding, Acids, Bases, Salts & pH Scale', done: false },
      { id: 'sci-4', name: 'Chemistry — II: Metals, Non-Metals, Important Ores & Alloys (Brass, Bronze, Solder, Nichrome), Carbon Compounds & Everyday Chemistry', done: false },
      { id: 'sci-5', name: 'Biology: Cell Organelles, Plant Physiology & Hormones, Human Digestive, Circulatory, Respiratory, Excretory, Nervous & Endocrine Systems, Vitamins & Diseases', done: false },
      { id: 'sci-6', name: 'Environment & Computer Basics (RRB JE CBT-2): Ecosystem, Pollution, Ozone Depletion, Greenhouse Gases, Waste Management, OS, Networking & MS Office', done: false },
    ],
  },
  {
    id: 'subj-gk-gs',
    name: '13. Non-Tech: General Awareness, Polity, History, Geo & Static GK',
    color: '#10b981',
    units: [
      { id: 'gk-1', name: 'Indian Polity & Constitution: Preamble, Fundamental Rights, DPSP, President, Parliament, Supreme Court, Panchayati Raj, Key Articles, Schedules & Amendments', done: false },
      { id: 'gk-2', name: 'History: Indus Valley, Vedic Age, Buddhism/Jainism, Maurya & Gupta Empires, Delhi Sultanate, Mughals, 1857 Revolt, INC Sessions & Gandhian Freedom Struggle', done: false },
      { id: 'gk-3', name: 'Indian & World Geography: Himalayas, River Systems & Multipurpose Dams, Monsoon, Soils, Minerals, National Parks, Biosphere Reserves & Census 2011', done: false },
      { id: 'gk-4', name: 'Indian Economy: GDP/GNP, NITI Aayog, RBI Monetary Policy (Repo, Reverse Repo, CRR, SLR), Banking, Inflation, Union Budget, GST & Govt Schemes', done: false },
      { id: 'gk-5', name: 'Static GK & Current Affairs: Classical/Folk Dances, Festivals, Temples, UNESCO Sites, Books/Authors, Sports, Awards, ISRO/DRDO & West Bengal GK (WBSEDCL/WBPSC)', done: false },
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
      { id: 'ead-1', title: 'Raman Sir (EAD) — Basic Electrical: Ohm Law, KCL, KVL & Star-Delta', topic: 'Basic Electrical', url: 'https://www.youtube.com/results?search_query=Raman+Sir+EAD+Online+Classes+Basic+Electrical+KCL+KVL+Star+Delta+SSC+JE' },
      { id: 'ead-2', title: 'Raman Sir (EAD) — Network Theorems: Thevenin, Norton, Superposition', topic: 'Network Theorems', url: 'https://www.youtube.com/results?search_query=Raman+Sir+EAD+Online+Classes+Network+Theorems+Thevenin+Norton+SSC+JE' },
      { id: 'ead-3', title: 'Raman Sir (EAD) — AC Fundamentals, Resonance & 3-Phase Circuits', topic: 'AC & 3-Phase', url: 'https://www.youtube.com/results?search_query=Raman+Sir+EAD+Online+Classes+AC+Fundamentals+3+Phase+Star+Delta+Resonance' },
      { id: 'ead-5', title: 'Raman Sir (EAD) — Transformers Complete Lecture (1-Phase, 3-Phase, Scott)', topic: 'Transformers', url: 'https://www.youtube.com/results?search_query=Raman+Sir+EAD+Online+Classes+Transformer+Complete+SSC+JE+Electrical' },
      { id: 'ead-6', title: 'Raman Sir (EAD) — DC Generators & DC Motors Complete', topic: 'DC Machines', url: 'https://www.youtube.com/results?search_query=Raman+Sir+EAD+Online+Classes+DC+Machine+Generator+Motor+SSC+JE' },
      { id: 'ead-7', title: 'Raman Sir (EAD) — 3-Phase Induction Motor & Starters', topic: 'Induction Motor', url: 'https://www.youtube.com/results?search_query=Raman+Sir+EAD+Online+Classes+3+Phase+Induction+Motor+SSC+JE' },
      { id: 'ead-8', title: 'Raman Sir (EAD) — Synchronous Machines (Alternators & Sync Motors)', topic: 'Synchronous Machines', url: 'https://www.youtube.com/results?search_query=Raman+Sir+EAD+Online+Classes+Synchronous+Machine+Alternator+SSC+JE' },
      { id: 'ead-11', title: 'Raman Sir (EAD) — Power Systems (Generation, T&D, Sag, Insulators, Cables)', topic: 'Power Systems', url: 'https://www.youtube.com/results?search_query=Raman+Sir+EAD+Online+Classes+Transmission+and+Distribution+Cables+Insulators' },
      { id: 'ead-12', title: 'Raman Sir (EAD) — Switchgear, Circuit Breakers, Relays & Faults', topic: 'Switchgear', url: 'https://www.youtube.com/results?search_query=Raman+Sir+EAD+Online+Classes+Switchgear+and+Protection+Fault+Analysis' },
      { id: 'ead-13', title: 'Raman Sir (EAD) — Electrical Measurements (PMMC, MI, Bridges, CRO)', topic: 'Measurements', url: 'https://www.youtube.com/results?search_query=Raman+Sir+EAD+Online+Classes+Electrical+Measurements+and+Instrumentation' },
      { id: 'ead-14', title: 'Raman Sir (EAD) — Basic, Digital & Power Electronics (BJT, FET, Op-Amp, SCR)', topic: 'Electronics', url: 'https://www.youtube.com/results?search_query=Raman+Sir+EAD+Online+Classes+Basic+Electronics+Power+Electronics+JE' },
      { id: 'ead-15', title: 'Raman Sir (EAD) — Utilization, Traction, Heating, Illumination & Costing', topic: 'Utilization & Costing', url: 'https://www.youtube.com/results?search_query=Raman+Sir+EAD+Online+Classes+Utilization+of+Electrical+Energy+Estimation+Costing' },
    ],
  },
  {
    id: 'folder-ee-oneshot',
    name: '🔥 Electrical One-Shot & Marathon Revisions',
    links: [
      { id: 'os-1', title: 'Complete Basic Electrical & Network Theory One-Shot (Raman Sir)', topic: 'One-Shot Network', url: 'https://www.youtube.com/results?search_query=Basic+Electrical+One+Shot+Marathon+Raman+Sir+EAD+SSC+JE+RRB+JE' },
      { id: 'os-2', title: 'Complete Electrical Machines 12-Hr Marathon', topic: 'One-Shot Machines', url: 'https://www.youtube.com/results?search_query=Electrical+Machines+Complete+Marathon+One+Shot+Raman+Sir+EAD+SSC+JE' },
      { id: 'os-3', title: 'Complete Power Systems & Switchgear One-Shot', topic: 'One-Shot Power Systems', url: 'https://www.youtube.com/results?search_query=Power+System+Complete+One+Shot+Marathon+Raman+Sir+EAD+Electrical+JE' },
      { id: 'os-6', title: 'All Electrical Engineering Formulas & PYQ Marathon', topic: 'All Formulas', url: 'https://www.youtube.com/results?search_query=All+Electrical+Engineering+Formulas+Revision+Marathon+Raman+Sir+EAD' },
    ],
  },
  {
    id: 'folder-sahil-sir-math',
    name: '📐 Non-Tech Math · Sahil Sir',
    links: [
      { id: 'math-l1', title: 'Sahil Sir — Number System, HCF-LCM & Simplification', topic: 'Number System', url: 'https://www.youtube.com/results?search_query=Sahil+Sir+Math+Number+System+HCF+LCM+RRB+JE+One+Shot' },
      { id: 'math-l2', title: 'Sahil Sir — Percentage, Ratio, Profit-Loss & SI-CI', topic: 'Arithmetic', url: 'https://www.youtube.com/results?search_query=Sahil+Sir+Math+Percentage+Profit+Loss+SI+CI+RRB+JE' },
      { id: 'math-l5', title: 'Sahil Sir — Time & Work, Pipe & Cistern, Time-Speed-Distance & Trains', topic: 'Time & Distance', url: 'https://www.youtube.com/results?search_query=Sahil+Sir+Math+Time+and+Work+Time+Speed+Distance+RRB+JE' },
      { id: 'math-l8', title: 'Sahil Sir — Algebra, Trigonometry, Geometry, Mensuration & Statistics', topic: 'Advance Math', url: 'https://www.youtube.com/results?search_query=Sahil+Sir+Math+Trigonometry+Geometry+Mensuration+Statistics+RRB+JE' },
    ],
  },
  {
    id: 'folder-je-reasoning',
    name: '🧠 Non-Tech Reasoning (Piyush Sir / Vikramjeet Sir)',
    links: [
      { id: 'reas-l1', title: 'Coding-Decoding, Number Series & Analogy One-Shot', topic: 'Series & Coding', url: 'https://www.youtube.com/results?search_query=Coding+Decoding+and+Number+Series+Reasoning+Piyush+Varshney+SSC+JE+RRB+JE' },
      { id: 'reas-l2', title: 'Syllogism, Blood Relations, Direction & Seating Arrangement', topic: 'Verbal Reasoning', url: 'https://www.youtube.com/results?search_query=Syllogism+Blood+Relation+Seating+Arrangement+Reasoning+One+Shot+SSC+JE' },
      { id: 'reas-l5', title: 'Clock, Calendar, Dice & Figure Counting Tricks', topic: 'Non-Verbal & Clock/Calendar', url: 'https://www.youtube.com/results?search_query=Clock+Calendar+Dice+Figure+Counting+Reasoning+Piyush+Varshney+One+Shot' },
    ],
  },
  {
    id: 'folder-general-science',
    name: '🔬 Non-Tech General Science (Neeraj Sir)',
    links: [
      { id: 'sci-l1', title: 'Complete Physics, Chemistry & Biology Marathon', topic: 'General Science', url: 'https://www.youtube.com/results?search_query=Complete+Science+One+Shot+Marathon+Science+Magnet+Neeraj+Sir+RRB+JE' },
      { id: 'sci-l4', title: 'Environment, Ecology & Computer Basics (RRB JE CBT-2)', topic: 'Environment & Computers', url: 'https://www.youtube.com/results?search_query=Environment+and+Pollution+Basics+of+Computer+RRB+JE+CBT+2+One+Shot' },
    ],
  },
  {
    id: 'folder-gk-gs-parmar',
    name: '🌍 Non-Tech GK / GS (Parmar SSC)',
    links: [
      { id: 'gk-l1', title: 'Parmar SSC — Complete Indian Polity One-Shot', topic: 'Indian Polity', url: 'https://www.youtube.com/results?search_query=Parmar+SSC+Complete+Polity+One+Shot+Marathon+SSC+JE' },
      { id: 'gk-l2', title: 'Parmar SSC — Complete History (Ancient, Medieval, Modern)', topic: 'Complete History', url: 'https://www.youtube.com/results?search_query=Parmar+SSC+Complete+History+One+Shot+Marathon+SSC+JE' },
      { id: 'gk-l3', title: 'Parmar SSC — Complete Indian Geography & Static GK', topic: 'Geography & Static GK', url: 'https://www.youtube.com/results?search_query=Parmar+SSC+Complete+Geography+Static+GK+One+Shot+Marathon+SSC+JE' },
      { id: 'gk-l6', title: 'West Bengal Geography & Power Sector Static GK', topic: 'West Bengal GK', url: 'https://www.youtube.com/results?search_query=West+Bengal+GK+Geography+One+Shot+WBPSC+WBSEDCL+JE' },
    ],
  },
]

// ============================================================================
// 3. MASTER CHRONO-ROOTS (30 HISTORY BRANCHES, 16 POLITY BRANCHES)
// ============================================================================
export type ChronoEra = 'Ancient' | 'Medieval' | 'Modern'
export interface ChronoHistoryLeaf { id: string; dateBadge: string; title: string; subtitle: string; stars: 1 | 2 | 3; scarred?: boolean; cause: string; effect: string; polityLinkText: string; polityLockerId: string; quizQ: string; quizOpts: string[]; quizAns: number; }
export interface ChronoPolityLeaf { id: string; title: string; articleBadge: string; lockerId: string; }
export interface ChronoTrunkHub { id: string; era: ChronoEra; yearLabel: string; scarred?: boolean; polityLeaves: ChronoPolityLeaf[]; historyLeaves: ChronoHistoryLeaf[]; }

export const MASTER_CHRONO_ROOTS: ChronoTrunkHub[] = [
  {
    id: 'hub-1757-1857',
    era: 'Modern',
    yearLabel: '1757–1857',
    polityLeaves: [
      { id: 'pl-1773', title: '1773 SC Calcutta & UPSC', articleBadge: 'Art 124 (SC) & Art 315', lockerId: 'pv-5' },
      { id: 'pl-1858', title: '1858 Crown Sovereignty', articleBadge: 'Part I (Art 1–4) & Art 14–18', lockerId: 'pv-1' },
    ],
    historyLeaves: [
      {
        id: 'hl-1757', dateBadge: '23 Jun 1757 & 1764', title: 'Plassey (1757) & Buxar (1764)', subtitle: 'Clive, Munro & 1765 Diwani Treaty', stars: 3,
        cause: 'EIC military expansion under Robert Clive (Plassey 1757) and Hector Munro (Buxar 1764 vs Mir Qasim, Shuja-ud-Daulah & Shah Alam II).',
        effect: 'Treaty of Allahabad (1765) gave EIC Diwani (revenue) rights over Bengal, Bihar, and Orissa; Warren Hastings ended Dual Govt in 1772.',
        polityLinkText: 'Initiated written British Parliamentary regulation leading to Part V Executive & Revenue separation.', polityLockerId: 'pv-5',
        quizQ: 'Which 1765 treaty granted the East India Company the Diwani rights of Bengal, Bihar, and Orissa?',
        quizOpts: ['Treaty of Alinagar', 'Treaty of Allahabad', 'Treaty of Salbai', 'Treaty of Bassein'], quizAns: 1,
      },
      {
        id: 'hl-1773', dateBadge: '1773 to 1853 Acts', title: 'Regulating Act 1773 to Charter 1853', subtitle: 'Calcutta SC (1774), Bentinck (1833) & ICS', stars: 3,
        cause: 'Corruption and financial crisis in EIC forced British Parliamentary oversight through 20-year Charter Acts.',
        effect: '1773: Warren Hastings 1st GG of Bengal & Calcutta SC (1774, Elijah Impey). 1793: Permanent Settlement. 1813: Ended monopoly (except tea/China). 1833: Bentinck 1st GG of India. 1853: Open ICS exam.',
        polityLinkText: 'Direct institutional ancestor of the Supreme Court (Art 124) and UPSC Open Merit System (Art 315).', polityLockerId: 'pv-5',
        quizQ: 'Which Charter Act made Lord William Bentinck the first Governor-General of India?',
        quizOpts: ['Regulating Act 1773', 'Charter Act 1813', 'Charter Act 1833', 'Charter Act 1853'], quizAns: 2,
      },
      {
        id: 'hl-1828', dateBadge: '1828–1897 Reforms', title: 'Brahmo, Arya & Satyashodhak Samaj', subtitle: 'Roy (1828), Vidyasagar (1856), Phule (1873)', stars: 3,
        cause: '19th-century renaissance against Sati, untouchability, idolater dogma, and denial of women’s education.',
        effect: '1828 Brahmo Samaj (Ram Mohan Roy; Sati abolished 1829), 1856 Widow Remarriage (Vidyasagar), 1873 Satyashodhak Samaj (Jyotiba Phule — Gulamgiri), 1875 Arya Samaj (Dayanand Saraswati), 1897 Ramakrishna Mission (Vivekananda).',
        polityLinkText: 'Direct foundation for Right to Equality (Art 14–15) and Abolition of Untouchability (Art 17).', polityLockerId: 'pv-3',
        quizQ: 'Who founded the Satyashodhak Samaj in 1873 and authored "Gulamgiri"?',
        quizOpts: ['Raja Ram Mohan Roy', 'Jyotiba Phule', 'Swami Dayanand Saraswati', 'Ishwar Chandra Vidyasagar'], quizAns: 1,
      },
      {
        id: 'hl-1857', dateBadge: '10 May 1857', title: 'Revolt of 1857 & GOI Act 1858', subtitle: 'Meerut Mutiny, Lakshmibai & Crown Rule', stars: 3,
        cause: 'Dalhousie’s Doctrine of Lapse (Satara 1848, Jhansi 1853, Awadh 1856) and greased Enfield cartridges (Mangal Pandey 29 Mar 1857; Meerut 10 May 1857).',
        effect: 'East India Company abolished; GOI Act 1858 transferred sovereignty to British Crown with Lord Canning as 1st Viceroy.',
        polityLinkText: 'Direct trigger for Crown-to-Republic sovereignty transfer (Part I, Art 1) and Cabinet Secretary accountability.', polityLockerId: 'pv-1',
        quizQ: 'Who became the first Viceroy of India under the Government of India Act 1858?',
        quizOpts: ['Lord Dalhousie', 'Lord Canning', 'Lord Ripon', 'Lord Curzon'], quizAns: 1,
      },
    ],
  },
  {
    id: 'hub-1885',
    era: 'Modern',
    yearLabel: '1885–1916',
    polityLeaves: [
      { id: 'pl-parl', title: 'Parliamentary System', articleBadge: 'Part V (Art 79–122)', lockerId: 'pv-5' },
      { id: 'pl-elec', title: 'Universal Adult Suffrage', articleBadge: 'Part XV (Art 324–326)', lockerId: 'pv-11' },
    ],
    historyLeaves: [
      {
        id: 'hl-1885', dateBadge: '28 Dec 1885', title: 'Formation of INC (Bombay)', subtitle: 'A.O. Hume, W.C. Bonnerjee (72 Delegates)', stars: 3,
        cause: 'Need for an all-India political platform under Viceroy Lord Dufferin at Gokuldas Tejpal Sanskrit College.',
        effect: '1st Pres: W.C. Bonnerjee (1885); 1st Muslim Pres: Badruddin Tyabji (1887); 1st Woman: Annie Besant (1917); 1st Indian Woman: Sarojini Naidu (1925 Kanpur).',
        polityLinkText: 'Created the parliamentary opposition & legislative debate culture enshrined in Part V (Art 79–105).', polityLockerId: 'pv-5',
        quizQ: 'Who presided over the first session of the Indian National Congress at Bombay in December 1885?',
        quizOpts: ['Dadabhai Naoroji', 'W.C. Bonnerjee', 'Badruddin Tyabji', 'George Yule'], quizAns: 1,
      },
      {
        id: 'hl-1905', dateBadge: '16 Oct 1905', title: 'Partition of Bengal & Swadeshi', subtitle: 'Lord Curzon, Boycott & 1906 Calcutta INC', stars: 3,
        cause: 'Lord Curzon divided Bengal on communal/administrative pretexts on 16 October 1905 (observed as Raksha Bandhan Day).',
        effect: 'Launched Swadeshi & Boycott movement; Dadabhai Naoroji declared "Swaraj" at 1906 Calcutta INC; Partition annulled at 1911 Delhi Durbar (Capital shifted Calcutta → Delhi).',
        polityLinkText: 'Shaped Art 3 (Parliamentary procedure for state reorganization) and Swadeshi cottage industries (Art 43).', polityLockerId: 'pv-1',
        quizQ: 'During which Viceroy’s tenure was the Partition of Bengal enforced on 16 October 1905?',
        quizOpts: ['Lord Minto', 'Lord Curzon', 'Lord Hardinge', 'Lord Chelmsford'], quizAns: 1,
      },
      {
        id: 'hl-1907', dateBadge: '1907 & 1909', title: 'Surat Split (1907) & Morley-Minto (1909)', subtitle: 'Lal-Bal-Pal vs Moderates & Separate Electorates', stars: 3,
        cause: 'Ideological clash between Moderates (Gokhale) and Extremists (Tilak, Lajpat Rai, Bipin Chandra Pal) at 1907 Surat INC (Pres: Rash Behari Ghosh).',
        effect: 'Indian Councils Act 1909 (Morley-Minto) introduced communal Separate Electorates for Muslims; Satyendra Prasanna Sinha became 1st Indian in Viceroy’s Executive Council.',
        polityLinkText: 'The 1950 Constitution abolished communal electorates under Art 325 and guaranteed Universal Adult Suffrage (Art 326).', polityLockerId: 'pv-11',
        quizQ: 'Which Act introduced the system of communal "Separate Electorates" in British India?',
        quizOpts: ['Indian Councils Act 1892', 'Morley-Minto Reforms 1909', 'Montagu-Chelmsford Act 1919', 'GOI Act 1935'], quizAns: 1,
      },
      {
        id: 'hl-1916', dateBadge: '1916 CE', title: 'Home Rule League & Lucknow Pact', subtitle: 'Tilak, Annie Besant & A.C. Mazumdar', stars: 2,
        cause: 'Tilak (Belgaum, Apr 1916) and Annie Besant (Madras, Sept 1916) launched Home Rule Leagues demanding self-government.',
        effect: '1916 Lucknow Session (Pres: Ambica Charan Mazumdar) reunited Moderates & Extremists and signed the Congress–Muslim League Lucknow Pact.',
        polityLinkText: 'Consolidated self-rule demands into constitutional bill of rights drafts.', polityLockerId: 'pv-3',
        quizQ: 'Who presided over the historic 1916 Lucknow Session of the Indian National Congress?',
        quizOpts: ['Annie Besant', 'Ambica Charan Mazumdar', 'Motilal Nehru', 'C.R. Das'], quizAns: 1,
      },
    ],
  },
  {
    id: 'hub-1919',
    era: 'Modern',
    yearLabel: '1917–1924',
    scarred: true,
    polityLeaves: [
      { id: 'pl-fr', title: 'Part III: Fundamental Rights', articleBadge: 'Art 19, 21 & 22 Safeguards', lockerId: 'pv-3' },
      { id: 'pl-dpsp', title: 'Part IV: Gandhian DPSP', articleBadge: 'Art 40, 43 & 47', lockerId: 'pv-4' },
    ],
    historyLeaves: [
      {
        id: 'hl-1917', dateBadge: '1917–1918', title: 'Champaran, Ahmedabad & Kheda', subtitle: 'Gandhi’s First 3 Satyagrahas in India', stars: 3,
        cause: 'Gandhi returned on 9 Jan 1915 (Pravasi Bharatiya Divas) and confronted Indigo Tinkathia (3/20 land) in Champaran (invited by Raj Kumar Shukla).',
        effect: 'Champaran (1917 — 1st Civil Disobedience), Ahmedabad Mill Strike (Mar 1918 — 1st Hunger Strike), Kheda Satyagraha (1918 — 1st Non-Cooperation with Sardar Patel).',
        polityLinkText: 'Inspired Living Wage for workers (Art 43) and Prohibition of Forced Labour (Art 23).', polityLockerId: 'pv-4',
        quizQ: 'Which movement in 1917 was Mahatma Gandhi’s first Civil Disobedience movement in India?',
        quizOpts: ['Kheda Satyagraha', 'Champaran Satyagraha', 'Ahmedabad Mill Strike', 'Bardoli Satyagraha'], quizAns: 1,
      },
      {
        id: 'hl-1919', dateBadge: '10 Mar & 13 Apr 1919', title: 'Rowlatt Act & Jallianwala Bagh', subtitle: 'Amritsar Massacre & Tagore’s Renunciation', stars: 3, scarred: true,
        cause: 'The oppressive Anarchical and Revolutionary Crimes Act (Rowlatt Act — "No Dalil, No Vakil, No Appeal") allowed detention without trial.',
        effect: 'General Dyer opened fire on a peaceful Baisakhi crowd in Amritsar (13 April 1919); Rabindranath Tagore renounced his Knighthood and Gandhi launched Non-Cooperation.',
        polityLinkText: 'Direct inspiration for Part III: Fundamental Rights — Freedom of Speech/Assembly (Art 19), Life & Liberty (Art 21), and Protection against Arbitrary Arrest (Art 22).', polityLockerId: 'pv-3',
        quizQ: 'Which Part of the Indian Constitution was directly inspired by the struggle against the 1919 Rowlatt Act?',
        quizOpts: ['Part II: Citizenship', 'Part III: Fundamental Rights', 'Part IV: DPSP', 'Part IVA: Fundamental Duties'], quizAns: 1,
      },
      {
        id: 'hl-1920', dateBadge: '1920–1922', title: 'Non-Cooperation & Chauri Chaura', subtitle: 'Khilafat Alliance & 5 Feb 1922 Suspension', stars: 3,
        cause: 'Launched on 1 August 1920 over Punjab wrongs, Khilafat issue, and demand for Swaraj.',
        effect: 'Boycott of titles, courts, and foreign cloth; abruptly called off by Gandhi after the Chauri Chaura incident (4/5 Feb 1922 in Gorakhpur, UP).',
        polityLinkText: 'Inspired Fundamental Duty to safeguard public property and abjure violence (Art 51A(i)) & Cottage Industries (Art 43).', polityLockerId: 'pv-4',
        quizQ: 'Which incident in February 1922 led Mahatma Gandhi to suspend the Non-Cooperation Movement?',
        quizOpts: ['Kakori Train Action', 'Chauri Chaura Incident', 'Moplah Rebellion', 'Jallianwala Bagh'], quizAns: 1,
      },
      {
        id: 'hl-1923', dateBadge: '1923–1925', title: 'Swaraj Party (1923) & Belgaum INC', subtitle: 'C.R. Das, Motilal Nehru & 1924 Gandhi Pres.', stars: 2,
        cause: 'Pro-changers (C.R. Das & Motilal Nehru) entered Legislative Councils to challenge the 1919 Montagu-Chelmsford reforms from within.',
        effect: 'Founded Swaraj Party on 1 Jan 1923; Vithalbhai Patel elected Speaker of Central Legislative Assembly (1925); Gandhi presided over 1924 Belgaum INC.',
        polityLinkText: 'Established the Office of the Speaker (Art 93) and legislative budget accountability.', polityLockerId: 'pv-5',
        quizQ: 'In which session did Mahatma Gandhi preside over the Indian National Congress (for the only time)?',
        quizOpts: ['Gaya 1922', 'Belgaum 1924', 'Kanpur 1925', 'Lahore 1929'], quizAns: 1,
      },
    ],
  },
  {
    id: 'hub-1935-1950',
    era: 'Modern',
    yearLabel: '1928–1950',
    polityLeaves: [
      { id: 'pl-1935', title: '7th Schedule & Emergency', articleBadge: 'Part XI (Art 246) & XVIII', lockerId: 'pv-11' },
      { id: 'pl-1950', title: '12 Schedules & Amendments', articleBadge: 'Preamble, Art 330 & Art 368', lockerId: 'pv-schedules' },
    ],
    historyLeaves: [
      {
        id: 'hl-1929', dateBadge: '1929–1932', title: 'Lahore Purna Swaraj, Dandi & Poona Pact', subtitle: 'Nehru (1929), Salt March (1930) & Ambedkar (1932)', stars: 3,
        cause: 'Boycott of all-white Simon Commission (1928) and Lahore INC (Dec 1929, J.L. Nehru) declaring 26 Jan 1930 as Purna Swaraj Day.',
        effect: 'Dandi Salt March (12 Mar–6 Apr 1930, 78 followers, 240 miles), Gandhi-Irwin Pact (5 Mar 1931), Poona Pact (24 Sept 1932 between Gandhi & Ambedkar at Yerwada Jail).',
        polityLinkText: 'Why 26 Jan was chosen as Republic Day + Art 330/332 SC/ST Seat Reservations (from 1932 Poona Pact).', polityLockerId: 'pv-11',
        quizQ: 'Between whom was the Poona Pact of 24 September 1932 signed?',
        quizOpts: ['Gandhi and Lord Irwin', 'Gandhi and Dr. B.R. Ambedkar', 'Nehru and Jinnah', 'Subhas Bose and Patel'], quizAns: 1,
      },
      {
        id: 'hl-1935', dateBadge: '2 Aug 1935', title: 'Government of India Act 1935', subtitle: 'Provincial Autonomy, 3 Lists, RBI & Federal Court', stars: 3,
        cause: 'Culmination of the 3 Round Table Conferences (1930–32) and White Paper on constitutional reforms.',
        effect: 'Ended provincial dyarchy, introduced Provincial Autonomy, Federal/Provincial/Concurrent Lists, established RBI (1935) and Federal Court (1937).',
        polityLinkText: 'Single largest blueprint (~60% skeleton) of the 1950 Constitution: 7th Schedule Lists, Governor, PSC & Emergency.', polityLockerId: 'pv-11',
        quizQ: 'Which Act serves as the single largest structural source (~60%) for the Constitution of India?',
        quizOpts: ['GOI Act 1858', 'Indian Councils Act 1909', 'GOI Act 1919', 'GOI Act 1935'], quizAns: 3,
      },
      {
        id: 'hl-1942', dateBadge: '1942–1945', title: 'Quit India (1942) & Netaji’s INA (1943)', subtitle: '"Do or Die" (8 Aug 1942) & Azad Hind Govt', stars: 3,
        cause: 'Failure of Cripps Mission (1942) led to the Quit India Resolution at Gowalia Tank, Bombay on 8 August 1942.',
        effect: 'Netaji Subhas Chandra Bose (Pres at 1938 Haripura & 1939 Tripuri; Forward Bloc 1939) formed Provisional Azad Hind Govt in Singapore (1943 — "Jai Hind").',
        polityLinkText: 'Enshrined in Part IVA Fundamental Duties (Art 51A(b) — cherish the noble ideals of the national freedom struggle).', polityLockerId: 'pv-4',
        quizQ: 'In which two sessions was Netaji Subhas Chandra Bose elected President of the INC?',
        quizOpts: ['Lahore & Karachi', 'Haripura (1938) & Tripuri (1939)', 'Belgaum & Kanpur', 'Lucknow & Faizpur'], quizAns: 1,
      },
      {
        id: 'hl-1946', dateBadge: '1946–26 Jan 1950', title: 'Cabinet Mission & Constituent Assembly', subtitle: 'Rajendra Prasad, B.R. Ambedkar & B.N. Rau', stars: 3,
        cause: 'Cabinet Mission (1946: Pethick-Lawrence, Cripps, Alexander) constituted the 389-member Constituent Assembly.',
        effect: '1st Met: 9 Dec 1946 (Sachchidananda Sinha); 11 Dec: Dr. Rajendra Prasad Pres; 13 Dec: Nehru’s Objectives Resolution; 29 Aug 1947: Drafting Committee (Dr. B.R. Ambedkar). Adopted 26 Nov 1949; enforced 26 Jan 1950.',
        polityLinkText: 'Created the Preamble, 22 Parts (now 25), 395 Articles, and 12 Schedules ("TEARS OF OLD PM").', polityLockerId: 'pv-schedules',
        quizQ: 'Who was the Constitutional Advisor to the Constituent Assembly of India?',
        quizOpts: ['Dr. B.R. Ambedkar', 'Sir B.N. Rau', 'K.M. Munshi', 'Dr. Rajendra Prasad'], quizAns: 1,
      },
    ],
  },
  {
    id: 'hub-ancient-1',
    era: 'Ancient',
    yearLabel: '2500–600 BCE',
    polityLeaves: [
      { id: 'pl-ivc', title: 'Part IXA: Urban Municipalities', articleBadge: 'Art 243P–ZG · 12th Sch', lockerId: 'pv-9a' },
      { id: 'pl-ved', title: 'Part IX: Gram Sabha & Motto', articleBadge: 'Art 40 & Satyameva Jayate', lockerId: 'pv-9' },
    ],
    historyLeaves: [
      {
        id: 'hl-ivc1', dateBadge: '1921–22 Excavations', title: 'Harappa (Ravi) & Mohenjo-Daro (Indus)', subtitle: 'Dayaram Sahni, R.D. Banerji & Great Bath', stars: 3,
        cause: 'Bronze-age urban planning with grid streets and covered brick drainage across the Indus basin.',
        effect: 'Harappa (1921, Dayaram Sahni) & Mohenjo-Daro (1922, R.D. Banerji — Great Bath, Granary, Bronze Dancing Girl, Pashupati Seal).',
        polityLinkText: 'Urban sanitation & municipal town planning under Part IXA (12th Schedule).', polityLockerId: 'pv-9a',
        quizQ: 'Who excavated Mohenjo-Daro on the banks of the Indus River in 1922?',
        quizOpts: ['Dayaram Sahni', 'R.D. Banerji', 'S.R. Rao', 'R.S. Bisht'], quizAns: 1,
      },
      {
        id: 'hl-ivc2', dateBadge: 'Mature Harappan', title: 'Lothal Dockyard, Dholavira & Kalibangan', subtitle: 'Tidal Port, 3-Tier Water Grid & Fire Altars', stars: 3,
        cause: 'Overseas trade with Mesopotamia and arid-zone water harvesting in Gujarat & Rajasthan.',
        effect: 'Lothal (Tidal Dockyard on Bhogava), Dholavira (3-part city & giant water reservoirs, 40th UNESCO site), Kalibangan (ploughed field).',
        polityLinkText: 'Maritime Port Administration & Municipal Water Works (74th Amendment).', polityLockerId: 'pv-9a',
        quizQ: 'Which Indus Valley site in Gujarat is divided into three parts and famous for giant water reservoirs?',
        quizOpts: ['Lothal', 'Dholavira', 'Surkotada', 'Rakhigarhi'], quizAns: 1,
      },
      {
        id: 'hl-ved1', dateBadge: '1500–1000 BCE', title: 'Rigveda (10 Mandalas) & Sabha–Samiti', subtitle: 'Gayatri Mantra, Dasarajna & Purusha Sukta', stars: 3,
        cause: 'Early Vedic settlements governed by tribal deliberative assemblies (Sabha of elders & Samiti of people).',
        effect: '3rd Mandala (Gayatri Mantra by Vishwamitra), 7th Mandala (Battle of 10 Kings on Parushni/Ravi), 10th Mandala (Purusha Sukta).',
        polityLinkText: 'Sabha & Samiti inspired Bicameralism (Part V) and Gram Sabha (Art 243A).', polityLockerId: 'pv-9',
        quizQ: 'On the banks of which river was the Rigvedic "Battle of Ten Kings" (Dasarajna) fought?',
        quizOpts: ['Beas (Vipasa)', 'Ravi (Parushni)', 'Chenab (Askini)', 'Jhelum (Vitasta)'], quizAns: 1,
      },
      {
        id: 'hl-ved2', dateBadge: '800–600 BCE', title: 'Upanishads & 16 Mahajanapadas', subtitle: 'Mundaka Upanishad & Vajji Republic', stars: 3,
        cause: 'Philosophical synthesis (Vedanta) and formation of 16 territorial states (Anguttara Nikaya).',
        effect: 'Mundaka Upanishad gave "Satyameva Jayate"; Magadha (Rajagriha/Pataliputra) and Vajji (Vaishali republic) rose to prominence.',
        polityLinkText: 'National Motto "Satyameva Jayate" and Republican Head of State (Preamble).', polityLockerId: 'pv-1',
        quizQ: 'From which Upanishad is India’s National Motto "Satyameva Jayate" derived?',
        quizOpts: ['Katha Upanishad', 'Mundaka Upanishad', 'Chandogya Upanishad', 'Kena Upanishad'], quizAns: 1,
      },
    ],
  },
  {
    id: 'hub-ancient-2',
    era: 'Ancient',
    yearLabel: '563 BCE–1014 CE',
    polityLeaves: [
      { id: 'pl-dpsp-a', title: 'Part IV: Welfare State (DPSP)', articleBadge: 'Art 38 & National Emblem', lockerId: 'pv-4' },
      { id: 'pl-chola', title: 'Part IX: Panchayat Elections', articleBadge: 'Art 243K · Chola Ballot', lockerId: 'pv-9' },
    ],
    historyLeaves: [
      {
        id: 'hl-bud', dateBadge: '483, 383, 250 BCE & 72 CE', title: '4 Buddhist Councils & Jain Tirthankaras', subtitle: 'Rajagriha, Vaishali, Pataliputra & Kashmir', stars: 3,
        cause: 'Compilation of Tripitakas after Buddha’s Mahaparinirvana and Jain Agamas under Mahavira (24th Tirthankara).',
        effect: '1st: Rajagriha (483 BCE, Ajatashatru); 2nd: Vaishali (383 BCE, Kalashoka); 3rd: Pataliputra (250 BCE, Ashoka); 4th: Kundalvana Kashmir (72 CE, Kanishka).',
        polityLinkText: 'Buddhist Sangha rules (quorum & ballot) shaped Parliamentary Procedure (Art 100) & Art 25.', polityLockerId: 'pv-3',
        quizQ: 'Where was the 4th Buddhist Council convened under Emperor Kanishka in 72 CE?',
        quizOpts: ['Rajagriha', 'Vaishali', 'Pataliputra', 'Kundalvana (Kashmir)'], quizAns: 3,
      },
      {
        id: 'hl-mau', dateBadge: '322–185 BCE (261 BCE)', title: 'Maurya Empire & Kalinga Rock Edict XIII', subtitle: 'Chandragupta, Chanakya & Ashoka’s Dhamma', stars: 3,
        cause: 'Chandragupta & Chanakya founded Maurya Empire (322 BCE); Kalinga War (261 BCE) led Ashoka to Dhammavijaya.',
        effect: 'Sarnath Lion Capital (National Emblem) & 14 Major Rock Edicts (deciphered by James Prinsep in 1837; Maski/Gujarra name Ashoka).',
        polityLinkText: 'Direct inspiration for the Welfare State in Part IV (DPSP, Art 38) and National Emblem.', polityLockerId: 'pv-4',
        quizQ: 'Who deciphered Emperor Ashoka’s Brahmi script edicts in 1837?',
        quizOpts: ['Alexander Cunningham', 'James Prinsep', 'William Jones', 'Max Muller'], quizAns: 1,
      },
      {
        id: 'hl-gup', dateBadge: '78 CE Saka · 319 CE Gupta', title: 'Saka Era, Gupta Golden Age & Harsha', subtitle: 'Samudragupta, Chandragupta II & Nalanda', stars: 3,
        cause: 'Kanishka started Saka Era (78 CE); Chandragupta I started Gupta Era (319 CE); Harsha ruled from Kannauj (606–647 CE).',
        effect: 'Prayag Prasasti (Harishena), Fa-Hien visit, Nalanda University (Kumaragupta I), Hiuen Tsang visit & Pulakeshin II’s Narmada victory.',
        polityLinkText: 'Saka Calendar (78 CE) is the Official National Civil Calendar of India.', polityLockerId: 'pv-1',
        quizQ: 'Who composed the Prayag Prasasti (Allahabad Pillar Inscription) of Samudragupta?',
        quizOpts: ['Kalidasa', 'Harishena', 'Banabhatta', 'Ravikirti'], quizAns: 1,
      },
      {
        id: 'hl-cho', dateBadge: '985–1014 CE', title: 'Imperial Cholas & Uttaramerur Ballot', subtitle: 'Rajaraja I, Rajendra I & Village Sabhas', stars: 3,
        cause: 'Autonomous Tamil village assemblies (Ur & Sabha) and maritime expeditions across Southeast Asia.',
        effect: 'Brihadeeswarar Temple (Thanjavur), Gangaikondacholapuram, and Uttaramerur Inscription (Kudavolai lottery ballot for village committees).',
        polityLinkText: 'Historical bedrock of Grassroots Panchayati Raj Elections (Part IX, Art 243K).', polityLockerId: 'pv-9',
        quizQ: 'Which Chola inscription details village assembly elections via the Kudavolai system?',
        quizOpts: ['Aihole Inscription', 'Uttaramerur Inscription', 'Junagadh Inscription', 'Hathigumpha Inscription'], quizAns: 1,
      },
    ],
  },
  {
    id: 'hub-med-1',
    era: 'Medieval',
    yearLabel: '1191–1526 CE',
    polityLeaves: [
      { id: 'pl-sult', title: 'Part XII: Revenue & Price Control', articleBadge: 'Market & Revenue Audit', lockerId: 'pv-11' },
      { id: 'pl-vij', title: 'Part IX: Local Nayankara', articleBadge: 'Provincial Governance', lockerId: 'pv-9' },
    ],
    historyLeaves: [
      {
        id: 'hl-tar', dateBadge: '1191/92 & 1206–90', title: 'Tarain Battles & Slave Dynasty (Iqta)', subtitle: 'Aibak, Iltutmish, Razia (1236) & Balban', stars: 3,
        cause: 'Prithviraj Chauhan won Tarain I (1191); Ghori won Tarain II (1192); Qutbuddin Aibak founded Slave Dynasty (1206).',
        effect: 'Iltutmish introduced Iqta revenue assignments, Chahalgani (40 nobles), and silver Tanka / copper Jital coins; Balban instituted Blood & Iron.',
        polityLinkText: 'Centralized treasury and provincial revenue transfer mechanisms.', polityLockerId: 'pv-11',
        quizQ: 'Which Sultan introduced the Iqta system and silver Tanka / copper Jital coins?',
        quizOpts: ['Qutbuddin Aibak', 'Iltutmish', 'Balban', 'Alauddin Khilji'], quizAns: 1,
      },
      {
        id: 'hl-khi', dateBadge: '1296–1320 CE', title: 'Alauddin Khilji: Market Control & Dagh', subtitle: 'Shahna-i-Mandi, Chehra & Cash Salaries', stars: 3,
        cause: 'Need to maintain a large standing army against Mongol invasions without price inflation.',
        effect: 'Strict price control (Diwan-i-Riyasat & Shahna-i-Mandi), Dagh (horse branding), Chehra (soldier roll), and Masahat land measurement.',
        polityLinkText: 'Precursor to State Essential Commodities Price Regulation & Defence Audit.', polityLockerId: 'pv-11',
        quizQ: 'Which Delhi Sultan introduced Dagh (branding of horses) and Chehra (descriptive roll of soldiers)?',
        quizOpts: ['Iltutmish', 'Balban', 'Alauddin Khilji', 'Firoz Shah Tughlaq'], quizAns: 2,
      },
      {
        id: 'hl-tug', dateBadge: '1320–1526 CE', title: 'Tughlaq Reforms & Sikandar Lodi (1504)', subtitle: 'Token Currency, Ibn Battuta & Agra City', stars: 2,
        cause: 'Expansion across the Deccan and agricultural/monetary experiments.',
        effect: 'MBT (Daulatabad shift 1327, Token Currency, Diwan-i-Kohi agriculture, Ibn Battuta 1333); Firoz Tughlaq (Irrigation canals); Sikandar Lodi founded Agra (1504).',
        polityLinkText: 'Fiat Token Currency concept & Public Irrigation Works.', polityLockerId: 'pv-11',
        quizQ: 'Who founded the city of Agra in 1504 and introduced the "Gaz-i-Sikandari" land measure?',
        quizOpts: ['Bahlul Lodi', 'Sikandar Lodi', 'Ibrahim Lodi', 'Firoz Shah Tughlaq'], quizAns: 1,
      },
      {
        id: 'hl-vij', dateBadge: '1336–1565 CE', title: 'Vijayanagara Empire (Hampi)', subtitle: 'Harihara & Bukka (1336), Krishnadevaraya', stars: 3,
        cause: 'Founded in 1336 on the banks of the Tungabhadra by Harihara I and Bukka I.',
        effect: 'Four dynasties (Sangama, Saluva, Tuluva, Aravidu); Krishnadevaraya (Ashtadiggajas, Amuktamalyada, Vittala Temple); Battle of Talikota (1565).',
        polityLinkText: 'Ayagar village administration and temple-town civic planning.', polityLockerId: 'pv-9',
        quizQ: 'Krishnadevaraya of Vijayanagara belonged to which dynasty?',
        quizOpts: ['Sangama', 'Saluva', 'Tuluva', 'Aravidu'], quizAns: 2,
      },
    ],
  },
  {
    id: 'hub-med-2',
    era: 'Medieval',
    yearLabel: '1526–1707 CE',
    polityLeaves: [
      { id: 'pl-ash', title: 'Part V: Portfolio Cabinet', articleBadge: 'Art 74–75 (Ashtapradhan)', lockerId: 'pv-5' },
      { id: 'pl-sec', title: 'Preamble: Indian Secularism', articleBadge: 'Sulh-i-Kul · Art 25–28', lockerId: 'pv-3' },
    ],
    historyLeaves: [
      {
        id: 'hl-bab', dateBadge: '1526 & 1540 CE', title: 'Panipat I (1526) & Sher Shah’s Rupiya', subtitle: 'Babur (Khanwa 1527) & GT Road (1540–45)', stars: 3,
        cause: 'Babur defeated Ibrahim Lodi at 1st Panipat (21 Apr 1526); Sher Shah defeated Humayun at Chausa (1539) & Kannauj (1540).',
        effect: 'Sher Shah Suri issued silver Rupiya (178 grains), built Grand Trunk Road, Patta/Qabuliyat land deeds, and Sasaram tomb.',
        polityLinkText: 'Direct ancestor of the Indian Rupee, National Highways, and Land Patta records.', polityLockerId: 'pv-11',
        quizQ: 'In which battle in 1540 did Sher Shah Suri defeat Humayun to establish the Sur Empire?',
        quizOpts: ['Battle of Chanderi', 'Battle of Kannauj (Bilgram)', 'Battle of Ghaghra', 'Battle of Haldighati'], quizAns: 1,
      },
      {
        id: 'hl-akb', dateBadge: '1556–1605 CE', title: 'Akbar: Mansabdari, Zabti & Sulh-i-Kul', subtitle: 'Panipat II (1556), Haldighati (1576), Todar Mal', stars: 3,
        cause: '2nd Panipat (5 Nov 1556 vs Hemu) and administrative consolidation across 15 Subahs.',
        effect: 'Mansabdari (Zat & Sawar ranks), Raja Todar Mal’s 10-year Zabti / Ain-i-Dahsala (1580), abolition of Jizya (1564), and Ibadat Khana.',
        polityLinkText: 'All-India Civil Cadre hierarchy & Secular State neutrality (Preamble & Art 25).', polityLockerId: 'pv-3',
        quizQ: 'Who was the chief architect of Emperor Akbar’s Zabti / Ain-i-Dahsala land revenue system?',
        quizOpts: ['Abul Fazl', 'Raja Todar Mal', 'Birbal', 'Man Singh'], quizAns: 1,
      },
      {
        id: 'hl-shi', dateBadge: '6 June 1674', title: 'Chhatrapati Shivaji Maharaj (Raigad)', subtitle: 'Ashtapradhan Council & Hindavi Swarajya', stars: 3,
        cause: 'Coronation at Raigad Fort (1674) establishing sovereign Maratha administration.',
        effect: '8-Minister Ashtapradhan Council: Peshwa (PM), Amatya (Finance), Sumant (Foreign Affairs), Mantri, Sachiv, Senapati, Panditrao, Nyayadhish.',
        polityLinkText: 'Direct indigenous model for the Union Council of Ministers (Articles 74 & 75).', polityLockerId: 'pv-5',
        quizQ: 'In Chhatrapati Shivaji Maharaj’s Ashtapradhan council, who was in charge of Foreign Affairs?',
        quizOpts: ['Peshwa', 'Amatya', 'Sumant (Dabir)', 'Sachiv'], quizAns: 2,
      },
    ],
  },
]

// ============================================================================
// 2. MASTER POLITY VAULT (DIE-CUT SOVEREIGN SECURITY LOCKERS)
// ============================================================================
export type PolityFolder = {
  id: string
  category: 'Core Parts' | '12 Schedules' | 'Top Amendments'
  lockerCode: string
  partBadge: string
  title: string
  articlesRange: string
  sealText: string
  stars: 1 | 2 | 3
  borrowedFrom: string
  scheduleLink: string
  historyEra: ChronoEra
  historyLeafId: string
  historyLinkLabel: string
  articles: { code: string; summary: string }[]
}

export const MASTER_POLITY_VAULT: PolityFolder[] = [
  {
    id: 'pv-1', category: 'Core Parts', lockerCode: 'VAULT-01', partBadge: 'PREAMBLE · PART I & II',
    title: 'Preamble, Union & Citizenship', articlesRange: 'Preamble & Articles 1–11', sealText: 'SOVEREIGN CORE', stars: 3,
    borrowedFrom: 'Preamble: USA | Liberty/Equality/Fraternity: France | Justice: USSR | Single Citizenship: UK',
    scheduleLink: '1st Schedule (28 States & 8 UTs) · Fazl Ali Commission (7th Amend 1956)',
    historyEra: 'Modern', historyLeafId: 'hl-1857', historyLinkLabel: '1857 Revolt & 1946 Objectives Resolution',
    articles: [
      { code: 'Preamble (42nd Amend 1976)', summary: 'Sovereign Socialist Secular Democratic Republic. Amended once in 1976 to add Socialist, Secular, and Integrity.' },
      { code: 'Articles 1, 2 & 3', summary: 'Art 1: India, that is Bharat, shall be a Union of States. Art 2: Admission of new states (Sikkim 36th Amend 1975). Art 3: Altering state boundaries/names by simple majority.' },
      { code: 'Articles 5 to 11', summary: 'Single Citizenship at commencement (Art 5–8), loss on foreign citizenship (Art 9), and Parliament’s power to regulate citizenship (Art 11 — Citizenship Act 1955).' },
    ],
  },
  {
    id: 'pv-3', category: 'Core Parts', lockerCode: 'VAULT-02', partBadge: 'PART III · MAGNA CARTA',
    title: 'Fundamental Rights & 5 Writs', articlesRange: 'Articles 12 to 35', sealText: 'JUSTICIABLE SHIELD', stars: 3,
    borrowedFrom: 'USA Bill of Rights (Art 20 & 21 never suspended in Emergency — 44th Amend 1978)',
    scheduleLink: 'Citizens-Only Rights: Articles 15, 16, 19, 29 & 30',
    historyEra: 'Modern', historyLeafId: 'hl-1919', historyLinkLabel: '1919 Rowlatt Act & Jallianwala Bagh',
    articles: [
      { code: 'Art 14–18 (Right to Equality)', summary: '14: Equality before Law (UK) & Equal Protection (USA). 15: No discrimination. 16: Equal opportunity in public jobs. 17: Abolition of Untouchability. 18: Abolition of Titles.' },
      { code: 'Art 19–22 (Right to Freedom)', summary: '19: 6 Freedoms. 20: Conviction protection. 21: Life & Personal Liberty. 21A: Free Education (6–14 yrs, 86th Amend 2002). 22: Protection against arbitrary arrest & detention.' },
      { code: 'Art 23–30 (Exploitation, Religion, Minorities)', summary: '23: No human trafficking/forced labour. 24: No child labour (<14 yrs). 25–28: Freedom of Religion. 29–30: Minority Cultural & Educational Rights.' },
      { code: 'Art 32 (Heart & Soul — 5 Writs)', summary: 'SC issues 5 Writs (HC under Art 226): Habeas Corpus, Mandamus, Prohibition, Certiorari, and Quo-Warranto.' },
    ],
  },
  {
    id: 'pv-4', category: 'Core Parts', lockerCode: 'VAULT-03', partBadge: 'PART IV & PART IVA',
    title: 'DPSP & 11 Fundamental Duties', articlesRange: 'Articles 36 to 51A', sealText: 'WELFARE DIRECTIVE', stars: 3,
    borrowedFrom: 'DPSP: Ireland (from Spain) | Fundamental Duties: USSR (Swaran Singh Committee 1976)',
    scheduleLink: 'Non-Justiciable (Art 37) · Part IVA added by 42nd Amend 1976',
    historyEra: 'Ancient', historyLeafId: 'hl-mau', historyLinkLabel: 'Ashoka’s Kalinga Dhamma Edicts (261 BCE)',
    articles: [
      { code: 'Art 38, 39, 39A & 40', summary: '38: Welfare State. 39(d): Equal pay for equal work. 39A: Equal justice & Free Legal Aid (42nd Amend). 40: Organisation of Village Panchayats (Gandhian).' },
      { code: 'Art 41–48A, 50 & 51', summary: '43: Living wage. 43B: Co-operatives (97th Amend). 44: Uniform Civil Code (UCC). 48A: Protect Environment & Wildlife. 50: Separation of Judiciary from Executive. 51: International peace.' },
      { code: 'Art 51A (11 Fundamental Duties)', summary: '10 Duties added by 42nd Amendment 1976 (Swaran Singh Committee); 11th Duty (education for 6–14 yr child) added by 86th Amendment 2002.' },
    ],
  },
  {
    id: 'pv-5', category: 'Core Parts', lockerCode: 'VAULT-04', partBadge: 'PART V & PART VI',
    title: 'Union & State Executive, Parliament & SC', articlesRange: 'Articles 52 to 237', sealText: 'SUPREME COMMAND', stars: 3,
    borrowedFrom: 'UK: Parliamentary Cabinet, Bicameralism, CAG | USA: Impeachment, Judicial Review | Australia: Art 108 Joint Sitting',
    scheduleLink: '2nd Schedule (Salaries), 3rd Schedule (Oaths), 4th Schedule (Rajya Sabha Seats)',
    historyEra: 'Modern', historyLeafId: 'hl-1773', historyLinkLabel: '1773 Regulating Act (SC) & 1885 INC',
    articles: [
      { code: 'President & Governor (Art 52–72, 123, 153–161, 213)', summary: '52: President (35 yrs). 54: Electoral College. 61: Impeachment. 63/64: VP (RS Chair). 72: President Pardon (161: Governor). 123: President Ordinance (213: Governor).' },
      { code: 'PM, Cabinet & Law Officers (Art 74–76, 165)', summary: '74: Council of Ministers aids President. 75(3): Collectively responsible to Lok Sabha (15% cap by 91st Amend). 76: Attorney General of India (165: State Advocate General).' },
      { code: 'Parliament (Art 79–122)', summary: '79: Parliament. 80: Rajya Sabha (30 yrs). 81: Lok Sabha (25 yrs). 93: Speaker. 100: Quorum (1/10). 108: Joint Sitting. 110: Money Bill. 112: Annual Financial Statement (Budget).' },
      { code: 'Judiciary & CAG (Art 124–148, 214–226)', summary: '124: Supreme Court (65 yrs). 129: Court of Record. 143: Advisory Jurisdiction. 214: High Courts (62 yrs). 226: HC Writs. 148: CAG (Guardian of Public Purse).' },
    ],
  },
  {
    id: 'pv-9', category: 'Core Parts', lockerCode: 'VAULT-05', partBadge: 'PART IX & IXB',
    title: 'Panchayati Raj & Co-operatives', articlesRange: 'Articles 243 to 243ZT', sealText: 'GRASSROOTS TIER', stars: 3,
    borrowedFrom: 'Balwant Rai Mehta (1957 — 3-tier, Nagaur RJ 1959), Ashok Mehta (1977), L.M. Singhvi (1986)',
    scheduleLink: '11th Schedule (29 Subjects · 73rd Amend 1992 · Effective 24 April 1993)',
    historyEra: 'Ancient', historyLeafId: 'hl-cho', historyLinkLabel: 'Chola Uttaramerur Ballot & Vedic Sabha',
    articles: [
      { code: 'Art 243A & 243B (3-Tier Rural System)', summary: '243A: Gram Sabha (all registered voters). 243B: 3-tier Panchayats — Gram Panchayat (Village), Panchayat Samiti (Block), Zilla Parishad (District).' },
      { code: 'Art 243D, 243E, 243F, 243I & 243K', summary: '243D: SC/ST reservation + min 1/3rd Women reservation. 243F: Minimum age 21 years. 243I: State Finance Commission (5 yrs). 243K: State Election Commission.' },
    ],
  },
  {
    id: 'pv-9a', category: 'Core Parts', lockerCode: 'VAULT-06', partBadge: 'PART IXA · URBAN',
    title: 'Municipalities (74th Amendment)', articlesRange: 'Articles 243P to 243ZG', sealText: 'CIVIC GRID', stars: 2,
    borrowedFrom: '1st Municipal Corp: Madras (1687/88) | Lord Ripon’s 1882 Resolution',
    scheduleLink: '12th Schedule (18 Functional Items for Municipalities)',
    historyEra: 'Ancient', historyLeafId: 'hl-ivc1', historyLinkLabel: 'Indus Valley Urban Planning (2500 BCE)',
    articles: [
      { code: 'Art 243Q, 243S & 243ZD', summary: '243Q: Nagar Panchayat, Municipal Council & Municipal Corporation. 243S: Wards Committees. 243ZD: District Planning Committee (DPC).' },
    ],
  },
  {
    id: 'pv-11', category: 'Core Parts', lockerCode: 'VAULT-07', partBadge: 'PART XI, XII, XIV, XV & XVIII',
    title: 'Finance, UPSC, Elections & Emergency', articlesRange: 'Articles 245 to 368', sealText: 'FEDERAL MATRIX', stars: 3,
    borrowedFrom: 'GOI Act 1935, Weimar Germany (Emergency), South Africa (Art 368), Canada (Strong Centre)',
    scheduleLink: '7th Schedule (Union 100, State 61, Concurrent 52)',
    historyEra: 'Modern', historyLeafId: 'hl-1935', historyLinkLabel: 'GOI Act 1935 Blueprint & 1932 Poona Pact',
    articles: [
      { code: 'Finance & Services (Art 262–315)', summary: '262: River Disputes. 263: Inter-State Council. 266: Consolidated Fund. 267: Contingency Fund. 279A: GST Council. 280: Finance Commission. 300A: Property Right. 312: All-India Services. 315: UPSC.' },
      { code: 'Elections & Emergencies (Art 324–368)', summary: '324: Election Commission. 326: Adult Suffrage (18 yrs). 330/332: SC/ST seats. 343: Official Language Hindi. 352: National Emergency. 356: President’s Rule. 360: Financial Emergency. 368: Amendment.' },
    ],
  },
  {
    id: 'pv-schedules', category: '12 Schedules', lockerCode: 'VAULT-08', partBadge: 'ALL 12 SCHEDULES',
    title: 'Complete 12 Schedules ("TEARS OF OLD PM")', articlesRange: '1st to 12th Schedule', sealText: 'MASTER CODEX', stars: 3,
    borrowedFrom: 'Originally 8 Schedules (1950); 9th (1951), 10th (1985), 11th & 12th (1992) added',
    scheduleLink: 'Mnemonic: T-E-A-R-S O-F O-L-D P-M',
    historyEra: 'Modern', historyLeafId: 'hl-1946', historyLinkLabel: '1946–49 Constituent Assembly',
    articles: [
      { code: '1st to 6th Schedule (T-E-A-R-S-O)', summary: '1st (T): 28 States & 8 UTs. 2nd (E): Emoluments/Salaries. 3rd (A): Oaths. 4th (R): Rajya Sabha Seats. 5th (S): Scheduled Areas. 6th (O): Tribal Areas in Assam, Meghalaya, Tripura, Mizoram (AMTM).' },
      { code: '7th to 12th Schedule (F-O-L-D-P-M)', summary: '7th (F): 3 Federal Lists (100/61/52). 8th (O): 22 Official Languages. 9th (L): Land Reforms (1st Amend 1951). 10th (D): Anti-Defection (52nd Amend 1985). 11th (P): Panchayats (29 items). 12th (M): Municipalities (18 items).' },
    ],
  },
  {
    id: 'pv-amendments', category: 'Top Amendments', lockerCode: 'VAULT-09', partBadge: 'ARTICLE 368 AMENDMENTS',
    title: 'Top 20 Landmark Amendments (1st–106th)', articlesRange: '1951 to 2023 Amendments', sealText: 'HIGH-YIELD EXAM', stars: 3,
    borrowedFrom: 'South African Constitution (Art 368)',
    scheduleLink: 'Covers 95% of SSC JE / RRB JE / WBPSC Amendment Questions',
    historyEra: 'Modern', historyLeafId: 'hl-1946', historyLinkLabel: 'Constitutional Evolution (1951–2023)',
    articles: [
      { code: '1st (1951), 7th (1956), 36th (1975), 42nd (1976), 44th (1978)', summary: '1st: 9th Sch. 7th: Linguistic States. 36th: Sikkim full state. 42nd (Mini-Constitution): Socialist/Secular/Integrity & 10 Duties. 44th: Property to Art 300A, Armed Rebellion replaced Internal Disturbance.' },
      { code: '52nd (1985), 61st (1989), 69th (1991), 73rd/74th (1992), 86th (2002)', summary: '52nd: Anti-Defection. 61st: Voting age 21→18. 69th: Delhi NCT. 73rd/74th: Local bodies. 86th: Art 21A Right to Education (6–14 yrs).' },
      { code: '91st (2003), 101st (2016), 102nd, 103rd (2019), 104th, 106th (2023)', summary: '91st: 15% Cabinet cap. 101st: GST. 102nd: NCBC (Art 338B). 103rd: 10% EWS. 104th: Ended Anglo-Indian seats. 106th: 33% Women Reservation in LS & State Assemblies.' },
    ],
  },
]

// ============================================================================
// 3. MASTER TOPOGRAPH 3D MAP (TRUE LATITUDE / LONGITUDE GEOREFERENCED)
// ============================================================================
export type TopoCategory =
  | 'All'
  | 'Bird Sanctuaries & Ramsar'
  | 'National Parks & Tigers'
  | 'Rivers & Hydro Dams'
  | 'Mountains & Passes'
  | 'Nuclear, Ports & ISRO'
  | 'UNESCO, Temples & Dances'
  | 'WB JE Special'

export interface GeoStaticPin {
  id: string
  category: Exclude<TopoCategory, 'All'>
  shortLabel: string
  title: string
  state: string
  lat: number
  lng: number
  stars: 1 | 2 | 3
  primaryFact: string
  tributaryOrRange: string
  examHighlight: string
  landscapeType: 'mountain' | 'dam' | 'park' | 'bird' | 'nuclear' | 'temple'
  elevationOrCapacity: string
  riverSystemId?: string
}

export const GEO_STATIC_PINS: GeoStaticPin[] = [
  // 1. BIRD SANCTUARIES & RAMSAR WETLANDS
  { id: 'bs-keoladeo', category: 'Bird Sanctuaries & Ramsar', shortLabel: 'Keoladeo / Bharatpur Bird', title: 'Keoladeo Ghana (Bharatpur) Bird Sanctuary', state: 'Rajasthan', lat: 27.16, lng: 77.52, stars: 3, primaryFact: 'World-famous avifauna sanctuary (UNESCO 1985) and one of India’s 1st Ramsar Sites (1981); winter habitat of Siberian Crane.', tributaryOrRange: 'Confluence of Gambhir & Banganga rivers.', examHighlight: 'Keoladeo (Rajasthan) and Loktak Lake (Manipur) are the ONLY 2 Indian wetlands on the Montreux Record.', landscapeType: 'bird', elevationOrCapacity: '1st Ramsar (1981)', riverSystemId: 'riv-ganga' },
  { id: 'bs-nalsarovar', category: 'Bird Sanctuaries & Ramsar', shortLabel: 'Nal Sarovar & Thol Bird', title: 'Nal Sarovar & Thol Lake Bird Sanctuaries', state: 'Gujarat', lat: 22.78, lng: 72.04, stars: 3, primaryFact: 'Largest wetland bird sanctuary in Gujarat (Ramsar Site 2012), famous for Greater Flamingos and Pelicans.', tributaryOrRange: 'Gujarat also hosts Thol Lake, Khijadiya Bird Sanctuary & Rann of Kutch Flamingo City.', examHighlight: 'SSC JE Repeat: Nal Sarovar Bird Sanctuary is in Gujarat.', landscapeType: 'bird', elevationOrCapacity: 'Ramsar · Flamingos', riverSystemId: 'riv-narmada-tapi' },
  { id: 'bs-chilika', category: 'Bird Sanctuaries & Ramsar', shortLabel: 'Chilika & Nalabana Bird', title: 'Chilika Lagoon & Nalabana Bird Sanctuary', state: 'Odisha', lat: 19.69, lng: 85.32, stars: 3, primaryFact: 'India’s largest brackish water coastal lagoon & 1st Ramsar Site (1981); Nalabana Island at its core is a major bird sanctuary.', tributaryOrRange: 'Fed by Daya & Bhargavi rivers; home of endangered Irrawaddy Dolphins.', examHighlight: 'Removed from Montreux Record in 2002 after successful restoration.', landscapeType: 'bird', elevationOrCapacity: 'Largest Lagoon', riverSystemId: 'riv-peninsular' },
  { id: 'bs-pulicat', category: 'Bird Sanctuaries & Ramsar', shortLabel: 'Pulicat & Nelapattu Bird', title: 'Pulicat Lake & Nelapattu Bird Sanctuary', state: 'Andhra Pradesh / TN Border', lat: 13.58, lng: 80.18, stars: 3, primaryFact: 'India’s 2nd largest brackish water lagoon; hosts the annual Flamingo Festival and Nelapattu Pelicanry.', tributaryOrRange: 'Sriharikota Island (ISRO Launchport) separates Pulicat Lake from Bay of Bengal.', examHighlight: 'Which barrier island separates Pulicat Lake from the Bay of Bengal? Answer: Sriharikota.', landscapeType: 'bird', elevationOrCapacity: '2nd Largest Lagoon', riverSystemId: 'riv-peninsular' },
  { id: 'bs-vedanthangal', category: 'Bird Sanctuaries & Ramsar', shortLabel: 'Vedanthangal & Pt Calimere', title: 'Vedanthangal & Point Calimere Bird Sanctuaries', state: 'Tamil Nadu', lat: 12.54, lng: 79.85, stars: 3, primaryFact: 'Vedanthangal (Chengalpattu) is India’s oldest water-bird sanctuary; Tamil Nadu has the HIGHEST number of Ramsar Sites in India (16+).', tributaryOrRange: 'Point Calimere (Kodiakkarai) & Pichavaram Mangroves lie along the Coromandel coast.', examHighlight: 'Tamil Nadu holds the maximum number of Ramsar sites in India, followed by Uttar Pradesh.', landscapeType: 'bird', elevationOrCapacity: 'Oldest Bird Sanctuary', riverSystemId: 'riv-peninsular' },
  { id: 'bs-ranganathittu', category: 'Bird Sanctuaries & Ramsar', shortLabel: 'Ranganathittu Bird (Cauvery)', title: 'Ranganathittu Bird Sanctuary (Pakshi Kashi)', state: 'Karnataka', lat: 12.42, lng: 76.65, stars: 3, primaryFact: 'Largest bird sanctuary in Karnataka (Ramsar 2022) on 6 islets of the Cauvery River near Srirangapatna.', tributaryOrRange: 'Famous for Painted Storks, Spot-billed Pelicans & Mugger Crocodiles.', examHighlight: 'Designated Karnataka’s first Ramsar Wetland site in 2022.', landscapeType: 'bird', elevationOrCapacity: 'Cauvery Islets', riverSystemId: 'riv-peninsular' },
  { id: 'bs-thattekad', category: 'Bird Sanctuaries & Ramsar', shortLabel: 'Thattekad (Salim Ali) & Vembanad', title: 'Thattekad (Dr. Salim Ali) & Kumarakom Bird Sanctuary', state: 'Kerala', lat: 10.13, lng: 76.68, stars: 3, primaryFact: 'Thattekad (on Periyar River) was called the richest bird habitat in Peninsular India by Dr. Salim Ali.', tributaryOrRange: 'Kumarakom Bird Sanctuary sits on Vembanad Lake (India’s LONGEST lake, 96.5 km).', examHighlight: 'Salim Ali NP = Srinagar (J&K) | Salim Ali Bird Sanctuary = Chorao Island (Goa) | Thattekad = Kerala.', landscapeType: 'bird', elevationOrCapacity: 'Vembanad: 96.5 km', riverSystemId: 'riv-peninsular' },
  { id: 'bs-salim-goa', category: 'Bird Sanctuaries & Ramsar', shortLabel: 'Salim Ali Bird (Chorao, Goa)', title: 'Salim Ali Bird Sanctuary (Chorao Island) & Nanda Lake', state: 'Goa', lat: 15.51, lng: 73.87, stars: 3, primaryFact: 'Estuarine mangrove bird sanctuary on Chorao Island along the Mandovi River in Goa.', tributaryOrRange: 'Mandovi (Dudhsagar Falls) & Zuari are Goa’s lifelines; Nanda Lake is Goa’s Ramsar site.', examHighlight: 'Direct SSC JE Question: Salim Ali Bird Sanctuary is located on Chorao Island, Goa.', landscapeType: 'bird', elevationOrCapacity: 'Mandovi River · Goa' },
  { id: 'bs-sultanpur', category: 'Bird Sanctuaries & Ramsar', shortLabel: 'Sultanpur & Bhindawas Bird', title: 'Sultanpur National Park & Bhindawas Bird Sanctuary', state: 'Haryana', lat: 28.46, lng: 76.89, stars: 3, primaryFact: 'Premier migratory bird wetlands in Gurugram & Jhajjar (Haryana) — both designated Ramsar Sites in 2021.', tributaryOrRange: 'Haryana’s 2 National Parks: Sultanpur (Gurugram) and Kalesar (Yamunanagar).', examHighlight: 'Okhla Bird Sanctuary (Noida) lies nearby on the Yamuna.', landscapeType: 'bird', elevationOrCapacity: 'Haryana Ramsar', riverSystemId: 'riv-ganga' },
  { id: 'bs-nawabganj', category: 'Bird Sanctuaries & Ramsar', shortLabel: 'Nawabganj, Bakhira & Kabartal', title: 'Nawabganj, Bakhira, Patna Bird (UP) & Kabartal (Bihar)', state: 'Uttar Pradesh & Bihar', lat: 26.61, lng: 80.65, stars: 2, primaryFact: 'UP has 10 Ramsar Bird Wetlands (Nawabganj, Bakhira, Sur Sarovar, Saman, Samaspur, Sandi, Haiderpur).', tributaryOrRange: '"Patna Bird Sanctuary" is in Etah district of UP! Bihar hosts Kanwar Lake (Kabartal — Asia’s largest freshwater oxbow lake).', examHighlight: 'Trap Question: Patna Bird Sanctuary is in Etah (UP); Kabartal (Kanwar) Lake is in Begusarai (Bihar).', landscapeType: 'bird', elevationOrCapacity: 'UP: 10 Ramsar Sites', riverSystemId: 'riv-ganga' },
  { id: 'bs-kulik', category: 'Bird Sanctuaries & Ramsar', shortLabel: 'Kulik (Raiganj) Bird Sanctuary', title: 'Raiganj (Kulik) Bird Sanctuary & East Kolkata Wetlands', state: 'West Bengal (Uttar Dinajpur)', lat: 25.62, lng: 88.12, stars: 3, primaryFact: 'Along the Kulik River in Raiganj (Uttar Dinajpur) — Asia’s 2nd largest rookery for Asian Openbill Storks.', tributaryOrRange: 'Other WB Bird Sites: Santragachi Jheel (Howrah), Rasikbil (Cooch Behar) & East Kolkata Wetlands (Ramsar 2002).', examHighlight: 'WBSEDCL/WBPSC: Kulik Bird Sanctuary is in Uttar Dinajpur (Raiganj).', landscapeType: 'bird', elevationOrCapacity: 'Openbill Rookery', riverSystemId: 'riv-ganga' },
  { id: 'bs-wular-harike', category: 'Bird Sanctuaries & Ramsar', shortLabel: 'Wular Lake & Harike Wetland', title: 'Wular Lake (J&K), Harike Wetland (Punjab) & Pong Dam', state: 'J&K & Punjab', lat: 34.33, lng: 74.56, stars: 3, primaryFact: 'Wular Lake (Bandipora J&K on Jhelum) is India’s LARGEST freshwater lake. Harike (Punjab) sits at the Beas–Sutlej confluence.', tributaryOrRange: 'Hokera, Surinsar-Mansar are J&K Ramsar sites; Harike, Kanjli & Ropar are in Punjab; Renuka Wetland (HP) is India’s SMALLEST Ramsar site.', examHighlight: 'Largest Freshwater Lake = Wular (J&K) | Smallest Ramsar Site = Renuka Wetland (HP).', landscapeType: 'bird', elevationOrCapacity: 'Wular: Largest Fresh', riverSystemId: 'riv-indus' },
  { id: 'bs-tsokar', category: 'Bird Sanctuaries & Ramsar', shortLabel: 'Tso Kar, Tso Moriri & Pangong', title: 'Tso Kar, Tso Moriri Wetlands & Pangong Tso', state: 'Ladakh', lat: 33.31, lng: 78.0, stars: 2, primaryFact: 'High-altitude Changthang wetlands in Ladakh; Tso Kar (42nd Ramsar Site) is the primary breeding ground for the Black-Necked Crane.', tributaryOrRange: 'Pangong Tso is a 134-km endorheic brackish lake spanning the LAC.', examHighlight: 'Tso Kar and Tso Moriri are Ladakh’s two Ramsar wetlands.', landscapeType: 'bird', elevationOrCapacity: 'Elev: 4,530 m', riverSystemId: 'riv-indus' },

  // 2. NATIONAL PARKS & TIGER RESERVES
  { id: 'np-hemis', category: 'National Parks & Tigers', shortLabel: 'Hemis (Largest) & Dachigam NP', title: 'Hemis National Park (Ladakh) & Dachigam (J&K)', state: 'Ladakh & J&K', lat: 33.98, lng: 77.42, stars: 3, primaryFact: 'Hemis NP (Ladakh, 4,400 sq km) is India’s LARGEST National Park (Snow Leopards). Dachigam (J&K) is the only home of Hangul (Kashmir Stag).', tributaryOrRange: 'HP National Parks: Great Himalayan NP (UNESCO), Pin Valley (Cold Desert).', examHighlight: 'Largest NP = Hemis (Ladakh) | Smallest NP = South Button (Andaman) | Oldest NP = Jim Corbett (1936).', landscapeType: 'park', elevationOrCapacity: '4,400 sq km · Largest', riverSystemId: 'riv-indus' },
  { id: 'np-corbett', category: 'National Parks & Tigers', shortLabel: 'Jim Corbett (1936) & Nanda Devi', title: 'Jim Corbett, Valley of Flowers, Nanda Devi & Rajaji NPs', state: 'Uttarakhand', lat: 29.53, lng: 78.77, stars: 3, primaryFact: 'Jim Corbett (1936 as Hailey NP) is India’s FIRST National Park and launchpad of Project Tiger (1 April 1973).', tributaryOrRange: 'Ramganga River flows through Corbett; Uttarakhand’s 6 NPs: Corbett, Nanda Devi, Valley of Flowers, Rajaji, Gangotri & Govind Pashu Vihar.', examHighlight: 'Corbett holds the highest tiger density among all Indian Tiger Reserves.', landscapeType: 'park', elevationOrCapacity: 'Est. 1936 · Oldest NP', riverSystemId: 'riv-ganga' },
  { id: 'np-dudhwa', category: 'National Parks & Tigers', shortLabel: 'Dudhwa (UP), Valmiki & Betla', title: 'Dudhwa (UP), Valmiki (Bihar) & Betla (Jharkhand) NPs', state: 'UP, Bihar & Jharkhand', lat: 28.48, lng: 80.65, stars: 3, primaryFact: 'Dudhwa (Lakhimpur Kheri) is UP’s only NP; Valmiki (West Champaran) is Bihar’s only NP; Betla (Palamu) is Jharkhand’s only NP.', tributaryOrRange: 'UP Tiger Reserves: Dudhwa, Pilibhit, Amangarh & Ranipur (Chitrakoot).', examHighlight: 'One-NP States: UP = Dudhwa | Bihar = Valmiki | Jharkhand = Betla.', landscapeType: 'park', elevationOrCapacity: 'Terai Tiger Belt', riverSystemId: 'riv-ganga' },
  { id: 'np-ranthambore', category: 'National Parks & Tigers', shortLabel: 'Ranthambore, Sariska & Desert NP', title: 'Ranthambore, Sariska, Mukundra Hills & Desert National Park', state: 'Rajasthan', lat: 26.01, lng: 76.5, stars: 3, primaryFact: 'Ranthambore, Sariska, Mukundra Hills, Ramgarh Vishdhari & Dholpur-Karauli are in Rajasthan.', tributaryOrRange: 'Desert National Park (Jaisalmer) protects the critically endangered Great Indian Bustard (Godawan).', examHighlight: 'Dholpur-Karauli (Rajasthan) and Veerangana Durgavati (MP) are India’s 54th & 55th Tiger Reserves.', landscapeType: 'park', elevationOrCapacity: '5 Tiger Reserves', riverSystemId: 'riv-ganga' },
  { id: 'np-gir', category: 'National Parks & Tigers', shortLabel: 'Gir (Asiatic Lion) & Marine NP', title: 'Gir National Park, Blackbuck (Velavadar), Vansda & Marine NP', state: 'Gujarat', lat: 21.12, lng: 70.82, stars: 3, primaryFact: 'Gir Forest (Junagadh) is the ONLY natural habitat of the Asiatic Lion in the world.', tributaryOrRange: 'Gujarat’s 4 NPs: Gir, Blackbuck (Velavadar), Vansda, and Marine NP (Gulf of Kutch — 1st Marine NP).', examHighlight: 'Gulf of Kachchh is also India’s LARGEST Biosphere Reserve by area.', landscapeType: 'park', elevationOrCapacity: 'Only Home of Asiatic Lion' },
  { id: 'np-kanha', category: 'National Parks & Tigers', shortLabel: 'Kanha, Bandhavgarh, Panna & Kuno', title: 'Madhya Pradesh "Tiger State" (11 NPs: Kanha, Bandhavgarh, Kuno, Panna)', state: 'Madhya Pradesh', lat: 22.33, lng: 80.61, stars: 3, primaryFact: 'Madhya Pradesh has the HIGHEST number of National Parks (11) and highest Tiger population (785 tigers) in India.', tributaryOrRange: '11 NPs: Kanha, Bandhavgarh, Panna (Ken River), Pench, Satpura, Sanjay, Madhav, Van Vihar, Fossil & Kuno (Project Cheetah).', examHighlight: 'Ken-Betwa River Interlinking passes through Panna Tiger Reserve.', landscapeType: 'park', elevationOrCapacity: '11 NPs · 785 Tigers', riverSystemId: 'riv-narmada-tapi' },
  { id: 'np-tadoba', category: 'National Parks & Tigers', shortLabel: 'Tadoba, Pench & Sanjay Gandhi', title: 'Tadoba-Andhari, Navegaon, Gugamal, Chandoli & Sanjay Gandhi NPs', state: 'Maharashtra', lat: 20.24, lng: 79.36, stars: 2, primaryFact: 'Tadoba-Andhari (Chandrapur) is Maharashtra’s oldest & largest National Park and Tiger Reserve.', tributaryOrRange: 'Maharashtra’s 6 NPs: Tadoba, Gugamal (Melghat), Navegaon, Pench, Chandoli & Sanjay Gandhi (Borivali, Mumbai — Kanheri Caves).', examHighlight: 'Lonar Lake (Buldhana, Maharashtra) is a basaltic meteor impact crater lake and Ramsar Site.', landscapeType: 'park', elevationOrCapacity: '6 NPs in Maharashtra', riverSystemId: 'riv-peninsular' },
  { id: 'np-kaziranga', category: 'National Parks & Tigers', shortLabel: 'Kaziranga, Manas & 7 Assam NPs', title: 'Kaziranga, Manas, Nameri, Orang, Dibru-Saikhowa, Raimona & Dehing Patkai', state: 'Assam', lat: 26.57, lng: 93.17, stars: 3, primaryFact: 'Kaziranga holds 2/3rds of the world’s One-Horned Rhinoceros (UNESCO 1985, alongside Manas).', tributaryOrRange: 'Assam has 7 National Parks: Raimona (Golden Langur, 6th) and Dehing Patkai (7th) were notified in 2021.', examHighlight: 'Orang NP is called "Mini Kaziranga"; Majuli nearby is the world’s largest river island.', landscapeType: 'park', elevationOrCapacity: '7 NPs · Rhino', riverSystemId: 'riv-brahmaputra' },
  { id: 'np-keibul', category: 'National Parks & Tigers', shortLabel: 'Keibul Lamjao (Floating) & Namdapha', title: 'Keibul Lamjao (Loktak Lake, Manipur), Namdapha & Nokrek', state: 'Manipur, Arunachal & Meghalaya', lat: 24.5, lng: 93.82, stars: 3, primaryFact: 'Keibul Lamjao on Loktak Lake (Manipur) is the world’s ONLY Floating National Park (Phumdis biomass & Sangai Dancing Deer).', tributaryOrRange: 'Arunachal: Namdapha & Mouling. Meghalaya: Nokrek (Red Panda) & Balpakram.', examHighlight: 'World’s only Floating National Park: Keibul Lamjao (Manipur).', landscapeType: 'park', elevationOrCapacity: 'Only Floating NP', riverSystemId: 'riv-brahmaputra' },
  { id: 'np-simlipal', category: 'National Parks & Tigers', shortLabel: 'Simlipal, Bhitarkanika & Indravati', title: 'Simlipal, Bhitarkanika (Odisha) & Indravati/Kanger Ghati (CG)', state: 'Odisha & Chhattisgarh', lat: 21.75, lng: 86.33, stars: 3, primaryFact: 'Simlipal (Mayurbhanj — melanistic tigers) and Bhitarkanika (Saltwater Crocodiles) are Odisha’s 2 NPs; Gahirmatha Beach is the Olive Ridley turtle nesting site.', tributaryOrRange: 'Chhattisgarh’s 3 NPs: Indravati (Kutru), Kanger Ghati & Guru Ghasidas (Sanjay).', examHighlight: 'Gahirmatha (Odisha) is the world’s largest mass nesting beach ("Arribada") for Olive Ridley Turtles.', landscapeType: 'park', elevationOrCapacity: 'Olive Ridley & Tigers', riverSystemId: 'riv-peninsular' },
  { id: 'np-papikonda', category: 'National Parks & Tigers', shortLabel: 'Papikonda, Sri Venkateswara & Amrabad', title: 'Papikonda, Sri Venkateswara (AP) & Kasu Brahmananda / Amrabad (TS)', state: 'Andhra Pradesh & Telangana', lat: 17.45, lng: 81.48, stars: 2, primaryFact: 'AP’s 3 NPs: Papikonda (on Godavari), Sri Venkateswara (Tirumala Seshachalam Biosphere — Red Sanders) & Rajiv Gandhi (Rameswaram).', tributaryOrRange: 'Telangana’s 3 NPs: Kasu Brahmananda Reddy (Hyderabad), Mahavir Harina Vanasthali & Mrugavani + Amrabad & Kawal Tiger Reserves.', examHighlight: 'Seshachalam Hills (AP) is a UNESCO Biosphere Reserve famous for endemic Red Sanders.', landscapeType: 'park', elevationOrCapacity: 'Godavari Gorge & Nallamala', riverSystemId: 'riv-peninsular' },
  { id: 'np-bandipur', category: 'National Parks & Tigers', shortLabel: 'Bandipur, Nagarhole & Nilgiri', title: 'Bandipur, Nagarhole (Karnataka), Mudumalai (TN) & Nilgiri Biosphere', state: 'Karnataka & Tamil Nadu', lat: 11.66, lng: 76.62, stars: 3, primaryFact: 'Nilgiri Biosphere Reserve (1986 across TN, KL, KA) is India’s FIRST Biosphere Reserve.', tributaryOrRange: 'Karnataka’s 5 NPs: Bandipur, Nagarhole, Bannerghatta, Kudremukh, Anshi. TN’s 5 NPs: Mudumalai, Mukurthi, Annamalai, Guindy, Gulf of Mannar.', examHighlight: 'Karnataka has the 2nd highest Tiger population (563) and highest Elephant population in India.', landscapeType: 'park', elevationOrCapacity: '1st Biosphere (1986)', riverSystemId: 'riv-peninsular' },
  { id: 'np-silent', category: 'National Parks & Tigers', shortLabel: 'Silent Valley, Periyar & Eravikulam', title: 'Silent Valley, Periyar, Eravikulam & Agasthyamalai', state: 'Kerala', lat: 11.13, lng: 76.43, stars: 3, primaryFact: 'Silent Valley (Palakkad, Kunthipuzha River — Lion-Tailed Macaque); Eravikulam (Munnar — Nilgiri Tahr & Anaimudi peak); Periyar (Idukki).', tributaryOrRange: 'Kerala also has Mathikettan Shola, Anamudi Shola & Pambadum Shola NPs + Agasthyamalai Biosphere.', examHighlight: 'Silent Valley Movement (1973) protected this tropical evergreen rainforest.', landscapeType: 'park', elevationOrCapacity: 'Lion-Tailed Macaque', riverSystemId: 'riv-peninsular' },
  { id: 'np-andaman', category: 'National Parks & Tigers', shortLabel: 'South Button (Smallest) & Andaman NPs', title: 'South Button Island (Smallest NP), Mount Manipur & Campbell Bay', state: 'Andaman & Nicobar Islands', lat: 12.22, lng: 93.02, stars: 3, primaryFact: 'Andaman & Nicobar hosts 9 NPs including South Button Island (India’s SMALLEST NP, 0.03 sq km), Mount Manipur (formerly Mt Harriet) & Campbell Bay.', tributaryOrRange: 'Great Nicobar is India’s southernmost UNESCO Biosphere Reserve near Indira Point (6°45\'N).', examHighlight: 'Mount Harriet NP was renamed Mount Manipur NP.', landscapeType: 'park', elevationOrCapacity: '9 NPs · Smallest NP' },

  // 3. RIVERS, CONFLUENCES & HYDRO DAMS
  { id: 'dam-tehri', category: 'Rivers & Hydro Dams', shortLabel: 'Tehri Dam (260.5m) & 5 Prayags', title: 'Tehri Hydro Dam (Highest in India) & Panch Prayag Confluences', state: 'Uttarakhand', lat: 30.37, lng: 78.48, stars: 3, primaryFact: 'Tehri Dam (260.5 m rock & earth-fill dam, 2,400 MW) at Bhagirathi–Bhilangna confluence is the HIGHEST dam in India.', tributaryOrRange: '5 Prayags on Alaknanda: Vishnu (+Dhauliganga), Nanda (+Nandakini), Karna (+Pindar), Rudra (+Mandakini), Devprayag (+Bhagirathi = Ganga).', examHighlight: 'THDC Tehri = 1,000 MW Stage-I + 1,000 MW Pumped Storage + 400 MW Koteshwar.', landscapeType: 'dam', elevationOrCapacity: '260.5 m (Highest) · 2,400 MW', riverSystemId: 'riv-ganga' },
  { id: 'dam-bhakra', category: 'Rivers & Hydro Dams', shortLabel: 'Bhakra (226m) & Chenab Dams', title: 'Bhakra Nangal, Nathpa Jhakri (Sutlej) & Salal/Baglihar/Dulhasti (Chenab)', state: 'HP, Punjab & J&K', lat: 31.41, lng: 76.43, stars: 3, primaryFact: 'Bhakra Nangal (226 m highest straight gravity concrete dam, 1,325 MW; Gobind Sagar reservoir) & Nathpa Jhakri (1,500 MW) sit on Sutlej.', tributaryOrRange: 'Chenab Dams: Salal, Baglihar, Dulhasti, Ratle & Pakal Dul (plus 359 m Chenab Arch Rail Bridge). Jhelum: Uri & Tulbul. Beas: Pong & Pandoh.', examHighlight: 'Chenab Rail Bridge (Reasi, J&K) is the world’s highest railway bridge.', landscapeType: 'dam', elevationOrCapacity: 'Bhakra: 226 m', riverSystemId: 'riv-indus' },
  { id: 'dam-rihand', category: 'Rivers & Hydro Dams', shortLabel: 'Rihand & Chambal 4 Dams', title: 'Rihand Dam (Govind Ballabh Pant Sagar) & Chambal Valley Dams', state: 'Uttar Pradesh & MP', lat: 24.2, lng: 83.0, stars: 3, primaryFact: 'Rihand Dam (Sonbhadra UP on Rihand tributary of Son) forms Govind Ballabh Pant Sagar — India’s LARGEST artificial lake by volume.', tributaryOrRange: 'Chambal 4 Dams: Gandhi Sagar (MP), Rana Pratap Sagar, Jawahar Sagar & Kota Barrage (RJ). Betwa Dams: Matatila & Rajghat.', examHighlight: 'National Waterway-1 (Prayagraj to Haldia, 1,620 km on Ganga) is India’s longest waterway.', landscapeType: 'dam', elevationOrCapacity: 'Largest Reservoir', riverSystemId: 'riv-ganga' },
  { id: 'dam-sardar', category: 'Rivers & Hydro Dams', shortLabel: 'Sardar Sarovar (1450 MW) & Ukai', title: 'Sardar Sarovar (Narmada), Indira Sagar & Ukai Dam (Tapi)', state: 'Gujarat & MP', lat: 21.83, lng: 73.75, stars: 3, primaryFact: 'Sardar Sarovar Dam (Navagam, GJ — 1,450 MW) and Indira Sagar (MP) sit on the West-flowing Narmada River.', tributaryOrRange: 'Tapi: Ukai & Kakrapar. Mahi: Bajaj Sagar & Kadana — Mahi cuts the Tropic of Cancer TWICE.', examHighlight: 'Statue of Unity (182 m) stands downstream of Sardar Sarovar Dam.', landscapeType: 'dam', elevationOrCapacity: '1,450 MW · Narmada', riverSystemId: 'riv-narmada-tapi' },
  { id: 'dam-hirakud', category: 'Rivers & Hydro Dams', shortLabel: 'Hirakud Dam (25.8 km, Mahanadi)', title: 'Hirakud Dam — Longest Dam in India (Mahanadi River)', state: 'Odisha', lat: 21.52, lng: 83.87, stars: 3, primaryFact: 'Longest dam in India/world (4.8 km main, 25.8 km total with dykes) across the Mahanadi River near Sambalpur.', tributaryOrRange: 'Mahanadi rises in Sihawa hills (Chhattisgarh); tributaries: Seonath, Hasdeo, Mand, Ib, Ong, Tel.', examHighlight: 'Supplies ~347.5 MW hydro power to Rourkela Steel Plant and Hirakud grid.', landscapeType: 'dam', elevationOrCapacity: '25.8 km (Longest)', riverSystemId: 'riv-peninsular' },
  { id: 'dam-koyna', category: 'Rivers & Hydro Dams', shortLabel: 'Koyna (1960 MW) & Kunchikal Falls', title: 'Koyna Hydro Project (1,960 MW), Jayakwadi & Kunchikal/Jog Falls', state: 'Maharashtra & Karnataka', lat: 17.4, lng: 73.75, stars: 3, primaryFact: 'Koyna Hydroelectric Project (Satara, MH on Koyna tributary of Krishna) has 1,960 MW capacity.', tributaryOrRange: 'Jayakwadi Dam (Nath Sagar) is on Godavari in MH. Karnataka Waterfalls: Kunchikal Falls (455 m on Varahi River, Shimoga KA) is India’s HIGHEST waterfall; Jog Falls (253 m) is on Sharavathi River.', examHighlight: 'Almatti Dam is on Krishna in KA; Tungabhadra Dam is at Hospet.', landscapeType: 'dam', elevationOrCapacity: 'Koyna: 1,960 MW', riverSystemId: 'riv-peninsular' },
  { id: 'dam-nagarjuna', category: 'Rivers & Hydro Dams', shortLabel: 'Nagarjuna Sagar & Srisailam', title: 'Nagarjuna Sagar, Srisailam (Krishna), Polavaram & Kaleshwaram', state: 'Telangana & AP', lat: 16.57, lng: 79.31, stars: 3, primaryFact: 'Nagarjuna Sagar (124 m — tallest masonry dam) and Srisailam (1,670 MW hydro) span the Krishna River.', tributaryOrRange: 'Godavari Projects: Kaleshwaram, Pochampad (Sriram Sagar) & Polavaram (AP).', examHighlight: 'Nagarjuna Sagar Srisailam is India’s largest Tiger Reserve by area.', landscapeType: 'dam', elevationOrCapacity: 'Srisailam: 1,670 MW', riverSystemId: 'riv-peninsular' },
  { id: 'dam-idukki', category: 'Rivers & Hydro Dams', shortLabel: 'Idukki Arch Dam & Mettur/Kallanai', title: 'Idukki Arch Dam (Periyar) & Mettur, KRS, Kallanai (Cauvery)', state: 'Kerala & Tamil Nadu', lat: 9.84, lng: 76.97, stars: 3, primaryFact: 'Idukki Dam (168.9 m across Periyar River in Kerala, 780 MW) is Asia’s highest double-curvature parabolic ARCH dam.', tributaryOrRange: 'Cauvery: KRS (KA), Shivanasamudra (1902), Mettur Dam (TN) & Kallanai (Grand Anicut — oldest functional dam by Karikala Chola).', examHighlight: '1st Hydro in India: Sidrapong (Darjeeling, 1897), followed by Shivanasamudra (1902).', landscapeType: 'dam', elevationOrCapacity: 'Idukki: Arch Dam', riverSystemId: 'riv-peninsular' },
  { id: 'dam-subansiri', category: 'Rivers & Hydro Dams', shortLabel: 'Subansiri (2000 MW) & Dhola-Sadiya', title: 'Lower Subansiri Hydro (2,000 MW), Majuli Island & Bhupen Hazarika Bridge', state: 'Arunachal & Assam', lat: 27.55, lng: 94.25, stars: 3, primaryFact: 'Lower Subansiri (2,000 MW, 8×250 MW at Gerukamukh on Subansiri — largest tributary of Brahmaputra) is India’s largest hydro project under commissioning.', tributaryOrRange: 'Bhupen Hazarika Setu (Dhola-Sadiya, 9.15 km on Lohit River) is India’s longest river bridge; Bogibeel (4.94 km) is India’s longest rail-cum-road bridge.', examHighlight: 'National Waterway-2 (NW-2: Sadiya to Dhubri, 891 km) runs on the Brahmaputra River.', landscapeType: 'dam', elevationOrCapacity: 'Subansiri: 2,000 MW', riverSystemId: 'riv-brahmaputra' },

  // 4. MOUNTAIN PEAKS, RANGES & PASSES
  { id: 'mt-k2', category: 'Mountains & Passes', shortLabel: 'K2 (8611m), Siachen & Zoji La', title: 'Karakoram (K2, Siachen), Zoji La, Banihal & Khardung La Passes', state: 'Ladakh & J&K', lat: 35.88, lng: 76.51, stars: 3, primaryFact: 'K2 / Godwin-Austen (8,611 m) is the 2nd highest peak in the world; Siachen Glacier (76 km, Nubra Valley) is the highest battleground.', tributaryOrRange: 'Passes: Zoji La (Srinagar–Leh NH-1), Banihal (Jammu–Srinagar, Jawahar Tunnel), Pir Panjal, Burzil, Khardung La.', examHighlight: 'Order N→S: Karakoram → Ladakh → Zanskar → Pir Panjal → Dhauladhar → Shiwalik.', landscapeType: 'mountain', elevationOrCapacity: 'K2: 8,611 m', riverSystemId: 'riv-indus' },
  { id: 'mt-shipki', category: 'Mountains & Passes', shortLabel: 'Shipki La, Rohtang & Lipulekh', title: 'Shipki La, Rohtang (Atal Tunnel), Bara Lacha La & Nanda Devi (7,816m)', state: 'HP & Uttarakhand', lat: 31.85, lng: 78.75, stars: 3, primaryFact: 'Sutlej enters India via Shipki La (HP); Chenab rises near Bara Lacha La; Atal Tunnel (9.02 km) is under Rohtang Pass.', tributaryOrRange: 'Uttarakhand Passes: Mana, Niti & Lipulekh. Highest Peak wholly in India: Nanda Devi (7,816 m), followed by Kamet (7,756 m).', examHighlight: 'Shipki La/Rohtang/Bara Lacha La = HP | Mana/Niti/Lipulekh = Uttarakhand.', landscapeType: 'mountain', elevationOrCapacity: 'Nanda Devi: 7,816 m', riverSystemId: 'riv-indus' },
  { id: 'mt-kanchenjunga', category: 'Mountains & Passes', shortLabel: 'Kanchenjunga (8586m) & Nathu La', title: 'Kanchenjunga Peak, Nathu La & Jelep La Passes', state: 'Sikkim', lat: 27.7, lng: 88.14, stars: 3, primaryFact: 'Kanchenjunga (8,586 m) is the highest peak in undisputed Indian territory & India’s ONLY Mixed UNESCO World Heritage Site.', tributaryOrRange: 'Sikkim Passes: Nathu La & Jelep La (Teesta River rises from Zemu Glacier).', examHighlight: 'Trick: "Nathuram went to Jail in Sikkim" → Nathu La & Jelep La.', landscapeType: 'mountain', elevationOrCapacity: '8,586 m · Sikkim', riverSystemId: 'riv-brahmaputra' },
  { id: 'mt-bomdila', category: 'Mountains & Passes', shortLabel: 'Bomdi La, Diphu & Garo-Khasi', title: 'Bomdi La, Yangyap, Diphu Passes & Garo–Khasi–Jaintia Hills', state: 'Arunachal, Nagaland & Meghalaya', lat: 27.55, lng: 92.4, stars: 3, primaryFact: 'Arunachal Passes: Bomdi La, Dihang/Yangyap (Brahmaputra entry) & Diphu (India-China-Myanmar tri-junction).', tributaryOrRange: 'Meghalaya Plateau (Garo, Khasi Mawsynram, Jaintia — separated from Chota Nagpur by Malda Gap): Shillong Peak (1,965 m) & Nokrek.', examHighlight: 'Purvanchal Peaks: Namcha Barwa (7,782 m), Saramati (Nagaland), Blue Mountain / Phawngpui (Mizoram).', landscapeType: 'mountain', elevationOrCapacity: 'Yangyap: Siang Entry', riverSystemId: 'riv-brahmaputra' },
  { id: 'mt-gurushikhar', category: 'Mountains & Passes', shortLabel: 'Guru Shikhar (1722m, Aravalli)', title: 'Aravalli Range — Guru Shikhar (Mt. Abu) & Dilwara Temples', state: 'Rajasthan', lat: 24.65, lng: 72.78, stars: 3, primaryFact: 'Aravalli is the OLDEST fold mountain range in the world (Pre-Cambrian), now a residual/relict mountain.', tributaryOrRange: 'Highest Peak: Guru Shikhar (1,722 m) in Mount Abu (Dilwara Jain Temples). Luni & Banas rivers rise here.', examHighlight: 'Raisina Hill (Rashtrapati Bhavan, Delhi) is the northernmost tip of the Aravalli Range.', landscapeType: 'mountain', elevationOrCapacity: '1,722 m · Aravalli' },
  { id: 'mt-dhupgarh', category: 'Mountains & Passes', shortLabel: 'Dhupgarh (1350m) & Amarkantak', title: 'Satpura (Dhupgarh), Maikal (Amarkantak) & Chota Nagpur (Parasnath)', state: 'MP & Jharkhand', lat: 22.45, lng: 78.37, stars: 3, primaryFact: 'Satpura highest peak: Dhupgarh (1,350 m, Mahadeo Hills near Pachmarhi). Maikal highest: Amarkantak (1,048 m).', tributaryOrRange: 'Vindhya highest: Sadbhawna Shikhar (Goodwill Peak, 752 m). Chota Nagpur highest: Parasnath (1,365 m, Giridih JH).', examHighlight: 'Narmada & Tapi flow West through fault Rift Valleys flanking the Satpura block mountain.', landscapeType: 'mountain', elevationOrCapacity: 'Dhupgarh: 1,350 m', riverSystemId: 'riv-narmada-tapi' },
  { id: 'mt-anaimudi', category: 'Mountains & Passes', shortLabel: 'Anaimudi (2695m) & Doddabetta', title: 'Anaimudi (Highest in South India), Doddabetta (Nilgiris) & Ghat Passes', state: 'Kerala, TN & MH', lat: 10.17, lng: 77.06, stars: 3, primaryFact: 'Anaimudi (2,695 m, Annamalai Hills, Kerala) is the HIGHEST peak of Peninsular/South India and the Western Ghats.', tributaryOrRange: 'Nilgiris highest: Doddabetta (2,637 m). Passes N→S: Thal Ghat (Mumbai–Nashik), Bhor Ghat (Mumbai–Pune), Palghat Gap (Coimbatore–Kochi), Shencottah Gap.', examHighlight: 'MH highest: Kalsubai (1,646 m) | KA highest: Mullayanagiri (1,930 m) | Eastern Ghats highest: Jindhagada (1,690 m, AP).', landscapeType: 'mountain', elevationOrCapacity: 'Anaimudi: 2,695 m', riverSystemId: 'riv-peninsular' },
  { id: 'mt-jindhagada', category: 'Mountains & Passes', shortLabel: 'Jindhagada (1690m) & Mahendragiri', title: 'Eastern Ghats Peaks: Jindhagada (Arma Konda) & Mahendragiri', state: 'Andhra Pradesh & Odisha', lat: 18.23, lng: 82.72, stars: 2, primaryFact: 'Jindhagada / Arma Konda (1,690 m in Araku Valley, Visakhapatnam AP) is the highest peak of the Eastern Ghats, followed by Mahendragiri (1,501 m, Gajapati Odisha).', tributaryOrRange: 'Eastern Ghats hills N→S: Maliya, Madugula Konda, Nallamala, Velikonda, Palkonda, Javadi, Shevaroy.', examHighlight: 'Andaman highest peak: Saddle Peak (732 m, North Andaman); Lakshadweep/Andaman separated by 10° Channel (Andaman–Nicobar).', landscapeType: 'mountain', elevationOrCapacity: '1,690 m · Eastern Ghats', riverSystemId: 'riv-peninsular' },

  // 5. NUCLEAR PLANTS, MAJOR PORTS & ISRO
  { id: 'nuc-tarapur', category: 'Nuclear, Ports & ISRO', shortLabel: 'Tarapur (1st Nuclear) & JNPT Port', title: 'Tarapur Atomic Power Station (1969), BARC Trombay & Mumbai/JNPT Ports', state: 'Maharashtra', lat: 19.83, lng: 72.66, stars: 3, primaryFact: 'Tarapur (Maharashtra — 28 Oct 1969) is India’s FIRST commercial Nuclear Power Station. BARC Trombay built Asia’s 1st reactor "Apsara" (1956).', tributaryOrRange: 'Mumbai Port is largest natural port; JNPT (Nhava Sheva) is largest container port; Vadhavan (MH) is the new mega port.', examHighlight: '7 Operating Nuclear Plants: Tarapur (MH), Rawatbhata (RJ), Kalpakkam (TN), Kudankulam (TN), Narora (UP), Kakrapar (GJ), Kaiga (KA).', landscapeType: 'nuclear', elevationOrCapacity: '1st Nuclear (1969)' },
  { id: 'nuc-kudankulam', category: 'Nuclear, Ports & ISRO', shortLabel: 'Kudankulam (2000 MW) & Kalpakkam', title: 'Kudankulam (Largest Nuclear), Kalpakkam (MAPS/PFBR) & TN 3 Ports', state: 'Tamil Nadu', lat: 8.17, lng: 77.71, stars: 3, primaryFact: 'Kudankulam (Tirunelveli, TN — VVER-1000 with Russia) is India’s LARGEST Nuclear Power Station (2,000+ MW).', tributaryOrRange: 'Kalpakkam (MAPS) houses "Kamini" (U-233 reactor) & 500 MW Prototype Fast Breeder Reactor (PFBR). TN’s 3 Major Ports: Chennai (oldest artificial), Ennore/Kamarajar (1st corporatised) & Tuticorin.', examHighlight: 'Kudankulam = Largest Nuclear Plant | Kalpakkam = Indigenous Fast Breeder.', landscapeType: 'nuclear', elevationOrCapacity: '2,000+ MW (Largest)' },
  { id: 'nuc-rawatbhata', category: 'Nuclear, Ports & ISRO', shortLabel: 'Rawatbhata (RJ) & Narora (UP)', title: 'Rawatbhata (Rajasthan) & Narora (Uttar Pradesh) Nuclear Stations', state: 'Rajasthan & UP', lat: 24.87, lng: 75.59, stars: 3, primaryFact: 'Rawatbhata (RAPS, Chittorgarh RJ, 1973 with Canada) and Narora (NAPS, Bulandshahr UP on Ganga).', tributaryOrRange: 'Pokhran (Jaisalmer RJ): Smiling Buddha (18 May 1974) & Operation Shakti (11 & 13 May 1998).', examHighlight: 'Gorakhpur Nuclear Power Plant is under construction in Fatehabad, Haryana.', landscapeType: 'nuclear', elevationOrCapacity: 'RAPS & NAPS', riverSystemId: 'riv-ganga' },
  { id: 'nuc-kakrapar', category: 'Nuclear, Ports & ISRO', shortLabel: 'Kakrapar, Kaiga & Kandla Port', title: 'Kakrapar (GJ), Kaiga (KA) & Kandla/Mundra/Mormugao/Mangalore Ports', state: 'Gujarat, Goa & Karnataka', lat: 21.24, lng: 73.35, stars: 3, primaryFact: 'Kakrapar (Surat GJ on Tapi) commissioned India’s 1st indigenous 700 MW PHWR; Kaiga (KA) held the 962-day continuous run record.', tributaryOrRange: 'Kandla (Deendayal Port, GJ) is a TIDAL port & 1st SEZ; Mundra is largest private port; Mormugao (Goa on Zuari) exports iron ore; New Mangalore (KA) exports Kudremukh iron ore.', examHighlight: 'Uranium Mines: Jaduguda (Jharkhand — oldest) & Tummalapalle (AP — largest reserve). Thorium: Monazite sands of Kerala.', landscapeType: 'nuclear', elevationOrCapacity: '700 MW PHWR · Kandla', riverSystemId: 'riv-narmada-tapi' },
  { id: 'isro-sriharikota', category: 'Nuclear, Ports & ISRO', shortLabel: 'ISRO Sriharikota & Vizag Port', title: 'ISRO Satish Dhawan Space Centre (Sriharikota), Kalam Island & Vizag Port', state: 'Andhra Pradesh & Odisha', lat: 13.72, lng: 80.23, stars: 3, primaryFact: 'Satish Dhawan Space Centre (SHAR, Sriharikota AP) is ISRO’s orbital launchport (Chandrayaan-3 landed 23 Aug 2023 — National Space Day).', tributaryOrRange: 'ISRO HQ: Bengaluru (est. 15 Aug 1969) | VSSC: Thiruvananthapuram | DRDO Missile Range: Abdul Kalam Island (Wheeler Island, Odisha).', examHighlight: 'Visakhapatnam (AP) is India’s DEEPEST landlocked natural port; Paradip (Odisha) exports iron ore to Japan.', landscapeType: 'nuclear', elevationOrCapacity: 'ISRO SHAR · Vizag' },

  // 6. UNESCO HERITAGE, TEMPLES, CAVES & DANCES
  { id: 'unesco-ajanta', category: 'UNESCO, Temples & Dances', shortLabel: 'Ajanta, Ellora & Elephanta Caves', title: 'Ajanta (Buddhist), Ellora (Kailasa Temple) & Elephanta Caves', state: 'Maharashtra', lat: 20.55, lng: 75.7, stars: 3, primaryFact: 'Ajanta (29 Buddhist caves) and Ellora (34 caves: Buddhist, Hindu, Jain) were among India’s 1st UNESCO sites (1983).', tributaryOrRange: 'Cave 16 of Ellora (Kailasa Temple, on ₹20 note) was carved top-down by Rashtrakuta King Krishna I.', examHighlight: 'RBI Notes: ₹10 Konark | ₹20 Ellora | ₹50 Hampi | ₹100 Rani ki Vav | ₹200 Sanchi | ₹500 Red Fort.', landscapeType: 'temple', elevationOrCapacity: '1st UNESCO (1983)' },
  { id: 'unesco-ranikivav', category: 'UNESCO, Temples & Dances', shortLabel: 'Rani ki Vav, Modhera & Somnath', title: 'Rani ki Vav (Patan), Modhera Sun Temple, Dwarkadhish & Somnath', state: 'Gujarat', lat: 23.85, lng: 72.1, stars: 3, primaryFact: 'Rani ki Vav (Patan GJ on Saraswati River — Maru-Gurjara 7-level stepwell built by Queen Udayamati of Solanki/Chalukya dynasty; on ₹100 note) is a UNESCO site.', tributaryOrRange: 'Modhera Sun Temple (built by Bhima I Solanki — India’s 1st 24×7 solar-powered village), Historic City of Ahmedabad (1st UNESCO Urban City in India, 2017) & Dholavira (40th UNESCO).', examHighlight: 'Which Indian city was the 1st to be declared a UNESCO World Heritage City? Answer: Ahmedabad (2017), followed by Jaipur (2019).', landscapeType: 'temple', elevationOrCapacity: '₹100 Note Motif' },
  { id: 'unesco-khajuraho', category: 'UNESCO, Temples & Dances', shortLabel: 'Khajuraho, Sanchi & Bhimbetka', title: 'Khajuraho Temples (Chandela), Sanchi Stupa (Ashoka) & Bhimbetka', state: 'Madhya Pradesh', lat: 24.85, lng: 79.92, stars: 3, primaryFact: 'Khajuraho (Kandariya Mahadeva — Nagara style) was built by the Chandela Dynasty (950–1050 CE).', tributaryOrRange: 'Sanchi Stupa (Ashoka, ₹200 note) and Bhimbetka Paleolithic rock shelters (discovered by V.S. Wakankar) are MP UNESCO sites.', examHighlight: 'Kandariya Mahadeva Temple at Khajuraho is dedicated to Lord Shiva.', landscapeType: 'temple', elevationOrCapacity: 'Chandela Dynasty' },
  { id: 'unesco-konark', category: 'UNESCO, Temples & Dances', shortLabel: 'Konark Sun Temple & Odissi', title: 'Konark Sun Temple (Black Pagoda), Jagannath Puri & Odissi/Chhau', state: 'Odisha', lat: 19.88, lng: 86.09, stars: 3, primaryFact: 'Konark Sun Temple ("Black Pagoda", ₹10 note) was built in the 13th century by King Narasimhadeva I (Eastern Ganga Dynasty).', tributaryOrRange: 'Jagannath Puri ("White Pagoda", Anantavarman Chodaganga) & Lingaraja (Bhubaneswar) complete the Kalinga Golden Triangle.', examHighlight: 'Odissi Dance (Kelucharan Mohapatra) + Mayurbhanj Chhau; Festivals: Raja Parba, Nuakhai.', landscapeType: 'temple', elevationOrCapacity: 'Narasimhadeva I' },
  { id: 'unesco-hampi', category: 'UNESCO, Temples & Dances', shortLabel: 'Hampi, Pattadakal & Hoysala (42nd)', title: 'Hampi (Vijayanagara), Pattadakal, Hoysala (42nd) & Ramappa (39th)', state: 'Karnataka & Telangana', lat: 15.33, lng: 76.46, stars: 3, primaryFact: 'Hampi (Tungabhadra River, ₹50 note); Hoysala Sacred Ensembles (Belur, Halebidu, Somanathapura) became the 42nd UNESCO Site in 2023; Ramappa Temple (Telangana) is the 39th.', tributaryOrRange: 'Pattadakal (Chalukya Virupaksha Temple) & Shravanabelagola (57-ft Bahubali statue).', examHighlight: '39th UNESCO = Ramappa (TS) | 40th = Dholavira (GJ) | 41st = Santiniketan (WB) | 42nd = Hoysala (KA) | 43rd = Moidams (Assam, 2024).', landscapeType: 'temple', elevationOrCapacity: 'Hoysala: 42nd UNESCO' },
  { id: 'unesco-thanjavur', category: 'UNESCO, Temples & Dances', shortLabel: 'Brihadeeswarar & 8 Classical Dances', title: 'Great Living Chola Temples (Thanjavur), Mahabalipuram & 8 Classical Dances', state: 'Tamil Nadu, Kerala & AP', lat: 10.78, lng: 79.13, stars: 3, primaryFact: 'Chola Temples: Brihadeeswarar at Thanjavur (Rajaraja I), Gangaikondacholapuram (Rajendra I) & Airavatesvara (Rajaraja II). Mahabalipuram Shore Temple was built by Pallava King Narasimhavarman I.', tributaryOrRange: '8 Classical Dances: Bharatanatyam (TN), Kathak (UP), Kathakali & Mohiniyattam (Kerala), Kuchipudi (AP), Odissi (Odisha), Manipuri (Manipur), Sattriya (Assam).', examHighlight: 'Sattriya (introduced by Srimanta Sankardev in Assam) was recognized as the 8th Classical Dance in 2000.', landscapeType: 'temple', elevationOrCapacity: '8 Classical Dances' },
  { id: 'unesco-moidams', category: 'UNESCO, Temples & Dances', shortLabel: 'Charaideo Moidams (43rd) & Bihu', title: 'Moidams of Ahom Dynasty (43rd UNESCO Site 2024), Kamakhya & NE Festivals', state: 'Assam & North-East', lat: 26.99, lng: 94.87, stars: 3, primaryFact: 'Charaideo Moidams (royal mound-burial system of the Ahom Dynasty in Assam) became India’s 43rd UNESCO World Heritage Site in July 2024!', tributaryOrRange: 'Kamakhya Temple (Guwahati) hosts Ambubachi Mela. NE Festivals: Bihu (Assam), Hornbill (Nagaland Dec 1–10), Wangala (Meghalaya), Sangai & Lai Haraoba (Manipur), Chapchar Kut (Mizoram), Losoong (Sikkim), Kharchi Puja (Tripura).', examHighlight: '43rd UNESCO Site of India (2024): Moidams of Charaideo, Assam.', landscapeType: 'temple', elevationOrCapacity: '43rd UNESCO (2024)', riverSystemId: 'riv-brahmaputra' },

  // 7. WEST BENGAL JE SPECIAL (WBSEDCL / WBSETCL / WBPSC)
  { id: 'wb-purulia', category: 'WB JE Special', shortLabel: 'Purulia Pumped Storage (900 MW)', title: 'Purulia Pumped Storage Project (PPSP — 900 MW, Ayodhya Hills)', state: 'West Bengal (Purulia — WBSEDCL Core)', lat: 23.19, lng: 86.09, stars: 3, primaryFact: 'WBSEDCL’s flagship 900 MW (4 × 225 MW reversible Francis turbines) underground pumped-storage hydro station in Ayodhya Hills (Bagmundi, Purulia).', tributaryOrRange: 'Turga Pumped Storage (1,000 MW) is also planned in Ayodhya Hills (Highest peak: Gorgaburu 677 m). Purulia Chhau is on the UNESCO Intangible Heritage list.', examHighlight: 'WBSEDCL JE Core: Purulia PSP capacity = 900 MW (4 × 225 MW).', landscapeType: 'dam', elevationOrCapacity: '900 MW (4×225 MW)', riverSystemId: 'riv-ganga' },
  { id: 'wb-dvc', category: 'WB JE Special', shortLabel: 'DVC (4 Dams) & Mejia (2340 MW)', title: 'Damodar Valley Corporation (DVC 1948), Maithon/Panchet & Mejia Thermal', state: 'West Bengal & Jharkhand Border', lat: 23.78, lng: 86.81, stars: 3, primaryFact: 'DVC (est. 7 July 1948, HQ Kolkata on US TVA model): 4 Dams — Tilaiya & Maithon (Underground Hydro) on Barakar; Konar on Konar; Panchet on Damodar.', tributaryOrRange: 'Mejia Thermal (Bankura — 2,340 MW) is the LARGEST thermal station in WB; Bakreswar (1,050 MW, Birbhum), Santaldih (Purulia) & Durgapur.', examHighlight: 'Raniganj Coalfield (1774) is the oldest coalfield in India; Massanjore (Canada) Dam is on Mayurakshi River.', landscapeType: 'dam', elevationOrCapacity: 'Mejia: 2,340 MW', riverSystemId: 'riv-ganga' },
  { id: 'wb-farakka', category: 'WB JE Special', shortLabel: 'Farakka Barrage & NTPC (2100 MW)', title: 'Farakka Barrage (1975), Farakka NTPC (2,100 MW) & Sagardighi (1,600 MW)', state: 'West Bengal (Murshidabad)', lat: 24.8, lng: 87.93, stars: 3, primaryFact: 'Farakka Barrage (1975, 2.24 km, 109 bays) diverts 40,000 cusecs into the 38.38 km Feeder Canal to flush the Bhagirathi-Hooghly river.', tributaryOrRange: 'Farakka NTPC (2,100 MW) & Sagardighi WBPDCL (1,600 MW + 660 MW Unit-5) power the North-South WB grid.', examHighlight: 'Ganga splits below Farakka at Giria into Bhagirathi-Hooghly (WB) and Padma (Bangladesh).', landscapeType: 'dam', elevationOrCapacity: 'Farakka: 2,100 MW', riverSystemId: 'riv-ganga' },
  { id: 'wb-kolaghat', category: 'WB JE Special', shortLabel: 'Kolaghat, Haldia & Sundarbans', title: 'Kolaghat Thermal (1,260 MW), Bandel, Haldia Dock & Sundarbans Ramsar Delta', state: 'West Bengal (Medinipur & South 24 Pgs)', lat: 22.42, lng: 87.87, stars: 3, primaryFact: 'Kolaghat Thermal (WBPDCL 1,260 MW on Rupnarayan River); Sundarbans (4,230 sq km) is India’s LARGEST Ramsar Wetland, UNESCO Site (1987) & Tiger Reserve.', tributaryOrRange: 'CESC (est. 1899) operates Budge Budge (750 MW) & Southern; WBPDCL operates Bandel (Hooghly).', examHighlight: 'Kolkata Durga Puja (2021) is Asia’s first festival inscribed on UNESCO’s Intangible Cultural Heritage list.', landscapeType: 'park', elevationOrCapacity: 'Sundarbans: 4,230 km²', riverSystemId: 'riv-ganga' },
  { id: 'wb-sandakphu', category: 'WB JE Special', shortLabel: 'Sandakphu (3636m), Jaldapara & Rammam', title: 'North Bengal JE Vault: Sandakphu (3,636m), Rammam/Jaldhaka Hydro & 5 Parks', state: 'West Bengal (Darjeeling, Kalimpong, Alipurduar)', lat: 27.1, lng: 88.0, stars: 3, primaryFact: 'Sandakphu (3,636 m, Singalila Ridge) is the HIGHEST peak of West Bengal (2nd: Falut 3,600 m).', tributaryOrRange: 'North WB Hydro: Sidrapong (1897 — 1st in India), Jaldhaka (44 MW), Rammam Stage-II (51 MW) & Teesta Low Dam (TLDP III & IV). 5 North WB NPs: Singalila, Neora Valley, Gorumara, Jaldapara (Torsa River — Rhino) & Buxa.', examHighlight: 'Santiniketan (Birbhum, Rabindranath Tagore) became India’s 41st UNESCO World Heritage Site in 2023!', landscapeType: 'mountain', elevationOrCapacity: 'Sandakphu: 3,636 m', riverSystemId: 'riv-brahmaputra' },
]

// ============================================================================
// 5. NON-DESTRUCTIVE CURRICULUM & LIBRARY AUTO-MERGER
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
  const merged = MASTER_JE_SYLLABUS.map((masterSubj) => ({
    ...masterSubj,
    units: masterSubj.units.map((u) => ({
      ...u,
      done: doneIds.has(u.id) || doneNames.has(u.name.trim().toLowerCase()) || Array.from(doneNames).some((dn) => dn.length > 5 && u.name.toLowerCase().includes(dn)),
    })),
  }))
  const masterIds = new Set(MASTER_JE_SYLLABUS.map((s) => s.id))
  for (const customSubj of existing) {
    if (customSubj?.id && !masterIds.has(customSubj.id) && customSubj.units?.length > 10) {
      merged.push(customSubj)
    }
  }
  return merged
}

function mergeLibraryWithMaster(existing: Folder[] | null | undefined): Folder[] {
  if (!Array.isArray(existing) || existing.length === 0) return MASTER_JE_LIBRARY
  const byId = new Map<string, Folder>()
  for (const f of MASTER_JE_LIBRARY) {
    byId.set(f.id, f)
  }
  for (const userFolder of existing) {
    if (!userFolder || !userFolder.id) continue
    if (!byId.has(userFolder.id)) {
      if (Array.isArray(userFolder.links) && userFolder.links.length > 0) byId.set(userFolder.id, userFolder)
    } else {
      const masterFolder = byId.get(userFolder.id)!
      const existingUrls = new Set(masterFolder.links.map((l) => l.url))
      const extraLinks = (userFolder.links || []).filter((l) => l?.url && !existingUrls.has(l.url))
      if (extraLinks.length > 0) byId.set(userFolder.id, { ...masterFolder, links: [...masterFolder.links, ...extraLinks] })
    }
  }
  return Array.from(byId.values())
}

function isSyllabusKey(key: string, fallback: unknown): boolean {
  const k = key.toLowerCase()
  if (k === 'subjects' || k === 'syllabus') return true
  if (Array.isArray(fallback) && fallback.length > 0 && typeof fallback[0] === 'object' && fallback[0] !== null) return 'units' in fallback[0]
  return false
}

function isLibraryKey(key: string, fallback: unknown): boolean {
  const k = key.toLowerCase()
  if (k === 'folders' || k === 'library' || k === 'links') return true
  if (Array.isArray(fallback) && fallback.length > 0 && typeof fallback[0] === 'object' && fallback[0] !== null) return 'links' in fallback[0]
  return false
}

let seededOnce = false
function ensureMasterCurriculumSeeded() {
  if (seededOnce || typeof window === 'undefined') return
  seededOnce = true
  try {
    const alreadySeeded = window.localStorage.getItem(SEED_VERSION_KEY) === 'true'
    
    // Seed new Static GK Data
    window.localStorage.setItem(PREFIX + 'chrono_roots', JSON.stringify(MASTER_CHRONO_ROOTS))
    window.localStorage.setItem(PREFIX + 'polity_vault', JSON.stringify(MASTER_POLITY_VAULT))
    window.localStorage.setItem(PREFIX + 'topograph_v9', JSON.stringify(GEO_STATIC_PINS))

    if (alreadySeeded) return

    for (const sKey of ['subjects', 'syllabus']) {
      const raw = window.localStorage.getItem(PREFIX + sKey)
      const parsed = raw ? (JSON.parse(raw) as Subject[]) : null
      const upgraded = mergeSyllabusWithMaster(parsed)
      window.localStorage.setItem(PREFIX + sKey, JSON.stringify(upgraded))
      cache.delete(sKey)
    }

    for (const lKey of ['folders', 'library']) {
      const raw = window.localStorage.getItem(PREFIX + lKey)
      const parsed = raw ? (JSON.parse(raw) as Folder[]) : null
      const upgraded = mergeLibraryWithMaster(parsed)
      window.localStorage.setItem(PREFIX + lKey, JSON.stringify(upgraded))
      cache.delete(lKey)
    }

    window.localStorage.setItem(SEED_VERSION_KEY, 'true')
  } catch {
    // Ignore storage errors
  }
}

// ============================================================================
// 6. CORE REACTIVE STORE ENGINE
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
    if (isSyllabusKey(key, fallback) && Array.isArray(parsed) && parsed.length < 10) {
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