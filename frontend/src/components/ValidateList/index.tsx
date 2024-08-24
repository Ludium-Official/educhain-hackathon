'use client';

import { PATH } from '@/constant/route';
import { MissionType } from '@/types/mission';
import dayjs from 'dayjs';
import Link from 'next/link';
import styles from './index.module.scss';

interface ValidateMissionListProps {
  mission: MissionType;
}

const ValidateMissionList: React.FC<ValidateMissionListProps> = ({ mission }) => {
  const formatDate = dayjs(mission.end_at).format('YYYY.MM.DD');

  return (
    <div className={styles.row}>
      <div className={styles.rowTitle}>
        <Link href={`${PATH.MISSION}/${mission.id}`} className={styles.link}>
          <span className={styles.contentTitle}>{mission.title}</span>
        </Link>
      </div>
      <div className={styles.deadline}>Deadline: {mission.end_at ? formatDate : '-'}</div>
    </div>
  );
};

export default ValidateMissionList;
