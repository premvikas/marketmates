import express from 'express';

const router = express.Router();

import {authoriseUser} from '../controller/authController';
import {createCatalog, createProduct, getOrdersBySellerId} from '../controller/sellerController';

router.post('/createCatalogue', authoriseUser, createCatalog)
router.post('/createProduct',authoriseUser, createProduct )
router.get('/getOrders/:sellerId', authoriseUser, getOrdersBySellerId)

export = router;