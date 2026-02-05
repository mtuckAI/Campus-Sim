import React from 'react'

export default function Footer({ metadata }) {
  return (
    <footer className="footer">
      <strong>Texas A&M University</strong> WiFi Network Simulation
      {' | '}
      {metadata.infrastructure.access_points} Access Points
      {' | '}
      {metadata.infrastructure.edge_appliance} Edge
      {' | '}
      {metadata.infrastructure.switches} Switches
      {metadata.full_load && ' | Full-Load Mode'}
    </footer>
  )
}
