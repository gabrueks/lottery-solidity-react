import React, { useEffect, useState } from "react";
import "./App.css";
import lottery from "./lottery";
import web3 from "./web3";

function App() {
  const [manager, setManager] = useState("");
  const [players, setPlayers] = useState([]);
  const [balance, setBalance] = useState("");
  const [accounts, setAccounts] = useState([]);

  const [amountToEnter, setAmountToEnter] = useState("0");

  const [message, setMessage] = useState("");

  const clearMessage = () =>
    setTimeout(() => {
      setMessage("");
    }, 3000);

  const fetchManager = async () => {
    const contractManager = await lottery.methods.manager().call();
    setManager(contractManager);
  };

  const fetchPlayers = async () => {
    const contractPlayers = await lottery.methods.getPlayers().call();
    setPlayers(contractPlayers);
  };

  const fetchBalance = async () => {
    const contractBalance = await web3.eth.getBalance(lottery.options.address);
    setBalance(contractBalance);
  };

  const fetchAccounts = async () => {
    const walletAccounts = await web3.eth.getAccounts();
    setAccounts(walletAccounts);
  };

  const onValueChange = (event) => {
    setAmountToEnter(event.target.value);
  };

  const onEnter = async (event) => {
    event.preventDefault();

    try {
      setMessage("Waiting on transaction success...");
      await lottery.methods.enter().send({
        from: accounts[0],
        value: web3.utils.toWei(amountToEnter, "ether"),
      });
      setMessage("You have been entered!");
    } catch (err) {
      setMessage("Error on transaction: ", err.message);
    } finally {
      clearMessage();
    }
  };

  const onPickAWinner = async (event) => {
    event.preventDefault();

    try {
      setMessage("Waiting on transaction success...");
      const { transactionHash } = await lottery.methods.pickWinner().send({
        from: accounts[0],
      });
      setMessage(
        `The transaction hash for the winner is: ${transactionHash} Prize: ${web3.utils.fromWei(
          balance,
          "ether",
        )} eth`,
      );
    } catch (err) {
      setMessage("Error on transaction: ", err.message);
    } finally {
      clearMessage();
    }
  };

  useEffect(() => {
    fetchManager();
    fetchPlayers();
    fetchBalance();
    fetchAccounts();
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", () => {
        fetchAccounts();
      });
    }
  }, [message]);
  return (
    <div className="App">
      <h2>Lottery Contract</h2>
      <p>This contract is managed by: {manager}</p>
      <p>
        There are currently {players.length} players competing to win{" "}
        {web3.utils.fromWei(balance, "ether")} eth
      </p>
      <hr />
      {!players.includes(accounts[0]) ? (
        <form onSubmit={onEnter}>
          <h4>Want to try your luck?</h4>
          <div>
            <label>Amount of ether to enter</label>
            <br />
            <input value={amountToEnter} onChange={onValueChange} />
          </div>
          <button disabled={message !== ""}>Enter</button>
        </form>
      ) : (
        <h1>You're already participating! Good luck</h1>
      )}
      <hr />

      {accounts[0] === manager && players.length > 0 && (
        <div>
          <h4>Ready to pick a winner?</h4>
          <button disabled={message !== ""} onClick={onPickAWinner}>
            Pick a winner!
          </button>
        </div>
      )}
      <h1>{message}</h1>
    </div>
  );
}

export default App;
