import { useState } from "react";
import { ethers } from "ethers";
import React from 'react';
import Web3 from 'web3';
import Moralis from 'moralis';
import Spinner from 'react-bootstrap/Spinner'
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { formatEther } from "@ethersproject/units";
import { ToastContainer, toast } from 'react-toastify';
import * as yup from "yup";
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
  const [disabled, setDisabled] = useState(false)
  const web3 = Moralis.enable();
  // const contract = new web3.eth.Contract(contractAbi, contractAddress);
  // const [errorAddress, setErrrAddress] = useState(false);
  const SignupSchema = yup.object().shape({
    addrtoken: yup.string().test(
      'Account', 'Account not exist',
      async (value) => {
        let result = Web3.utils.isAddress(value)
        if (result === false) {
          return false
        } else {
          return true
        }
      }
    ),
    contractaddr:  yup.string().test(
      'Account', 'Account not exist',
      async (value) => {
        let result = Web3.utils.isAddress(value)
        if (result === false) {
          return false
        } else {
          return true
        }
      }
    ),
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
    setError();
    // await startPayment({
    //   setError,
    //   setTxs,
    //   ether: data.ether.toString(),
    //   addr: data.addr
    // })
  };
  const onSubmitToken = async (data) => {
    try {
      setDisabled(true)
      const options = {
        type: "erc20",
        amount: Moralis.Units.Token(data.tokenpay.toString(), "18"),
        receiver: data.addrtoken,
        contractAddress: data.contractaddr
      }
      let result = await Moralis.transfer(options)
      result && setDisabled(false)
      result && toast.success("Transaction success")
      console.log("ket qua: ", result);
    } catch (err) {
      toast.error(err.message);
      setDisabled(false)
    }
  };
  return (
    <>
      {/* <form action="" onSubmit={handleSubmit(onSubmit)} className="FormContainer">
        <h3>Send ETH payment</h3>
        <div className="InputContainer">
          <input type="text" name="addr" placeholder="Recipient Address" {...register("addr")} />
          {errors.addr && <p style={{ color: "red", textAlign: "left" }} >{errors.addr.message}</p>}
          <input type="text" name="ether" placeholder="Amount in ETH" {...register("ether")} />
          {errors.ether && <p style={{ color: "red", textAlign: "left" }} >{errors.ether.message}</p>}
        </div>
        <div className="PayBtnContainer">
          <button className="PayBtn" >Pay Now</button>
        </div>
        <ToastContainer />
      </form> */}
      <form action="" onSubmit={handleSubmit(onSubmitToken)} className="FormContainer">
        <h3>Send ERC20 Tokens payment</h3>
        <div className="InputContainer">
          <input type="text" name="addrtoken" placeholder="Recipient Address" {...register("addrtoken")} required />
          {errors.addrtoken && <p style={{ color: "red", textAlign: "left" }} >{errors.addrtoken.message}</p>}
          <input type="text" name="contractaddr" placeholder="Contract Address" {...register("contractaddr")} required />
          {errors.contractaddr && <p style={{ color: "red", textAlign: "left" }} >{errors.contractaddr.message}</p>}
          <input type="text" name="tokenpay" placeholder="Amount in Token" {...register("tokenpay")} required />
          {errors.tokenpay && <p style={{ color: "red", textAlign: "left" }} >{errors.tokenpay.message}</p>}
        </div>
        <div className="PayBtnContainer">
          {!disabled ? <button className="PayBtn" >Pay Now</button> : <Spinner animation="border" role="status">
  <span className="visually-hidden">Loading...</span>
</Spinner>}
        </div>
        <ToastContainer />
      </form>
    </>
  )
}