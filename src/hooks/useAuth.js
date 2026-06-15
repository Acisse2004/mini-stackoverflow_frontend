import { useContext } from 'react'
import AuthContext from '../assets/context/AuthContext'

export function useAuth() {
  return useContext(AuthContext)
}