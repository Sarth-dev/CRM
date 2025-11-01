function superAdminOnly(req, res, next) {
  if (req.user.role !== 'superadmin') return res.status(403).json({ error: 'Forbidden' });
  next();
}

function adminOrSameOrg(req, res, next) {
  if (
    req.user.role === 'superadmin' ||
    (req.user.role === 'admin' && req.user.org_id === parseInt(req.params.orgId))
  ) {
    return next();
  }
  return res.status(403).json({ error: 'Forbidden' });
}

module.exports = { superAdminOnly, adminOrSameOrg };
