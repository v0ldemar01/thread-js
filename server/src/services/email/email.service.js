import { getResetPasswordTemplate } from './common/templates.js';

class Email {
  #emailTransporter;

  #sourceEmail;

  constructor({ emailTransporter, sourceEmail }) {
    this.#emailTransporter = emailTransporter;
    this.#sourceEmail = sourceEmail;
  }

  sendResetPasswordToken({ to, link }) {
    const emailOptions = {
      to,
      from: this.#sourceEmail,
      ...getResetPasswordTemplate(link)
    };

    return this.#sendEmail(emailOptions);
  }

  async #sendEmail(emailOptions) {
    return this.#emailTransporter.sendEmailViaTransporter(emailOptions);
  }
}

export { Email };
