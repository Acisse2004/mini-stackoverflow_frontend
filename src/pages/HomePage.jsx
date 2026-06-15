import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import PageLayout from '../components/layout/PageLayout'
import QuestionCard from '../components/questions/QuestionCard'
import { questionsApi } from '../api/questionsApi'

const SORTS = [
  { key: 'recent',     label: 'Récentes'    },
  { key: 'votes',      label: 'Plus votées' },
  { key: 'unanswered', label: 'Sans réponse' },
]

export default function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [questions, setQuestions] = useState([])
  const [total, setTotal]         = useState(0)
  const [loading, setLoading]     = useState(true)

  const sort   = searchParams.get('sort')   || 'recent'
  const tag    = searchParams.get('tag')    || ''
  const search = searchParams.get('search') || ''

  useEffect(() => {
    setLoading(true)
    questionsApi.getAll({ sort, tag, search })
      .then(data => {
        // Le backend peut retourner { questions, total } ou directement un tableau
        if (Array.isArray(data)) {
          setQuestions(data)
          setTotal(data.length)
        } else {
          setQuestions(data.questions || [])
          setTotal(data.total || 0)
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [sort, tag, search])

  const setParam = (key, value) => {
    const p = new URLSearchParams(searchParams)
    if (value) p.set(key, value)
    else p.delete(key)
    setSearchParams(p)
  }

  const clearFilters = () => setSearchParams({})

  // Titre dynamique selon les filtres actifs
  const pageTitle = tag    ? `Questions : #${tag}`
                  : search ? `Résultats pour "${search}"`
                  : 'Toutes les questions'

  return (
    <PageLayout>
      {/* En-tête */}
      <div className="page-header">
        <div>
          <h1 className="page-title">{pageTitle}</h1>
          {(tag || search) && (
            <button
              onClick={clearFilters}
              style={{
                fontSize: 12, color: '#525960', background: 'none',
                border: 'none', cursor: 'pointer', marginTop: 4, padding: 0,
              }}
            >
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
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', marginBottom: 16,
      }}>
        <div style={{
          display: 'flex', gap: 0,
          background: '#fff', border: '1px solid #d6d9dc',
          borderRadius: 4, overflow: 'hidden',
        }}>
          {SORTS.map(s => (
            <button
              key={s.key}
              onClick={() => setParam('sort', s.key)}
              style={{
                padding: '6px 14px', fontSize: 13, border: 'none',
                cursor: 'pointer', borderRight: '1px solid #d6d9dc',
                background: sort === s.key ? '#f48024' : '#fff',
                color: sort === s.key ? '#fff' : '#525960',
                fontWeight: sort === s.key ? 600 : 400,
                transition: 'all 0.15s',
              }}
            >
              {s.label}
            </button>
          ))}
        </div>
        {!loading && (
          <span style={{ fontSize: 13, color: '#838c95' }}>
            {total} question{total !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      {/* Liste de questions */}
      {loading ? (
        <div className="spinner" />
      ) : questions.length === 0 ? (
        <div className="empty-state">
          <h3>Aucune question trouvée</h3>
          <p>
            {search || tag
              ? 'Essayez avec d\'autres mots-clés ou supprimez les filtres.'
              : 'Soyez le premier à poser une question !'}
          </p>
          <Link to="/ask">
            <button className="btn btn-primary">Poser une question</button>
          </Link>
        </div>
      ) : (
        questions.map(q => (
          <QuestionCard key={q.id} question={q} />
        ))
      )}
    </PageLayout>
  )
}