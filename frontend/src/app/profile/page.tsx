'use client';

import PhoneLogo from '@/assets/profile/PhoneLogo.svg';
import ProfileLogo from '@/assets/profile/ProfileLogo.svg';
import BackLink from '@/components/BackLink';
import Wrapper from '@/components/Wrapper';
import { PATH } from '@/constant/route';
import { useUser } from '@/hooks/store/user';
import fetchData from '@/libs/fetchData';
import { UserType } from '@/types/user';
import Image from 'next/image';
import Link from 'next/link';
import { useCallback } from 'react';
import { useAccount } from 'wagmi';
import { sha256ToHex } from '../../libs/cryptoEncode';
import styles from './page.module.scss';

export default function Profile() {
  const { user, setUser } = useUser();
  const account = useAccount();

  const signIn = useCallback(async () => {
    const addressKey = sha256ToHex(`${account.address}${process.env.NEXT_PUBLIC_ADDRESS_KEY}`);

    await fetchData('/user/signIn', 'POST', {
      addressKey,
    });

    const response = (await fetchData('/user', 'POST', {
      addressKey,
    })) as UserType[];

    if (response.length > 0) {
      setUser(response[0]);
      return;
    }

    setUser(null);
  }, [account.address, setUser]);

  return (
    <Wrapper>
      {{
        header: (
          <div>
            <BackLink path={PATH.HOME} />
          </div>
        ),
        body: (
          <>
            {account.address && (
              <div className={styles.container}>
                {user ? (
                  <div className={styles.profileWrapper}>
                    <div className={styles.profileInfo}>
                      <div className={styles.profileImgInfo}>
                        <Image className={styles.profileImg} src={ProfileLogo.src} alt="logo" width={60} height={60} />
                        <div className={styles.hi}>
                          안녕하세요,<span>{user?.name}</span>님
                        </div>
                      </div>
                      <div className={styles.infoWrapper}>
                        <div className={styles.intro}>{user?.introduce}</div>
                        <div className={styles.number}>
                          <Image className={styles.phoneImg} src={PhoneLogo.src} alt="logo" width={24} height={24} />
                          {user?.number}
                        </div>
                      </div>
                    </div>
                    <Link className={styles.editBtn} href={`${PATH.PROFILE}/edit`}>
                      프로필 수정
                    </Link>
                  </div>
                ) : (
                  <button className={styles.addBtn} onClick={signIn}>
                    회원가입
                  </button>
                )}
              </div>
            )}
          </>
        ),
      }}
    </Wrapper>
  );
}
