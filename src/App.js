import React from 'react';
import Spinner from 'react-bootstrap/Spinner';
import Button from 'react-bootstrap/Button';
import CountUp from 'react-countup';
import $ from "jquery";
import bootstrap from 'bootstrap';
// import logo from './logo.svg';
//import loader from './assests/images/loader.gif';
import './App.css';
import TronWeb from 'tronweb';
import Utils from './utils';
import Swal from 'sweetalert2';
// import ScriptTag from 'react-script-tag';

const FOUNDATION_ADDRESS = 'TSCZc58nPCJx3YHNZzMyjrmR78mWPbqNKg';
//const TRONGRID_API = 'https://api.shasta.trongrid.io';
const TRONGRID_API = 'https://api.trongrid.io';




class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dep_loading: false,
      rei_loading: false,
      wit_loading: false,

      loading: false,
      wallet_balance: "0",
      player_total_investment: "0",
      total_invested: "0",
      total_team: "0",
      payout_sum: "0",
      total_ref_reward: "0",
      player_referral: "0",
      value: "",
      total_profit: "",
      creator: "TSCZc58nPCJx3YHNZzMyjrmR78mWPbqNKg",
      tronlink_address: "",
      ref_link: "https://tronfactory.com?ref=TSCZc58nPCJx3YHNZzMyjrmR78mWPbqNKg",
      tronWeb: {
        installed: false,
        loggedIn: false
      },

      account: "",
      balance: 0,
      reward_earned: "0",
      player_ref_count: "0",
      L1: "0",
      L2: "0",
      L3: "0",
    };
  }

  async componentDidMount() {



    const loadWatcher = setInterval(async () => {
      if (window.tronWeb && window.tronWeb.ready) {
        clearInterval(loadWatcher);
        // alert('ready');
        let address_tl = window.tronWeb.defaultAddress.base58;
        // console.log('tl_address', address_tl);

        const acc = await window.tronWeb.trx.getAccount();
        let wallet_bal = acc.balance / 1000000;

        this.setState({ wallet_balance: wallet_bal });

        this.playerInfo(address_tl);
        this.getProfit(address_tl);
        this.getReferral(address_tl);
        this.setState({ tronlink_address: address_tl });
        this.setState({ ref_link: 'https://tronfactory.com?ref=' + address_tl });
      }
    }, 200)

    setInterval(() => {
      //console.log('calling function');
      // <CountUp end={100} />
      // console.log('my wallet', this.state.tronlink_address);
      //  console.log('tl_address');


      this.getProfit(this.state.tronlink_address);


    }, 2000);

    await new Promise(resolve => {


      const tronWebState = {
        installed: !!window.tronWeb,
        loggedIn: window.tronWeb && window.tronWeb.ready
      };

      if (tronWebState.installed) {
        this.setState({
          tronWeb:
            tronWebState
        });
        // alert('resolve');
        return resolve();
      }

      let tries = 0;

      const timer = setInterval(() => {
        if (tries >= 15) {
          //const TRONGRID_API = 'https://api.shasta.trongrid.io';

          window.tronWeb = new TronWeb(
            TRONGRID_API,
            TRONGRID_API,
            TRONGRID_API
          );

          this.setState({
            tronWeb: {
              installed: false,
              loggedIn: false
            }
          });
          clearInterval(timer);
          return resolve();
        }

        tronWebState.installed = !!window.tronWeb;
        tronWebState.loggedIn = window.tronWeb && window.tronWeb.ready;

        if (!tronWebState.installed)
          return tries++;

        this.setState({
          tronWeb: tronWebState
        });

        resolve();
      }, 100);
    });

    if (!this.state.tronWeb.loggedIn) {
      // console.log('goind to set default address');
      // Set default address (foundation address) used for contract calls
      // Directly overwrites the address object as TronLink disabled the
      // function 
      window.tronWeb.defaultAddress = {
        hex: window.tronWeb.address.toHex(FOUNDATION_ADDRESS),
        base58: FOUNDATION_ADDRESS
      };

      window.tronWeb.on('addressChanged', () => {
        // window.location.reload();
        // return false;
        if (this.state.tronWeb.loggedIn)
          return;
        this.setState({
          tronWeb: {
            installed: true,
            loggedIn: true
          }
        });
      });
    }


    const w = window.tronWeb;
    // console.log('winodow.tronweb_const', w);
    // console.log('window.tronweb_before',window.tronWeb);
    Utils.setTronWeb(window.tronWeb);

    //console.log('ttt_add',this.state.tronlink_address);
    // this.playerInfo();
    this.totalInvested();
    this.total_player();
    this.total_ref_dis();
    // this.getProfit();


  }







  playerInfo = (addr) => {
    // console.log('palyer address', addr);
    Utils.contract.players(addr).call(0, (error, result) => {
      if (!error) {
         console.log('player_info', result);
        let total_player_investment = result.trxDeposit._hex;

        total_player_investment = parseInt(total_player_investment, 16);
        //to trx
        total_player_investment = total_player_investment / 1000000;

        let total_payout_sum = parseInt(result.payoutSum._hex, 16) / 1000000;
        let player_referral = parseInt(result.affRewards._hex, 16) / 1000000;
        // let reward_earn_bc = parseInt(result.reward_earned._hex, 16) / 1000000;
        // console.log('rewared_earned_bc', reward_earn_bc);

        this.setState({ player_referral: player_referral });
        this.setState({ payout_sum: total_payout_sum });
        this.setState({ player_total_investment: total_player_investment });
        // this.setState({ reward_earned: reward_earn_bc });


      } else {
        console.log(error);
      }
    });
  }


  total_player = function () {
    Utils.contract.totalPlayers().call(0, (error, result) => {
      if (!error) {
        //console.log('total_player',result);
        let total_player = parseInt(result._hex, 16);
        this.setState({ total_team: total_player });

      } else {
        console.log(error);
      }
    });
  }

  getProfit = function (addre) {
    Utils.contract.getProfit(addre).call(0, (error, result) => {
      if (!error) {
        // console.log('total_profit', result);
        let total_profit = parseInt(result._hex, 16);
        this.setState({ total_profit: total_profit });

      } else {
        console.log(error);
      }
    });
  }
  getReferral = function (padd) {
    Utils.contract.preferals(padd).call(0, (error, result) => {
      if (!error) {
        // console.log('all referrals', result);
        // console.log('all referrals', result.aff1sum._hex);
        this.setState({ L1: parseInt(result.aff1sum._hex, 16) })
        this.setState({ L2: parseInt(result.aff2sum._hex, 16) })
        this.setState({ L3: parseInt(result.aff3sum._hex, 16) })


        this.setState({ player_ref_count: result });
        // let total_profit = parseInt(result._hex, 16);
        //  this.setState({ total_profit: total_profit });

      } else {
        console.log(error);
      }
    });
  }




  totalInvested = function () {
    Utils.contract.totalInvested().call(0, (error, result) => {
      if (!error) {

        let total_invested = parseInt(result._hex, 16) / 1000000;
        this.setState({ total_invested: total_invested });
        // console.log('totalInvested_trx', total_invested);

      } else {
        console.log(error);
      }
    });
  }
  total_ref_dis = function () {
    Utils.contract.totalRefDistributed().call(0, (error, result) => {
      if (!error) {

        let total_ref_dis = parseInt(result._hex, 16) / 1000000;
        this.setState({ total_ref_reward: total_ref_dis });
        // console.log('total_ref_dis', total_ref_dis);

      } else {
        console.log(error);
      }
    });
  }


  onMessageSend = async () => {

    this.setState({ dep_loading: true });
    let search = window.location.search;
    let params = new URLSearchParams(search);
    const referral = params.get('ref');
    let trx = this.state.value;
    if (trx < 100) {
      Swal({
        title: 'Minimum deposit is 100 TRX',
        type: 'error'
      })
      this.setState({ dep_loading: false });
      return false;

    }

    // console.log('this is the trx value',trx);
    // console.log('this is the wallet balance',wall_bal);
    // let wall_bal  = this.state.wallet_balance;
    // if ( wall_bal <  trx + 5 ) {
    //   Swal({
    //     title: 'You should have  atleast 5-6 extra tron for gas fees',
    //     type: 'error'
    //   })
    //   this.setState({ dep_loading: false });
    //   return false;

    // }

    
    let sun = trx * 1000000;
    let ref_address;
    // console.log('wt', window.tronWeb);
    if (window.tronWeb.isAddress(referral)) {
      ref_address = referral;

    } else {

      ref_address = this.state.creator;
    }

    // console.log('ref_address', ref_address);
    // return false;
    await Utils.contract.deposit(ref_address).send({
      shouldPollResponse: false,
      callValue: sun
    }).then((res) => {
      this.setState({ dep_loading: false });
      // console.log('player address inside deposit promise', this.state.tronlink_address);
      //this.playerInfo(this.state.tronlink_address);
      console.log(res);
      Swal({
        title: 'Successfully Deposit',
        type: 'success'
      })
      setTimeout(() => {
        window.location.reload();
      }, 2000);


    }
    ).catch((err) => {
      this.setState({ dep_loading: false });
      console.log(err);
      Swal({
        title: 'Network Error',
        type: 'error'
      })
    });

  }
  withdrawRef = async () => {

    
    
  
    // return false;
    await Utils.contract.withdraw_referral().send({
      shouldPollResponse: false,
     
    }).then((res) => {
      console.log(res);
      Swal({
        title: 'Withdraw Successfully',
        type: 'success'
      })
      setTimeout(() => {
        window.location.reload();
      }, 2000);


    }
    ).catch((err) => {
      this.setState({ dep_loading: false });
      console.log(err);
      Swal({
        title: 'Network Error',
        type: 'error'
      })
    });

  }
  

  reinvest = async () => {

    this.setState({ rei_loading: true });
    await Utils.contract.reinvest().send({
      shouldPollResponse: false,

    }).then((res) => {
      this.setState({ rei_loading: false });
      console.log('res here', res);
      Swal({
        title: 'Successfully Reinvest',
        type: 'success'
      })
    }).catch((err) => {
      this.setState({ rei_loading: false });
      console.log(err);
      Swal({
        title: 'Network Error',
        type: 'error'
      })
    })


    // .then((res) => {
    //   alert(' reinvest success');
    //   this.playerInfo();
    //   console.log(res);
    // }




  }

  withdraw = async () => {


    await Utils.contract.withdraw().send({
      shouldPollResponse: false,

    }).then((res) => {
      console.log('player address inside withdraw promise', this.state.tronlink_address);
      this.getProfit(this.state.tronlink_address);
      console.log(res);
      this.setState({ wit_loading: false });
      Swal({
        title: 'Successfully Withdraw',
        type: 'success'
      })

    }
    ).catch((err) => {
      this.setState({ wit_loading: false });
      console.log(err);
      Swal({
        title: 'Network Error',
        type: 'error'
      })
    });

  }

  copyCodeToClipboard = () => {

    this.textArea.select();
    document.execCommand('copy');
  }




  render() {
    const { dep_loading } = this.state;
    const { rei_loading } = this.state;
    const { wit_loading } = this.state;
    return (
      <div>

        <div className="app-js">
          <header className="header">
            <div className="container header__container">
              <a href="index.html" className="logo logo_link">

                <img className="logo_class" src="newx.png" alt="logo_image" />
              </a>
              <ul className="m-none menu">
                <li><a className="bold" href="#" data-toggle="ref">
                  <svg height="2.2rem" width="2.6rem">
                    <use xlinkHref="assests/static/img/svg/sprite.svg#user" />
                  </svg>
                  Referrals</a></li>
                <li><a className="bold" href="#" data-toggle="faq">
                  <svg height="1.9rem" width="1.2rem" fill="#EC368C">
                    <use xlinkHref="assests/static/img/svg/sprite.svg#what" />
                  </svg>
                  f.a.q.</a></li>
                <li><a className="bold" href="https://tronfactory.com/tronfactory_audit_report.pdf" target="_blank">
                  <svg height="1.7rem" width="1.72rem" fill="#b86da5">
                    <use xlinkHref="assests/static/img/svg/sprite.svg#arrow" />
                  </svg>
                  Audit Report</a></li>
                {/* <li className="active"><a href="referrals.html">
                  <img src="assests/static/img/svg/main/start.svg" alt="" />
                  contests</a></li> */}
              </ul>
              <ul style={{marginTop:'0%'}} className="m-none soc_and_lang">
                <li>
                  <a href="https://t.me/TronFactoryGlobal" target="_blank">
                    <svg height="1.6rem" width="1.8rem" fill="#b86da5">
                      <use xlinkHref="assests/static/img/svg/sprite.svg#telegram" />
                    </svg>
                  </a>
                </li>
                {/* <li>
                <a href="#" data-toggle="lang">
                  <img src="assests/static/img/png/flags/en.png" alt="" />
                </a>
              </li> */}
              </ul>
              {/* <a v-if="user" href="#" className="m-none user_login">
              <svg height="1.6rem" width="1.42rem" fill="#fff">
                <use xlinkHref="assests/static/img/svg/sprite.svg#user" />
              </svg>
           ssss
            </a> */}

              <ul className="user_menu">
                <li v-if="!user">
                  <a href="#" data-toggle="login">
                    <svg height="2.2rem" width="2rem" fill="#b86da5">
                      <use xlinkHref="assests/static/img/svg/sprite.svg#user" />
                    </svg>
                  </a>
                </li>
                <li>
                  <a href="#" className="btn-menu">
                    <svg height="2.2rem" width="2rem">
                      <use xlinkHref="assests/static/img/svg/sprite.svg#menu" />
                    </svg>
                  </a>
                </li>
              </ul>
            </div>
          </header>
          <div className="app">
            {/* <a href="referrals.html" className="fixed_btn">
            <img src="assests/static/img/png/coub.svg" alt="" />
          </a> */}
            <section className="home">
              <div className="container">
                <div className="home-stat">
                  <div className="home-stat__item">
                    {/* <span>Days at work:</span> <b>3</b> */}
                  </div>
                  <div className="home-stat__item">
                    <div className="m-none">
                      <span>Investors:</span> <b>{this.state.total_team}</b>
                    </div>
                    <span>total invested:</span> <b>{this.state.total_invested} TRX</b>
                  </div>
                </div>
                <div className="slider">
                  <div className="slider__left">
                    <div className="flex">
                      <h2 style={{fontSize:"2.5rem"}}>100 % verified smart contract</h2>
                      <img style={{ height: '11rem' }} src="static/img/png/trone.png" alt="" />
                    </div>
                    <div className="home-procent">
                      <div className="home-procent__bg">
                        {/*                    <img src="assests/./img/png/home_mobile_procent.png" alt="">*/}
                        <h3>200 %</h3>
                        <h5>in just</h5>
                        <h4>10 days</h4>
                        
                        <h5 className="m-none">in just <b>10 days</b></h5>
                      </div>
                      <div className="home-procent__info">
                        <h2>20%</h2>
                        <h3>Daily ROI</h3>
                        {/* <h4>+referral rewards</h4> */}
                        <h4 className="home-procent__info--white d-none">10% + 3% + 2%</h4>
                      </div>
                    </div>
                    <p>Get 15% referral rewards</p>
                    <div className="home-stat__btn">
                      <button style={{width:"50%"}} className="btn btn--red">
                        <a style={{ textDecoration: "none", color: "white" }} href="https://tronscan.org/#/contract/TNpE8QNmfiRbXxwSFzPWwyuig8TzHbAbkE" target="_blank">Contract</a>
                        <svg height="1.7rem" width="1.72rem" fill="#b86da5">
                          <use xlinkHref="assests/static/img/svg/sprite.svg#arrow" />
                        </svg>
                      </button>

                    </div>
                  </div>
                  <div className="slider__right m-none">
                    <div style={{ marginLeft: '20%' }} className="swiper-slide"><img src="assests/static/img/png/headerimage.png" alt="" /></div>

                    <div className="swiper-container">
                      <div className="slider__sroll swiper-wrapper">
                        <div className="swiper-slide"><img src="assests/static/img/png/slider1.png" alt="" /></div>
                      </div>
                      <div className="swiper-pagination" />
                    </div>
                  </div>
                </div>
              </div>
            </section>
            <section className="investments">
              <div className="container">
                <h2>investments
                <div className="m-none">
                    <span>Investment : <b className="text-green">{this.state.total_invested}</b></span>
                    {/* <span>Rewards : <b className="text-blue">{this.state.reward_earned}</b></span> */}
                  </div>
                </h2>
                <h3 className="d-none">Wallet Bal: <b>{this.state.wallet_balance}</b></h3>
                <div className="inves-block">
                  <div className="investments__stat">
                    <div className="investments__stat-item">
                      <span>total invested:</span>
                      <b>{this.state.player_total_investment} TRX</b>
                    </div>
                    <div className="investments__stat-item">
                      <span>total paid:</span>
                      <b> {this.state.payout_sum} TRX</b>
                    </div>
                    <div className="investments__stat-item d-none">
                      <span>Total Referrals</span>
                      <b>{this.state.player_referral}</b>
                    </div>
                    <div className="investments__stat-item m-none">
                      <span>Wallet Bal:</span>
                      <b>{this.state.wallet_balance} TRX</b>
                    </div>

                  </div>
                  <div className="invest__body">
                    <div className="investments__form">
                      <div className="investments__form-block">
                        <div className="inv-info">
                          <h3>Invest and earn</h3>
                          <h2>20% per day</h2>

                        </div>
                        <h4>Enter the investment amount :</h4>
                        <div className="input">
                          <svg height="2.1rem" width="2rem" fill="#b86da5">
                            <use xlinkHref="assests/static/img/svg/sprite.svg#tron" />
                          </svg>
                          <input value={this.state.value}
                            onChange={event => this.setState({ value: event.target.value })} placeholder="Min 100 " type="text" v-model="amount" />
                          <span>TRX</span>
                        </div>
                        <div className="input__min">
                          <span>min: <b>100 TRX</b></span>
                          <span>max: <b>1000000 TRX</b></span>
                        </div>
                        <button className="btn btn--green" onClick={this.onMessageSend}>invest now
                        <svg height="1.7rem" width="1.72rem" fill="#fff">
                            <use xlinkHref="assests/static/img/svg/sprite.svg#arrow" />
                          </svg>
                        </button>
                      </div>
                    </div>





                    <div className="investments__form">
                      <div className="investments__form-block">
                        <div className="inv-info">
                          <h3>Refer and earn</h3>
                          <h2>15% Referral</h2>

                        </div>
                        <h4>Avaliable Referral To Withdraw:</h4>
                        <div className="input">
                          <svg height="2.1rem" width="2rem" fill="#b86da5">
                            <use xlinkHref="assests/static/img/svg/sprite.svg#tron" />
                          </svg>
                          <input disabled  value={this.state.player_referral}
                             type="text" v-model="amount" />
                          <span>  TRX</span>
                        </div>
                        <div className="input__min">
                          <span>Level : <b>10% + 3% + 2%</b></span>
                         
                        </div>
                       
                        <button className="btn btn--green" onClick={this.withdrawRef}>Withdraw
                        <svg height="1.7rem" width="1.72rem" fill="#fff">
                            <use xlinkHref="assests/static/img/svg/sprite.svg#arrow" />
                          </svg>
                        </button>
                      </div>
                    </div>




                    <div className="package-empty" v-for="d in list_temp">
                      {/* <h3>your future investments will be here</h3> */}

                      <div class="package__table package__footer">
                        <table>
                          <tbody>
                            <tr>
                              <td>Invested:</td><td>{this.state.player_total_investment}TRX</td>
                            </tr>

                            <tr>
                              <td>total paid:</td><td>{this.state.payout_sum} TRX</td>
                            </tr>
                          </tbody></table>
                        <h4 v-if="now < dep.date_end">available dividends</h4>

                        <h3 v-if="now < dep.date_end">{this.state.total_profit / 1000000}</h3>
                        <button onClick={this.withdraw} className="btn btn--green">
                          Withdraw
                        <svg height="1.7rem" width="1.72rem" fill="#b86da5">
                            <use xlinkHref="assests/static/img/svg/sprite.svg#arrow" />
                          </svg>
                        </button>
                        <button style={{ width: "100%" }} onClick={this.reinvest} className="btn btn--green">
                          Reinvest
                        <svg height="1.7rem" width="1.72rem" fill="#b86da5">
                            <use xlinkHref="assests/static/img/svg/sprite.svg#arrow" />
                          </svg>
                        </button>

                      </div>


                    </div>



                  </div>
                </div>
              </div>
            </section>
            <section className="referral" v-if="referal_stat.level1">
              <div className="container">
                <h2 className="m-none">Referrals</h2>
                <div className="referral__container">
                  <div className="referral__top">
                    <div className="referral__header">
                      <img src="assests/static/img/svg/ref.svg" alt="" />
                      <h2>Referrals</h2>
                    </div>
                    <div className="referral__content">
                      <div className="referral__content__left m-none">
                        <table v-if="referal_stat.level1">
                          <tbody><tr>
                            <td>1 level&nbsp;<b>(10%)</b>:</td>
                            <td>{this.state.L1}
                              &nbsp;<svg height="1.2rem" width="1.2rem" fill="#b86da5">
                                <use xlinkHref="assests/static/img/svg/sprite.svg#user2" />
                              </svg>&nbsp;
                            </td>
                          </tr>
                            <tr>
                              <td>2 level&nbsp;<b>(3%)</b>:</td>
                              <td>{this.state.L2}
                              &nbsp;<svg height="1.2rem" width="1.2rem" fill="#b86da5">
                                  <use xlinkHref="assests/static/img/svg/sprite.svg#user2" />
                                </svg>&nbsp;
                            </td>
                            </tr>
                            <tr>
                              <td>3 level&nbsp;<b>(2%)</b>:</td>
                              <td>{this.state.L3}
                              &nbsp;<svg height="1.2rem" width="1.2rem" fill="#b86da5">
                                  <use xlinkHref="assests/static/img/svg/sprite.svg#user2" />
                                </svg>&nbsp;
                            </td>
                            </tr>
                          </tbody></table>
                      </div>
                      <div className="referral__content__right">
                        <h3>Your referral link:</h3>
                        <br />
                        <br />
                        <h2 style={{whiteSpace:"normal", wordWrap:"break-word"}}>{this.state.ref_link}</h2>
                        <input ref={(textarea) => this.textArea = textarea} value={this.state.ref_link} type="text" id="ref" style={{ opacity: 0, position: 'absolute', zIndex: -1 }} />

                        <button onClick={() => this.copyCodeToClipboard()} className="btn btn--blue mt-5">
                          <span className="cpy_btn">Copy Link</span>
                        </button>
                        {/* <a href="#">Referral rewards statistics</a> */}
                      </div>
                    </div>
                  </div>
                  <div className="referral__footer" v-if="user">
                    {/* <div className="referrall__footer-content">
                    <img className="m-none" src="static/img/svg/ref.svg" alt="" />
                    <h4>Your referral link:</h4>
                    <h5>https://Tronfactory/?referral=</h5>
                    <input type="text" id="ref" style={{opacity: 0, position: 'absolute', zIndex: -1}} />
                     <button className="copy">Copy</button>
                  </div> */}

                  </div>
                </div>
                {/* <a href="#" className="btn d-none" data-toggle="promo">Promo tools
                <svg height="1.7rem" width="1.72rem" fill="#6698FA">
                    <use xlinkHref="assests/static/img/svg/sprite.svg#arrow" />
                  </svg>
                </a> */}
              </div>
            </section>
            
            {/* Reward section */}
           
            {/* Reward section ends here */}
            <section className="about">
              <div className="container">
                <h2>How it works?</h2>
                <p> Tronfactory is a decentralized investment platform powered by TRON smart contract technology.
                A smart contract guarantees 100 % safety and transparency of work.
                Accrual and payment of dividends occurs automatically.  Tronfactory is a great opportunity to multiply your assets in just a few days.</p>
                <div className="subtitle">
                  <h3>4 Actions</h3>
                  <h4> Will lead you to success</h4>
                </div>
                <div className="action">
                  <div className="action__item">
                    <div className="action__header">
                      <h5> register your tron ​​wallet</h5>
                      <i className="red">
                        <div>
                          <svg height="2.6rem" width="2.2rem" fill="#fff">
                            <use xlinkHref="assests/static/img/svg/sprite.svg#tron" />
                          </svg>
                        </div>
                      </i>
                    </div>
                    <p className="m-none">To get started, you need to register a wallet that works with the TRON (TRX) cryptocurrency.  We recommend using TronLink or TronWallet wallets to work with the Web site.  In case you are using a smartphone, the TronWallet app will be the best solution!</p>
                  </div>
                  <div className="action__item">
                    <div className="action__header">
                      <h5>invest in Tronfactory</h5>
                      <i className="blue">
                        <div>
                          <svg height="2.47rem" width="2.3rem">
                            <use xlinkHref="assests/static/img/svg/sprite.svg#download" />
                          </svg>
                        </div>
                      </i>
                    </div>
                    <p className="m-none">Smart contract Tronfactory generates 20% of the investment amount every day and guarantees 200 % income in 10 days.</p>
                  </div>
                  <div className="action__item">
                    <div className="action__header">
                      <h5>return on investment</h5>
                      <i className="yellow">
                        <div>
                          <svg height="2.47rem" width="2.3rem">
                            <use xlinkHref="assests/static/img/svg/sprite.svg#usd" />
                          </svg>
                        </div>
                      </i>
                    </div>
                    <p className="m-none"> Profit (dividends) is credited to your account immediately after making an investment.  You can withdraw dividends at any time.</p>
                  </div>
                  <div className="action__item">
                    <div className="action__header">
                      <h5>profit from referrals</h5>
                      <i className="green">
                        <div>
                          <svg height="2.47rem" width="2.3rem" fill="#fff">
                            <use xlinkHref="assests/static/img/svg/sprite.svg#user2" />
                          </svg>
                        </div>
                      </i>
                    </div>
                    <p className="m-none"> Earn additional income by referring new users.  A two-level referral program allows you to earn 10 % + 3 % + 2 % of the investment amount of invited investors.</p>
                  </div>
                </div>
              </div>
            </section>
          </div>
          <div className="footer">
            <div className="container footer-container">
              <a href="#" className="m-none logo">
                <img src="assests/static/img/svg/logo.svg" alt="" />
              </a>
              <div style={{color:'black'}} className="copyright m-none">© All rights reserved</div>
              <ul className="footer__menu">
                <li><a href="#" data-toggle="ref">
                  <svg height="2.2rem" width="2.6rem" fill="#EC368C" className="m-none">
                    <use xlinkHref="assests/static/img/svg/sprite.svg#user" />
                  </svg>
                  Refereal </a></li>
                <li><a href="https://tronfactory.com/tronfactory_audit_report.pdf" target="_blank">
                  <svg height="1.7rem" width="1.72rem" fill="#EC368C" className="m-none">
                    <use xlinkHref="assests/static/img/svg/sprite.svg#arrow" />
                  </svg>
                  Audit Report</a></li>
                {/* <li><a href="referrals.html">
                  <img src="assests/static/img/svg/main/start.svg" className="m-none" alt="" />
                  contests</a></li> */}
              </ul>
              <ul className="soc">
                {/* <li>
                <a href="#" data-toggle="lang">
                  <img src="assests/static/img/png/flags/en.png" alt="" />
                </a>
            </li> */}
                <li><a href="https://t.me/TronFactoryGlobal" target="_blank">
                  <svg height="2.2rem" width="2.6rem" fill="#EC368C">
                    <use xlinkHref="assests/static/img/svg/sprite.svg#telegram" />
                  </svg>
                </a></li>
              </ul>
            </div>
            <div className="footer__footer d-none">
              © All rights reserved
          </div>
          </div>
          <div className="modal" data-modal="menu">
            <div className="modal-container">
              <div className="container">
                <div className="modal__header">
                  <ul>
                    <li>
                      <a href="https://t.me/TronFactoryGlobal" target="_blank">
                        <svg height="2.2rem" width="2.6rem" fill="#fff">
                          <use xlinkHref="assests/static/img/svg/sprite.svg#telegram" />
                        </svg>
                      </a>
                    </li>

                  </ul>
                  <button>
                    <svg height="2.2rem" width="2.6rem">
                      <use xlinkHref="assests/static/img/svg/sprite.svg#close" />
                    </svg>
                  </button>
                </div>
                <div className="modal__content modal-menu">
                  <ul>
                    {/* <li>
                    <a href="#" data-toggle="calc" className="btn">Calculator
                      <svg height="1.5rem" width="1.5rem" fill="#EC368C">
                        <use xlinkHref="assests/static/img/svg/sprite.svg#plus" />
                      </svg>
                    </a>
                  </li> */}
                    {/* <li>
                    <a href="referrals.html" data-toggle="login" className="btn">contests
                      <img src="assests/static/img/svg/main/start.svg" alt="" />
                    </a>
                  </li> */}
                    <li>
                      <a href="#" data-toggle="faq" className="btn">F.a.q.
                      <svg height="1.9rem" width="1.2rem" fill="#EC368C">
                          <use xlinkHref="assests/static/img/svg/sprite.svg#what" />
                        </svg>
                      </a>
                    </li>
                    <li>
                      <a href="#" className="btn" data-toggle="ref">Referrals
                      <img src="assests/static/img/svg/main/pazl.svg" alt="" />
                      </a>
                    </li>
                    <li>
                      <a target="_blank" href="https://tronfactory.com/tronfactory_audit_report.pdf" className="btn">Audit Report
                      <svg height="1.7rem" width="1.72rem" fill="#EC368C">
                          <use xlinkHref="assests/static/img/svg/sprite.svg#arrow" />
                        </svg>
                      </a>
                    </li>
                  </ul>
                  <div className="modal-stats">
                    {/* <div className="modal-stats__item">
                      <span>Days at work:</span>
                      <b>3</b>
                    </div> */}
                    <div className="modal-stats__item">
                      <span>Investors:</span>
                      <b>{this.state.total_team}</b>
                    </div>
                    <div className="modal-stats__item">
                      <span>Invested:</span>
                      <b>{this.state.player_total_investment} TRX</b>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal__footer">
                © All rights reserved
            </div>
            </div>
          </div>
          <div className="modal" data-modal="login">
            <div className="modal-container modal-login">
              <div className="container">
                <button className="close-modal m-none">
                  <svg height="1.5rem" width="1.5rem" fill="#B2B2C4">
                    <use xlinkHref="assests/static/img/svg/sprite.svg#close2" />
                  </svg>
                </button>
                <div className="modal__header">
                  <ul>
                    <li>
                      <a href="https://t.me/TronFactoryGlobal" target="_blank">
                        <svg height="2.2rem" width="2.6rem" fill="#fff">
                          <use xlinkHref="assests/static/img/svg/sprite.svg#telegram" />
                        </svg>
                      </a>
                    </li>

                  </ul>
                  <button>
                    <svg height="2.2rem" width="2.6rem">
                      <use xlinkHref="assests/static/img/svg/sprite.svg#close" />
                    </svg>
                  </button>
                </div>
                <div className="modal__content">
                  <div className="modal-login__desc">
                    <h2 className="m-none text-gradient">Authorize </h2>
                    <p className="d-none">Please login to your Tron wallet.  If you haven’t downloaded yet the <b> TronLink </b> browser extension or the <b> TronWallet </b> application for your smartphone, you can install it by clicking on the button below.</p>
                    <p className="m-none">Please login to your Tron wallet.  If you haven’t downloaded yet the <b> TronLink </b> browser extension or the <b> TronWallet </b> application for your smartphone, you can install it by clicking on the button below.</p>
                    <p className="m-none"><b> Make sure you are on the mainnet network, do not use a test network.</b></p>
                  </div>
                  <div className="modal-login__footer">
                    <a href="https://www.tronlink.org/" target="_blank" className="btn">Tron link
                    <svg height="2.1rem" width="2rem" fill="#EC368C">
                        <use xlinkHref="assests/static/img/svg/sprite.svg#tron" />
                      </svg>
                    </a>
                    <a href="https://www.tronwallet.me/" target="_blank" className="btn">Tron wallet
                    <svg height="2.1rem" width="2rem" fill="#EC368C">
                        <use xlinkHref="assests/static/img/svg/sprite.svg#tron" />
                      </svg>
                    </a>
                  </div>
                  <p className="d-none"> Make sure you are on the mainnet network, do not use a test network.</p>
                </div>
              </div>
              <div className="modal__footer">
                © All rights reserved
            </div>
            </div>
          </div>
          <div className="modal" data-modal="lang">
            <div className="modal-container modal-lang">
              <div className="container">
                <button className="close-modal m-none">
                  <svg height="1.5rem" width="1.5rem" fill="#B2B2C4">
                    <use xlinkHref="assests/static/img/svg/sprite.svg#close2" />
                  </svg>
                </button>
                <div className="modal__header">
                  <a href="#" data-toggle="back">
                    <svg height="1.3rem" width=".89rem" fill="#fff">
                      <use xlinkHref="assests/static/img/svg/sprite.svg#arrow" />
                    </svg>
                  back</a>
                  <button>
                    <svg height="2.2rem" width="2.6rem">
                      <use xlinkHref="assests/static/img/svg/sprite.svg#close" />
                    </svg>
                  </button>
                </div>
                <div className="modal__content">
                  
                </div>
              </div>
              <div className="modal__footer">
                © All rights reserved
            </div>
            </div>
          </div>
         
          <div className="modal " data-modal="ref">
            <div className="modal-container modal-ref">
              <div className="container">
                <button className="close-modal m-none">
                  <svg height="1.5rem" width="1.5rem" fill="#B2B2C4">
                    <use xlinkHref="assests/static/img/svg/sprite.svg#close2" />
                  </svg>
                </button>
                
                <div className="modal__content">
                  <div className="ref-info">
                    <div className="ref-info__header">
                      <h2 className="text-gradient">Referral program</h2>
                      <p> Referral reward Tronfactory is the accrual of additional funds to users for attracting new investors to the fund.
                      New investors who joined Tronfactory through your referral link will become your 1st level referrals.  All those who are invited to your fund
                      referral of the 1st level, become your referrals of the 2nd level and also bring you additional profit.</p>
                      <p className="m-none"><b>The referral reward is credited in TRX to your account.  You can withdraw it to your wallet at any time.</b></p>
                    </div>
                    <div className="ref-info__level">
                      <div className="ref-info__level--item">
                        <h3 className="text-gradient">10%</h3> <span> reward from 1st level referrals</span>
                      </div>
                      <div className="ref-info__level--item">
                        <h3 className="text-gradient--blue ">3%</h3> <span>reward from 2nd level referrals</span>
                      </div>

                      <div className="ref-info__level--item">
                        <h3 className="text-gradient--blue ">2%</h3> <span>Reward from 3rd level referrals</span>
                      </div>
                    </div>
                    <div className="ref-info__footer d-none">
                      <p>
                        The referral reward is credited in TRX to your account.  You can withdraw it to your wallet at any time.
                    </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal__footer">
                © All rights reserved
            </div>
            </div>
          </div>
          <div className="modal" data-modal="promo">
            <div className="modal-container modal-promo">
              <div className="container">
                <button className="close-modal m-none">
                  <svg height="1.5rem" width="1.5rem" fill="#B2B2C4">
                    <use xlinkHref="assests/static/img/svg/sprite.svg#close2" />
                  </svg>
                </button>
                
                <div className="modal__content">
                  <ul>
                    <li>125x125</li>
                    <li>240x400</li>
                    <li>300x300</li>
                    <li>468x60</li>
                    <li>720x90</li>
                  </ul>
                  <div className="banner__result">
                    <img />
                  </div>
                  <h3> YOUR BANNER LINK SIZE  [get_banner.size]</h3>
                  <div className="promo__code">
                    <div>
                      <code>
                        &lt;a&nbsp;href="https://20x9.com/?referral=[user]"&gt;<br />
                      &nbsp;&lt;img src="https://20x9.com/static/banners/static/banners/[get_banner.img].gif"/&gt;<br />
                      &lt;/a&gt;
                    </code>
                    </div>
                    <input type="text" id="ref_banner" style={{ opacity: 0, position: 'absolute', zIndex: -1 }} />
                    <button>
                      <img src="assests/static/img/svg/copy.svg" alt="" />
                    </button>
                  </div>
                </div>
              </div>
              <div className="modal__footer">
                © All rights reserved
            </div>
            </div>
          </div>
          <div className="modal" data-modal="refstat">
            <div className="modal-container modal-refstat">
              <div className="container">
                <button className="close-modal m-none">
                  <svg height="1.5rem" width="1.5rem" fill="#B2B2C4">
                    <use xlinkHref="assests/static/img/svg/sprite.svg#close2" />
                  </svg>
                </button>
                <div className="modal__header">
                  <ul>
                    <li>
                      <a href="https://t.me/TronFactoryGlobal" target="_blank">
                        <svg height="2.2rem" width="2.6rem" fill="#fff">
                          <use xlinkHref="assests/static/img/svg/sprite.svg#telegram" />
                        </svg>
                      </a>
                    </li>

                  </ul>
                  <button>
                    <svg height="2.2rem" width="2.6rem">
                      <use xlinkHref="assests/static/img/svg/sprite.svg#close" />
                    </svg>
                  </button>
                </div>
                <div className="modal__content">
                  <div className="modal-refstat__content" v-if="referal_stat.level1">
                    <h2>Referral rewards statistics</h2>
                    <div className="ref-list d-none">
                      <div className="ref-list__item">
                        <span>Lvl 1:</span>
                        <span>[referal_stat.level1.count] <svg height="1.2rem" width="1.2rem" fill="#fff"> <use xlinkHref="assests/static/img/svg/sprite.svg#user2" /></svg>
                        /  [parseFloat(referal_stat.level1.amount/1000000).toFixed(2)] <span>TRX</span>
                        </span>
                      </div>
                      <div className="ref-list__item">
                        <span>Lvl 2:</span>
                        <span>[referal_stat.level2.count] <svg height="1.2rem" width="1.2rem" fill="#fff"> <use xlinkHref="assests/static/img/svg/sprite.svg#user2" /></svg>
                        /  [parseFloat(referal_stat.level2.amount/1000000).toFixed(2)] <span>TRX</span>
                        </span>
                      </div>
                      <div className="ref-list__item">
                        <span>total:</span>
                        <span>[referal_stat.level2.count + referal_stat.level1.count] <svg height="1.2rem" width="1.2rem" fill="#fff"> <use xlinkHref="assests/static/img/svg/sprite.svg#user2" /></svg>
                        /  [parseFloat((referal_stat.level1.amount + referal_stat.level2.amount)/1000000).toFixed(2)] <span>TRX</span>
                        </span>
                      </div>
                    </div>
                    <div className="ref-stat" v-for="ref in referral_statistics">
                      <div className="ref-stat__left d-none">
                        <h3 className="text-gradient">[ref.level] level:</h3>
                        <h3 className="text-gradient">accrued:</h3>
                        <h3>
                          <img src="assests/static/img/svg/clock.svg" alt="" />
                          <span className="text-gradient">date:</span>
                        </h3>
                      </div>
                      <div className="ref-stat__right">
                        <h3><span className="m-none">Referral:</span> [short_user(ref.user)]</h3>
                        <h3><span className="m-none">Accrued:</span>[parseFloat(ref.amount/1000000).toFixed(2)] TRX</h3>
                        <h3><span className="m-none">
                          <svg height="1.4rem" width="1.4rem" fill="#5E91F4">
                            <use xlinkHref="assests/static/img/svg/sprite.svg#clock" />
                          </svg>
                        </span>[ref.date]
                      </h3>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal__footer">
                © All rights reserved
            </div>
            </div>
          </div>
          <div className="modal" data-modal="register">
            <div className="modal-container register">
              <div className="container">
                <div className="modal__header">
                  <ul>
                    <li>
                      <a href="https://t.me/TronFactoryGlobal" target="_blank">
                        <svg height="2.2rem" width="2.6rem" fill="#fff">
                          <use xlinkHref="assests/static/img/svg/sprite.svg#telegram" />
                        </svg>
                      </a>
                    </li>
                    <li>
                      <a href="#" data-toggle="lang">
                        <img src="assests/static/img/png/flags/en.png" alt="" />
                      </a>
                    </li>
                  </ul>
                  <button>
                    <svg height="2.2rem" width="2.6rem">
                      <use xlinkHref="assests/static/img/svg/sprite.svg#close" />
                    </svg>
                  </button>
                </div>
                <div className="modal__content">
                  <div className="register__content">
                    <div className="icon">
                      <div>
                        <svg height="3.4rem" width="2.9rem" fill="#fff">
                          <use xlinkHref="assests/static/img/svg/sprite.svg#tron" />
                        </svg>
                      </div>
                    </div>
                    <h2 className="text-gradient">register your tron wallet</h2>
                    <p>
                      Tronfactory referral reward consists in the accrual of additional income to users for attracting new investors to the fund. New investors who joined Tronfactory using your referral link become your referrals of 1st level. All those who are invited to the fund by your 1st level referral become your 2nd
                      level referrals and also bring you additional profit.
                  </p>
                  </div>
                </div>
              </div>
              <div className="modal__footer">
                © All rights reserved
            </div>
            </div>
          </div>
          <div className="modal" data-modal="faq">
            <div className="modal-container modal__faq">
              <div className="container">
                <button className="close-modal m-none">
                  <svg height="1.5rem" width="1.5rem" fill="#B2B2C4">
                    <use xlinkHref="assests/static/img/svg/sprite.svg#close2" />
                  </svg>
                </button>
                <div className="modal__header">
                  
                  <button>
                    <svg height="2.2rem" width="2.6rem">
                      <use xlinkHref="assests/static/img/svg/sprite.svg#close" />
                    </svg>
                  </button>
                </div>
                <div className="modal__content">
                  <div className="faq">
                    <h2 className="m-none text-gradient">Frequently asked questions</h2>
                    <div className="faq__item">
                      <div className="faq__header">How to start to invest
                      <svg height="1.7rem" width="1.72rem" fill="#EC368C">
                          <use xlinkHref="assests/static/img/svg/sprite.svg#arrow" />
                        </svg>
                      </div>
                      <div className="faq__answer">
                        <p>
                          To start investing in Tronfactory, you need to install the TronLink extension for your browser.  You can download it from the Chrome Web Store.  If you prefer to work with the website using your smartphone, you should install the TronWallet app.  You can download it from Google Play or the App Store.
                      </p>
                      </div>
                    </div>
                    <div className="faq__item">
                      <div className="faq__header">How to invest on computer ?
                      <svg height="1.7rem" width="1.72rem" fill="#EC368C">
                          <use xlinkHref="assests/static/img/svg/sprite.svg#arrow" />
                        </svg>
                      </div>
                      <div className="faq__answer">
                        <p>
                          First, you need to install the TronLink extension for the Google Chrome browser.
                          Next, using the app, create a wallet and top up your TRX balance.  Go to the Tronfactory website by opening a new tab in your browser.  Please note that if you are logged into your TronLink wallet, you will be automatically logged into our website.
                          By clicking on the "Investment" button, you will go to the form for creating your investment.  In this form, you must indicate the amount to be invested.
                          Make sure that you have indicated the amount you have in your wallet and click the "Invest" button.
                      </p>
                      </div>
                    </div>
                    <div className="faq__item">
                      <div className="faq__header"> How to invest from your mobile?
                      <svg height="1.7rem" width="1.72rem" fill="#EC368C">
                          <use xlinkHref="assests/static/img/svg/sprite.svg#arrow" />
                        </svg>
                      </div>
                      <div className="faq__answer">
                        <p>
                          After you have installed the TronWallet application, you should create your wallet and top up your TRX balance.  Click the browser icon and enter Tronfactory in the search bar.  Now you can make an investment by clicking the "Invest" button and filling out the form.
                      </p>
                      </div>
                    </div>
                    <div className="faq__item">
                      <div className="faq__header"> How do I calculate my profit?
                      <svg height="1.7rem" width="1.72rem" fill="#EC368C">
                          <use xlinkHref="assests/static/img/svg/sprite.svg#arrow" />
                        </svg>
                      </div>
                      <div className="faq__answer">
                        <p>
                          The income that your investment will bring can be calculated using the calculator located on the home page of the site.
                      </p>
                      </div>
                    </div>
                    <div className="faq__item">
                      <div className="faq__header">How often can I withdraw the dividends?
                      <svg height="1.7rem" width="1.72rem" fill="#EC368C">
                          <use xlinkHref="assests/static/img/svg/sprite.svg#arrow" />
                        </svg>
                      </div>
                      <div className="faq__answer">
                        <p>
                          You can withdraw the accumulated dividends at any time by clicking the "Withdraw" button.  Please note that with each withdrawal request, there will be a transaction fee of approximately 3 TRX.  Dividends will be paid through a smart contract exclusively to the wallet from which the investment was made.
                      </p>
                      </div>
                    </div>
                    <div className="faq__item">
                      <div className="faq__header"> Can I create multiple investments?
                      <svg height="1.7rem" width="1.72rem" fill="#EC368C">
                          <use xlinkHref="assests/static/img/svg/sprite.svg#arrow" />
                        </svg>
                      </div>
                      <div className="faq__answer">
                        <p>
                          Yes, you can make an unlimited investment.  Each investment will be profitable separately from the others.
                      </p>
                      </div>
                    </div>
                    <div className="faq__item">
                      <div className="faq__header">How to receive referral rewards?
                      <svg height="1.7rem" width="1.72rem" fill="#EC368C">
                          <use xlinkHref="assests/static/img/svg/sprite.svg#arrow" />
                        </svg>
                      </div>
                      <div className="faq__answer">
                        <p>
                          Each Tronfactory user is assigned a unique referral link.  You will find it in the “Referrals” section.  There are also promotional materials available for you.  Invite your friends and partners, and get 10 %  rewards from the investment amount of your 1st level referrals and 3 % + 2% rewards from the investment amount of your 2nd level referrals.
                      </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal__footer">
                © All rights reserved
            </div>
            </div>
          </div>
        </div>


      </div>

    );
  }

}
export default App;
