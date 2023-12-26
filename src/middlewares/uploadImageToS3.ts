import { NextFunction, Request, Response } from 'express'
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import 'dotenv/config'
import multer from 'multer'
import { dev } from '../config'
import ApiError from '../errors/ApiError'

const upload = multer()

async function handleUpload(req: Request, res: Response, next: NextFunction) {
  if (!req.file) {
    next(ApiError.badRequest('Image is required'))
    return
  }

  console.log('🚀 ~ file: uploadImageToS3.ts:22 ~ handleUpload ~ accessKeyId:', dev.s3.accessKeyId)
  console.log(
    '🚀 ~ file: uploadImageToS3.ts:22 ~ handleUpload ~ secretAccessKey:',
    dev.s3.secretAccessKey
  )
  const s3 = new S3Client({
    region: 'eu-west-2',
    credentials: {
      accessKeyId: dev.s3.accessKeyId as string,
      secretAccessKey: dev.s3.secretAccessKey as string,
    },
  })

  const region = 'eu-west-2'
  const bucketName = 'majedah-bucket'

  const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
  const fileType = req.file.mimetype.split('/')[1]
  const fileName = `${req.file.originalname.split('.')[0]}-${uniqueSuffix}.${fileType}`
  const file = req.file?.buffer

  const params = {
    Bucket: bucketName,
    Key: fileName,
    Body: file,
    ContentType: 'image/png',
  }

  try {
    const upload = await s3.send(new PutObjectCommand(params))
    const statusCode = upload.$metadata.httpStatusCode

    if (statusCode === 200) {
      const imageLocation = `${bucketName}.s3.${region}.amazonaws.com/${fileName}`
      req.fileLocation = imageLocation

      next()
      return
    }
    console.log('File uploaded successfully!', upload)
  } catch (error) {
    console.log('🚀 ~ file: uploadImageToS3.ts:52 ~ handleUpload ~ error:', error)
    next(ApiError.badRequest('Image upload faild!!, somthing went wrong with s3' + error))
  }
}

export default [upload.single('image'), handleUpload]
