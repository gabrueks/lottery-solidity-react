import lottery from "../lottery";

export const fetchManager = () => {
  return lottery.methods.manager().call();
};

export const fetchPlayers = () => {
  return lottery.methods.getPlayers().call();
};

export const enterLottery = (account, value) => {
  return lottery.methods.enter().send({
    from: account,
    value: value,
  });
};

export const pickWinner = async (account) => {
  const { transactionHash } = await lottery.methods.pickWinner().send({
    from: account,
  });
  return transactionHash;
};
