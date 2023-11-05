// import { ScheduleCreateTransaction } from "@hashgraph/sdk/lib/exports"; "@hashgraph/sdk"

// //Create a schedule transaction
// const transaction = new ScheduleCreateTransaction()
//      .setScheduledTransaction(transactionToSchedule);

// //Sign with the client operator key and submit the transaction to a Hedera network
// const txResponse = await transaction.execute(client);

// //Request the receipt of the transaction
// const receipt = await txResponse.getReceipt(client);

// //Get the schedule ID
// const scheduleId = receipt.scheduleId;
// console.log("The schedule ID of the schedule transaction is " +scheduleId);