pragma solidity ^0.8.21;
// License
// SPDX-License-Identifier: MIT

contract DataContract {

  address public deployer; 
  uint256 public price; 
  string private cid; 
  uint256 public totalPurchases;

  mapping(address => bool) public hasAccess;

  constructor(string memory _cid, uint256 _price) {
    deployer = msg.sender;
    cid = _cid;
    price = _price;
    totalPurchases = 0;
  }

  event PurchaseEvent(address indexed _buyer, uint256 _price);

  function purchaseAccess() public payable returns (string memory) {
   
    if (price != 0 && !hasAccess[msg.sender]) {
      require(msg.value >= price, "must pay with price with above or equal");
      payable(deployer).transfer(msg.value);
      emit PurchaseEvent(msg.sender, price);
      totalPurchases += 1;
    }
    hasAccess[msg.sender] = true;
    return cid;
  }

function isActive(address userAddress) public view returns(int256){
    if(hasAccess[userAddress]){
        return 1;
    }
    else {
        return 0;
    }
}

}
