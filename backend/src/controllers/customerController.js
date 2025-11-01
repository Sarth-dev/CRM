const pool = require('../db');

exports.createCustomer = async (req, res) => {
  const { uid, device_id, name, email } = req.body;
  const orgId = req.params.orgId;
  if (req.user.org_id != parseInt(orgId, 10) && req.user.role !== 'superadmin') {
    return res.status(403).json({ error: 'Forbidden' });
  }
  const result = await pool.query(
    'INSERT INTO customers(uid, device_id, org_id, name, email) VALUES($1,$2,$3,$4,$5) RETURNING *',
    [uid, device_id, orgId, name, email]
  );
  res.status(201).json(result.rows[0]);
};

exports.getCustomers = async (req, res) => {
  const { orgId } = req.params;
  if (req.user.org_id != parseInt(orgId, 10) && req.user.role !== 'superadmin') {
    return res.status(403).json({ error: 'Forbidden' });
  }
  const { page = 1, per_page = 20 } = req.query;
  const offset = (page - 1) * per_page;
  const result = await pool.query('SELECT * FROM customers WHERE org_id=$1 ORDER BY id LIMIT $2 OFFSET $3', [orgId, per_page, offset]);
  const countRes = await pool.query('SELECT COUNT(*) FROM customers WHERE org_id=$1', [orgId]);
  res.json({ data: result.rows, total: Number(countRes.rows[0].count) });
};

exports.getCustomerById = async (req, res) => {
  const { orgId, id } = req.params;
  if (req.user.org_id != parseInt(orgId, 10) && req.user.role !== 'superadmin') {
    return res.status(403).json({ error: 'Forbidden' });
  }
  const result = await pool.query('SELECT * FROM customers WHERE id=$1 AND org_id=$2', [id, orgId]);
  if (!result.rows.length) return res.status(404).json({ error: 'Customer not found' });
  res.json(result.rows[0]);
};

exports.updateCustomer = async (req, res) => {
  const { orgId, id } = req.params;
  if (req.user.org_id != parseInt(orgId, 10) && req.user.role !== 'superadmin') {
    return res.status(403).json({ error: 'Forbidden' });
  }
  const allowedFields = ['uid', 'device_id', 'name', 'email'];
  const fields = [];
  const values = [];
  let idx = 1;
  for (const key of allowedFields) {
    if (req.body[key] !== undefined) {
      fields.push(`${key} = $${idx}`);
      values.push(req.body[key]);
      idx++;
    }
  }
  if (fields.length === 0) return res.status(400).json({ error: 'No valid fields to update' });
  values.push(id, orgId);
  const sql = `UPDATE customers SET ${fields.join(', ')}, updated_at=NOW() WHERE id=$${idx} AND org_id=$${idx + 1} RETURNING *`;
  const result = await pool.query(sql, values);
  if (!result.rows.length) return res.status(404).json({ error: 'Customer not found' });
  res.json(result.rows[0]);
};

exports.deleteCustomer = async (req, res) => {
  const { orgId, id } = req.params;
  if (req.user.org_id != parseInt(orgId, 10) && req.user.role !== 'superadmin') {
    return res.status(403).json({ error: 'Forbidden' });
  }
  const result = await pool.query('DELETE FROM customers WHERE id=$1 AND org_id=$2 RETURNING *', [id, orgId]);
  if (result.rows.length === 0) return res.status(404).json({ error: 'Customer not found' });
  res.status(200).json({ deleted: true });
};
