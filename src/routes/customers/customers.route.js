import express from "express";
import * as customerControllers from "../../controllers/customers/customer.controller.js";

const router = express.Router();

// GET / - list
router.get("/", customerControllers.getCustomersController);

// GET /:id - get by id
router.get("/:id", customerControllers.getCustomerByIdController);

// POST / - create
router.post("/", customerControllers.createCustomerController);

// PUT /:id - update
router.put("/:id", customerControllers.updateCustomerController);

// DELETE /:id - soft delete
router.delete("/:id", customerControllers.deleteCustomerController);

export default router;
