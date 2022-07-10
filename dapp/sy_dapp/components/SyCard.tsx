import { FC } from "react";
import { Box, Flex, Image, Text } from "@chakra-ui/react";
import { SyTokenMetaData } from "../interfaces";

interface SyCardProps {
  metadataURI: SyTokenMetaData | undefined;
}

const SyCard: FC<SyCardProps> = ({metadataURI}) => {

  return (
    <Flex justifyContent="center">
      <Box w={200}>
        <Image src={metadataURI?.image} fallbackSrc="https://via.placeholder.com/200" />
        <Text>{metadataURI?.name}</Text>
        <Text>{metadataURI?.description}</Text>
      </Box>
    </Flex>
  )
}

export default SyCard;