"use client";

import PlusLogo from "@/assets/common/PlusLogo.svg";
import Wrapper from "@/components/Wrapper";
import { PATH } from "@/constant/route";
import { getConvertDeadline } from "@/functions/deadline-function";
import { useUser } from "@/hooks/store/user";
import { Announcements } from "@/types/announcement";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import fetchData from "../libs/fetchData";
import styles from "./page.module.scss";

export default function Announcement() {
  const { user } = useUser();
  const [announcements, setAnnouncements] = useState<Announcements[]>([]);
  const [works, setWorks] = useState<Announcements[]>([]);

  useEffect(() => {
    const callData = async () => {
      const manageResponse = (await fetchData("/announcements", "POST", {
        job: "manage",
      })) as Announcements[];

      const workResponse = (await fetchData("/announcements", "POST", {
        job: "work",
      })) as Announcements[];

      setAnnouncements(manageResponse);
      setWorks(workResponse);
    };

    callData();
  }, []);

  return (
    <Wrapper>
      {{
        header: <div>Header</div>,
        body: (
          <div className={styles.container}>
            <div className={styles.title}>공고 수행</div>
            <div className={styles.table}>
              <div className={styles.tableHeader}>
                공고 목록
                {user?.auth === "0" && (
                  <button>
                    <Image
                      className={styles.addBtn}
                      src={PlusLogo.src}
                      alt="logo"
                      width={18}
                      height={18}
                    />
                    공고 추가
                  </button>
                )}
              </div>
              {announcements.map((announcement) => (
                <div key={announcement.id} className={styles.tableBody}>
                  <Link href={`${PATH.ANNOUNCEMENT}/${announcement.id}`}>
                    <div className={styles.endTime}>
                      {getConvertDeadline(announcement.end_at)}
                    </div>
                    <div className={styles.announceTitle}>
                      {announcement.title}
                    </div>
                  </Link>
                </div>
              ))}
            </div>
            <div className={styles.table}>
              <div className={styles.tableHeader}>
                작업 목록
                {user?.auth === "0" && (
                  <button>
                    <Image
                      className={styles.addBtn}
                      src={PlusLogo.src}
                      alt="logo"
                      width={18}
                      height={18}
                    />
                    작업 추가
                  </button>
                )}
              </div>
              {works.map((work) => (
                <div key={work.id} className={styles.tableBody}>
                  <Link href={`${PATH.ANNOUNCEMENT}/${work.id}`}>
                    <div className={styles.endTime}>
                      {getConvertDeadline(work.end_at)}
                    </div>
                    <div className={styles.announceTitle}>{work.title}</div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        ),
      }}
    </Wrapper>
  );
}
