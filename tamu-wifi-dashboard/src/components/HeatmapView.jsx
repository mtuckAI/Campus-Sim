import React from 'react'

function getColor(value, max) {
  const ratio = Math.min(value / max, 1)
  if (ratio < 0.2) return '#FFF3E0'
  if (ratio < 0.4) return '#FFE0B2'
  if (ratio < 0.6) return '#FFBF00'
  if (ratio < 0.8) return '#D4A017'
  return '#500000'
}

function getTextColor(value, max) {
  const ratio = Math.min(value / max, 1)
  return ratio >= 0.7 ? '#FFFFFF' : '#1A1A1A'
}

export default function HeatmapView({ hourlyStats, zoneNames }) {
  const zoneIds = Object.keys(hourlyStats[0].zones).sort(
    (a, b) => Number(a) - Number(b)
  )

  // Find global max for color scaling
  const allValues = hourlyStats.flatMap(h =>
    Object.values(h.zones).map(z => z.active_clients)
  )
  const maxVal = Math.max(...allValues)

  return (
    <div className="card">
      <div className="card-title">24-Hour Activity Heatmap — People on WiFi</div>
      <div className="heatmap-container">
        <table className="heatmap-table">
          <thead>
            <tr>
              <th>Zone</th>
              {hourlyStats.map(h => (
                <th key={h.hour}>{h.timestamp.replace(':00', 'h')}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {zoneIds.map(zoneId => (
              <tr key={zoneId}>
                <td>{zoneNames[Number(zoneId)] || `Zone ${zoneId}`}</td>
                {hourlyStats.map(h => {
                  const val = h.zones[zoneId]?.active_clients || 0
                  return (
                    <td
                      key={h.hour}
                      style={{
                        background: getColor(val, maxVal),
                        color: getTextColor(val, maxVal),
                      }}
                      title={`${val.toLocaleString()} people`}
                    >
                      {val >= 1000
                        ? `${(val / 1000).toFixed(1)}k`
                        : val}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
