import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import PageLayout from '../components/layout/PageLayout'
import Avatar from '../components/ui/Avatar'
import { usersApi } from '../api/usersApi'

export default function UserProfilePage() {
  const { id } = useParams()
  const [profile, setProfile] = useState(null)
  const [tab, setTab] = useState('questions')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    usersApi.getProfile(id)
      .then(setProfile)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <PageLayout><div className="spinner" /></PageLayout>
  if (!profile) return <PageLayout><div className="empty-state"><h3>Utilisateur introuvable</h3></div></PageLayout>

  return (
    <PageLayout>
      {/* En-tête profil */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 20,
        padding: '20px', background: '#fff',
        border: '1px solid #e3e6e8', borderRadius: 8,
        marginBottom: 20,
      }}>
        <Avatar name={profile.pseudo} size={64} src={profile.avatar} />
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>{profile.pseudo}</h1>
          <div style={{ fontSize: 13, color: '#525960', display: 'flex', gap: 16 }}>
            <span>📅 Membre depuis {profile.memberSince}</span>
            {profile.location && <span>📍 {profile.location}</span>}
          </div>
        </div>
      </div>

      {/* Statistiques */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 12, marginBottom: 20,
      }}>
        {[
          { label: 'Questions posées', value: profile.stats.questions },
          { label: 'Réponses données', value: profile.stats.answers },
          { label: 'Votes reçus',      value: `+${profile.stats.votes}` },
        ].map(s => (
          <div key={s.label} style={{
            background: '#fff', border: '1px solid #e3e6e8',
            borderRadius: 8, padding: '16px', textAlign: 'center',
          }}>
            <div style={{ fontSize: 26, fontWeight: 700, color: '#f48024' }}>{s.value}</div>
            <div style={{ fontSize: 12, color: '#525960', marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Onglets */}
      <div style={{ borderBottom: '1px solid #e3e6e8', marginBottom: 14 }}>
        {['questions', 'answers'].map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            background: 'none', border: 'none',
            padding: '8px 16px', fontSize: 13,
            color: tab === t ? '#232629' : '#525960',
            borderBottom: tab === t ? '2px solid #f48024' : '2px solid transparent',
            fontWeight: tab === t ? 600 : 400,
            cursor: 'pointer', marginBottom: '-1px',
          }}>
            {t === 'questions' ? 'Questions' : 'Réponses'}
          </button>
        ))}
      </div>

      {/* Liste */}
      {tab === 'questions' && profile.questions.map(q => (
        <div key={q.id} style={{
          display: 'flex', justifyContent: 'space-between',
          padding: '10px 0', borderBottom: '1px solid #e3e6e8',
          alignItems: 'center',
        }}>
          <Link to={`/question/${q.id}`} style={{ color: '#0077cc', fontSize: 14 }}>
            {q.title}
          </Link>
          <span style={{ fontSize: 12, color: '#2d7d32', fontWeight: 600, whiteSpace: 'nowrap' }}>
            ▲ {q.votes}
          </span>
        </div>
      ))}

      {tab === 'answers' && profile.answers.map((a, i) => (
        <div key={i} style={{
          display: 'flex', justifyContent: 'space-between',
          padding: '10px 0', borderBottom: '1px solid #e3e6e8',
          alignItems: 'center',
        }}>
          <Link to={`/question/${a.questionId}`} style={{ color: '#0077cc', fontSize: 14 }}>
            {a.questionTitle}
          </Link>
          {a.accepted && (
            <span className="accepted-badge">✓ Acceptée</span>
          )}
        </div>
      ))}
    </PageLayout>
  )
}
