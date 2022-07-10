import { Button, Flex, Text, useDisclosure } from '@chakra-ui/react'
import type { NextPage } from 'next'
import { useEffect, useState } from 'react'
import MintingModal from '../components/MintingMotal'
import { useCaver } from '../hooks'


const Home: NextPage = () => {
  const [reaminSyTokens, setReaminSyTokens] = useState<number>(0);
  const [syTokenCount, setSyTokenCount] = useState<string[][] | undefined>(undefined);
  const {mintSyTokenContract} = useCaver();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const getRemainSyTokens = async () => {
    try{
      if(!mintSyTokenContract) return;
      const response = await mintSyTokenContract.methods.totalSupply().call();
      setReaminSyTokens(1000 - parseInt(response, 10));
    }catch(error){
      console.error(error);
    }
  }

  const getSyTokenCount = async () => {
    try{
      if(!mintSyTokenContract) return;
      const response = await mintSyTokenContract.methods.getSyTokenCount().call();
      setSyTokenCount(response) //랭크/타입별 개수

    }catch(error){
      console.error(error);
    }
  }

  useEffect(() => {
    getSyTokenCount();
    getRemainSyTokens();
  }, [mintSyTokenContract])
  

  return (
    <>
    <Flex minH="100vh" justifyContent="center" flexDirection="column" alignItems="center">
      {reaminSyTokens && <Text mb={4}>Remaining Sy : {reaminSyTokens}</Text>}
      <Button colorScheme="blue" onClick={onOpen}>Minting</Button>
    </Flex>
    <MintingModal isOpen={isOpen} onClose={onClose} getRemainSyTokens={getRemainSyTokens} />
    </>
  )
}

export default Home
