import web3 from "../web3";
import lottery from "../lottery";

export const fetchBalance = () => {
  return web3.eth.getBalance(lottery.options.address);
};

export const fetchAccounts = () => {
  return web3.eth.getAccounts();
};
