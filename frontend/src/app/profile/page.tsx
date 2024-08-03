"use client";

import PhoneLogo from "@/assets/profile/PhoneLogo.svg";
import ProfileLogo from "@/assets/profile/ProfileLogo.svg";
import Wrapper from "@/components/Wrapper";
import { useUser } from "@/hooks/store/user";
import fetchData from "@/libs/fetchData";
import { UserType } from "@/types/user";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { useAccount, useBalance, useSendTransaction, useSignTypedData, useSwitchChain, useWaitForTransactionReceipt } from "wagmi";
import type { SendTransactionData, SignTypedDataData } from "wagmi/query";
import { sha256ToHex } from "../../libs/cryptoEncode";
import styles from "./page.module.scss";
import { formatEther, Hex, parseEther } from "viem";

export default function Profile() {
  const { user, setUser } = useUser();
  const account = useAccount();

  const signIn = useCallback(async () => {
    const addressKey = sha256ToHex(`${account.address}${process.env.NEXT_PUBLIC_ADDRESS_KEY}`);

    await fetchData("/signIn", "POST", {
      addressKey,
    });

    const response = (await fetchData("/user", "POST", {
      addressKey,
    })) as UserType[];

    if (response.length > 0) {
      setUser(response[0]);
      return;
    }

    setUser(null);
  }, [account.address, setUser]);

  // <<-- 레퍼런스용 코드
  const { signTypedData } = useSignTypedData();
  const [sig, setSig] = useState<string>("");
  const [hash, setHash] = useState<Hex | undefined>("0x");
  const { data: balance } = useBalance({ address: account.address });
  const { switchChain } = useSwitchChain();
  const { sendTransaction } = useSendTransaction();
  const { data: txResult } = useWaitForTransactionReceipt({ hash });

  const sign = () => {
    return signTypedData(
      {
        types: {
          Person: [
            { name: "name", type: "string" },
            { name: "wallet", type: "address" },
          ],
          Mail: [
            { name: "from", type: "Person" },
            { name: "to", type: "Person" },
            { name: "contents", type: "string" },
          ],
        },
        primaryType: "Mail",
        message: {
          from: {
            name: "Cow",
            wallet: "0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826",
          },
          to: {
            name: "Bob",
            wallet: "0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB",
          },
          contents: "Hello, Bob!",
        },
      },
      {
        onSuccess: (data: SignTypedDataData) => {
          setSig(data);
        },
      }
    );
  };

  const sendEdu = () => {
    return sendTransaction(
      {
        to: "0x1acDF5aa05372de83EEA17a2df300A0f1731317B",
        value: parseEther("0.0001"),
      },
      {
        onSuccess: async (data: SendTransactionData) => {
          setHash(data);
        },
        onError: () => {
          window.alert("실패");
        },
      }
    );
  };

  useEffect(() => {
    if (txResult?.status === "success") {
      window.alert("트랜잭션 전송 성공");
    }
  }, [txResult]);
  // -->>

  return (
    <Wrapper>
      {{
        header: <div>Header</div>,
        body: (
          <>
            {/* {account.address && (
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
                    <button>프로필 수정</button>
                  </div>
                ) : (
                  <button onClick={signIn}>회원가입</button>
                )}
              </div>
            )} */}
            {/** <<-- 레퍼런스용 코드 */}
            <div className={styles.container}>
              <div className={styles.profileWrapper}>
                <div>
                  <span>{account.address}</span>
                </div>
              </div>
              <div className={styles.profileWrapper}>
                <div>
                  <span>{balance?.value ? formatEther(balance?.value) : 0} EDU</span>
                </div>
              </div>
              <div className={styles.profileWrapper}>
                <span>테스트 서명</span>
                {account.chainId === 656476 ? (
                  <button style={{ width: 150 }} onClick={sign}>
                    서명하기
                  </button>
                ) : (
                  <button style={{ width: 200 }} onClick={() => switchChain({ chainId: 656476 })}>
                    에듀체인으로 변경
                  </button>
                )}
              </div>
              <div className={styles.profileWrapper}>
                <div style={{ wordBreak: "break-all" }}>sig: {sig}</div>
              </div>
              <div className={styles.profileWrapper}>
                <div style={{ wordBreak: "break-all" }}>0.0001 EDU 짤짤이 보내기</div>
                <button style={{ width: 150 }} onClick={sendEdu}>
                  보내기
                </button>
              </div>
            </div>
            {/** -->> */}
          </>
        ),
      }}
    </Wrapper>
  );
}
