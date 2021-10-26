import lottery from "../lottery";

export const fetchManager = () => {
  return lottery.methods.manager().call();
};

export const fetchPlayers = () => {
  return lottery.methods.getPlayers().call();
};
