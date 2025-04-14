//import { response } from "express";

const jwt=require('jsonwebtoken');
require("dotenv").config();
import { Request, Response, NextFunction } from "express";

// Extend the Request interface to include a user property
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

const verifyAuthToken=async(request: Request, response: Response, next: NextFunction): Promise<void>=> {
	const authHeader  = request.headers.authorization; 
    const token = authHeader && authHeader.split(' ')[1]; 
    
    if(token==null){
        response.sendStatus(401);
    }else{
        jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET, (err: any, user: any) => {
            if (err) {
                return response.sendStatus(403);
            }else{ 
                request.user=user;                
                next();
            }
        })
    }
  
}

module.exports = verifyAuthToken

