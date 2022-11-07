import bcrypt from 'bcrypt';
import express from 'express'
import jwt from 'jsonwebtoken';
import 'dotenv/config';

import  client  from '../configs/database';

interface registerUserInterface {
    name: string,
    emailId: string,
    phoneNumber: number,
    password: string,
    type: string
}

interface loginUserInterface {
    emailId: string,
    password: string
}

interface authUserInterface {
    token : string
}

const registerUser  =  async (req:express.Request, res:express.Response) => {
    try {

        const { name, emailId, phoneNumber, password, type } : registerUserInterface =  req.body;

        if(!emailId || !name || !phoneNumber || !password){
            return res.status(400).json({error: "Mandatory fields are not sent"})
        }

        const data : any = await client.query('SELECT email_id FROM user_v1 WHERE email_id = $1',[emailId]);

        if (data.rows.length  !=  0) {
            return  res.status(400).json({error: "Account already exists for this Email Id, No need to register again."});
        } 

        const hash = await bcrypt.hash(password, 10)

        const user : registerUserInterface  = {
            name,
            emailId,
            phoneNumber,
            password: hash,
            type
        };

        await client.query
        (`INSERT INTO user_v1 (user_name, email_id, phone_number, password, type, created_at) VALUES ($1,$2,$3,$4,$5, current_timestamp);`, 
        [user.name, user.emailId, user.phoneNumber, user.password, user.type]);
    
        //const  token  = jwt.sign({emailId: user.emailId},process.env.SECRET_KEY);
        res.status(200).send({ message: `${type} - ${emailId} Registered Successfully`});
    }
    catch (err) {
        res.status(500).json({
        error: err, 
        });
    };
}

const loginUser = async (req:express.Request, res:express.Response) => {
    try {
        const { emailId, password } : loginUserInterface = req.body;

        if(!emailId || !password){
            return res.status(400).json({error: "Mandatory fields are not present"});
        }
    
        const data = await client.query(`SELECT user_v1.password FROM user_v1 WHERE email_id = $1`, [emailId]) 
        const user = data.rows;
    
        if (user.length === 0) {
            res.status(400).json({
                error: "User is not registered, Sign Up first",
            });
        }
    
       const result = await bcrypt.compare(password, user[0].password);

        if (result != true){
            return res.status(400).json({error: "Enter correct password!"});
        }
    
        const token = jwt.sign({emailId: emailId}, process.env.SECRET_KEY as string);
        res.status(200).json({message: `User - ${emailId} signed in!`, token: token});

    } catch (err) {
        console.log("err", err)
        res.status(500).json({
        error: err
        });
    };
}

const authoriseUser = async (req:express.Request, res:express.Response, next:express.NextFunction)  => {
    try{
        const { token } : any = req.headers;
        await jwt.verify(token, process.env.SECRET_KEY as string);
        next();
    } catch (err){
        return res.status(400).json({error: "Authorisation failed"});
    }
}
export  {
    registerUser,
    loginUser,
    authoriseUser
}