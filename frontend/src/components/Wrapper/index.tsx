"use client";

import SideHeader from "../SideHeader";
import styles from "./index.module.scss";

interface WrapperProps {
  children: JSX.Element;
}

const Wrapper: React.FC<WrapperProps> = ({ children }) => {
  return (
    <div className={styles.container}>
      <SideHeader />
      <div className={styles.wrapper}>
        <div className={styles.body}>{children}</div>
      </div>
    </div>
  );
};

export default Wrapper;
