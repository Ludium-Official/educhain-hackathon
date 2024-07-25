import { forwardRef } from "react";
import WithResponsive from "@/components/common/withResponsive";
import { useRouter } from "next/router";
import { Body, Container } from "./styled";
import Header from "../header";

export interface ILayoutProps {
  children: {
    body: JSX.Element;
    header?: JSX.Element;
    footer?: JSX.Element;
  };
}

const Layout: React.ForwardRefRenderFunction<HTMLDivElement, ILayoutProps> = (
  { children },
  ref
) => {
  const router = useRouter();

  return (
    <Body ref={ref}>
      <div>
        {children.header || <Header />}

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
