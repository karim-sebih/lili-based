'use client'

import { useState } from 'react'
import axios from 'axios'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function Register() {
  const [firstname, setFirstName] = useState('')
  const [lastname, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas')
      return
    }

    setLoading(true)

    try {
      const response = await axios.post('/api/auth/register', {
        firstname,
        lastname,
        email,
        password
      })

      // Si tout est OK
      setSuccess('Inscription réussie ! Vous pouvez maintenant vous connecter.')
      setFirstName('')
      setLastName('')
      setEmail('')
      setPassword('')
      setConfirmPassword('')

    } catch (err) {
      // Gestion des erreurs renvoyées par le backend
      const message = err.response?.data?.message || err.message || 'Erreur serveur'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Inscription</CardTitle>
          <CardDescription>Créez votre compte restaurant ou association</CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label>Prénom</label>
              <Input
                type="text"
                placeholder="Karim"
                value={firstname}
                onChange={(e) => setFirstName(e.target.value)}
                required
                disabled={loading}
              />
            </div>
<div className="space-y-2">
  <label>Nom de famille</label>
  <Input
    type="text"
    placeholder="Sebih"
    value={lastname}
    onChange={(e) => setLastName(e.target.value)}
    required
    disabled={loading}
  />
</div>

            <div className="space-y-2">
              <label>Email</label>
              <Input
                type="email"
                placeholder="karim.sebih@laplateforme.io"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <label>Mot de passe</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <label>Confirmer le mot de passe</label>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            {error && <p className="text-red-600 text-sm font-medium">{error}</p>}
            {success && <p className="text-green-600 text-sm font-medium">{success}</p>}
          </CardContent>

          <CardFooter>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Inscription en cours…' : 'S’inscrire'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}