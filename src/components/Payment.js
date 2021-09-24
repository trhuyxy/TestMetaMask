import { useState } from "react";
import { ethers } from "ethers";
// import TxList from "./TxList";
import React from 'react';
import { formatEther } from "@ethersproject/units";
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
    console.log("tx", tx);
    setTxs([tx]);
    tx && toast.success("Transaction success")
  } catch (err) {
    setError(err.message);
    toast.error(err.message);
  }
};

export default function App({ account, etherBalance }) {
  const [error, setError] = useState();
  const [txs, setTxs] = useState([]);
  const [errorMessageEther, setErrorMessageEther] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    setError();
    await startPayment({
      setError,
      setTxs,
      ether: data.get("ether"),
      addr: data.get("addr")
    })
    data.get("ether") > parseFloat(formatEther(etherBalance)).toFixed(3) ? setErrorMessageEther(true) :
      data.get("ether") < 0 ? setErrorMessageEther(true) :
      setErrorMessageEther(false)
      ;
  };
  return (
    <form action="" onSubmit={handleSubmit} className="FormContainer">
      <h3>Send ETH payment</h3>
      <div className="InputContainer">
        <input type="text" name="addr" placeholder="Recipient Address" onClick={() => setError("")} required />
        {error && error.slice(0, 15) === "invalid address" ?
          <div className="ErrorEther">
            <p>Address does not exist</p>
          </div> : <></>
        }
        <input type="text" name="ether" placeholder="Amount in ETH" onClick={() => setErrorMessageEther(false)} required />
        {errorMessageEther &&
          <div className="ErrorEther">
            <p>ETH Error</p>
          </div>
        }
      </div>
      <div className="PayBtnContainer">
        <button className="PayBtn" >Pay Now</button>
      </div>
      <ToastContainer />
    </form>
  )
}