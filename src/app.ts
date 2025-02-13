import express from "express";
import { connectDB, } from "./utils/features.js";
import { errorMiddleware } from "./middlewares/error.js";
import morgan from "morgan";
import dotenv from "dotenv";









// Importing Routes
import userRoute from "./routes/user.js";
import aiRoute from "./routes/ai.js";
import dashboardRoute from "./routes/dashboard.js"



// Configuring Environment Variables
dotenv.config({ path: "./.env" });


const port = process.env.PORT || 4000;
const mongoURI = process.env.MONGO_URI || "";
const clientURL = process.env.CLIENT_URL || "";



connectDB(mongoURI);

const app = express();
app.use(express.json());
app.set("view engine", "ejs");
app.set("views", "./views");



app.use(express.json());
app.use(morgan("dev"));


// Using Routes
app.use("/api/v1/user", userRoute);
app.use("/api/ai", aiRoute);
app.use("/api/v1/dashboard",dashboardRoute)




app.get("/", (req, res) => {
  res.render("home");
});

app.get('/login', (req, res) => {
  res.render('login');
});
app.get('/signup', (req, res) => {
  res.render('signup');
});

app.get('/dashboard', (req, res) => {

  res.render('dashboard');
});


app.use("/uploads", express.static("uploads"));
app.use(errorMiddleware);

app.listen(port, () => {
  console.log(`Express is working on http://localhost:${port}`);
});
