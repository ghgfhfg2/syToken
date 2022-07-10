export interface SyTokenData {
  tokenId: string;
  SyTokenRank: string;
  SyTokenType: string;
 tokenPrice: string; 
}

export interface SyTokenMetaData {
  name:string;
  description: string;
  image:string;
  dna:string;
  edition:number,
  date:number,
  attributes: [
    {0: {trait_type: "background"; value:string}},
    {1: {trait_type: "body"; value:string}},
    {2: {trait_type: "face"; value:string}},
    {3: {trait_type: "hat"; value:string}},
    {4: {trait_type: "mouth"; value:string}},
    {5: {trait_type: "eye"; value:string}},
    {6: {trait_type: "clothes"; value:string}},
    {7: {trait_type: "accessories"; value:string}},
    {8: {trait_type: "right_hand"; value:string}},
    {9: {trait_type: "left_hand"; value:string}},
  ]
}

