import express from 'express';

import client from '../configs/database';

interface catalogInterface {
    sellerId: number,
    name: string
}

interface productInterface {
    catalogId: number,
    productName: string,
    productPrice: number
}

const createCatalog = async (req: express.Request,res: express.Response) => {
    try{
        const {sellerId, name} : catalogInterface = req.body;
    
        if(!sellerId){
            return res.status(400).json({error: "sellerId doesnt exists"});
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
        
        // const insertProductText = 'INSERT INTO product (product_name, product_price, catalog_id, created_at) VALUES ($1,$2,$3, current_timestamp)'
        // const insertProductValue = [productName, productPrice, insertCatalogResponse.rows[0].id]
        // await client.query(insertProductText, insertProductValue) 
        await client.query('COMMIT');
        
        return res.status(200).json({status: "success"})

    } catch(err){
        console.log({err})
        await client.query('ROLLBACK')
        return res.status(400).json({error: err})
    } 
}

const createProduct = async (req: express.Request,res: express.Response ) => {
    try{
        const {catalogId, productName, productPrice} : productInterface = req.body;

        if(!catalogId || !productName || !productPrice){
            return res.status(400).json({error: "mandatory fields are not present"});
        }

        const insertProductText = 'INSERT INTO product (product_name, product_price, catalog_id, created_at) VALUES ($1,$2,$3, current_timestamp) RETURNING *'
        const insertProductValue = [productName, productPrice, catalogId]

       const response =  await client.query(insertProductText, insertProductValue)
       return res.status(200).json({status: "success", body: response});

    } catch (err){
        console.log({err})
        return res.status(400).json({error: err});
    }
}

const getOrdersBySellerId = async (req: express.Request,res: express.Response) => {
    
    try{
        const {sellerId} = req.params;
       const id : any = Number(sellerId);
      
        const response = await client.query('SELECT * FROM order_v1 where seller_id = $1', [id])
        const orders = response.rows;
        console.log({response});
        return res.status(200).json({status: "success", orders:orders});
    } catch (err){
        return res.status(500).json({error:err});
    }
}

export {
    createCatalog,
    createProduct,
    getOrdersBySellerId
}