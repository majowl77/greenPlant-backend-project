declare namespace Express {
  interface Request {
    msg: string
    validateUser: {
      firstName: string
      lastName: string
      email: string
      password: string
      
    }
  }
}
