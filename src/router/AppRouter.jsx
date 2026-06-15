import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import HomePage from '../pages/HomePage'
import LoginPage from '../pages/LoginPage'
import RegisterPage from '../pages/RegisterPage'
import UserProfilePage from '../pages/UserProfilePage'
import QuestionDetailPage from '../pages/QuestionDetailPage'
import AskQuestionPage from '../pages/AskQuestionPage'

function PrivateRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="spinner" />
  return user ? children : <Navigate to="/login" replace />
}

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/"             element={<HomePage />} />
      <Route path="/login"        element={<LoginPage />} />
      <Route path="/register"     element={<RegisterPage />} />
      <Route path="/question/:id" element={<QuestionDetailPage />} />
      <Route path="/user/:id"     element={<UserProfilePage />} />
      <Route path="/ask" element={
        <PrivateRoute><AskQuestionPage /></PrivateRoute>
      } />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}