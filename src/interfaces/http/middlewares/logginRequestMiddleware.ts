import logger from '@utils/logger'
import { NextFunction, Request, Response } from 'express'

export const loggingMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  logger.info(`Incoming Request: ${req.method} ${req.path}`)
  logger.info(`Request Body: ${JSON.stringify(req.body)}`)
  res.on('finish', () => {
    logger.info(`Response Status: ${res.statusCode}`)
  })
  next()
}
