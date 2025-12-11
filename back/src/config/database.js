// back/src/config/database.js
import Database from 'libsql'

const client = new Database('mydb.db')

// ON RECRÉE TOUT PROPREMENT
client.exec(`
  -- Types d'organisation
  CREATE TABLE IF NOT EXISTS organization_types (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE
  );

  -- Organisations (restaurant + association)
  CREATE TABLE IF NOT EXISTS organizations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type_id INTEGER REFERENCES organization_types(id),
    raison_sociale TEXT NOT NULL,
    siret TEXT,
    tva_intra TEXT,
    numero_rue TEXT,
    rue TEXT NOT NULL,
    ville TEXT NOT NULL,
    code_postal TEXT NOT NULL,
    takeaway_stock INTEGER DEFAULT 0,
    onsite_stock INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  );

  -- Utilisateurs
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    organization_id INTEGER REFERENCES organizations(id) ON DELETE CASCADE,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'user',
    verified INTEGER DEFAULT 1,
    created_at TEXT DEFAULT (datetime('now'))
  );

  -- Disponibilités
  CREATE TABLE IF NOT EXISTS availabilities (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    organization_id INTEGER REFERENCES organizations(id) ON DELETE CASCADE,
    date TEXT NOT NULL,
    hour TEXT NOT NULL,
    takeaway_count INTEGER DEFAULT 0,
    onsite_count INTEGER DEFAULT 0,
    UNIQUE(organization_id, date, hour)
  );

  -- Bénéficiaires
  CREATE TABLE IF NOT EXISTS beneficiaries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    birthdate TEXT,
    association_id INTEGER REFERENCES organizations(id),
    created_at TEXT DEFAULT (datetime('now'))
  );

  -- Réservations
  CREATE TABLE IF NOT EXISTS bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    availability_id INTEGER REFERENCES availabilities(id) ON DELETE CASCADE,
    association_id INTEGER REFERENCES organizations(id),
    beneficiary_id INTEGER REFERENCES beneficiaries(id),
    takeaway_count INTEGER DEFAULT 0,
    onsite_count INTEGER DEFAULT 0,
    status TEXT DEFAULT 'confirmed',
    created_at TEXT DEFAULT (datetime('now'))
  );
`)

// On insère les types de base
client.exec(`
  INSERT OR IGNORE INTO organization_types (name) VALUES ('restaurant');
  INSERT OR IGNORE INTO organization_types (name) VALUES ('association');
`)

console.log("Base de données recréée avec le BON schéma !")

const db = {
  prepare: (sql) => client.prepare(sql),
  close: () => client.close()
}

export default db