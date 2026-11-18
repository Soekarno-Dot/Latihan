import { useState } from 'react'
import {
  Activity, Archive, Bell, ChevronDown, ChevronRight, CircleDot,
  Database, Download, Expand, FolderKanban, GitBranch,
  Grid2X2, Network, RefreshCw,
  Search, Settings, Share2, SlidersHorizontal, Users, ZoomIn, ZoomOut,
} from 'lucide-react'
import './App.css'

const navItems = [
  { label: 'Target Collection', icon: CircleDot },
  { label: 'Graph Workspaces', icon: Network },
  { label: 'SNA Metrics & Centrality', icon: Activity },
  { label: 'Data Explorer', icon: Database },
  { label: 'Export & Violation', icon: Archive },
]

const kpis = [
  { label: 'TOTAL NODES', value: '1,420', sub: '+22.6% vs last period', accent: 'cyan' },
  { label: 'TOTAL LINKS', value: '18,940', sub: 'Growth rate 7.8%', accent: 'cyan' },
  { label: 'CLUSTERING COEF.', value: '142.5k', sub: '+9.8% tracking velocity', accent: 'blue' },
  { label: 'DATA FLOW', value: '8,456', sub: 'Max / 24.1k entities', accent: 'purple' },
  { label: 'ACTIVE WORKLOAD', value: '2 Active', sub: 'Online (Pusher)', accent: 'green' },
]

const nodes = [
  { x: 500, y: 175, r: 18, c: '#8dd9ff', label: '@warung_sekitar', sx: 516, sy: 168 },
  { x: 318, y: 113, r: 10, c: '#5da6da' },
  { x: 354, y: 148, r: 8, c: '#6185be' },
  { x: 430, y: 92, r: 9, c: '#4db2cf' },
  { x: 460, y: 132, r: 16, c: '#7ce7bc', label: '@bekasi_angkringan', sx: 482, sy: 128 },
  { x: 560, y: 112, r: 9, c: '#587cc2' },
  { x: 584, y: 150, r: 9, c: '#64b7ab' },
  { x: 610, y: 205, r: 8, c: '#6572ba' },
  { x: 640, y: 132, r: 7, c: '#53a5a4' },
  { x: 390, y: 220, r: 19, c: '#7bc4ec', label: '@jogja_kuliner', sx: 414, sy: 214 },
  { x: 278, y: 205, r: 8, c: '#8a79ca' },
  { x: 348, y: 270, r: 12, c: '#6a86c9' },
  { x: 430, y: 250, r: 8, c: '#53b9ad' },
  { x: 470, y: 292, r: 15, c: '#7f7fd6', label: '@yogya_spots', sx: 493, sy: 286 },
  { x: 525, y: 220, r: 9, c: '#56aab3' },
  { x: 288, y: 294, r: 7, c: '#6d72ae' },
  { x: 620, y: 260, r: 7, c: '#64b2a5' },
  { x: 562, y: 284, r: 8, c: '#658ec3' },
  { x: 246, y: 166, r: 7, c: '#4774c4' },
]

const edges = [
  [500,175,318,113],[500,175,354,148],[500,175,430,92],[500,175,460,132],
  [500,175,560,112],[500,175,584,150],[500,175,610,205],[500,175,640,132],
  [500,175,390,220],[500,175,278,205],[500,175,348,270],[500,175,430,250],
  [390,220,278,205],[390,220,348,270],[390,220,430,250],[390,220,470,292],
  [390,220,525,220],[390,220,288,294],[460,132,525,220],[460,132,584,150],
  [470,292,562,284],[470,292,525,220],[470,292,620,260],[318,113,246,166],
]

const influencers = [
  ['1','@warung_sekitar','Warung & Kuliner','0.872','34.7k','28','+12.8%','Active'],
  ['2','@jogja_kuliner','Kuliner Lokal','0.756','19.4k','19','+8.2%','Active'],
  ['3','@hype_bekasi','Social Discovery','0.709','15.8k','14','+5.4%','Monitor'],
  ['4','@kuliner_jogja','Kuliner & Street','0.685','12.2k','11','+4.1%','Active'],
]

const posts = [
  ['@warung_sekitar','Makan malam di warung pinggir kota, tempatnya nyaman dan...', 'Kuliner Lokal','Warung bakso & mie','2026-11-18 14:42','12.8k','1.24k'],
  ['@jogja_kuliner','Liburan sore di Malioboro jadi lebih seru dengan jajanan...', 'Kuliner Lokal','Kuliner jogja','2026-11-18 12:35','8.9k','860'],
  ['@hype_bekasi','Spot baru di Bekasi untuk nongkrong sambil menikmati live...', 'Lifestyle','Food & café','2026-11-18 10:18','6.7k','512'],
]

function App() {
  const [metric, setMetric] = useState('PageRank')
  const [platform, setPlatform] = useState('All Platform')
  const [range, setRange] = useState('Last 30 Days')
  const [activeNav, setActiveNav] = useState('Graph Workspaces')
  const [tab, setTab] = useState('Entire')
  const [zoom, setZoom] = useState(100)

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark"><GitBranch size={18} /></div>
          <div><strong>GraphScope</strong><span>INTEL</span></div>
        </div>
        <button className="workspace">
          <span className="workspace-icon"><FolderKanban size={15} /></span>
          <span><small>Workspace</small><b>North Semarang</b></span>
          <ChevronDown size={14} />
        </button>
        <nav>
          {navItems.map(({ label, icon: Icon }) => (
            <button key={label} className={activeNav === label ? 'active' : ''} onClick={() => setActiveNav(label)}>
              <Icon size={16} /><span>{label}</span>
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <button><Settings size={16} /><span>Settings</span></button>
          <div className="profile">
            <div className="avatar">RK</div>
            <div><b>Raka Kusuma</b><small>raka@graphintel.ai</small></div>
            <ChevronRight size={14} />
          </div>
        </div>
      </aside>

      <main>
        <header className="topbar">
          <div className="page-title"><h1>Social Media Intelligence</h1><span>Premier in Admin Dashboards & <b>Network Analyst</b></span></div>
          <div className="top-actions">
            <button className="export"><Download size={14} /> Export</button>
            <button className="icon-button"><Search size={16} /></button>
            <button className="icon-button notification"><Bell size={16} /><i /></button>
            <div className="header-avatar">RK</div>
          </div>
        </header>

        <section className="filters">
          <div className="filter-left">
            <label>PLATFORM</label>
            <button onClick={() => setPlatform(platform === 'All Platform' ? 'Instagram' : 'All Platform')}>{platform}<ChevronDown size={12} /></button>
          </div>
          <div className="filter-left">
            <label>TIMEFRAME</label>
            <button onClick={() => setRange(range === 'Last 30 Days' ? 'Last 7 Days' : 'Last 30 Days')}>{range}<ChevronDown size={12} /></button>
          </div>
          <div className="filter-center"><span>Network visualizations</span><b>Nov 18, 2026</b></div>
          <button className="filter-button"><SlidersHorizontal size={13} /> Filters</button>
          <button className="icon-button"><Grid2X2 size={15} /></button>
          <button className="icon-button"><RefreshCw size={15} /></button>
        </section>

        <section className="kpis">
          {kpis.map((kpi) => (
            <article key={kpi.label} className={kpi.accent}>
              <small>{kpi.label}</small>
              <strong>{kpi.value}</strong>
              <span>{kpi.sub}</span>
            </article>
          ))}
        </section>

        <section className="collection">
          <div>
            <small>TARGET CONNECTION</small>
            <b><span className="status-dot" /> @warung_sekitar <i>→</i> Semarang & Central Java</b>
          </div>
          <div className="collection-metrics">
            <span><small>UNIQUE POSTS</small><b>18,940</b></span>
            <span><small>SEEN UNITS</small><b>142.5k</b></span>
            <span><small>QUALITY SCORE</small><b>24.1k</b></span>
          </div>
        </section>

        <section className="workspace-grid">
          <div className="graph-panel panel">
            <div className="panel-head graph-head">
              <div><Network size={14} /><strong>Interactive Graph Canvas</strong><span className="live">LIVE</span></div>
              <div className="graph-tabs">
                {['Entire','Focused','Circular'].map((item) => <button key={item} className={tab === item ? 'active' : ''} onClick={() => setTab(item)}>{item}</button>)}
              </div>
              <button className="auto-layout"><span /> Auto Layout</button>
            </div>
            <div className="canvas">
              <div className="canvas-tools">
                <button onClick={() => setZoom(Math.min(150, zoom + 10))}><ZoomIn size={14} /></button>
                <button onClick={() => setZoom(Math.max(70, zoom - 10))}><ZoomOut size={14} /></button>
                <button><Expand size={14} /></button>
              </div>
              <svg viewBox="0 0 760 360" style={{ transform: `scale(${zoom / 100})` }} aria-label="Social network graph">
                <defs>
                  <filter id="glow"><feGaussianBlur stdDeviation="4" result="blur" /><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
                </defs>
                {edges.map(([x1,y1,x2,y2], i) => <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} className="edge" />)}
                {nodes.map((node, i) => (
                  <g key={i} className="graph-node">
                    <circle cx={node.x} cy={node.y} r={node.r + 5} fill={node.c} opacity=".12" />
                    <circle cx={node.x} cy={node.y} r={node.r} fill={node.c} opacity=".88" filter={node.label ? 'url(#glow)' : undefined} />
                    {node.label && <text x={node.sx} y={node.sy} className="node-label">{node.label}</text>}
                  </g>
                ))}
              </svg>
              <div className="legend">
                <span><i className="cy" /> Account</span><span><i className="cb" /> Post</span><span><i className="cg" /> Community</span>
              </div>
              <div className="canvas-status"><span>Nodes: <b>1,420</b></span><span>Edges: <b>18,940</b></span></div>
            </div>
          </div>

          <aside className="right-panel">
            <div className="panel worker">
              <div className="panel-head"><div><Activity size={14} /><strong>Back & Worker Queues</strong></div><span className="live">2</span></div>
              <div className="queue-row"><span>Analysis Job</span><b className="queued">Running</b></div>
              <div className="progress"><i /></div>
              <div className="queue-stats"><span>Data Flow <b>18.7k</b></span><span>Rate <b>8.9k</b></span></div>
              <div className="worker-card">
                <div><small>Worker Status</small><b>● Active</b></div>
                <div><small>Avg Processing</small><b>1.24s</b></div>
                <div><small>Queue Length</small><b>342</b></div>
              </div>
            </div>
            <div className="panel details">
              <div className="panel-head"><div><CircleDot size={14} /><strong>Node Details</strong></div><span className="live">DIGITAL</span></div>
              <div className="node-profile">
                <div className="node-avatar">@W</div>
                <div><small>SELECTED NODE</small><b>@warung_sekitar</b></div>
              </div>
              <div className="detail-grid">
                <span>Platform<b>Instagram</b></span><span>In-degree<b>1,248</b></span>
                <span>Out-degree<b>986</b></span><span>PageRank<b>0.872</b></span>
                <span>Betweenness<b>0.684</b></span><span>Community<b>Cluster 01</b></span>
              </div>
            </div>
          </aside>
        </section>

        <section className="bottom-grid">
          <div className="panel influencer">
            <div className="panel-head">
              <div><Users size={14} /><strong>Top Influencers & Broker Rankings</strong><span>(SNA Centrality)</span></div>
              <div className="metric-picker">
                {['Degree','Betweenness','PageRank'].map((item) => <button key={item} className={metric === item ? 'active' : ''} onClick={() => setMetric(item)}>{item}</button>)}
              </div>
            </div>
            <table>
              <thead><tr><th>RANK</th><th>ACCOUNT</th><th>COMMUNITY</th><th>{metric.toUpperCase()}</th><th>FOLLOWERS</th><th>GROWTH</th><th>STATUS</th></tr></thead>
              <tbody>{influencers.map((row) => <tr key={row[0]}><td>{row[0]}</td><td><b>{row[1]}</b></td><td>{row[2]}</td><td>{row[3]}</td><td>{row[4]}</td><td><span className="growth">{row[6]}</span></td><td><span className={row[7] === 'Active' ? 'active-status' : 'monitor-status'}>{row[7]}</span></td></tr>)}</tbody>
            </table>
          </div>
          <div className="panel community">
            <div className="panel-head"><div><Share2 size={14} /><strong>Community Topology</strong></div><button className="mini">Topology</button></div>
            <div className="community-item"><i className="purple" /><div><b>Cluster 1: Bekasi Kuliner</b><span>16 accounts · 2.1k edges</span></div><strong>32.8%</strong></div>
            <div className="community-item"><i className="blue" /><div><b>Cluster 2: Jogja & Street</b><span>12 accounts · 1.5k edges</span></div><strong>24.6%</strong></div>
            <div className="community-item"><i className="green" /><div><b>Cluster 3: Daily Spots</b><span>9 accounts · 980 edges</span></div><strong>18.2%</strong></div>
          </div>
        </section>

        <section className="panel post-panel">
          <div className="panel-head">
            <div><Database size={14} /><strong>Canonical Data Receiver & Raw Entities</strong><span>(Ensemble API / PER-POST)</span></div>
            <div className="metric-picker"><button className="active">View Sample</button><button>Raw API</button></div>
          </div>
          <table>
            <thead><tr><th>ACCOUNT</th><th>TEXT / CAPTION</th><th>HASHTAG</th><th>MENTIONS</th><th>TIMESTAMP</th><th>LIKES</th><th>COMMENTS</th></tr></thead>
            <tbody>{posts.map((row, i) => <tr key={i}><td><b>{row[0]}</b></td><td>{row[1]}</td><td>{row[2]}</td><td>{row[3]}</td><td>{row[4]}</td><td>{row[5]}</td><td>{row[6]}</td></tr>)}</tbody>
          </table>
        </section>
      </main>
    </div>
  )
}

export default App
