const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const orgRoutes = require('./routes/orgRoutes');
const adminRoutes = require('./routes/adminRoutes');
const customerRoutes = require('./routes/customerRoutes');

const pool = require('./db');
const bcrypt = require('bcrypt');

const app = express();
app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

// Seed initial superadmin and organisation
async function seedSuperAdmin() {
  const orgRes = await pool.query("SELECT id FROM orgs WHERE id=1");
  if (!orgRes.rows.length) {
    await pool.query("INSERT INTO orgs(name, created_at, updated_at) VALUES ('Superorg', NOW(), NOW())");
  }

  const email = 'superadmin@example.com';
  const password = 'password123';
  const hash = await bcrypt.hash(password, 10);
  const exists = await pool.query('SELECT id FROM admins WHERE email=$1', [email]);
  if (!exists.rows.length) {
    await pool.query(
      "INSERT INTO admins(name,email,password_hash,org_id,role) VALUES('Super Admin',$1,$2,1,'superadmin')",
      [email, hash]
    );
    console.log('Superadmin seeded!');
  }
}
seedSuperAdmin();

// Use imported routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/orgs', orgRoutes);
app.use('/api/v1/orgs', adminRoutes); // Admin routes are scoped under orgs/:orgId/admins
app.use('/api/v1/orgs', customerRoutes); // Customer routes scoped under orgs/:orgId/customers

app.listen(5000, () => console.log('Backend running on port 5000'));
