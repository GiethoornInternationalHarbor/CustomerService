import express = require('express');
import customerRoutes from './customer.routes';

const router = express.Router();

router.use('/customers', customerRoutes);

export default router;
