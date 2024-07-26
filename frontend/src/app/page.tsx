import Wrapper from "@/components/Wrapper";
import styles from "./page.module.scss";

export default function Home() {
  return (
    <Wrapper>
      <div className={styles.container}>
        <div className={styles.header}>Header</div>
        <div className={styles.content}>Home</div>
      </div>
    </Wrapper>
  );
}
