import { NextFunction, Request, Response } from 'express'

export const validateRequest = (schema: any) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body)
    if (error) {
      return res.status(400).json({ error: error.message })
    }
    next()
  }
}
