import { Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, useToast } from '@chakra-ui/react';
import { FC } from 'react';
import { MINT_SY_TOKEN_ADDRESS } from '../caverConfig';
import { useCaver,useAccount, useMetadata } from '../hooks';
import { SyTokenData } from '../interfaces';
import SyCard from './SyCard';

interface MintingModalProps {
  isOpen: boolean;
  onClose: () => void;
  getRemainSyTokens: () => Promise<void>;
}

const MintingModal: FC<MintingModalProps> = ({isOpen, onClose, getRemainSyTokens}) => {
  const toast = useToast()
  const {account} = useAccount();
  const {caver,mintSyTokenContract,saleSyTokenContract} = useCaver();
  const {metadataURI,getMetadata} = useMetadata();


  const onClickMint = async () => {
    try{
      if(!account || !caver || !mintSyTokenContract || !saleSyTokenContract) return;
      const response = await caver.klay.sendTransaction({
        type:"SMART_CONTRACT_EXECUTION",
        from: account,
        to: MINT_SY_TOKEN_ADDRESS,
        value: caver.utils.convertToPeb(1,"KLAY"),
        gas:"3000000",
        data: mintSyTokenContract.methods.mintSyToken().encodeABI(),
      })

      if(response.status){

        const latestMintedSyToken: SyTokenData = await saleSyTokenContract.methods.getLatestMintedSyToken(account).call();
        getMetadata(latestMintedSyToken.SyTokenRank,latestMintedSyToken.SyTokenType)
        onSuccessTost();
        getRemainSyTokens()
      }

    }catch(error){
      console.error(error)
    }
  }

  const onSuccessTost = () => {
    toast({
      position:"top",
      duration: 1000,
      title: `민팅에 성공했습니다.`,
    })
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Minting</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {metadataURI ? (
            <SyCard metadataURI={metadataURI} />
          ):(
            <>
              <Text>민팅을 진행하시겠습니까?</Text>
              <Text>1클레이가 소모됩니다.</Text>
            </>
          )}
        </ModalBody>

        <ModalFooter>
          <Button variant='ghost' colorScheme="blue" onClick={onClickMint}>Minting</Button>
          <Button ml={2} onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>    
  )
};

export default MintingModal;