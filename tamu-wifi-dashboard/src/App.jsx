import React, { useState, useEffect, useCallback, useMemo } from 'react'
import Header from './components/Header'
import StatCards from './components/StatCards'
import CampusTimeline from './components/CampusTimeline'
import ZoneBreakdown from './components/ZoneBreakdown'
import HeatmapView from './components/HeatmapView'
import Footer from './components/Footer'

const ZONE_NAMES = {
  1: 'West Campus',
  2: 'Central Campus',
  3: 'North Campus',
  4: 'South Campus',
  5: 'East Campus',
  6: 'Research Park',
  7: 'Riverside',
  8: 'Health Science Center',
  9: 'RELLIS Campus',
  10: 'Athletics District',
  11: 'Satellite Facilities',
  12: 'South College Station',
}

const POPULATION_STOPS = [90000, 100000, 120000, 140000]

function scaleData(data, targetPopulation) {
  const basePopulation = data.metadata.total_clients
  const scale = targetPopulation / basePopulation

  const scaledHourly = data.hourly_stats.map(h => {
    const scaledZones = {}
    for (const [zid, zstats] of Object.entries(h.zones)) {
      scaledZones[zid] = {
        ...zstats,
        active_clients: Math.round(zstats.active_clients * scale),
        total_devices: Math.round(zstats.total_devices * scale),
        avg_wap_load: zstats.avg_wap_load * scale,
        max_wap_load: zstats.max_wap_load * scale,
      }
    }
    return {
      ...h,
      zones: scaledZones,
      campus_total: {
        active_clients: Math.round(h.campus_total.active_clients * scale),
        total_devices: Math.round(h.campus_total.total_devices * scale),
        avg_zone_load: h.campus_total.avg_zone_load * scale,
        max_zone_load: h.campus_total.max_zone_load * scale,
      },
    }
  })

  return {
    ...data,
    metadata: {
      ...data.metadata,
      total_clients: targetPopulation,
      total_devices: targetPopulation * 3,
    },
    hourly_stats: scaledHourly,
  }
}

export default function App() {
  const [rawData, setRawData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const [selectedHour, setSelectedHour] = useState(10)
  const [playing, setPlaying] = useState(false)
  const [population, setPopulation] = useState(90000)

  useEffect(() => {
    fetch('/tamu_simulation_output.json')
      .then(res => res.json())
      .then(json => {
        setRawData(json)
        setLoading(false)
      })
      .catch(err => {
        console.error('Failed to load simulation data:', err)
        setLoading(false)
      })
  }, [])

  // Play/pause animation
  useEffect(() => {
    if (!playing) return
    const interval = setInterval(() => {
      setSelectedHour(h => (h + 1) % 24)
    }, 1000)
    return () => clearInterval(interval)
  }, [playing])

  const togglePlay = useCallback(() => setPlaying(p => !p), [])

  // Always scale from original raw data (base 90k) to avoid compounding
  const data = useMemo(() => {
    if (!rawData) return null
    if (population === rawData.metadata.total_clients) return rawData
    return scaleData(rawData, population)
  }, [rawData, population])

  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner" />
        <div>Loading simulation data...</div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="loading">
        <div>Failed to load data. Make sure tamu_simulation_output.json is in the public/ folder.</div>
      </div>
    )
  }

  const hourData = data.hourly_stats[selectedHour]
  const growthPct = Math.round(((population - 90000) / 90000) * 100)
  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'zones', label: 'Campus Zones' },
    { id: 'heatmap', label: 'Activity Heatmap' },
  ]

  return (
    <div className="app">
      <Header metadata={data.metadata} />

      <nav className="nav-tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <main className="main-content">
        <div className="population-slider-container">
          <div className="population-slider-header">
            <label>Campus Population</label>
            <div className="population-display">
              <span className="population-value">{population.toLocaleString()}</span>
              <span className="population-label"> people</span>
              {growthPct > 0 && (
                <span className="population-growth">+{growthPct}% growth</span>
              )}
            </div>
          </div>
          <div className="population-slider-track">
            <input
              type="range"
              className="population-slider"
              min={90000}
              max={140000}
              step={1000}
              value={population}
              onChange={e => setPopulation(Number(e.target.value))}
            />
            <div className="population-stops">
              {POPULATION_STOPS.map(stop => (
                <button
                  key={stop}
                  className={`population-stop ${population === stop ? 'active' : ''}`}
                  onClick={() => setPopulation(stop)}
                >
                  {(stop / 1000).toFixed(0)}k
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="time-slider-container">
          <label>Time of Day</label>
          <input
            type="range"
            className="time-slider"
            min={0}
            max={23}
            value={selectedHour}
            onChange={e => setSelectedHour(Number(e.target.value))}
          />
          <div className="time-display">{hourData.timestamp}</div>
          <button className="play-btn" onClick={togglePlay}>
            {playing ? 'Pause' : 'Play'}
          </button>
        </div>

        <StatCards hourData={hourData} metadata={data.metadata} />

        {activeTab === 'overview' && (
          <div className="chart-grid">
            <div className="chart-full">
              <CampusTimeline hourlyStats={data.hourly_stats} selectedHour={selectedHour} zoneNames={ZONE_NAMES} />
            </div>
            <div className="card">
              <div className="card-title">People on WiFi by Zone</div>
              <ZoneBreakdown
                hourData={hourData}
                zoneNames={ZONE_NAMES}
                mode="bar"
              />
            </div>
            <div className="card">
              <div className="card-title">WiFi Load by Zone</div>
              <ZoneBreakdown
                hourData={hourData}
                zoneNames={ZONE_NAMES}
                mode="radar"
              />
            </div>
          </div>
        )}

        {activeTab === 'zones' && (
          <>
            <div className="chart-grid">
              <div className="card">
                <div className="card-title">Zone Comparison — People on WiFi</div>
                <ZoneBreakdown hourData={hourData} zoneNames={ZONE_NAMES} mode="bar" />
              </div>
              <div className="card">
                <div className="card-title">Zone WiFi Load</div>
                <ZoneBreakdown hourData={hourData} zoneNames={ZONE_NAMES} mode="radar" />
              </div>
            </div>
            <ZoneCards hourData={hourData} zoneInfo={data.zone_info} zoneNames={ZONE_NAMES} />
          </>
        )}

        {activeTab === 'heatmap' && (
          <HeatmapView hourlyStats={data.hourly_stats} zoneNames={ZONE_NAMES} />
        )}
      </main>

      <Footer metadata={data.metadata} />
    </div>
  )
}

function ZoneCards({ hourData, zoneInfo, zoneNames }) {
  const zones = Object.entries(hourData.zones)
    .sort((a, b) => b[1].active_clients - a[1].active_clients)

  return (
    <div className="zone-cards-grid">
      {zones.map(([zoneId, stats]) => {
        const info = zoneInfo[zoneId] || {}
        return (
          <div key={zoneId} className="zone-card">
            <div className="zone-card-header">
              <div className="zone-card-name">
                {zoneNames[Number(zoneId)] || `Zone ${zoneId}`}
              </div>
              <div className="zone-card-clients">
                {stats.active_clients.toLocaleString()}
              </div>
            </div>
            <div className="zone-card-stats">
              <div className="zone-card-stat-label">Devices</div>
              <div className="zone-card-stat-value">{stats.total_devices.toLocaleString()}</div>
              <div className="zone-card-stat-label">WiFi APs</div>
              <div className="zone-card-stat-value">{(info.aps || 0).toLocaleString()}</div>
              <div className="zone-card-stat-label">Avg Load/AP</div>
              <div className="zone-card-stat-value">{stats.avg_wap_load.toFixed(1)}</div>
              <div className="zone-card-stat-label">Buildings Active</div>
              <div className="zone-card-stat-value">{stats.buildings_active}</div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
