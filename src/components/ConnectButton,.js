import { useEthers, useEtherBalance } from "@usedapp/core";
import { formatEther } from "@ethersproject/units";
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
          <Payment />
          <button onClick={handleDeactivateAccount}>Disconnect</button>
      </div>
      :
      <button onClick={handleConnectWallet}>Connect to metamask</button>
  );
}

export default ConnectButton;