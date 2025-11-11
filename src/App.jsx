import React, {useState} from 'react'
const API_BASE = 'https://universal-dl-one.vercel.app'
const endpoints = [
  {path:'/api/instagram?url=', label:'Instagram'},
  {path:'/api/tiktok?url=', label:'TikTok'},
  {path:'/api/youtube?url=', label:'YouTube'},
  {path:'/api/facebook?url=', label:'Facebook'},
  {path:'/api/pinterest?url=', label:'Pinterest'},
  {path:'/api/twitter?url=', label:'Twitter'},
]

export default function App(){
  const [input, setInput] = useState('')
  const [selected, setSelected] = useState(endpoints[0].path)

  function openResult(){
    if(!input) return alert('Please paste a URL to try')
    const full = `${API_BASE}${selected}${encodeURIComponent(input)}`
    window.open(full, '_blank')
  }

  return (
    <div className="page">
      <header className="top">
        <div className="wrap">
          <h1>Universal Downloader API</h1>
          <p className="by">Creator: <strong>Denish Tharu</strong></p>
        </div>
      </header>

      <main className="wrap">
        <section className="card">
          <h2>Available Endpoints</h2>
          <div className="grid">
            {endpoints.map(e => (
              <div key={e.path} className="ep">
                <div className="path">{e.path}</div>
                <div className="example">GET {API_BASE}{e.path}<span className="small">https://example.com/post/123</span></div>
                <button onClick={()=>window.open(`${API_BASE}${e.path}${encodeURIComponent('https://example.com/sample')}`,'_blank')}>Try Now</button>
              </div>
            ))}
          </div>
        </section>

        <section className="card">
          <h3>Try an endpoint</h3>
          <input value={input} onChange={e=>setInput(e.target.value)} placeholder="Paste a URL to download from" />
          <select value={selected} onChange={e=>setSelected(e.target.value)}>
            {endpoints.map(ep=> <option key={ep.path} value={ep.path}>{ep.label}</option>)}
          </select>
          <div className="actions">
            <button onClick={openResult}>Open Result</button>
          </div>
        </section>
      </main>

      <footer className="foot">© {new Date().getFullYear()} Denish Tharu</footer>
    </div>
  )
                                        }
