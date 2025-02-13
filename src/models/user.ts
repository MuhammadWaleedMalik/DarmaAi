import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  loginTimes: number;
  createdAt: Date;
  updatedAt: Date;
  hasPassword: (password: string) => Promise<boolean>;
  generateJsonWebToken: () => string;

}

const schema = new mongoose.Schema(
  {
    
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: [true, "Email already Exist"],
      required: [true, "Please enter Name"],
    },
    password: {
      type: String,
      required: [true, "Please enter Password"],
      select: false,
      },
    loginTimes: {
      type: Number,
      default: 0,
      },

  },
  {
    timestamps: true,
  }
);




schema.methods.BycryptPassword = async function () {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
};

schema.methods.hasPassword = async function (password: string) {
  return await bcrypt.compare(password, this.password);
};


schema.methods.generateJsonWebToken = function () {
  const secretKey = process.env.SECRET_KEY;
  if (!secretKey) {
    throw new Error("SECRET_KEY is not defined");
  }
  return jwt.sign({ _id: this._id }, secretKey);
};

schema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});



export const User = mongoose.model<IUser>("User", schema);
