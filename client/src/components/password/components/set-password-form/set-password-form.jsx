
import qs from 'qs';
import PropTypes from 'prop-types';
import { useAppForm, useState, useMemo, useLocation, useNavigate } from 'hooks/hooks.js';
import {
  ButtonType,
  ButtonSize,
  ButtonColor,
  IconName,
  AppRoute,
  UserPayloadKey
} from 'common/enums/enums.js';
import {
  Button,
  Input,
  Segment
} from 'components/common/common.js';
import {
  setWithConfirmPassword as setWithConfirmPasswordValidationSchema
} from 'validation-schemas/validation-schemas.js';
import { DEFAULT_SET_PASSWORD_PAYLOAD } from './common/constants.js';
import styles from './styles.module.scss';

const SetPasswordForm = ({ onSet }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { control, errors, handleSubmit } = useAppForm({
    defaultValues: DEFAULT_SET_PASSWORD_PAYLOAD,
    validationSchema: setWithConfirmPasswordValidationSchema
  });

  const { search } = useLocation();
  const navigate = useNavigate();

  const token = useMemo(() => search && qs.parse(search.slice(1))?.token, [search]);

  const handleSet = values => {
    setIsLoading(true);

    onSet({
      password: values.password,
      token
    })
      .unwrap()
      .then(() => {
        navigate(AppRoute.LOGIN);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <>
      <h2 className={styles.title}>Set password to your account</h2>
      <form name="setPasswordForm" onSubmit={handleSubmit(handleSet)}>
        <Segment>
          <fieldset disabled={isLoading} className={styles.fieldset}>
            <Input
              name={UserPayloadKey.PASSWORD}
              type="password"
              placeholder="Password"
              iconName={IconName.LOCK}
              control={control}
              errors={errors}
            />
            <Input
              name={UserPayloadKey.CONFIRM_PASSWORD}
              type="password"
              placeholder="Confirm password"
              iconName={IconName.LOCK}
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
              Set
            </Button>
          </fieldset>
        </Segment>
      </form>
    </>
  );
};

SetPasswordForm.propTypes = {
  onSet: PropTypes.func.isRequired
};

export { SetPasswordForm };
