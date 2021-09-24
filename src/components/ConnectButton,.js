import { useEthers, useEtherBalance } from "@usedapp/core";
import { formatEther } from "@ethersproject/units";
import Button from 'react-bootstrap/Button';
import Payment from "./Payment"
function ConnectButton() {
  const { activateBrowserWallet, account, deactivate } = useEthers();
  const etherBalance = useEtherBalance(account);
  function handleConnectWallet() {
    activateBrowserWallet();
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
            account.length
          )}`}</p>
          <p>{etherBalance && parseFloat(formatEther(etherBalance)).toFixed(3)} ETH</p>
        </div>
          <Payment account={account} etherBalance={etherBalance} />
          <Button variant="danger" onClick={handleDeactivateAccount}>Disconnect</Button>
      </div>
      :
      <Button variant="primary" onClick={handleConnectWallet}>Connect to metamask</Button>
  );
}

export default ConnectButton;