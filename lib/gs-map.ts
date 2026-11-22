export type TopoCategory =
  | 'All'
  | 'Sanctuaries & National Parks'
  | 'Ramsar Wetlands'
  | 'Tiger Reserves'
  | 'Dams & Power Projects'
  | 'Heritage, Cities & Industry'

export type LandscapeType = 'mountain' | 'dam' | 'park' | 'bird' | 'nuclear' | 'temple'

export interface GeoPin {
  id: string
  category: Exclude<TopoCategory, 'All'>
  shortLabel: string
  title: string
  state: string
  lat: number
  lng: number
  stars: 1 | 2 | 3
  typeLabel: string
  note: string
  landscapeType: LandscapeType
  riverSystemId?: string
}

type RawPin = [
  string, // shortLabel
  string, // state / location
  number, // lat
  number, // lng
  string, // typeLabel
  string, // note
  LandscapeType,
  (1 | 2 | 3)?,
  string? // riverSystemId
]

function buildPins(
  category: Exclude<TopoCategory, 'All'>,
  prefix: string,
  rows: RawPin[]
): GeoPin[] {
  return rows.map(([shortLabel, state, lat, lng, typeLabel, note, landscapeType, stars, riverSystemId], idx) => ({
    id: `${prefix}-${idx + 1}`,
    category,
    shortLabel,
    title: shortLabel,
    state,
    lat,
    lng,
    stars: stars ?? 2,
    typeLabel,
    note,
    landscapeType,
    riverSystemId,
  }))
}

const PARK_ROWS: RawPin[] = [
  ["Bandipur National Park", "Chamarajanagar, Karnataka", 11.66, 76.63, "National Park", "Important species: Elephant, Tiger, Bear, Sambhar, Panther.", "park", 3, "riv-peninsular"],
  ["Bhimbandh Sanctuary", "Munger, Bihar", 25.06, 86.40, "Wildlife Sanctuary", "Protected forest sanctuary in Bihar.", "park", 2, "riv-ganga"],
  ["Chandraprabha Sanctuary", "Chandauli, Uttar Pradesh", 24.94, 83.17, "Wildlife Sanctuary", "Wildlife sanctuary in eastern Uttar Pradesh.", "park", 2, "riv-ganga"],
  ["Corbett National Park", "Nainital, Uttarakhand", 29.53, 78.77, "National Park (1st NP)", "Est. 1936 (earlier Hailey NP); Elephant, Tiger, Sloth bear, Nilgai, Panther, Sambhar.", "park", 3, "riv-ganga"],
  ["Dachigam National Park", "Jammu and Kashmir", 34.14, 75.04, "National Park", "Famous habitat of Kashmir Stag (Hangul).", "park", 3, "riv-indus"],
  ["Dudhwa National Park", "Lakhimpur Kheri, UP", 28.49, 80.68, "National Park", "Important species: Tiger, Panther, Sambhar, Nilgai.", "park", 3, "riv-ganga"],
  ["Ghana Bird Sanctuary (Keoladeo)", "Bharatpur, Rajasthan", 27.16, 77.52, "Bird Sanctuary", "Famous for Siberian Crane, Spoonbill, Heron teal & Stork.", "bird", 3, "riv-ganga"],
  ["Gir National Park", "Junagadh, Gujarat", 21.12, 70.82, "National Park", "Famous for Asiatic Lion, Panther, Sambhar, Nilgai & Crocodile.", "park", 3],
  ["Hazaribagh National Park", "Hazaribagh, Jharkhand", 24.13, 85.39, "National Park", "Tiger, Leopard, Sambhar, Chital.", "park", 2, "riv-ganga"],
  ["Jaldapara Sanctuary", "West Bengal", 26.64, 89.29, "Wildlife Sanctuary", "Tiger, Leopard, Sambhar, Chital & Rhino habitat.", "park", 3, "riv-brahmaputra"],
  ["Kanger Ghati National Park", "Bastar, Chhattisgarh", 18.88, 81.95, "National Park", "Tiger, Leopard, Panther, Wild boar, Sambhar.", "park", 2, "riv-peninsular"],
  ["Kanha National Park", "Mandla & Balaghat, MP", 22.33, 80.61, "National Park", "Tiger, Panther, Wild buffalo, Barasingha.", "park", 3, "riv-narmada-tapi"],
  ["Kaziranga National Park", "Assam", 26.58, 93.17, "National Park", "Famous for Great Indian one-horned Rhinoceros, Wild buffalo, Sambhar.", "park", 3, "riv-brahmaputra"],
  ["Manas National Park", "Barpeta Road, Assam", 26.66, 91.00, "National Park", "Tiger, Elephant, Wild buffalo, One-horned Rhinoceros.", "park", 3, "riv-brahmaputra"],
  ["Mt. Abu Wildlife Sanctuary", "Rajasthan", 24.59, 72.71, "Wildlife Sanctuary", "Tiger, Leopard, Sambhar, Jungle cat, Wild boar, Pangolin, Sloth bear.", "mountain", 2],
  ["Mudumalai Sanctuary", "Nilgiri Hills, Tamil Nadu", 11.56, 76.53, "Wildlife Sanctuary", "Elephant, Deer, Pigs.", "park", 2, "riv-peninsular"],
  ["Namdapha National Park", "Changlang, Arunachal Pradesh", 27.49, 96.39, "National Park", "Tiger, Elephant, Panther, Leopard.", "park", 3, "riv-brahmaputra"],
  ["Palamau Tiger Reserve", "Latehar, Jharkhand", 23.85, 84.19, "Tiger Reserve", "Tiger, Panther, Chital, Nilgai.", "park", 2, "riv-ganga"],
  ["Pench National Park", "Seoni, Madhya Pradesh", 21.70, 79.31, "National Park", "Tiger, Panther, Wild boar, Gaur, Sambhar.", "park", 2, "riv-narmada-tapi"],
  ["Periyar National Park", "Idukki, Kerala", 9.46, 77.24, "National Park", "Elephant, Tiger, Panther, Wild boar, Gaur, Sambhar.", "park", 3, "riv-peninsular"],
  ["Ranganathittu Bird Sanctuary", "Karnataka", 12.42, 76.66, "Bird Sanctuary", "Premier riverine bird sanctuary on the Cauvery.", "bird", 3, "riv-peninsular"],
  ["Silent Valley National Park", "Palakkad, Kerala", 11.13, 76.43, "National Park", "Tropical evergreen rainforest; Tiger & Birds.", "park", 3, "riv-peninsular"],
  ["Sunderbans National Park", "West Bengal", 21.95, 88.90, "National Park", "Bengal Tiger, Wild boar, Crocodile, Deer.", "park", 3, "riv-ganga"],
  ["Vedanthangal Bird Sanctuary", "Tamil Nadu", 12.54, 79.85, "Bird Sanctuary", "Historic water-bird sanctuary in Tamil Nadu.", "bird", 3, "riv-peninsular"],
  ["Wild Ass Sanctuary", "Little Rann of Kutch, Gujarat", 23.45, 71.40, "Wildlife Sanctuary", "Wild Ass, Wolf, Nilgai, Chinkara.", "park", 3],
  ["Mahatma Gandhi Marine NP", "Wandoor (Port Blair), A&N", 11.58, 92.61, "Marine National Park", "Turtle, Crocodile, Coral reef, Sea fans, Shark, Moray eels, Manta ray.", "park", 3],
]

const RAMSAR_ROWS: RawPin[] = [
  ["Kolleru Lake", "Andhra Pradesh", 16.62, 81.20, "Ramsar Wetland", "Declared 19.08.2002.", "bird", 2, "riv-peninsular"],
  ["Deepor Beel", "Assam", 26.12, 91.66, "Ramsar Wetland", "Declared 19.08.2002.", "bird", 2, "riv-brahmaputra"],
  ["Kabartal Wetland", "Bihar", 25.63, 86.15, "Ramsar Wetland", "Declared 21.07.2020.", "bird", 2, "riv-ganga"],
  ["Nagi Bird Sanctuary", "Bihar", 24.83, 86.40, "Ramsar Wetland", "Declared 04.06.2024.", "bird", 2, "riv-ganga"],
  ["Nakti Bird Sanctuary", "Bihar", 24.86, 86.45, "Ramsar Wetland", "Declared 04.06.2024.", "bird", 2, "riv-ganga"],
  ["Nanda Lake", "Goa", 15.23, 74.11, "Ramsar Wetland", "Declared 06.08.2022.", "bird", 2],
  ["Khijadiya Wildlife Sanctuary", "Gujarat", 22.52, 70.14, "Ramsar Wetland", "Declared 13.04.2022.", "bird", 2],
  ["Nalsarovar Bird Sanctuary", "Gujarat", 22.78, 72.04, "Ramsar Wetland", "Declared 24.09.2012.", "bird", 3],
  ["Thol Lake Wildlife Sanctuary", "Gujarat", 23.14, 72.41, "Ramsar Wetland", "Declared 05.04.2021.", "bird", 2],
  ["Wadhvana Wetland", "Gujarat", 22.17, 73.48, "Ramsar Wetland", "Declared 05.04.2021.", "bird", 2],
  ["Bhindawas Wildlife Sanctuary", "Haryana", 28.54, 76.55, "Ramsar Wetland", "Declared 25.05.2021.", "bird", 2, "riv-ganga"],
  ["Sultanpur National Park", "Haryana", 28.46, 76.89, "Ramsar Wetland", "Declared 25.05.2021.", "bird", 3, "riv-ganga"],
  ["Chandratal Wetland", "Himachal Pradesh", 32.48, 77.62, "Ramsar Wetland", "Declared 08.11.2005.", "mountain", 2, "riv-indus"],
  ["Pong Dam Lake", "Himachal Pradesh", 32.02, 76.08, "Ramsar Wetland", "Declared 19.08.2002.", "dam", 2, "riv-indus"],
  ["Renuka Wetland", "Himachal Pradesh", 30.61, 77.45, "Ramsar Wetland", "Declared 08.11.2005.", "bird", 3, "riv-ganga"],
  ["Hokera Wetland", "Jammu and Kashmir", 34.10, 74.72, "Ramsar Wetland", "Declared 08.11.2005.", "bird", 2, "riv-indus"],
  ["Hygam & Shalbugh Wetlands", "Jammu and Kashmir", 34.23, 74.51, "Ramsar Wetland", "Both declared 13.08.2022.", "bird", 2, "riv-indus"],
  ["Udhwa Lake Bird Sanctuary", "Jharkhand", 24.99, 87.81, "Ramsar Wetland", "Declared 02.02.2025.", "bird", 3, "riv-ganga"],
  ["Ankasamudra Bird Reserve", "Karnataka", 15.13, 76.22, "Ramsar Wetland", "Declared 31.01.2024.", "bird", 2, "riv-peninsular"],
  ["Aghanashini Estuary", "Karnataka", 14.52, 74.36, "Ramsar Wetland", "Declared 31.01.2024.", "bird", 2],
  ["Magadi Kere Reserve", "Karnataka", 15.22, 75.52, "Ramsar Wetland", "Declared 31.01.2024.", "bird", 2],
  ["Ashtamudi Wetland", "Kerala", 8.95, 76.57, "Ramsar Wetland", "Declared 19.08.2002.", "bird", 2],
  ["Sasthamkotta Lake", "Kerala", 9.04, 76.63, "Ramsar Wetland", "Declared 19.08.2002.", "bird", 2],
  ["Vembanad Kol Wetland", "Kerala", 9.60, 76.40, "Ramsar Wetland", "Declared 19.08.2002.", "bird", 3],
  ["Tso Kar Wetland Complex", "Ladakh", 33.31, 78.01, "Ramsar Wetland", "Declared 17.11.2020.", "mountain", 3, "riv-indus"],
  ["Bhoj Wetland", "Madhya Pradesh", 23.24, 77.34, "Ramsar Wetland", "Declared 19.08.2002.", "bird", 2, "riv-narmada-tapi"],
  ["Sakhya Sagar", "Madhya Pradesh", 25.43, 77.71, "Ramsar Wetland", "Declared 07.01.2022.", "bird", 2, "riv-ganga"],
  ["Sirpur & Yashwant Sagar", "Indore, Madhya Pradesh", 22.70, 75.81, "Ramsar Wetland", "Sirpur (07.01.2022) & Yashwant Sagar (22.06.2024).", "bird", 2, "riv-narmada-tapi"],
  ["Tawa Reservoir (Ramsar)", "Madhya Pradesh", 22.56, 77.98, "Ramsar Wetland", "Declared 22.06.2024.", "dam", 2, "riv-narmada-tapi"],
  ["Lonar Lake", "Maharashtra", 19.98, 76.51, "Ramsar Wetland", "Declared 22.07.2020.", "bird", 3],
  ["Nandur Madhameshwar", "Maharashtra", 20.01, 74.11, "Ramsar Wetland", "Declared 21.06.2019.", "bird", 2, "riv-peninsular"],
  ["Thane Creek", "Maharashtra", 19.12, 72.97, "Ramsar Wetland", "Declared 13.08.2022.", "bird", 2],
  ["Loktak Lake", "Manipur", 24.55, 93.81, "Ramsar Wetland", "Declared 23.03.1990.", "bird", 3, "riv-brahmaputra"],
  ["Pala Wetland", "Mizoram", 22.19, 92.90, "Ramsar Wetland", "Declared 31.08.2021.", "bird", 2],
  ["Ansupa Lake", "Odisha", 20.46, 85.60, "Ramsar Wetland", "Declared 13.08.2022.", "bird", 2, "riv-peninsular"],
  ["Bhitarakanika Mangroves", "Odisha", 20.71, 86.87, "Ramsar Wetland", "Declared 19.08.2002.", "park", 3, "riv-peninsular"],
  ["Chilika Lake", "Odisha", 19.69, 85.32, "Ramsar Wetland", "Declared 01.10.1981 (India's 1st Ramsar site).", "bird", 3, "riv-peninsular"],
  ["Hirakud Reservoir (Ramsar)", "Odisha", 21.57, 83.87, "Ramsar Wetland", "Declared 12.10.2021.", "dam", 2, "riv-peninsular"],
  ["Tampara Lake", "Odisha", 19.35, 85.00, "Ramsar Wetland", "Declared 13.08.2022.", "bird", 2, "riv-peninsular"],
  ["Beas Conservation Reserve", "Punjab", 31.40, 75.20, "Ramsar Wetland", "Declared 26.09.2019.", "bird", 2, "riv-indus"],
  ["Harike Lake", "Punjab", 31.15, 74.95, "Ramsar Wetland", "Declared 23.03.1990.", "bird", 3, "riv-indus"],
  ["Kanjli Lake", "Punjab", 31.41, 75.37, "Ramsar Wetland", "Declared 22.01.2002.", "bird", 2, "riv-indus"],
  ["Keshopur-Miani Reserve", "Punjab", 32.09, 75.40, "Ramsar Wetland", "Declared 26.09.2019.", "bird", 2, "riv-indus"],
  ["Nangal Wildlife Sanctuary", "Punjab", 31.39, 76.37, "Ramsar Wetland", "Declared 26.09.2019.", "bird", 2, "riv-indus"],
  ["Ropar Lake", "Punjab", 30.98, 76.52, "Ramsar Wetland", "Declared 22.01.2002.", "bird", 2, "riv-indus"],
  ["Sambhar Lake", "Rajasthan", 26.92, 75.09, "Ramsar Wetland", "Declared 23.03.1990.", "bird", 3],
  ["Khecheopalri Wetland", "Sikkim", 27.35, 88.19, "Ramsar Wetland", "Declared 02.02.2025.", "mountain", 3, "riv-brahmaputra"],
  ["Gulf of Mannar Marine Reserve", "Tamil Nadu", 9.12, 79.05, "Ramsar Wetland", "Declared 04.08.2022.", "bird", 3],
  ["Karaivetti Bird Sanctuary", "Tamil Nadu", 10.97, 79.04, "Ramsar Wetland", "Declared 31.01.2024.", "bird", 2, "riv-peninsular"],
  ["Koonthankulam Bird Sanctuary", "Tamil Nadu", 8.49, 77.76, "Ramsar Wetland", "Declared 08.11.2021.", "bird", 2],
  ["Longwood Shola Reserve", "Tamil Nadu", 11.43, 76.88, "Ramsar Wetland", "Declared 04.08.2022.", "park", 2],
  ["Pallikaranai Marsh Reserve", "Chennai, Tamil Nadu", 12.94, 80.22, "Ramsar Wetland", "Declared 31.01.2024.", "bird", 2],
  ["Pichavaram Mangrove", "Tamil Nadu", 11.43, 79.78, "Ramsar Wetland", "Declared 04.08.2022.", "park", 3],
  ["Point Calimere Bird Sanctuary", "Tamil Nadu", 10.30, 79.85, "Ramsar Wetland", "Declared 19.08.2002.", "bird", 3],
  ["Udhayamarthandapuram & Vaduvur", "Tamil Nadu", 10.45, 79.56, "Ramsar Wetland", "Udhayamarthandapuram (08.11.2021) & Vaduvur (04.08.2022).", "bird", 1],
  ["Vellode Bird Sanctuary", "Tamil Nadu", 11.26, 77.66, "Ramsar Wetland", "Declared 04.08.2022.", "bird", 1],
  ["Vembannur & Suchindram Theroor", "Tamil Nadu", 8.16, 77.45, "Ramsar Wetland", "Suchindram Theroor (08.11.2021) & Vembannur (04.08.2022).", "bird", 1],
  ["Chitrangudi & Kanjirankulam", "Tamil Nadu", 9.33, 78.48, "Ramsar Wetland", "Both declared 08.11.2021.", "bird", 1],
  ["Rudrasagar Lake", "Tripura", 23.49, 91.32, "Ramsar Wetland", "Declared 08.11.2005.", "bird", 2],
  ["Haiderpur & Upper Ganga Ramsar", "Uttar Pradesh", 29.40, 78.01, "Ramsar Wetland", "Key UP Ganga basin Ramsar wetlands.", "bird", 2, "riv-ganga"],
  ["UP Bird Ramsar Belt (Sur Sarovar, Saman, Sandi, Samaspur, Parvati Agra, Sarsai Nawar)", "Uttar Pradesh", 27.25, 78.90, "Ramsar Wetland", "Cluster of UP Ramsar bird sanctuaries.", "bird", 2, "riv-ganga"],
  ["Asan Conservation Reserve", "Uttarakhand", 30.44, 77.67, "Ramsar Wetland", "Uttarakhand Ramsar wetland site.", "bird", 2, "riv-ganga"],
  ["East Kolkata Wetlands & Bakkhali", "West Bengal", 22.54, 88.45, "Ramsar Wetland", "West Bengal coastal & urban Ramsar wetlands alongside Sunderbans.", "bird", 3, "riv-ganga"],
]

const TIGER_ROWS: RawPin[] = [
  ["Nagarjunsagar Srisailam TR", "Andhra Pradesh", 16.12, 78.87, "Tiger Reserve", "Major Tiger Reserve in Andhra Pradesh.", "park", 3, "riv-peninsular"],
  ["Kamlang Tiger Reserve (50th TR)", "Arunachal Pradesh", 27.78, 96.45, "Tiger Reserve", "50th Tiger Reserve in India (as on 16 May 2025).", "park", 3, "riv-brahmaputra"],
  ["Pakke Tiger Reserve", "Arunachal Pradesh", 27.08, 92.85, "Tiger Reserve", "Tiger Reserve in Arunachal Pradesh.", "park", 2, "riv-brahmaputra"],
  ["Nameri Tiger Reserve", "Assam", 26.94, 92.84, "Tiger Reserve", "Assam Tiger Reserve.", "park", 2, "riv-brahmaputra"],
  ["Orang Tiger Reserve (49th TR)", "Assam", 26.55, 92.33, "Tiger Reserve", "49th Tiger Reserve in India.", "park", 3, "riv-brahmaputra"],
  ["Valmiki Tiger Reserve", "Bihar", 27.43, 84.08, "Tiger Reserve", "Bihar Tiger Reserve.", "park", 3, "riv-ganga"],
  ["Udanti-Sitanadi TR", "Chhattisgarh", 20.17, 82.12, "Tiger Reserve", "Chhattisgarh Tiger Reserve.", "park", 2],
  ["Achanakmar TR", "Chhattisgarh", 22.41, 81.77, "Tiger Reserve", "Chhattisgarh Tiger Reserve.", "park", 2],
  ["Indravati TR", "Chhattisgarh", 19.20, 80.50, "Tiger Reserve", "Chhattisgarh Tiger Reserve.", "park", 2, "riv-peninsular"],
  ["Guru Ghasidas Tamor Pingla TR", "Chhattisgarh", 23.62, 82.55, "Tiger Reserve", "Chhattisgarh Tiger Reserve.", "park", 3],
  ["Bhadra TR", "Karnataka", 13.69, 75.64, "Tiger Reserve", "Karnataka Tiger Reserve.", "park", 2],
  ["Dandeli-Anshi TR", "Karnataka", 15.05, 74.45, "Tiger Reserve", "Karnataka Tiger Reserve.", "park", 2],
  ["Nagarahole TR", "Karnataka", 12.03, 76.12, "Tiger Reserve", "Karnataka Tiger Reserve.", "park", 3, "riv-peninsular"],
  ["Biligiri Ranganatha Temple (BRT) TR", "Karnataka", 11.99, 77.14, "Tiger Reserve", "Karnataka Tiger Reserve.", "park", 2],
  ["Parambikulam TR", "Kerala", 10.39, 76.78, "Tiger Reserve", "Kerala Tiger Reserve.", "park", 2],
  ["Bandhavgarh TR", "Madhya Pradesh", 23.72, 81.02, "Tiger Reserve", "Madhya Pradesh Tiger Reserve.", "park", 3],
  ["Panna TR", "Madhya Pradesh", 24.72, 79.96, "Tiger Reserve", "Madhya Pradesh Tiger Reserve.", "park", 3],
  ["Satpura TR", "Madhya Pradesh", 22.49, 78.26, "Tiger Reserve", "Madhya Pradesh Tiger Reserve.", "park", 2, "riv-narmada-tapi"],
  ["Sanjay Dubri TR", "Madhya Pradesh", 23.95, 81.95, "Tiger Reserve", "Madhya Pradesh Tiger Reserve.", "park", 2],
  ["Veerangana Durgavati TR", "Madhya Pradesh", 23.45, 79.68, "Tiger Reserve", "Madhya Pradesh Tiger Reserve.", "park", 3],
  ["Madhav Tiger Reserve (58th TR)", "Madhya Pradesh", 25.44, 77.69, "Tiger Reserve", "58th Tiger Reserve in India (as on 16 May 2025).", "park", 3, "riv-ganga"],
  ["Melghat TR", "Maharashtra", 21.41, 77.18, "Tiger Reserve", "Maharashtra Tiger Reserve.", "park", 2, "riv-narmada-tapi"],
  ["Tadoba-Andhari TR", "Maharashtra", 20.24, 79.36, "Tiger Reserve", "Maharashtra Tiger Reserve.", "park", 3],
  ["Sahyadri TR", "Maharashtra", 17.30, 73.76, "Tiger Reserve", "Maharashtra Tiger Reserve.", "park", 2],
  ["Bor & Navegaon-Nagzira TR", "Maharashtra", 21.10, 79.80, "Tiger Reserve", "Maharashtra Tiger Reserves.", "park", 2],
  ["Dampa TR", "Mizoram", 23.59, 92.39, "Tiger Reserve", "Mizoram Tiger Reserve.", "park", 2],
  ["Similipal & Satkosia TR", "Odisha", 21.75, 86.33, "Tiger Reserve", "Odisha Tiger Reserves.", "park", 3, "riv-peninsular"],
  ["Ranthambhore & Sariska TR", "Rajasthan", 26.02, 76.50, "Tiger Reserve", "Rajasthan Tiger Reserves.", "park", 3, "riv-ganga"],
  ["Mukundra, Ramgarh Vishdhari & Dholpur Karauli TR", "Rajasthan", 25.55, 75.85, "Tiger Reserve", "Rajasthan Tiger Reserves.", "park", 2, "riv-ganga"],
  ["Kalakad Mundanthurai, Anamalai, Sathyamangalam & Srivilliputhur TR", "Tamil Nadu", 10.35, 77.05, "Tiger Reserve", "Tamil Nadu Tiger Reserves alongside Mudumalai TR.", "park", 2],
  ["Kawal & Amrabad TR", "Telangana", 19.12, 78.95, "Tiger Reserve", "Telangana Tiger Reserves.", "park", 2, "riv-peninsular"],
  ["Pilibhit & Ranipur TR", "Uttar Pradesh", 28.69, 80.02, "Tiger Reserve", "UP Tiger Reserves alongside Dudhwa TR.", "park", 2, "riv-ganga"],
  ["Rajaji TR", "Uttarakhand", 30.06, 78.18, "Tiger Reserve", "Uttarakhand Tiger Reserve alongside Jim Corbett TR.", "park", 2, "riv-ganga"],
  ["Buxa Tiger Reserve", "West Bengal", 26.65, 89.58, "Tiger Reserve", "West Bengal Tiger Reserve alongside Sunderbans TR.", "park", 3, "riv-brahmaputra"],
]

const DAM_POWER_ROWS: RawPin[] = [
  ["Nagarjuna Sagar Multipurpose Project", "River Krishna, Telangana", 16.57, 79.31, "Irrigation & Hydro", "Major Krishna River project in Telangana.", "dam", 3, "riv-peninsular"],
  ["Pochampad Project", "River Godavari, Telangana", 18.97, 78.34, "Irrigation Project", "Godavari River project in Telangana.", "dam", 2, "riv-peninsular"],
  ["Lower Sileru Project", "River Sileru (Godavari Basin), AP/TS", 17.93, 81.66, "Hydro-electricity", "Between Telangana and Andhra Pradesh.", "dam", 2, "riv-peninsular"],
  ["Kakrapada Project", "River Tapi, Gujarat", 21.24, 73.35, "Irrigation Project", "Tapi River project in Gujarat.", "dam", 2, "riv-narmada-tapi"],
  ["Kalpakkam Project", "Tamil Nadu", 12.56, 80.17, "Atomic Power Project", "Atomic Power Station in Tamil Nadu.", "nuclear", 3],
  ["Kosi Project", "River Kosi, Bihar", 26.52, 86.93, "Flood Control & Irrigation", "Major Kosi River project in Bihar.", "dam", 3, "riv-ganga"],
  ["Gandak Project", "River Gandak, UP & Bihar", 27.44, 83.91, "Irrigation & Hydro", "Joint UP & Bihar project on Gandak.", "dam", 2, "riv-ganga"],
  ["Dhuvaran Power Station", "Kheda District, Gujarat", 22.24, 72.75, "Thermal Power Project", "Thermal power plant in Kheda, Gujarat.", "nuclear", 2],
  ["Sabarigiri (Pamba-Kakki) Project", "River Pamba-Kakki, Kerala", 9.39, 77.12, "Hydro-electricity", "Hydro project in Kerala.", "dam", 2],
  ["Idukki Project (Cheruthoni Dam)", "River Periyar, Kerala", 9.84, 76.97, "Hydro-electricity", "Major Periyar River hydro project in Kerala.", "dam", 3],
  ["Tawa Project", "River Tawa (Narmada Basin), MP", 22.52, 77.95, "Irrigation Project", "Narmada basin project in Madhya Pradesh.", "dam", 2, "riv-narmada-tapi"],
  ["Chambal Project", "River Chambal, RJ & MP", 24.71, 75.55, "Irrigation & Hydro", "Joint Rajasthan & Madhya Pradesh project.", "dam", 3, "riv-ganga"],
  ["Kota Power Station", "Near Kota (Chambal), Rajasthan", 25.17, 75.82, "Thermal Power Project", "Thermal power station on Chambal.", "nuclear", 2, "riv-ganga"],
  ["Satpura Power Station", "Patharkheda, Betul, MP", 22.11, 78.17, "Thermal Power Project", "Thermal power project in Betul, MP.", "nuclear", 2, "riv-narmada-tapi"],
  ["Koyna Project", "River Koyna, Maharashtra", 17.40, 73.75, "Hydro-electricity", "Major hydro project in Maharashtra.", "dam", 3, "riv-peninsular"],
  ["Koradi Power Station", "Koradi, Near Nagpur, MH", 21.25, 79.10, "Thermal Power Project", "Thermal power station near Nagpur.", "nuclear", 2],
  ["Upper Krishna Project", "River Krishna, Karnataka", 16.33, 75.89, "Irrigation & Hydro", "Krishna River project in Karnataka.", "dam", 2, "riv-peninsular"],
  ["Tungabhadra Multipurpose Project", "River Tungabhadra, KA & AP", 15.26, 76.33, "Irrigation & Hydro", "Joint Karnataka & Andhra Pradesh project.", "dam", 3, "riv-peninsular"],
  ["Sharavati Project", "River Sharavati (Jog Falls), KA", 14.23, 74.81, "Hydro-electricity", "Hydro-electricity project near Jog Falls, Karnataka.", "dam", 3],
  ["Hirakud Multipurpose Project", "River Mahanadi, Odisha", 21.52, 83.87, "Irrigation & Hydro", "Iconic Mahanadi River dam in Odisha.", "dam", 3, "riv-peninsular"],
  ["Mahanadi Delta / Talcher", "Near Talcher, Odisha", 20.95, 85.22, "Thermal / Irrigation", "Thermal power & irrigation hub near Talcher.", "dam", 2, "riv-peninsular"],
  ["Bhakra-Nangal Project", "River Sutlej, Bilaspur (HP)", 31.41, 76.43, "Irrigation & Hydro", "Serves Punjab, Haryana & Rajasthan.", "dam", 3, "riv-indus"],
  ["Indira Gandhi Nahar Project (IGNP)", "Ravi-Beas & Sutlej (Harike), RJ", 29.15, 74.20, "Irrigation Project", "Major canal irrigation network in Rajasthan.", "dam", 3, "riv-indus"],
  ["Kundah Power Station", "Tamil Nadu", 11.27, 76.62, "Hydro-electricity", "Hydro-electric station in Tamil Nadu.", "dam", 2],
  ["Neyveli Power Station", "Neyveli, Tamil Nadu", 11.55, 79.48, "Thermal Power Project", "Lignite thermal power station in Tamil Nadu.", "nuclear", 3],
  ["Ramganga Multipurpose Project", "Kalagarh, Uttarakhand", 29.52, 78.76, "Irrigation & Hydro", "Chhokar stream / Ramganga project in Uttarakhand.", "dam", 2, "riv-ganga"],
  ["Mata-Tila Multipurpose Project", "River Betwa, UP & MP", 25.10, 78.37, "Irrigation & Hydro", "Betwa River project serving UP & MP.", "dam", 2, "riv-ganga"],
  ["Rihand Scheme", "River Rihand, Uttar Pradesh", 24.20, 83.01, "Hydro-electricity", "Major UP hydro scheme on Rihand (Son basin).", "dam", 3, "riv-ganga"],
  ["Obra Power Station", "Obra, Uttar Pradesh", 24.42, 82.99, "Thermal Power Project", "Thermal power station in Uttar Pradesh.", "nuclear", 2, "riv-ganga"],
  ["Damodar Valley Project (DVC)", "River Damodar, JH & WB", 23.78, 86.81, "Flood Control & Hydro", "Jharkhand shared with West Bengal.", "dam", 3, "riv-ganga"],
  ["Ukai Project", "River Tapi, Gujarat", 21.25, 73.59, "Irrigation Project", "Major Tapi River project in Gujarat.", "dam", 2, "riv-narmada-tapi"],
  ["Mahi Bajaj Sagar Project", "River Mahi, Gujarat & Rajasthan", 23.62, 74.55, "Irrigation & Hydro", "Joint Gujarat & Rajasthan project on River Mahi.", "dam", 2, "riv-narmada-tapi"],
  ["Ghataprabha Project", "River Ghataprabha, Karnataka", 16.12, 74.66, "Irrigation Project", "Irrigation project in Karnataka.", "dam", 2, "riv-peninsular"],
  ["Bheema Lift Irrigation Project", "River Krishna, Telangana", 16.41, 77.67, "Irrigation Project", "Krishna basin lift irrigation in Telangana.", "dam", 2, "riv-peninsular"],
  ["Sardar Sarovar Project", "River Narmada, Gujarat", 21.83, 73.75, "Irrigation & Hydro", "Flagship Narmada River project in Gujarat.", "dam", 3, "riv-narmada-tapi"],
  ["Ban Sagar Project", "River Sone, MP, UP & Bihar", 24.19, 81.29, "Irrigation & Hydro", "Joint MP, UP & Bihar project on River Sone.", "dam", 2, "riv-ganga"],
]

const HERITAGE_CITY_ROWS: RawPin[] = [
  ["Ahichhatra", "Bareilly, Uttar Pradesh", 28.37, 79.13, "Historical City", "Originally Ahikshetra; ancient capital of the Panchalas.", "temple", 2, "riv-ganga"],
  ["Aihole", "Karnataka", 16.02, 75.88, "Architectural Site", "Chief site of Chalukyan architecture (~70 structural stone temples).", "temple", 3, "riv-peninsular"],
  ["Ajanta Caves", "Aurangabad, Maharashtra", 20.55, 75.70, "Rock-Cut Buddhist Caves", "29 caves with painting, sculpture & architecture (2nd c. BC to 7th c. AD).", "temple", 3],
  ["Amaravati", "Near Vijayawada, AP", 16.57, 80.36, "Historical Site", "Flourished under the Satavahana dynasty.", "temple", 2, "riv-peninsular"],
  ["Arikamedu", "Near Pondicherry", 11.90, 79.82, "Ancient Sea-Port", "Famous ancient sea-port during Chola times.", "temple", 2],
  ["Ayodhya", "Uttar Pradesh", 26.79, 82.19, "Historical City", "Ancient capital of Kosala; associated with Rama.", "temple", 3, "riv-ganga"],
  ["Badami (Vatapi)", "Karnataka", 15.92, 75.68, "Cave Temples", "Chalukyan sculpture (7th–8th c.), Dravidian style & Malegitti Shivalaya.", "temple", 3, "riv-peninsular"],
  ["Belur", "Karnataka", 13.16, 75.86, "Temple Site", "Famous for intricately sculptured Chenna Kesava temple (Hoysala period).", "temple", 3, "riv-peninsular"],
  ["Bhubaneswar", "Odisha", 20.30, 85.82, "Temple City", "Known for Rajarani, Lingraja & Brahmesvara temples.", "temple", 3, "riv-peninsular"],
  ["Allahabad (Prayagraj)", "Uttar Pradesh", 25.43, 81.85, "River Confluence", "Confluence of Ganga and Yamuna.", "temple", 3, "riv-ganga"],
  ["Nasik", "Maharashtra", 19.99, 73.79, "River-Bank Town", "Located on the banks of River Godavari.", "temple", 2, "riv-peninsular"],
  ["Cuttack", "Odisha", 20.46, 85.88, "River-Bank City", "Located on the banks of River Mahanadi.", "temple", 2, "riv-peninsular"],
  ["Kolkata", "West Bengal", 22.57, 88.36, "River-Bank City", "Located on the banks of River Hooghly.", "temple", 3, "riv-ganga"],
  ["Jamshedpur", "Jharkhand", 22.80, 86.20, "River-Bank & Steel City", "Located on the banks of River Subarnarekha.", "nuclear", 3],
  ["Surat", "Gujarat", 21.17, 72.83, "River-Bank City", "Located on the banks of River Tapi.", "temple", 2, "riv-narmada-tapi"],
  ["Kanpur", "Uttar Pradesh", 26.45, 80.33, "River-Bank City", "Located on the banks of River Ganga.", "temple", 2, "riv-ganga"],
  ["Delhi", "NCT Delhi", 28.61, 77.21, "River-Bank Capital", "Located on the banks of River Yamuna.", "temple", 3, "riv-ganga"],
  ["Varanasi (Banaras)", "Uttar Pradesh", 25.32, 82.97, "River-Bank City", "Located on the banks of River Ganga.", "temple", 3, "riv-ganga"],
  ["Ahmedabad", "Gujarat (Sabarmati)", 23.02, 72.57, "Industrial Town", "Associated with Cotton Textiles & Pharmaceuticals.", "nuclear", 2],
  ["Agra", "Uttar Pradesh (Yamuna)", 27.18, 78.01, "Industrial & Heritage Town", "Associated with Leather, apparel & garments.", "temple", 2, "riv-ganga"],
  ["Bengaluru", "Karnataka", 12.97, 77.59, "Industrial City", "Associated with Aircraft, Telephones, IT & Biotech.", "nuclear", 3],
  ["Bhilai", "Chhattisgarh", 21.21, 81.38, "Industrial Town", "Associated with Steel Plant & Cement.", "nuclear", 3],
  ["Mumbai", "Maharashtra", 19.08, 72.88, "Industrial Hub", "Film industries, cotton textile, automobile & petro-chemicals.", "nuclear", 3],
  ["Chittaranjan", "West Bengal", 23.87, 86.87, "Industrial Town", "Associated with Locomotives (CLW).", "nuclear", 3, "riv-ganga"],
]

export const ALL_GEO_PINS: GeoPin[] = [
  ...buildPins('Sanctuaries & National Parks', 'park', PARK_ROWS),
  ...buildPins('Ramsar Wetlands', 'ram', RAMSAR_ROWS),
  ...buildPins('Tiger Reserves', 'tr', TIGER_ROWS),
  ...buildPins('Dams & Power Projects', 'dam', DAM_POWER_ROWS),
  ...buildPins('Heritage, Cities & Industry', 'city', HERITAGE_CITY_ROWS),
]
