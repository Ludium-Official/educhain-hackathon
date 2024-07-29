"use client";

import ArrowLogo from "@/assets/common/ArrowLogo.svg";
import Banner from "@/assets/main/Banner.png";
import Wrapper from "@/components/Wrapper";
import { PATH } from "@/constant/route";
import { getConvertDeadline } from "@/functions/deadline-function";
import fetchData from "@/libs/fetchData";
import { AnnouncementType } from "@/types/announcement";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import styles from "./page.module.scss";

export default function Home() {
  const [announcements, setAnnouncements] = useState<AnnouncementType[]>([]);

  useEffect(() => {
    const callData = async () => {
      const response = (await fetchData("/announcements", "POST", {
        isDash: true,
        job: "manage",
      })) as AnnouncementType[];

      setAnnouncements(response);
    };

    callData();
  }, []);

  return (
    <Wrapper>
      {{
        header: <div>Header</div>,
        body: (
          <div className={styles.container}>
            <div
              id="carouselExampleIndicators"
              className="carousel slide"
              data-bs-ride="true"
            >
              <div className={`carousel-indicators ${styles.carouselButtons}`}>
                <button
                  type="button"
                  data-bs-target="#carouselExampleIndicators"
                  data-bs-slide-to="0"
                  className="active"
                  aria-current="true"
                  aria-label="Slide 1"
                ></button>
                <button
                  type="button"
                  data-bs-target="#carouselExampleIndicators"
                  data-bs-slide-to="1"
                  aria-label="Slide 2"
                ></button>
                <button
                  type="button"
                  data-bs-target="#carouselExampleIndicators"
                  data-bs-slide-to="2"
                  aria-label="Slide 3"
                ></button>
              </div>
              <div className="carousel-inner">
                <div className="carousel-item active">
                  <Image
                    className="d-block w-100"
                    src={Banner.src}
                    alt="logo"
                    width={1033}
                    height={256}
                  />
                </div>
                <div className="carousel-item">
                  <Image
                    className="d-block w-100"
                    src={Banner.src}
                    alt="logo"
                    width={1033}
                    height={256}
                  />
                </div>
                <div className="carousel-item">
                  <Image
                    className="d-block w-100"
                    src={Banner.src}
                    alt="logo"
                    width={1033}
                    height={256}
                  />
                </div>
              </div>
            </div>
            <div className={styles.tableList}>
              <div className={styles.table}>
                <div className={styles.tableHeader}>
                  공고 목록
                  <Link className={styles.link} href={PATH.ANNOUNCEMENT}>
                    모두 보기
                    <Image
                      className={styles.seeLink}
                      src={ArrowLogo.src}
                      alt="logo"
                      width={24}
                      height={24}
                    />
                  </Link>
                </div>
                {announcements.map((announcement) => (
                  <div key={announcement.id} className={styles.tableBody}>
                    <Link href={`${PATH.ANNOUNCEMENT}/${announcement.id}`}>
                      <div className={styles.endTime}>
                        마감 {getConvertDeadline(announcement.end_at)}일 전
                      </div>
                      <div className={styles.title}>{announcement.title}</div>
                    </Link>
                  </div>
                ))}
              </div>
              <div className={styles.table}>
                <div className={styles.tableHeader}>
                  학습 목록
                  <Link className={styles.link} href={PATH.HOME}>
                    모두 보기
                    <Image
                      className={styles.seeLink}
                      src={ArrowLogo.src}
                      alt="logo"
                      width={24}
                      height={24}
                    />
                  </Link>
                </div>
                <div className={styles.tableBody}>list</div>
              </div>
            </div>
          </div>
        ),
      }}
    </Wrapper>
  );
}
