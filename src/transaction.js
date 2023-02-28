var Web3 = require("web3");

export function getWeb3(network) {
  if (network === "bsc") {
    return new Web3("https://data-seed-prebsc-1-s1.binance.org:8545");
  }

  if (network === "matic") {
    return new Web3("https://rpc-mumbai.maticvigil.com/");
  }

  if (network === "avax") {
    return new Web3("https://api.avax-test.network/ext/bc/C/rpc");
  }

  if (network === "ferrum") {
    return new Web3("http://testnet.dev.svcs.ferrumnetwork.io:9933");
  }

  return new Web3("http://testnet.dev.svcs.ferrumnetwork.io:9933");
}

export async function getBalance(network, address) {
  let web3 = getWeb3(network);
  var balance = web3.eth.getBalance(address); //Will give value in.
  balance = web3.toDecimal(balance);
  return balance;
}

export async function sendTx(sender, recipent, amount, pvt_key) {
  let web3 = getWeb3("ferrum");

  //getting the nonce value for the txn, include the pending parameter for duplicate errors
  var getNonce = await web3.eth.getTransactionCount(sender, "pending");

  let gasPriceInWei = web3.utils.toWei("50", "Gwei");
  console.log({ gasPriceInWei });

  var rawTx = {
    nonce: getNonce,
    gasPrice: web3.utils.toHex(gasPriceInWei),
    gasLimit: web3.utils.toHex(3000000),
    to: recipent,
    value: amount,
    data: 0x0,
  };

  //const account = web3.eth.accounts.privateKeyToAccount(pvt_key);
  const signed = await web3.eth.accounts.signTransaction(rawTx, pvt_key);
  console.log("signed");
  const receipt = await web3.eth.sendSignedTransaction(signed.rawTransaction);

  console.log(receipt);

  return receipt.transactionHash;
}

var human_standard_token_abi = [
  {
    constant: !0,
    inputs: [],
    name: "name",
    outputs: [{ name: "", type: "string" }],
    payable: !1,
    type: "function",
  },
  {
    constant: !0,
    inputs: [],
    name: "symbol",
    outputs: [{ name: "", type: "string" }],
    payable: !1,
    type: "function",
  },
  {
    constant: !0,
    inputs: [],
    name: "decimals",
    outputs: [{ name: "", type: "uint8" }],
    payable: !1,
    type: "function",
  },
  {
    constant: !0,
    inputs: [],
    name: "totalSupply",
    outputs: [{ name: "", type: "uint256" }],
    payable: !1,
    type: "function",
  },
  {
    constant: !0,
    inputs: [{ name: "_owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "balance", type: "uint256" }],
    payable: !1,
    type: "function",
  },
  {
    constant: !1,
    inputs: [
      { name: "_to", type: "address" },
      { name: "_value", type: "uint256" },
    ],
    name: "transfer",
    outputs: [{ name: "success", type: "bool" }],
    payable: !1,
    type: "function",
  },
  {
    constant: !1,
    inputs: [
      { name: "_from", type: "address" },
      { name: "_to", type: "address" },
      { name: "_value", type: "uint256" },
    ],
    name: "transferFrom",
    outputs: [{ name: "success", type: "bool" }],
    payable: !1,
    type: "function",
  },
  {
    constant: !1,
    inputs: [
      { name: "_spender", type: "address" },
      { name: "_value", type: "uint256" },
    ],
    name: "approve",
    outputs: [{ name: "success", type: "bool" }],
    payable: !1,
    type: "function",
  },
  {
    constant: !0,
    inputs: [
      { name: "_owner", type: "address" },
      { name: "_spender", type: "address" },
    ],
    name: "allowance",
    outputs: [{ name: "remaining", type: "uint256" }],
    payable: !1,
    type: "function",
  },
  {
    anonymous: !1,
    inputs: [
      { indexed: !0, name: "_from", type: "address" },
      { indexed: !0, name: "_to", type: "address" },
      { indexed: !1, name: "_value", type: "uint256" },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    anonymous: !1,
    inputs: [
      { indexed: !0, name: "_owner", type: "address" },
      { indexed: !0, name: "_spender", type: "address" },
      { indexed: !1, name: "_value", type: "uint256" },
    ],
    name: "Approval",
    type: "event",
  },
  {
    inputs: [
      { name: "_initialAmount", type: "uint256" },
      { name: "_tokenName", type: "string" },
      { name: "_decimalUnits", type: "uint8" },
      { name: "_tokenSymbol", type: "string" },
    ],
    payable: !1,
    type: "constructor",
  },
  {
    constant: !1,
    inputs: [
      { name: "_spender", type: "address" },
      { name: "_value", type: "uint256" },
      { name: "_extraData", type: "bytes" },
    ],
    name: "approveAndCall",
    outputs: [{ name: "success", type: "bool" }],
    payable: !1,
    type: "function",
  },
  {
    constant: !0,
    inputs: [],
    name: "version",
    outputs: [{ name: "", type: "string" }],
    payable: !1,
    type: "function",
  },
];

export async function sendTokenTx(network, sender, token_contract_addr, recipent, amount, pvt_key) {
  let web3 = getWeb3(network);

  //getting the nonce value for the txn, include the pending parameter for duplicate errors
  var getNonce = await web3.eth.getTransactionCount(sender, "pending");

  let gasPriceInWei = web3.utils.toWei("50", "Gwei");
  console.log({ gasPriceInWei });

  var contract = new web3.eth.Contract(human_standard_token_abi, token_contract_addr, {
    from: sender,
  });

  console.log("contract ready");

  const payload = contract.methods.transfer(recipent, amount).encodeABI();
  const recipentAddress = token_contract_addr;

  var rawTx = {
    nonce: getNonce,
    gasPrice: web3.utils.toHex(gasPriceInWei),
    gasLimit: web3.utils.toHex(3000000),
    to: recipentAddress,
    value: "0x0",
    data: payload,
  };

  //const account = web3.eth.accounts.privateKeyToAccount(pvt_key);
  const signed = await web3.eth.accounts.signTransaction(rawTx, pvt_key);
  console.log("signed");
  const receipt = await web3.eth.sendSignedTransaction(signed.rawTransaction);

  console.log(receipt);

  return receipt.transactionHash;
}
