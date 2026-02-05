import React from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from 'recharts'

export default function ZoneBreakdown({ hourData, zoneNames, mode }) {
  const zones = Object.entries(hourData.zones)
    .map(([id, stats]) => ({
      zone: zoneNames[Number(id)] || `Zone ${id}`,
      shortName: (zoneNames[Number(id)] || `Zone ${id}`).replace(' Campus', '').replace(' ', '\n'),
      people: stats.active_clients,
      devices: stats.total_devices,
      load: Number(stats.avg_wap_load.toFixed(1)),
    }))
    .sort((a, b) => b.people - a.people)

  const formatY = v => {
    if (v >= 1000) return `${(v / 1000).toFixed(0)}k`
    return v
  }

  if (mode === 'radar') {
    return (
      <ResponsiveContainer width="100%" height={340}>
        <RadarChart data={zones} outerRadius="70%">
          <PolarGrid stroke="#E0D8D0" />
          <PolarAngleAxis dataKey="shortName" tick={{ fontSize: 11 }} />
          <PolarRadiusAxis tick={{ fontSize: 10 }} />
          <Tooltip
            formatter={(val, name) => [
              typeof val === 'number' && val > 100 ? val.toLocaleString() : val,
              name === 'load' ? 'Devices/AP' : 'People',
            ]}
          />
          <Radar
            name="load"
            dataKey="load"
            stroke="#D4A017"
            fill="#FFBF00"
            fillOpacity={0.3}
            strokeWidth={2}
          />
        </RadarChart>
      </ResponsiveContainer>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={340}>
      <BarChart data={zones} margin={{ top: 5, right: 10, bottom: 5, left: 10 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E0D8D0" />
        <XAxis
          dataKey="shortName"
          tick={{ fontSize: 11 }}
          interval={0}
          angle={-30}
          textAnchor="end"
          height={60}
        />
        <YAxis tickFormatter={formatY} tick={{ fontSize: 12 }} />
        <Tooltip
          formatter={(val, name) => [
            val.toLocaleString(),
            name === 'people' ? 'People' : 'Devices',
          ]}
        />
        <Bar dataKey="people" fill="#500000" radius={[4, 4, 0, 0]} name="people" />
      </BarChart>
    </ResponsiveContainer>
  )
}
