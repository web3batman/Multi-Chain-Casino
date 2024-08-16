import { MailDataRequired } from "@sendgrid/helpers/classes/mail";
import sgMail from "@sendgrid/mail";
import nodemailer from "nodemailer";
import postmark, { Message } from "postmark";

import {
  POSTMARK_SERVER_TOKEN,
  SENDGRID_API_KEY,
  SENDGRID_SENDER,
  SMTP_APP_PASSWORD,
  SMTP_APP_USER,
} from "@/config";

import logger from "./logger";

sgMail.setApiKey(SENDGRID_API_KEY);

export type TNodeMailOptions = {
  from: string;
  to: string;
  subject: string;
  html: string;
};

const nodeMailerTrasnport = nodemailer.createTransport({
  service: "Gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: SMTP_APP_USER,
    pass: SMTP_APP_PASSWORD,
  },
});

const postmarkClient = new postmark.ServerClient(POSTMARK_SERVER_TOKEN);

export const sendEmailWithSendGrid = (
  userEmail: string,
  messageObj: { subject: string; text: string } & Partial<MailDataRequired>
) => {
  const { subject, text, replyTo } = messageObj;

  const msg: MailDataRequired = {
    to: userEmail,
    from: SENDGRID_SENDER,
    subject,
    text,
  };

  if (replyTo) {
    msg.replyTo = replyTo;
  }

  return sgMail.send(msg);
};

export const sendEmailWithNodeMailer = async (mailOption: TNodeMailOptions) => {
  try {
    const resMail = await nodeMailerTrasnport.sendMail(mailOption);
    return resMail;
  } catch {
    return null;
  }
};

export const sendEmailWithPostmark = async (mailOption: Message) => {
  try {
    const resMail = postmarkClient.sendEmail(mailOption);
    return resMail;
    return;
  } catch (error) {
    logger.error("Postmark Error::: " + error);
  }
};
