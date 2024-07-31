"use client";

import BackLink from "@/components/BackLink";
import Wrapper from "@/components/Wrapper";
import { PATH } from "@/constant/route";
import fetchData from "@/libs/fetchData";
import { MissionType } from "@/types/mission";
import { ProgramType } from "@/types/program";
import dayjs from "dayjs";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "./page.module.scss";

export default function ProgramDetail() {
  const param = useParams();
  const [program, setProgram] = useState<ProgramType>();
  const [missions, setMissions] = useState<MissionType[]>([]);

  useEffect(() => {
    const callData = async () => {
      const programResponse = (await fetchData(
        `/programs/${param.id}`
      )) as ProgramType;
      const missionResponse = (await fetchData(
        `/missions/program/${param.id}`
      )) as MissionType[];

      setProgram(programResponse);
      setMissions(missionResponse);
    };

    callData();
  }, [param.id]);

  const formatDate = dayjs(program?.created_at).format("YYYY.MM.DD");

  return (
    <Wrapper>
      {{
        header: (
          <div>
            <BackLink path={PATH.PROGRAM} />
          </div>
        ),
        body: (
          <div className={styles.container}>
            {program ? (
              <>
                <div className={styles.title}>{program?.title}</div>
                <div className={styles.tableWrapper}>
                  <div className={styles.table}>
                    <div className={styles.tableHeader}>Program</div>
                    <div className={styles.tableContent}>{program.guide}</div>
                  </div>
                  <div className={styles.table}>
                    <div className={styles.tableHeader}>Missions</div>
                    <div className={styles.tableContent}>mission content</div>
                  </div>
                </div>
              </>
            ) : (
              <div>null</div>
            )}
          </div>
        ),
      }}
    </Wrapper>
  );
}
