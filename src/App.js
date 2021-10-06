import './App.css';
import ConnectButton from './components/ConnectButton,';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Web3ReactProvider } from '@web3-react/core'
import { Web3Provider } from '@ethersproject/providers'
function getLibrary(provider){
  const library = new Web3Provider(provider)
  library.pollingInterval = 12000
  return library
}
function App() {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <div className="App">
        <ConnectButton />
      </div>
    </Web3ReactProvider>

  );
}

export default App;
