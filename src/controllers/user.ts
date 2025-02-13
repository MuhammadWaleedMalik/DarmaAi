import { NextFunction, Request, Response } from "express";
import { User } from "../models/user.js";
import { LoginUserRequestBody, NewUserRequestBody } from "../types/types.js";
import { TryCatch } from "../middlewares/error.js";
import ErrorHandler from "../utils/utility-class.js";

export const newUser = TryCatch(
  async (
    req: Request<{}, {}, NewUserRequestBody>,
    res: Response,
    next: NextFunction
  ) => {
const { email,password} = req.body;


  

    if( !email ||!password) return next(new ErrorHandler("Please fill all the fields", 400));
    const name = email.split('@')[0]; 


    const user = await User.findOne({email});

    if(user) return next(new ErrorHandler("User already exists", 400));

    const newUser = await User.create({
      email,
      name,  
      password
    }); 
    

if(!newUser) return next(new ErrorHandler("User not created", 400));

return res.status(201).json({
  success: true,
  newUser,
});

  }
   

 

);

export const login = TryCatch(async (
  req: Request<{}, {}, LoginUserRequestBody>,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;

  
  if (!email || !password) {
    return next(new ErrorHandler("Please fill all the fields", 400));
  }

  const user = await User.findOne({ email }).select("+password"); 

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  // Validate password
  const isValidPassword = await user.hasPassword(password);

  if (!isValidPassword) {
    return next(new ErrorHandler("Invalid password", 401));
  }

  // Generate JWT token
  const token = user.generateJsonWebToken();

  // Set the cookie
  res.cookie("token", token, {
    httpOnly: true,
  });

  // Respond with success
  return res.status(200).json({
    success: true,
    user,
    token,
  });
});



