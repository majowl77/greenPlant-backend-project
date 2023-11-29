declare namespace Express {
  interface Request {
    msg: string
    validateRegisteredUser: {
      firstName: string
      lastName: string
      email: string
      password: string
    },
    validateLoginUser: {
      email: string
      password: string
    }
  }
}
