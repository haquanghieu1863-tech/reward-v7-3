import AdsPlayer from './AdsPlayer.jsx';

export function ComponentRegistry(settings) {
  return {
    Hero: ({ title, subtitle, image }) => (
      <div style={{margin:'12px 0'}}>
        <div style={{
          position:'relative', overflow:'hidden', borderRadius:16, border:'1px solid #ffffff22',
          background:`linear-gradient(135deg, ${settings?.site?.primary||'#d71920'} 0%, #7a0b12 60%)`, padding:20
        }}>
          <div style={{ display:'flex', gap:16, alignItems:'center' }}>
            {image && <img src={image} alt="" style={{ width:120, height:80, objectFit:'cover',
              border:'1px solid #ffffff44', borderRadius:8 }} />}
            <div style={{ flex:1 }}>
              <h2 style={{ margin:0, fontSize:26, color:'#fff' }}>{title}</h2>
              {subtitle && <p style={{ margin:'4px 0 0', opacity:.9 }}>{subtitle}</p>}
            </div>
          </div>
        </div>
      </div>
    ),
    Text: ({ text }) => (
      <div style={{ padding:16, background:'#0f172a', border:'1px solid #1e293b', borderRadius:12, margin:'8px 0', whiteSpace:'pre-wrap' }}>{text}</div>
    ),
    AdsList: ({}) => <AdsPlayer settings={settings} />,
    Spacer: ({ height=16 }) => <div style={{ height }} />,
    ButtonRow: ({ buttons=[] }) => (
      <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
        {buttons.map((b,i)=>(
          <a key={i} href={b.href||'#'} style={{ padding:'10px 14px', background:settings?.site?.secondary||'#ffd700', color:'#540000',
            borderRadius:10, textDecoration:'none', fontWeight:700 }}>{b.label||'Button'}</a>
        ))}
      </div>
    ),
    TableBlock: ({ columns=[], rows=[] }) => (
      <div style={{ overflow:'auto' }}>
        <table>
          <thead><tr>{columns.map((c,i)=><th key={i}>{c}</th>)}</tr></thead>
          <tbody>{rows.map((r,i)=><tr key={i}>{r.map((cell,j)=><td key={j}>{String(cell)}</td>)}</tr>)}</tbody>
        </table>
      </div>
    ),
    QnABlock: ({ items=[] }) => (
      <div style={{ display:'grid', gap:8 }}>
        {items.map((it,i)=>(
          <div key={i} style={{ padding:12, background:'#0f172a', border:'1px solid #1e293b', borderRadius:12 }}>
            <div style={{fontWeight:800}}>{it.q}</div>
            <div style={{opacity:.9}}>{it.a}</div>
          </div>
        ))}
      </div>
    ),
    TaskListBlock: ({ items=[] }) => (
      <div style={{ display:'grid', gap:8 }}>
        {items.map((t,i)=>(
          <div key={i} style={{ padding:12, background:'#0f172a', border:'1px solid #1e293b', borderRadius:12, display:'flex', justifyContent:'space-between' }}>
            <div><div style={{fontWeight:800}}>{t.title}</div><div style={{opacity:.8}}>{t.desc||''}</div></div>
            <div style={{fontWeight:800, color:'#ffd700'}}>+{t.reward}</div>
          </div>
        ))}
      </div>
    ),
    CustomLinksBlock: ({ links=[] }) => (
      <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
        {links.map((it,i)=>(
          <a key={i} href={it.href||'#'} target="_blank" rel="noopener noreferrer"
             style={{display:'inline-flex',alignItems:'center',gap:8,padding:'10px 14px',
                     background:settings?.site?.secondary||'#ffd700', color:'#540000',
                     borderRadius:10, textDecoration:'none', fontWeight:700}}>
            {it.icon && <span style={{filter:'drop-shadow(0 1px 1px rgba(0,0,0,.25))'}}>{it.icon}</span>}
            <span>{it.label||'Link'}</span>
          </a>
        ))}
      </div>
    ),
    GameEmbedBlock: ({ title='Mini Game', src='', height=420, sandbox=true, allow='' , raw='' }) => (
      <div style={{ margin:'8px 0', border:'1px solid #1e293b', borderRadius:12, overflow:'hidden' }}>
        <div style={{ padding:'8px 12px', background:'#0f172a', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <strong>{title}</strong>
          <span style={{opacity:.7}}>{src ? 'iframe' : (raw ? 'raw-embed' : '')}</span>
        </div>
        {src ? (
          <iframe
            title={title}
            src={src}
            style={{width:'100%', height:height+'px', border:0, display:'block', background:'#000'}}
            sandbox={sandbox ? 'allow-scripts allow-same-origin allow-popups allow-forms' : undefined}
            allow={allow||undefined}
          />
        ) : raw ? (
          <div style={{padding:0, background:'#000'}}>
            {(() => {
              const clean = String(raw)
                .replace(/<\/?script[^>]*>/gi, '')
                .replace(/ on[a-z]+="[^"]*"/gi, '')
                .replace(/ on[a-z]+='[^']*'/gi, '')
                .replace(/javascript:/gi, '');
              return (<div dangerouslySetInnerHTML={{ __html: clean }} />);
            })()}
          </div>
        ) : (
          <div style={{ padding:12, opacity:.7 }}>Nhập <b>src</b> (URL game iframe) hoặc <b>raw</b> (mã nhúng HTML đơn giản).</div>
        )}
      </div>
    ),
  };
}

export function PageRenderer({ page, settings }) {
  const R = ComponentRegistry(settings);
  if (!page?.blocks) return null;
  return (
    <div style={{ display:'grid', gap:16 }}>
      {page.blocks.map((blk, idx) => {
        const Cmp = R[blk.type];
        if (!Cmp) return <div key={idx} style={{opacity:.6,border:'1px dashed #334155',padding:12}}>Unknown block: {blk.type}</div>;
        return <Cmp key={idx} {...blk.props} />;
      })}
    </div>
  );
}
