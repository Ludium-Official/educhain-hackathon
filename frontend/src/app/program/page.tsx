"use client";

import PlusLogo from "@/assets/common/PlusLogo.svg";
import Wrapper from "@/components/Wrapper";
import { PATH } from "@/constant/route";
import { getConvertDeadline } from "@/functions/deadline-function";
import fetchData from "@/libs/fetchData";
import { ProgramType } from "@/types/program";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import styles from "./page.module.scss";

export default function Program() {
  const [programs, setPrograms] = useState<ProgramType[]>([]);

  useEffect(() => {
    const callData = async () => {
      const response = (await fetchData("/programs", "POST", {
        isDash: true,
      })) as ProgramType[];

      setPrograms(response);
    };

    callData();
  }, []);

  return (
    <Wrapper>
      {{
        header: <div>Header</div>,
        body: (
          <div className={styles.container}>
            <div className={styles.title}>학습 참여</div>
            <div className={styles.table}>
              <div className={styles.tableHeader}>
                학습 목록
                <button>
                  <Image
                    className={styles.addBtn}
                    src={PlusLogo.src}
                    alt="logo"
                    width={18}
                    height={18}
                  />
                  모두 보기
                </button>
              </div>
              {programs.map((program) => {
                return (
                  <div key={program.id} className={styles.tableBody}>
                    <div className={styles.tableRow}>
                      <Link href={`${PATH.PROGRAM}/${program.id}`}>
                        <div className={styles.endTime}>
                          마감 {getConvertDeadline(program.end_at)}일 전
                        </div>
                        <div className={styles.announceTitle}>
                          {program.title}
                        </div>
                      </Link>
                      <div className={styles.progressWrapper}>
                        <div className={styles.goal}>달성률 0%</div>
                        <div className={styles.progressBar}>
                          <div className={clsx(styles[""])}></div>
                        </div>
                      </div>
                    </div>
                    <div className={styles.status}>미진행</div>
                  </div>
                );
              })}
            </div>
          </div>
        ),
      }}
    </Wrapper>
  );
}
