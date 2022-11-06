const express = require('express');

const router = express.Router();

import {authoriseUser } from '../controller/authController';
import {getSellersList, getSellerCatalog} from '../controller/buyerController';


router.get('/getSellersList', authoriseUser, getSellersList)
router.get('/getSellerCatalog/:sellerId', authoriseUser, getSellerCatalog)

export = router;