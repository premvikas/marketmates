import express from 'express'
const router = express.Router();

import {registerUser, loginUser} from '../controller/authController';

router.post('/register' , registerUser);
router.post('/login', loginUser)

export = router;
