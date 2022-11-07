import express from 'express';

import client from '../configs/database';

interface catalogInterface {
    name: string
}

interface productInterface {
    catalogId: number,
    productName: string,
    productPrice: number
}

const createCatalog = async (req: any,res: express.Response) => {
    try{
        const {name} : catalogInterface = req.body;
        const sellerId  = req.sellerId;

        if(!sellerId){
            return res.status(400).json({error: "Not Authorised"});
        }

        if(!name){
            return res.status(400).json({error: "mandatory field doesnt exists"})
        }

        const userResponse  = await client.query(`SELECT email_id from user_v1 WHERE id = $1`,[sellerId]);

        if (userResponse.rows.length  ===  0) {
            return  res.status(400).json({error: "seller is not registered"});
        } 

        await client.query('BEGIN')
        const insertCatalogText = 'INSERT INTO catalog (name, seller_id, created_at) VALUES ($1, $2,current_timestamp) RETURNING *'
        const insertCatalogValues = [name, sellerId]
        await client.query(insertCatalogText,insertCatalogValues)
        
        await client.query('COMMIT');
        
        return res.status(200).json({status: "success"})

    } catch(err){
        console.log("createCatalog",{err})
        await client.query('ROLLBACK')
        return res.status(400).json({error: err})
    } 
}

const createProduct = async (req: any,res: express.Response ) => {
    try{

        const sellerId  = req.sellerId;

        if(!sellerId){
            return res.status(400).json({error: "Not Authorised"});
        }

        const {catalogId, productName, productPrice} : productInterface = req.body;

        if(!catalogId || !productName || !productPrice){
            return res.status(400).json({error: "mandatory fields are not present"});
        }

        const insertProductText = 'INSERT INTO product (product_name, product_price, catalog_id, seller_id, created_at) VALUES ($1,$2,$3,$4, current_timestamp) RETURNING *'
        const insertProductValue = [productName, productPrice, catalogId,sellerId ]

       const response =  await client.query(insertProductText, insertProductValue)
       return res.status(200).json({status: "success", body: response});

    } catch (err){
        console.log("createProduct",{err})
        return res.status(400).json({error: err});
    }
}

const getOrders = async (req: any,res: express.Response) => {
    
    try{
        const sellerId  = req.sellerId;

        if(!sellerId){
            return res.status(400).json({error: "Not Authorised"});
        }
      
        const response = await client.query('SELECT * FROM order_v1 where seller_id = $1', [sellerId])
        const orders = response.rows;
        return res.status(200).json({status: "success", orders:orders});
    } catch (err){
        console.log("getOrders",{err})
        return res.status(500).json({error:err});
    }
}

export {
    createCatalog,
    createProduct,
    getOrders
}