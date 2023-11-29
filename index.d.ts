declare namespace Express {
  interface Request {
    msg: string
    validateRegisteredUser: {
      firstName: string
      lastName: string
      email: string
      password: string
    }
    validateLoginUser: {
      email: string
      password: string
    }
    decodedUser: {
      userID: string
      email: string
      role: 'USER' | 'ADMIN'
      iat: number
      exp: number
    }
  }
}
