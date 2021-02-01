import React from 'react';
import $ from "jquery";
import logo from './logo.svg';
import './App.css';
import TronWeb from 'tronweb';
import Utils from './utils';
import Swal from 'sweetalert2';
import ScriptTag from 'react-script-tag';



// const FOUNDATION_ADDRESS = 'TWiWt5SEDzaEqS6kE5gandWMNfxR2B5xzg';

const MyAppActivityIndicator = () => {
  return (
    <h1>loading</h1>
  )
}

class App extends React.Component {


  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      player_total_investment: "",
      total_invested: "",
      total_team: "",
      payout_sum: "",
      total_ref_reward: "",
      player_referral:"",
      value:"",
      total_profit:"",
      creator:"TDWXdQ55riCcXGux1usVkBiG3rRtUFAS4i",
      tronlink_address:"",
    };
  }

  async componentDidMount() {
    const TRONGRID_API = 'https://api.shasta.trongrid.io';
    const private_key = '9940e88b4b2ad0aa488eadd46b277c65ce340086706eaae91c6f79bcb85f55ab';
    window.tronWeb = new TronWeb(
      TRONGRID_API,
      TRONGRID_API,
      TRONGRID_API,
       private_key
    );


    if(window.tronWeb && window.tronWeb.defaultAddress.base58){
      console.log("Yes, catch it:",window.tronWeb.defaultAddress.base58);
      this.setState({ tronlink_address: window.tronWeb.defaultAddress.base58 });
  }else
  {
    console.log('tronlink wallet not found');
  }

    if( window.tronWeb.isConnected())
    {
      console.log('connected', window.tronWeb.isConnected())
    }else
    {
      console.log('not connected');
    }

    
    Utils.setTronWeb(window.tronWeb);
    Utils.tronWeb.setAddress(this.state.creator);

    this.playerInfo();
    this.totalInvested();
    this.total_player();
    this.total_ref_dis();
    this.getProfit();
  }


  playerInfo = () => {
    Utils.contract.players('TDWXdQ55riCcXGux1usVkBiG3rRtUFAS4i').call(0, (error, result) => {
      if (!error) {
        console.log('player_info', result);
        let total_player_investment = result.trxDeposit._hex;

        total_player_investment = parseInt(total_player_investment, 16);
        //to trx
        total_player_investment = total_player_investment / 1000000;

        let total_payout_sum = parseInt(result.payoutSum._hex, 16) / 1000000;
        let player_referral = parseInt(result.affRewards._hex, 16) / 1000000;
        
        this.setState({ player_referral: player_referral });
        this.setState({ payout_sum: total_payout_sum });
        this.setState({ player_total_investment: total_player_investment });

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

  getProfit = function () {
    const address = 'TDWXdQ55riCcXGux1usVkBiG3rRtUFAS4i';
    Utils.contract.getProfit(address).call(0, (error, result) => {
      if (!error) {
        console.log('total_profit',result);
        let total_profit = parseInt(result._hex, 16);
         this.setState({ total_profit: total_profit });

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
        console.log('totalInvested_trx', total_invested);

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
        console.log('total_ref_dis', total_ref_dis);

      } else {
        console.log(error);
      }
    });
  }


  onMessageSend = async () => {

    let search = window.location.search;
    let params = new URLSearchParams(search);
    const referral = params.get('ref');
    //console.log('referral here',referral);
   
    let trx = this.state.value;
    if(trx  < 100)
    {
      alert('Minimum deposit is 100 TRX')
      return false;

    }
    let sun = trx*1000000;
    let ref_address;
    console.log('wt',window.tronWeb);
    if(window.tronWeb.isAddress(referral))
    {
       ref_address = referral;
       
    }else{
      
        ref_address = this.state.creator
    }

    console.log('ref_address',ref_address);
   // return false;
    await Utils.contract.deposit(ref_address).send({
      shouldPollResponse: true,
      callValue: sun
    }).then((res) => {
      alert('success');
      this.playerInfo();
      console.log(res);
    }
    ).catch((err) => {

      alert('failed');
      console.log(err);
    });

  }


  reinvest = async () => {

    await Utils.contract.reinvest().send({
      shouldPollResponse: true,
      
    }).then((res) => {
      alert(' reinvest success');
      this.playerInfo();
      console.log(res);
    }
    ).catch((err) => {
      alert('reinvest failed');
      console.log(err);
    });

  }

  withdraw = async () => {

   

    await Utils.contract.withdraw().send({
      shouldPollResponse: true,
      
    }).then((res) => {
      alert(' withdraw success');
      this.playerInfo();
      console.log(res);
    }
    ).catch((err) => {
      alert('withdraw failed');
      console.log(err);
    });

  }

  




  render() {
    const { loading } = this.state;
    return (
      // loading ? (
      //   <MyAppActivityIndicator />
      // ) : (
      //     <div>
      //       <h1>Total team:{this.state.total_team}</h1>
      //       <h1>Total Referral Distributed:{this.state.total_ref_reward}</h1>
      //       <h1>My Withdrawls:{this.state.payout_sum}</h1>
      //       <h1>Total Invested:{this.state.total_invested}</h1>
      //       <h1>Total Player Invested : {this.state.player_total_investment}</h1>
      //       <button onClick={this.onMessageSend} >Invest</button>
      //       <br />
      //     </div>
      //   )
      <div>
      <title>Trozia</title>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, height=device-height, initial-scale=1.0" />
      <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
      <link rel="icon" href="images/favicon.ico" type="image/x-icon" />
      <link rel="stylesheet" type="text/css" href="http://fonts.googleapis.com/css?family=Montserrat:300,400,500,600,700,800,900" />
      <link rel="stylesheet" href="assests/css/bootstrap.css" />
      <link rel="stylesheet" href="assests/css/fonts.css" />
      <link rel="stylesheet" href="assests/css/style-4.css" id="main-styles-link" />
      <style dangerouslySetInnerHTML={{__html: ".ie-panel{display: none;background: #212121;padding: 10px 0;box-shadow: 3px 3px 5px 0 rgba(0,0,0,.3);clear: both;text-align:center;position: relative;z-index: 1;} html.ie-10 .ie-panel, html.lt-ie-10 .ie-panel {display: block;}" }} />
      <div className="ie-panel"><a href="http://windows.microsoft.com/en-US/internet-explorer/"><img src="images/ie8-panel/warning_bar_0000_us.jpg" height={42} width={820} alt="You are using an outdated browser. For a faster, safer browsing experience, upgrade for free today." /></a></div>
      <div className="preloader">
        <div className="preloader-body">
          <div className="preloader-container">
            <span className="animated-preloader" />
          </div>
          <div className="cssload-container">
          </div><img src="assests/images/footer-logo.png" alt="" width={162} height={44} />
        </div>
      </div>
      <div className="page">
        <header className="section page-header page-header-absolute-2">
          <div className="rd-navbar-wrap">
            <nav className="rd-navbar rd-navbar-modern" data-layout="rd-navbar-fixed" data-sm-layout="rd-navbar-fixed" data-md-layout="rd-navbar-fixed" data-md-device-layout="rd-navbar-fixed" data-lg-layout="rd-navbar-static" data-lg-device-layout="rd-navbar-fixed" data-xl-layout="rd-navbar-static" data-xl-device-layout="rd-navbar-static" data-xxl-layout="rd-navbar-static" data-xxl-device-layout="rd-navbar-static" data-lg-stick-up-offset="46px" data-xl-stick-up-offset="46px" data-xxl-stick-up-offset="46px" data-lg-stick-up="true" data-xl-stick-up="true" data-xxl-stick-up="true" data-lg-auto-height="false" data-xl-auto-height="false" data-xxl-auto-height="false">
              <div className="rd-navbar-main-outer">
                <div className="rd-navbar-main">
                  <div className="rd-navbar-panel">
                    <button className="rd-navbar-toggle" data-rd-navbar-toggle=".rd-navbar-nav-wrap"><span /></button>
                    <div className="rd-navbar-brand">
                      <a className="brand" href="index.html"><img className="brand-logo-light" src="images/footer-logo.png" alt="" width={162} height={44} /></a>
                    </div>
                  </div>
                  <div className="rd-navbar-main-element">
                    <div className="rd-navbar-nav-wrap">
                      <ul className="rd-navbar-nav">
                        <li className="rd-nav-item"><a className="rd-nav-link" href="#home">Home</a>
                        </li>
                        <li className="rd-nav-item"><a className="rd-nav-link" href="#wallet">Wallet</a>
                        </li>
                        <li className="rd-nav-item"><a className="rd-nav-link" href="#about">About</a>
                        </li>
                        <li className="rd-nav-item"><a className="rd-nav-link" href="#roadmap">Roadmap</a>
                        </li>
                        <li className="rd-nav-item"><a className="rd-nav-link" href="https://tronscan.org/#/contract/TBwz4F5bMntpM9urrZbDUr3jMzWFrKb9A5" target="_blank">CONTRACT</a>
                        </li>
                        <li className="rd-nav-item"><a className="rd-nav-link" href="#">Trade Trozia</a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div></nav>
          </div>
        </header>
        <section className="section gradient-7 bg-vide-1 bg-vide-3" id="home">
          <div className="bg-vide" data-vide-bg="video/video-4" data-vide-options="posterType: jpg, position: 50% 50%" />
          <div className="section-inset-13">
            <div className="container">
              <div className="row row-80">
                <div className="col-md-6 col-xl-6 wow fadeInLeft mob-mb-top">
                  <h3>TRX Invest<br /> Powerful Platform</h3>
                  <p>TRON Money is a universal invest platform and service provider. </p>
                  <h4 className="baner-h4">2% Daily</h4>
                  <h4 className="baner-h4">20% Referral Rewards</h4>
                </div>
                <div className="col-md-6 col-xl-6 position-static mob-mb text-center">
                  <h3 id="totalTrx">{this.state.total_invested}</h3>
                  <h4>Invested TRX</h4>
                  <br />
                  <h3 id="totalInvestors">{this.state.total_team}</h3>
                  <h4>Total Investors</h4>
                  <br />
                  <h3 id="totalRefRewards">{this.state.total_ref_reward}</h3>
                  <h4>Total referral rewards TRX</h4>
                  <br /><br />
                </div>
              </div>
            </div>
          </div>
          <svg className="wave-2" x="0px" y="0px" width="1920px" height="200px" viewBox="0 0 1920 200" preserveAspectRatio="xMidYMid slice">
            <path fill="#fff" d="M0 160 Q250 200 500 145 Q750 90 1050 155 Q1350 200 1550 145 T 1920 0 V200 H0 Z" />
          </svg>
        </section>
        <section className="section section-lg bg-white custom-section" id="wallet">
          <div className="container">
            <h3 className="ta-center">Your TRX Wallet</h3>
            <div className="row row-30 ">
              <div className="col-md-6 col-lg-6 wow fadeInLeft">
                <div className="dao-wallet-box custom-box-mb-20">
                  <h6 className="font-weight-medium">Invest TRX</h6>
                  <p>Total invested TRX: <span id="yourInvestment">{this.state.player_total_investment}</span> </p>
                  <div className="custom-input-block">
                    <input value={this.state.value}
              onChange={event => this.setState({ value: event.target.value })} className="form-input" id="trxToInvest" type="text" name="name" placeholder="Invest Amount (minimum 100 TRX)" />
                  </div>
                  <a href="#" className="button button-isi button-primary coming-soon-a" onClick={this.onMessageSend}>Invest</a>
                  <br /><br />
                  <div style={{color: '#2fc7b5'}}>2-4 TRX transaction fee will be applied</div>
                </div>
              </div>
              <div className="col-md-6 col-lg-6 wow fadeInRight">
                <div className="dao-wallet-box custom-box-mb-20">
                  <h6 className="font-weight-medium">Referral Link</h6>
                  <p><span>20%</span> referral comission</p>
                  <div className="custom-input-block">
                    <input className="form-input" id="ref_link" type="text" name="name" placeholder="Link" disabled />
                  </div>
                  <a href="#" className="button button-isi button-primary coming-soon-a" onclick="copytext('#ref_link')" id="copy">Copy</a>
                  <br /><br />
                  {/* <div style={{color: '#2fc7b5'}}>Link activated.</div> */}
                </div>
              </div>
              <div className="col-md-6 col-lg-6 wow fadeInLeft">
                <div className="dao-wallet-box custom-box-mb-20">
                  <h6 className="font-weight-medium">Available to withdraw</h6>
    <p><span className="bold-dig" id="available">{this.state.total_profit/1000000}</span> <span className="bold-dig">TRX</span></p>
                  <p>My percentage per day: <span id="dayPercent">2</span>%</p>
                  <a href="#" className="button button-isi button-primary coming-soon-a" onClick={this.reinvest}>REINVEST</a>&nbsp;
                  <a href="#" className="button button-isi button-primary coming-soon-a" onClick={this.withdraw}>WITHDRAW </a>
                </div>
              </div>
              <div className="col-md-6 col-lg-6 wow fadeInRight">
                <div className="dao-wallet-box custom-box-mb-20">
                  <h6 className="font-weight-medium">My statistics</h6>
                  <p className="withdraw-aval">My investment: <span id="myInvestmentStat"> {this.state.player_total_investment}</span> <img src="images/trx.png" alt="" width="20px" className="withdraw-token" /> </p>
                  <p className="withdraw-aval">My withdrawals: <span id="myWithdrawalsStat">{this.state.payout_sum}</span> <img src="images/trx.png" alt="" width="20px" className="withdraw-token" /> </p>
    <p className="withdraw-aval">My referral rewards: <span id="myRefsStat">{this.state.player_referral}</span> <img src="images/trx.png" alt="" width="20px" className="withdraw-token" /> </p>
                  {/* <p class="withdraw-aval">My referrals (7 levels): <span id="myRefsNum">...</span> <img src="images/user.png" alt="" width="15px" class="withdraw-token"> </p>
<p class="withdraw-aval">My TMT bonus tokens: <span id="myTMT">...</span> <img src="images/TMT.png" alt="" width="22px" class="withdraw-token"> </p> */}
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="section section-lg gradient-7 wave-wrap" id="about">
          <svg className="wave-1" width={1920} height={378} viewBox="0 0 1920 378" preserveAspectRatio="xMidYMid slice">
            <path className="wave-path wave-path-1" d="M0 209.5C0 209.5 251.5 96.3172 563.5 194.789C875.5 293.261 1045 83.319 1386.5 162.096C1728 240.873 1920 176 1920 176V426H0V209.5Z" />
            <path className="wave-path wave-path-2" d="M1920 140.986C1920 140.986 1668.5 -72.0314 1356.5 76.7238C1044.5 225.479 875 -91.667 533.5 27.3369C192 146.341 0 27.3369 0 27.3369V426H1920V140.986Z" />
          </svg>
          <div className="container wow fadeInUp">
            <div className="row row-30 row-md-50 align-items-center flex-md-row-reverse">
              <div className="col-md-5 col-lg-6">
                <img src="assests/images/image-7-523x376.png" alt="" width={523} height={376} />
              </div>
              <div className="col-md-7 col-lg-6 text-left">
                <h3 className="ta-center-mob">Stable earnings</h3>
                <p>You invest 100 TRX and you earn 2% from it 
                  <br />
                  If you invest more TRX you get more TRX
                </p>
                <h6 className="font-weight-medium ta-center-mob">Leading to earn more %</h6>
                <ul className="list-marked-3 d-inline-block d-md-block">
                  <li>100 TRX: + 2% per day</li>
                  {/* <li>5000 TMT: + 4% per day</li>
<li>10000 TMT: + 6% per day</li> */}
                </ul>
              </div>
            </div>
          </div>
        </section>
        <section className="section section-lg section-inset-7 bg-white">
          <div className="container offset-negative-top-3">
            <div className="row row-lg row-30 row-md-50 align-items-center justify-content-center">
              <div className="col-md-10 col-lg-5 col-xl-6 wow fadeInLeft"><img className="img-style-4" src="images/image-8-550x376.png" alt="" width={550} height={376} />
              </div>
              <div className="col-md-10 col-lg-7 col-xl-6">
                <div className="box-style-5">
                  <h3 className="ta-center-mob">Addressable Market</h3>
                  <div className="owl-carousel owl-nav-1 owl-style-3" data-items={1} data-nav="true" data-dots="true" data-margin={30}>
                    <div>
                      <div className="box-style-4 ta-center-mob">
                        <h6 className="font-weight-medium">Increased Adoption</h6>
                        <ul className="list-marked-4 list-style-3 ta-center-mob">
                          <li>Working capital.</li>
                          <li>Hedging.</li>
                          <li>Collateralized leverage.</li>
                        </ul>
                      </div>
                      <div className="box-style-4 ta-center-mob">
                        <h6 className="font-weight-medium">Full Decentralization</h6>
                        <ul className="list-marked-4 ta-center-mob">
                          <li>Merchant receipts.</li>
                          <li>Cross-border transactions.</li>
                          <li>Remittances.</li>
                        </ul>
                      </div>
                    </div>
                    <div>
                      <div className="box-style-4 ta-center-mob">
                        <h6 className="font-weight-medium">Increased Adoption </h6>
                        <ul className="list-marked-4 list-style-3 ta-center-mob">
                          <li>Charities.</li>
                          <li>NGOs.</li>
                        </ul>
                      </div>
                      <div className="box-style-4 ta-center-mob">
                        <h6 className="font-weight-medium">Full Decentralization</h6>
                        <ul className="list-marked-4 ta-center-mob">
                          <li>Gaming.</li>
                          <li>Prediction markets.</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="section section-xl gradient-7 wave-wrap text-center text-lg-left" id="token-sale">
          <svg className="wave-1" width={1920} height={378} viewBox="0 0 1920 378" preserveAspectRatio="xMidYMid slice">
            <path className="wave-path wave-path-1" d="M0 209.5C0 209.5 251.5 96.3172 563.5 194.789C875.5 293.261 1045 83.319 1386.5 162.096C1728 240.873 1920 176 1920 176V426H0V209.5Z" />
            <path className="wave-path wave-path-2" d="M1920 140.986C1920 140.986 1668.5 -72.0314 1356.5 76.7238C1044.5 225.479 875 -91.667 533.5 27.3369C192 146.341 0 27.3369 0 27.3369V426H1920V140.986Z" />
          </svg>
          <div className="container tabs-custom tabs-corporate wow fadeInUp">
            <div className="row row-xl row-30  justify-content-center">
              <div className="col-md-10 col-lg-6">
                <div className="inset-left-xl-30">
                  <h3 className="wow fadeInUp">Referral Commission Distribution</h3>
                  <div className="group-custom-1 d-lg-flex flex-lg-column-reverse">
                    <ul className="list-default inset-right-xl-70">
                      <li className="list-default-item"><span>Level 1</span><span>10%</span></li>
                      <li className="list-default-item"><span>Level 2 </span><span> 3%</span></li>
                      <li className="list-default-item"><span>Level 3</span><span> 3%</span></li>
                      <li className="list-default-item"><span>Level 4</span><span>2%</span></li>
                      <li className="list-default-item"><span>Level 5</span><span>2%</span></li>
                      <li className="list-default-item"><span>Level 6</span><span>1%</span></li>
                      <li className="list-default-item"><span>Level 7</span><span>1%</span></li>
                    </ul>
                    <div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-10 col-lg-6">
                <div className="tab-content ta-center">
                  <a className="nav-link active " href="#tabs-1-1" data-toggle="tab">22 % of the purchase amount</a>
                  <div className="tab-pane fade show active pt-154" id="tabs-1-1">
                    <div className="donut-chart" data-donut="[{ &quot;Title&quot;: &quot;Level 1 (10%)&quot;, &quot;Percentage&quot;: &quot;0.4&quot;, &quot;Fill&quot;: &quot;#00c12f&quot; }, 
                { &quot;Title&quot;: &quot;Level 2 (3%)&quot;, &quot;Percentage&quot;: &quot;0.15&quot;, &quot;Fill&quot;: &quot;#f4ec07&quot; },
                { &quot;Title&quot;: &quot;Level 3 (3%)&quot;, &quot;Percentage&quot;: &quot;0.15&quot;, &quot;Fill&quot;: &quot;#0056ab&quot; },
                { &quot;Title&quot;: &quot;Level 4 (2%)&quot;, &quot;Percentage&quot;: &quot;0.1&quot;, &quot;Fill&quot;: &quot;#f4a71a&quot; },
                { &quot;Title&quot;: &quot;Level 5 (2%)&quot;, &quot;Percentage&quot;: &quot;0.1&quot;, &quot;Fill&quot;: &quot;#b673ff&quot; },
                { &quot;Title&quot;: &quot;Level 6 (1%)&quot;, &quot;Percentage&quot;: &quot;0.05&quot;, &quot;Fill&quot;: &quot;#fa7a7a&quot; },
                { &quot;Title&quot;: &quot;Level 7 (1%)&quot;, &quot;Percentage&quot;: &quot;0.05&quot;, &quot;Fill&quot;: &quot;#00ffff&quot; }
                ]" data-thickness=".16">
                    </div>
                  </div>
                  <div className="tab-pane fade" id="tabs-1-2">
                    <div className="donut-chart" data-donut="[{ &quot;Title&quot;: &quot;ICO Token Supply&quot;, &quot;Percentage&quot;: &quot;0.14&quot;, &quot;Fill&quot;: &quot;#FFC670&quot; }, { &quot;Title&quot;: &quot;Reserve Fund&quot;, &quot;Percentage&quot;: &quot;0.21&quot;, &quot;Fill&quot;: &quot;#5BEDCA&quot; }, { &quot;Title&quot;: &quot;Team&quot;, &quot;Percentage&quot;: &quot;0.16&quot;, &quot;Fill&quot;: &quot;#CB5788&quot; }, { &quot;Title&quot;: &quot;Foundation&quot;, &quot;Percentage&quot;: &quot;0.2&quot;, &quot;Fill&quot;: &quot;#226295&quot; }, { &quot;Title&quot;: &quot;Advisor&quot;, &quot;Percentage&quot;: &quot;0.15&quot;, &quot;Fill&quot;: &quot;#57CCF2&quot; }, { &quot;Title&quot;: &quot;Community&quot;, &quot;Percentage&quot;: &quot;0.14&quot;, &quot;Fill&quot;: &quot;#D7ED98&quot; }]" data-thickness=".16" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="section section-md bg-white" id="user-center">
          <div className="container">
            <div className="row row-xl row-30 align-items-center justify-content-center">
              <div className="col-sm-6 col-md-4 col-lg-5 col-xl-6 wow fadeInLeft"><img src="images/image-9-569x640.jpg" alt="" width={569} height={640} />
              </div>
              <div className="col-md-8 col-lg-7 col-xl-6 wow fadeInRight">
                <div className="inset-bottom-xl-50">
                  <h3>What Properties of Trozia Function Similarly to Money?</h3>
                  <p>Generally, money has four functions:</p>
                  <div className="row row-sm row-30">
                    <div className="col-sm-6">
                      <article className="service-modern">
                        <div className="service-modern-icon"><span className="linearicons-credit-card" /></div>
                        <div className="heading-6 service-modern-title"><a href="#">A store of value</a></div>
                      </article>
                    </div>
                    <div className="col-sm-6">
                      <article className="service-modern">
                        <div className="service-modern-icon"><span className="linearicons-mouse-left" /></div>
                        <div className="heading-6 service-modern-title"><a href="#">A standard of deferred payment</a></div>
                      </article>
                    </div>
                    <div className="col-sm-6">
                      <article className="service-modern">
                        <div className="service-modern-icon"><span className="linearicons-shield-check" /></div>
                        <div className="heading-6 service-modern-title"><a href="#">A unit of account</a></div>
                      </article>
                    </div>
                    <div className="col-sm-6">
                      <article className="service-modern">
                        <div className="service-modern-icon"><span className="linearicons-group-work" /></div>
                        <div className="heading-6 service-modern-title"><a href="#">A medium of exchange</a></div>
                      </article>
                    </div>
                  </div>
                  <div className="group-xl group-middle justify-content-center offset-top-2"><a className="button button-isi button-primary" href="#">Trade TMT</a>
                    <div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="section section-lg section-inset-9 gradient-7 wave-wrap text-center" id="roadmap">
          <svg className="wave-1" width={1920} height={378} viewBox="0 0 1920 378" preserveAspectRatio="xMidYMid slice">
            <path className="wave-path wave-path-1" d="M0 209.5C0 209.5 251.5 96.3172 563.5 194.789C875.5 293.261 1045 83.319 1386.5 162.096C1728 240.873 1920 176 1920 176V426H0V209.5Z" />
            <path className="wave-path wave-path-2" d="M1920 140.986C1920 140.986 1668.5 -72.0314 1356.5 76.7238C1044.5 225.479 875 -91.667 533.5 27.3369C192 146.341 0 27.3369 0 27.3369V426H1920V140.986Z" />
          </svg>
          <div className="container">
            <h3 className="wow fadeInUp">Roadmap</h3>
            <p className="wow fadeInUp">Our roadmap is divided into various crucial stages that help us build a great Invest platform for you.</p>
            <div className="owl-carousel owl-style-4 owl-nav-2" data-items={2} data-sm-items={3} data-md-items={4} data-nav="true">
              <div className="timeline-modern">
                <time className="timeline-modern-time" dateTime={2019}>5.2020</time>
                <div className="timeline-modern-dot" />
                <div className="timeline-modern-title"><a href="#">Blockchain development</a></div>
              </div>
              <div className="timeline-modern">
                <time className="timeline-modern-time" dateTime={2019}>6.2020</time>
                <div className="timeline-modern-dot" />
                <div className="timeline-modern-title"><a href="#">Web development</a></div>
              </div>
              <div className="timeline-modern">
                <time className="timeline-modern-time" dateTime={2019}>7.2020</time>
                <div className="timeline-modern-dot" />
                <div className="timeline-modern-title"><a href="#">Launch of the project</a></div>
              </div>
              <div className="timeline-modern">
                <time className="timeline-modern-time" dateTime={2019}>8.2020</time>
                <div className="timeline-modern-dot" />
                <div className="timeline-modern-title"><a href="#">Integrating blockchain Ethereum</a></div>
              </div>
              <div className="timeline-modern">
                <time className="timeline-modern-time" dateTime={2019}>9.2020</time>
                <div className="timeline-modern-dot" />
                <div className="timeline-modern-title"><a href="#">Integrating LINK</a></div>
              </div>
              <div className="timeline-modern">
                <time className="timeline-modern-time" dateTime={2019}>10.2020</time>
                <div className="timeline-modern-dot" />
                <div className="timeline-modern-title"><a href="#">Airdrop: 20  : 1 USDN</a></div>
              </div>
              <div className="timeline-modern">
                <time className="timeline-modern-time" dateTime={2019}>11.2020</time>
                <div className="timeline-modern-dot" />
                <div className="timeline-modern-title"><a href="#">Airdrop: 18 TMT : 1 EURN</a></div>
              </div>
              <div className="timeline-modern">
                <time className="timeline-modern-time" dateTime={2019}>12.2020</time>
                <div className="timeline-modern-dot" />
                <div className="timeline-modern-title"><a href="#">Large partnerships</a></div>
              </div>
            </div><a className="button button-isi button-white wow fadeInUp" href="https://tronscan.org/#/contract/TBwz4F5bMntpM9urrZbDUr3jMzWFrKb9A5">contract</a>
            <br /><br /><br /><br /><br />
            <div className="container wow fadeInUp">
              <div className="footer-creative-brand">
                <a className="brand" href="index.html"><img className="brand-logo-light" src="assests/images/footer-logo.png" alt="" width={162} height={44} /></a>
              </div>
              <p className="soc">
                <a href="https://t.me/TRON_Money_Dapp" target="_blank"> <img src="assests/images/mail.png" alt="" width="26px" /></a>
              </p>
              <p className="rights text-center"><span>©&nbsp; </span><span className="copyright-year" /><span>.&nbsp;</span><span>TRON Money</span><span>.&nbsp;</span><span>All Rights Reserved.</span>
              </p>
            </div>
          </div>
        </section>
      </div>
      <div className="snackbars" id="form-output-global" />
    </div>
    )
  }





}




export default App;
