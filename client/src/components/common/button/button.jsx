/* eslint-disable react/button-has-type */
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {
  ButtonColor,
  ButtonType,
  IconName,
  IconSize,
  ButtonSize
} from 'common/enums/enums.js';
import { Icon } from 'components/common/common.js';
import styles from './styles.module.scss';

const Button = ({
  onClick,
  className,
  type,
  size,
  color,
  iconName,
  iconSize,
  isBasic,
  isFluid,
  isLoading,
  isPrimary,
  isDisabled,
  children
}) => {
  const hasIcon = Boolean(iconName);

  return (
    <button
      disabled={isDisabled}
      onClick={onClick}
      className={clsx(
        styles.btn,
        isLoading && styles.loading,
        isFluid && styles.fluid,
        isBasic && styles.basic,
        isPrimary && styles.primary,
        color && styles[`btn__${color}`],
        size && styles[`btn__${size}`],
        className
      )}
      type={type}
    >
      {hasIcon && <Icon name={iconName} size={iconSize} />}
      {children}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node,
  onClick: PropTypes.func,
  type: PropTypes.oneOf(Object.values(ButtonType)),
  color: PropTypes.oneOf(Object.values(ButtonColor)),
  className: PropTypes.string,
  iconName: PropTypes.oneOf(Object.values(IconName)),
  iconSize: PropTypes.oneOf(Object.values(IconSize)),
  isBasic: PropTypes.bool,
  isFluid: PropTypes.bool,
  isLoading: PropTypes.bool,
  isPrimary: PropTypes.bool,
  isDisabled: PropTypes.bool,
  size: PropTypes.oneOf(Object.values(ButtonSize))
};

Button.defaultProps = {
  type: ButtonType.BUTTON,
  onClick: null,
  children: null,
  color: null,
  className: null,
  iconSize: null,
  iconName: null,
  isBasic: false,
  isFluid: false,
  isLoading: false,
  isPrimary: false,
  isDisabled: false,
  size: null
};

export { Button };
