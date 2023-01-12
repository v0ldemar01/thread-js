import { ExceptionMessage, ExceptionName } from '../../common/enums/enums.js';

class UsersError extends Error {
  constructor(message = ExceptionMessage.USER_NOT_FOUND_BY_EMAIL) {
    super(message);
    this.name = ExceptionName.USERS;
  }
}

export { UsersError };
