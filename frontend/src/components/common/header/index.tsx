import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { Container } from "./styled";

const Header: React.FC = () => {
  const account = useAccount();
  console.log(account);

  return (
    <Container>
      EDUCHAIN
      <ConnectButton
        chainStatus="none"
        showBalance={false}
        accountStatus="address"
      />
    </Container>
  );
};

export default Header;
