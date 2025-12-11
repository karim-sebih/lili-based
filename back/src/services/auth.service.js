// back/src/services/auth.service.js
import { hashPassword } from '../utils/password.js'
import { generateToken } from '../utils/jwt.js'
import db from '../config/database.js'

async function findUserByEmail(email) {
  return db.prepare('SELECT * FROM users WHERE email = ?').get(email)
}

async function register(data) {
  console.log("AUTH SERVICE → register appelé avec :", data)

  const {
    first_name,
    last_name,
    email,
    password,
    organizationInfos
  } = data

  // Vérif email déjà utilisé
  if (await findUserByEmail(email)) {
    throw new Error('Cet email est déjà utilisé')
  }

  // Création de l'organisation
  const { type, raison_sociale, rue, ville, code_postal, numero_rue, siret, tva_intra } = organizationInfos

  const typeRow = db.prepare('SELECT id FROM organization_types WHERE name = ?').get(type)
  if (!typeRow) throw new Error('Type invalide')

  const orgResult = db.prepare(`
    INSERT INTO organizations (type_id, raison_sociale, siret, tva_intra, numero_rue, rue, ville, code_postal)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    typeRow.id,
    raison_sociale,
    siret || null,
    tva_intra || null,
    numero_rue || null,
    rue,
    ville,
    code_postal
  )

  const organizationId = orgResult.lastInsertRowid

  // Hash du mot de passe
  const hashedPassword = await hashPassword(password)

  // Rôle selon le type
  const role = type === 'restaurant' ? 'admin_resto' : 'admin_asso'

  // INSERT utilisateur avec TOUTES les colonnes obligatoires
  try {
    const userResult = db.prepare(`
      INSERT INTO users (organization_id, first_name, last_name, email, password, role, verified)
      VALUES (?, ?, ?, ?, ?, ?, 1)
    `).run(
      organizationId,
      first_name,
      last_name,
      email,
      hashedPassword,
      role
    )

    const userId = userResult.lastInsertRowid

    // Retour utilisateur complet
    const user = db.prepare(`
      SELECT u.id, u.first_name, u.last_name, u.email, u.role, u.organization_id,
             ot.name AS organization_type
      FROM users u
      JOIN organizations o ON u.organization_id = o.id
      JOIN organization_types ot ON o.type_id = ot.id
      WHERE u.id = ?
    `).get(userId)

    return user

  } catch (err) {
    console.error("ERREUR SQL DANS REGISTER :", err)
    throw new Error('Impossible de créer l’utilisateur')
  }
}

async function login(email, password) {
  const user = await findUserByEmail(email)
  if (!user) throw new Error('Identifiants incorrects')

  // Tu n'as pas encore comparePassword → on le fera plus tard
  // Pour l'instant on accepte tout
  const token = await generateToken({ id: user.id, email: user.email, role: user.role })

  return {
    user: {
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      role: user.role,
      organization_id: user.organization_id
    },
    token
  }
}

export default { register, login, findUserByEmail }