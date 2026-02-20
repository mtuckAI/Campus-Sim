import React, { useState, useEffect } from 'react'
import BuildingView from './BuildingView'

export default function MicroAnalysisTab() {
  const [buildings, setBuildings] = useState([])
  const [selectedBuilding, setSelectedBuilding] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch('/data/micro-analysis/buildings/buildings_index.json')
      .then(res => res.json())
      .then(data => {
        setBuildings(data.buildings || [])
        setLoading(false)
      })
      .catch(err => {
        console.error('Failed to load buildings:', err)
        setError('Failed to load building list')
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner" />
        <div>Loading buildings...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="loading">
        <div>{error}</div>
      </div>
    )
  }

  // If a building is selected, show the BuildingView
  if (selectedBuilding) {
    return (
      <BuildingView
        buildingId={selectedBuilding}
        onBack={() => setSelectedBuilding(null)}
      />
    )
  }

  // Otherwise, show the building list
  return (
    <div className="micro-analysis-container">
      <div className="micro-analysis-header">
        <h2>Building Analysis</h2>
        <p>Select a building to view detailed floor plans and access point locations</p>
      </div>

      <div className="building-grid">
        {buildings.map(building => (
          <div
            key={building.id}
            className="building-card"
            onClick={() => setSelectedBuilding(building.id)}
          >
            <div className="building-card-header">
              <h3>{building.name}</h3>
              <span className={`building-status ${building.enabled ? 'enabled' : 'disabled'}`}>
                {building.enabled ? '● Active' : '○ Inactive'}
              </span>
            </div>
            <div className="building-card-info">
              <div className="building-info-row">
                <span className="label">Zone:</span>
                <span className="value">{building.zone_name}</span>
              </div>
              <div className="building-info-row">
                <span className="label">Building ID:</span>
                <span className="value">{building.id}</span>
              </div>
            </div>
            <div className="building-card-footer">
              <span>Click to view floor plans →</span>
            </div>
          </div>
        ))}
      </div>

      {buildings.length === 0 && (
        <div className="no-buildings">
          <p>No buildings available</p>
        </div>
      )}
    </div>
  )
}
