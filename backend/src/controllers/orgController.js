const pool = require('../db');

exports.createOrg = async (req, res) => {
  const { name } = req.body;
  const result = await pool.query('INSERT INTO orgs(name, created_at, updated_at) VALUES($1, NOW(), NOW()) RETURNING *', [name]);
  res.status(201).json(result.rows[0]);
};

exports.getOrgs = async (req, res) => {
  const result = await pool.query('SELECT * FROM orgs ORDER BY id');
  res.json(result.rows);
};

exports.getOrgById = async (req, res) => {
  const result = await pool.query('SELECT * FROM orgs WHERE id=$1', [req.params.orgId]);
  if (!result.rows.length) return res.status(404).json({ error: 'Organisation not found' });
  res.json(result.rows[0]);
};

exports.updateOrg = async (req, res) => {
  const { name } = req.body;
  const result = await pool.query('UPDATE orgs SET name=$1, updated_at=NOW() WHERE id=$2 RETURNING *', [name, req.params.orgId]);
  if (!result.rows.length) return res.status(404).json({ error: 'Organisation not found' });
  res.json(result.rows[0]);
};

exports.deleteOrg = async (req, res) => {
  const result = await pool.query('DELETE FROM orgs WHERE id=$1 RETURNING *', [req.params.orgId]);
  if (!result.rows.length) return res.status(404).json({ error: 'Organisation not found' });
  res.status(204).send();
};
