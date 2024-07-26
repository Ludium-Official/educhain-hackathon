"use client";

import { sha256ToHex } from "@/app/libs/cryptoEncode";
import fetchData from "@/app/libs/fetchData";
import LudiumLogo from "@/assets/common/LudiumLogo.svg";
import ActiveAnnouncementLogo from "@/assets/header/ActiveAnnouncementLogo.svg";
import ActiveCommunityLogo from "@/assets/header/ActiveCommunityLogo.svg";
import ActiveProfileLogo from "@/assets/header/ActiveProfileLogo.svg";
import ActiveWorkLogo from "@/assets/header/ActiveWorkLogo.svg";
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
  const currentPage = `/${pathname.split("/")[1]}`;

  const callData = useCallback(
    async (addressKey: string) => {
      const response = (await fetchData("/user", "POST", {
        addressKey,
      })) as User[];

      if (response.length > 0) {
        setUser(response[0]);
        return;
      }

      setUser(null);
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
  }, [account?.address, callData]);

  return (
    <div className={styles.container}>
      <div className={styles.sideContent}>
        <Link href={PATH.HOME}>
          <Image src={LudiumLogo.src} alt="logo" width={70} height={32} />
        </Link>
        <div className={styles.navigation}>
          {account.address ? (
            <Link
              className={clsx(
                currentPage === PATH.PROFILE ? styles.this : null,
                styles.link
              )}
              href={PATH.PROFILE}
            >
              <Image
                src={
                  currentPage === PATH.PROFILE
                    ? ActiveProfileLogo.src
                    : ProfileLogo.src
                }
                alt="logo"
                width={24}
                height={24}
              />
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
              currentPage === PATH.ANNOUNCEMENT ? styles.this : null,
              styles.link
            )}
            href={PATH.ANNOUNCEMENT}
          >
            <Image
              src={
                currentPage === PATH.ANNOUNCEMENT
                  ? ActiveAnnouncementLogo.src
                  : AnnouncementLogo.src
              }
              alt="logo"
              width={24}
              height={24}
            />
            공고 수행
          </Link>
          <Link
            className={clsx(
              currentPage === PATH.WORK ? styles.this : null,
              styles.link
            )}
            href={PATH.WORK}
          >
            <Image
              src={
                currentPage === PATH.WORK ? ActiveWorkLogo.src : WorkLogo.src
              }
              alt="logo"
              width={24}
              height={24}
            />
            학습 참여
          </Link>
          <Link
            className={clsx(
              currentPage === PATH.PROGRAM ? styles.this : null,
              styles.link
            )}
            href={PATH.PROGRAM}
          >
            <Image
              src={clsx(
                currentPage === PATH.PROGRAM
                  ? ActiveCommunityLogo.src
                  : CommunityLogo.src
              )}
              alt="logo"
              width={24}
              height={24}
            />
            커뮤니티
          </Link>
        </div>
      </div>
      <div>address</div>
    </div>
  );
};

export default SideHeader;
