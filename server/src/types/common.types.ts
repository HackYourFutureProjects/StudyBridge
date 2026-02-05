import { Request, Response } from "express";

export type ParamsType = { id: string };

export type RequestWithBody<B> = Request<object, object, B, object>;
export type ResponseWithData<D> = Response<D>;
export type RequestWithParams<P> = Request<P, object, object, object>;
export type Role = "student" | "teacher" | "admin";
