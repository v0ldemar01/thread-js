import { useCallback, useDispatch, useLocation } from 'hooks/hooks.js';
import { AppRoute } from 'common/enums/enums.js';
import { passwordActionCreator } from 'store/actions.js';
import { Image } from 'components/common/common.js';
import { SetPasswordForm, ResetPasswordForm } from './components/components.js';
import styles from './styles.module.scss';

const Password = () => {
  const dispatch = useDispatch();
  const { pathname } = useLocation();

  const handleSetPassword = useCallback(
    payload => dispatch(passwordActionCreator.setPassword(payload)),
    [dispatch]
  );

  const handleResetPassword = useCallback(
    payload => dispatch(passwordActionCreator.resetPassword(payload)),
    [dispatch]
  );

  const getScreen = path => {
    switch (path) {
      case AppRoute.SET_PASSWORD: {
        return <SetPasswordForm onSet={handleSetPassword} />;
      }
      case AppRoute.RESET_PASSWORD: {
        return <ResetPasswordForm onReset={handleResetPassword} />;
      }
      default: {
        return null;
      }
    }
  };

  return (
    <div className={styles.login}>
      <section className={styles.form}>
        <h2 className={styles.logoWrapper}>
          <Image
            alt="Thread logo"
            width="75"
            height="75"
            isCircular
            src="http://s1.iconbird.com/ico/2013/8/428/w256h2561377930292cattied.png"
          />
          Thread
        </h2>
        {getScreen(pathname)}
      </section>
    </div>
  );
};

export { Password };
