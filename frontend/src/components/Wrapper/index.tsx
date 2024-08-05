'use client';

import SideHeader from '../SideHeader';
import styles from './index.module.scss';

interface WrapperProps {
  children: {
    body: JSX.Element;
    header?: JSX.Element;
  };
}

const Wrapper: React.FC<WrapperProps> = ({ children }) => {
  return (
    <div className={styles.container}>
      <SideHeader />
      <div className={styles.wrapper}>
        <div className={styles.body}>
          {children.header && <div className={styles.header}>{children.header}</div>}
          <div className={styles.content}>{children.body}</div>
        </div>
      </div>
    </div>
  );
};

export default Wrapper;
