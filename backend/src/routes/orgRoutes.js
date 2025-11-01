const express = require('express');
const { createOrg, getOrgs, getOrgById, updateOrg, deleteOrg } = require('../controllers/orgController');
const { superAdminOnly } = require('../middlewares/roleMiddlewares');
const auth = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/', auth, superAdminOnly, createOrg);
router.get('/', auth, superAdminOnly, getOrgs);
router.get('/:orgId', auth, superAdminOnly, getOrgById);
router.patch('/:orgId', auth, superAdminOnly, updateOrg);
router.delete('/:orgId', auth, superAdminOnly, deleteOrg);

module.exports = router;
