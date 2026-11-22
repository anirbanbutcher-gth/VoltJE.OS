'use client'

import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
} from 'chart.js'

ChartJS.register(ArcElement, BarElement, CategoryScale, Filler, Legend, LinearScale, LineElement, PointElement, Tooltip)

export function chartPalette(dark: boolean) {
  return dark
    ? { text: '#e6faff', muted: 'rgba(200, 235, 245, 0.7)', grid: 'rgba(34, 211, 238, 0.12)', primary: '#22d3ee', accent: '#fbbf24', safe: 'rgba(16, 185, 129, 0.14)', safeLine: '#34d399' }
    : { text: '#1e2a44', muted: 'rgba(40, 55, 90, 0.7)', grid: 'rgba(40, 80, 160, 0.1)', primary: '#2563eb', accent: '#d97706', safe: 'rgba(16, 185, 129, 0.12)', safeLine: '#059669' }
}
