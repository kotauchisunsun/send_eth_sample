// 1eth = 22万円
// 1eth = 220000
// 1eth = 1000000000000000000 wei
          0.0012626442599999999
// 1,000円 = 0.0045 eth
const Web3 = require('web3');

function convertEthToYen(eth) { 
    const bid = 203446;
    const ask = 208597;
    const avg = (bid + ask) / 2;
    
    return eth * avg;    
}

function writeElementText(id, value) { 
    document.getElementById(id).innerText = `${id}: ${value}`;
}

function setElementText(id,value) { 
    document.getElementById(id).innerText = value;
}

function hideElement(id) { 
    const el = document.getElementById(id);
    el.style.display = "none";
}

function showElement(id) { 
    const el = document.getElementById(id);
    el.style.display = "block";
}

function setBalance(eth) { 
    const el = document.getElementById("accountDetail");
    const yen = parseInt(convertEthToYen(eth)).toLocaleString();
    const printEth = parseFloat(eth).toFixed(5);
    el.innerText = `残高: ¥${yen}(${printEth}ETH)`;
}

const params = new URLSearchParams(document.location.search.substring(1));
const shopName = params.get("shopName");
const to = params.get("to");
const eth = parseFloat(params.get("eth")).toFixed(18);
const wei = Web3.utils.toWei(eth, 'ether');

const button = document.getElementById("pay");
button.disabled = true;

hideElement("payCompleted");

setElementText("shopName", shopName);
//writeElementText("to",  to);
setElementText("sendEth", parseFloat(eth).toFixed(5));
setElementText("sendYen", parseInt(convertEthToYen(parseFloat(eth))));

const provider = window.ethereum;
const web3 = new Web3(provider);

web3.eth.requestAccounts().then(result => { 
    const address = result[0];
    console.log(address);
    //writeElementText("account", address);

    web3.eth.net.getId().then(
        (id) => { 
            if (id != 4) {
                alert("Select Account Rikeby Network!!");
                return;
            }
      
            web3.eth.getBalance(address)
            .then(
                (balanceWei) => {
                    const balanceEth = Web3.utils.fromWei(balanceWei);
                    setBalance(balanceEth);
                }
            );

            button.disabled = false;
            button.onclick = () => {
                button.disabled = true;

                hideElement("paySection");
                showElement("paying");

                web3.eth.sendTransaction(
                    {
                        "from": address,
                        "to": to,
                        "value": wei
                    }
                ).then(
                    (result) => {
                        const { transactionHash, gasUsed } = result;
                        //writeElementText("transactionHash", transactionHash);
                        //writeElementText("gasUsed", gasUsed);
                        console.log(result);
                        setElementText("shopHeader", "購入完了");
                        hideElement("paying");
                        showElement("payCompleted");
                        
                        web3.eth.getBalance(address)
                        .then(
                            (balanceWei) => {
                                const balanceEth = Web3.utils.fromWei(balanceWei);
                                setBalance(balanceEth);
                            }
                        );
                    }
                );
            };
        }
    );
});
