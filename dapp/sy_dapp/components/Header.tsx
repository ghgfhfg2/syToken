import { Box, Button, Flex, Text } from "@chakra-ui/react";
import Link from "next/link";
import {FC} from "react";
import { useAccount } from "../hooks";

const Header: FC = () => {
  const {account} = useAccount();
  return(
    <Flex position="fixed" justifyContent="space-between" bg="#111" w="full" px={3} py={3}>
      <Box>
        <Link href="/">
          <Button size="sm" mr={2}>Home</Button>
        </Link>
        <Link href="/my-sy-token" mr={2}>
          <Button size="sm">MySyToken</Button>
        </Link>
      </Box>
      <Box>
        <Text color="#fff">
          {account ? `${account.substr(0,4)}...${account.substr(account.length-4,account.length)}` : "Install Kaikas Wallet"}
        </Text>
      </Box>
    </Flex>
  )
}

export default Header;