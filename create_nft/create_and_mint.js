import { Client, AccountId, PrivateKey, TokenCreateTransaction, TokenSupplyType, TokenMintTransaction, TokenAssociateTransaction, TransferTransaction, AccountBalanceQuery, Hbar, TokenId, TokenType, TokenInfoQuery } from "@hashgraph/sdk";
//Create the NFT


async function createNFT() {

  const MY_ACCOUNT_ID = "0.0.5817770"
  const MY_PRIVATE_KEY = "3030020100300706052b8104000a04220420c4a61b99bf4ed6a923c38b66268a68873195640d7a10e59c8c2fc5ed0e21a831"
  //Grab your Hedera testnet account ID and private key from your .env file
  const myAccountId = MY_ACCOUNT_ID;
  const myPrivateKey = MY_PRIVATE_KEY;

  // If we weren't able to grab it, we should throw a new error
  if (!myAccountId || !myPrivateKey) {
    throw new Error(
      "Environment variables MY_ACCOUNT_ID and MY_PRIVATE_KEY must be present"
    );
  }
  
  //Create your Hedera Testnet client
  const client = Client.forTestnet();

  //Set your account as the client's operator
  client.setOperator(myAccountId, myPrivateKey);

  //Set the default maximum transaction fee (in Hbar)
  client.setDefaultMaxTransactionFee(new Hbar(100));

  //Set the maximum payment for queries (in Hbar)
  client.setMaxQueryPayment(new Hbar(50));

const nftCreate = await new TokenCreateTransaction()
	.setTokenName("diploma")
	.setTokenSymbol("GRAD")
	.setTokenType(TokenType.NonFungibleUnique)
	.setDecimals(0)
	.setInitialSupply(0)
	.setTreasuryAccountId(myAccountId)
	.setSupplyType(TokenSupplyType.Finite)
	.setMaxSupply(250)
	.setSupplyKey(supplyKey)
	.freezeWith(client);

//Sign the transaction with the treasury key
const nftCreateTxSign = await nftCreate.sign(treasuryKey);

//Submit the transaction to a Hedera network
const nftCreateSubmit = await nftCreateTxSign.execute(client);

//Get the transaction receipt
const nftCreateRx = await nftCreateSubmit.getReceipt(client);

//Get the token ID
const tokenId = nftCreateRx.tokenId;

//Log the token ID
console.log(`- Created NFT with Token ID: ${tokenId} \n`);

// Max transaction fee as a constant
const maxTransactionFee = new Hbar(20);

//IPFS content identifiers for which we will create a NFT
const CID = [
  Buffer.from(
    "ipfs://bafyreiao6ajgsfji6qsgbqwdtjdu5gmul7tv2v3pd6kjgcw5o65b2ogst4/metadata.json"
  ),
  Buffer.from(
    "ipfs://bafyreic463uarchq4mlufp7pvfkfut7zeqsqmn3b2x3jjxwcjqx6b5pk7q/metadata.json"
  ),
  Buffer.from(
    "ipfs://bafyreihhja55q6h2rijscl3gra7a3ntiroyglz45z5wlyxdzs6kjh2dinu/metadata.json"
  ),
  Buffer.from(
    "ipfs://bafyreidb23oehkttjbff3gdi4vz7mjijcxjyxadwg32pngod4huozcwphu/metadata.json"
  ),
  Buffer.from(
    "ipfs://bafyreie7ftl6erd5etz5gscfwfiwjmht3b52cevdrf7hjwxx5ddns7zneu/metadata.json"
  )
];
	
// MINT NEW BATCH OF NFTs
const mintTx = new TokenMintTransaction()
	.setTokenId(tokenId)
	.setMetadata(CID) //Batch minting - UP TO 10 NFTs in single tx
	.setMaxTransactionFee(maxTransactionFee)
	.freezeWith(client);

//Sign the transaction with the supply key
const mintTxSign = await mintTx.sign(supplyKey);

//Submit the transaction to a Hedera network
const mintTxSubmit = await mintTxSign.execute(client);

//Get the transaction receipt
const mintRx = await mintTxSubmit.getReceipt(client);

//Log the serial number
console.log(`- Created NFT ${tokenId} with serial: ${mintRx.serials[0].low} \n`);


async function executeTransaction(transaction, key) {
    let retries = 0;
    while (retries < MAX_RETRIES) {
      try {
        const txSign = await transaction.sign(key);
        const txSubmit = await txSign.execute(client);
        const txReceipt = await txSubmit.getReceipt(client);
  
        // If the transaction succeeded, return the receipt
        return txReceipt;
      } catch (err) {
        // If the error is BUSY, retry the transaction
        if (err.toString().includes('BUSY')) {
          retries++;
          console.log(`Retry attempt: ${retries}`);
        } else {
          // If the error is not BUSY, throw the error
          throw err;
        }
      }
    }
    throw new Error(`Transaction failed after ${MAX_RETRIES} attempts`);
  }


//Create the associate transaction and sign with Alice's key 
const associateAliceTx = await new TokenAssociateTransaction()
	.setAccountId(aliceId)
	.setTokenIds([tokenId])
	.freezeWith(client)
	.sign(aliceKey);

//Submit the transaction to a Hedera network
const associateAliceTxSubmit = await associateAliceTx.execute(client);

//Get the transaction receipt
const associateAliceRx = await associateAliceTxSubmit.getReceipt(client);

//Confirm the transaction was successful
console.log(`- NFT association with Alice's account: ${associateAliceRx.status}\n`);

// Check the balance before the transfer for the treasury account
var balanceCheckTx = await new AccountBalanceQuery().setAccountId(treasuryId).execute(client);
console.log(`- Treasury balance: ${balanceCheckTx.tokens._map.get(tokenId.toString())} NFTs of ID ${tokenId}`);

// Check the balance before the transfer for Alice's account
var balanceCheckTx = await new AccountBalanceQuery().setAccountId(aliceId).execute(client);
console.log(`- Alice's balance: ${balanceCheckTx.tokens._map.get(tokenId.toString())} NFTs of ID ${tokenId}`);

// Transfer the NFT from treasury to Alice
// Sign with the treasury key to authorize the transfer
const tokenTransferTx = await new TransferTransaction()
	.addNftTransfer(tokenId, 1, treasuryId, aliceId)
	.freezeWith(client)
	.sign(treasuryKey);

const tokenTransferSubmit = await tokenTransferTx.execute(client);
const tokenTransferRx = await tokenTransferSubmit.getReceipt(client);

console.log(`\n- NFT transfer from Treasury to Alice: ${tokenTransferRx.status} \n`);

// Check the balance of the treasury account after the transfer
var balanceCheckTx = await new AccountBalanceQuery().setAccountId(treasuryId).execute(client);
console.log(`- Treasury balance: ${balanceCheckTx.tokens._map.get(tokenId.toString())} NFTs of ID ${tokenId}`);

// Check the balance of Alice's account after the transfer
var balanceCheckTx = await new AccountBalanceQuery().setAccountId(aliceId).execute(client);
console.log(`- Alice's balance: ${balanceCheckTx.tokens._map.get(tokenId.toString())} NFTs of ID ${tokenId}`);

}

createNFT();