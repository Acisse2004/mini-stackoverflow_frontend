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
      .then(data => {
        // Normaliser les données du backend
        setProfile({
          ...data,
          pseudo: data.username || data.pseudo || '?',
          memberSince: data.date_joined
            ? new Date(data.date_joined).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })
            : 'inconnu',
          location: data.location || 'Dakar, Senegal',
          views: data.views || 0,
          stats: {
            questions: data.question_count || data.stats?.questions || 0,
            answers:   data.answer_count   || data.stats?.answers   || 0,
            votes:     data.vote_count     || data.stats?.votes     || 0,
          },
          questions: data.questions || [],
          answers:   data.answers   || [],
        })
      })
      .catch(err => {
        console.error(err)
        setProfile(null)
      })
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <PageLayout><div className="spinner" /></PageLayout>

  if (!profile) return (
    <PageLayout>
      <div className="empty-state">
        <h3>Utilisateur introuvable</h3>
        <p>Ce profil n'existe pas ou a ete supprime.</p>
        <Link to="/"><button className="btn btn-primary">Retour a l'accueil</button></Link>
      </div>
    </PageLayout>
  )

  return (
    <PageLayout>

      {/* En-tete du profil */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 20,
        padding: 20, background: '#fff',
        border: '1px solid #e4ebf3', borderRadius: 8, marginBottom: 20,
      }}>
        <Avatar name={profile.pseudo} size={68} src={profile.avatar} />
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 6 }}>
            {profile.pseudo}
          </h1>
          <div style={{ fontSize: 13, color: '#4b5d70', display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <span>📅 Membre depuis {profile.memberSince}</span>
            {profile.location && <span>📍 {profile.location}</span>}
            <span>👁️ {profile.views} vues de profil</span>
          </div>
        </div>
      </div>

      {/* Statistiques */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 12, marginBottom: 20,
      }}>
        {[
          { label: 'Questions posees', value: profile.stats.questions },
          { label: 'Reponses donnees', value: profile.stats.answers },
          { label: 'Votes recus',      value: `+${profile.stats.votes}` },
        ].map(s => (
          <div key={s.label} style={{
            background: '#fff', border: '1px solid #e4ebf3',
            borderRadius: 8, padding: '16px', textAlign: 'center',
          }}>
            <div style={{ fontSize: 28, fontWeight: 700, color: '#2563eb' }}>{s.value}</div>
            <div style={{ fontSize: 12, color: '#4b5d70', marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Onglets */}
      <div style={{ borderBottom: '1px solid #e4ebf3', marginBottom: 14, display: 'flex' }}>
        {[
          { key: 'questions', label: 'Questions' },
          { key: 'answers',   label: 'Reponses' },
        ].map(t => (
          <button key={t.key} onClick={() => setTab(t.key)} style={{
            background: 'none', border: 'none', padding: '9px 16px',
            fontSize: 13, cursor: 'pointer',
            color: tab === t.key ? '#1c2b3a' : '#4b5d70',
            borderBottom: tab === t.key ? '2px solid #2563eb' : '2px solid transparent',
            fontWeight: tab === t.key ? 600 : 400, marginBottom: '-1px',
          }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Liste questions */}
      {tab === 'questions' && (
        profile.questions.length === 0
          ? <p style={{ color: '#82929f', fontSize: 13 }}>Aucune question posee pour l'instant.</p>
          : profile.questions.map(q => (
            <div key={q.id} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '10px 0', borderBottom: '1px solid #e4ebf3',
            }}>
              <Link to={`/question/${q.id}`} style={{ color: '#0369a1', fontSize: 14 }}>
                {q.title}
              </Link>
              <span style={{ fontSize: 12, color: '#1f8a4c', fontWeight: 600, whiteSpace: 'nowrap', marginLeft: 12 }}>
                ▲ {q.vote_count || q.votes || 0}
              </span>
            </div>
          ))
      )}

      {/* Liste reponses */}
      {tab === 'answers' && (
        profile.answers.length === 0
          ? <p style={{ color: '#82929f', fontSize: 13 }}>Aucune reponse donnee pour l'instant.</p>
          : profile.answers.map((a, i) => (
            <div key={i} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '10px 0', borderBottom: '1px solid #e4ebf3',
            }}>
              <Link to={`/question/${a.question || a.questionId}`} style={{ color: '#0369a1', fontSize: 14 }}>
                {a.question_title || a.questionTitle || 'Question'}
              </Link>
              {(a.is_best || a.accepted) && (
                <span className="accepted-badge">✓ Acceptee</span>
              )}
            </div>
          ))
      )}

    </PageLayout>
  )
}