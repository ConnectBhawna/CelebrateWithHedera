import type { NextPage } from "next";
import { Box, Button, Container, Flex, Heading, SimpleGrid, Stack, Text } from "@chakra-ui/react";
import Link from "next/link";

const Home: NextPage = () => {
  return (
    <Container maxW={"1440px"}>
      <Flex h={"75vh"} px={20} borderRadius={20} >
        <Flex flexDirection={"row"}>
          <Flex flexDirection={"column"} justifyContent={"center"} w={"60%"}>
            <Stack spacing={4}>
              <Heading fontSize={"xl"}>Gift</Heading>
              <Heading fontSize={"6xl"}>
                Send HBAR tokens with wishes to your friends and family with ease.
              </Heading>
              <Text fontSize={"xl"}>
                Select from a selection of tokens to transfer to your friends and family. Write a message to go along with your token transfer. Connect your wallet to get started now!
              </Text>
            </Stack>
          </Flex>
        </Flex>
</Flex>
    </Container>
  );
};

export default Home;
