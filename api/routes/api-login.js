import express from 'express';
const router = express.Router();
import { checkUser } from '../active-directory/ldap_operation.js';

router.post('/', await checkUser);

export default router;