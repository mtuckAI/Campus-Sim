import React from 'react'

export default function Header({ metadata }) {
  const date = new Date(metadata.simulation_date)
  const formatted = date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <header className="header">
      <div className="header-content">
        <div>
          <h1>
            <span>Texas A&M</span> WiFi Dashboard
          </h1>
          <div className="header-subtitle">
            Campus Network Simulation{metadata.full_load ? ' — Full Load' : ''}
          </div>
        </div>
        <div className="header-meta">
          <div>{formatted}</div>
          <div>
            <strong>{metadata.total_clients.toLocaleString()}</strong> people
            {' | '}
            <strong>{metadata.total_devices.toLocaleString()}</strong> devices
            {' | '}
            <strong>{metadata.total_aps.toLocaleString()}</strong> APs
          </div>
        </div>
      </div>
    </header>
  )
}
