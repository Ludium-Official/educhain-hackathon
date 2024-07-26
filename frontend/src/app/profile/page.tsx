"use client";

import PhoneLogo from "@/assets/profile/PhoneLogo.svg";
import ProfileLogo from "@/assets/profile/ProfileLogo.svg";
import Wrapper from "@/components/Wrapper";
import { useUser } from "@/hooks/store/user";
import Image from "next/image";
import styles from "./page.module.scss";

export default function Profile() {
  const { user } = useUser();

  return (
    <Wrapper>
      {{
        header: <div>Header</div>,
        body: (
          <div className={styles.container}>
            <div className={styles.profileWrapper}>
              <div className={styles.profileInfo}>
                <div className={styles.profileImgInfo}>
                  <Image
                    className={styles.profileImg}
                    src={ProfileLogo.src}
                    alt="logo"
                    width={60}
                    height={60}
                  />
                  <div className={styles.hi}>
                    안녕하세요,<span>{user?.name}</span>님
                  </div>
                </div>
                <div className={styles.infoWrapper}>
                  <div className={styles.intro}>{user?.introduce}</div>
                  <div className={styles.number}>
                    <Image
                      className={styles.phoneImg}
                      src={PhoneLogo.src}
                      alt="logo"
                      width={24}
                      height={24}
                    />
                    {user?.number}
                  </div>
                </div>
              </div>
              <button>프로필 수정</button>
            </div>
          </div>
        ),
      }}
    </Wrapper>
  );
}
