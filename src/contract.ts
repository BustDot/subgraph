import { BigInt, Bytes } from "@graphprotocol/graph-ts"
import {
  Contract,
  NewEpicNFTMinted,
  Transfer
} from "../generated/Contract/Contract"
import { Square, Item } from "../generated/schema"


export function handleNewEpicNFTMinted(event: NewEpicNFTMinted): void {
  let square = Square.load("0");
  if(square === null) {
    square = new Square("0");
    square.holderNum = new BigInt(0);
    square.items = new Array<string>(0);
    square.holderAddress = new Array<Bytes>(0);
  }
  
  let item = Item.load(event.params.tokenId.toString());
  if(item === null) {
  item = new Item(event.params.tokenId.toString());
  item.owner = event.params.sender;
  }
  
  item.save();

  let holderAddress = changetype<Bytes[]>(square.holderAddress);
  if(holderAddress.includes(event.params.sender)===false) {
    holderAddress.push(event.params.sender);
    square.holderAddress = holderAddress;
    square.holderNum = new BigInt(holderAddress.length);
  }
  
  let items = changetype<string[]>(square.items);
  items.push(event.params.tokenId.toString());
  square.items = items;
  square.save();
}

export function handleTransfer(event: Transfer): void {}


// export function handleNewEpicNFTMinted(event: NewEpicNFTMinted): void {
//   let minted = Square.load(event.transaction.hash.toHex());
//   if(minted === null) {
//     minted = new Square(event.transaction.hash.toHex());
//   }
  
//   minted.itemId = event.params.tokenId;
//   minted.owner = event.params.sender;
//   minted.save();
// }

// export function handleTransfer(event: Transfer): void {}
