import { useState } from 'react'
import ReactMarkdown from 'react-markdown'

export default function MarkdownEditor({ value, onChange, placeholder = 'Ecrivez en Markdown...' }) {
  const [preview, setPreview] = useState(false)

  const insert = (before, after = '') => {
    onChange(value + before + after)
  }

  return (
    <div style={{ border: '1px solid #d6d9dc', borderRadius: 4, overflow: 'hidden' }}>

      {/* Barre d'outils */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 4,
        padding: '6px 10px', background: '#f6f6f6',
        borderBottom: '1px solid #d6d9dc', flexWrap: 'wrap',
      }}>
        {[
          { label: 'G',   title: 'Gras',      action: () => insert('**texte**') },
          { label: 'I',   title: 'Italique',  action: () => insert('*texte*') },
          { label: '{ }', title: 'Code',      action: () => insert('`code`') },
          { label: '```', title: 'Bloc code', action: () => insert('\n```\ncode\n```\n') },
          { label: '🔗',  title: 'Lien',      action: () => insert('[texte](url)') },
        ].map(({ label, title, action }) => (
          <button
            key={label} type="button" onClick={action} title={title}
            style={{
              padding: '2px 8px', fontSize: 12, fontWeight: 700,
              border: '1px solid #d6d9dc', borderRadius: 3,
              background: '#fff', cursor: 'pointer', color: '#525960',
            }}
          >{label}</button>
        ))}

        {/* Onglets Editer / Apercu */}
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 2 }}>
          {['Editer', 'Apercu'].map((label, i) => {
            const isActive = preview === (i === 1)
            return (
              <button
                key={label} type="button" onClick={() => setPreview(i === 1)}
                style={{
                  padding: '3px 10px', fontSize: 12, borderRadius: 3, cursor: 'pointer',
                  background: isActive ? '#f48024' : '#fff',
                  color: isActive ? '#fff' : '#525960',
                  border: '1px solid #d6d9dc', fontWeight: isActive ? 600 : 400,
                }}
              >{label}</button>
            )
          })}
        </div>
      </div>

      {/* Zone de texte ou apercu */}
      {preview ? (
        <div style={{
          minHeight: 150, padding: '12px 14px',
          background: '#fff', lineHeight: 1.75,
        }} className="md-body">
          {value
            ? <ReactMarkdown>{value}</ReactMarkdown>
            : <span style={{ color: '#838c95', fontSize: 13 }}>Rien a afficher.</span>
          }
        </div>
      ) : (
        <textarea
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          style={{
            width: '100%', minHeight: 150,
            padding: '10px 14px', border: 'none', outline: 'none',
            fontFamily: "'JetBrains Mono', monospace", fontSize: 13,
            lineHeight: 1.75, resize: 'vertical', background: '#fff',
            display: 'block',
          }}
        />
      )}
    </div>
  )
}