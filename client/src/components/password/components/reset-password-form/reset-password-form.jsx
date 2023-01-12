import PropTypes from 'prop-types';
import { useAppForm, useState, useNavigate } from 'hooks/hooks.js';
import {
  ButtonType,
  ButtonSize,
  ButtonColor,
  AppRoute,
  IconName,
  UserPayloadKey
} from 'common/enums/enums.js';
import {
  Button,
  Input,
  Message,
  NavLink,
  Segment
} from 'components/common/common.js';
import { resetPassword as resetPasswordValidationSchema } from 'validation-schemas/validation-schemas.js';
import { DEFAULT_RESET_PASSWORD_PAYLOAD } from './common/constants.js';
import styles from './styles.module.scss';

const ResetPasswordForm = ({ onReset }) => {
  const [isLoading, setLoading] = useState(false);
  const { control, errors, handleSubmit } = useAppForm({
    defaultValues: DEFAULT_RESET_PASSWORD_PAYLOAD,
    validationSchema: resetPasswordValidationSchema
  });

  const navigate = useNavigate();

  const handleReset = values => {
    setLoading(true);

    onReset(values)
      .unwrap()
      .then(() => {
        navigate(AppRoute.LOGIN);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <>
      <h2 className={styles.title}>Reset your password</h2>
      <form name="resetPasswordForm" onSubmit={handleSubmit(handleReset)}>
        <Segment>
          <fieldset disabled={isLoading} className={styles.fieldset}>
            <Input
              name={UserPayloadKey.EMAIL}
              type="email"
              placeholder="Email"
              iconName={IconName.AT}
              control={control}
              errors={errors}
            />
            <Button
              type={ButtonType.SUBMIT}
              color={ButtonColor.TEAL}
              size={ButtonSize.LARGE}
              isLoading={isLoading}
              isFluid
              isPrimary
            >
              Reset
            </Button>
          </fieldset>
        </Segment>
      </form>
      <Message>
        <span>Remembered password?</span>
        <NavLink to={AppRoute.LOGIN}>Sign in</NavLink>
      </Message>
    </>
  );
};

ResetPasswordForm.propTypes = {
  onReset: PropTypes.func.isRequired
};

export { ResetPasswordForm };
