"use client";

import Wrapper from "@/components/Wrapper";
import fetchData from "@/libs/fetchData";
import { AnnouncementType } from "@/types/announcement";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "./page.module.scss";

export default function AnnouncementDetail() {
  const param = useParams();
  const [task, setTask] = useState<AnnouncementType>();

  useEffect(() => {
    const callData = async () => {
      const announcementResponse = (await fetchData(
        `/announcements/${param.id}`
      )) as AnnouncementType;

      setTask(announcementResponse);
    };

    callData();
  }, [param.id]);

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
