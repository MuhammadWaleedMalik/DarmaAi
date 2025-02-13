import { NextFunction, Request, Response } from "express";


export type ControllerType = (
  req: Request & { user?: any },
  res: Response,
  next: NextFunction
) => Promise<void | Response<any, Record<string, any>>>;


export  type NewUserRequestBody = {
  name: string;
  email: string;
  gender: string;
  dob: Date;
  password: string;
};

export type LoginUserRequestBody = {
  email: string;
  password: string;
};
