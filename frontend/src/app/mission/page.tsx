'use client';

import BackLink from '@/components/BackLink';
import Wrapper from '@/components/Wrapper';
import { PATH } from '@/constant/route';
import styles from './page.module.scss';

export default function Mission() {
  const mission = {};

  return (
    <Wrapper>
      {{
        header: (
          <div>
            <BackLink path={PATH.HOME} />
          </div>
        ),
        body: <div className={styles.container}>{mission ? <div>mission</div> : <div>null</div>}</div>,
      }}
    </Wrapper>
  );
}
