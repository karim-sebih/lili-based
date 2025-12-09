import { getUsers } from '@/api/auth'
import { useQuery } from '@tanstack/react-query'



export default function Home() {
  const { data: users, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: getUsers
  })

  if (isLoading) return <div>Chargement...</div>

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-8">Utilisateurs inscrits ({users?.data?.length || 0})</h1>
      
      <div className="grid gap-4">
        {users?.data?.map(user => (
          <div key={user.id} className="p-6 bg-white rounded-lg shadow">
            <p><strong>{user.first_name} {user.last_name}</strong></p>
            <p className="text-gray-600">{user.email}</p>
            <p className="text-sm text-gray-500">Rôle: {user.role} • Inscrit le {new Date(user.created_at).toLocaleDateString('fr-FR')}</p>
          </div>
        ))}
      </div>
    </div>
  )
}