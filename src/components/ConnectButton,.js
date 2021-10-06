// import { useEthers, useEtherBalance } from "@usedapp/core";
import { formatEther } from "@ethersproject/units";
import Button from 'react-bootstrap/Button';
import Payment from "./Payment"
import { InjectedConnector } from '@web3-react/injected-connector'
import { useWeb3React } from '@web3-react/core'
export const injectedConnector = new InjectedConnector({
  supportedChainIds: [
    1, // Mainet
    3, // Ropsten
    4, // Rinkeby
    5, // Goerli
    42, // Kovan
    97, //BSC
  ],
})
function ConnectButton() {
  const { chainId, account, activate, active, deactivate } = useWeb3React()
  // const etherBalance = useEtherBalance(account);
  function handleConnectWallet() {
    activate(injectedConnector)
  }
  function handleDeactivateAccount(){
    deactivate();
  }
  return (
    account ?
      <div className="AppContainer">
        <div className="container">
          <h2>Account informaton</h2>
          <p>Account: {account &&
          `${account.slice(0, 6)}...${account.slice(
            account.length - 4,
            account.lengths
          )}`}</p>
          {/* <p>{etherBalance && parseFloat(formatEther(etherBalance)).toFixed(3)} ETH</p> */}
        </div>
          <Payment account={account} />
          <Button variant="danger" onClick={handleDeactivateAccount}>Disconnect</Button>
      </div>
      :
      <Button variant="primary" onClick={handleConnectWallet}>Connect to metamask</Button>
  );
}

export default ConnectButton;