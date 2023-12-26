import crypto from 'crypto'
import nodemailer from 'nodemailer'

import { dev } from '../config'

export function generateActivationToken() {
  return crypto.randomBytes(32).toString('hex')
}

// service to send emails in your behalf i.e. Node.js library for sending emails
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: dev.email.user,
    pass: dev.email.pass,
  },
})

export async function sendActivationEmail(
  userEmail: string,
  activationToken: string,
  firstName: string | undefined
) {
  const activationLink = `${dev.email.domain}/api/auth/activateUser/${activationToken}`

  const htmlEmailTemplate = `<section style="max-width: 2xl; padding: 6px 8px; margin: auto; background-color: #eff6ef; dark:bg-#335e33-900">
    <header>
        <a href="#">
            <img style="width: auto; height: 7px; sm-height: 8px;" src="greenPlantLogo.png" alt="">
        </a>
    </header>
    
    <main style="margin-top: 8px;">
        <h2 style="color: #335e33; dark-color: #335e33; ">Hi ${firstName},</h2>
    
        <p style=" margin-top: 2px; line-height: loose; color: #335e33; dark-color: #335e33;">
        Thank you for choosing GreenPlant! <br>
        Your account has been created. To activate your account and start shopping, click the button below.
        </p>
        
        <button style="padding: 6px 2px; margin-top: 4px; font-size: small; font-weight: medium; letter-spacing: wider; color: white; text-transform: capitalize; transition: colors 300ms transform; background-color: #719471 ; border-radius: lg; hover-background-color: #91c491; focus-outline: none; focus-ring: ring-blue-300; focus-opacity: 80;">
           <a href="${activationLink}" style="color: inherit; text-decoration: none;">  Activate your account </a> 
        </button>
        
        <p style="margin-top: 30px; color: #335e33; dark-color: #335e33;">
         Thanks,<br>
         GreenPlant Team
        </p>
    </main>
    
    
    <footer style="margin-top: 8px;">
        <p style="color: #335e33; dark-color: #335e33;">
        This email was sent to <a href="#" style="color: blue-600; hover-underline: underline; dark-color: blue-400;" target="_blank">${userEmail}</a>. 
            If you'd rather not receive this kind of email, you can <a href="#" style="color: blue-600; hover-underline: underline; dark-color: blue-400;">unsubscribe</a> or <a href="#" style="color: blue-600; hover-underline: underline; dark-color: blue-400;">manage your email preferences</a>.
        </p>
    
        <p style="margin-top: 3px; color: #335e33; dark-color: #335e33;">© ${new Date().getFullYear()}  GreenPlant. All Rights Reserved.</p>
    </footer>
    </section>`

  const mailOptions = {
    from: dev.email.user,
    to: userEmail,
    subject: 'GreenPlant| Account Activation ',
    html: htmlEmailTemplate,
  }
  try {
    const info = await transporter.sendMail(mailOptions)
    console.log('info', info)
    return info
  } catch (error) {
    console.error("can't send the email")
  }
}

export async function sendForgotPasswordEmail(
  userEmail: string,
  forgotPasswordCode: string,
  firstName: string | undefined
) {
  const activationLink = `${dev.email.frontEndDomain}/resetPassword/${forgotPasswordCode}`

  const htmlEmailTemplate = `<section style="font-family:Courier,Times,serif; max-width: 2xl; padding: 6px 8px; margin: auto; background-color: #eff6ef; dark:bg-#335e33-900">
    <header>
        <a href="#">
            <img style="width: auto; height: 7px; sm-height: 8px;" src="greenPlantLogo.png" alt="">
        </a>
    </header>
    
    <main style="margin-top: 8px;">
        <h2 style="color: #335e33; dark-color: #335e33;font-size: 20px;">Hi ${firstName},</h2>
    
        <p style="font-size: 15px; margin-top: 2px; line-height: loose; color: #335e33; dark-color: #335e33;">
        We received a request to reset the password for your account. If you did not make <br>
        request, you can ignore this email. No changes will be made to your account.
        <p style="font-size: 15px; color: #335e33;"> To reset your password, please click on the following link:
        </p>
        </p>
        
        <button style="padding: 6px 2px; margin-top: 4px; font-size: small; font-weight: medium; letter-spacing: wider; color: white; text-transform: capitalize; transition: colors 300ms transform; background-color: #719471 ; border-radius: lg; hover-background-color: #91c491; focus-outline: none; focus-ring: ring-blue-300; focus-opacity: 80;">
           <a href="${activationLink}" style="color: inherit; text-decoration: none;font-size: 15px;">  Reset Password Link
           </a> 
        </button>
        

        <p style="font-size: 14px;margin-top: 49px; color: #335e33; dark-color: #335e33;">
        If you have any questions or need further assistance, please contact our <br>
        support team at <a href="mailto:greenowls2023@gmail.com ">greenowls2023@gmail.com </a>
        </p>

        <p style="font-size: 14px; margin-top: 30px; color: #335e33; dark-color: #335e33;">
         Thanks,<br>
         GreenPlant Team
        </p>
    </main>
    
    
    <footer style="margin-top: 8px;">
        <p style="color: #335e33; dark-color: #335e33;">
        This email was sent to <a href="#" style="color: blue-600; hover-underline: underline; dark-color: blue-400;" target="_blank">${userEmail}</a>. 
            If you'd rather not receive this kind of email, you can <a href="#" style="color: blue-600; hover-underline: underline; dark-color: blue-400;">unsubscribe</a> or <a href="#" style="color: blue-600; hover-underline: underline; dark-color: blue-400;">manage your email preferences</a>.
        </p>
    
        <p style="margin-top: 3px; color: #335e33; dark-color: #335e33;">© ${new Date().getFullYear()}  GreenPlant. All Rights Reserved.</p>
    </footer>
    </section>`

  const mailOptions = {
    from: dev.email.user,
    to: userEmail,
    subject: 'GreenPlant| Reset Password Link ',
    html: htmlEmailTemplate,
  }
  try {
    const info = await transporter.sendMail(mailOptions)
    console.log('info', info)
    return info
  } catch (error) {
    console.error("can't send the email of resetPassword")
  }
}