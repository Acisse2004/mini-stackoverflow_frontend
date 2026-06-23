import { useState, useRef } from 'react'
import ReactMarkdown from 'react-markdown'

export default function MarkdownEditor({ value = '', onChange, placeholder = 'Ecrivez en Markdown...' }) {
  const [preview, setPreview] = useState(false)
  const taRef = useRef(null)

  // Protection contre undefined
  const safeValue = value || ''

  const applyFormat = (before, after = '') => {
    const ta = taRef.current
    if (!ta) return
    const start    = ta.selectionStart
    const end      = ta.selectionEnd
    const selected = safeValue.slice(start, end)
    let newText, cursorStart, cursorEnd
    if (selected) {
      newText     = safeValue.slice(0, start) + before + selected + after + safeValue.slice(end)
      cursorStart = start + before.length
      cursorEnd   = start + before.length + selected.length
    } else {
      const ph    = 'texte'
      newText     = safeValue.slice(0, start) + before + ph + after + safeValue.slice(end)
      cursorStart = start + before.length
      cursorEnd   = start + before.length + ph.length
    }
    onChange(newText)
    requestAnimationFrame(() => {
      ta.focus()
      ta.setSelectionRange(cursorStart, cursorEnd)
    })
  }

  const applyLine = (prefix) => {
    const ta = taRef.current
    if (!ta) return
    const start     = ta.selectionStart
    const lineStart = safeValue.lastIndexOf('\n', start - 1) + 1
    const newText   = safeValue.slice(0, lineStart) + prefix + safeValue.slice(lineStart)
    onChange(newText)
    requestAnimationFrame(() => {
      ta.focus()
      ta.setSelectionRange(start + prefix.length, start + prefix.length)
    })
  }

  const applyCodeBlock = () => {
    const ta = taRef.current
    if (!ta) return
    const start   = ta.selectionStart
    const block   = '```\ncode ici\n```'
    const newText = safeValue.slice(0, start) + '\n' + block + '\n' + safeValue.slice(start)
    onChange(newText)
    requestAnimationFrame(() => {
      ta.focus()
      ta.setSelectionRange(start + 5, start + 13)
    })
  }

  const applyLink = () => {
    const ta = taRef.current
    if (!ta) return
    const start    = ta.selectionStart
    const end      = ta.selectionEnd
    const selected = safeValue.slice(start, end) || 'texte du lien'
    const link     = `[${selected}](url)`
    const newText  = safeValue.slice(0, start) + link + safeValue.slice(end)
    onChange(newText)
    requestAnimationFrame(() => {
      ta.focus()
      const urlStart = start + selected.length + 3
      ta.setSelectionRange(urlStart, urlStart + 3)
    })
  }

  const handleKeyDown = (e) => {
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case 'b': e.preventDefault(); applyFormat('**', '**'); break
        case 'i': e.preventDefault(); applyFormat('*', '*');   break
        case 'k': e.preventDefault(); applyLink();              break
        default: break
      }
    }
    if (e.key === 'Tab') {
      e.preventDefault()
      const ta    = taRef.current
      const start = ta.selectionStart
      const next  = safeValue.slice(0, start) + '  ' + safeValue.slice(start)
      onChange(next)
      requestAnimationFrame(() => {
        ta.focus()
        ta.setSelectionRange(start + 2, start + 2)
      })
    }
  }

  const buttons = [
    { label: 'G',   title: 'Gras',        action: () => applyFormat('**', '**'), style: { fontWeight: 700 } },
    { label: 'je',  title: 'Italique',     action: () => applyFormat('*', '*'),   style: { fontStyle: 'italic' } },
    { label: 's',   title: 'Barre',        action: () => applyFormat('~~', '~~'), style: { textDecoration: 'line-through' } },
    { label: 'SEP' },
    { label: 'H1',  title: 'Titre 1',      action: () => applyLine('# '),         style: { fontWeight: 700, fontSize: 11 } },
    { label: 'H2',  title: 'Titre 2',      action: () => applyLine('## '),        style: { fontWeight: 700, fontSize: 11 } },
    { label: 'H3',  title: 'Titre 3',      action: () => applyLine('### '),       style: { fontWeight: 700, fontSize: 11 } },
    { label: 'SEP' },
    { label: '`',   title: 'Code inline',  action: () => applyFormat('`', '`'),   style: { fontFamily: 'monospace' } },
    { label: '{ }', title: 'Bloc de code', action: applyCodeBlock,                style: { fontFamily: 'monospace', fontSize: 11 } },
    { label: 'SEP' },
    { label: '-',   title: 'Liste',        action: () => applyLine('- '),         style: {} },
    { label: '1.',  title: 'Liste num.',   action: () => applyLine('1. '),        style: {} },
    { label: '🔗',  title: 'Lien',         action: applyLink,                     style: {} },
  ]

  return (
    <div style={{ border: '1px solid #d6d9dc', borderRadius: 4, overflow: 'hidden', background: '#fff' }}>

      {/* Toolbar */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 2,
        padding: '6px 10px', background: '#f6f6f6',
        borderBottom: '1px solid #d6d9dc', flexWrap: 'wrap',
      }}>
        {buttons.map((btn, i) => {
          if (btn.label === 'SEP') return (
            <div key={i} style={{ width: 1, height: 18, background: '#d6d9dc', margin: '0 4px' }} />
          )
          return (
            <button
              key={btn.label + i}
              type="button"
              title={btn.title}
              onMouseDown={(e) => {
                e.preventDefault()
                e.stopPropagation()
                btn.action()
              }}
              style={{
                padding: '4px 8px', fontSize: 12,
                border: '1px solid #d6d9dc', borderRadius: 3,
                background: '#fff', cursor: 'pointer',
                color: '#525960', lineHeight: 1.3,
                userSelect: 'none', ...btn.style,
              }}
            >
              {btn.label}
            </button>
          )
        })}

        {/* Onglets Editer / Apercu */}
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 2 }}>
          <button
            type="button"
            onMouseDown={(e) => { e.preventDefault(); setPreview(false) }}
            style={{
              padding: '4px 10px', fontSize: 12, borderRadius: 3,
              cursor: 'pointer', border: '1px solid #d6d9dc',
              background: !preview ? '#f48024' : '#fff',
              color: !preview ? '#fff' : '#525960',
              fontWeight: !preview ? 600 : 400, userSelect: 'none',
            }}
          >
            Editeur
          </button>
          <button
            type="button"
            onMouseDown={(e) => { e.preventDefault(); setPreview(true) }}
            style={{
              padding: '4px 10px', fontSize: 12, borderRadius: 3,
              cursor: 'pointer', border: '1px solid #d6d9dc',
              background: preview ? '#f48024' : '#fff',
              color: preview ? '#fff' : '#525960',
              fontWeight: preview ? 600 : 400, userSelect: 'none',
            }}
          >
            Apercu
          </button>
        </div>
      </div>

      {/* Zone edition / apercu */}
      {preview ? (
        <div style={{ minHeight: 150, padding: '12px 14px', background: '#fff', lineHeight: 1.75 }} className="md-body">
          {safeValue
            ? <ReactMarkdown>{safeValue}</ReactMarkdown>
            : <span style={{ color: '#838c95', fontSize: 13 }}>Rien a afficher.</span>
          }
        </div>
      ) : (
        <div style={{ position: 'relative' }}>
          <textarea
            ref={taRef}
            value={safeValue}
            onChange={e => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            style={{
              width: '100%', minHeight: 150,
              padding: '10px 14px', border: 'none', outline: 'none',
              fontFamily: "'JetBrains Mono', monospace", fontSize: 13,
              lineHeight: 1.75, resize: 'vertical', background: '#fff',
              display: 'block',
            }}
          />
          <div style={{
            position: 'absolute', bottom: 6, right: 10,
            fontSize: 11, color: '#838c95', pointerEvents: 'none',
          }}>
            {safeValue.length} caractere{safeValue.length !== 1 ? 's' : ''}
          </div>
        </div>
      )}
    </div>
  )
}