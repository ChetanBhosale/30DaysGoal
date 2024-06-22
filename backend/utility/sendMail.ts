import nodemailer, { Transporter } from "nodemailer";
import ejs from "ejs";
import path from "path";
import "dotenv/config";
const { MAIL_HOST, MAIL_PASS, MAIL_USER } = process.env;

interface emailOptions {
  email: string;
  subject: string;
  template: string;
  data: { [key: string]: any };
}

const sendMail = async (options: emailOptions): Promise<void> => {
  const transporter: Transporter = nodemailer.createTransport({
    host: MAIL_HOST,
    auth: {
      user: MAIL_USER,
      pass: MAIL_PASS,
    },
  });

  const { email, subject, template, data } = options;

  const templatePath = path.join(__dirname, "../../mail", template);

  const html: string = await ejs.renderFile(templatePath, data);

  const mailOptions = {
    from: MAIL_USER,
    to: email,
    subject,
    html,
  };

  await transporter.sendMail(mailOptions);
};

export default sendMail;
