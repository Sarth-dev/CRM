const pool = require('../db');
const bcrypt = require('bcrypt');

exports.createAdmin = async (req, res) => {
  const { name, email, password, role } = req.body;
  const orgId = parseInt(req.params.orgId, 10);
  const password_hash = await bcrypt.hash(password, 10);
  try {
    const result = await pool.query(
      'INSERT INTO admins(name,email,password_hash,org_id,role) VALUES($1,$2,$3,$4,$5) RETURNING id, name, email, role, org_id',
      [name, email, password_hash, orgId, role]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    if (err.code === '23505') {
      res.status(409).json({ error: 'Email already in use' });
    } else {
      throw err;
    }
  }
};

exports.getAdmins = async (req, res) => {
  const { orgId } = req.params;
  const result = await pool.query('SELECT id, name, email, role, org_id FROM admins WHERE org_id=$1', [orgId]);
  res.json(result.rows);
};

exports.updateAdmin = async (req, res) => {
  const { orgId, adminId } = req.params;
  const { name, email, password, role } = req.body;
  const fields = [];
  const values = [];
  let idx = 1;
  if (name !== undefined) { fields.push(`name=$${idx}`); values.push(name); idx++; }
  if (email !== undefined) { fields.push(`email=$${idx}`); values.push(email); idx++; }
  if (password !== undefined) {
    const hash = await bcrypt.hash(password, 10);
    fields.push(`password_hash=$${idx}`);
    values.push(hash); idx++;
  }
  if (role !== undefined) { fields.push(`role=$${idx}`); values.push(role); idx++; }

  if (fields.length === 0) return res.status(400).json({ error: 'No valid fields to update' });
  values.push(adminId, orgId);

  const result = await pool.query(
    `UPDATE admins SET ${fields.join(', ')} WHERE id=$${idx} AND org_id=$${idx + 1} RETURNING id, name, email, role, org_id`,
    values
  );
  if (!result.rows.length) return res.status(404).json({ error: 'Admin not found' });
  res.json(result.rows[0]);
};

exports.deleteAdmin = async (req, res) => {
  const { orgId, adminId } = req.params;
  const result = await pool.query('DELETE FROM admins WHERE id=$1 AND org_id=$2 RETURNING *', [adminId, orgId]);
  if (result.rows.length === 0) return res.status(404).json({ error: 'Admin not found' });
  res.status(204).send();
};
