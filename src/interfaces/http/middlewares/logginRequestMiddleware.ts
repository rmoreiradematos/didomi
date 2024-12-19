import logger from '@utils/logger'
import { NextFunction, Request, Response } from 'express'

export const loggingMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  logger.info(`Incoming Request: ${req.method} ${req.path}`)
  res.on('finish', () => {
    logger.info(`Response Status: ${res.statusCode}`)
  })
  next()
}
