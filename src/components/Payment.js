import { useState } from "react";
import { ethers } from "ethers";
import TxList from "./TxList";
import React from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const startPayment = async ({ setError, setTxs, ether, addr }) => {
  try {
    if (!window.ethereum)
      throw new Error("No crypto wallet found. Please install it.");

    await window.ethereum.send("eth_requestAccounts");
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    ethers.utils.getAddress(addr);
    const tx = await signer.sendTransaction({
      to: addr,
      value: ethers.utils.parseEther(ether)
    });
    // console.log({ ether, addr });
    console.log("tx", tx);
    setTxs([tx]);
  } catch (err) {
    setError(err.message);
    toast.error(err.message);
  }
};

export default function App() {
  const [error, setError] = useState();
  const [txs, setTxs] = useState([]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    console.log(error);
    setError();
    await startPayment({
      setError,
      setTxs,
      ether: data.get("ether"),
      addr: data.get("addr")
    });
  };
  return (
    <form action="" onSubmit={handleSubmit} className="FormContainer">
      <h3>Send ETH payment</h3>
      <div className="InputContainer">
        <input type="text" name="addr" placeholder="Recipient Address" />
        <input type="text" name="ether" placeholder="Amount in ETH" />
      </div>
      <div className="PayBtn">
        <button >Pay Now</button>
      </div>
      <ToastContainer />
      <TxList txs={txs} />
    </form>
  )
}