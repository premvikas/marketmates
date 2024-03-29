import express from 'express';

const router = express.Router();

import {authoriseUser} from '../middleware/authoriseUser';
import {createCatalog, createProduct, getOrders} from '../controller/sellerController';

router.post('/createCatalogue', authoriseUser, createCatalog)
router.post('/createProduct',authoriseUser, createProduct )
router.get('/getOrders', authoriseUser, getOrders)

export = router;