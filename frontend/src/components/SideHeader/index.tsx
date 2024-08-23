'use client';

import LudiumLogo from '@/assets/common/LudiumLogo.svg';
import ActiveCommunityLogo from '@/assets/header/ActiveCommunityLogo.svg';
import ActiveMissionLogo from '@/assets/header/ActiveMissionLogo.svg';
import ActiveProfileLogo from '@/assets/header/ActiveProfileLogo.svg';
import ActiveProgramLogo from '@/assets/header/ActiveProgramLogo.svg';
import CommunityLogo from '@/assets/header/CommunityLogo.svg';
import DiscordLogo from '@/assets/header/DiscordLogo.svg';
import LudiumSubLogo from '@/assets/header/LudiumSubLogo.svg';
import MissionLogo from '@/assets/header/MissionLogo.svg';
import ProfileLogo from '@/assets/header/ProfileLogo.svg';
import ProgramLogo from '@/assets/header/ProgramLogo.svg';
import TelLogo from '@/assets/header/TelLogo.svg';
import XLogo from '@/assets/header/XLogo.svg';
import YoutubeLogo from '@/assets/header/YoutubeLogo.svg';
import { PATH } from '@/constant/route';
import { useUser } from '@/hooks/store/user';
import { sha256ToHex } from '@/libs/cryptoEncode';
import fetchData from '@/libs/fetchData';
import { UserType } from '@/types/user';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import clsx from 'clsx';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect } from 'react';
import { useAccount } from 'wagmi';
import styles from './index.module.scss';

const SideHeader = () => {
  const pathname = usePathname();
  const { setUser } = useUser();
  const account = useAccount();
  const currentPage = `/${pathname.split('/')[1]}`;

  const callData = useCallback(
    async (addressKey: string) => {
      const response = (await fetchData('/user', 'POST', {
        addressKey,
      })) as UserType[];

      if (response.length > 0) {
        setUser(response[0]);
        return;
      }

      setUser(null);
    },
    [setUser],
  );

  useEffect(() => {
    if (account?.address) {
      const encode = sha256ToHex(`${account.address}${process.env.NEXT_PUBLIC_ADDRESS_KEY}`);

      callData(encode);

      return;
    }
  }, [account?.address, callData]);

  return (
    <div className={styles.container}>
      <div className={styles.sideContent}>
        <Link href={PATH.HOME}>
          <Image src={LudiumLogo.src} alt="logo" width={70} height={32} />
        </Link>
        <div className={styles.navigation}>
          {account.address ? (
            <Link className={clsx(currentPage === PATH.PROFILE ? styles.this : null, styles.link)} href={PATH.PROFILE}>
              <Image
                src={currentPage === PATH.PROFILE ? ActiveProfileLogo.src : ProfileLogo.src}
                alt="logo"
                width={24}
                height={24}
              />
              Profile
            </Link>
          ) : (
            <div className={styles.connectBtnWrapper}>
              <ConnectButton chainStatus="none" showBalance={false} accountStatus="address" label="Sign In" />
            </div>
          )}
          <Link className={clsx(currentPage === PATH.PROGRAM ? styles.this : null, styles.link)} href={PATH.PROGRAM}>
            <Image
              src={currentPage === PATH.PROGRAM ? ActiveProgramLogo.src : ProgramLogo.src}
              alt="logo"
              width={24}
              height={24}
            />
            Program
          </Link>
          <Link className={clsx(currentPage === PATH.MISSION ? styles.this : null, styles.link)} href={PATH.MISSION}>
            <Image
              src={currentPage === PATH.MISSION ? ActiveMissionLogo.src : MissionLogo.src}
              alt="logo"
              width={24}
              height={24}
            />
            Mission
          </Link>
          <Link
            className={clsx(currentPage === PATH.COMMUNITY ? styles.this : null, styles.link)}
            href={PATH.COMMUNITY}
          >
            <Image
              src={clsx(currentPage === PATH.COMMUNITY ? ActiveCommunityLogo.src : CommunityLogo.src)}
              alt="logo"
              width={24}
              height={24}
            />
            Community
          </Link>
        </div>
      </div>
      <div className={styles.footerWrapper}>
        <Image className={styles.subLogo} src={LudiumSubLogo.src} alt="logo" width={52} height={24} />
        <div className={styles.companyInfoWrapper}>
          <div>Co.,Ltd. LUDIUM | Rep: LUDIUM</div>
          <div>Terms of service | Privacy policy</div>
          <div>Chief Privacy Officer: LUDIUM</div>
        </div>
        <div className={styles.contactWrapper}>
          <strong>Contact us</strong>
          <Link href="https://twitter.com/ludium_official" className={styles.contact} target="_blank">
            <Image src={XLogo.src} alt="logo" width={16} height={16} />
            Twitter
          </Link>
          <Link href="https://discord.com/invite/c8Snswayuw" className={styles.contact} target="_blank">
            <Image src={DiscordLogo.src} alt="logo" width={16} height={16} />
            Discord
          </Link>
          <Link href="https://www.youtube.com/@Ludium" className={styles.contact} target="_blank">
            <Image src={YoutubeLogo.src} alt="logo" width={16} height={16} />
            Youtube
          </Link>
          <Link
            href="mailto:contact@ludium.community?subject=디렉투스의 도움이 필요해"
            className={styles.contact}
            target="_blank"
          >
            <Image src={TelLogo.src} alt="logo" width={16} height={16} />
            Customer Service
          </Link>
        </div>
        <div>
          &copy;2024 LUDIUM
          <div>.ALL RIGHTS RESERVED.</div>
        </div>
      </div>
    </div>
  );
};

export default SideHeader;
