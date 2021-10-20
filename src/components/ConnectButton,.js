// import { useEthers, useEtherBalance } from "@usedapp/core";
import { useState } from "react";
import { formatEther } from "@ethersproject/units";
import Button from "react-bootstrap/Button";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import Payment from "./Payment";
import { InjectedConnector } from "@web3-react/injected-connector";
import { useWeb3React } from "@web3-react/core";
import EthPayment from "./EThPayment";
// import useSWR from 'swr';

var Web3 = require("web3");
var web3 = new Web3(
  Web3.givenProvider || "ws://some.local-or-remote.node:8546"
);
export const injectedConnector = new InjectedConnector({
  supportedChainIds: [
    1, // Mainet
    3, // Ropsten
    4, // Rinkeby
    5, // Goerli
    42, // Kovan
    97, //BSC
  ],
});
// const fetcher = (library) => (...args) => {
//   const [method, ...params] = args
//   return library[method](...params)
// }
function ConnectButton() {
  const [money, setMoney] = useState();
  const [key, setKey] = useState("home");
  const [typeNet, setTypeNet] = useState();
  const { account, activate, deactivate } = useWeb3React();

  // const { library } = useWeb3React()
  // const { data: balance } = useSWR(['getBalance', account, 'latest'], {
  //   fetcher: fetcher(library),
  // })

  // web3.eth.net.getNetworkType()
  web3.eth.net.getNetworkType().then((a) => setTypeNet(a));
  function handleConnectWallet() {
    activate(injectedConnector);
  }
  function handleDeactivateAccount() {
    deactivate();
  }
  console.log("Type net: ", typeNet);
  // console.log(network);
  async function getMoney() {
    var a =
      (await account) &&
      web3.eth.getBalance(account).then((eth) => setMoney(eth));
    return a;
  }
  getMoney();
  return account ? (
    <div className="AppContainer">
      <div className="container">
        <h2>Account informaton</h2>
        <p>
          Account:{" "}
          {account &&
            `${account.slice(0, 6)}...${account.slice(
              account.length - 4,
              account.lengths
            )}`}
        </p>
        <p>
          {money && parseFloat(formatEther(money)).toPrecision(4)}{" "}
          {typeNet === "private" ? "BNB" : "ETH"}
        </p>
      </div>
      {/* <Payment account={account} /> */}
      <Tabs
        id="controlled-tab-example"
        activeKey={key}
        onSelect={(k) => setKey(k)}
        className="mb-3"
      >
        <Tab eventKey="home" title="Token Payment">
          <Payment account={account} />
        </Tab>
        <Tab eventKey="profile" title="ETH Payment">
          <EthPayment account={account} etherBalance={money} />
        </Tab>
      </Tabs>
      <Button variant="danger" onClick={handleDeactivateAccount}>
        Disconnect
      </Button>
    </div>
  ) : (
    <Button variant="primary" onClick={handleConnectWallet}>
      Connect to metamask
    </Button>
  );
}

export default ConnectButton;
