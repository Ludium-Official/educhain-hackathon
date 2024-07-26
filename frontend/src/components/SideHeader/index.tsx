"use client";

import { sha256ToHex } from "@/app/libs/cryptoEncode";
import fetchData from "@/app/libs/fetchData";
import LudiumLogo from "@/assets/common/LudiumLogo.svg";
import AnnouncementLogo from "@/assets/header/AnnouncementLogo.svg";
import CommunityLogo from "@/assets/header/CommunityLogo.svg";
import ProfileLogo from "@/assets/header/ProfileLogo.svg";
import WorkLogo from "@/assets/header/WorkLogo.svg";
import { PATH } from "@/constant/route";
import { useUser } from "@/hooks/store/user";
import { User } from "@/types/user";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect } from "react";
import { useAccount } from "wagmi";
import styles from "./index.module.scss";

const SideHeader = () => {
  const pathname = usePathname();
  const { setUser } = useUser();
  const account = useAccount();
  console.log(pathname);

  const callData = useCallback(
    async (addressKey: string) => {
      const response = (await fetchData("/user", "POST", {
        addressKey,
      })) as User[];

      if (response.length > 0) {
        setUser(response[0]);
      }
    },
    [setUser]
  );

  useEffect(() => {
    if (account?.address) {
      const encode = sha256ToHex(
        `${account.address}${process.env.NEXT_PUBLIC_ADDRESS_KEY}`
      );

      callData(encode);

      return;
    }

    setUser(null);
  }, [account?.address, callData]);

  return (
    <div className={styles.container}>
      <div className={styles.sideContent}>
        <Link href={PATH.HOME}>
          <Image src={LudiumLogo.src} alt="logo" width={70} height={32} />
        </Link>
        <div className={styles.navigation}>
          {account.address ? (
            <Link className={styles.link} href={PATH.PROFILE}>
              <Image src={ProfileLogo.src} alt="logo" width={24} height={24} />
              프로필
            </Link>
          ) : (
            <div className={styles.connectBtnWrapper}>
              <ConnectButton
                chainStatus="none"
                showBalance={false}
                accountStatus="address"
                label="로그인"
              />
            </div>
          )}
          <Link
            className={clsx(
              pathname === PATH.ANNOUNCEMENT ? styles.this : null,
              styles.link
            )}
            href={PATH.ANNOUNCEMENT}
          >
            <img src={AnnouncementLogo.src} alt="logo" />
            공고 수행
          </Link>
          <Link className={styles.link} href={PATH.WORK}>
            <Image src={WorkLogo.src} alt="logo" width={24} height={24} />
            학습 참여
          </Link>
          <Link className={styles.link} href={PATH.PROGRAM}>
            <Image src={CommunityLogo.src} alt="logo" width={24} height={24} />
            커뮤니티
          </Link>
        </div>
      </div>
      <div>address</div>
    </div>
  );
};

export default SideHeader;
