import { forwardRef } from 'hooks/hooks.js';

import styles from './styles.module.scss';

const AvatarPreview = forwardRef((_, ref) => (
  <div className={styles.container}>
    <canvas
      ref={ref}
      className={styles.avatar}
    />
  </div>
));

export { AvatarPreview };
