import 'dotenv/config'

export const dev = {
  app: {
    port: process.env.SERVER_PORT,
    db: process.env.ATLAS_URL,
  },
  email: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
    domain: process.env.EMAIL_ACTIVATION_DOMAIN,
    frontEndDomain: process.env.EMAIL_FORGOT_PASSWORD_DOMAIN,
  },
  auth: {
    secretToken: process.env.SECRET_TOKEN,
  },
  environment: process.env.NODE_ENV,
  s3: {
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
  },
}
