import { ZodError } from 'zod'

class ApiError {
  constructor(public code: number, public message: string | ZodError['errors']) {
    this.code = code
    this.message = message
  }
  static badRequest(msg: string) {
    return new ApiError(400, msg)
  }
  static internal(msg: string) {
    return new ApiError(500, msg)
  }
  static conflict(message: string) {
    return new ApiError(409, message)
  }
  static unauthorized(message: string) {
    return new ApiError(401, message)
  }
  static notFound(message: string) {
    return new ApiError(404, message)
  }
  static forbidden(message: string) {
    return new ApiError(403, message)
  }
  static badRequestValidation(msg: ZodError['errors']) {
    return new ApiError(400, msg)
  }
  static badRegisterValidation(msg: ZodError['errors']) {
    return new ApiError(400, msg)
  }
}

export default ApiError
