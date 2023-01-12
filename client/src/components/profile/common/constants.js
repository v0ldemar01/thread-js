import { UserPayloadKey } from 'common/enums/enums';

const ALLOWED_FILE_TYPES = 'image/png, image/jpeg';

const DEFAULT_USER_PAYLOAD = {
  [UserPayloadKey.EMAIL]: '',
  [UserPayloadKey.USERNAME]: '',
  [UserPayloadKey.STATUS]: ''
};

export { ALLOWED_FILE_TYPES, DEFAULT_USER_PAYLOAD };
