import React from 'react';
import logo from './logo.svg';
import './App.css';

class App extends React.Component {
  state = {
    tronWeb: {
        installed: false,
        loggedIn: false,
    },
    loading: true,
    account: "",
    balance: 0,
    tronPower: 0,
    tfVotes: 0
  }

  componentDidMount() {
    const loadWatcher = setInterval( async () => {
        if(window.tronWeb && window.tronWeb.ready) {
            clearInterval(loadWatcher);
            const installed = !!window.tronWeb;
            const tronWebState = {
                installed: installed,
                loggedIn: true
            };

            
            this.setState({
                tronWeb: tronWebState,
                account: window.tronWeb.defaultAddress.base58
            });
            this.fetchInfo(window.tronWeb.defaultAddress.base58)

            window.tronWeb.on('addressChanged', (addr) =>{
                const { account } = this.state;
                // reload address
                if (account !== addr.base58) {
                    this.setState({
                        loading: true,
                        account: addr.base58,
                        balance: 0,
                        tronPower: 0,
                        tfVotes: 0
                    }, this.fetchInfo(addr))
                }
                
            })
        }
    }, 200)
  }

  fetchInfo = async addr =>{
    const acc = await window.tronWeb.trx.getAccount();
    const tfVotes = acc.votes.find( v=> v.vote_address==="41de9c3c2276abe2da70a7cdb34a205ecf7750d063");
    let voteAmount = 0;
    if (tfVotes) {
      voteAmount = tfVotes.vote_count;
    }
    let TP = 0;
    acc.frozen.map( f => {
      return TP += f.frozen_balance/1000000
    })
    if (acc.account_resource) {
      TP += (acc.account_resource.delegated_frozen_balance_for_energy/1000000 || 0)
      if (acc.account_resource.frozen_balance_for_energy) {
        TP += (acc.account_resource.frozen_balance_for_energy.frozen_balance/1000000 || 0)
      }
    }

    this.setState({
      loading: false,
      balance: (acc.balance/1000000),
      tronPower: TP,
      tfVotes: voteAmount
    })
  }

  renderInfo = () => {
    const {
      loading,
      account,
      balance,
      tronPower,
      tfVotes
    } = this.state;
    if (loading) {
      return <p>
        Loading...
      </p>
    }
    return <p>
        Account: {account} <br/>
        Balance: {balance} <br/>
        tronPower: {tronPower} <br/>
        TF Votes: {tfVotes} <br/>
    </p>
    
  }

  render() {
    const {
      tronWeb: {
        installed,
        loggedIn
      }
    } = this.state;

    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          { !installed && <p>
            Please install TronLink
            </p>
          }
          { installed && !loggedIn && <p>
            Please unlock TronLink
            </p>
          }

          { installed && loggedIn && 
            this.renderInfo()
          }
        </header>
      </div>
    );
  }
}

export default App;