import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

const TAMUWiFiDashboard = () => {
  const [simulationData, setSimulationData] = useState(null);
  const [currentHour, setCurrentHour] = useState(8);
  const [isPlaying, setIsPlaying] = useState(false);
  const [viewMode, setViewMode] = useState('overview');

  useEffect(() => {
    // Load actual TAMU simulation data
    loadTAMUData();
  }, []);

  useEffect(() => {
    let interval;
    if (isPlaying && simulationData) {
      interval = setInterval(() => {
        setCurrentHour(h => (h + 1) % 24);
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, simulationData]);

  const loadTAMUData = async () => {
    // For production: Load from tamu_simulation_output.json
    // For demo in this artifact, generate sample data with 12 zones
    const metadata = {
      campus: 'Texas A&M University',
      simulation_date: '2026-02-03',
      total_clients: 90000,
      total_devices: 270000,
      total_aps: 22019,
      zones: 12,
      buildings: 391
    };

    const zoneInfo = {
      1: { buildings: 48, aps: 1775, allocated_clients: 7255 },
      2: { buildings: 48, aps: 4048, allocated_clients: 16553 },
      3: { buildings: 37, aps: 3272, allocated_clients: 13373 },
      4: { buildings: 45, aps: 3523, allocated_clients: 14399 },
      5: { buildings: 30, aps: 2903, allocated_clients: 11865 },
      6: { buildings: 27, aps: 1347, allocated_clients: 5505 },
      7: { buildings: 61, aps: 421, allocated_clients: 1720 },
      8: { buildings: 34, aps: 627, allocated_clients: 2562 },
      9: { buildings: 17, aps: 1026, allocated_clients: 4193 },
      10: { buildings: 32, aps: 2322, allocated_clients: 9490 },
      11: { buildings: 5, aps: 15, allocated_clients: 61 },
      12: { buildings: 7, aps: 740, allocated_clients: 3024 }
    };

    const hourly_stats = Array.from({ length: 24 }, (_, hour) => {
      const zones = {};
      
      for (let z = 1; z <= 12; z++) {
        let occupancy_factor = 0.3;
        if (hour >= 8 && hour < 12) occupancy_factor = 0.85;
        else if (hour >= 12 && hour < 13) occupancy_factor = 0.5;
        else if (hour >= 13 && hour < 17) occupancy_factor = 0.75;
        else if (hour >= 17 && hour < 20) occupancy_factor = 0.6;
        else if (hour >= 18 && hour < 22) occupancy_factor = 0.55;
        else if (hour >= 0 && hour < 7) occupancy_factor = 0.15;
        else if (hour >= 22) occupancy_factor = 0.25;
        
        const base_clients = zoneInfo[z].allocated_clients;
        const active = Math.floor(base_clients * occupancy_factor * (0.9 + Math.random() * 0.2));
        const ap_count = zoneInfo[z].aps;
        
        zones[z] = {
          active_clients: active,
          total_devices: active * 3,
          avg_wap_load: ap_count > 0 ? (active * 3) / ap_count : 0,
          max_wap_load: ap_count > 0 ? ((active * 3) / ap_count) * 1.5 : 0,
          buildings_active: Math.floor(zoneInfo[z].buildings * occupancy_factor * 0.7)
        };
      }

      return {
        hour,
        timestamp: `${String(hour).padStart(2, '0')}:00`,
        zones,
        campus_total: {
          active_clients: Object.values(zones).reduce((sum, z) => sum + z.active_clients, 0),
          total_devices: Object.values(zones).reduce((sum, z) => sum + z.total_devices, 0),
          avg_zone_load: Object.values(zones).reduce((sum, z) => sum + z.avg_wap_load, 0) / 12,
          max_zone_load: Math.max(...Object.values(zones).map(z => z.max_wap_load))
        }
      };
    });

    setSimulationData({ metadata, zone_info: zoneInfo, hourly_stats });
  };

  const currentData = simulationData?.hourly_stats[currentHour];
  const metadata = simulationData?.metadata;
  const zoneInfo = simulationData?.zone_info;

  const campusTimelineData = simulationData?.hourly_stats.map(h => ({
    hour: h.timestamp,
    clients: h.campus_total.active_clients,
    devices: h.campus_total.total_devices,
    avgLoad: h.campus_total.avg_zone_load
  })) || [];

  const zoneComparisonData = currentData ? Object.entries(currentData.zones).map(([zone, data]) => ({
    zone: `Z${zone}`,
    clients: data.active_clients,
    devices: data.total_devices,
    wapLoad: data.avg_wap_load,
    capacity: zoneInfo ? zoneInfo[zone].aps : 0
  })) : [];

  const zoneRadarData = currentData ? Object.entries(currentData.zones).slice(0, 12).map(([zone, data]) => ({
    zone: `Z${zone}`,
    utilization: zoneInfo ? (data.active_clients / zoneInfo[zone].allocated_clients) * 100 : 0,
    wapLoad: (data.avg_wap_load / 30) * 100,
    buildings: zoneInfo ? (data.buildings_active / zoneInfo[zone].buildings) * 100 : 0
  })) : [];

  if (!simulationData) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #500000 0%, #1a0000 100%)',
        color: '#fff',
        fontFamily: '"Roboto Slab", "Times New Roman", serif'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎓</div>
          <div style={{ fontSize: '1.5rem', opacity: 0.9 }}>Loading TAMU WiFi Data...</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #500000 0%, #2a0000 50%, #1a0000 100%)',
      color: '#f5f5f5',
      fontFamily: '"Roboto Slab", "Georgia", serif',
      padding: '2rem'
    }}>
      {/* Header */}
      <div style={{
        marginBottom: '2rem',
        borderBottom: '3px solid #FFBF00',
        paddingBottom: '1.5rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
          <div style={{ fontSize: '3rem' }}>🎓</div>
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: '700',
            margin: 0,
            background: 'linear-gradient(90deg, #FFBF00 0%, #ffffff 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '0.02em'
          }}>
            Texas A&M University
          </h1>
        </div>
        <h2 style={{
          fontSize: '1.5rem',
          fontWeight: '400',
          margin: '0.5rem 0 0 4rem',
          color: '#FFBF00',
          fontStyle: 'italic'
        }}>
          Campus WiFi Network Monitor
        </h2>
        <div style={{
          display: 'flex',
          gap: '2rem',
          marginTop: '1rem',
          marginLeft: '4rem',
          fontSize: '0.9rem',
          opacity: 0.85,
          flexWrap: 'wrap'
        }}>
          <span>📅 {metadata.simulation_date}</span>
          <span>👥 {metadata.total_clients.toLocaleString()} clients</span>
          <span>📱 {metadata.total_devices.toLocaleString()} devices</span>
          <span>📡 {metadata.total_aps.toLocaleString()} APs</span>
          <span>🏢 {metadata.buildings} buildings</span>
          <span>🗺️ {metadata.zones} zones</span>
        </div>
      </div>

      {/* Time Control */}
      <div style={{
        background: 'rgba(255, 191, 0, 0.08)',
        border: '2px solid rgba(255, 191, 0, 0.3)',
        borderRadius: '12px',
        padding: '1.5rem',
        marginBottom: '2rem',
        backdropFilter: 'blur(10px)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '300px' }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              marginBottom: '0.5rem',
              fontSize: '1rem',
              fontWeight: '600'
            }}>
              <span style={{ color: '#FFBF00' }}>
                {currentData.timestamp}
              </span>
              <span style={{ opacity: 0.8 }}>
                {currentData.campus_total.active_clients.toLocaleString()} active
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="23"
              value={currentHour}
              onChange={(e) => setCurrentHour(parseInt(e.target.value))}
              style={{
                width: '100%',
                height: '10px',
                background: `linear-gradient(90deg, #FFBF00 ${(currentHour / 23) * 100}%, rgba(255,255,255,0.2) ${(currentHour / 23) * 100}%)`,
                borderRadius: '5px',
                outline: 'none',
                cursor: 'pointer'
              }}
            />
          </div>
          
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            style={{
              background: isPlaying ? 'rgba(80, 0, 0, 0.8)' : 'rgba(255, 191, 0, 0.2)',
              border: `2px solid ${isPlaying ? '#500000' : '#FFBF00'}`,
              color: isPlaying ? '#FFBF00' : '#FFBF00',
              padding: '0.75rem 2rem',
              borderRadius: '8px',
              fontFamily: 'inherit',
              fontSize: '1rem',
              fontWeight: '700',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              textTransform: 'uppercase'
            }}
          >
            {isPlaying ? '⏸ PAUSE' : '▶ PLAY'}
          </button>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {['overview', 'zones', 'heatmap'].map(mode => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                style={{
                  background: viewMode === mode ? 'rgba(255, 191, 0, 0.3)' : 'rgba(255, 255, 255, 0.05)',
                  border: viewMode === mode ? '2px solid #FFBF00' : '1px solid rgba(255,255,255,0.2)',
                  color: viewMode === mode ? '#FFBF00' : '#f5f5f5',
                  padding: '0.6rem 1.2rem',
                  borderRadius: '6px',
                  fontFamily: 'inherit',
                  fontSize: '0.85rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  textTransform: 'uppercase'
                }}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Stats Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        <StatCard
          title="Active Clients"
          value={currentData.campus_total.active_clients.toLocaleString()}
          subtitle={`${((currentData.campus_total.active_clients / metadata.total_clients) * 100).toFixed(1)}% of total`}
          color="#FFBF00"
          icon="👥"
        />
        <StatCard
          title="Connected Devices"
          value={currentData.campus_total.total_devices.toLocaleString()}
          subtitle="3 devices per client"
          color="#FFFFFF"
          icon="📱"
        />
        <StatCard
          title="Avg WAP Load"
          value={currentData.campus_total.avg_zone_load.toFixed(2)}
          subtitle="devices per access point"
          color="#8B4513"
          icon="📡"
        />
        <StatCard
          title="Active Zones"
          value={Object.values(currentData.zones).filter(z => z.active_clients > 50).length}
          subtitle={`of ${metadata.zones} total zones`}
          color="#FFD700"
          icon="🗺️"
        />
      </div>

      {/* Views */}
      {viewMode === 'overview' && (
        <>
          <div style={chartContainerStyle}>
            <h3 style={chartTitleStyle}>24-Hour Campus Activity</h3>
            <ResponsiveContainer width="100%" height={320}>
              <AreaChart data={campusTimelineData}>
                <defs>
                  <linearGradient id="clientsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FFBF00" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#FFBF00" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="devicesGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FFFFFF" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#FFFFFF" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.15)" />
                <XAxis dataKey="hour" stroke="#f5f5f5" style={{ fontSize: '0.8rem' }} />
                <YAxis stroke="#f5f5f5" style={{ fontSize: '0.8rem' }} />
                <Tooltip 
                  contentStyle={{ 
                    background: 'rgba(80, 0, 0, 0.95)', 
                    border: '2px solid #FFBF00',
                    borderRadius: '8px',
                    fontFamily: 'inherit',
                    color: '#f5f5f5'
                  }}
                />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="clients" 
                  stroke="#FFBF00" 
                  strokeWidth={3}
                  fill="url(#clientsGradient)" 
                  name="Active Clients"
                />
                <Area 
                  type="monotone" 
                  dataKey="devices" 
                  stroke="#FFFFFF" 
                  strokeWidth={2}
                  fill="url(#devicesGradient)"
                  name="Total Devices"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div style={chartContainerStyle}>
            <h3 style={chartTitleStyle}>Zone Distribution at {currentData.timestamp}</h3>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={zoneComparisonData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.15)" />
                <XAxis dataKey="zone" stroke="#f5f5f5" style={{ fontSize: '0.8rem' }} />
                <YAxis stroke="#f5f5f5" style={{ fontSize: '0.8rem' }} />
                <Tooltip 
                  contentStyle={{ 
                    background: 'rgba(80, 0, 0, 0.95)', 
                    border: '2px solid #FFBF00',
                    borderRadius: '8px',
                    fontFamily: 'inherit',
                    color: '#f5f5f5'
                  }}
                />
                <Legend />
                <Bar dataKey="clients" fill="#FFBF00" name="Active Clients" />
                <Bar dataKey="wapLoad" fill="#8B4513" name="Avg WAP Load" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      )}

      {viewMode === 'zones' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '1.5rem' }}>
          <div style={chartContainerStyle}>
            <h3 style={chartTitleStyle}>Zone Performance Radar</h3>
            <ResponsiveContainer width="100%" height={450}>
              <RadarChart data={zoneRadarData}>
                <PolarGrid stroke="rgba(255,255,255,0.3)" />
                <PolarAngleAxis dataKey="zone" stroke="#f5f5f5" style={{ fontSize: '0.85rem', fontWeight: '600' }} />
                <PolarRadiusAxis stroke="#f5f5f5" style={{ fontSize: '0.75rem' }} />
                <Radar name="Utilization %" dataKey="utilization" stroke="#FFBF00" fill="#FFBF00" fillOpacity={0.4} strokeWidth={2} />
                <Radar name="WAP Load %" dataKey="wapLoad" stroke="#8B4513" fill="#8B4513" fillOpacity={0.3} strokeWidth={2} />
                <Radar name="Buildings %" dataKey="buildings" stroke="#FFFFFF" fill="#FFFFFF" fillOpacity={0.2} strokeWidth={2} />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            {Object.entries(currentData.zones).map(([zone, data]) => (
              <div
                key={zone}
                style={{
                  background: 'rgba(255, 191, 0, 0.08)',
                  border: '2px solid rgba(255, 191, 0, 0.3)',
                  borderRadius: '10px',
                  padding: '1.2rem',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#FFBF00';
                  e.currentTarget.style.background = 'rgba(255, 191, 0, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255, 191, 0, 0.3)';
                  e.currentTarget.style.background = 'rgba(255, 191, 0, 0.08)';
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <span style={{ fontWeight: '700', color: '#FFBF00', fontSize: '1.1rem' }}>Zone {zone}</span>
                  <span style={{ fontSize: '0.85rem', opacity: 0.8 }}>
                    {zoneInfo[zone].buildings} bldgs
                  </span>
                </div>
                <div style={{ fontSize: '0.9rem', opacity: 0.9, lineHeight: '1.6' }}>
                  <div>👥 {data.active_clients.toLocaleString()} clients</div>
                  <div>📱 {data.total_devices.toLocaleString()} devices</div>
                  <div>📡 {data.avg_wap_load.toFixed(2)} WAP load</div>
                  <div style={{ fontSize: '0.8rem', marginTop: '0.5rem', opacity: 0.7 }}>
                    {zoneInfo[zone].aps} APs • {data.buildings_active} active
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {viewMode === 'heatmap' && (
        <div style={chartContainerStyle}>
          <h3 style={chartTitleStyle}>Zone Activity Heatmap (24 Hours)</h3>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: `60px repeat(24, 1fr)`,
            gap: '3px',
            fontSize: '0.75rem'
          }}>
            <div></div>
            {Array.from({ length: 24 }, (_, i) => (
              <div key={i} style={{ textAlign: 'center', opacity: 0.7, fontWeight: '600' }}>
                {String(i).padStart(2, '0')}
              </div>
            ))}
            
            {Object.keys(currentData.zones).map(zone => (
              <React.Fragment key={zone}>
                <div style={{ display: 'flex', alignItems: 'center', fontWeight: '700', color: '#FFBF00' }}>
                  Zone {zone}
                </div>
                {simulationData.hourly_stats.map((hourData, hour) => {
                  const zoneData = hourData.zones[zone];
                  const utilization = zoneInfo ? zoneData.active_clients / zoneInfo[zone].allocated_clients : 0;
                  const intensity = Math.min(1, utilization * 1.3);
                  
                  return (
                    <div
                      key={hour}
                      style={{
                        background: `rgba(255, 191, 0, ${intensity * 0.8})`,
                        border: hour === currentHour ? '3px solid #FFBF00' : '1px solid rgba(255,255,255,0.2)',
                        borderRadius: '6px',
                        aspectRatio: '1',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        boxShadow: hour === currentHour ? '0 0 15px rgba(255, 191, 0, 0.6)' : 'none'
                      }}
                      title={`${hourData.timestamp}: ${zoneData.active_clients} clients`}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scale(1.15)';
                        e.currentTarget.style.zIndex = '10';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                        e.currentTarget.style.zIndex = '1';
                      }}
                    />
                  );
                })}
              </React.Fragment>
            ))}
          </div>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '1.5rem', 
            marginTop: '2rem',
            fontSize: '0.9rem',
            opacity: 0.8
          }}>
            <span style={{ fontWeight: '600' }}>Activity Level:</span>
            <span>Low</span>
            <div style={{ 
              flex: 1, 
              height: '24px', 
              background: 'linear-gradient(90deg, rgba(255,191,0,0.1) 0%, rgba(255,191,0,0.8) 100%)',
              borderRadius: '6px',
              border: '1px solid rgba(255,191,0,0.3)'
            }} />
            <span>High</span>
          </div>
        </div>
      )}

      {/* Footer */}
      <div style={{
        marginTop: '3rem',
        padding: '2rem 1.5rem',
        borderTop: '2px solid rgba(255,191,0,0.3)',
        fontSize: '0.9rem',
        opacity: 0.8,
        textAlign: 'center'
      }}>
        <div style={{ color: '#FFBF00', fontWeight: '600', marginBottom: '0.5rem' }}>
          Network Infrastructure
        </div>
        <div>Juniper AP47 Access Points · Mist Edge X6 · EX-4400-48MP Switches</div>
        <div style={{ marginTop: '0.75rem', fontSize: '0.85rem', opacity: 0.7 }}>
          Memory-efficient simulation engine · 90,000 clients · 270,000 devices · 22,019 APs
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, subtitle, color, icon }) => (
  <div style={{
    background: 'rgba(255, 191, 0, 0.08)',
    border: `2px solid ${color}40`,
    borderRadius: '12px',
    padding: '1.5rem',
    transition: 'all 0.3s ease',
    cursor: 'pointer'
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.borderColor = color;
    e.currentTarget.style.transform = 'translateY(-3px)';
    e.currentTarget.style.boxShadow = `0 10px 30px ${color}30`;
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.borderColor = `${color}40`;
    e.currentTarget.style.transform = 'translateY(0)';
    e.currentTarget.style.boxShadow = 'none';
  }}>
    <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{icon}</div>
    <div style={{ fontSize: '0.85rem', opacity: 0.8, marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{title}</div>
    <div style={{ 
      fontSize: '2.2rem', 
      fontWeight: '700', 
      color,
      marginBottom: '0.25rem'
    }}>
      {value}
    </div>
    <div style={{ fontSize: '0.85rem', opacity: 0.7 }}>{subtitle}</div>
  </div>
);

const chartContainerStyle = {
  background: 'rgba(255, 191, 0, 0.05)',
  border: '2px solid rgba(255, 191, 0, 0.3)',
  borderRadius: '12px',
  padding: '1.75rem',
  marginBottom: '1.5rem',
  backdropFilter: 'blur(10px)'
};

const chartTitleStyle = {
  margin: '0 0 1.5rem 0',
  fontSize: '1.35rem',
  fontWeight: '600',
  color: '#FFBF00',
  textTransform: 'uppercase',
  letterSpacing: '0.05em'
};

export default TAMUWiFiDashboard;
