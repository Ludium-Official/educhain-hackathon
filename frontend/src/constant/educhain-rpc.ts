import { defineChain } from "viem";

export const opencampus = defineChain({
  id: 656476,
  name: "OpenCampus",
  network: "open-campus",
  nativeCurrency: {
    decimals: 18,
    name: "Edu",
    symbol: "EDU",
  },
  rpcUrls: {
    default: {
      http: ["https://rpc.open-campus-codex.gelato.digital"],
      webSocket: ["wss://open-campus-codex-sepolia.drpc.org"],
    },
  },
  blockExplorers: {
    default: { name: "Explorer", url: "https://opencampus-codex.blockscout.com/" },
  },
  contracts: {
    // multicall3: {
    //   address: "multicall3 주소 못 찾음.",
    // 온체인에서 여러 데이터를 한 번에 조회할 일이 없는 것 같아서 일단 pass.
    // 필요하다면 찾거나 배포해서 사용 필요.
    //   blockCreated: ??,
    // },
  },
});
