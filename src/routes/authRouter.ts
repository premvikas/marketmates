import express from 'express'
const router = express.Router();

import {registerUser, loginUser, authoriseUser} from '../controller/authController';

router.post('/register' , registerUser);
router.post('/login', loginUser)
router.post('/authoriseUser', authoriseUser);

export = router;
