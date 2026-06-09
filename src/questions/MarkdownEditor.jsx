import { useState } from 'react'
import ReactMarkdown from 'react-markdown'

export default function MarkdownEditor({ value, onChange, placeholder = 'Écrivez en Markdown...' }) {
  const [preview, setPreview] = useState(false)

  return (
    <div style={{ border: '1px solid #d6d9dc', borderRadius: 4, overflow: 'hidden' }}>
      {/* Toolbar */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 4,
        padding: '6px 10px', background: '#f6f6f6',
        borderBottom: '1px solid #d6d9dc',
      }}>
        {[
          { label: 'G',  action: () => onChange(`**${value}**`) },
          { label: 'I',  action: () => onChange(`*${value}*`) },
          { label: '{ }',action: () => onChange(`\`${value}\``) },
          { label: '🔗', action: () => onChange(`${value}\n[texte](url)`) },
        ].map(({ label, action }) => (
          <button key={label} type="button" onClick={action} style={{
            padding: '2px 8px', fontSize: 12, fontWeight: 600,
            border: '1px solid #d6d9dc', borderRadius: 3,
            background: '#fff', cursor: 'pointer', color: '#525960',
          }}>{label}</button>
        ))}
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 4 }}>
          <button type="button" onClick={() => setPreview(false)} style={{
            padding: '2px 10px', fontSize: 12, borderRadius: 3, cursor: 'pointer',
            background: !preview ? '#f48024' : '#fff',
            color: !preview ? '#fff' : '#525960',
            border: '1px solid #d6d9dc',
          }}>Éditer</button>
          <button type="button" onClick={() => setPreview(true)} style={{
            padding: '2px 10px', fontSize: 12, borderRadius: 3, cursor: 'pointer',
            background: preview ? '#f48024' : '#fff',
            color: preview ? '#fff' : '#525960',
            border: '1px solid #d6d9dc',
          }}>Aperçu</button>
        </div>
      </div>

      {/* Zone édition / aperçu */}
      {preview ? (
        <div style={{
          minHeight: 140, padding: '12px 14px',
          fontSize: 13, lineHeight: 1.7, background: '#fff',
        }}>
          {value ? <ReactMarkdown>{value}</ReactMarkdown>
                  : <span style={{ color: '#838c95' }}>Rien à afficher.</span>}
        </div>
      ) : (
        <textarea
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          style={{
            width: '100%', minHeight: 140,
            padding: '10px 14px', border: 'none', outline: 'none',
            fontFamily: "'JetBrains Mono', monospace", fontSize: 13,
            lineHeight: 1.7, resize: 'vertical', background: '#fff',
          }}
        />
      )}
    </div>
  )
}
