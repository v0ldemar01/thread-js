import nodemailer from 'nodemailer';

class EmailTransporter {
  #transporter;

  constructor({ options }) {
    this.#transporter = this.#createTransporter(options);
  }

  get transporter() {
    return this.#transporter;
  }

  #createTransporter(transportOptions) {
    return nodemailer.createTransport(transportOptions);
  }

  sendEmailViaTransporter(options) {
    return this.#transporter.sendMail(options);
  }
}

export { EmailTransporter };
