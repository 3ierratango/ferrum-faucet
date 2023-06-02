import React, { useState } from "react";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Dropdown from "react-bootstrap/Dropdown";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import { sendContract, getBalance, sendContractMinerStake, sendContractMinerDelegate, sendWithdrawMinerRewards, sendWithdrawAuthorityRewards } from "./transaction";
import ClipLoader from "react-spinners/ClipLoader";
import "./App.css";
import { web3Accounts, web3Enable, web3FromAddress } from '@polkadot/extension-dapp';

class NameForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: "",
      network: "ferrum",
      address: "",
      tx_hash: "",
      faucet_balance: "",
      client_staking_address: "",
      master_staking_address: "0xB1CcE8e7039395348283cbb267007351a7777876",
      token_contract_address: "0xF3B61752E52B92BB0B8bF9eBb4FE487B8fD1047C",
      miner_manager_address: "0xf8f6B2D20698a1Fc0409510Ed95E920da772579D",
      authority_manager_address: "0x9815A11F93a1279344b7374A7c2daf4cA73C542f",
      miner_staking_address: "",
      error: "",
      loading: false,
      show_miner_fee: false,
      miner_fixed_fee: 0,
      miner_variable_fee: 0,
      show_authority_fee: false,
      authority_fixed_fee: 0,
      authority_variable_fee: 0
    };

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
  }

  changeDropdown = (eventkey) => {
    this.setState({ network: eventkey });
    this.setClientStakingAddress(eventkey);
    this.setMinerStakingAdress(eventkey);
  };

  getBalance = async (address) => {
    if (this.state.network == "ferrum") {
      let balance = await getBalance(address);
      return balance;
    }
  };

  setClientStakingAddress = (network) => {
    console.log(network);
    if (network == "astar") {
      this.setState({client_staking_address : "Zuks8Jkib9NVneMhXpBpLERnBuSHcr2G92noPk5Y9PGd56i"});
      return;
    }
    this.setState({client_staking_address : "0xde66E5401477B35EF297da8cd9B2097c53FB3d1F"}) 
  }

  setMinerStakingAdress = (network) => {
    console.log(network);
    if (network == "bsc") {
      this.setState({miner_staking_address : "0x2Ee5bB948fa0A1C45EE2E60f3532970deD6232F4"});
      return;
    }
    this.setState({miner_staking_address : "0xC5411B9AF94A39Fd351410Df908e682606ffDFcB"}) 
  }

  getExplorerLink = (hash) => {
    if (this.state.network == "ferrum") {
      return "https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Ftestnet.dev.svcs.ferrumnetwork.io#/explorer"
    }

    if (this.state.network === "bsc") {
      return "https://testnet.bscscan.com/tx/" + hash;
    }
  
    if (this.state.network === "matic") {
      return "https://mumbai.polygonscan.com/tx/" + hash;
    }
  
    if (this.state.network === "avax") {
      return "https://testnet.snowtrace.io/tx/" + hash;
    }
  }

  clientStake = async (address) => {
    this.setState({ loading: true, tx_hash : "", error : "" });
      let tx_hash = await sendContract(
        this.state.address,
        this.state.network
      );
      console.log(tx_hash);
      this.setState({ tx_hash: tx_hash, loading: false });

  };

  minerStake = async (address) => {
    this.setState({ loading: true, tx_hash : "", error : "" });
      let tx_hash = await sendContractMinerStake(
        this.state.address,
        this.state.network,
        this.state.miner_staking_address
      );
      console.log(tx_hash);
      this.setState({ tx_hash: tx_hash, loading: false });

  };

  minerDelegate = async (address) => {
    this.setState({ loading: true, tx_hash : "", error : "" });
      let tx_hash = await sendContractMinerDelegate(
        this.state.address,
        this.state.network,
        this.state.miner_staking_address
      );
      console.log(tx_hash);
      this.setState({ tx_hash: tx_hash, loading: false });

  };

  minerWithdraw = async (address, withdraw) => {
    this.setState({ loading: true });
      let tx_hash = await sendContractMinerDelegate(
        this.state.address,
        this.state.network,
        this.state.miner_staking_address
      );
      await new Promise((resolve)=>setTimeout(resolve,1000));
      this.setState({ loading: false, miner_fixed_fee : 0, miner_variable_fee : 0, show_miner_fee : true });
  };

  authorityWithdraw = async (address) => {
    this.setState({ loading: true });
      // let tx_hash = await sendContractMinerDelegate(
      //   this.state.address,
      //   this.state.network,
      //   this.state.miner_staking_address
      // );
      await new Promise((resolve)=>setTimeout(resolve,1000));
      this.setState({ loading: false, authority_fixed_fee : 0, authority_variable_fee : 0, show_authority_fee : true });
  };

  networkToNetworkName = (eventkey) => {
    if (eventkey === "bsc") {
      return "BSC Testnet";
    }

    if (eventkey === "matic") {
      return "MATIC Testnet";
    }

    if (eventkey === "avax") {
      return "AVAX Testnet";
    }

    if (eventkey === "astar") {
      return "Shibuya Testnet";
    }

    return "Select a network";
  };

  render() {
    return (
      <Container className="p-1">
        <Container className="p-5 mb-4 bg-light rounded-3">
          <p>
            {" "}
            Selected Client Network :{" "}
            <Dropdown onSelect={this.changeDropdown}>
              <Dropdown.Toggle variant="success" id="dropdown-basic">
                {this.networkToNetworkName(this.state.network)}
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item eventKey="bsc">BSC Testnet</Dropdown.Item>
                <Dropdown.Item eventKey="matic">MATIC Testnet</Dropdown.Item>
                <Dropdown.Item eventKey="astar">Shibuya Testnet</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </p>
          <h2>Client Contract</h2>
          <p> Client Staking Contract : {this.state.client_staking_address} </p>
          <label>Amount:</label>
          <InputGroup className="mb-3">
            <Form.Control
              placeholder="Amount"
              aria-label="Amount"
              aria-describedby="basic-addon2"
              onChange={(event) => {
                this.setState({
                  address: event.target.value,
                });
              }}
            />
            <Button
              variant="warning"
              id="button-addon2"
              onClick={() => this.clientStake(this.state.address)}
            >
              Stake
            </Button>
          </InputGroup>

          <br /><br /><br /><br />
          <h2>Master Contract</h2>
          <p> Master Staking Contract : {this.state.master_staking_address} </p>
            <Button
              variant="warning"
              id="button-addon2"
              onClick={() => this.clientStake(this.state.address)}
            >
              Close Position
            </Button>

            <br /><br /><br /><br /><br /><br />
          <h2>Miner Stake</h2>
          Selected Client Network :{" "}
            <Dropdown onSelect={this.changeDropdown}>
              <Dropdown.Toggle variant="success" id="dropdown-basic">
                {this.networkToNetworkName(this.state.network)}
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item eventKey="bsc">BSC Testnet</Dropdown.Item>
                <Dropdown.Item eventKey="matic">MATIC Testnet</Dropdown.Item>
                <Dropdown.Item eventKey="astar">Shibuya Testnet</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            <p> Miner Staking Contract : {this.state.miner_staking_address} </p>
          <label>Amount:</label>
          <InputGroup className="mb-3">
            <Form.Control
              placeholder="Amount"
              aria-label="Amount"
              aria-describedby="basic-addon2"
              onChange={(event) => {
                this.setState({
                  address: event.target.value,
                });
              }}
            />
            <Button
              variant="warning"
              id="button-addon2"
              onClick={() => this.minerStake(this.state.address)}
            >
              Stake
            </Button>
          </InputGroup>

          <br /><br /><br /><br /><br /><br />
          <h2>Miner Stake Delegate</h2>
          Selected Client Network :{" "}
            <Dropdown onSelect={this.changeDropdown}>
              <Dropdown.Toggle variant="success" id="dropdown-basic">
                {this.networkToNetworkName(this.state.network)}
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item eventKey="bsc">BSC Testnet</Dropdown.Item>
                <Dropdown.Item eventKey="matic">MATIC Testnet</Dropdown.Item>
                <Dropdown.Item eventKey="astar">Shibuya Testnet</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            <p> Miner Staking Contract : {this.state.miner_staking_address} </p>
          <label>Miner Address:</label>
          <InputGroup className="mb-3">
            <Form.Control
              placeholder="Address"
              aria-label="Address"
              aria-describedby="basic-addon2"
              onChange={(event) => {
                this.setState({
                  address: event.target.value,
                });
              }}
            />
            <Button
              variant="warning"
              id="button-addon2"
              onClick={() => this.minerDelegate(this.state.address)}
            >
              Delegate
            </Button>
          </InputGroup>

          <br /><br /><br /><br /><br /><br />
          <h2>Withdraw Miner Rewards</h2>
          Selected Client Network :{" "}
            <Dropdown onSelect={this.changeDropdown}>
              <Dropdown.Toggle variant="success" id="dropdown-basic">
                {this.networkToNetworkName(this.state.network)}
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item eventKey="bsc">BSC Testnet</Dropdown.Item>
                <Dropdown.Item eventKey="matic">MATIC Testnet</Dropdown.Item>
                <Dropdown.Item eventKey="astar">Shibuya Testnet</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            <p> Miner Manager Contract : {this.state.miner_manager_address} </p>
          <label>Miner Address:</label>
          <InputGroup className="mb-3">
            <Form.Control
              placeholder="Address"
              aria-label="Address"
              aria-describedby="basic-addon2"
              onChange={(event) => {
                this.setState({
                  address: event.target.value,
                });
              }}
            />
            <Button
              variant="warning"
              id="button-addon2"
              onClick={() => this.minerWithdraw()}
            >
              {this.state.show_miner_fee ? "Withdraw" : "Enquire"}
            </Button>
          </InputGroup>
          <br />
          {this.state.show_miner_fee && <div>
            <br />
            Collected Fixed Fee : {this.state.miner_fixed_fee}
            <br />
            Collected Variable fee : {this.state.miner_variable_fee}
            <br />
            Total Fee : {this.state.miner_variable_fee + this.state.miner_fixed_fee}
          </div>}

          <br /><br /><br /><br /><br /><br />
          <h2>Withdraw Authority Rewards</h2>
          Selected Client Network :{" "}
            <Dropdown onSelect={this.changeDropdown}>
              <Dropdown.Toggle variant="success" id="dropdown-basic">
                {this.networkToNetworkName(this.state.network)}
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item eventKey="bsc">BSC Testnet</Dropdown.Item>
                <Dropdown.Item eventKey="matic">MATIC Testnet</Dropdown.Item>
                <Dropdown.Item eventKey="astar">Shibuya Testnet</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            <p> Autority Manager Contract : {this.state.authority_manager_address} </p>
          <label>Authority Address:</label>
          <InputGroup className="mb-3">
            <Form.Control
              placeholder="Address"
              aria-label="Address"
              aria-describedby="basic-addon2"
              onChange={(event) => {
                this.setState({
                  address: event.target.value,
                });
              }}
            />
            <Button
              variant="warning"
              id="button-addon2"
              onClick={() => this.authorityWithdraw()}
            >
              {this.state.show_authority_fee ? "Withdraw" : "Enquire"}
            </Button>
          </InputGroup>
          <br />
          {this.state.show_authority_fee && <div>
            <br />
            Collected Fixed Fee : {this.state.authority_fixed_fee}
            <br />
            Collected Variable fee : {this.state.authority_variable_fee}
            <br />
            Total Fee : {this.state.authority_variable_fee + this.state.authority_fixed_fee}
          </div>}

          {this.state.loading && <ClipLoader size={50} aria-label="Loading Spinner" data-testid="loader" /> }
          {this.state.tx_hash && <label>Success! TX Hash : <a href={this.getExplorerLink(this.state.tx_hash)}>{this.state.tx_hash}</a> </label>}
          {this.state.error && <label>Error : {this.state.error} </label>}
        </Container>
      </Container>
    );
  }
}

const App = () => (
  <Container className="p-3">
    <Container className="p-5 mb-4 bg-light rounded-3">
      <h1 className="header">Ferrum MultiChain Staking</h1>
      {/* <p>This faucet will dispense tFRM tokens on all deployed testnets : </p>
      <p>1. Select the Network you would like to request tFRM</p>
      <p>2. Input address and submit transaction</p> */}
    </Container>
    <NameForm></NameForm>
  </Container>
);

export default App;
