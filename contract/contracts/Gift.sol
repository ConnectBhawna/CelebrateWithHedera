// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "./IRandom.sol";

interface GiftInterface {
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
    function approve(address spender, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
}


contract Gift {
    address public owner;
    mapping(address => bool) private verifiedTokens;
    address[] public verifiedTokenList;

    struct Transaction {
        address sender;
        address receiver;
        uint256 amount;
        string message;
    }

    event TransactionCompleted(
        address indexed sender,
        address indexed receiver,
        uint256 amount,
        string message
    );

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner {
        require(msg.sender == owner, "GiftTransfer: caller is not the owner");
        _;
    }

    modifier onlyVerifiedToken(address _token) {
        require(verifiedTokens[_token] == true, "GiftTransfer: token is not verified");
        _;
    }

    function addVerifiedToken(address _token) public onlyOwner {
        verifiedTokens[_token] = true;
        verifiedTokenList.push(_token);
    }

    function removeVerifiedToken(address _token) public onlyOwner {
        require(verifiedTokens[_token] == true, "GiftTransfer: token is not in the list");
        verifiedTokens[_token] = false;

        // Removing the token from the verifiedTokenList
        for (uint256 i = 0; i < verifiedTokenList.length; i++) {
            if (verifiedTokenList[i] == _token) {
                verifiedTokenList[i] = verifiedTokenList[verifiedTokenList.length - 1];
                verifiedTokenList.pop();
                break;
            }
        }
    }

    function getVerifiedTokens() public view returns (address[] memory) {
        return verifiedTokenList;
    }

    address constant PRECOMPILE_ADDRESS = address(0x169);
    uint32 randNum;

    function getPseudorandomSeed() external returns (bytes32 randomBytes) {
        (bool success, bytes memory result) = PRECOMPILE_ADDRESS.call(
            abi.encodeWithSelector(IRandom.getPseudorandomSeed.selector));
        require(success);
        randomBytes = abi.decode(result, (bytes32));
    }

    /**
     * Returns a pseudorandom number in the range [lo, hi) using the seed generated from "getPseudorandomSeed"
     */
    function getPseudorandomNumber(uint32 lo, uint32 hi) external returns (uint32) {
        (bool success, bytes memory result) = PRECOMPILE_ADDRESS.call(
            abi.encodeWithSelector(IRandom.getPseudorandomSeed.selector));
        require(success);
        uint32 choice;
        assembly {
            choice := mload(add(result, 0x20))
        }
        randNum = lo + (choice % (hi - lo));
        return randNum;
    }

    function getNumber() public view returns (uint32) {
        return randNum;
    }

    function transfer(GiftInterface token, address to, uint256 amount, string memory message) public onlyVerifiedToken(address(token)) returns (bool) {
        uint256 senderBalance = token.balanceOf(msg.sender);
        require(senderBalance >= amount, "GiftTransfer: insufficient balance");

        bool success = token.transferFrom(msg.sender, to, amount);
        require(success, "GiftTransfer: transfer failed");

        Transaction memory transaction = Transaction({
            sender: msg.sender,
            receiver: to,
            amount: amount,
            message: message
        });

        emit TransactionCompleted(transaction.sender, transaction.receiver, transaction.amount, transaction.message);

        return true;
    }
}