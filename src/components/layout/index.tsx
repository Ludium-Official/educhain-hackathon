import { forwardRef } from 'react';
import { includes } from 'ramda';

import { PATH } from '@/constant/route';
import WithResponsive from '@/components/common/withResponsive';
import { useRouter } from 'next/router';
import { Body, Container } from './styled';

export interface ILayoutProps {
  children: {
    body: JSX.Element;
    header?: JSX.Element;
    footer?: JSX.Element;
  };
}

const Layout: React.ForwardRefRenderFunction<HTMLDivElement, ILayoutProps> = (
  { children },
  ref,
) => {
  const router = useRouter();

  return (
    <Body ref={ref}>
      <div>
        {children.header || <div>Header</div>}

        <Container>{children.body}</Container>
      </div>

      {children.footer || (
        <WithResponsive>
          {{
            pc: <div>Footer</div>,
            mobile: <div>Mobile Footer</div>,
          }}
        </WithResponsive>
      )}
    </Body>
  );
};

export default forwardRef(Layout);
