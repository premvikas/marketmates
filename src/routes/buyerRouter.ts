const express = require('express');

const router = express.Router();

import {authoriseUser } from '../middleware/authoriseUser';
import {getSellersList, getSellerCatalog, createOrder} from '../controller/buyerController';


router.get('/getSellersList', authoriseUser, getSellersList)
router.get('/getSellerCatalog/:sellerId', authoriseUser, getSellerCatalog)
router.post('/createOrder/:sellerId',authoriseUser, createOrder)

export = router;