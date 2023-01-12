import { UserPayloadKey } from 'common/enums/enums';

const DEFAULT_SET_PASSWORD_PAYLOAD = {
  [UserPayloadKey.PASSWORD]: '',
  [UserPayloadKey.CONFIRM_PASSWORD]: ''
};

export { DEFAULT_SET_PASSWORD_PAYLOAD };
