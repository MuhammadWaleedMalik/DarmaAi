import express,{ Request, Response } from "express";
import { attachUserIfExists } from "../middlewares/auth.js";
import { Data } from "../models/data.js";
import { User } from "../models/user.js";



const app = express.Router();

interface CustomRequest extends Request {
    user?: any;
  }
//api/v1/dashboard/getUserData

app.get("/getUserData", attachUserIfExists, async (req: CustomRequest, res: Response) => {
    const user = req?.user || null; // Ensure `req.user` is handled properly

    // Ensure user is logged in
    if (!user) {
        return res.status(401).json({ error: "Unauthorized. Please log in." });
    }

    try {
        // Fetch data for the logged-in user
        const userData = await Data.findOne({ user: user._id }).populate("user");

        if (!userData) {
            return res.status(404).json({ error: "No data found for this user." });
        }

        // Return user data
        res.json({ data: userData });

    } catch (error) {
        console.error("Error fetching user data:", error);
        res.status(500).json({ error: "Failed to fetch user data. Please try again." });
    }
});



const getAllUsers = async (req: CustomRequest, res: Response) => {
    try {
        const users = await User.find();
        res.status(200).json({ users });
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ error: "Failed to fetch users. Please try again." });
    }
};

//api/v1/dashboard/get
app.get('/get',getAllUsers)
    


export default app;