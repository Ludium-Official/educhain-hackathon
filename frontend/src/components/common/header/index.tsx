import { PATH } from "@/constant/route";
import { Link } from "@/styles/Common";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { Container, HeaderWrapper, Navigation } from "./styled";

const Header: React.FC = () => {
  const account = useAccount();
  console.log(account);

  return (
    <Container>
      <Link href={PATH.HOME}>EDUCHAIN</Link>
      <HeaderWrapper>
        <Navigation>
          <Link href={PATH.ANNOUNCEMENT}>공고 지원</Link>
          <Link href={PATH.WORK}>작업 수행</Link>
          <Link href={PATH.PROGRAM}>프로그램</Link>
          <Link href={PATH.PARTICIPATION}>프로그램 참여</Link>
          <Link href={PATH.MANAGEMENT}>운영 관리</Link>
        </Navigation>
        <ConnectButton
          chainStatus="none"
          showBalance={false}
          accountStatus="address"
        />
      </HeaderWrapper>
    </Container>
  );
};

export default Header;
