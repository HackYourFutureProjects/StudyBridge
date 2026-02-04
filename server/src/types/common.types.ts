import { Request, Response } from "express";

export type RequestWithBody<B> = Request<object, object, B, object>;
export type ResponseWithData<D> = Response<D>;
