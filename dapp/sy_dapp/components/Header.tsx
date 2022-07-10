import { Box, Button, Flex } from "@chakra-ui/react";
import Link from "next/link";
import {FC} from "react";

const Header: FC = () => {
  return(
    <Flex>
      <Box>
        <Link href="/">
          <Button size="sm">Home</Button>
        </Link>
        <Link href="/my-sy-token">
          <Button size="sm">MySyToken</Button>
        </Link>
      </Box>
    </Flex>
  )
}

export default Header;