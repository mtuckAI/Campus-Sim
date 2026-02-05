import React from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
} from 'recharts'

const ZONE_COLORS = {
  1: '#500000',   // West Campus - maroon
  2: '#D4A017',   // Central Campus - gold
  3: '#1B5E20',   // North Campus - green
  4: '#0D47A1',   // South Campus - blue
  5: '#E65100',   // East Campus - orange
  6: '#6A1B9A',   // Research Park - purple
  7: '#00838F',   // Riverside - teal
  8: '#C62828',   // Health Science Center - red
  9: '#37474F',   // RELLIS Campus - slate
  10: '#AD1457',  // Athletics District - pink
  11: '#9E9E9E',  // Satellite Facilities - gray
  12: '#33691E',  // South College Station - olive
}

export default function CampusTimeline({ hourlyStats, selectedHour, zoneNames }) {
  const zoneIds = Object.keys(hourlyStats[0].zones).sort(
    (a, b) => Number(a) - Number(b)
  )

  const chartData = hourlyStats.map(h => {
    const row = { hour: h.timestamp }
    for (const zid of zoneIds) {
      row[zid] = h.zones[zid]?.active_clients || 0
    }
    return row
  })

  const formatY = v => {
    if (v >= 1000) return `${(v / 1000).toFixed(1)}k`
    return v
  }

  return (
    <div className="card">
      <div className="card-title">People on WiFi by Zone Throughout the Day</div>
      <ResponsiveContainer width="100%" height={420}>
        <LineChart data={chartData} margin={{ top: 10, right: 20, bottom: 0, left: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E0D8D0" />
          <XAxis dataKey="hour" tick={{ fontSize: 11 }} />
          <YAxis tickFormatter={formatY} tick={{ fontSize: 11 }} />
          <Tooltip
            formatter={(val, name) => [
              val.toLocaleString(),
              zoneNames[Number(name)] || `Zone ${name}`,
            ]}
            labelFormatter={l => `Time: ${l}`}
            contentStyle={{ borderRadius: 8, borderColor: '#E0D8D0', fontSize: 13 }}
          />
          <Legend
            formatter={val => zoneNames[Number(val)] || `Zone ${val}`}
            wrapperStyle={{ fontSize: 12 }}
          />
          {zoneIds.map(zid => (
            <Line
              key={zid}
              type="monotone"
              dataKey={zid}
              stroke={ZONE_COLORS[Number(zid)] || '#888'}
              strokeWidth={2}
              dot={false}
              name={zid}
            />
          ))}
          <ReferenceLine
            x={chartData[selectedHour]?.hour}
            stroke="#500000"
            strokeWidth={2}
            strokeDasharray="4 4"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
