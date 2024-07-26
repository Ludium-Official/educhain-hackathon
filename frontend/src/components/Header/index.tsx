"use client";

import { sha256ToHex } from "@/app/libs/cryptoEncode";
import fetchData from "@/app/libs/fetchData";
import { PATH } from "@/constant/route";
import { DBUser } from "@/types/user";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";
import { useEffect } from "react";
import { useAccount } from "wagmi";

const Header = () => {
  const account = useAccount();

  useEffect(() => {
    const encode = sha256ToHex(
      `${account.address}${process.env.NEXT_PUBLIC_ADDRESS_KEY}`
    );

    const callData = async () => {
      const response = (await fetchData("/user", "POST", {
        addressKey: encode,
      })) as DBUser;

      console.log(response);
    };

    account && callData();
  }, [account]);

  return (
    <div>
      <Link href={PATH.HOME}>EDUCHAIN</Link>
      <div>
        <div>
          <Link href={PATH.ANNOUNCEMENT}>공고 지원</Link>
          <Link href={PATH.WORK}>작업 수행</Link>
          <Link href={PATH.PROGRAM}>프로그램</Link>
          <Link href={PATH.PARTICIPATION}>프로그램 참여</Link>
          <Link href={PATH.MANAGEMENT}>운영 관리</Link>
        </div>
        <ConnectButton
          chainStatus="none"
          showBalance={false}
          accountStatus="address"
        />
      </div>
    </div>
  );
};

export default Header;
