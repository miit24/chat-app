const nodemailer = require('nodemailer')
const Email = require('email-templates')

module.exports = {

    sendMail : async (toEmail, mailSubject, locale)=>{
        const configOption = {
            // host: 'smtp.outlook.com',
            service:'outlook',
            port: 465,
            // secure: true, // use SSL
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD
            }
         };
         const viewPath = 'Views/emails'
         const transporter = await nodemailer.createTransport(configOption);
         const email = new Email({
            transport: transporter,
            send: true,
            preview: false,
            views: {
                options: {
                    extension: 'pug'
                },
                root: viewPath
            }
        });
        const info = await email.send({
            template: 'mars',
            message: {
                from: process.env.SMTP_USER,
                to: toEmail,
                subject: mailSubject
            },
            locals: locale
        });
        if (info) {
            console.log('Message sent');
        }
        return info;
    }
}

