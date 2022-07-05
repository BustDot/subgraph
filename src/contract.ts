import { BigInt, Bytes } from "@graphprotocol/graph-ts"
import {
  Contract,
  NewEpicNFTMinted,
  Transfer
} from "../generated/Contract/Contract"
import { Square, Item, User } from "../generated/schema"


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
    square.holderNum = square.holderNum.plus(BigInt.fromI32(1));
  }
  
  let items = changetype<string[]>(square.items);
  items.push(event.params.tokenId.toString());
  square.items = items;
  square.save();
}

export function handleTransfer(event: Transfer): void {
  let square = Square.load("0");
  if(square === null) {
    square = new Square("0");
    square.holderNum = new BigInt(0);
    square.items = new Array<string>(0);
    square.holderAddress = new Array<Bytes>(0);
  }

  let userTo = User.load(event.params.to.toHexString());
  if(userTo === null) {
    userTo = new User(event.params.to.toHexString());
    userTo.num = new BigInt(0);
  }

  let userFrom = User.load(event.params.from.toHexString());
  if(userFrom === null) {
    userFrom = new User(event.params.from.toHexString());
    userFrom.num = new BigInt(0);
  }

  userTo.num = userTo.num.plus(BigInt.fromI32(1));
  userFrom.num = userFrom.num.minus(BigInt.fromI32(1));
  

  if(userTo.num.gt(BigInt.fromI32(0))) {
    if(userFrom.num.gt(BigInt.fromI32(0))) {
      square.holderNum = square.holderNum.plus(BigInt.fromI32(1));
    }
  }
    
  if(userTo.num.gt(BigInt.fromI32(1))) {
    if(userFrom.num.equals(BigInt.fromI32(0))) {
      square.holderNum = square.holderNum.minus(BigInt.fromI32(1));
    }
  }

  userFrom.save();
  userTo.save();
  square.save();
}


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
