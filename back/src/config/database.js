// back/config/database.js
import Database from 'libsql'

const client = new Database('mydb.db')
// Crée les tables au démarrage (comme dans ton ancien database.js)
client.exec(`
   -- Utilisateurs (synchronisés ou créés manuellement)
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,           -- hashé
    role TEXT CHECK(role IN ('admin','resto','asso_gestionnaire','asso_agent')) NOT NULL,
    association_id INTEGER,           -- null si resto ou admin
    verified BOOLEAN DEFAULT 1,       -- on fait confiance à AssoConnect
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (association_id) REFERENCES associations(id)
  );

  -- Associations (synchronisées AssoConnect)
  CREATE TABLE IF NOT EXISTS associations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    address TEXT,
    postal_code TEXT,
    city TEXT,
    phone TEXT,
    email TEXT,
    assoconnect_id TEXT UNIQUE       -- pour synchro future
  );

  -- Restaurants
  CREATE TABLE IF NOT EXISTS restaurants (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER UNIQUE NOT NULL,
    name TEXT NOT NULL,
    address TEXT NOT NULL,
    postal_code TEXT NOT NULL,
    city TEXT NOT NULL,
    phone TEXT,
    description TEXT,
    cuisine_types TEXT,              -- JSON string: ["italienne", "française"]
    options TEXT,                    -- JSON: ["halal","vegan","sans_gluten"]
    meals_on_site INTEGER DEFAULT 0,
    meals_takeaway INTEGER DEFAULT 0,
    min_booking_delay_hours INTEGER DEFAULT 24,
    is_temporarily_closed BOOLEAN DEFAULT 0,
    menu_url TEXT,
    photo_url TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  -- Bénéficiaires (gérés par les assos)
  CREATE TABLE IF NOT EXISTS beneficiaries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    association_id INTEGER NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    birth_year INTEGER,
    rgpd_accepted BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(association_id, email),   -- un bénéficiaire = unique par asso
    FOREIGN KEY (association_id) REFERENCES associations(id)
  );

  -- Réservations
  CREATE TABLE IF NOT EXISTS bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    restaurant_id INTEGER NOT NULL,
    association_id INTEGER NOT NULL,
    beneficiary_id INTEGER NOT NULL,
    agent_id INTEGER NOT NULL,                    -- qui a réservé
    booking_date DATE NOT NULL,
    booking_time TIME NOT NULL,
    covers INTEGER NOT NULL,                      -- nb de couverts
    type TEXT CHECK(type IN ('on_site','takeaway')) NOT NULL,
    status TEXT CHECK(status IN ('pending','confirmed','refused','cancelled')) DEFAULT 'pending',
    comment TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (restaurant_id) REFERENCES restaurants(id),
    FOREIGN KEY (association_id) REFERENCES associations(id),
    FOREIGN KEY (beneficiary_id) REFERENCES beneficiaries(id),
    FOREIGN KEY (agent_id) REFERENCES users(id)
  );

  -- Options globales (halal, vegan…) gérées par admin
  CREATE TABLE IF NOT EXISTS global_options (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    label TEXT UNIQUE NOT NULL
  );

  -- Types de cuisine globaux
  CREATE TABLE IF NOT EXISTS cuisine_types (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    label TEXT UNIQUE NOT NULL
  );
`)

console.log("Base de données initialisée avec succès (config/database.js)")

// LA CLÉ : on exporte un objet avec .execute() qui marche toujours
const db = {
  execute: (query) => {
    if (typeof query === 'string') {
      return client.exec(query)
    }
    // pour les queries préparées
    const stmt = client.prepare(query.sql)
    if (query.args) {
      return stmt.run(...query.args)
    }
    return stmt.run()
  },
  prepare: (sql) => client.prepare(sql),
  close: () => client.close()
}

export default db

 