import type { AppProps } from "next/app";
import { ThirdwebProvider } from "@thirdweb-dev/react";
import { ChakraProvider } from "@chakra-ui/react";
import { AvalancheFuji , HederaLocalnet , HederaTestnet} from "@thirdweb-dev/chains";

function MyApp({ Component, pageProps }: AppProps) {

  return (
    <ThirdwebProvider 
        activeChain={AvalancheFuji}
        supportedChains={[HederaTestnet , HederaLocalnet]}
        clientId="65e4278f59fd629424e381d06900a076" >
      <ChakraProvider>
        <Component {...pageProps} />
      </ChakraProvider>
    </ThirdwebProvider>
  );
}

export default MyApp;
