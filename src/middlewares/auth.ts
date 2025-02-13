import { User } from "../models/user.js";
import jwt from "jsonwebtoken";
import ErrorHandler from "../utils/utility-class.js";
import { TryCatch } from "./error.js";

// Middleware to attach user to req if token is valid
export const attachUserIfExists = TryCatch(async (req, res, next) => {
  // Check if the Authorization header exists
  const token = req.headers.authorization?.split(" ")[1]; // Bearer <token>

  if (!token) {
    // No token found, move to the next middleware
    return next();
  }

  try {
    // Verify the token
    if (!process.env.SECRET_KEY) {
      throw new ErrorHandler("SECRET_KEY is not defined", 500);
    }
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    // Find the user by the decoded ID
    if (typeof decoded !== 'string' && '_id' in decoded) {
       const user = await User.findById(decoded._id);

       if (user) {
         // Attach the user to the request object
         req.user = user;
       }
    }


    // Move to the next middleware
    next();
  } catch (error) {
    // Token is invalid, but we don't throw an error
    // Just move to the next middleware
    next();
  }
});