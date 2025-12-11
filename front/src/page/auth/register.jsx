'use client'

import { useState } from 'react'
import axios from 'axios'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function Register() {
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    confirmPassword: '',
    type: 'restaurant', // par défaut
    raison_sociale: '',
    rue: '',
    numero_rue: '',
    code_postal: '',
    ville: '',
    siret: '',
    tva_intra: ''
  })

  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    if (form.password !== form.confirmPassword) return setError('Les mots de passe ne correspondent pas')

    setLoading(true)

    try {
      await axios.post('/api/auth/register', {
        first_name: form.first_name,
        last_name: form.last_name,
        email: form.email,
        password: form.password,
        organizationInfos: {
          type: form.type,
          raison_sociale: form.raison_sociale,
          rue: form.rue,
          numero_rue: form.numero_rue || null,
          code_postal: form.code_postal,
          ville: form.ville,
          siret: form.siret || null,
          tva_intra: form.tva_intra || null,
        }
      })

      setSuccess('Inscription réussie ! Vous pouvez maintenant vous connecter.')
      setTimeout(() => { window.location.href = '/login' }, 2000)
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de l’inscription')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-2xl">Créer un compte</CardTitle>
          <CardDescription>Restaurant ou association caritative</CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">

            {/* Type d'organisation */}
            <div>
              <Label>Je suis</Label>
              <RadioGroup value={form.type} onValueChange={(v) => setForm({ ...form, type: v })} className="flex gap-8 mt-3">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="restaurant" id="resto" />
                  <Label htmlFor="resto" className="cursor-pointer">Un restaurant</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="association" id="asso" />
                  <Label htmlFor="asso" className="cursor-pointer">Une association</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Infos personnelles */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Prénom</Label>
                <Input name="first_name" value={form.first_name} onChange={handleChange} required disabled={loading} />
              </div>
              <div className="space-y-2">
                <Label>Nom</Label>
                <Input name="last_name" value={form.last_name} onChange={handleChange} required disabled={loading} />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Email</Label>
              <Input type="email" name="email" value={form.email} onChange={handleChange} required disabled={loading} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Mot de passe</Label>
                <Input type="password" name="password" value={form.password} onChange={handleChange} required disabled={loading} />
              </div>
              <div className="space-y-2">
                <Label>Confirmer</Label>
                <Input type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} required disabled={loading} />
              </div>
            </div>

            {/* Infos organisation */}
            <div className="space-y-4 border-t pt-4">
              <h3 className="font-semibold text-lg">{form.type === 'restaurant' ? 'Votre restaurant' : 'Votre association'}</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Raison sociale / Nom</Label>
                  <Input name="raison_sociale" value={form.raison_sociale} onChange={handleChange} required disabled={loading} />
                </div>
                <div className="space-y-2">
                  <Label>SIRET (facultatif)</Label>
                  <Input name="siret" value={form.siret} onChange={handleChange} disabled={loading} />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>N°</Label>
                  <Input name="numero_rue" value={form.numero_rue} onChange={handleChange} disabled={loading} />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label>Rue</Label>
                  <Input name="rue" value={form.rue} onChange={handleChange} required disabled={loading} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Code postal</Label>
                  <Input name="code_postal" value={form.code_postal} onChange={handleChange} required disabled={loading} />
                </div>
                <div className="space-y-2">
                  <Label>Ville</Label>
                  <Input name="ville" value={form.ville} onChange={handleChange} required disabled={loading} />
                </div>
              </div>
            </div>

            {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}
            {success && <Alert className="border-green-600 text-green-800"><AlertDescription>{success}</AlertDescription></Alert>}
          </CardContent>

          <CardFooter>
            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              {loading ? 'Création en cours...' : 'Créer mon compte'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}