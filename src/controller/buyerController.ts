import client from '../configs/database';
import express from 'express';
import format from 'pg-format';

const getSellersList = async (req :express.Request,res: express.Response) => {

    try{
        const data = await client.query('SELECT user_name,email_id FROM user_v1 WHERE type=$1',["seller"]);
        const listOfEmailIds = data.rows.map((eachData : any) => eachData.email_id);
        return res.status(200).json({message: "success", data: listOfEmailIds});

    } catch(err){
        console.log("getSellersList",{err})
        return res.status(500).json({error: err})
    }
}

const getSellerCatalog = async (req :express.Request,res: express.Response) => {
    try{
        const {sellerId} = req.params;

        const response = await client.query('SELECT id,name FROM catalog WHERE seller_id = $1',[sellerId]);
        const catalogList = response.rows.map((eachData : any) =>  {
            
            return {name: eachData.name, id: eachData.id}
        });

        return res.status(200).json({message: "success", data: catalogList});

    } catch(err){
        console.log("getSellerCatalog ->",{err})
        return res.status(500).json({error: err})
    }
}

const createOrder = async (req : any, res: express.Response) => {
    try{
        const {productData} = req.body;
        const buyerId = req.buyerId;
        const {sellerId} = req.params;
        
        const productIds =  productData.map((eachData: any) => eachData.productId)
        const productResponse = await client.query('SELECT product_name,product_price,id,seller_id FROM product WHERE id = ANY($1::int[])',[productIds]);
  
        const productDetails = productResponse.rows;
        
        if(productDetails.length === 0) return res.status(400).json({error: "product not found"});

        let totalPrice = 0, totalQuantity = 0;

        for(let i=0;i<productDetails.length;i++){
            const eachProduct = productDetails[i];
            const {product_price: price, id} = eachProduct;
            totalPrice += price;
            const {quantity} = productData.find(({productId} : any) => productId === Number(id))
            totalQuantity += quantity;
        }
     
        await client.query('BEGIN')
        const insertOrderText = 'INSERT INTO order_v1 (buyer_id, seller_id, quantity, price, created_at) VALUES ($1,$2,$3,$4, current_timestamp) RETURNING *'
        const insertOrderValue = [buyerId, sellerId, totalQuantity, totalPrice]
    
        const insertOrderResponse = await client.query(insertOrderText, insertOrderValue);
        const orderId = insertOrderResponse.rows[0].id;

        const orderItems : any = [];
        productDetails.forEach(((eachProduct : any) => {
            const {id,  product_price} = eachProduct;
            const {quantity} = productData.find(({productId}: any) => productId === Number(id))
            orderItems.push([orderId, id, quantity, product_price, new Date()]);
        }));
        
       await client.query(format('INSERT INTO order_item (order_id, product_id, quantity, unit_price, created_at) VALUES %L', orderItems));
       await client.query('COMMIT');
    
       return res.status(200).json({message: "success", orderId: orderId});
    } catch (err){
        console.log("createOrder -> ",{err})
        await client.query('ROLLBACK')
        return res.status(400).json({error: err})
    }
}

export {
    getSellersList,
    getSellerCatalog,
    createOrder
}