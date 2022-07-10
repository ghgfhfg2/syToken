// SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

import "./MintSyToken.sol";

contract SaleSyToken {
  MintSyToken public mintSyToken;

  constructor(address _mintSyToken) {
    mintSyToken = MintSyToken(_mintSyToken);
  }

  struct SyTokenData {
    uint tokenId;
    uint SyTokenRank;
    uint SyTokenType;
    uint tokenPrice;
  }

  mapping(uint => uint) public tokenPrices;
  uint[] public onSaleTokens;

  function setForSaleSyToken(uint _tokenId, uint _price) public {
    address tokenOwner = mintSyToken.ownerOf(_tokenId);


    require(tokenOwner == msg.sender, "Caller is not SyToken owner.");
    require(_price > 0, "Price is zero or lower.");
    require(tokenPrices[_tokenId] == 0, "This SyToken is already on sale.");
    require(mintSyToken.isApprovedForAll(msg.sender,address(this)), "SyToken owner did not approve token.");

    tokenPrices[_tokenId] = _price;
    onSaleTokens.push(_tokenId);
  }

  function purchaseSyToken(uint _tokenId) public payable {
    address tokenOwner = mintSyToken.ownerOf(_tokenId);

    require(tokenOwner != msg.sender, "Caller is SyToken owner.");
    require(tokenPrices[_tokenId] > 0, "This SyToken not sale.");
    require(tokenPrices[_tokenId] <= msg.value, "Caller sent lower than price.");

    payable(tokenOwner).transfer(msg.value);
    
    mintSyToken.safeTransferFrom(tokenOwner, msg.sender, _tokenId);

    tokenPrices[_tokenId] = 0;
    popOnSaleToken(_tokenId);
  }

  function popOnSaleToken(uint _tokenId) private {
    for(uint i=0; i<onSaleTokens.length; i++) {
      if(onSaleTokens[i] == _tokenId){
        onSaleTokens[i] = onSaleTokens[onSaleTokens.length-1];
        onSaleTokens.pop();
      }
      
    }
  }

  function getSyTokens(address _tokenOwner) public view returns(SyTokenData[] memory) {

    uint balanceLength = mintSyToken.balanceOf(_tokenOwner);
    require(balanceLength > 0, "Token owner did not have token.");

    SyTokenData[] memory syTokens = new SyTokenData[](balanceLength);

    for (uint i=0; i<balanceLength; i++) {
      uint tokenId = mintSyToken.tokenOfOwnerByIndex(_tokenOwner, i);
      
      (uint syTokenRank, uint syTokenType, uint tokenPrice) = getSyTokenInfo(tokenId);

      syTokens[i] = SyTokenData(tokenId,syTokenRank,syTokenType,tokenPrice);
    }
    return syTokens;
  }

  function getSaleSyTokens() public view returns(SyTokenData[] memory) {
    require(onSaleTokens.length > 0, "Not exist on sale token.");
    SyTokenData[] memory syTokens = new SyTokenData[](onSaleTokens.length);
    for (uint i=0; i<onSaleTokens.length; i++) {
      uint tokenId = onSaleTokens[i];

      (uint syTokenRank, uint syTokenType, uint tokenPrice) = getSyTokenInfo(tokenId);

      syTokens[i] = SyTokenData(tokenId,syTokenRank,syTokenType,tokenPrice);
    }
    return syTokens;
  }

  function getLatestMintedSyToken(address _tokenOwner) public view returns(SyTokenData memory) {
    uint balanceLength = mintSyToken.balanceOf(_tokenOwner);
    uint tokenId = mintSyToken.tokenOfOwnerByIndex(_tokenOwner, balanceLength-1);
    (uint syTokenRank, uint syTokenType, uint tokenPrice) = getSyTokenInfo(tokenId);
    return SyTokenData(tokenId, syTokenRank,syTokenType,tokenPrice);
  }

  function getSyTokenInfo(uint _tokenId) public view returns(uint, uint, uint) {
    uint syTokenRank = mintSyToken.getSyTokenRank(_tokenId);
    uint syTokenType = mintSyToken.getSyTokenType(_tokenId);
    uint tokenPrice = tokenPrices[_tokenId];
    return (syTokenRank,syTokenType,tokenPrice);
  }

}
