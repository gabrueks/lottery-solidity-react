const EN_STRINGS = {
  WAITING_TRANSACTION: "Waiting on transaction success...",
  SUCCESS_ON_ENTER: "You have been entered!",
  ERROR_TRANSACTION: "Error on transaction: ",
  SUCCESS_PICK_WINNER: (transactionHash, prize) =>
    `The transaction hash for the winner is: ${transactionHash} Prize: ${prize} eth`,
};

export default EN_STRINGS;
