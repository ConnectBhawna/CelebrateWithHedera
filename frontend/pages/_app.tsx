import type { AppProps } from "next/app";
import { ThirdwebProvider } from "@thirdweb-dev/react";
import { ChakraProvider } from "@chakra-ui/react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { AvalancheFuji , HederaLocalnet , HederaTestnet} from "@thirdweb-dev/chains";
import React from "react";

function MyApp({ Component, pageProps }: AppProps) {

  return (
    <ThirdwebProvider 
        activeChain={HederaTestnet}
        supportedChains={[HederaTestnet , HederaLocalnet]}
        clientId="65e4278f59fd629424e381d06900a076" >
      <ChakraProvider>
        <Navbar />
        <Component {...pageProps} />
        <Footer />
      </ChakraProvider>
    </ThirdwebProvider>
  );
}

export default MyApp;
