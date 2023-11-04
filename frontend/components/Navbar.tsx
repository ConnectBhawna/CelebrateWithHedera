import { Container, Flex, Text , Button , useColorMode} from "@chakra-ui/react";
import { ConnectWallet, useAddress } from "@thirdweb-dev/react";
import Link from "next/link";
import { FaRegMoon, FaRegSun } from 'react-icons/fa';

export default function Navbar() {
    const address = useAddress();
    const { colorMode, toggleColorMode } = useColorMode();
    return (
        <Container maxW={"1440px"} py={4}>
            <Flex flexDirection={"row"} justifyContent={"space-between"} alignItems={"center"}>
                <Link href={"/"}>
                    <Text fontWeight={"black"}>Celebrate With Hedera</Text>
                </Link>
                {address && (
                    <Flex flexDirection={"row"}>
                        <Link href={"/transfer"}>
                            <Text mr={8}>Transfer</Text>
                        </Link>
                        <Link href={"/shedule"}>
                            <Text mr={8}>Schedule Transaction</Text>
                        </Link>
                        <Link href={`/profile/${address}`}>
                            <Text>My Account</Text>
                        </Link>
                    </Flex>
                )}
            <div className='flex gap-4'>
               <Button
                onClick={toggleColorMode}
                >
                {colorMode === 'light' ? <FaRegMoon /> : <FaRegSun />}
                </Button>
            </div>
                <ConnectWallet/>
            </Flex>
        </Container>
    )
}