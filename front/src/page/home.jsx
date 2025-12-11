// front/src/page/home.jsx
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Home() {
  const navigate = useNavigate()

  useEffect(() => {
    const user = localStorage.getItem('user')
    const token = localStorage.getItem('token')

    // Pas connecté → login
    if (!user || !token) {
      navigate('/auth/login')
      return
    }

    try {
      const parsedUser = JSON.parse(user)

      // Super admin (toi et les formateurs)
      if (parsedUser.role === 'super_admin') {
        navigate('/dashboard/admin')
        return
      }

      // Restaurant
      if (parsedUser.organization_type === 'restaurant') {
        navigate('/dashboard/restaurant')
        return
      }

      // Association
      if (parsedUser.organization_type === 'association') {
        navigate('/dashboard/association')
        return
      }

      // Sécurité : rôle inconnu
      localStorage.clear()
      navigate('/auth/login')

    } catch  {
      localStorage.clear()
      navigate('/auth/login')
    }
  }, [navigate])

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mx-auto"></div>
        <p className="mt-8 text-xl font-medium text-gray-700">Connexion en cours...</p>
        <p className="mt-2 text-sm text-gray-500">Redirection vers votre espace</p>
      </div>
    </div>
  )
}