import { userType } from 'common/prop-types/prop-types.js';
import { DEFAULT_USER_AVATAR } from 'common/constants/constants.js';

import styles from './styles.module.scss';

const UserReaction = ({
  user
}) => (
  <div className={styles.user}>
    <div>
      <img className={styles.avatar} src={user.image?.link ?? DEFAULT_USER_AVATAR} alt="avatar" />
    </div>
    <div>
      <span className={styles.author}>{user.username}</span>
    </div>
  </div>
);

UserReaction.propTypes = {
  user: userType.isRequired
};

export { UserReaction };
