import React, { useEffect, useState } from "react";
import "./App.css";
import { utils } from "./web3";

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
      enterLottery(accounts[0], utils.toWei(amountToEnter, ETHER));
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
      const transactionHash = pickWinner(accounts[0]);
      setMessage(
        EN_STRINGS.SUCCESS_PICK_WINNER(
          transactionHash,
          utils.fromWei(balance, ETHER),
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
  return (
    <div className="App">
      <h2>Lottery Contract</h2>
      <p>This contract is managed by: {manager}</p>
      <p>
        There are currently {players.length} players competing to win{" "}
        {utils.fromWei(balance, ETHER)} eth
      </p>
      <hr />
      {!players.includes(accounts[0]) ? (
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
