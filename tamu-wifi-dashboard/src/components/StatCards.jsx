import React from 'react'

export default function StatCards({ hourData, metadata }) {
  const campus = hourData.campus_total

  const cards = [
    {
      label: 'People on WiFi',
      value: campus.active_clients.toLocaleString(),
      detail: `of ${metadata.total_clients.toLocaleString()} total`,
      gold: false,
    },
    {
      label: 'Connected Devices',
      value: campus.total_devices.toLocaleString(),
      detail: 'phones, laptops, tablets',
      gold: false,
    },
    {
      label: 'WiFi APs',
      value: metadata.total_aps.toLocaleString(),
      detail: metadata.infrastructure.access_points,
      gold: true,
    },
    {
      label: 'Avg Devices per AP',
      value: campus.avg_zone_load.toFixed(1),
      detail: `peak: ${campus.max_zone_load.toFixed(1)}`,
      gold: false,
    },
    {
      label: 'Campus Zones',
      value: metadata.zones,
      detail: `${metadata.buildings} buildings`,
      gold: true,
    },
  ]

  return (
    <div className="stat-cards">
      {cards.map((card, i) => (
        <div key={i} className={`stat-card ${card.gold ? 'gold-accent' : ''}`}>
          <div className="stat-label">{card.label}</div>
          <div className="stat-value">{card.value}</div>
          <div className="stat-detail">{card.detail}</div>
        </div>
      ))}
    </div>
  )
}
