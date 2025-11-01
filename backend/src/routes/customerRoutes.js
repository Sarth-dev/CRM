const express = require('express');
const { createCustomer, getCustomers, getCustomerById, updateCustomer, deleteCustomer } = require('../controllers/customerController');
const { adminOrSameOrg } = require('../middlewares/roleMiddlewares');
const auth = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/:orgId/customers', auth, adminOrSameOrg, createCustomer);
router.get('/:orgId/customers', auth, adminOrSameOrg, getCustomers);
router.get('/:orgId/customers/:id', auth, adminOrSameOrg, getCustomerById);
router.patch('/:orgId/customers/:id', auth, adminOrSameOrg, updateCustomer);
router.delete('/:orgId/customers/:id', auth, adminOrSameOrg, deleteCustomer);

module.exports = router;
