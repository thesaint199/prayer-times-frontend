// src/api.ts

export interface PrayerResponse {
  env: string;
  date: string;
  timezone: string;
  daily_isna: { name: string; time: string }[];
  fasting_mwl: { suhoorEnd: string; iftar: string };
}

const API_BASE = import.meta.env.VITE_API_BASE;
const API_ENV = import.meta.env.VITE_API_ENV || 'PROD';

export async function fetchPrayerTimes(city: string): Promise<PrayerResponse> {
  const url = `${API_BASE}/prayer-times?city=${encodeURIComponent(city)}&env=${API_ENV}`;
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`API error: ${res.status}`);
  }

  return res.json();
}
