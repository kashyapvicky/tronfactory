// import contracts from 'config/contracts';

//const contract = contracts['TRXMessages.sol:TRXMessages'];


const utils = {
    tronWeb: false,
    contract: false,

    setTronWeb(tronWeb) {

         const contract_abi = [{"constant":false,"inputs":[],"name":"withdraw_referral","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"devCommission","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"withdraw","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalPayout","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"commissionDivisor","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"totalInvested","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_address","type":"address"}],"name":"updateFeed1","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getContractBalance","outputs":[{"name":"cBal","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_address","type":"address"}],"name":"updateFeed2","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_addr","type":"address"}],"name":"getProfit","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"totalRefDistributed","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"players","outputs":[{"name":"trxDeposit","type":"uint256"},{"name":"time","type":"uint256"},{"name":"j_time","type":"uint256"},{"name":"interestProfit","type":"uint256"},{"name":"affRewards","type":"uint256"},{"name":"payoutSum","type":"uint256"},{"name":"affFrom","type":"address"},{"name":"td_team","type":"uint256"},{"name":"td_business","type":"uint256"},{"name":"reward_earned","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"preferals","outputs":[{"name":"player_addr","type":"address"},{"name":"aff1sum","type":"uint256"},{"name":"aff2sum","type":"uint256"},{"name":"aff3sum","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_affAddr","type":"address"}],"name":"deposit","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[],"name":"totalPlayers","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"reinvest","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"}];
         const contract_address = 'TNpE8QNmfiRbXxwSFzPWwyuig8TzHbAbkE';
        // const contract_abi = [{"constant":true,"inputs":[],"name":"devCommission","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"withdraw","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalPayout","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_MinuteRate","type":"uint256"}],"name":"setMinuteRate","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"spider","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"commissionDivisor","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"totalInvested","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_address","type":"address"}],"name":"updateFeed1","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_address","type":"address"}],"name":"updateFeed2","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_ReleaseTime","type":"uint256"}],"name":"setReleaseTime","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_addr","type":"address"}],"name":"getProfit","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_setTron","type":"uint256"}],"name":"setTronamt","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalRefDistributed","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"players","outputs":[{"name":"trxDeposit","type":"uint256"},{"name":"time","type":"uint256"},{"name":"j_time","type":"uint256"},{"name":"interestProfit","type":"uint256"},{"name":"affRewards","type":"uint256"},{"name":"payoutSum","type":"uint256"},{"name":"affFrom","type":"address"},{"name":"td_team","type":"uint256"},{"name":"td_business","type":"uint256"},{"name":"reward_earned","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"preferals","outputs":[{"name":"player_addr","type":"address"},{"name":"aff1sum","type":"uint256"},{"name":"aff2sum","type":"uint256"},{"name":"aff3sum","type":"uint256"},{"name":"aff4sum","type":"uint256"},{"name":"aff5sum","type":"uint256"},{"name":"aff6sum","type":"uint256"},{"name":"aff7sum","type":"uint256"},{"name":"aff8sum","type":"uint256"},{"name":"aff9sum","type":"uint256"},{"name":"aff10sum","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_affAddr","type":"address"}],"name":"deposit","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[],"name":"totalPlayers","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"reinvest","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"}];
        // const contract_address = 'TLMNQt5si9P6LmGk3c69Zsz2pMX7MtNTWH';


       // console.log('tonwebb object',tronWeb);
       // const  tronlink_address = tronWeb.defaultAddress;
        //console.log('tronlink_address_in_utils',tronWeb.defaultAddress);
   //   this.setState({ tronlink_address: tronlink_address });
        //console.log('contract_address',contract_address);
        this.tronWeb = tronWeb;
        
        this.contract = tronWeb.contract(contract_abi, contract_address);
        console.log('deployed contract instance',this.contract);
    },

    // transformMessage(message) {
    //     return {
    //         tips: {
    //             amount: message.tips,
    //             count: message.tippers.toNumber()
    //         },
    //         owner: this.tronWeb.address.fromHex(message.creator),
    //         timestamp: message.time.toNumber(),
    //         message: message.message
    //     }
    // },

    // async fetchMessages(recent = {}, featured = []) {
    //     // Try to fetch messageID's of top 20 tipped messages (or until there are no more)
    //     for(let i = 0; i < 20; i++) {
    //         const message = await this.contract.topPosts(i).call();

    //         if(message.toNumber() === 0)
    //             break; // End of tips array

    //         featured.push(
    //             message.toNumber()
    //         );
    //     }

    //     // Fetch Max(30) most recent messages
    //     const totalMessages = (await this.contract.current().call()).toNumber();
    //     const min = Math.max(1, totalMessages - 30);

    //     const messageIDs = [ ...new Set([
    //         ...new Array(totalMessages - min).fill().map((_, index) => min + index),
    //         ...featured
    //     ])];

    //     await Promise.all(messageIDs.map(messageID => (
    //         this.contract.messages(messageID).call()
    //     ))).then(messages => messages.forEach((message, index) => {
    //         const messageID = +messageIDs[index];

    //         recent[messageID] = this.transformMessage(message);
    //     }));

    //     return {
    //         featured,
    //         recent
    //     };
    // },

//     async fetchMessage(messageID, { recent = {}, featured = [] }) {
//         const message = await this.contract.messages(messageID).call();
//         const vulnerable = Object.keys(recent).filter(messageID => (
//             !featured.includes(messageID)
//         )).sort((a, b) => (
//             recent[b].timestamp - recent[a].timestamp
//         ));

//         recent[messageID] = this.transformMessage(message);

//         if(vulnerable.length > 30) {
//             const removed = vulnerable.splice(0, vulnerable.length - 30);

//             removed.forEach(messageID => {
//                 delete recent[messageID];
//             });
//         }

//         return {
//             message: recent[messageID],
//             recent,
//             featured
//         };
//     }
};

export default utils;