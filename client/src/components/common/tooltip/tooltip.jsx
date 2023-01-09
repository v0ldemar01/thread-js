import PropTypes from 'prop-types';

import { getValidClasses } from 'helpers/helpers.js';

import styles from './styles.module.scss';

const Tooltip = ({ children, content, direction }) => {
  return (
    <div className={styles.tooltip}>
      {children}
      <div className={getValidClasses(styles.content, styles[direction])}>
        {content}
      </div>
    </div>
  );
};

Tooltip.propTypes = {
  content: PropTypes.oneOfType([
    PropTypes.string.isRequired,
    PropTypes.element.isRequired
  ]).isRequired,
  children: PropTypes.element.isRequired,
  direction: PropTypes.oneOfType([
    'top',
    'left',
    'right',
    'bottom'
  ])
};

Tooltip.defaultProps = {
  direction: 'top'
};

export { Tooltip };
