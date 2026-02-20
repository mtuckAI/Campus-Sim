import React, { useState, useEffect } from 'react'

export default function BuildingView({ buildingId, onBack }) {
  const [buildingData, setBuildingData] = useState(null)
  const [apData, setApData] = useState(null)
  const [selectedFloor, setSelectedFloor] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    setLoading(true)
    setError(null)

    // Load building data and AP locations in parallel
    Promise.all([
      fetch(`/data/micro-analysis/buildings/${buildingId}.json`)
        .then(res => {
          if (!res.ok) throw new Error(`Building data not found: ${buildingId}`)
          return res.json()
        }),
      fetch('/data/micro-analysis/access-points/ap_locations.json')
        .then(res => {
          if (!res.ok) throw new Error('AP locations not found')
          return res.json()
        })
    ])
      .then(([building, apLocations]) => {
        setBuildingData(building)
        setApData(apLocations[buildingId])
        
        // Set first floor as default
        if (building.floor_info && building.floor_info.length > 0) {
          setSelectedFloor(building.floor_info[0].floor_number)
        }
        
        setLoading(false)
      })
      .catch(err => {
        console.error('Failed to load building data:', err)
        setError(err.message)
        setLoading(false)
      })
  }, [buildingId])

  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner" />
        <div>Loading building data...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="loading">
        <div className="error-message">
          <h3>Error Loading Building</h3>
          <p>{error}</p>
          <button onClick={onBack} className="btn-secondary">
            ← Back to Building List
          </button>
        </div>
      </div>
    )
  }

  if (!buildingData || !apData) {
    return (
      <div className="loading">
        <div>No data available for this building</div>
        <button onClick={onBack} className="btn-secondary">
          ← Back to Building List
        </button>
      </div>
    )
  }

  const info = buildingData.building_info
  const floors = buildingData.floor_info || []
  const aps = apData?.access_points || []

  // Get APs for selected floor
  const floorAPs = selectedFloor !== null 
    ? aps.filter(ap => ap.floor === selectedFloor)
    : []

  // Get current floor info
  const currentFloor = floors.find(f => f.floor_number === selectedFloor)

  // Calculate channel distribution
  const channelDist24 = {}
  const channelDist5 = {}
  aps.forEach(ap => {
    if (ap.radio_config['2.4GHz']?.enabled) {
      const ch = ap.radio_config['2.4GHz'].channel
      channelDist24[ch] = (channelDist24[ch] || 0) + 1
    }
    if (ap.radio_config['5GHz']?.enabled) {
      const ch = ap.radio_config['5GHz'].channel
      channelDist5[ch] = (channelDist5[ch] || 0) + 1
    }
  })

  return (
    <div className="building-view">
      {/* Header with back button */}
      <div className="building-view-header">
        <button onClick={onBack} className="btn-back">
          ← Back to Buildings
        </button>
        <div className="building-title">
          <h1>{info.name}</h1>
          <div className="building-meta">
            <span className="meta-item">Zone {info.zone_id} • {info.zone_name}</span>
            <span className="meta-item">{info.building_type}</span>
          </div>
        </div>
      </div>

      {/* Building overview cards */}
      <div className="overview-grid">
        <div className="stat-card">
          <div className="stat-icon">🏢</div>
          <div className="stat-content">
            <div className="stat-label">Floors</div>
            <div className="stat-value">{info.floors}</div>
            <div className="stat-subtitle">{floors.length} floor plans</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📡</div>
          <div className="stat-content">
            <div className="stat-label">Access Points</div>
            <div className="stat-value">{buildingData.network_info?.total_aps || aps.length}</div>
            <div className="stat-subtitle">Total deployed</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📐</div>
          <div className="stat-content">
            <div className="stat-label">Total Area</div>
            <div className="stat-value">
              {info.square_feet ? info.square_feet.toLocaleString() : 'N/A'}
            </div>
            <div className="stat-subtitle">square feet</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📍</div>
          <div className="stat-content">
            <div className="stat-label">Location</div>
            <div className="stat-value" style={{ fontSize: '1rem' }}>
              {info.coordinates?.lat?.toFixed(4)}, {info.coordinates?.lng?.toFixed(4)}
            </div>
            <div className="stat-subtitle">GPS coordinates</div>
          </div>
        </div>
      </div>

      {/* Floor selector */}
      <div className="floor-selector-section">
        <h2>Floor Selection</h2>
        <div className="floor-selector-grid">
          {floors.map(floor => {
            const floorAPCount = aps.filter(ap => ap.floor === floor.floor_number).length
            const isSelected = selectedFloor === floor.floor_number

            return (
              <button
                key={floor.floor_number}
                className={`floor-button ${isSelected ? 'selected' : ''}`}
                onClick={() => setSelectedFloor(floor.floor_number)}
              >
                <div className="floor-button-header">
                  <span className="floor-name">{floor.floor_label}</span>
                  {isSelected && <span className="selected-indicator">●</span>}
                </div>
                <div className="floor-button-stats">
                  <div className="floor-stat">
                    <span className="floor-stat-value">{floorAPCount}</span>
                    <span className="floor-stat-label">APs</span>
                  </div>
                  <div className="floor-stat">
                    <span className="floor-stat-value">
                      {floor.dimensions?.width_ft?.toFixed(0) || 0}×{floor.dimensions?.height_ft?.toFixed(0) || 0}
                    </span>
                    <span className="floor-stat-label">ft</span>
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Floor plan visualization */}
      {currentFloor && (
        <div className="floor-plan-section">
          <div className="floor-plan-header">
            <h2>{currentFloor.floor_label} - Floor Plan</h2>
            <div className="floor-plan-stats">
              <span>{floorAPs.length} APs on this floor</span>
              <span>•</span>
              <span>
                {currentFloor.dimensions?.width_ft?.toFixed(0)} × {currentFloor.dimensions?.height_ft?.toFixed(0)} ft
              </span>
              <span>•</span>
              <span>
                {(currentFloor.dimensions?.width_ft * currentFloor.dimensions?.height_ft).toLocaleString()} sq ft
              </span>
            </div>
          </div>

          <FloorPlanCanvas
            floor={currentFloor}
            aps={floorAPs}
          />
        </div>
      )}

      {/* AP Inventory Table */}
      <div className="ap-inventory-section">
        <h2>Access Point Inventory</h2>
        <div className="ap-table-controls">
          <div className="ap-count">
            Showing {selectedFloor !== null ? floorAPs.length : aps.length} access points
            {selectedFloor !== null && ` on ${currentFloor?.floor_label || `Floor ${selectedFloor}`}`}
          </div>
          {selectedFloor !== null && (
            <button 
              onClick={() => setSelectedFloor(null)}
              className="btn-secondary btn-small"
            >
              Show All Floors
            </button>
          )}
        </div>

        <div className="ap-table-container">
          <table className="ap-table">
            <thead>
              <tr>
                <th>AP ID</th>
                <th>Name</th>
                <th>Floor</th>
                <th>Location (ft)</th>
                <th>Height</th>
                <th>2.4 GHz</th>
                <th>5 GHz</th>
              </tr>
            </thead>
            <tbody>
              {(selectedFloor !== null ? floorAPs : aps).map(ap => (
                <tr key={ap.ap_id}>
                  <td className="ap-id">{ap.ap_id}</td>
                  <td className="ap-name">{ap.name}</td>
                  <td className="ap-floor">{ap.floor}</td>
                  <td className="ap-location">
                    ({ap.location.x?.toFixed(1)}, {ap.location.y?.toFixed(1)})
                  </td>
                  <td className="ap-height">{ap.location.height_ft?.toFixed(1)} ft</td>
                  <td className="ap-radio">
                    {ap.radio_config['2.4GHz']?.enabled ? (
                      <span className="radio-enabled">
                        Ch {ap.radio_config['2.4GHz'].channel} @ {ap.radio_config['2.4GHz'].power_dbm} dBm
                      </span>
                    ) : (
                      <span className="radio-disabled">Off</span>
                    )}
                  </td>
                  <td className="ap-radio">
                    {ap.radio_config['5GHz']?.enabled ? (
                      <span className="radio-enabled">
                        Ch {ap.radio_config['5GHz'].channel} @ {ap.radio_config['5GHz'].power_dbm} dBm
                      </span>
                    ) : (
                      <span className="radio-disabled">Off</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Channel distribution */}
      <div className="channel-distribution-section">
        <h2>Channel Distribution</h2>
        <div className="channel-grid">
          <div className="channel-chart">
            <h3>2.4 GHz Channels</h3>
            <div className="channel-bars">
              {Object.entries(channelDist24)
                .sort(([a], [b]) => parseInt(a) - parseInt(b))
                .map(([channel, count]) => (
                  <div key={channel} className="channel-bar-item">
                    <div className="channel-bar-label">Ch {channel}</div>
                    <div className="channel-bar-wrapper">
                      <div 
                        className="channel-bar" 
                        style={{ 
                          width: `${(count / Math.max(...Object.values(channelDist24))) * 100}%`,
                          backgroundColor: '#FFBF00'
                        }}
                      />
                      <span className="channel-bar-count">{count}</span>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          <div className="channel-chart">
            <h3>5 GHz Channels</h3>
            <div className="channel-bars">
              {Object.entries(channelDist5)
                .sort(([a], [b]) => parseInt(a) - parseInt(b))
                .map(([channel, count]) => (
                  <div key={channel} className="channel-bar-item">
                    <div className="channel-bar-label">Ch {channel}</div>
                    <div className="channel-bar-wrapper">
                      <div 
                        className="channel-bar" 
                        style={{ 
                          width: `${(count / Math.max(...Object.values(channelDist5))) * 100}%`,
                          backgroundColor: '#00FF00'
                        }}
                      />
                      <span className="channel-bar-count">{count}</span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Floor Plan Canvas Component
function FloorPlanCanvas({ floor, aps }) {
  const width = floor.dimensions?.width_ft || 400
  const height = floor.dimensions?.height_ft || 300
  const maxDim = Math.max(width, height)
  const scale = Math.min(800 / maxDim, 1.5) // Scale to fit, max 800px

  const scaledWidth = width * scale
  const scaledHeight = height * scale

  return (
    <div className="floor-plan-container">
      <svg
        width={scaledWidth}
        height={scaledHeight}
        viewBox={`0 0 ${scaledWidth} ${scaledHeight}`}
        className="floor-plan-svg"
      >
        {/* Background grid */}
        <defs>
          <pattern
            id="grid"
            width={50 * scale}
            height={50 * scale}
            patternUnits="userSpaceOnUse"
          >
            <path
              d={`M ${50 * scale} 0 L 0 0 0 ${50 * scale}`}
              fill="none"
              stroke="rgba(255, 255, 255, 0.1)"
              strokeWidth="1"
            />
          </pattern>
        </defs>

        <rect width={scaledWidth} height={scaledHeight} fill="url(#grid)" />

        {/* Access points */}
        {aps.map((ap, idx) => {
          const x = (ap.location?.x || 0) * scale
          const y = scaledHeight - ((ap.location?.y || 0) * scale) // Flip Y axis

          const is24 = ap.radio_config['2.4GHz']?.enabled
          const is5 = ap.radio_config['5GHz']?.enabled
          const isDual = is24 && is5

          const color = isDual ? '#FF6B6B' : is5 ? '#00FF00' : '#FFBF00'

          return (
            <g key={idx} className="ap-marker">
              {/* Coverage circle */}
              <circle
                cx={x}
                cy={y}
                r={40}
                fill={color}
                fillOpacity={0.1}
                className="ap-coverage"
              />

              {/* AP marker */}
              <circle
                cx={x}
                cy={y}
                r={8}
                fill={color}
                stroke="#fff"
                strokeWidth={2}
                className="ap-dot"
              >
                <title>{ap.name} - {ap.location?.room || 'Unknown room'}</title>
              </circle>

              {/* Dual band indicator */}
              {isDual && (
                <circle
                  cx={x}
                  cy={y}
                  r={4}
                  fill="#fff"
                />
              )}
            </g>
          )
        })}
      </svg>

      {/* Legend */}
      <div className="floor-plan-legend">
        <div className="legend-title">Legend</div>
        <div className="legend-items">
          <div className="legend-item">
            <div className="legend-dot" style={{ backgroundColor: '#00FF00' }} />
            <span>5 GHz Only</span>
          </div>
          <div className="legend-item">
            <div className="legend-dot" style={{ backgroundColor: '#FFBF00' }} />
            <span>2.4 GHz Only</span>
          </div>
          <div className="legend-item">
            <div className="legend-dot" style={{ backgroundColor: '#FF6B6B' }} />
            <span>Dual Band</span>
          </div>
        </div>
        <div className="legend-note">Grid spacing: 50 ft</div>
      </div>
    </div>
  )
}
