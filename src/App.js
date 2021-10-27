import React, { useEffect, useState } from "react";
import "./App.css";
import web3 from "./web3";

import EN_STRINGS from "./strings";
import { fetchAccounts, fetchBalance } from "./services/metamask.service";
import {
  enterLottery,
  fetchManager,
  fetchPlayers,
  pickWinner,
} from "./services/lottery.service";

const ETHER = "ether";

function App() {
  const [manager, setManager] = useState("");
  const [players, setPlayers] = useState([]);
  const [balance, setBalance] = useState("");
  const [accounts, setAccounts] = useState([]);
  const [currentAccount, setCurrentAccount] = useState("");

  const [amountToEnter, setAmountToEnter] = useState("0");

  const [message, setMessage] = useState("");

  const clearMessage = () =>
    setTimeout(() => {
      setMessage("");
    }, 3000);

  const onValueChange = (event) => {
    setAmountToEnter(event.target.value);
  };

  const onEnter = async (event) => {
    event.preventDefault();

    try {
      setMessage(EN_STRINGS.WAITING_TRANSACTION);
      await enterLottery(
        currentAccount,
        web3.utils.toWei(amountToEnter, ETHER),
      );
      setMessage(EN_STRINGS.SUCCESS_ON_ENTER);
    } catch (err) {
      setMessage(EN_STRINGS.ERROR_TRANSACTION, err.message);
    } finally {
      clearMessage();
    }
  };

  const onPickAWinner = async (event) => {
    event.preventDefault();

    try {
      setMessage(EN_STRINGS.WAITING_TRANSACTION);
      const transactionHash = await pickWinner(currentAccount);
      setMessage(
        EN_STRINGS.SUCCESS_PICK_WINNER(
          transactionHash,
          web3.utils.fromWei(balance, ETHER),
        ),
      );
    } catch (err) {
      setMessage(EN_STRINGS.ERROR_TRANSACTION, err.message);
    } finally {
      clearMessage();
    }
  };

  useEffect(() => {
    fetchManager().then(setManager);
    fetchPlayers().then(setPlayers);
    fetchBalance().then(setBalance);
    fetchAccounts().then(setAccounts);
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", () => {
        fetchAccounts().then(setAccounts);
      });
    }
  }, [message]);

  useEffect(() => {
    setCurrentAccount(accounts[0]);
  }, [accounts]);

  return (
    <div className="App">
      <h2>Lottery Contract</h2>
      <p>
        This contract is managed by:{" "}
        {manager === currentAccount ? "you" : manager}
      </p>
      <p>Current account: {currentAccount}</p>
      <p>
        There are currently {players.length} players competing to win{" "}
        {web3.utils.fromWei(balance, ETHER)} eth
      </p>
      <hr />
      {!players.includes(currentAccount) ? (
        <form onSubmit={onEnter}>
          <h4>Want to try your luck?</h4>
          <div>
            <label>Amount of ether to enter</label>
            <br />
            <input
              type="number"
              value={amountToEnter}
              onChange={onValueChange}
            />
          </div>
          <button disabled={message !== ""}>Enter</button>
        </form>
      ) : (
        <h1>You're already participating! Good luck</h1>
      )}
      <hr />

      {currentAccount === manager && players.length > 0 && (
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
