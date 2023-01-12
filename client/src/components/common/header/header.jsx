import PropTypes from 'prop-types';
import {
  IconName,
  IconSize,
  ButtonType,
  AppRoute,
  ButtonSize,
  ButtonColor
} from 'common/enums/enums';
import { DEFAULT_USER_AVATAR } from 'common/constants/constants';
import { userType } from 'common/prop-types/prop-types';
import { useState, useAppForm, useCallback, useDispatch } from 'hooks/hooks';
import { Button, Icon, Image, NavLink, Input } from 'components/common/common';
import { profileActionCreator } from 'store/actions.js';

import styles from './styles.module.scss';

const Header = ({ user, onUserLogout }) => {
  const [isEditing, setEditing] = useState(false);

  const dispatch = useDispatch();

  const { control, handleSubmit } = useAppForm({
    defaultValues: {
      status: user.status
    }
  });

  const handleUpdateStatus = useCallback(values => {
    dispatch(profileActionCreator.updateUser(
      values
    ))
      .unwrap()
      .finally(() => {
        setEditing(false);
      });
  }, [dispatch]);

  return (
    <div className={styles.headerWrp}>
      {user && (
        <form
          name="profile"
          className={styles.profile}
          onSubmit={handleSubmit(handleUpdateStatus)}
        >
          <div className={styles.userWrapper}>
            <NavLink to={AppRoute.ROOT}>
              <Image
                isCircular
                width="45"
                height="45"
                src={user.image?.link ?? DEFAULT_USER_AVATAR}
                alt="user avatar"
              />
            </NavLink>
            <div className={styles.userInfo}>
              {user.username}
              <br />
              {!isEditing ? (
                <span
                  className={styles.userStatus}
                  onClick={() => setEditing(true)}
                >
                  {user.status ?? 'No status yet'}
                </span>
              ) : (
                <div className={styles.userStatusForm}>
                  <Input
                    placeholder="Status"
                    name="status"
                    control={control}
                  />
                  <div className={styles.buttons}>
                    <Button
                      size={ButtonSize.MEDIUM}
                      color={ButtonColor.RED}
                      type={ButtonType.BUTTON}
                      onClick={() => {
                        setEditing(false);
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      size={ButtonSize.MEDIUM}
                      color={ButtonColor.TEAL}
                      type={ButtonType.SUBMIT}
                    >
                      Update
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </form>
      )}
      <div>
        <NavLink to={AppRoute.PROFILE} className={styles.menuBtn}>
          <Icon name={IconName.USER_CIRCLE} size={IconSize.LARGE} />
        </NavLink>
        <Button
          className={`${styles.menuBtn} ${styles.logoutBtn}`}
          onClick={onUserLogout}
          type={ButtonType.BUTTON}
          iconName={IconName.LOG_OUT}
          iconSize={IconSize.LARGE}
          isBasic
        />
      </div>
    </div>
  );
};

Header.propTypes = {
  onUserLogout: PropTypes.func.isRequired,
  user: userType.isRequired
};

export { Header };
