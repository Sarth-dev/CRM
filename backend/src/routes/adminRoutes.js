const express = require('express');
const { createAdmin, getAdmins, updateAdmin, deleteAdmin } = require('../controllers/adminController');
const { adminOrSameOrg } = require('../middlewares/roleMiddlewares');
const auth = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/:orgId/admins', auth, adminOrSameOrg, createAdmin);
router.get('/:orgId/admins', auth, adminOrSameOrg, getAdmins);
router.patch('/:orgId/admins/:adminId', auth, adminOrSameOrg, updateAdmin);
router.delete('/:orgId/admins/:adminId', auth, adminOrSameOrg, deleteAdmin);

module.exports = router;
