"use client";

import Wrapper from "@/components/Wrapper";
import fetchData from "@/libs/fetchData";
import { Announcements } from "@/types/announcement";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "./page.module.scss";

export default function AnnouncementDetail() {
  const param = useParams();
  const [task, setTask] = useState<Announcements>();

  useEffect(() => {
    const callData = async () => {
      const response = (await fetchData(
        `/announcements/${param.id}`
      )) as Announcements;

      setTask(response);
    };

    callData();
  }, []);

  return (
    <Wrapper>
      {{
        header: <div>Header</div>,
        body: (
          <div className={styles.container}>
            <div className={styles.title}>{task?.title}</div>
            <div className={styles.table}>
              <div className={styles.tableHeader}>
                {task?.job === "work" ? "작업" : "공고"} 개요
              </div>
              <div className={styles.tableBody}>{task?.guide}</div>
            </div>
          </div>
        ),
      }}
    </Wrapper>
  );
}
