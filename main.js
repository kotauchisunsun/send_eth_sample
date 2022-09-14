// 1eth = 22万円
// 1eth = 220000
// 1eth = 1,000,000,000,000,000,000 wei
// 1,000円 = 0.0045 eth

const params = new URLSearchParams(document.location.search.substring(1));
const to = params.get("to");
const eth = params.get("eth");
const wei = Web3.utils.toWei(eth, 'ether');
console.log(to);
console.log(eth);

document.getElementById("to").innerText = "to: " + to;
document.getElementById("eth").innerText = "eth: " + eth;
document.getElementById("yen").innerText = "yen: " + parseFloat(eth) * 220000;

const provider = window.ethereum;
const web3 = new Web3(provider);

web3.eth.requestAccounts().then(result => { 
    const address = result[0];
    console.log(address);
    web3.eth.sendTransaction(
        {
            "from": address,
            "to": to,
            "value": wei,
            "chain": "rinkeby"
        }
    );
});
