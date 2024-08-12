'use client';

import BackArrowLogo from '@/assets/common/BackArrowLogo.svg';
import Image from 'next/image';
import Link from 'next/link';
import styles from './index.module.scss';

interface BackLinkProps {
  path: string;
}

const BackLink: React.FC<BackLinkProps> = ({ path }) => {
  return (
    <Link className={styles.backPage} href={path}>
      <Image className={styles.profileImg} src={BackArrowLogo.src} alt="logo" width={24} height={24} />
      Back
    </Link>
  );
};

export default BackLink;
