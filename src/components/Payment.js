import { useState, useEffect } from "react";
import { ethers } from "ethers";
import React from 'react';
// import web3 from 'web3';
import Moralis from 'moralis';
import Spinner from 'react-bootstrap/Spinner'
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { formatEther } from "@ethersproject/units";
import { ToastContainer, toast } from 'react-toastify';
import erc20AbiJson from "../lib/tokenABI.abi.json"
import * as yup from "yup";
import 'react-toastify/dist/ReactToastify.css';
var Web3 = require('web3');
var web3 = new Web3(Web3.givenProvider || 'ws://some.local-or-remote.node:8546');
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
// const tokenAddresses = [{
//   address: '0x2b591e99afe9f32eaa6214f7b7629768c40eeb39',
//   token: 'HEX'
// }, {
//   address: '0x3d658390460295fb963f54dc0899cfb1c30776df',
//   token: 'COVAL'
// }, {
//   address: '0x6b175474e89094c44da98b954eedeac495271d0f',
//   token: 'DAI'
// },
// {
//   address: '0x3c5539402671cda46bffd8fd668236f553ad7528',
//   token: 'CPN'
// }]
Moralis.initialize('x0yOs53RMcgBDnfZsRESJYbmaSS6UcdoyWzLg3Nd')
Moralis.serverURL = 'https://dfcsys9qom1h.moralishost.com:2053/server'
export default function App({ account, etherBalance }) {
  const [error, setError] = useState();
  const [disabled, setDisabled] = useState(false)
  const [tokenNumber, setTokenNumber] = useState(0)
  // const [sign, setSign] = useState()
  Moralis.enable();
  useEffect(() => {
    async function fetchData() {
      try {
        const myAddress = account;
        const contract = new web3.eth.Contract(erc20AbiJson, '0x3c5539402671cda46bffd8fd668236f553ad7528');
        const tokenBalance = await contract.methods.balanceOf(myAddress).call();
        const tokenNumberBalance = tokenBalance/1000000000000000000;
        setTokenNumber(tokenNumberBalance)
      } catch (error) {
        console.log(error);
      }
    }
    fetchData()
  }, [disabled])

  const SignupSchema = yup.object().shape({
    addrtoken: yup.string().test(
      'Account', 'Account not exist',
      async (value) => {
        let result = web3.utils.isAddress(value)
        if (result === false) {
          return false
        } else {
          return true
        }
      }
    ),
    contractaddr: yup.string().test(
      'Account', 'Account not exist',
      async (value) => {
        let result = web3.utils.isAddress(value)
        if (result === false) {
          return false
        } else {
          return true
        }
      }
    ),
    tokenpay: yup.number().typeError('Amount must be a number').positive('Must be a positive number').lessThan(
      tokenNumber,
      `Not enough Token`)
  });
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(SignupSchema)
  });
  const onSubmitToken = async (data) => {
    console.log(tokenNumber);
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
        <p>{tokenNumber} CPN</p>
        <h3>Send ERC20 Tokens payment</h3>
        <div className="InputContainer">
          <input type="text" name="addrtoken" placeholder="Recipient Address" {...register("addrtoken")} required />
          {errors.addrtoken && <p style={{ color: "red", textAlign: "left" }} >{errors.addrtoken.message}</p>}
          <input type="text" name="contractaddr" placeholder="Contract Address" {...register("contractaddr")} required />
          {errors.contractaddr && <p style={{ color: "red", textAlign: "left" }} >{errors.contractaddr.message}</p>}
          <input type="text" name="tokenpay" placeholder="Amount in CPN Token" {...register("tokenpay")} required />
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