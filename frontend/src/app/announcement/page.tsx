"use client";

import Wrapper from "@/components/Wrapper";
import styles from "./page.module.scss";

export default function Announcement() {
  return (
    <Wrapper>
      {{
        header: <div>Header</div>,
        body: <div className={styles.container}>Announcement</div>,
      }}
    </Wrapper>
  );
}
