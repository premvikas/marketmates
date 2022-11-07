import express from 'express';
import jwt from 'jsonwebtoken';

const authoriseUser = async (req: any, res:express.Response, next:express.NextFunction)  => {
    try{
        const { token } : any = req.headers;
        const response : any = await jwt.verify(token, process.env.SECRET_KEY as string);
        const {id, type} = response;
    
        if(type === "buyer"){
            req.buyerId = id;
        } else {
            req.sellerId = id;
        }
        next();
    } catch (err){
        console.log("authoriseUser -> ",{err})
        return res.status(400).json({error: "Authorisation failed"});
    }
}

export {
    authoriseUser
}