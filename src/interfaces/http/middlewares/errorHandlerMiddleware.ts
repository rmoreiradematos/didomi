import { NextFunction, Request, Response } from 'express'

export const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  console.error(err)
  res.status(500).json({ error: err.message })
}
