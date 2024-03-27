pragma solidity ^0.8.21;
// License
// SPDX-License-Identifier: MIT

contract DataContract {

  address public deployer; 
  uint256 public price; 
  string private cid; 
  bool public active; 
  uint256 public totalPurchases;

  mapping(address => bool) public hasAccess;

  constructor(string memory _cid, uint256 _price) {
    deployer = msg.sender;
    cid = _cid;
    price = _price;
    active = true;
    totalPurchases = 0;
  }

  event PurchaseEvent(address indexed _buyer, uint256 _price);

  function purchaseAccess() public payable returns (string memory) {
    require(active, "Contract was marked inactive by creator");
    if (price != 0 && !hasAccess[msg.sender]) {
      require(msg.value == price, "Incorrect price, please call contract with nonzero value");
      payable(deployer).transfer(msg.value);
      emit PurchaseEvent(msg.sender, price);
      totalPurchases += 1;
    }
    hasAccess[msg.sender] = true;
    return cid;
  }

  function getMetadata() public view returns (string memory, uint256, bool, uint256) {
    return (hasAccess[msg.sender] ? cid : "", price, active, totalPurchases);
  }

  function changePrice(uint256 _newPrice) public {
    require(msg.sender == deployer);
    price = _newPrice;
  }

  function toggleActive() public {
    require(msg.sender == deployer);
    active = !active;
  }
}
