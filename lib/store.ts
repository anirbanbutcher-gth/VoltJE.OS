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
    id: 'hub-ancient-1',
    era: 'Ancient',
    yearLabel: '2500–261 BCE',
    polityLeaves: [
      { id: 'pl-ivc', title: 'Part IXA: Urban Civic Grid', articleBadge: 'Art 243P–ZG · 12th Sch', lockerId: 'pv-9' },
      { id: 'pl-dpsp-a', title: 'Part IV: Welfare & Dhamma', articleBadge: 'Art 38 & Art 40', lockerId: 'pv-4' },
    ],
    historyLeaves: [
      {
        id: 'hl-ivc', dateBadge: '2500–1750 BC', title: 'Indus Valley Civilization', subtitle: 'Bronze-age urban culture & civic planning', stars: 3,
        cause: 'Settled riverine urbanism in the Indus basin with planned streets and drainage.',
        effect: 'Established early bronze-age urban culture across Harappa, Mohenjo-Daro, Lothal, and Dholavira.',
        polityLinkText: 'Urban sanitation & municipal planning under Part IXA (12th Schedule).', polityLockerId: 'pv-9',
        quizQ: 'Which period marks the Indus Valley Civilization in the GS timeline?',
        quizOpts: ['2500–1750 BC', '563–483 BC', '322 BC', '78 AD'], quizAns: 0,
      },
      {
        id: 'hl-bud-jain', dateBadge: '563–483 & 540–468 BC', title: 'Buddha & Mahavir Era', subtitle: 'Buddhism & 24th Jain Tirthankara', stars: 3,
        cause: 'Spiritual and ethical reform movements in eastern India.',
        effect: 'Gautama Buddha (563–483 BC) founded Buddhism; Mahavir (540–468 BC) was the 24th Tirthankara of Jainism.',
        polityLinkText: 'Freedom of conscience & religion under Articles 25–28.', polityLockerId: 'pv-3',
        quizQ: 'Mahavir was the __ Tirthankara of Jainism?',
        quizOpts: ['1st', '12th', '23rd', '24th'], quizAns: 3,
      },
      {
        id: 'hl-maurya', dateBadge: '327–261 BC', title: 'Chandragupta Maurya & Kalinga (261 BC)', subtitle: 'Seleucus (305 BC), Ashoka & Dhamma', stars: 3,
        cause: 'Mauryan expansion under Chandragupta (322 BC), defeat of Seleucus (305 BC), and Ashoka’s Kalinga campaign (261 BC).',
        effect: 'Marked a turning point in Ashoka’s policy toward Dhamma, edicts, and welfare administration.',
        polityLinkText: 'Welfare state principles in Part IV (DPSP) and National Emblem.', polityLockerId: 'pv-4',
        quizQ: 'Which war in 261 BC marked a turning point in Emperor Ashoka’s policy?',
        quizOpts: ['Battle of Hydaspes', 'Conquest of Kalinga', 'Battle of Tarain', 'Battle of Talikota'], quizAns: 1,
      },
    ],
  },
  {
    id: 'hub-ancient-2',
    era: 'Ancient',
    yearLabel: '58 BC–647 AD',
    polityLeaves: [
      { id: 'pl-cal', title: 'National Calendar & Heritage', articleBadge: 'Saka Era (78 AD)', lockerId: 'pv-1' },
      { id: 'pl-mon', title: 'Monuments & State Policy', articleBadge: 'Art 49 DPSP', lockerId: 'pv-4' },
    ],
    historyLeaves: [
      {
        id: 'hl-eras', dateBadge: '58 BC & 78 AD', title: 'Vikrama Era (58 BC) & Saka Era (78 AD)', subtitle: 'Kanishka’s reign & Indian eras', stars: 3,
        cause: 'Chronological systems adopted by Indian dynasties and astronomers.',
        effect: 'Vikrama era began in 58 BC; Saka era began in 78 AD associated with Kushana ruler Kanishka (78–101 AD).',
        polityLinkText: 'Saka era forms the basis of India’s official national calendar.', polityLockerId: 'pv-1',
        quizQ: 'The Saka era beginning in 78 AD is associated with which ruler?',
        quizOpts: ['Chandragupta II', 'Kanishka', 'Harshavardhan', 'Skandagupta'], quizAns: 1,
      },
      {
        id: 'hl-gupta', dateBadge: '319–455 AD', title: 'Gupta Era, Vikramaditya & Fahien', subtitle: 'Chandragupta II (380 AD), Kumaragupta & Skandagupta', stars: 3,
        cause: 'Rise of the Gupta dynasty starting in 319–320 AD.',
        effect: 'Chandragupta II "Vikramaditya" (380 AD), Fahien’s visit (405–411 AD), Kumaragupta I (415 AD), and Skandagupta (455 AD).',
        polityLinkText: 'Classical art & temple traditions preserved under Art 49.', polityLockerId: 'pv-4',
        quizQ: 'During whose reign did Chinese traveller Fahien visit India (405–411 AD)?',
        quizOpts: ['Ashoka', 'Chandragupta II', 'Harshavardhan', 'Rajaraja Chola'], quizAns: 1,
      },
      {
        id: 'hl-harsha', dateBadge: '606–647 AD', title: 'Harshavardhan of Kannauj', subtitle: 'North Indian ruler (606–647 AD)', stars: 2,
        cause: 'Consolidation of power at Kannauj after the Guptas.',
        effect: 'Harshavardhan ruled from 606 to 647 AD as a major ruler of Kannauj.',
        polityLinkText: 'Administrative continuity across north India.', polityLockerId: 'pv-5',
        quizQ: 'Harshavardhan (606–647 AD) was the ruler of which city?',
        quizOpts: ['Pataliputra', 'Kannauj', 'Taxila', 'Madurai'], quizAns: 1,
      },
    ],
  },
  {
    id: 'hub-med-1',
    era: 'Medieval',
    yearLabel: '712–1526',
    polityLeaves: [
      { id: 'pl-rev', title: 'Part XII: Revenue & State', articleBadge: 'Land & Market Audit', lockerId: 'pv-11' },
      { id: 'pl-local', title: 'Part IX: Local Governance', articleBadge: 'Provincial & Village', lockerId: 'pv-9' },
    ],
    historyLeaves: [
      {
        id: 'hl-arab-ghazni', dateBadge: '712, 985 & 1001–1025', title: 'Sindh (712), Cholas (985) & Ghazni', subtitle: 'Mohd. Bin Qasim, Rajaraja Chola & Somnath (1025)', stars: 3,
        cause: 'Early Arab entry into Sindh (712) and raids by Sultan Mahmud Ghazni from 1001.',
        effect: 'Rajaraja Chola acceded in 985; Ghazni defeated Jaipal (1001) and raided Somnath Temple (1025).',
        polityLinkText: 'Temple & heritage protection under Art 49.', polityLockerId: 'pv-4',
        quizQ: 'In which year did Mahmud Ghazni attack and destroy the Somnath Temple?',
        quizOpts: ['1001', '1025', '1191', '1206'], quizAns: 1,
      },
      {
        id: 'hl-sultanate', dateBadge: '1191–1398', title: 'Tarain (1191/92), Delhi Sultanate & Timur', subtitle: 'Aibak (1206), Razia (1236), Khilji & Tughlaq (1327)', stars: 3,
        cause: 'Ghori’s victory at Second Battle of Tarain (1192) leading to the Delhi Sultanate.',
        effect: 'Qutbuddin Aibak (1206), Razia Sultana (1236), Alauddin Khilji (1296–1316), Muhammad-bin-Tughlaq capital shift to Daulatabad (1327), and Timur (1398).',
        polityLinkText: 'Centralized revenue & administrative shifts (Part XII).', polityLockerId: 'pv-11',
        quizQ: 'Who was the first female ruler of the Delhi Sultanate (acceding in 1236)?',
        quizOpts: ['Nurjahan', 'Razia Sultana', 'Durgavati', 'Chand Bibi'], quizAns: 1,
      },
      {
        id: 'hl-vij-panipat1', dateBadge: '1336, 1498 & 1526', title: 'Vijayanagar (1336), Vasco da Gama & Panipat I', subtitle: 'Harihara & Bukka, 1498 Sea Route & Babur (1526)', stars: 3,
        cause: 'Southern empire building (1336), Portuguese arrival (1497–98), and Babur’s invasion (1526).',
        effect: 'Vijayanagar founded by Harihara & Bukka (1336); Vasco da Gama reached India (1498); First Battle of Panipat (1526) founded Mughal rule.',
        polityLinkText: 'Marked transition to Mughal & European maritime presence.', polityLockerId: 'pv-1',
        quizQ: 'In which year did Babur defeat Ibrahim Lodi in the First Battle of Panipat?',
        quizOpts: ['1498', '1526', '1539', '1556'], quizAns: 1,
      },
    ],
  },
  {
    id: 'hub-med-2',
    era: 'Medieval',
    yearLabel: '1527–1708',
    polityLeaves: [
      { id: 'pl-cab', title: 'Part V: Executive & Council', articleBadge: 'Art 74–75', lockerId: 'pv-5' },
      { id: 'pl-sec', title: 'Preamble: Secularism', articleBadge: 'Din-i-Ilahi & Art 25', lockerId: 'pv-3' },
    ],
    historyLeaves: [
      {
        id: 'hl-akbar-sher', dateBadge: '1527–1582', title: 'Khanwa, Chausa (1539), Panipat II & Haldighati', subtitle: 'Sher Shah, Akbar (1556), Talikota (1565) & Din-i-Ilahi', stars: 3,
        cause: 'Mughal–Afghan and Mughal–Rajput power struggles across North India and the Deccan.',
        effect: 'Khanwa (1527), Chausa (1539), Humayun recapture (1555), Second Panipat (1556), Talikota (1565), Haldighati (1576), and Din-i-Ilahi (1582).',
        polityLinkText: 'Secular state ethos (Preamble) and administrative reforms.', polityLockerId: 'pv-3',
        quizQ: 'In which year did Akbar introduce Din-i-Ilahi?',
        quizOpts: ['1556', '1576', '1582', '1600'], quizAns: 2,
      },
      {
        id: 'hl-jahangir-shahjahan', dateBadge: '1600–1666', title: 'EIC (1600), Sir Thomas Roe (1615) & Shahjahan', subtitle: 'Jahangir (1605), Mumtaz Mahal (1631) & Aurangzeb (1659)', stars: 2,
        cause: 'English East India Company charter (1600) and Mughal succession.',
        effect: 'Sir Thomas Roe visited Jahangir (1615); Shahjahan reigned from 1628; Aurangzeb acceded in 1659.',
        polityLinkText: 'Early English trading presence in India.', polityLockerId: 'pv-1',
        quizQ: 'Sir Thomas Roe visited Emperor Jahangir’s court in which year?',
        quizOpts: ['1600', '1605', '1615', '1634'], quizAns: 2,
      },
      {
        id: 'hl-shivaji-aurangzeb', dateBadge: '1630–1708', title: 'Shivaji (1630–1680), Aurangzeb (1707) & Guru Gobind Singh', subtitle: 'Maratha rise & Sikh Gurus', stars: 3,
        cause: 'Maratha resistance and Mughal expansion in the Deccan.',
        effect: 'Shivaji born 1630, imprisoned 1665, died 1680; Aurangzeb died 1707; Guru Gobind Singh (10th Guru) passed away in 1708.',
        polityLinkText: 'Executive leadership & council traditions (Part V).', polityLockerId: 'pv-5',
        quizQ: 'In which year did Emperor Aurangzeb pass away?',
        quizOpts: ['1680', '1699', '1707', '1739'], quizAns: 2,
      },
    ],
  },
  {
    id: 'hub-modern-1',
    era: 'Modern',
    yearLabel: '1757–1919',
    scarred: true,
    polityLeaves: [
      { id: 'pl-1784-1935', title: 'Constitutional Acts & Lists', articleBadge: '1784, 1919 & 1935', lockerId: 'pv-11' },
      { id: 'pl-fr-1919', title: 'Part III: Fundamental Rights', articleBadge: 'Art 19, 21 & 22', lockerId: 'pv-3' },
    ],
    historyLeaves: [
      {
        id: 'hl-plassey-1857', dateBadge: '1757–1857', title: 'Plassey (1757), Buxar (1764), 1793 & 1857 Revolt', subtitle: 'Clive, Pitt’s India Act (1784), Permanent Settlement & 1857', stars: 3,
        cause: 'EIC territorial expansion, Permanent Settlement (1793), and sepoy/popular grievances in 1857.',
        effect: 'Plassey (1757), Buxar (1764), Pitt’s India Act (1784), Railways/Telegraph (1853), and Revolt of 1857.',
        polityLinkText: 'Triggered transition from Company rule to Crown & constitutional acts.', polityLockerId: 'pv-11',
        quizQ: 'Which land revenue system in Bengal was introduced in 1793?',
        quizOpts: ['Ryotwari', 'Mahalwari', 'Permanent Settlement', 'Zabti'], quizAns: 2,
      },
      {
        id: 'hl-1885-1911', dateBadge: '1885–1911', title: 'INC (1885), Bengal Partition (1905) & Delhi (1911)', subtitle: 'Hume & Bonnerjee, Muslim League (1906) & Capital Shift', stars: 3,
        cause: 'All-India political mobilization and Lord Curzon’s 1905 Partition of Bengal.',
        effect: 'INC founded 1885; Muslim League founded 1906; 1911 Delhi Durbar shifted capital from Calcutta to Delhi.',
        polityLinkText: 'Shaped Art 3 (state boundaries) & representative institutions.', polityLockerId: 'pv-1',
        quizQ: 'In which year was India’s capital shifted from Calcutta to Delhi?',
        quizOpts: ['1905', '1906', '1911', '1919'], quizAns: 2,
      },
      {
        id: 'hl-1919-jallianwala', dateBadge: '1916–1919', title: 'Lucknow Pact (1916), 1919 Act & Jallianwala Bagh', subtitle: 'Montagu-Chelmsford Reforms & Amritsar massacre', stars: 3, scarred: true,
        cause: '1919 reforms and repressive measures against political protests.',
        effect: 'Montagu-Chelmsford Reforms introduced in 1919 alongside the Jallianwala Bagh massacre at Amritsar.',
        polityLinkText: 'Inspired civil liberties & Fundamental Rights under Part III.', polityLockerId: 'pv-3',
        quizQ: 'Which reforms were introduced in 1919 alongside the Jallianwala Bagh massacre?',
        quizOpts: ['Morley-Minto Reforms', 'Montagu-Chelmsford Reforms', 'Cabinet Mission Plan', 'Cripps Proposals'], quizAns: 1,
      },
    ],
  },
  {
    id: 'hub-modern-2',
    era: 'Modern',
    yearLabel: '1929–2000',
    polityLeaves: [
      { id: 'pl-const-1950', title: '1950 Constitution & 73rd Amend', articleBadge: 'Art 326 & 243 (1993)', lockerId: 'pv-9' },
      { id: 'pl-states-2000', title: '1st Schedule: State Reorg.', articleBadge: '1956 & Nov 2000 States', lockerId: 'pv-1' },
    ],
    historyLeaves: [
      {
        id: 'hl-1929-1947', dateBadge: '1929–1947', title: 'Poorna Swaraj (1929), Dandi (1930), 1935 Act & 1947', subtitle: 'Gandhi-Irwin Pact (1931), Quit India (1942), INA & Independence', stars: 3,
        cause: 'Demand for complete independence and mass movements culminating in 1947.',
        effect: 'Lahore Poorna Swaraj (1929), Dandi March (1930), GOI Act 1935, Quit India (1942), INA, and Independence/Partition in 1947.',
        polityLinkText: 'GOI Act 1935 & Constituent Assembly shaped the 1950 Constitution.', polityLockerId: 'pv-11',
        quizQ: 'In which session of INC was the resolution of Poorna Swaraj passed in 1929?',
        quizOpts: ['Bombay Session', 'Calcutta Session', 'Lahore Session', 'Tripuri Session'], quizAns: 2,
      },
      {
        id: 'hl-1949-1975', dateBadge: '1949–1975', title: 'Constitution (1949/50), 1971 War, Pokharan (1974) & 1975', subtitle: '26 Nov 1949, 26 Jan 1950, Aryabhata & Emergency', stars: 3,
        cause: 'Constitutional adoption, state reorganization (1956), 1971 war, and 1975 Emergency.',
        effect: 'Constitution adopted 26 Nov 1949 & enforced 26 Jan 1950; 1971 war; Pokharan nuclear test (1974); Aryabhata & Emergency (1975).',
        polityLinkText: 'Republic framework, Art 352 Emergency & 42nd/44th Amendments.', polityLockerId: 'pv-amend',
        quizQ: 'On which date was the Constitution of India adopted by the Constituent Assembly?',
        quizOpts: ['15 August 1947', '26 November 1949', '26 January 1950', '24 April 1993'], quizAns: 1,
      },
      {
        id: 'hl-1993-2000', dateBadge: '1993, 1998 & 2000', title: '73rd Amend (1993), Pokharan-II (1998) & 3 States (2000)', subtitle: 'Panchayati Raj Diwas, Operation Shakti & Nov 2000 states', stars: 3,
        cause: 'Grassroots democracy enforcement and creation of new states in November 2000.',
        effect: '73rd Amendment took effect April 24, 1993; Operation Shakti (1998); Chhattisgarh, Uttarakhand & Jharkhand formed in Nov 2000.',
        polityLinkText: 'Part IX Panchayati Raj (11th Sch) & 1st Schedule state creation.', polityLockerId: 'pv-9',
        quizQ: 'Which three states were created in November 2000?',
        quizOpts: ['Goa, Sikkim, Mizoram', 'Chhattisgarh, Uttarakhand, Jharkhand', 'Telangana, Goa, Jharkhand', 'Uttarakhand, Sikkim, Bihar'], quizAns: 1,
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
    id: 'pv-1', category: 'Core Parts', lockerCode: 'VAULT-01', partBadge: 'PART I & PART II',
    title: 'The Union & Citizenship', articlesRange: 'Articles 1–11', sealText: 'SOVEREIGN CORE', stars: 3,
    borrowedFrom: 'Part I (Art 1–4) & Part II (Art 5–11) of the Constitution',
    scheduleLink: '1st Schedule (States & UTs, India–Bangladesh LBA via 100th Amend)',
    historyEra: 'Modern', historyLeafId: 'hl-1885-1911', historyLinkLabel: '1911 Capital Shift & 1956 State Reorg.',
    articles: [
      { code: 'Articles 1–4 (Part I)', summary: 'The Union and its territory; state reorganization & territory adjustments.' },
      { code: 'Articles 5–11 (Part II)', summary: 'Citizenship provisions at commencement and parliamentary regulation of citizenship.' },
    ],
  },
  {
    id: 'pv-3', category: 'Core Parts', lockerCode: 'VAULT-02', partBadge: 'PART III · FUNDAMENTAL RIGHTS',
    title: 'Fundamental Rights & 5 Writs', articlesRange: 'Articles 12–35', sealText: 'JUSTICIABLE SHIELD', stars: 3,
    borrowedFrom: 'Part III of Indian Constitution (Art 12–35)',
    scheduleLink: 'Art 32 (SC Writs) & Art 226 (HC Writs) · Art 300A Property shift (44th Amend)',
    historyEra: 'Modern', historyLeafId: 'hl-1919-jallianwala', historyLinkLabel: '1919 Rowlatt & Civil Liberties',
    articles: [
      { code: 'Art 12, 13 & 14–18 (Equality)', summary: '12: State definition. 13: Invalidity of inconsistent laws. 14: Equality before law. 15: No discrimination. 16: Public jobs. 17: Abolition of untouchability. 18: Abolition of titles.' },
      { code: 'Art 19–22 (Freedom & Education)', summary: '19: Six freedoms. 20: Conviction protection. 21: Life & personal liberty. 21A: Free/compulsory education (6–14 yrs, 86th Amend 2002). 22: Arrest & preventive detention safeguards.' },
      { code: 'Art 23–34 & 5 Writs', summary: '23–24: Against exploitation/child labour (<14 yrs). 25–28: Religion. 29–30: Minorities. 32: Constitutional remedies (Habeas Corpus, Mandamus, Prohibition, Certiorari, Quo-Warranto). 33–34: Forces & martial law.' },
    ],
  },
  {
    id: 'pv-4', category: 'Core Parts', lockerCode: 'VAULT-03', partBadge: 'PART IV & PART IVA',
    title: 'DPSP & Fundamental Duties', articlesRange: 'Articles 36–51A', sealText: 'WELFARE DIRECTIVE', stars: 3,
    borrowedFrom: 'Part IV (Art 36–51 DPSP) & Part IVA (Art 51A via 42nd Amend 1976)',
    scheduleLink: 'Art 37: DPSPs not court-enforceable, fundamental in governance',
    historyEra: 'Ancient', historyLeafId: 'hl-maurya', historyLinkLabel: 'Ashoka’s Dhamma & Welfare Ideals',
    articles: [
      { code: 'Art 36–43B (Welfare, Panchayats & Co-ops)', summary: '36–37: State & non-enforceability. 38–39A: Social order & equal justice/free legal aid (42nd Amend). 40: Village panchayats. 41–43B: Work/maternity/living wage & co-operative societies.' },
      { code: 'Art 44–51 & 51A (Duties)', summary: '44: Uniform civil code. 45–48A: Early care (<6 yrs), SC/ST/weaker sections, nutrition/health, environment/wildlife (42nd Amend). 49–51: Monuments, separation of judiciary & international peace. 51A: 11 Duties.' },
    ],
  },
  {
    id: 'pv-5', category: 'Core Parts', lockerCode: 'VAULT-04', partBadge: 'PART V & PART VI',
    title: 'The Union, Parliament, SC & CAG', articlesRange: 'Articles 52–237', sealText: 'SUPREME COMMAND', stars: 3,
    borrowedFrom: 'Part V (Art 52–151 The Union) & Part VI (Art 152–237 The States)',
    scheduleLink: '2nd Schedule (Salaries), 3rd Schedule (Oaths), 4th Schedule (Rajya Sabha Seats)',
    historyEra: 'Modern', historyLeafId: 'hl-1949-1975', historyLinkLabel: 'Constitutional Framework & NJAC (99th Amend)',
    articles: [
      { code: 'President, VP, Council & AG (Art 52–76, 123)', summary: '52–53: President & executive power. 54–56 & 61: Election, 5-yr term & impeachment. 63–66: VP & RS Chairman. 72: Pardons. 74: Council of Ministers. 76: Attorney General. 123: Ordinances.' },
      { code: 'Parliament (Art 79–122)', summary: '79–81: Parliament, Rajya Sabha, Lok Sabha. 83–85: Duration, qualifications, sessions. 89–95: RS Chair/Deputy & LS Speaker/Deputy. 100: Quorum/voting. 110: Money Bills. 112: Budget. 114: Appropriation.' },
      { code: 'Supreme Court & CAG (Art 124–149)', summary: '124–129: SC & Court of Record. 131–138: Original, appellate & special leave jurisdictions. 141: Binding law. 143: SC consultation. 148–149: Comptroller & Auditor-General (CAG).' },
    ],
  },
  {
    id: 'pv-9', category: 'Core Parts', lockerCode: 'VAULT-05', partBadge: 'PART IX & PART IXA',
    title: 'Panchayati Raj & Municipalities', articlesRange: 'Articles 243–243ZG', sealText: 'GRASSROOTS TIER', stars: 3,
    borrowedFrom: '73rd Amendment Act 1992 (w.e.f. 24 April 1993) & 74th Amendment Act 1992 (w.e.f. 01.06.1993)',
    scheduleLink: '11th Schedule (Panchayats · 29 subjects) & 12th Schedule (Municipalities · 18 subjects)',
    historyEra: 'Modern', historyLeafId: 'hl-1993-2000', historyLinkLabel: '73rd Amendment & Panchayati Raj Diwas (Apr 24)',
    articles: [
      { code: 'Part IX — Panchayati Raj (Art 243, 243A–243O)', summary: 'Constitutional status to rural local self-government; effective April 24, 1993 (Panchayati Raj Diwas) and linked to 29 subjects in the 11th Schedule.' },
      { code: 'Part IXA — Municipalities (Art 243P–243ZG)', summary: 'Constitutional status to urban local bodies / municipalities (effective 01.06.1993) with 18 functional subjects in the 12th Schedule.' },
    ],
  },
  {
    id: 'pv-11', category: 'Core Parts', lockerCode: 'VAULT-06', partBadge: 'PART XII, XIV, XV, XVIII & XX',
    title: 'Property, Services, Elections & Emergency', articlesRange: 'Art 300A–395', sealText: 'FEDERAL MATRIX', stars: 3,
    borrowedFrom: 'Parts XII, XIV, XV, XVI, XVII, XVIII, XX & XXII of the Constitution',
    scheduleLink: '7th Schedule (Union, State & Concurrent Lists)',
    historyEra: 'Modern', historyLeafId: 'hl-1929-1947', historyLinkLabel: '1935 Act & Constitutional Governance',
    articles: [
      { code: 'Art 300A, 309–315 & 324–329', summary: '300A: Right to property (44th Amend). 309–315: Union/State services & PSCs. 324–329: Election Commission, non-discrimination in roll & adult suffrage.' },
      { code: 'Art 330–370 & 393–395', summary: '330–342: Special class provisions. 343–351: Official language. 352–360: Emergencies. 365 & 368: Union directions & Amendment procedure. 370: J&K provision (370(3) noted Aug 5, 2019).' },
    ],
  },
  {
    id: 'pv-sched', category: '12 Schedules', lockerCode: 'VAULT-07', partBadge: '2ND TO 12TH SCHEDULE',
    title: 'Key Constitutional Schedules (2nd–12th)', articlesRange: 'Schedules 2 to 12', sealText: 'MASTER CODEX', stars: 3,
    borrowedFrom: 'Constitutional Schedules & Amendment Acts (21st, 52nd, 71st, 73rd, 74th, 78th, 92nd)',
    scheduleLink: 'Covers Salaries, Oaths, RS Seats, Tribal Areas, Lists, Languages, Land & Anti-Defection',
    historyEra: 'Modern', historyLeafId: 'hl-1993-2000', historyLinkLabel: 'Schedules & Local Body Amendments',
    articles: [
      { code: '2nd, 3rd, 4th, 5th & 6th Schedules', summary: '2nd: Emoluments/allowances. 3rd: Oaths/affirmations. 4th: Rajya Sabha seats. 5th: Scheduled Areas/ST. 6th: Tribal areas in Assam, Meghalaya, Tripura & Mizoram.' },
      { code: '7th, 8th, 9th, 10th, 11th & 12th Schedules', summary: '7th: Union, State & Concurrent Lists. 8th: 22 languages (Sindhi 21st, Konkani/Manipuri/Nepali 71st, Bodo/Dogri/Maithili/Santhali 92nd). 9th: Acts/regulations. 10th: Anti-defection (52nd). 11th: Panchayats (29). 12th: Municipalities (18).' },
    ],
  },
  {
    id: 'pv-amend', category: 'Top Amendments', lockerCode: 'VAULT-08', partBadge: 'ARTICLE 368 AMENDMENTS',
    title: 'Landmark Constitutional Amendments', articlesRange: '1st to 106th Amendment', sealText: 'HIGH-YIELD EXAM', stars: 3,
    borrowedFrom: 'Constitutional Amendment Acts (1951–2023)',
    scheduleLink: '42nd ("Mini Constitution"), 44th, 61st, 73rd/74th, 86th, 101st, 103rd & 106th',
    historyEra: 'Modern', historyLeafId: 'hl-1949-1975', historyLinkLabel: 'Post-Independence Constitutional Milestones',
    articles: [
      { code: '1st (1951), 7th (1956), 42nd (1976) & 44th (1978)', summary: '1st: 9th Schedule & Art 15(4)/19(6). 7th: State reorganization. 42nd ("Mini Constitution"): Socialist, Secular, Integrity in Preamble & Part IVA Duties. 44th: Art 300A property & armed rebellion in Art 352.' },
      { code: '52nd, 61st, 69th, 70th, 73rd/74th & 86th', summary: '52nd: 10th Sch anti-defection. 61st: Voting age 21→18 (Art 326). 69th/70th: Delhi NCT & Delhi/Puducherry MLAs in President election. 73rd/74th: Panchayats & Municipalities. 86th: Art 21A education (6–14 yrs).' },
      { code: '91st, 101st (GST), 102nd, 103rd (EWS), 104th & 106th', summary: '91st: 15% minister cap. 101st: GST & Art 279A. 102nd: NCBC (Art 338B). 103rd: EWS quota. 104th: Extended SC/ST quota & ended Anglo-Indian nomination. 106th (2023): 33% women’s reservation bill.' },
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
  { id: 'bs-keoladeo', category: 'Bird Sanctuaries & Ramsar', shortLabel: 'Ghana / Keoladeo & Sambhar', title: 'Ghana Bird Sanctuary (Bharatpur) & Sambhar Lake', state: 'Rajasthan', lat: 27.16, lng: 77.52, stars: 3, primaryFact: 'Ghana Bird Sanctuary (Bharatpur) is known for Siberian Crane, Spoonbill, Heron teal & Stork; Keoladeo Ghana NP & Sambhar Lake are Ramsar sites.', tributaryOrRange: 'Rajasthan wetlands in GS dataset: Keoladeo Ghana NP & Sambhar Lake.', examHighlight: 'Keoladeo Ghana NP declared Ramsar site on 01.10.1981; Sambhar Lake on 23.03.1990.', landscapeType: 'bird', elevationOrCapacity: 'Ramsar · Bharatpur', riverSystemId: 'riv-ganga' },
  { id: 'bs-chilika', category: 'Bird Sanctuaries & Ramsar', shortLabel: 'Chilika & Bhitarakanika', title: 'Chilika Lake, Bhitarakanika Mangroves, Ansupa, Hirakud & Tampara', state: 'Odisha', lat: 19.69, lng: 85.32, stars: 3, primaryFact: 'Chilika Lake (declared Ramsar 01.10.1981) leads Odisha’s Ramsar wetlands alongside Bhitarakanika Mangroves, Ansupa, Hirakud Reservoir & Tampara Lake.', tributaryOrRange: 'Mahanadi & coastal delta wetlands of Odisha.', examHighlight: 'Chilika Lake Ramsar date: 01.10.1981; Hirakud Reservoir: 12.10.2021.', landscapeType: 'bird', elevationOrCapacity: 'Ramsar · Odisha', riverSystemId: 'riv-peninsular' },
  { id: 'bs-loktak', category: 'Bird Sanctuaries & Ramsar', shortLabel: 'Loktak Lake & Rudrasagar', title: 'Loktak Lake (Manipur) & Rudrasagar Lake (Tripura)', state: 'Manipur & Tripura', lat: 24.55, lng: 93.8, stars: 3, primaryFact: 'Loktak Lake (Manipur, Ramsar 23.03.1990) and Rudrasagar Lake (Tripura, Ramsar 08.11.2005) are key North-East Ramsar wetland sites.', tributaryOrRange: 'North-East wetland sites listed in GS Ramsar dataset.', examHighlight: 'Loktak Lake declared Ramsar site on 23.03.1990.', landscapeType: 'bird', elevationOrCapacity: 'Ramsar · NE India', riverSystemId: 'riv-brahmaputra' },
  { id: 'bs-vembanad', category: 'Bird Sanctuaries & Ramsar', shortLabel: 'Vembanad Kol, Ashtamudi & Sasthamkotta', title: 'Vembanad Kol Wetland, Ashtamudi & Sasthamkotta Lake', state: 'Kerala', lat: 9.6, lng: 76.4, stars: 3, primaryFact: 'Vembanad Kol Wetland, Ashtamudi Wetland, and Sasthamkotta Lake are Kerala’s Ramsar wetland sites (declared 19.08.2002).', tributaryOrRange: 'Kerala backwater & freshwater Ramsar sites.', examHighlight: 'All three Kerala Ramsar sites were declared on 19.08.2002.', landscapeType: 'bird', elevationOrCapacity: 'Ramsar · Kerala', riverSystemId: 'riv-peninsular' },
  { id: 'bs-harike', category: 'Bird Sanctuaries & Ramsar', shortLabel: 'Harike, Kanjli, Ropar & Beas', title: 'Harike Lake, Kanjli, Ropar, Beas, Keshopur-Miani & Nangal', state: 'Punjab', lat: 31.15, lng: 74.95, stars: 3, primaryFact: 'Punjab hosts Ramsar wetlands including Harike Lake (23.03.1990), Kanjli & Ropar (22.01.2002), and Beas, Keshopur-Miani & Nangal (26.09.2019).', tributaryOrRange: 'Beas & Sutlej wetland conservation network.', examHighlight: 'Harike Lake Ramsar declaration: 23.03.1990.', landscapeType: 'bird', elevationOrCapacity: 'Ramsar · Punjab', riverSystemId: 'riv-indus' },
  { id: 'bs-tn-ramsar', category: 'Bird Sanctuaries & Ramsar', shortLabel: 'Vedanthangal, Pt Calimere & Gulf of Mannar', title: 'Vedanthangal, Point Calimere, Pichavaram & Gulf of Mannar Ramsar Sites', state: 'Tamil Nadu', lat: 11.45, lng: 79.75, stars: 3, primaryFact: 'Tamil Nadu features multiple Ramsar bird & coastal sites including Point Calimere (19.08.2002), Vedanthangal, Pichavaram & Gulf of Mannar.', tributaryOrRange: 'Includes Karaivetti, Koonthankulam, Pallikaranai, Vaduvur, Vellode, Vembannur & Suchindram Theroor.', examHighlight: 'Point Calimere Ramsar site declared on 19.08.2002.', landscapeType: 'bird', elevationOrCapacity: 'Ramsar · Tamil Nadu', riverSystemId: 'riv-peninsular' },

  { id: 'np-corbett', category: 'National Parks & Tigers', shortLabel: 'Corbett NP & TR (Est. 1936)', title: 'Jim Corbett National Park & Tiger Reserve', state: 'Uttarakhand (Nainital)', lat: 29.53, lng: 78.77, stars: 3, primaryFact: 'Located in Nainital, Uttarakhand; established in 1936 (earlier known as Hailey NP) as the 1st National Park of India.', tributaryOrRange: 'Species noted: Elephant, Tiger, Sloth bear, Nilgai, Panther, Sambhar.', examHighlight: '1st National Park of India (est. 1936); also listed under Tiger Reserves.', landscapeType: 'park', elevationOrCapacity: 'Est. 1936 · 1st NP', riverSystemId: 'riv-ganga' },
  { id: 'np-kaziranga', category: 'National Parks & Tigers', shortLabel: 'Kaziranga, Manas & Orang TR', title: 'Kaziranga NP, Manas NP, Nameri TR & Orang Tiger Reserve', state: 'Assam', lat: 26.57, lng: 93.17, stars: 3, primaryFact: 'Kaziranga & Manas are renowned for Great Indian one-horned Rhinoceros, Tiger, Elephant, Wild buffalo & Sambhar.', tributaryOrRange: 'Orang Tiger Reserve is noted as the 49th Tiger Reserve in India.', examHighlight: 'Orang TR noted as 49th TR in India (as on 16 May 2025 dataset).', landscapeType: 'park', elevationOrCapacity: '49th TR: Orang · Assam', riverSystemId: 'riv-brahmaputra' },
  { id: 'np-gir', category: 'National Parks & Tigers', shortLabel: 'Gir NP & Wild Ass Sanctuary', title: 'Gir National Park (Junagadh) & Wild Ass Sanctuary (Kutch)', state: 'Gujarat', lat: 21.12, lng: 70.82, stars: 3, primaryFact: 'Gir NP (Junagadh) is known for Asiatic Lion, Panther, Sambhar, Nilgai & Crocodile; Wild Ass Sanctuary is in Little Rann of Kutch.', tributaryOrRange: 'Gujarat wildlife sites: Gir NP, Wild Ass Sanctuary, Nalsarovar, Thol, Khijadiya & Wadhvana.', examHighlight: 'Gir NP in Junagadh is famous for the Asiatic Lion.', landscapeType: 'park', elevationOrCapacity: 'Asiatic Lion · Gir' },
  { id: 'np-kanha', category: 'National Parks & Tigers', shortLabel: 'Kanha, Pench, Bandhavgarh & Madhav TR', title: 'Kanha NP, Pench NP, Bandhavgarh, Panna, Satpura & Madhav TR', state: 'Madhya Pradesh', lat: 22.33, lng: 80.61, stars: 3, primaryFact: 'Kanha NP (Mandla & Balaghat) & Pench NP (Seoni) are major MP parks/tiger reserves with Tiger, Panther, Barasingha & Gaur.', tributaryOrRange: 'Includes Bandhavgarh, Panna, Satpura, Sanjay Dubri, Veerangana Durgavati & Madhav TR.', examHighlight: 'Madhav (MP) noted as 58th Tiger Reserve in India (as on 16 May 2025).', landscapeType: 'park', elevationOrCapacity: '58th TR: Madhav (MP)', riverSystemId: 'riv-narmada-tapi' },
  { id: 'np-bandipur', category: 'National Parks & Tigers', shortLabel: 'Bandipur, Nagarahole & Bhadra TR', title: 'Bandipur NP, Nagarahole TR, Bhadra, Dandeli-Anshi & BRT TR', state: 'Karnataka', lat: 11.66, lng: 76.62, stars: 3, primaryFact: 'Bandipur NP (Chamarajanagar) protects Elephant, Tiger, Bear, Sambhar & Panther alongside Nagarahole, Bhadra, Dandeli-Anshi & BRT Tiger Reserves.', tributaryOrRange: 'Karnataka also hosts Ranganathittu Bird Sanctuary & Ramsar sites (Ankasamudra, Aghanashini, Magadi Kere).', examHighlight: 'Bandipur NP is located in Chamarajanagar district, Karnataka.', landscapeType: 'park', elevationOrCapacity: 'Bandipur · Karnataka', riverSystemId: 'riv-peninsular' },
  { id: 'np-periyar', category: 'National Parks & Tigers', shortLabel: 'Periyar, Silent Valley & Parambikulam', title: 'Periyar NP (Idukki), Silent Valley NP & Parambikulam TR', state: 'Kerala', lat: 9.46, lng: 77.24, stars: 3, primaryFact: 'Periyar NP (Idukki) is known for Elephant, Tiger, Panther, Wild boar, Gaur & Sambhar; Silent Valley NP & Parambikulam TR are key Kerala reserves.', tributaryOrRange: 'Periyar & Parambikulam are listed as Tiger Reserves in Kerala.', examHighlight: 'Periyar NP is located in Idukki, Kerala.', landscapeType: 'park', elevationOrCapacity: 'Periyar · Idukki', riverSystemId: 'riv-peninsular' },
  { id: 'np-namdapha', category: 'National Parks & Tigers', shortLabel: 'Namdapha NP, Kamlang (50th TR) & Pakke', title: 'Namdapha NP (Changlang), Kamlang TR (50th) & Pakke TR', state: 'Arunachal Pradesh', lat: 27.49, lng: 96.39, stars: 3, primaryFact: 'Namdapha NP (Changlang district) is noted for Tiger, Elephant, Panther & Leopard alongside Kamlang TR and Pakke TR.', tributaryOrRange: 'Arunachal Tiger Reserves: Namdapha, Kamlang & Pakke.', examHighlight: 'Kamlang TR noted as 50th Tiger Reserve in India (as on 16 May 2025).', landscapeType: 'park', elevationOrCapacity: '50th TR: Kamlang', riverSystemId: 'riv-brahmaputra' },
  { id: 'np-dachigam', category: 'National Parks & Tigers', shortLabel: 'Dachigam NP (Hangul) & MG Marine NP', title: 'Dachigam NP (J&K) & Mahatma Gandhi Marine NP (Andaman)', state: 'J&K & Andaman-Nicobar', lat: 34.14, lng: 75.02, stars: 3, primaryFact: 'Dachigam NP (J&K) is known for Kashmir Stag (Hangul); Mahatma Gandhi Marine NP at Wandoor (Port Blair) protects coral reefs, turtles & marine life.', tributaryOrRange: 'J&K wetlands also include Hokera, Hygan & Shalbugh.', examHighlight: 'Dachigam NP is famous for Kashmir Stag (Hangul).', landscapeType: 'park', elevationOrCapacity: 'Hangul · Dachigam', riverSystemId: 'riv-indus' },

  { id: 'dam-bhakra', category: 'Rivers & Hydro Dams', shortLabel: 'Bhakra-Nangal & IGNP (Sutlej/Beas)', title: 'Bhakra-Nangal Multipurpose Project & Indira Gandhi Nahar Project', state: 'HP, Punjab, Haryana & Rajasthan', lat: 31.41, lng: 76.43, stars: 3, primaryFact: 'Bhakra-Nangal Project is on the Sutlej River at Bilaspur (HP) for irrigation & hydro-electricity; IGNP draws from Ravi-Beas & Sutlej (Harike).', tributaryOrRange: 'Shared across HP, Punjab, Haryana & Rajasthan.', examHighlight: 'Bhakra-Nangal is located on River Sutlej at Bilaspur (HP).', landscapeType: 'dam', elevationOrCapacity: 'Sutlej · Bilaspur (HP)', riverSystemId: 'riv-indus' },
  { id: 'dam-sardar', category: 'Rivers & Hydro Dams', shortLabel: 'Sardar Sarovar, Ukai & Mahi Bajaj', title: 'Sardar Sarovar (Narmada), Ukai/Kakrapada (Tapi) & Mahi Bajaj Sagar', state: 'Gujarat & Rajasthan', lat: 21.83, lng: 73.75, stars: 3, primaryFact: 'Sardar Sarovar Project is on the Narmada River (Gujarat); Ukai & Kakrapada projects are on the Tapi River; Mahi Bajaj Sagar is on the Mahi River.', tributaryOrRange: 'Includes Dhuvaran Thermal Power Station (Kheda district, Gujarat).', examHighlight: 'Sardar Sarovar = Narmada | Ukai & Kakrapada = Tapi | Mahi Bajaj = Mahi.', landscapeType: 'dam', elevationOrCapacity: 'Narmada & Tapi Basin', riverSystemId: 'riv-narmada-tapi' },
  { id: 'dam-hirakud', category: 'Rivers & Hydro Dams', shortLabel: 'Hirakud Project & Mahanadi Delta', title: 'Hirakud Multipurpose Project & Mahanadi Delta Project (Talcher)', state: 'Odisha', lat: 21.52, lng: 83.87, stars: 3, primaryFact: 'Hirakud Multipurpose Project is built on the Mahanadi River in Odisha; Mahanadi Delta Project is associated near Talcher.', tributaryOrRange: 'Hirakud Reservoir is also a designated Ramsar Wetland Site (12.10.2021).', examHighlight: 'Hirakud Multipurpose Project is on River Mahanadi in Odisha.', landscapeType: 'dam', elevationOrCapacity: 'Mahanadi · Odisha', riverSystemId: 'riv-peninsular' },
  { id: 'dam-nagarjuna', category: 'Rivers & Hydro Dams', shortLabel: 'Nagarjuna Sagar, Pochampad & Sileru', title: 'Nagarjuna Sagar (Krishna), Pochampad (Godavari) & Lower Sileru', state: 'Telangana & Andhra Pradesh', lat: 16.57, lng: 79.31, stars: 3, primaryFact: 'Nagarjuna Sagar & Bheema Lift Irrigation are on River Krishna; Pochampad is on River Godavari; Lower Sileru is on River Sileru (Godavari basin).', tributaryOrRange: 'Tungabhadra & Upper Krishna projects span Karnataka & AP/Telangana.', examHighlight: 'Nagarjuna Sagar = Krishna | Pochampad = Godavari.', landscapeType: 'dam', elevationOrCapacity: 'Krishna & Godavari', riverSystemId: 'riv-peninsular' },
  { id: 'dam-idukki', category: 'Rivers & Hydro Dams', shortLabel: 'Idukki (Periyar), Sabargiri & Koyna', title: 'Idukki (Cheruthoni/Periyar), Sabargiri (Kerala) & Koyna (Maharashtra)', state: 'Kerala & Maharashtra', lat: 9.84, lng: 76.97, stars: 3, primaryFact: 'Idukki Project is on River Periyar (Cheruthoni Dam) and Sabargiri is on Pamba-Kakki in Kerala; Koyna Project is on River Koyna in Maharashtra.', tributaryOrRange: 'Includes Koradi Thermal Station (Nagpur) and Kundah / Neyveli in Tamil Nadu.', examHighlight: 'Idukki Project uses Cheruthoni Dam on River Periyar.', landscapeType: 'dam', elevationOrCapacity: 'Periyar & Koyna', riverSystemId: 'riv-peninsular' },
  { id: 'dam-rihand-kosi', category: 'Rivers & Hydro Dams', shortLabel: 'Rihand, Mata-Tila, Ban Sagar, Kosi & Gandak', title: 'Rihand (UP), Mata-Tila (Betwa), Ban Sagar (Sone), Kosi & Gandak', state: 'UP, Bihar & MP', lat: 24.2, lng: 83.0, stars: 3, primaryFact: 'Rihand Scheme (UP), Mata-Tila (Betwa), Ban Sagar (Sone), Kosi Project (Bihar), and Gandak Project (UP & Bihar) are key river valley projects.', tributaryOrRange: 'Includes Chambal Project (MP & Rajasthan), Obra (UP) & Ramganga (Uttarakhand).', examHighlight: 'Kosi = Flood control & irrigation in Bihar | Ban Sagar = River Sone.', landscapeType: 'dam', elevationOrCapacity: 'Ganga & Son Basin', riverSystemId: 'riv-ganga' },

  { id: 'mt-zojila', category: 'Mountains & Passes', shortLabel: 'Zoji La Pass (Srinagar–Leh)', title: 'Zoji La Pass (Ladakh)', state: 'Ladakh', lat: 34.28, lng: 75.47, stars: 3, primaryFact: 'Connects Srinagar and Leh along the NH1 highway corridor.', tributaryOrRange: 'Western Himalayan / Ladakh mountain pass.', examHighlight: 'Zoji La connects Srinagar & Leh on NH1.', landscapeType: 'mountain', elevationOrCapacity: 'Srinagar–Leh · NH1', riverSystemId: 'riv-indus' },
  { id: 'mt-nathula', category: 'Mountains & Passes', shortLabel: 'Nathu La Pass (Sikkim)', title: 'Nathu La Pass (Sikkim)', state: 'Sikkim', lat: 27.39, lng: 88.83, stars: 3, primaryFact: 'High mountain pass in Sikkim connecting India and Tibet along the ancient Silk Route corridor.', tributaryOrRange: 'Eastern Himalayan pass in Sikkim.', examHighlight: 'Nathu La Pass is located in Sikkim.', landscapeType: 'mountain', elevationOrCapacity: 'Sikkim · Silk Route', riverSystemId: 'riv-brahmaputra' },
  { id: 'mt-mtabu', category: 'Mountains & Passes', shortLabel: 'Mt. Abu Sanctuary (Rajasthan)', title: 'Mount Abu Wildlife Sanctuary & Aravalli Belt', state: 'Rajasthan', lat: 24.6, lng: 72.71, stars: 3, primaryFact: 'Listed under Rajasthan wildlife sanctuaries with Tiger, Leopard, Sambhar, Jungle cat, Wild boar, Pangolin & Sloth bear.', tributaryOrRange: 'Aravalli hill region in Rajasthan.', examHighlight: 'Mt. Abu Wildlife Sanctuary is in Rajasthan.', landscapeType: 'mountain', elevationOrCapacity: 'Mt. Abu · Rajasthan' },

  { id: 'nuc-kalpakkam', category: 'Nuclear, Ports & ISRO', shortLabel: 'Kalpakkam Atomic & Arikamedu', title: 'Kalpakkam Atomic Power Project (TN) & Arikamedu (Pondicherry)', state: 'Tamil Nadu & Puducherry', lat: 12.52, lng: 80.17, stars: 3, primaryFact: 'Kalpakkam Project is a major Atomic Power Project in Tamil Nadu; Arikamedu near Pondicherry is noted as an ancient sea-port.', tributaryOrRange: 'Coastal power & historical port sites of south-east India.', examHighlight: 'Kalpakkam is an Atomic Power Project in Tamil Nadu.', landscapeType: 'nuclear', elevationOrCapacity: 'Atomic · Kalpakkam', riverSystemId: 'riv-peninsular' },

  { id: 'unesco-ajanta-aihole', category: 'UNESCO, Temples & Dances', shortLabel: 'Ajanta Caves, Aihole, Badami & Belur', title: 'Ajanta Caves (MH), Aihole, Badami & Belur (Karnataka)', state: 'Maharashtra & Karnataka', lat: 20.55, lng: 75.7, stars: 3, primaryFact: 'Ajanta Caves (29 rock-cut Buddhist caves, 2nd century BC–7th century AD); Aihole, Badami & Belur (Chenna Kesava temple) showcase Chalukyan & Hoysala art.', tributaryOrRange: 'Includes Bhubaneswar (Lingraja, Rajarani, Brahmesvara temples in Odisha), Amaravati & Ayodhya.', examHighlight: 'Belur is famous for the Hoysala-period Chenna Kesava temple.', landscapeType: 'temple', elevationOrCapacity: 'Rock-Cut & Temple Art' },

  { id: 'wb-dvc-kolkata', category: 'WB JE Special', shortLabel: 'DVC, Kolkata, Sunderbans & Chittaranjan', title: 'Damodar Valley Project, Sunderbans, Kolkata (Hooghly) & Chittaranjan', state: 'West Bengal', lat: 22.57, lng: 88.36, stars: 3, primaryFact: 'Damodar Valley Project spans Jharkhand & West Bengal; Sunderbans NP & Ramsar wetland, Jaldapara Sanctuary, Kolkata (Hooghly) & Chittaranjan (Locomotives) are key WB landmarks.', tributaryOrRange: 'Includes East Kolkata Wetlands & Bakkhali in Ramsar wetlands list.', examHighlight: 'Chittaranjan (West Bengal) is associated with Locomotives; Kolkata lies on Hooghly.', landscapeType: 'dam', elevationOrCapacity: 'WB · DVC & Sunderbans', riverSystemId: 'riv-ganga' },
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
// 4. MAIN PAGE COMPONENT (VOLT OS FIRST + BOTTOM-RIGHT SWITCH + 3 TABS)
// ============================================================================
export default function Page() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])

  const [studioOpen, setStudioOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'chrono' | 'vault' | 'topograph'>('chrono')

  // Tab 1 State
  const [selectedEra, setSelectedEra] = useState<Era>('Modern')
  const [selectedLeafId, setSelectedLeafId] = useState<string>('hl-1919-jallianwala')
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

      {/* 2. BOTTOM-RIGHT SWITCH PILL ON VOLT OS */}
      {!studioOpen && (
        <div className="fixed right-4 bottom-4 z-[9990]">
          <button
            onClick={() => setStudioOpen(true)}
            title="Open Chrono-Roots, Constitutional Vault & 3D TopoGraph"
            className="flex items-center gap-2 rounded-full border border-cyan-300 bg-slate-950/95 px-4 py-2 text-xs font-bold tracking-wide text-cyan-100 shadow-[0_0_24px_rgba(34,211,238,0.45)] backdrop-blur-md transition hover:border-white hover:bg-cyan-500/25 hover:text-white"
          >
            <span className="size-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]" />
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
                          <strong>Basis:</strong> {activeLocker.borrowedFrom} | <strong>Schedule/Notes:</strong> {activeLocker.scheduleLink}
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
                  placeholder="Search park, dam, Ramsar, state..."
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
                      <strong>⚡ Exam Pointer:</strong> {activePin.examHighlight}
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
