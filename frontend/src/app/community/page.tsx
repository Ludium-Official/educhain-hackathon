"use client";

import Wrapper from "@/components/Wrapper";
import styles from "./page.module.scss";

export default function Community() {
  return (
    <Wrapper>
      {{
        header: <div>Header</div>,
        body: (
          <div className={styles.container}>
            <div className={styles.title}>커뮤니티</div>
            <div className={styles.table}>table..</div>
          </div>
        ),
      }}
    </Wrapper>
  );
}
