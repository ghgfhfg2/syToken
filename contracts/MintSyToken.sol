// SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MintSyToken is ERC721Enumerable, Ownable {
  uint constant public MAX_TOKEN_COUNT = 1000;
  uint constant public TOKEN_RANK_LENGTH = 4;
  uint constant public TOKEN_TYPE_LENGTH = 4;

  string public metadataURI;
  //10^18 Peb = 1Klay
  uint public SyTokenPrice = 1000000000000000000;

  uint[TOKEN_RANK_LENGTH][TOKEN_TYPE_LENGTH] public syTokenCount;

  constructor(string memory _name, string memory _symbol, string memory _metadataURI ) ERC721(_name,_symbol) {
    metadataURI = _metadataURI;
  }

  struct SyTokenData {
    uint SyTokenRank;
    uint SyTokenType;
  }

  mapping(uint => SyTokenData) public syTokenData;

  function tokenURI(uint _tokenId) override public view returns (string memory) {
    string memory syTokenRank = Strings.toString(syTokenData[_tokenId].SyTokenRank);
    string memory syTokenType = Strings.toString(syTokenData[_tokenId].SyTokenType);
    return string(abi.encodePacked(metadataURI, '/', syTokenRank , '/', syTokenType, '.json'));
  }
  
  function mintSyToken() public payable {
    require(totalSupply() < MAX_TOKEN_COUNT, "No more minting is possible.");
    require(SyTokenPrice <= msg.value, "Not enough Klay.");
    uint tokenId = totalSupply() + 1;
    SyTokenData memory randomTokenData = randomGenerator(msg.sender);
    syTokenData[tokenId] = SyTokenData(randomTokenData.SyTokenRank,randomTokenData.SyTokenType);

    syTokenCount[randomTokenData.SyTokenRank-1][randomTokenData.SyTokenType-1] += 1;

    payable(owner()).transfer(msg.value);

    _mint(msg.sender, tokenId);
  }


  function getSyTokenCount () public view returns (uint[TOKEN_RANK_LENGTH][TOKEN_TYPE_LENGTH] memory) {
    return syTokenCount;
  }

  function getSyTokenRank (uint _tokenId) public view returns (uint) {
    return syTokenData[_tokenId].SyTokenRank;
  }

  function getSyTokenType (uint _tokenId) public view returns (uint) {
    return syTokenData[_tokenId].SyTokenType;
  }


  function randomGenerator(address _msgSender) public view returns(SyTokenData memory) {
    uint ranCnt = 0;
    uint randomRank = uint(keccak256(abi.encodePacked(block.timestamp,_msgSender,ranCnt))) % 5 + 1;
    ranCnt++;
    uint randomType = uint(keccak256(abi.encodePacked(block.timestamp,_msgSender,ranCnt))) % 5 + 1;
    SyTokenData memory randomTokenData;
    randomTokenData.SyTokenRank = randomRank;
    randomTokenData.SyTokenType = randomType;
    return randomTokenData;
  }

  struct TestRan {
    uint now;
    uint random;
  }

  function testRandom(address _msgSender) public view returns(TestRan memory) {
    uint ranCnt = 0;
    uint randomRank = uint(block.timestamp);
    ranCnt++;
    uint random = uint(keccak256(abi.encodePacked(block.timestamp,_msgSender,ranCnt)));
    TestRan memory randomTokenData;
    randomTokenData.now = randomRank;
    randomTokenData.random = random;
    return randomTokenData;
  }

}