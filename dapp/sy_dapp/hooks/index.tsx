import Caver, { Contract } from 'caver-js';
import { useState, useEffect } from 'react';
import {MINT_SY_TOKEN_ABI,SALE_SY_TOKEN_ABI,MINT_SY_TOKEN_ADDRESS,SALE_SY_TOKEN_ADDRESS} from "../caverConfig";
import axios from 'axios'
import { SyTokenMetaData } from '../interfaces';

export const useAccount = () => {
  const [account, setAccount] = useState<string>("");

  const getAccount = async () => {
    try {
      const accounts = await window.klaytn.enable();
      setAccount(accounts[0]);
    } catch (error) {
      console.error(error)
    }
  };
  useEffect(() => {
    if(window.klaytn){
      getAccount()
    }
  }, [])
  
  return { account };
};

export const useCaver = () => {
  const [caver,setCaver] = useState<Caver | undefined>(undefined);
  const [mintSyTokenContract, setMintSyTokenContract] = useState<Contract | undefined>(undefined);
  const [saleSyTokenContract, setSaleSyTokenContract] = useState<Contract | undefined>(undefined);

  useEffect(() => {
     if(window.klaytn){
      setCaver(new Caver(window.klaytn));
     }
  }, [])
  
  useEffect(() => {
    if(!caver) return;
    
    setMintSyTokenContract(
      caver.contract.create(MINT_SY_TOKEN_ABI,MINT_SY_TOKEN_ADDRESS)
    );
    setSaleSyTokenContract(
      caver.contract.create(SALE_SY_TOKEN_ABI,SALE_SY_TOKEN_ADDRESS)
    );
    
  }, [caver])
  
  return {caver, mintSyTokenContract, saleSyTokenContract}

}

export const useMetadata = () => {
  const [metadataURI, setMetadataURI] = useState<SyTokenMetaData | undefined>(undefined);

  const getMetadata = async (syTokenRank:string,syTokenType:string) => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_METADATA_URI}/${syTokenRank}/${syTokenType}.json`);
      setMetadataURI(response.data)
    } catch (error) {
      console.error(error)
    }
  }
  return {metadataURI,getMetadata}
}