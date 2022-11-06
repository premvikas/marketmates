import client from '../configs/database';
import express from 'express';

const getSellersList = async (req :express.Request,res: express.Response) => {

    try{

        const data = await client.query('SELECT user_name,email_id FROM user1 WHERE type=$1',["seller"]);
        const listOfEmailIds = data.rows.map((eachData : any) => eachData.email_id);
        return res.status(200).json({message: "success", data: listOfEmailIds});

    } catch(err){
        return res.status(500).json({error: err})
    }
}

const getSellerCatalog = async (req :express.Request,res: express.Response) => {
    try{
        const {sellerId} = req.params;

        const response = await client.query('SELECT id,name FROM catalogue WHERE seller_id = $1',[sellerId]);
        const catalogueList = response.rows.map((eachData : any) =>  {
            
            return {name: eachData.name, id: eachData.id}
        });

        return res.status(200).json({message: "success", data: catalogueList});

    } catch(err){
        return res.status(500).json({error: err})
    }
}

export {
    getSellersList,
    getSellerCatalog
}