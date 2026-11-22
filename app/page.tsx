'use client'

import React, { useState, useMemo, useEffect } from 'react'
import { Desktop } from '@/components/os/desktop'

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
// 1. TAB 1 DATA: CHRONO-ROOTS HISTORY & POLITY NEURAL TREE
// ============================================================================
type Era = 'Ancient' | 'Medieval' | 'Modern'

interface HistoryLeaf {
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

interface PolityLeaf {
  id: string
  title: string
  articleBadge: string
  lockerId: string
}

interface TrunkHub {
  id: string
  era: Era
  yearLabel: string
  scarred?: boolean
  polityLeaves: PolityLeaf[]
  historyLeaves: HistoryLeaf[]
}

const CHRONO_HUBS: TrunkHub[] = [
  {
    id: 'hub-modern-1',
    era: 'Modern',
    yearLabel: '1757–1857',
    polityLeaves: [
      { id: 'pl-1773', title: '1773 SC Calcutta & UPSC', articleBadge: 'Art 124 & Art 315', lockerId: 'pv-5' },
      { id: 'pl-1858', title: '1858 Crown Sovereignty', articleBadge: 'Part I (Art 1–4)', lockerId: 'pv-1' },
    ],
    historyLeaves: [
      {
        id: 'hl-1757', dateBadge: '23 Jun 1757 & 1764', title: 'Plassey (1757) & Buxar (1764)', subtitle: 'Clive, Munro & 1765 Diwani Treaty', stars: 3,
        cause: 'EIC military expansion under Robert Clive (Plassey 1757) and Hector Munro (Buxar 1764 vs Mir Qasim, Shuja-ud-Daulah & Shah Alam II).',
        effect: 'Treaty of Allahabad (1765) granted EIC Diwani (revenue) rights over Bengal, Bihar, and Orissa.',
        polityLinkText: 'Initiated British Parliamentary oversight leading to Part V Executive & Revenue separation.', polityLockerId: 'pv-5',
        quizQ: 'Which 1765 treaty granted the East India Company Diwani rights of Bengal, Bihar, and Orissa?',
        quizOpts: ['Treaty of Alinagar', 'Treaty of Allahabad', 'Treaty of Salbai', 'Treaty of Bassein'], quizAns: 1,
      },
      {
        id: 'hl-1773', dateBadge: '1773 to 1853 Acts', title: 'Regulating Act 1773 to Charter 1853', subtitle: 'Calcutta SC (1774), Bentinck (1833) & ICS', stars: 3,
        cause: 'Administrative corruption in EIC forced British Parliamentary regulation every 20 years.',
        effect: '1773: Warren Hastings 1st GG of Bengal & Calcutta SC (1774). 1833: Bentinck 1st GG of India. 1853: Open ICS merit exam.',
        polityLinkText: 'Direct institutional ancestor of the Supreme Court (Art 124) and UPSC Open Merit System (Art 315).', polityLockerId: 'pv-5',
        quizQ: 'Which Charter Act made Lord William Bentinck the first Governor-General of India?',
        quizOpts: ['Regulating Act 1773', 'Charter Act 1813', 'Charter Act 1833', 'Charter Act 1853'], quizAns: 2,
      },
      {
        id: 'hl-1857', dateBadge: '10 May 1857', title: 'Revolt of 1857 & GOI Act 1858', subtitle: 'Meerut Mutiny, Lakshmibai & Crown Rule', stars: 3,
        cause: 'Doctrine of Lapse (Satara 1848, Jhansi 1853, Awadh 1856) and greased Enfield cartridges (Mangal Pandey, Meerut).',
        effect: 'East India Company abolished; GOI Act 1858 transferred power to the British Crown with Lord Canning as 1st Viceroy.',
        polityLinkText: 'Direct trigger for Crown-to-Republic sovereignty transfer (Part I, Art 1).', polityLockerId: 'pv-1',
        quizQ: 'Who became the first Viceroy of India under the Government of India Act 1858?',
        quizOpts: ['Lord Dalhousie', 'Lord Canning', 'Lord Ripon', 'Lord Curzon'], quizAns: 1,
      },
    ],
  },
  {
    id: 'hub-modern-2',
    era: 'Modern',
    yearLabel: '1885–1919',
    scarred: true,
    polityLeaves: [
      { id: 'pl-parl', title: 'Parliamentary System', articleBadge: 'Part V (Art 79–122)', lockerId: 'pv-5' },
      { id: 'pl-fr', title: 'Part III: Fundamental Rights', articleBadge: 'Art 19, 21 & 22 Safeguards', lockerId: 'pv-3' },
    ],
    historyLeaves: [
      {
        id: 'hl-1885', dateBadge: '28 Dec 1885', title: 'Formation of INC (Bombay)', subtitle: 'A.O. Hume, W.C. Bonnerjee (72 Delegates)', stars: 3,
        cause: 'Need for an all-India political platform under Viceroy Lord Dufferin at Gokuldas Tejpal Sanskrit College.',
        effect: '1st Pres: W.C. Bonnerjee (1885); 1st Muslim Pres: Badruddin Tyabji (1887); 1st Indian Woman: Sarojini Naidu (1925).',
        polityLinkText: 'Created the legislative debate culture enshrined in Part V (Art 79–105).', polityLockerId: 'pv-5',
        quizQ: 'Who presided over the first session of the Indian National Congress in December 1885?',
        quizOpts: ['Dadabhai Naoroji', 'W.C. Bonnerjee', 'Badruddin Tyabji', 'George Yule'], quizAns: 1,
      },
      {
        id: 'hl-1905', dateBadge: '16 Oct 1905', title: 'Partition of Bengal & Swadeshi', subtitle: 'Lord Curzon, Boycott & 1906 Calcutta INC', stars: 3,
        cause: 'Lord Curzon divided Bengal on 16 October 1905; observed as Raksha Bandhan Day.',
        effect: 'Launched Swadeshi & Boycott movement; Partition annulled at 1911 Delhi Durbar (Capital shifted Calcutta → Delhi).',
        polityLinkText: 'Shaped Art 3 (State reorganization) and Swadeshi cottage industries (Art 43).', polityLockerId: 'pv-1',
        quizQ: 'During which Viceroy’s tenure was the Partition of Bengal enforced on 16 October 1905?',
        quizOpts: ['Lord Minto', 'Lord Curzon', 'Lord Hardinge', 'Lord Chelmsford'], quizAns: 1,
      },
      {
        id: 'hl-1919', dateBadge: '10 Mar & 13 Apr 1919', title: 'Rowlatt Act & Jallianwala Bagh', subtitle: 'Amritsar Massacre & Tagore’s Renunciation', stars: 3, scarred: true,
        cause: 'Rowlatt Act ("No Dalil, No Vakil, No Appeal") allowed detention without trial.',
        effect: 'General Dyer fired on a peaceful Baisakhi crowd in Amritsar (13 April 1919); Tagore renounced Knighthood.',
        polityLinkText: 'Direct inspiration for Part III Fundamental Rights — Speech (Art 19), Life/Liberty (Art 21) & Arrest Protection (Art 22).', polityLockerId: 'pv-3',
        quizQ: 'Which Part of the Indian Constitution was directly inspired by the struggle against the 1919 Rowlatt Act?',
        quizOpts: ['Part II: Citizenship', 'Part III: Fundamental Rights', 'Part IV: DPSP', 'Part IVA: Fundamental Duties'], quizAns: 1,
      },
    ],
  },
  {
    id: 'hub-modern-3',
    era: 'Modern',
    yearLabel: '1929–1950',
    polityLeaves: [
      { id: 'pl-1935', title: '7th Schedule & Emergency', articleBadge: 'Part XI & XVIII', lockerId: 'pv-11' },
      { id: 'pl-1950', title: '12 Schedules & Amendments', articleBadge: 'Preamble & Art 368', lockerId: 'pv-schedules' },
    ],
    historyLeaves: [
      {
        id: 'hl-1929', dateBadge: '1929–1932', title: 'Lahore Purna Swaraj, Dandi & Poona Pact', subtitle: 'Nehru (1929), Salt March (1930) & Ambedkar (1932)', stars: 3,
        cause: 'Boycott of Simon Commission (1928) and Lahore INC (Dec 1929) declaring 26 Jan 1930 as Purna Swaraj Day.',
        effect: 'Dandi March (12 Mar–6 Apr 1930, 78 followers) and Poona Pact (24 Sept 1932 between Gandhi & Dr. B.R. Ambedkar).',
        polityLinkText: 'Why 26 Jan was chosen as Republic Day + Art 330/332 SC/ST Seat Reservations.', polityLockerId: 'pv-11',
        quizQ: 'Between whom was the Poona Pact of 24 September 1932 signed?',
        quizOpts: ['Gandhi and Lord Irwin', 'Gandhi and Dr. B.R. Ambedkar', 'Nehru and Jinnah', 'Subhas Bose and Patel'], quizAns: 1,
      },
      {
        id: 'hl-1935', dateBadge: '2 Aug 1935', title: 'Government of India Act 1935', subtitle: 'Provincial Autonomy, 3 Lists, RBI & Federal Court', stars: 3,
        cause: 'Culmination of the 3 Round Table Conferences (1930–32).',
        effect: 'Introduced Provincial Autonomy, Federal/Provincial/Concurrent Lists, RBI (1935) and Federal Court (1937).',
        polityLinkText: 'Single largest structural blueprint (~60% skeleton) of the 1950 Constitution.', polityLockerId: 'pv-11',
        quizQ: 'Which Act serves as the single largest structural source (~60%) for the Constitution of India?',
        quizOpts: ['GOI Act 1858', 'Indian Councils Act 1909', 'GOI Act 1919', 'GOI Act 1935'], quizAns: 3,
      },
      {
        id: 'hl-1946', dateBadge: '1946–26 Jan 1950', title: 'Cabinet Mission & Constituent Assembly', subtitle: 'Rajendra Prasad, B.R. Ambedkar & B.N. Rau', stars: 3,
        cause: 'Cabinet Mission (1946) constituted the 389-member Constituent Assembly.',
        effect: '1st Met: 9 Dec 1946; Drafting Committee Chairman: Dr. B.R. Ambedkar; Advisor: Sir B.N. Rau. Adopted 26 Nov 1949; enforced 26 Jan 1950.',
        polityLinkText: 'Created the Preamble, 22 Parts, 395 Articles, and 12 Schedules ("TEARS OF OLD PM").', polityLockerId: 'pv-schedules',
        quizQ: 'Who was the Constitutional Advisor to the Constituent Assembly of India?',
        quizOpts: ['Dr. B.R. Ambedkar', 'Sir B.N. Rau', 'K.M. Munshi', 'Dr. Rajendra Prasad'], quizAns: 1,
      },
    ],
  },
  {
    id: 'hub-ancient-1',
    era: 'Ancient',
    yearLabel: '2500 BCE–1014 CE',
    polityLeaves: [
      { id: 'pl-ivc', title: 'Part IXA: Urban Municipalities', articleBadge: 'Art 243P–ZG · 12th Sch', lockerId: 'pv-9a' },
      { id: 'pl-dpsp-a', title: 'Part IV: Welfare State & Panchayats', articleBadge: 'Art 38 & Art 243K', lockerId: 'pv-4' },
    ],
    historyLeaves: [
      {
        id: 'hl-ivc1', dateBadge: '2500–1750 BCE', title: 'Indus Valley: Harappa, Mohenjo-Daro & Dholavira', subtitle: 'Grid Drainage, Lothal Dockyard & 3-Part City', stars: 3,
        cause: 'Bronze-age urban planning with grid streets and covered brick drainage across the Indus basin.',
        effect: 'Harappa (1921, Dayaram Sahni), Mohenjo-Daro (1922, R.D. Banerji), Lothal (Tidal Dockyard), Dholavira (40th UNESCO site).',
        polityLinkText: 'Urban sanitation & municipal town planning under Part IXA (12th Schedule).', polityLockerId: 'pv-9a',
        quizQ: 'Which Indus Valley site in Gujarat is divided into three parts and famous for giant water reservoirs?',
        quizOpts: ['Lothal', 'Dholavira', 'Surkotada', 'Rakhigarhi'], quizAns: 1,
      },
      {
        id: 'hl-mau', dateBadge: '322–185 BCE', title: 'Maurya Empire & Kalinga Rock Edict XIII', subtitle: 'Chandragupta, Chanakya & Ashoka’s Dhamma', stars: 3,
        cause: 'Kalinga War (261 BCE) transformed Ashoka toward Dhammavijaya and public welfare.',
        effect: 'Sarnath Lion Capital (National Emblem) & 14 Major Rock Edicts (deciphered by James Prinsep in 1837).',
        polityLinkText: 'Direct inspiration for the Welfare State in Part IV (DPSP, Art 38) and National Emblem.', polityLockerId: 'pv-4',
        quizQ: 'Who deciphered Emperor Ashoka’s Brahmi script edicts in 1837?',
        quizOpts: ['Alexander Cunningham', 'James Prinsep', 'William Jones', 'Max Muller'], quizAns: 1,
      },
      {
        id: 'hl-cho', dateBadge: '985–1014 CE', title: 'Imperial Cholas & Uttaramerur Ballot', subtitle: 'Rajaraja I, Rajendra I & Village Sabhas', stars: 3,
        cause: 'Autonomous Tamil village assemblies (Ur & Sabha) with written eligibility rules.',
        effect: 'Brihadeeswarar Temple (Thanjavur) and Uttaramerur Inscription (Kudavolai lottery ballot for village committees).',
        polityLinkText: 'Historical bedrock of Grassroots Panchayati Raj Elections (Part IX, Art 243K).', polityLockerId: 'pv-9',
        quizQ: 'Which Chola inscription details village assembly elections via the Kudavolai system?',
        quizOpts: ['Aihole Inscription', 'Uttaramerur Inscription', 'Junagadh Inscription', 'Hathigumpha Inscription'], quizAns: 1,
      },
    ],
  },
  {
    id: 'hub-med-1',
    era: 'Medieval',
    yearLabel: '1206–1674 CE',
    polityLeaves: [
      { id: 'pl-sult', title: 'Part XII: Revenue & Price Control', articleBadge: 'Market & Revenue Audit', lockerId: 'pv-11' },
      { id: 'pl-ash', title: 'Part V: Portfolio Cabinet', articleBadge: 'Art 74–75 (Ashtapradhan)', lockerId: 'pv-5' },
    ],
    historyLeaves: [
      {
        id: 'hl-khi', dateBadge: '1296–1320 CE', title: 'Alauddin Khilji: Market Control & Dagh', subtitle: 'Shahna-i-Mandi, Chehra & Cash Salaries', stars: 3,
        cause: 'Need to maintain a large standing army against Mongol invasions without price inflation.',
        effect: 'Strict price control (Diwan-i-Riyasat & Shahna-i-Mandi), Dagh (horse branding) & Chehra (soldier roll).',
        polityLinkText: 'Precursor to Essential Commodities Price Regulation & Defence Audit.', polityLockerId: 'pv-11',
        quizQ: 'Which Delhi Sultan introduced Dagh (branding of horses) and Chehra (descriptive roll of soldiers)?',
        quizOpts: ['Iltutmish', 'Balban', 'Alauddin Khilji', 'Firoz Shah Tughlaq'], quizAns: 2,
      },
      {
        id: 'hl-akb', dateBadge: '1556–1605 CE', title: 'Akbar: Mansabdari, Zabti & Sulh-i-Kul', subtitle: 'Panipat II (1556), Todar Mal & Ibadat Khana', stars: 3,
        cause: 'Administrative consolidation across 15 Subahs with uniform revenue measurement.',
        effect: 'Mansabdari (Zat & Sawar ranks), Raja Todar Mal’s 10-year Zabti / Ain-i-Dahsala (1580), abolition of Jizya (1564).',
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
// 2. TAB 2 DATA: CONSTITUTIONAL VAULT LOCKERS
// ============================================================================
type VaultFilter = 'All' | 'Core Parts' | '12 Schedules' | 'Top Amendments'

interface VaultLocker {
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

const VAULT_LOCKERS: VaultLocker[] = [
  {
    id: 'pv-1', category: 'Core Parts', lockerCode: 'VAULT-01', partBadge: 'PREAMBLE · PART I & II',
    title: 'Preamble, Union & Citizenship', articlesRange: 'Preamble & Articles 1–11', sealText: 'SOVEREIGN CORE', stars: 3,
    borrowedFrom: 'Preamble: USA | Liberty/Equality/Fraternity: France | Single Citizenship: UK',
    scheduleLink: '1st Schedule (28 States & 8 UTs) · Fazl Ali Commission (7th Amend 1956)',
    historyEra: 'Modern', historyLeafId: 'hl-1857', historyLinkLabel: '1857 Revolt & 1946 Objectives Resolution',
    articles: [
      { code: 'Preamble (42nd Amend 1976)', summary: 'Sovereign Socialist Secular Democratic Republic. Amended once in 1976 to add Socialist, Secular, and Integrity.' },
      { code: 'Articles 1, 2 & 3', summary: 'Art 1: India, that is Bharat, shall be a Union of States. Art 2: Admission of new states (Sikkim 36th Amend 1975). Art 3: Altering state boundaries/names by simple majority.' },
      { code: 'Articles 5 to 11', summary: 'Single Citizenship at commencement (Art 5–8), loss on foreign citizenship (Art 9), and Parliament’s power to regulate citizenship (Art 11).' },
    ],
  },
  {
    id: 'pv-3', category: 'Core Parts', lockerCode: 'VAULT-02', partBadge: 'PART III · MAGNA CARTA',
    title: 'Fundamental Rights & 5 Writs', articlesRange: 'Articles 12 to 35', sealText: 'JUSTICIABLE SHIELD', stars: 3,
    borrowedFrom: 'USA Bill of Rights (Art 20 & 21 never suspended in Emergency — 44th Amend 1978)',
    scheduleLink: 'Citizens-Only Rights: Articles 15, 16, 19, 29 & 30',
    historyEra: 'Modern', historyLeafId: 'hl-1919', historyLinkLabel: '1919 Rowlatt Act & Jallianwala Bagh',
    articles: [
      { code: 'Art 14–18 (Right to Equality)', summary: '14: Equality before Law. 15: No discrimination. 16: Equal opportunity in public jobs. 17: Abolition of Untouchability. 18: Abolition of Titles.' },
      { code: 'Art 19–22 (Right to Freedom)', summary: '19: 6 Freedoms. 20: Conviction protection. 21: Life & Personal Liberty. 21A: Free Education (6–14 yrs, 86th Amend 2002). 22: Arbitrary arrest protection.' },
      { code: 'Art 32 (Heart & Soul — 5 Writs)', summary: 'SC issues 5 Writs (HC under Art 226): Habeas Corpus, Mandamus, Prohibition, Certiorari, and Quo-Warranto.' },
    ],
  },
  {
    id: 'pv-4', category: 'Core Parts', lockerCode: 'VAULT-03', partBadge: 'PART IV & PART IVA',
    title: 'DPSP & 11 Fundamental Duties', articlesRange: 'Articles 36 to 51A', sealText: 'WELFARE DIRECTIVE', stars: 3,
    borrowedFrom: 'DPSP: Ireland | Fundamental Duties: USSR (Swaran Singh Committee 1976)',
    scheduleLink: 'Non-Justiciable (Art 37) · Part IVA added by 42nd Amend 1976',
    historyEra: 'Ancient', historyLeafId: 'hl-mau', historyLinkLabel: 'Ashoka’s Kalinga Dhamma Edicts (261 BCE)',
    articles: [
      { code: 'Art 38, 39A, 40, 44, 48A & 50', summary: '38: Welfare State. 39A: Free Legal Aid. 40: Village Panchayats. 44: Uniform Civil Code. 48A: Environment & Wildlife. 50: Separation of Judiciary from Executive.' },
      { code: 'Art 51A (11 Fundamental Duties)', summary: '10 Duties added by 42nd Amendment 1976; 11th Duty (education for 6–14 yr child) added by 86th Amendment 2002.' },
    ],
  },
  {
    id: 'pv-5', category: 'Core Parts', lockerCode: 'VAULT-04', partBadge: 'PART V & PART VI',
    title: 'Union & State Executive, Parliament & SC', articlesRange: 'Articles 52 to 237', sealText: 'SUPREME COMMAND', stars: 3,
    borrowedFrom: 'UK: Cabinet, Bicameralism, CAG | USA: Impeachment, Judicial Review | Australia: Art 108 Joint Sitting',
    scheduleLink: '2nd Schedule (Salaries), 3rd Schedule (Oaths), 4th Schedule (Rajya Sabha Seats)',
    historyEra: 'Modern', historyLeafId: 'hl-1773', historyLinkLabel: '1773 Regulating Act (SC) & 1885 INC',
    articles: [
      { code: 'President & Governor (Art 52–72, 123, 213)', summary: '52: President (35 yrs). 61: Impeachment. 72: President Pardon (161: Governor). 123: President Ordinance (213: Governor).' },
      { code: 'Parliament & Judiciary (Art 79–148, 226)', summary: '80: Rajya Sabha (30 yrs). 81: Lok Sabha (25 yrs). 108: Joint Sitting. 110: Money Bill. 112: Budget. 124: Supreme Court. 148: CAG. 226: HC Writs.' },
    ],
  },
  {
    id: 'pv-9', category: 'Core Parts', lockerCode: 'VAULT-05', partBadge: 'PART IX & IXA',
    title: 'Panchayati Raj & Municipalities', articlesRange: 'Articles 243 to 243ZG', sealText: 'GRASSROOTS TIER', stars: 3,
    borrowedFrom: 'Balwant Rai Mehta (1957 — 3-tier, Nagaur RJ 1959), L.M. Singhvi (1986)',
    scheduleLink: '11th Schedule (29 Subjects · 73rd Amend) & 12th Schedule (18 Subjects · 74th Amend)',
    historyEra: 'Ancient', historyLeafId: 'hl-cho', historyLinkLabel: 'Chola Uttaramerur Ballot & IVC Cities',
    articles: [
      { code: 'Art 243A–243K (73rd Amend 1992)', summary: '243A: Gram Sabha. 243B: 3-tier Panchayats. 243D: SC/ST + min 1/3rd Women reservation. 243F: Min age 21 yrs. 243I: State Finance Commission.' },
      { code: 'Art 243P–243ZG (74th Amend 1992)', summary: '243Q: Nagar Panchayat, Municipal Council & Municipal Corporation. 243ZD: District Planning Committee.' },
    ],
  },
  {
    id: 'pv-11', category: 'Core Parts', lockerCode: 'VAULT-06', partBadge: 'PART XI, XIV, XV & XVIII',
    title: 'Finance, UPSC, Elections & Emergency', articlesRange: 'Articles 245 to 368', sealText: 'FEDERAL MATRIX', stars: 3,
    borrowedFrom: 'GOI Act 1935, Germany (Emergency), South Africa (Art 368), Canada (Strong Centre)',
    scheduleLink: '7th Schedule (Union 100, State 61, Concurrent 52)',
    historyEra: 'Modern', historyLeafId: 'hl-1935', historyLinkLabel: 'GOI Act 1935 Blueprint & 1932 Poona Pact',
    articles: [
      { code: 'Finance & Services (Art 266–315)', summary: '266: Consolidated Fund. 267: Contingency Fund. 279A: GST Council. 280: Finance Commission. 300A: Property Right. 312: All-India Services. 315: UPSC.' },
      { code: 'Elections & Emergencies (Art 324–368)', summary: '324: Election Commission. 326: Adult Suffrage (18 yrs). 352: National Emergency. 356: President’s Rule. 360: Financial Emergency. 368: Amendment.' },
    ],
  },
  {
    id: 'pv-schedules', category: '12 Schedules', lockerCode: 'VAULT-07', partBadge: 'ALL 12 SCHEDULES',
    title: 'Complete 12 Schedules ("TEARS OF OLD PM")', articlesRange: '1st to 12th Schedule', sealText: 'MASTER CODEX', stars: 3,
    borrowedFrom: 'Originally 8 Schedules (1950); 9th (1951), 10th (1985), 11th & 12th (1992) added',
    scheduleLink: 'Mnemonic: T-E-A-R-S O-F O-L-D P-M',
    historyEra: 'Modern', historyLeafId: 'hl-1946', historyLinkLabel: '1946–49 Constituent Assembly',
    articles: [
      { code: '1st to 6th Schedule (T-E-A-R-S-O)', summary: '1st (T): 28 States & 8 UTs. 2nd (E): Salaries. 3rd (A): Oaths. 4th (R): Rajya Sabha Seats. 5th (S): Scheduled Areas. 6th (O): Tribal Areas in Assam, Meghalaya, Tripura, Mizoram (AMTM).' },
      { code: '7th to 12th Schedule (F-O-L-D-P-M)', summary: '7th (F): 3 Lists (100/61/52). 8th (O): 22 Languages. 9th (L): Land Reforms (1st Amend 1951). 10th (D): Anti-Defection (52nd Amend 1985). 11th (P): Panchayats (29). 12th (M): Municipalities (18).' },
    ],
  },
  {
    id: 'pv-amendments', category: 'Top Amendments', lockerCode: 'VAULT-08', partBadge: 'ARTICLE 368 AMENDMENTS',
    title: 'Top Landmark Amendments (1st–106th)', articlesRange: '1951 to 2023 Amendments', sealText: 'HIGH-YIELD EXAM', stars: 3,
    borrowedFrom: 'South African Constitution (Art 368)',
    scheduleLink: 'Covers 95% of SSC JE / RRB JE / WBPSC Amendment Questions',
    historyEra: 'Modern', historyLeafId: 'hl-1946', historyLinkLabel: 'Constitutional Evolution (1951–2023)',
    articles: [
      { code: '1st, 42nd, 44th, 52nd, 61st & 86th Amendments', summary: '1st (1951): 9th Sch. 42nd (1976): Mini-Constitution. 44th (1978): Property to Art 300A. 52nd (1985): Anti-Defection. 61st (1989): Voting age 21→18. 86th (2002): Art 21A RTE.' },
      { code: '101st, 102nd, 103rd, 104th & 106th Amendments', summary: '101st: GST. 102nd: NCBC (Art 338B). 103rd: 10% EWS. 104th: Ended Anglo-Indian seats. 106th (2023): 33% Women Reservation in Lok Sabha & State Assemblies.' },
    ],
  },
]

// ============================================================================
// 3. TAB 3 DATA & ENGINE: GEOREFERENCED 3D INDIA STATIC GK MAP
// ============================================================================
type TopoCategory =
  | 'All'
  | 'Bird Sanctuaries & Ramsar'
  | 'National Parks & Tigers'
  | 'Rivers & Hydro Dams'
  | 'Mountains & Passes'
  | 'Nuclear, Ports & ISRO'
  | 'UNESCO, Temples & Dances'
  | 'WB JE Special'

interface GeoStaticPin {
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

const GEO_STATIC_PINS: GeoStaticPin[] = [
  { id: 'bs-keoladeo', category: 'Bird Sanctuaries & Ramsar', shortLabel: 'Keoladeo / Bharatpur Bird', title: 'Keoladeo Ghana (Bharatpur) Bird Sanctuary', state: 'Rajasthan', lat: 27.16, lng: 77.52, stars: 3, primaryFact: 'UNESCO World Heritage site (1985) and one of India’s 1st Ramsar Sites (1981); winter habitat of Siberian Crane.', tributaryOrRange: 'Confluence of Gambhir & Banganga rivers.', examHighlight: 'Keoladeo (Rajasthan) and Loktak Lake (Manipur) are the ONLY 2 Indian wetlands on the Montreux Record.', landscapeType: 'bird', elevationOrCapacity: '1st Ramsar (1981)', riverSystemId: 'riv-ganga' },
  { id: 'bs-chilika', category: 'Bird Sanctuaries & Ramsar', shortLabel: 'Chilika & Nalabana Bird', title: 'Chilika Lagoon & Nalabana Bird Sanctuary', state: 'Odisha', lat: 19.69, lng: 85.32, stars: 3, primaryFact: 'India’s largest brackish water coastal lagoon & 1st Ramsar Site (1981); Nalabana Island at its core is a major bird sanctuary.', tributaryOrRange: 'Fed by Daya & Bhargavi rivers; home of endangered Irrawaddy Dolphins.', examHighlight: 'Removed from Montreux Record in 2002 after successful ecological restoration.', landscapeType: 'bird', elevationOrCapacity: 'Largest Lagoon', riverSystemId: 'riv-peninsular' },
  { id: 'bs-pulicat', category: 'Bird Sanctuaries & Ramsar', shortLabel: 'Pulicat & Sriharikota', title: 'Pulicat Lake & Nelapattu Bird Sanctuary', state: 'Andhra Pradesh / TN', lat: 13.58, lng: 80.18, stars: 3, primaryFact: 'India’s 2nd largest brackish water lagoon; Sriharikota Island (ISRO Launchport) separates it from Bay of Bengal.', tributaryOrRange: 'Nelapattu Pelicanry & Flamingo Festival.', examHighlight: 'Which barrier island separates Pulicat Lake from the Bay of Bengal? Answer: Sriharikota.', landscapeType: 'bird', elevationOrCapacity: '2nd Largest Lagoon', riverSystemId: 'riv-peninsular' },
  { id: 'bs-kulik', category: 'Bird Sanctuaries & Ramsar', shortLabel: 'Kulik (Raiganj) Bird', title: 'Raiganj (Kulik) Bird Sanctuary & East Kolkata Wetlands', state: 'West Bengal (Uttar Dinajpur)', lat: 25.62, lng: 88.12, stars: 3, primaryFact: 'Along the Kulik River in Raiganj — Asia’s 2nd largest rookery for Asian Openbill Storks.', tributaryOrRange: 'East Kolkata Wetlands (Ramsar 2002) & Santragachi Jheel (Howrah).', examHighlight: 'WBSEDCL/WBPSC: Kulik Bird Sanctuary is in Uttar Dinajpur (Raiganj).', landscapeType: 'bird', elevationOrCapacity: 'Openbill Rookery', riverSystemId: 'riv-ganga' },
  { id: 'bs-wular', category: 'Bird Sanctuaries & Ramsar', shortLabel: 'Wular Lake & Harike', title: 'Wular Lake (J&K) & Harike Wetland (Punjab)', state: 'J&K & Punjab', lat: 34.33, lng: 74.56, stars: 3, primaryFact: 'Wular Lake (Bandipora J&K on Jhelum) is India’s LARGEST freshwater lake; Harike sits at Beas–Sutlej confluence.', tributaryOrRange: 'Renuka Wetland (HP) is India’s SMALLEST Ramsar site.', examHighlight: 'Largest Freshwater Lake = Wular (J&K) | Smallest Ramsar Site = Renuka Wetland (HP).', landscapeType: 'bird', elevationOrCapacity: 'Largest Freshwater', riverSystemId: 'riv-indus' },

  { id: 'np-hemis', category: 'National Parks & Tigers', shortLabel: 'Hemis (Largest) & Dachigam', title: 'Hemis National Park (Ladakh) & Dachigam (J&K)', state: 'Ladakh & J&K', lat: 33.98, lng: 77.42, stars: 3, primaryFact: 'Hemis NP (4,400 sq km) is India’s LARGEST National Park (Snow Leopards). Dachigam protects Hangul (Kashmir Stag).', tributaryOrRange: 'South Button Island (Andaman) is India’s SMALLEST NP (0.03 sq km).', examHighlight: 'Largest NP = Hemis | Smallest NP = South Button | Oldest NP = Jim Corbett (1936).', landscapeType: 'park', elevationOrCapacity: '4,400 km² · Largest', riverSystemId: 'riv-indus' },
  { id: 'np-corbett', category: 'National Parks & Tigers', shortLabel: 'Jim Corbett (1936, 1st NP)', title: 'Jim Corbett & Valley of Flowers National Parks', state: 'Uttarakhand', lat: 29.53, lng: 78.77, stars: 3, primaryFact: 'Jim Corbett (1936 as Hailey NP) is India’s FIRST National Park and launchpad of Project Tiger (1 April 1973).', tributaryOrRange: 'Ramganga River flows through Corbett.', examHighlight: 'Corbett holds the highest tiger density among all Indian Tiger Reserves.', landscapeType: 'park', elevationOrCapacity: 'Est. 1936 · Oldest NP', riverSystemId: 'riv-ganga' },
  { id: 'np-gir', category: 'National Parks & Tigers', shortLabel: 'Gir NP (Asiatic Lion)', title: 'Gir National Park & Gulf of Kachchh Marine NP', state: 'Gujarat', lat: 21.12, lng: 70.82, stars: 3, primaryFact: 'Gir Forest (Junagadh) is the ONLY natural habitat of the Asiatic Lion in the world.', tributaryOrRange: 'Gulf of Kachchh is India’s 1st Marine NP and LARGEST Biosphere Reserve by area.', examHighlight: 'Only home of Asiatic Lion = Gir National Park, Gujarat.', landscapeType: 'park', elevationOrCapacity: 'Only Asiatic Lion' },
  { id: 'np-kanha', category: 'National Parks & Tigers', shortLabel: 'Kanha, Kuno & Panna (11 NPs)', title: 'Madhya Pradesh "Tiger State" (11 National Parks)', state: 'Madhya Pradesh', lat: 22.33, lng: 80.61, stars: 3, primaryFact: 'Madhya Pradesh has the HIGHEST number of National Parks (11) and highest Tiger count (785) in India.', tributaryOrRange: 'Kanha, Bandhavgarh, Panna (Ken River), Pench, Satpura & Kuno (Project Cheetah).', examHighlight: 'Ken-Betwa River Interlinking passes through Panna Tiger Reserve.', landscapeType: 'park', elevationOrCapacity: '11 NPs · 785 Tigers', riverSystemId: 'riv-narmada-tapi' },
  { id: 'np-kaziranga', category: 'National Parks & Tigers', shortLabel: 'Kaziranga & Manas (7 NPs)', title: 'Kaziranga, Manas, Raimona & Dehing Patkai', state: 'Assam', lat: 26.57, lng: 93.17, stars: 3, primaryFact: 'Kaziranga holds 2/3rds of the world’s One-Horned Rhinoceros (UNESCO 1985).', tributaryOrRange: 'Assam has 7 NPs; Majuli nearby is the world’s largest river island.', examHighlight: 'Orang NP is called "Mini Kaziranga".', landscapeType: 'park', elevationOrCapacity: '7 NPs · 1-Horn Rhino', riverSystemId: 'riv-brahmaputra' },
  { id: 'np-keibul', category: 'National Parks & Tigers', shortLabel: 'Keibul Lamjao (Floating NP)', title: 'Keibul Lamjao National Park (Loktak Lake)', state: 'Manipur', lat: 24.5, lng: 93.82, stars: 3, primaryFact: 'World’s ONLY Floating National Park (Phumdis biomass & endangered Sangai Dancing Deer).', tributaryOrRange: 'Located on Loktak Lake (largest freshwater lake in North-East India).', examHighlight: 'World’s only Floating National Park: Keibul Lamjao (Manipur).', landscapeType: 'park', elevationOrCapacity: 'Only Floating NP', riverSystemId: 'riv-brahmaputra' },
  { id: 'np-nilgiri', category: 'National Parks & Tigers', shortLabel: 'Nilgiri (1st Biosphere) & Silent Valley', title: 'Bandipur, Mudumalai, Silent Valley & Nilgiri Biosphere', state: 'Karnataka, TN & Kerala', lat: 11.66, lng: 76.62, stars: 3, primaryFact: 'Nilgiri Biosphere Reserve (1986 across TN, KL, KA) is India’s FIRST Biosphere Reserve.', tributaryOrRange: 'Silent Valley (Kerala) protects Lion-Tailed Macaque; Eravikulam protects Nilgiri Tahr.', examHighlight: 'India’s 1st Biosphere Reserve = Nilgiri (1986).', landscapeType: 'park', elevationOrCapacity: '1st Biosphere (1986)', riverSystemId: 'riv-peninsular' },

  { id: 'dam-tehri', category: 'Rivers & Hydro Dams', shortLabel: 'Tehri Dam (260.5m Highest)', title: 'Tehri Hydro Dam & Panch Prayag Confluences', state: 'Uttarakhand', lat: 30.37, lng: 78.48, stars: 3, primaryFact: 'Tehri Dam (260.5 m, 2,400 MW) at Bhagirathi–Bhilangna confluence is the HIGHEST dam in India.', tributaryOrRange: 'Devprayag: Alaknanda + Bhagirathi = Ganga.', examHighlight: 'THDC Tehri = 1,000 MW Stage-I + 1,000 MW Pumped Storage + 400 MW Koteshwar.', landscapeType: 'dam', elevationOrCapacity: '260.5 m (Highest)', riverSystemId: 'riv-ganga' },
  { id: 'dam-bhakra', category: 'Rivers & Hydro Dams', shortLabel: 'Bhakra Nangal & Chenab Dams', title: 'Bhakra Nangal (Sutlej) & Salal/Baglihar/Dulhasti (Chenab)', state: 'HP, Punjab & J&K', lat: 31.41, lng: 76.43, stars: 3, primaryFact: 'Bhakra Nangal (226 m highest straight gravity concrete dam, Gobind Sagar reservoir) sits on Sutlej.', tributaryOrRange: 'Chenab Projects: Salal, Baglihar, Dulhasti & 359 m Chenab Arch Rail Bridge.', examHighlight: 'Chenab Rail Bridge (Reasi, J&K) is the world’s highest railway bridge.', landscapeType: 'dam', elevationOrCapacity: 'Bhakra: 226 m', riverSystemId: 'riv-indus' },
  { id: 'dam-sardar', category: 'Rivers & Hydro Dams', shortLabel: 'Sardar Sarovar (1450 MW)', title: 'Sardar Sarovar (Narmada) & Ukai Dam (Tapi)', state: 'Gujarat & MP', lat: 21.83, lng: 73.75, stars: 3, primaryFact: 'Sardar Sarovar Dam (Navagam, GJ — 1,450 MW) sits on the West-flowing Narmada River.', tributaryOrRange: 'Mahi River cuts the Tropic of Cancer TWICE.', examHighlight: 'Statue of Unity (182 m) stands downstream of Sardar Sarovar Dam.', landscapeType: 'dam', elevationOrCapacity: '1,450 MW · Narmada', riverSystemId: 'riv-narmada-tapi' },
  { id: 'dam-hirakud', category: 'Rivers & Hydro Dams', shortLabel: 'Hirakud Dam (25.8 km Longest)', title: 'Hirakud Dam — Longest Dam in India', state: 'Odisha', lat: 21.52, lng: 83.87, stars: 3, primaryFact: 'Longest dam in India (4.8 km main, 25.8 km total with dykes) across the Mahanadi River near Sambalpur.', tributaryOrRange: 'Mahanadi rises in Sihawa hills (Chhattisgarh).', examHighlight: 'Hirakud = Longest Dam | Tehri = Highest Dam | Kallanai = Oldest Functional Dam.', landscapeType: 'dam', elevationOrCapacity: '25.8 km (Longest)', riverSystemId: 'riv-peninsular' },
  { id: 'dam-nagarjuna', category: 'Rivers & Hydro Dams', shortLabel: 'Nagarjuna Sagar & Srisailam', title: 'Nagarjuna Sagar & Srisailam Hydro (Krishna River)', state: 'Telangana & AP', lat: 16.57, lng: 79.31, stars: 3, primaryFact: 'Nagarjuna Sagar (124 m tallest masonry dam) and Srisailam (1,670 MW hydro) span the Krishna River.', tributaryOrRange: 'Kaleshwaram & Polavaram projects lie on the Godavari River.', examHighlight: 'Nagarjuna Sagar Srisailam is India’s largest Tiger Reserve by area.', landscapeType: 'dam', elevationOrCapacity: 'Srisailam: 1,670 MW', riverSystemId: 'riv-peninsular' },
  { id: 'dam-idukki', category: 'Rivers & Hydro Dams', shortLabel: 'Idukki Arch Dam & Mettur', title: 'Idukki Arch Dam (Periyar) & Mettur / Kallanai (Cauvery)', state: 'Kerala & Tamil Nadu', lat: 9.84, lng: 76.97, stars: 3, primaryFact: 'Idukki Dam (168.9 m across Periyar River, 780 MW) is Asia’s highest double-curvature parabolic ARCH dam.', tributaryOrRange: 'Cauvery: KRS, Shivanasamudra (1902), Mettur Dam & Kallanai (Grand Anicut).', examHighlight: '1st Hydro in India: Sidrapong (Darjeeling, 1897), followed by Shivanasamudra (1902).', landscapeType: 'dam', elevationOrCapacity: 'Idukki: Arch Dam', riverSystemId: 'riv-peninsular' },

  { id: 'mt-k2', category: 'Mountains & Passes', shortLabel: 'K2 (8611m) & Zoji La Pass', title: 'Karakoram (K2, Siachen), Zoji La & Banihal Passes', state: 'Ladakh & J&K', lat: 35.88, lng: 76.51, stars: 3, primaryFact: 'K2 / Godwin-Austen (8,611 m) is the 2nd highest peak in the world; Siachen (76 km) is the highest battleground.', tributaryOrRange: 'Zoji La (Srinagar–Leh), Banihal (Jawahar Tunnel), Khardung La.', examHighlight: 'Order N→S: Karakoram → Ladakh → Zanskar → Pir Panjal → Dhauladhar → Shiwalik.', landscapeType: 'mountain', elevationOrCapacity: 'K2: 8,611 m', riverSystemId: 'riv-indus' },
  { id: 'mt-kanchenjunga', category: 'Mountains & Passes', shortLabel: 'Kanchenjunga (8586m) & Nathu La', title: 'Kanchenjunga Peak, Nathu La & Jelep La Passes', state: 'Sikkim', lat: 27.7, lng: 88.14, stars: 3, primaryFact: 'Kanchenjunga (8,586 m) is the highest peak in undisputed Indian territory & India’s ONLY Mixed UNESCO Site.', tributaryOrRange: 'Sikkim Passes: Nathu La & Jelep La.', examHighlight: 'Nanda Devi (7,816 m, Uttarakhand) is the highest peak located wholly inside India.', landscapeType: 'mountain', elevationOrCapacity: '8,586 m · Sikkim', riverSystemId: 'riv-brahmaputra' },
  { id: 'mt-gurushikhar', category: 'Mountains & Passes', shortLabel: 'Guru Shikhar (1722m Aravalli)', title: 'Aravalli Range — Guru Shikhar (Mt. Abu)', state: 'Rajasthan', lat: 24.65, lng: 72.78, stars: 3, primaryFact: 'Aravalli is the OLDEST fold mountain range in the world (Pre-Cambrian), now a residual mountain.', tributaryOrRange: 'Highest Peak: Guru Shikhar (1,722 m) in Mount Abu (Dilwara Jain Temples).', examHighlight: 'Raisina Hill (Rashtrapati Bhavan, Delhi) is the northernmost tip of the Aravalli Range.', landscapeType: 'mountain', elevationOrCapacity: '1,722 m · Aravalli' },
  { id: 'mt-anaimudi', category: 'Mountains & Passes', shortLabel: 'Anaimudi (2695m South Highest)', title: 'Anaimudi (2,695m), Doddabetta & Western Ghat Passes', state: 'Kerala & Tamil Nadu', lat: 10.17, lng: 77.06, stars: 3, primaryFact: 'Anaimudi (2,695 m, Annamalai Hills, Kerala) is the HIGHEST peak of South India & Western Ghats.', tributaryOrRange: 'Passes N→S: Thal Ghat, Bhor Ghat, Palghat Gap, Shencottah Gap. Eastern Ghats highest: Jindhagada (1,690 m, AP).', examHighlight: 'Highest in South India = Anaimudi (2,695 m) | Nilgiris highest = Doddabetta (2,637 m).', landscapeType: 'mountain', elevationOrCapacity: 'Anaimudi: 2,695 m', riverSystemId: 'riv-peninsular' },

  { id: 'nuc-tarapur', category: 'Nuclear, Ports & ISRO', shortLabel: 'Tarapur (1st Nuclear) & JNPT', title: 'Tarapur Atomic Power Station (1969) & JNPT Port', state: 'Maharashtra', lat: 19.83, lng: 72.66, stars: 3, primaryFact: 'Tarapur (28 Oct 1969) is India’s FIRST commercial Nuclear Power Station; BARC Trombay built Asia’s 1st reactor Apsara.', tributaryOrRange: '7 Operating Nuclear Plants: Tarapur (MH), Rawatbhata (RJ), Kalpakkam (TN), Kudankulam (TN), Narora (UP), Kakrapar (GJ), Kaiga (KA).', examHighlight: 'JNPT (Nhava Sheva) is India’s largest container port; Kandla (GJ) is a tidal port.', landscapeType: 'nuclear', elevationOrCapacity: '1st Nuclear (1969)' },
  { id: 'nuc-kudankulam', category: 'Nuclear, Ports & ISRO', shortLabel: 'Kudankulam (2000 MW) & Kalpakkam', title: 'Kudankulam (Largest Nuclear) & Kalpakkam PFBR', state: 'Tamil Nadu', lat: 8.17, lng: 77.71, stars: 3, primaryFact: 'Kudankulam (Tirunelveli, VVER-1000 with Russia) is India’s LARGEST Nuclear Power Station (2,000+ MW).', tributaryOrRange: 'Kalpakkam houses 500 MW Prototype Fast Breeder Reactor (PFBR); Chennai is oldest artificial port.', examHighlight: 'Kudankulam = Largest Nuclear Plant | Kalpakkam = Indigenous Fast Breeder.', landscapeType: 'nuclear', elevationOrCapacity: '2,000+ MW (Largest)' },
  { id: 'isro-sriharikota', category: 'Nuclear, Ports & ISRO', shortLabel: 'ISRO Sriharikota & Vizag Port', title: 'Satish Dhawan Space Centre (SHAR) & Visakhapatnam Port', state: 'Andhra Pradesh', lat: 13.72, lng: 80.23, stars: 3, primaryFact: 'Satish Dhawan Space Centre (Sriharikota AP) is ISRO’s orbital launchport (Chandrayaan-3 landed 23 Aug 2023).', tributaryOrRange: 'Visakhapatnam is India’s DEEPEST landlocked natural port; Kalam Island (Odisha) is DRDO missile range.', examHighlight: 'National Space Day is celebrated every year on 23 August.', landscapeType: 'nuclear', elevationOrCapacity: 'ISRO SHAR · Vizag' },

  { id: 'unesco-ajanta', category: 'UNESCO, Temples & Dances', shortLabel: 'Ajanta, Ellora & Rani ki Vav', title: 'Ajanta, Ellora (₹20), Rani ki Vav (₹100) & Konark (₹10)', state: 'MH, Gujarat & Odisha', lat: 20.55, lng: 75.7, stars: 3, primaryFact: 'Ajanta & Ellora (Cave 16 Kailasa Temple by Krishna I) were among India’s 1st UNESCO sites (1983).', tributaryOrRange: 'RBI Note Motifs: ₹10 Konark | ₹20 Ellora | ₹50 Hampi | ₹100 Rani ki Vav | ₹200 Sanchi | ₹500 Red Fort.', examHighlight: 'Ahmedabad (2017) was India’s 1st UNESCO World Heritage City, followed by Jaipur (2019).', landscapeType: 'temple', elevationOrCapacity: '1st UNESCO (1983)' },
  { id: 'unesco-moidams', category: 'UNESCO, Temples & Dances', shortLabel: 'Charaideo Moidams (43rd UNESCO)', title: 'Moidams of Ahom Dynasty (43rd UNESCO Site) & 8 Dances', state: 'Assam & Pan-India', lat: 26.99, lng: 94.87, stars: 3, primaryFact: 'Charaideo Moidams (royal mound-burials of the Ahom Dynasty in Assam) became India’s 43rd UNESCO Site in 2024.', tributaryOrRange: '8 Classical Dances: Bharatanatyam, Kathak, Kathakali, Mohiniyattam, Kuchipudi, Odissi, Manipuri, Sattriya.', examHighlight: '39th Ramappa | 40th Dholavira | 41st Santiniketan | 42nd Hoysala | 43rd Moidams.', landscapeType: 'temple', elevationOrCapacity: '43rd UNESCO (2024)', riverSystemId: 'riv-brahmaputra' },

  { id: 'wb-purulia', category: 'WB JE Special', shortLabel: 'Purulia PSP (900 MW) & DVC', title: 'Purulia Pumped Storage (900 MW), DVC (4 Dams) & Mejia (2,340 MW)', state: 'West Bengal (Purulia & Bankura)', lat: 23.19, lng: 86.09, stars: 3, primaryFact: 'WBSEDCL’s 900 MW (4 × 225 MW reversible Francis turbines) pumped-storage hydro station in Ayodhya Hills, Purulia.', tributaryOrRange: 'DVC (1948): Tilaiya & Maithon (Barakar), Konar, Panchet (Damodar). Mejia (2,340 MW) is WB’s largest thermal plant.', examHighlight: 'WBSEDCL JE Core: Purulia PSP capacity = 900 MW (4 × 225 MW).', landscapeType: 'dam', elevationOrCapacity: '900 MW (4×225 MW)', riverSystemId: 'riv-ganga' },
  { id: 'wb-farakka', category: 'WB JE Special', shortLabel: 'Farakka (2100 MW) & Sundarbans', title: 'Farakka Barrage, NTPC Farakka (2,100 MW) & Sundarbans Ramsar', state: 'West Bengal (Murshidabad & S24P)', lat: 24.8, lng: 87.93, stars: 3, primaryFact: 'Farakka Barrage (1975) diverts Ganga water into the Feeder Canal to flush the Bhagirathi-Hooghly river.', tributaryOrRange: 'Sundarbans (4,230 sq km) is India’s LARGEST Ramsar Wetland, UNESCO Site (1987) & Tiger Reserve.', examHighlight: 'Santiniketan (Birbhum) became India’s 41st UNESCO World Heritage Site in 2023.', landscapeType: 'park', elevationOrCapacity: 'Sundarbans: 4,230 km²', riverSystemId: 'riv-ganga' },
  { id: 'wb-sandakphu', category: 'WB JE Special', shortLabel: 'Sandakphu (3636m) & Sidrapong (1897)', title: 'Sandakphu Peak, Sidrapong (1st Hydro) & Rammam/Teesta Hydro', state: 'West Bengal (Darjeeling & Kalimpong)', lat: 27.1, lng: 88.0, stars: 3, primaryFact: 'Sandakphu (3,636 m, Singalila Ridge) is the HIGHEST peak of West Bengal; Sidrapong (1897) was India’s 1st hydro plant.', tributaryOrRange: 'North WB Hydro: Rammam Stage-II (51 MW), Jaldhaka (44 MW) & Teesta Low Dam (TLDP III & IV).', examHighlight: '5 North WB NPs: Singalila, Neora Valley, Gorumara, Jaldapara (Rhino) & Buxa.', landscapeType: 'mountain', elevationOrCapacity: 'Sandakphu: 3,636 m', riverSystemId: 'riv-brahmaputra' },
]

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
  { id: 'ter-karakoram', name: 'Karakoram & Ladakh', coords: [[36.6, 74.6], [35.8, 76.4], [35.2, 77.9], [34.1, 78.8], [33.1, 78.7], [33.4, 76.8], [34.3, 75.1], [35.5, 74.4]] as [number, number][], baseColor: '#475569', ridgeColor: '#94a3b8', extrudeDx: -4, extrudeDy: -9 },
  { id: 'ter-himalaya-west', name: 'Great Himalayas', coords: [[33.3, 75.6], [32.4, 77.4], [31.3, 79.1], [30.3, 80.6], [29.5, 80.1], [30.1, 78.3], [31.2, 76.9], [32.5, 75.4]] as [number, number][], baseColor: '#334155', ridgeColor: '#cbd5e1', extrudeDx: -3, extrudeDy: -8 },
  { id: 'ter-himalaya-east', name: 'Eastern Himalayas', coords: [[27.8, 88.1], [27.9, 88.8], [27.6, 91.8], [28.3, 93.8], [29.1, 95.8], [28.1, 96.9], [27.3, 94.2], [27.1, 91.5], [27.1, 88.3]] as [number, number][], baseColor: '#334155', ridgeColor: '#94a3b8', extrudeDx: -3, extrudeDy: -7 },
  { id: 'ter-aravalli', name: 'Aravalli Range', coords: [[24.4, 72.6], [25.6, 73.6], [26.8, 74.8], [27.9, 76.1], [27.5, 76.5], [26.2, 75.2], [24.9, 73.8], [24.2, 72.9]] as [number, number][], baseColor: '#78350f', ridgeColor: '#d97706', extrudeDx: -2, extrudeDy: -4 },
  { id: 'ter-western-ghats', name: 'Western Ghats', coords: [[20.2, 73.5], [18.2, 73.6], [15.8, 74.2], [13.5, 75.2], [11.4, 76.6], [9.8, 77.1], [8.5, 77.4], [8.6, 76.9], [10.8, 76.1], [13.2, 74.9], [16.2, 73.7], [19.2, 73.1]] as [number, number][], baseColor: '#064e3b', ridgeColor: '#10b981', extrudeDx: -2, extrudeDy: -5 },
  { id: 'ter-eastern-ghats', name: 'Eastern Ghats', coords: [[20.4, 84.8], [18.8, 83.2], [17.4, 81.8], [15.5, 79.4], [13.4, 78.8], [11.8, 78.2], [12.2, 78.9], [15.2, 79.9], [17.8, 82.6], [19.9, 85.1]] as [number, number][], baseColor: '#14532d', ridgeColor: '#4ade80', extrudeDx: -1.5, extrudeDy: -3.5 },
]

const GEO_RIVERS = [
  { id: 'riv-indus', color: '#38bdf8', mainCoords: [[32.4, 79.4], [34.2, 77.6], [35.6, 75.4], [34.5, 73.2]] as [number, number][], tributaries: [[[33.8, 75.2], [34.2, 74.4], [32.8, 73.6]], [[32.7, 77.2], [33.1, 75.8], [32.1, 74.1]], [[31.8, 78.7], [31.4, 76.4], [31.1, 74.5]]] as [number, number][][] },
  { id: 'riv-ganga', color: '#22d3ee', mainCoords: [[30.9, 79.1], [29.9, 78.2], [27.2, 79.9], [25.4, 81.85], [25.3, 83.0], [25.6, 85.1], [25.2, 87.8], [24.8, 87.9], [22.5, 88.3], [21.7, 88.1]] as [number, number][], tributaries: [[[31.0, 78.4], [28.6, 77.2], [27.2, 78.0], [25.4, 81.85]], [[22.5, 75.6], [24.6, 75.8], [26.5, 79.2]], [[23.7, 85.5], [23.6, 86.8], [22.4, 88.1]]] as [number, number][][] },
  { id: 'riv-brahmaputra', color: '#06b6d4', mainCoords: [[29.1, 95.1], [27.9, 95.4], [26.8, 93.6], [26.2, 91.7], [26.0, 89.9], [24.5, 89.7]] as [number, number][], tributaries: [[[27.9, 88.6], [26.5, 88.8], [25.6, 89.6]]] as [number, number][][] },
  { id: 'riv-narmada-tapi', color: '#f59e0b', mainCoords: [[22.67, 81.75], [22.8, 79.2], [22.2, 76.1], [21.8, 73.7], [21.65, 72.8]] as [number, number][], tributaries: [[[21.8, 78.2], [21.2, 75.5], [21.2, 72.7]]] as [number, number][][] },
  { id: 'riv-peninsular', color: '#10b981', mainCoords: [[19.9, 73.5], [19.1, 77.3], [18.7, 79.9], [17.0, 81.7], [16.5, 82.2]] as [number, number][], tributaries: [[[20.3, 81.9], [21.5, 83.9], [20.4, 85.8]], [[17.9, 73.66], [16.4, 75.9], [16.1, 78.9], [16.5, 80.6]], [[12.38, 75.5], [12.4, 76.6], [11.8, 77.8], [10.8, 78.7]]] as [number, number][][] },
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
        </svg>
      )}
      {type === 'bird' && (
        <svg viewBox="0 0 180 110" className="h-24 w-36">
          <polygon points="15,70 90,28 165,70 90,102" fill="#0c4a6e" stroke="#38bdf8" strokeWidth="1.2" />
          <ellipse cx="90" cy="65" rx="48" ry="22" fill="#0284c7" opacity="0.85" />
          <path d="M 65 28 Q 70 22 75 28 Q 80 22 85 28" fill="none" stroke="#fde047" strokeWidth="2" />
          <path d="M 95 22 Q 100 16 105 22 Q 110 16 115 22" fill="none" stroke="#fde047" strokeWidth="2" />
        </svg>
      )}
      {type === 'nuclear' && (
        <svg viewBox="0 0 180 110" className="h-24 w-36">
          <polygon points="15,72 90,32 165,72 90,104" fill="#1e1b4b" stroke="#a855f7" strokeWidth="1.2" />
          <path d="M 55 72 Q 62 48 58 34 L 78 34 Q 74 48 81 72 Z" fill="#94a3b8" stroke="#e2e8f0" strokeWidth="1" />
          <path d="M 122 74 A 14 14 0 0 1 150 74 Z" fill="#38bdf8" stroke="#bae6fd" strokeWidth="1.2" />
        </svg>
      )}
      {(type === 'park' || type === 'temple') && (
        <svg viewBox="0 0 180 110" className="h-24 w-36">
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
// 4. MAIN PAGE COMPONENT (VOLT OS FIRST + MINIMAL SWITCH + 3 TABS)
// ============================================================================
export default function Page() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])

  // Starts false so Volt OS opens first with a minimal switch pill at the top
  const [studioOpen, setStudioOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'chrono' | 'vault' | 'topograph'>('chrono')

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

  const eraHubs = useMemo(() => CHRONO_HUBS.filter((h) => h.era === selectedEra), [selectedEra])

  const activeLeaf = useMemo(() => {
    for (const h of CHRONO_HUBS) {
      const found = h.historyLeaves.find((l) => l.id === selectedLeafId)
      if (found) return found
    }
    return CHRONO_HUBS[0]?.historyLeaves[0] || null
  }, [selectedLeafId])

  const visibleLockers = useMemo(
    () => (vaultFilter === 'All' ? VAULT_LOCKERS : VAULT_LOCKERS.filter((l) => l.category === vaultFilter)),
    [vaultFilter]
  )

  const activeLocker = useMemo(
    () => VAULT_LOCKERS.find((l) => l.id === openLockerId) || VAULT_LOCKERS[0],
    [openLockerId]
  )

  const visiblePins = useMemo(() => {
    return GEO_STATIC_PINS.filter((p) => {
      const catMatch = topoFilter === 'All' || p.category === topoFilter
      if (!catMatch) return false
      if (!searchQuery.trim()) return true
      const q = searchQuery.toLowerCase()
      return (
        p.shortLabel.toLowerCase().includes(q) ||
        p.title.toLowerCase().includes(q) ||
        p.state.toLowerCase().includes(q) ||
        p.primaryFact.toLowerCase().includes(q)
      )
    })
  }, [topoFilter, searchQuery])

  const activePin = useMemo(
    () => GEO_STATIC_PINS.find((p) => p.id === selectedPinId) || GEO_STATIC_PINS[0],
    [selectedPinId]
  )

  const activeRiver = useMemo(
    () => GEO_RIVERS.find((r) => r.id === (selectedRiverId || activePin?.riverSystemId || 'riv-ganga')) || GEO_RIVERS[1],
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

  const svgTreeHeight = Math.max(760, eraHubs.length * 340 + 80)
  const invScale = 1 / Math.pow(zoom, 0.55)

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

      {/* 1. VOLT OS DESKTOP */}
      <Desktop />

      {/* 2. MINIMAL SWITCH PILL AT TOP OF VOLT OS */}
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
                        const firstHub = CHRONO_HUBS.find((h) => h.era === era)
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
                  <span className="font-bold text-amber-300">Left Amber Roots:</span> Constitutional Parts. <br />
                  <span className="font-bold text-cyan-300">Right Cyan Roots:</span> History triggers.
                </p>
              </div>

              <div className="flex min-w-[780px] justify-center px-4 py-4 pb-44">
                <svg viewBox={`0 0 1150 ${svgTreeHeight}`} className="w-full max-w-[1150px] select-none">
                  <defs>
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
                    strokeWidth="9"
                    strokeLinecap="round"
                  />

                  {eraHubs.map((hub, hubIdx) => {
                    const hubY = 175 + hubIdx * 320
                    const hubX = hubIdx % 2 === 0 ? 512 : 526

                    return (
                      <g key={hub.id}>
                        {hub.polityLeaves.map((pl, pIdx) => {
                          const pY = hub.polityLeaves.length === 1 ? hubY - 22 : pIdx === 0 ? hubY - 72 : hubY + 32
                          return (
                            <g key={pl.id} onClick={() => jumpToVaultLocker(pl.lockerId)} className="cursor-pointer">
                              <path
                                d={`M ${hubX - 42} ${hubY} C ${hubX - 110} ${hubY}, 395 ${pY + 22}, 335 ${pY + 22}`}
                                fill="none"
                                stroke="#fbbf24"
                                strokeWidth="2.5"
                              />
                              <circle cx="335" cy={pY + 22} r="4.5" fill="#fbbf24" />
                              <rect x="65" y={pY} width="268" height="46" rx="10" fill="#271b09" fillOpacity="0.92" stroke="#f59e0b" strokeWidth="1.5" />
                              <text x="78" y={pY + 19} fill="#fde68a" fontSize="12" fontWeight="bold">{pl.title}</text>
                              <text x="78" y={pY + 35} fill="#f59e0b" fontSize="10.5" fontFamily="monospace">{pl.articleBadge} · Open Vault ↗</text>
                            </g>
                          )
                        })}

                        {hub.historyLeaves.map((hl, lIdx) => {
                          const leafY = hubY - 105 + lIdx * 80
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
                          <text x={hubX} y={hubY + 5} textAnchor="middle" fill="#ffffff" fontSize="12" fontWeight="bold" fontFamily="monospace">
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
                          {pin.lat.toFixed(1)}°N, {pin.lng.toFixed(1)}°E
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
                            {riv.tributaries.map((tc, i) => (
                              <path key={i} d={coordsToSvgPath(tc, false)} fill="none" stroke={riv.color} strokeWidth={(isSel ? 2.8 : 1.7) * invScale} strokeDasharray="5 3" />
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
                              <rect x="-3" y="-11" width={pin.shortLabel.length * 6.4 + 10} height="16" rx="4" fill="#020617" fillOpacity="0.9" stroke={isSel ? pinColor : '#334155'} strokeWidth="1" />
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
                          {activePin.category} · {activePin.lat.toFixed(2)}°N, {activePin.lng.toFixed(2)}°E
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
