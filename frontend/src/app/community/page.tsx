'use client';

import AddLogo from '@/assets/common/AddLogo.svg';
import BackLink from '@/components/BackLink';
import Wrapper from '@/components/Wrapper';
import { PATH } from '@/constant/route';
import { useUser } from '@/hooks/store/user';
import fetchData from '@/libs/fetchData';
import { CommunityType } from '@/types/community';
import dayjs from 'dayjs';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import styles from './page.module.scss';

export default function Community() {
  const { user } = useUser();

  const [communities, setCommunities] = useState<CommunityType[]>([]);

  useEffect(() => {
    const callData = async () => {
      const response = (await fetchData('/communities')) as CommunityType[];

      setCommunities(response);
    };

    callData();
  }, []);

  return (
    <Wrapper>
      {{
        header: (
          <div className={styles.headerWrapper}>
            <BackLink path={PATH.HOME} />
            {user?.auth === 0 && (
              <Link className={styles.addLink} href={`${PATH.COMMUNITY}/add`}>
                <Image className={styles.profileImg} src={AddLogo.src} alt="logo" width={24} height={24} />
                Add
              </Link>
            )}
          </div>
        ),
        body: (
          <div className={styles.container}>
            <div className={styles.title}>Community</div>
            <div className={styles.table}>
              {communities.map((community) => {
                const now = dayjs();
                const targetDate = dayjs(community.created_at);
                const formatDate = targetDate.format('YYYY.MM.DD');
                const isNew = now.diff(targetDate, 'day') <= 7;

                return (
                  <Link key={community.id} className={styles.row} href={`${PATH.COMMUNITY}/${community.id}`}>
                    <div className={styles.rowTitle}>
                      {isNew && <span>N</span>}
                      {community.title}
                    </div>
                    <div className={styles.rightSide}>
                      <div>Date: {formatDate}</div>
                      <div>Writer: {community.owner_name}</div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        ),
      }}
    </Wrapper>
  );
}
