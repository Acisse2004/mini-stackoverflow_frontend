import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import PageLayout from '../components/layout/PageLayout'
import Avatar from '../components/ui/Avatar'
import { usersApi } from '../api/usersApi'

export default function UserProfilePage() {
  const { id } = useParams()
  const [profile, setProfile] = useState(null)
  const [tab, setTab]         = useState('questions')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    usersApi.getProfile(id)
      .then(setProfile)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <PageLayout><div className="spinner" /></PageLayout>
  if (!profile) return (
    <PageLayout>
      <div className="empty-state">
        <h3>Utilisateur introuvable</h3>
        <p>Ce profil n'existe pas ou a été supprimé.</p>
        <Link to="/"><button className="btn btn-primary">Retour à l'accueil</button></Link>
      </div>
    </PageLayout>
  )

  return (
    <PageLayout>
      {/* En-tête du profil */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 20,
        padding: 20, background: '#fff',
        border: '1px solid #e3e6e8', borderRadius: 8, marginBottom: 20,
      }}>
        <Avatar name={profile.pseudo} size={68} src={profile.avatar} />
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 6 }}>{profile.pseudo}</h1>
          <div style={{ fontSize: 13, color: '#525960', display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <span>📅 Membre depuis {profile.memberSince}</span>
            {profile.location && <span>📍 {profile.location}</span>}
            <span>👁️ {profile.views || 0} vues de profil</span>
          </div>
        </div>
      </div>

      {/* Statistiques */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 12, marginBottom: 20,
      }}>
        {[
          { label: 'Questions posées', value: profile.stats?.questions || 0 },
          { label: 'Réponses données', value: profile.stats?.answers   || 0 },
          { label: 'Votes reçus',      value: `+${profile.stats?.votes || 0}` },
        ].map(s => (
          <div key={s.label} style={{
            background: '#fff', border: '1px solid #e3e6e8',
            borderRadius: 8, padding: '16px', textAlign: 'center',
          }}>
            <div style={{ fontSize: 28, fontWeight: 700, color: '#f48024' }}>{s.value}</div>
            <div style={{ fontSize: 12, color: '#525960', marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Onglets */}
      <div style={{ borderBottom: '1px solid #e3e6e8', marginBottom: 14, display: 'flex' }}>
        {[
          { key: 'questions', label: 'Questions' },
          { key: 'answers',   label: 'Réponses' },
        ].map(t => (
          <button key={t.key} onClick={() => setTab(t.key)} style={{
            background: 'none', border: 'none', padding: '9px 16px',
            fontSize: 13, cursor: 'pointer',
            color: tab === t.key ? '#232629' : '#525960',
            borderBottom: tab === t.key ? '2px solid #f48024' : '2px solid transparent',
            fontWeight: tab === t.key ? 600 : 400, marginBottom: '-1px',
          }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Liste questions */}
      {tab === 'questions' && (
        (profile.questions || []).length === 0
          ? <p style={{ color: '#838c95', fontSize: 13 }}>Aucune question posée pour l'instant.</p>
          : (profile.questions || []).map(q => (
            <div key={q.id} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '10px 0', borderBottom: '1px solid #e3e6e8',
            }}>
              <Link to={`/question/${q.id}`} style={{ color: '#0077cc', fontSize: 14 }}>{q.title}</Link>
              <span style={{ fontSize: 12, color: '#2d7d32', fontWeight: 600, whiteSpace: 'nowrap', marginLeft: 12 }}>
                ▲ {q.votes}
              </span>
            </div>
          ))
      )}

      {/* Liste réponses */}
      {tab === 'answers' && (
        (profile.answers || []).length === 0
          ? <p style={{ color: '#838c95', fontSize: 13 }}>Aucune réponse donnée pour l'instant.</p>
          : (profile.answers || []).map((a, i) => (
            <div key={i} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '10px 0', borderBottom: '1px solid #e3e6e8',
            }}>
              <Link to={`/question/${a.questionId}`} style={{ color: '#0077cc', fontSize: 14 }}>
                {a.questionTitle}
              </Link>
              {a.accepted && <span className="accepted-badge">✓ Acceptée</span>}
            </div>
          ))
      )}
    </PageLayout>
  )
}