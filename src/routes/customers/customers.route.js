import express from 'express';
import {
  getCustomersController,
  getCustomerByIdController,
  createCustomerController,
  updateCustomerController,
  deleteCustomerController,
} from '../../controllers/customers/customer.controller.js';

const router = express.Router();

// GET / - list
router.get('/', getCustomersController);

// GET /:id - get by id
router.get('/:id', getCustomerByIdController);

// POST / - create
router.post('/', createCustomerController);

// PUT /:id - update
router.put('/:id', updateCustomerController);

// DELETE /:id - soft delete
router.delete('/:id', deleteCustomerController);

export default router;