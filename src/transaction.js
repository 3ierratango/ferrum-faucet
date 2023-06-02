import { web3Accounts, web3Enable, web3FromAddress } from "@polkadot/extension-dapp";
import { ContractPromise } from "@polkadot/api-contract";
import { BN, BN_ONE } from "@polkadot/util";
const { ApiPromise, WsProvider, HttpProvider } = require("@polkadot/api");
var Web3 = require("web3");
let client_ink_metadata = require("./client_ink_metadata.json");
let client_evm_metadata = require("./client_evm_metadata.json");
let miner_stake_metadata = require("./miner_stake_metadata.json");

const client_evm_contract_address = "0xde66E5401477B35EF297da8cd9B2097c53FB3d1F";
const master_evm_contract_address = "0x9ff7ed60e5fd10977677c1258b376c8fa8e09422";
const ferrum_address = "0xF3B61752E52B92BB0B8bF9eBb4FE487B8fD1047C";
const ink_contract_address = "bHwbNUhyR7wv5BTZiBwoDq4PC3fnECu1AKZv2nAjUB4Vwr5";

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

export async function sendContract(amount, network) {
  if (network === "astar") {
    await sendContractAstar(amount);
  } else {
    await sendContractEvm(amount);
  }
}

export async function sendContractEvm(amount) {
  if (window.ethereum) {
    window.web3 = new Web3(window.ethereum);
    await window.ethereum.enable();
    const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
    console.log(accounts);

    let web3 = new Web3(window.web3);
    var contract = new web3.eth.Contract(client_evm_metadata, client_evm_contract_address);
    var getNonce = await web3.eth.getTransactionCount(accounts[0], "pending");
    const payload = contract.methods.stake(ferrum_address, "1", 0).encodeABI();
    const recipentAddress = client_evm_contract_address;

    let gasPriceInWei = web3.utils.toWei("50", "Gwei");
    console.log({ gasPriceInWei });

    var rawTx = {
      from: accounts[0],
      nonce: getNonce,
      gasPrice: web3.utils.toHex(gasPriceInWei),
      gasLimit: web3.utils.toHex(3000000),
      to: recipentAddress,
      value: "0x0",
      data: payload,
    };

    const receipt = await web3.eth.sendTransaction(rawTx);

    console.log(receipt);

    return receipt.transactionHash;
  }
}

export async function sendContractMinerStake(amount, network, address) {
  if (window.ethereum) {
    window.web3 = new Web3(window.ethereum);
    await window.ethereum.enable();
    const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
    console.log(accounts);

    // to stake as a miner, we send the amount to the contract
    // then stake
    console.log(address);
    let web3 = new Web3(window.web3);
    var getNonce = await web3.eth.getTransactionCount(accounts[0], "pending");
    var ferrum_token_contract = new web3.eth.Contract(human_standard_token_abi, ferrum_address);

    const transferpayload = ferrum_token_contract.methods.transfer(address, "200").encodeABI();
    const transferrecipentAddress = ferrum_address;

    let gasPriceInWei = web3.utils.toWei("50", "Gwei");
    console.log({ gasPriceInWei });

    var rawTx = {
      from: accounts[0],
      nonce: getNonce,
      gasPrice: web3.utils.toHex(gasPriceInWei),
      gasLimit: web3.utils.toHex(3000000),
      to: transferrecipentAddress,
      value: "0x0",
      data: transferpayload,
    };

    const transferreceipt = await web3.eth.sendTransaction(rawTx);

    console.log(transferreceipt);


    var miner_stake_contract = new web3.eth.Contract(miner_stake_metadata, address);
    var getNonce = await web3.eth.getTransactionCount(accounts[0], "pending");
    const payload = miner_stake_contract.methods.stake(accounts[0], ferrum_address).encodeABI();
    const recipentAddress = address;

    var rawTx = {
      from: accounts[0],
      nonce: getNonce,
      gasPrice: web3.utils.toHex(gasPriceInWei),
      gasLimit: web3.utils.toHex(3000000),
      to: recipentAddress,
      value: "0x0",
      data: payload,
    };

    const receipt = await web3.eth.sendTransaction(rawTx);

    console.log(receipt);

    return receipt.transactionHash;
  }
}

export async function sendContractMinerDelegate(miner, network, address) {
  if (window.ethereum) {
    window.web3 = new Web3(window.ethereum);
    await window.ethereum.enable();
    const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
    console.log(accounts);

    // to stake as a miner, we send the amount to the contract
    // then stake
    console.log(address);
    console.log({miner});
    let web3 = new Web3(window.web3);
    var miner_stake_contract = new web3.eth.Contract(miner_stake_metadata, address);
    var getNonce = await web3.eth.getTransactionCount(accounts[0], "pending");
    const payload = miner_stake_contract.methods.delegate(miner).encodeABI();
    const recipentAddress = address;

    let gasPriceInWei = web3.utils.toWei("50", "Gwei");
    console.log({ gasPriceInWei });

    var rawTx = {
      from: accounts[0],
      nonce: getNonce,
      gasPrice: web3.utils.toHex(gasPriceInWei),
      gasLimit: web3.utils.toHex(3000000),
      to: recipentAddress,
      value: "0x0",
      data: payload,
    };

    const receipt = await web3.eth.sendTransaction(rawTx);

    console.log(receipt);

    return receipt.transactionHash;
  }
}

export async function sendWithdrawMinerRewards(miner, network, address) {
  if (window.ethereum) {
    window.web3 = new Web3(window.ethereum);
    await window.ethereum.enable();
    const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
    console.log(accounts);

    // to stake as a miner, we send the amount to the contract
    // then stake
    console.log(address);
    console.log({miner});
    let web3 = new Web3(window.web3);
    var miner_stake_contract = new web3.eth.Contract(miner_stake_metadata, address);
    var getNonce = await web3.eth.getTransactionCount(accounts[0], "pending");
    const payload = miner_stake_contract.methods.delegate(miner).encodeABI();
    const recipentAddress = address;

    let gasPriceInWei = web3.utils.toWei("50", "Gwei");
    console.log({ gasPriceInWei });

    var rawTx = {
      from: accounts[0],
      nonce: getNonce,
      gasPrice: web3.utils.toHex(gasPriceInWei),
      gasLimit: web3.utils.toHex(3000000),
      to: recipentAddress,
      value: "0x0",
      data: payload,
    };

    const receipt = await web3.eth.sendTransaction(rawTx);

    console.log(receipt);

    return receipt.transactionHash;
  }
}

export async function sendWithdrawAuthorityRewards(miner, network, address) {
  if (window.ethereum) {
    window.web3 = new Web3(window.ethereum);
    await window.ethereum.enable();
    const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
    console.log(accounts);

    // to stake as a miner, we send the amount to the contract
    // then stake
    console.log(address);
    console.log({miner});
    let web3 = new Web3(window.web3);
    var miner_stake_contract = new web3.eth.Contract(miner_stake_metadata, address);
    var getNonce = await web3.eth.getTransactionCount(accounts[0], "pending");
    const payload = miner_stake_contract.methods.delegate(miner).encodeABI();
    const recipentAddress = address;

    let gasPriceInWei = web3.utils.toWei("50", "Gwei");
    console.log({ gasPriceInWei });

    var rawTx = {
      from: accounts[0],
      nonce: getNonce,
      gasPrice: web3.utils.toHex(gasPriceInWei),
      gasLimit: web3.utils.toHex(3000000),
      to: recipentAddress,
      value: "0x0",
      data: payload,
    };

    const receipt = await web3.eth.sendTransaction(rawTx);

    console.log(receipt);

    return receipt.transactionHash;
  }
}

export async function sendContractAstar(amount) {
  const allInjected = await web3Enable("Ferrum Multichain Staking");
  const allAccounts = await web3Accounts();
  let web3 = await web3FromAddress(allAccounts[0].address);
  const provider = new WsProvider("wss://shibuya-rpc.dwellir.com");
  const api = await ApiPromise.create({ provider });

  const MAX_CALL_WEIGHT = new BN(9000000000).isub(BN_ONE);
  const PROOFSIZE = new BN(1000000);

  // The address is the actual on-chain address as ss58 or AccountId object.
  const contract = new ContractPromise(api, client_ink_metadata, ink_contract_address);

  const value = 0; // only for payable messages, call will fail otherwise
  const gasLimit = await api?.registry.createType("WeightV2", {
    refTime: MAX_CALL_WEIGHT,
    proofSize: PROOFSIZE,
  });
  const storageDepositLimit = null;

  const { gasRequired } = await contract.query.stake(
    allAccounts[0].address,
    {
      gasLimit: api?.registry.createType("WeightV2", {
        refTime: MAX_CALL_WEIGHT,
        proofSize: PROOFSIZE,
      }),
      storageDepositLimit,
    },
    amount,
    0
  );
  console.log(gasRequired.toHuman());

  let actualgasLimit = api?.registry.createType("WeightV2", gasRequired);

  let hash = await contract.tx
    .stake({ storageDepositLimit, gasLimit: actualgasLimit }, amount, 0)
    .signAndSend(allAccounts[0].address, { signer: web3.signer }, (status) => {});

  console.log(hash.toString());
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
