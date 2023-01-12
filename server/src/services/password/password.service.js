import { ExceptionMessage } from 'shared/src/common/enums/enums.js';
import { UsersError } from '../../exceptions/exceptions.js';
import {
  createToken,
  encrypt
} from '../../helpers/helpers.js';
import { SET_PASSWORD_URL } from './common/constants.js';

class Password {
  #emailService;

  #userService;

  #authService;

  constructor({ emailService, userService, authService }) {
    this.#emailService = emailService;
    this.#userService = userService;
    this.#authService = authService;
  }

  async resetPassword(email) {
    const existingUser = await this.#userService.getUserByEmail(email);
    if (!existingUser) {
      throw new UsersError(ExceptionMessage.USER_NOT_FOUND_BY_EMAIL);
    }

    return this.sendResetTokenEmail({
      userId: existingUser.id,
      email: existingUser.email
    });
  }

  async setPassword({ token, password }) {
    const { userId } = await this.#authService.verifyToken(token);

    return this.#userService.update(userId, { password: await encrypt(password) });
  }

  async sendResetTokenEmail({ userId, email }) {
    const link = await this.generateResetTokenLink({ userId, email });

    await this.#emailService.sendResetPasswordToken({ to: email, link });
  }

  async generateResetTokenLink({ userId, email }) {
    const token = await createToken({ userId, email });

    return `${SET_PASSWORD_URL}${encodeURIComponent(token)}`;
  }
}

export { Password };
