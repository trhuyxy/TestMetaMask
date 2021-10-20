import { useState } from "react";
import { ethers } from "ethers";
import React from 'react';
import Web3 from 'web3';
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { formatEther } from "@ethersproject/units";
import { ToastContainer, toast } from 'react-toastify';
import Spinner from 'react-bootstrap/Spinner'
import * as yup from "yup";
import 'react-toastify/dist/ReactToastify.css';
const startPayment = async ({ ether, addr, setDisabled }) => {
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
    // setTxs([tx]);
    tx && toast.success("Transaction success")
    tx && setDisabled(false)
  } catch (err) {
    // setError(err.message);
    setDisabled(false);
    toast.error(err.message);
  }
};

export default function App({ account, etherBalance }) {
  // const [error, setError] = useState();
  // const [txs, setTxs] = useState([]);
  const [disabled, setDisabled] = useState(false)
  const [errorAddress, setErrrAddress] = useState(false);
  const SignupSchema = yup.object().shape({
    addr: yup.string(),
    ether: yup.number().typeError('Amount must be a number').positive('Must be a positive number').lessThan(
      etherBalance && parseFloat(formatEther(etherBalance)).toFixed(3),
      `Not enough ETH`)
  });
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(SignupSchema)
  });
  const onSubmit = async (data) => {
    // const data = new FormData(e.target);
    // setError();
    setDisabled(true)
    // console.log(JSON.stringify(data));
    let result = Web3.utils.isAddress(data.addr)
    result ?
      await startPayment({
        // setError,
        // setTxs,
        setDisabled,
        ether: data.ether.toString(),
        addr: data.addr
      }) : setErrrAddress(true)
  };
  return (
    <form action="" onSubmit={handleSubmit(onSubmit)} className="FormContainer">
      <h3>Send ETH payment</h3>
      <div className="InputContainer">
        <input type="text" name="addr" placeholder="Recipient Address" {...register("addr")} onClick={() => setErrrAddress(false)} required />
        {errorAddress ?
          <div className="ErrorEther">
            <p>Address does not exist</p>
          </div> : <></>
        }
        <input type="text" name="ether" placeholder="Amount in ETH" {...register("ether")} required />
        {errors.ether && <p style={{ color: "red", textAlign: "left" }} >{errors.ether.message}</p>}
      </div>
      <div className="PayBtnContainer">
        {!disabled ? <button className="PayBtn" >Pay Now</button> : <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>}
      </div>
      <ToastContainer />
    </form>
  )
}