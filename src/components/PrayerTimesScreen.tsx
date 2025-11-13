// src/components/PrayerTimesScreen.tsx
import React, { useState } from 'react';
import { fetchPrayerTimes, PrayerResponse } from '../api';

export const PrayerTimesScreen: React.FC = () => {
  const [city, setCity] = useState('');
  const [data, setData] = useState<PrayerResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showFasting, setShowFasting] = useState(false);

  const handleSearch = async () => {
    if (!city.trim()) return;
    try {
      setLoading(true);
      setError('');
      const res = await fetchPrayerTimes(city.trim());
      setData(res);
    } catch (e: any) {
      setError(e.message ?? 'Failed to load');
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (iso: string) =>
    new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="page">
      <h1>🌙 Prayer Times</h1>
      <p className="muted">ISNA (15°) for daily prayers &bull; MWL for fasting</p>

      <div className="search-row">
        <input
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Type a city, e.g. Toronto"
        />
        <button onClick={handleSearch} disabled={loading}>
          {loading ? 'Loading…' : 'Get Times'}
        </button>
      </div>

      {error && <p className="error">{error}</p>}

      {data && (
        <>
          <div className="card">
            <h2>
              {city}{' '}
              <span className="env-tag">
                {data.env}
              </span>
            </h2>
            <p className="muted">
              Date: {data.date} • TZ: {data.timezone}
            </p>

            <h3>Daily Prayer Times (ISNA)</h3>
            <ul className="times">
              {data.daily_isna.map((p) => (
                <li key={p.name}>
                  {p.name}: {formatTime(p.time)}
                </li>
              ))}
            </ul>
          </div>

          <label className="toggle">
            <input
              type="checkbox"
              checked={showFasting}
              onChange={(e) => setShowFasting(e.target.checked)}
            />
            Show Ramadan / fasting times
          </label>

          {showFasting && (
            <div className="card fasting">
              <h3>Fasting (MWL)</h3>
              <ul className="times">
                <li>Suhoor ends: {formatTime(data.fasting_mwl.suhoorEnd)}</li>
                <li>Iftar: {formatTime(data.fasting_mwl.iftar)}</li>
              </ul>
            </div>
          )}
        </>
      )}
    </div>
  );
};
