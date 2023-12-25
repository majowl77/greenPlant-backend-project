import { NextFunction, Request, Response } from 'express'
import multer from 'multer'
import path from 'path'
import ApiError from '../errors/ApiError'

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../../public/images'))
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)

    const fileType = file.mimetype.split('/')[1]
    const fileName = `${file.originalname.split('.')[0]}-${uniqueSuffix}.${fileType}`
    cb(null, fileName)
  },
})

const upload = multer({ storage: storage })

function uloadImageChecker(req: Request, res: Response, next: NextFunction) {
  if (!req.file) {
    next(ApiError.badRequest('image is required!'))
    return
  }
  req.fileLocation = `public/imags/${req.file.filename}`

  next()
}

export default [upload.single('image'), uloadImageChecker]
