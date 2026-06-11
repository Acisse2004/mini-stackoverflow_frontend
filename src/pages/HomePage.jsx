import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import PageLayout from '../components/layout/PageLayout'
import QuestionCard from '../components/questions/QuestionCard'
import { questionsApi } from '../api/questionsApi'

const SORTS = [
  { key: 'recent',     label: 'Récentes' },
  { key: 'votes',      label: 'Votes' },
  { key: 'unanswered', label: 'Sans réponse' },
]

export default function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(true)

  const sort   = searchParams.get('sort')   || 'recent'
  const tag    = searchParams.get('tag')    || ''
  const search = searchParams.get('search') || ''

  useEffect(() => {
    setLoading(true)
    questionsApi.getAll({ sort, tag, search })
      .then(setQuestions)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [sort, tag, search])

  const setParam = (key, value) => {
    const p = new URLSearchParams(searchParams)
    if (value) p.set(key, value)
    else p.delete(key)
    setSearchParams(p)
  }

  return (
    <PageLayout
      onSearch={q => setParam('search', q)}
      onTagClick={t => setParam('tag', t)}
    >
      {/* En-tête */}
      <div style={{
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', marginBottom: 16,
      }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 700 }}>
            {tag    ? `Questions : ${tag}` :
             search ? `Résultats : "${search}"` :
             'Toutes les questions'}
          </h1>
          {(tag || search) && (
            <button onClick={() => setSearchParams({})}
              style={{ fontSize: 12, color: '#525960', background: 'none', border: 'none', cursor: 'pointer', marginTop: 4 }}>
              × Effacer le filtre
            </button>
          )}
        </div>
        <Link to="/ask">
          <button className="btn btn-primary">Poser une question</button>
        </Link>
      </div>

      {/* Filtres de tri */}
      <div style={{
        display: 'flex', gap: 4, marginBottom: 14,
        background: '#fff', border: '1px solid #d6d9dc',
        borderRadius: 4, padding: 4, width: 'fit-content',
      }}>
        {SORTS.map(s => (
          <button key={s.key} onClick={() => setParam('sort', s.key)} style={{
            padding: '5px 12px', fontSize: 13, borderRadius: 3,
            border: 'none', cursor: 'pointer',
            background: sort === s.key ? '#f48024' : 'transparent',
            color: sort === s.key ? '#fff' : '#525960',
            fontWeight: sort === s.key ? 600 : 400,
          }}>
            {s.label}
          </button>
        ))}
      </div>

      {/* Liste */}
      {loading ? (
        <div className="spinner" />
      ) : questions.length === 0 ? (
        <div className="empty-state">
          <h3>Aucune question trouvée</h3>
          <p>Soyez le premier à poser une question !</p>
          <Link to="/ask">
            <button className="btn btn-primary" style={{ marginTop: 14 }}>Poser une question</button>
          </Link>
        </div>
      ) : (
        questions.map(q => (
          <QuestionCard key={q.id} question={q}
            onTagClick={t => setParam('tag', t)} />
        ))
      )}
    </PageLayout>
  )
}
