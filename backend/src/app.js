// const express = require('express');
// const jwt = require('jsonwebtoken');
// const bcrypt = require('bcrypt');
// const cors = require('cors');
// const pool = require('./db');
// require('dotenv').config();

// const app = express();
// app.use(express.json());

// // CORS config, allows frontend localhost
// app.use(
//   cors({
//     origin: "http://localhost:3000",
//   })
// );

// // Auth Middleware: verifies JWT and sets req.user
// function auth(req, res, next) {
//   const token = req.headers.authorization?.split(' ')[1];
//   if (!token) return res.status(401).json({ error: 'Unauthorized' });
//   try {
//     req.user = jwt.verify(token, process.env.JWT_SECRET);
//     next();
//   } catch {
//     return res.status(401).json({ error: 'Unauthorized' });
//   }
// }

// // Superadmin only middleware
// function superAdminOnly(req, res, next) {
//   if (req.user.role !== 'superadmin') return res.status(403).json({ error: 'Forbidden' });
//   next();
// }

// // Seed initial superadmin and organization
// async function seedSuperAdmin() {
//   // Seed org if not exists
//   const orgRes = await pool.query("SELECT id FROM orgs WHERE id=1");
//   if (!orgRes.rows.length) {
//     await pool.query("INSERT INTO orgs(name, created_at, updated_at) VALUES ('Superorg', NOW(), NOW())");
//   }

//   // Seed superadmin
//   const email = 'superadmin@example.com';
//   const password = 'password123';
//   const hash = await bcrypt.hash(password, 10);
//   const exists = await pool.query('SELECT id FROM admins WHERE email=$1', [email]);
//   if (!exists.rows.length) {
//     await pool.query(
//       "INSERT INTO admins(name,email,password_hash,org_id,role) VALUES('Super Admin',$1,$2,1,'superadmin')",
//       [email, hash]
//     );
//     console.log('Superadmin seeded!');
//   }
// }
// seedSuperAdmin();

// // ===== AUTH ROUTE =====
// app.post('/api/v1/auth/login', async (req, res) => {
//   const { email, password } = req.body;
//   const { rows } = await pool.query('SELECT * FROM admins WHERE email=$1', [email]);
//   if (!rows.length) return res.status(404).json({ error: 'User not found' });
//   const user = rows[0];
//   const validPass = await bcrypt.compare(password, user.password_hash);
//   if (!validPass) return res.status(401).json({ error: 'Invalid password' });

//   const token = jwt.sign({
//     id: user.id, org_id: user.org_id, role: user.role
//   }, process.env.JWT_SECRET, { expiresIn: '30m' });

//   res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role, org_id: user.org_id } });
// });

// // ===== ORGS CRUD (superadmin only) =====
// app.post('/api/v1/orgs', auth, superAdminOnly, async (req, res) => {
//   const { name } = req.body;
//   if (!name) return res.status(400).json({ error: "Organisation name required" });
//   const result = await pool.query(
//     'INSERT INTO orgs(name, created_at, updated_at) VALUES($1, NOW(), NOW()) RETURNING *',
//     [name]
//   );
//   res.status(201).json(result.rows[0]);
// });

// app.get('/api/v1/orgs', auth, superAdminOnly, async (req, res) => {
//   const result = await pool.query('SELECT * FROM orgs ORDER BY id');
//   res.json(result.rows);
// });

// app.get('/api/v1/orgs/:orgId', auth, superAdminOnly, async (req, res) => {
//   const result = await pool.query('SELECT * FROM orgs WHERE id=$1', [req.params.orgId]);
//   if (!result.rows.length) return res.status(404).json({ error: 'Organisation not found' });
//   res.json(result.rows[0]);
// });

// app.patch('/api/v1/orgs/:orgId', auth, superAdminOnly, async (req, res) => {
//   const { name } = req.body;
//   if (!name) return res.status(400).json({ error: "Organisation name required" });
//   const result = await pool.query(
//     'UPDATE orgs SET name=$1, updated_at=NOW() WHERE id=$2 RETURNING *',
//     [name, req.params.orgId]
//   );
//   if (!result.rows.length) return res.status(404).json({ error: 'Organisation not found' });
//   res.json(result.rows[0]);
// });

// app.delete('/api/v1/orgs/:orgId', auth, superAdminOnly, async (req, res) => {
//   const result = await pool.query('DELETE FROM orgs WHERE id=$1 RETURNING *', [req.params.orgId]);
//   if (!result.rows.length) return res.status(404).json({ error: 'Organisation not found' });
//   res.status(204).send();
// });

// // ===== ADMIN USERS CRUD =====
// // Middleware to check if user is superadmin or org admin of same org
// function adminOrSuperAdmin(req, res, next) {
//   if (req.user.role === 'superadmin' || (req.user.role === 'admin' && req.user.org_id === Number(req.params.orgId))) {
//     return next();
//   }
//   return res.status(403).json({ error: 'Forbidden' });
// }

// // List admins for org
// app.get('/api/v1/orgs/:orgId/admins', auth, adminOrSuperAdmin, async (req, res) => {
//   const result = await pool.query('SELECT id, name, email, role, org_id FROM admins WHERE org_id=$1 ORDER BY id', [req.params.orgId]);
//   res.json(result.rows);
// });

// // Add admin user
// app.post('/api/v1/orgs/:orgId/admins', auth, adminOrSuperAdmin, async (req, res) => {
//   const { name, email, password, role } = req.body;
//   let orgId  = req.params.orgId;
//   console.log("org id from backend:", orgId)
//   orgId = parseInt(orgId, 10);
//   if (!orgId || isNaN(orgId)) {
//     return res.status(400).json({ error: "Invalid orgId parameter" });
//   }

//   if (!name || !email || !password || !role) {
//     return res.status(400).json({ error: 'All fields are required' });
//   }

//   if (!['admin', 'superadmin'].includes(role)) {
//     return res.status(400).json({ error: 'Role must be admin or superadmin' });
//   }

//   const password_hash = await bcrypt.hash(password, 10);

//   try {
//     const result = await pool.query(
//       'INSERT INTO admins(name,email,password_hash,org_id,role) VALUES($1,$2,$3,$4,$5) RETURNING id, name, email, role, org_id',
//       [name, email, password_hash, orgId, role]
//     );
//     res.status(201).json(result.rows[0]);
//   } catch (err) {
//     if (err.code === '23505') { // Unique violation on email
//       res.status(409).json({ error: 'Email already in use' });
//     } else {
//       throw err;
//     }
//   }
// });

// // Update an admin user
// app.patch('/api/v1/orgs/:orgId/admins/:adminId', auth, adminOrSuperAdmin, async (req, res) => {
//   const allowedFields = ['name', 'email', 'password', 'role'];
//   const fields = [];
//   const values = [];
//   let idx = 1;
  
//   for (const key of allowedFields) {
//     if (req.body[key] !== undefined) {
//       if (key === 'password') {
//         const hash = await bcrypt.hash(req.body[key], 10);
//         fields.push(`password_hash = $${idx}`);
//         values.push(hash);
//       } else {
//         fields.push(`${key} = $${idx}`);
//         values.push(req.body[key]);
//       }
//       idx++;
//     }
//   }
  
//   if (fields.length === 0) return res.status(400).json({ error: 'No valid fields to update' });
//   values.push(req.params.adminId, req.params.orgId);

//   const sql = `UPDATE admins SET ${fields.join(', ')} WHERE id=$${idx} AND org_id=$${idx+1} RETURNING id, name, email, role, org_id`;
//   const result = await pool.query(sql, values);
//   if (!result.rows.length) return res.status(404).json({ error: 'Admin not found' });

//   res.json(result.rows[0]);
// });

// // Delete an admin user
// app.delete('/api/v1/orgs/:orgId/admins/:adminId', auth, adminOrSuperAdmin, async (req, res) => {
//   const result = await pool.query(
//     'DELETE FROM admins WHERE id=$1 AND org_id=$2 RETURNING *',
//     [req.params.adminId, req.params.orgId]
//   );
//   if (!result.rows.length) return res.status(404).json({ error: 'Admin not found' });
//   res.status(204).send();
// });

// // ===== CUSTOMER CRUD (unchanged) =====
// app.post('/api/v1/orgs/:orgId/customers', auth, async (req, res) => {
//   if (req.user.org_id != Number(req.params.orgId) && req.user.role !== 'superadmin')
//     return res.status(403).json({ error: 'Forbidden' });
//   const { uid, device_id, name, email } = req.body;
//   const result = await pool.query(
//     'INSERT INTO customers(uid, device_id, org_id, name, email) VALUES($1,$2,$3,$4,$5) RETURNING *',
//     [uid, device_id, req.params.orgId, name, email]
//   );
//   console.log(`[EMAIL] New customer "${name}" registered at ${email}`);
//   res.status(201).json(result.rows[0]);
// });

// app.get('/api/v1/orgs/:orgId/customers', auth, async (req, res) => {
//   if (req.user.org_id != Number(req.params.orgId) && req.user.role !== 'superadmin')
//     return res.status(403).json({ error: 'Forbidden' });

//   const { page = 1, per_page = 20 } = req.query;
//   const offset = (page - 1) * per_page;
//   const result = await pool.query(
//     'SELECT * FROM customers WHERE org_id=$1 ORDER BY id LIMIT $2 OFFSET $3',
//     [req.params.orgId, per_page, offset]
//   );
//   const countRes = await pool.query('SELECT COUNT(*) FROM customers WHERE org_id=$1', [req.params.orgId]);
//   res.json({
//     data: result.rows,
//     page: Number(page),
//     per_page: Number(per_page),
//     total: Number(countRes.rows[0].count),
//   });
// });

// app.get('/api/v1/orgs/:orgId/customers/:id', auth, async (req, res) => {
//   if (req.user.org_id != Number(req.params.orgId) && req.user.role !== 'superadmin')
//     return res.status(403).json({ error: 'Forbidden' });

//   const result = await pool.query(
//     'SELECT * FROM customers WHERE id=$1 AND org_id=$2',
//     [req.params.id, req.params.orgId]
//   );
//   if (!result.rows.length) return res.status(404).json({ error: 'Customer not found' });
//   res.json(result.rows[0]);
// });

// app.patch('/api/v1/orgs/:orgId/customers/:id', auth, async (req, res) => {
//   if (req.user.org_id != Number(req.params.orgId) && req.user.role !== 'superadmin')
//     return res.status(403).json({ error: 'Forbidden' });

//   const allowedFields = ['uid', 'device_id', 'name', 'email'];
//   const fields = [];
//   const values = [];
//   let idx = 1;
//   for (const key of allowedFields) {
//     if (req.body[key] !== undefined) {
//       fields.push(`${key} = $${idx}`);
//       values.push(req.body[key]);
//       idx++;
//     }
//   }
//   if (fields.length === 0) return res.status(400).json({ error: 'No valid fields to update' });
//   values.push(req.params.id, req.params.orgId);

//   const sql = `UPDATE customers SET ${fields.join(', ')}, updated_at=NOW() WHERE id=$${idx} AND org_id=$${idx+1} RETURNING *`;
//   const result = await pool.query(sql, values);
//   if (!result.rows.length) return res.status(404).json({ error: 'Customer not found' });

//   res.json(result.rows[0]);
// });

// app.delete('/api/v1/orgs/:orgId/customers/:id', auth, async (req, res) => {
//   if (req.user.org_id != Number(req.params.orgId) && req.user.role !== 'superadmin')
//     return res.status(403).json({ error: 'Forbidden' });

//   const result = await pool.query(
//     'DELETE FROM customers WHERE id=$1 AND org_id=$2 RETURNING *',
//     [req.params.id, req.params.orgId]
//   );
//   if (!result.rows.length) return res.status(404).json({ error: 'Customer not found' });

//   res.status(200).json({ deleted: true });
// });

// // Start server
// app.listen(5000, () => console.log('Backend running on port 5000'));



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
