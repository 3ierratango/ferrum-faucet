import React, { useState } from "react";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Dropdown from "react-bootstrap/Dropdown";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import { sendTx, sendTokenTx, getBalance } from "./transaction";
import ClipLoader from "react-spinners/ClipLoader";
import "./App.css";

class NameForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: "",
      network: "ferrum",
      address: "",
      tx_hash: "",
      faucet_balance: "",
      faucet_address: "0x25451a4de12dccc2d166922fa938e900fcc4ed24",
      token_contract_address: "0xF3B61752E52B92BB0B8bF9eBb4FE487B8fD1047C",
      error: "",
      loading: false
    };

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
  }

  changeDropdown = (eventkey) => {
    this.setState({ network: eventkey });
  };

  getBalance = async (address) => {
    if (this.state.network == "ferrum") {
      let balance = await getBalance(address);
      return balance;
    }
  };

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

  transferBalance = async (address) => {
    this.setState({ loading: true, tx_hash : "", error : "" });
    if (this.state.network == "ferrum") {
      let tx_hash = await sendTx(
        this.state.faucet_address,
        this.state.address,
        "1000000000000000000",
        "0x79c3b7fc0b7697b9414cb87adcb37317d1cab32818ae18c0e97ad76395d1fdcf"
      );
      console.log(tx_hash);
      this.setState({ tx_hash: tx_hash, loading: false });
    } else {
      try {
        let tx_hash = await sendTokenTx(
          this.state.network,
          this.state.faucet_address,
          this.state.token_contract_address,
          this.state.address,
          "1000000000000000000",
          "0x79c3b7fc0b7697b9414cb87adcb37317d1cab32818ae18c0e97ad76395d1fdcf"
        );
        console.log(tx_hash);
        this.setState({ tx_hash: tx_hash, loading: false });
      } catch (err) {
        this.setState({ error: String(err), loading: false });
      }
    }
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

    if (eventkey === "ferrum") {
      return "Ferrum Testnet";
    }

    return "Select a network";
  };

  render() {
    return (
      <Container className="p-1">
        <Container className="p-5 mb-4 bg-light rounded-3">
          <p> Faucet Address : {this.state.faucet_address} </p>
          <p>
            {" "}
            Selected Network :{" "}
            <Dropdown onSelect={this.changeDropdown}>
              <Dropdown.Toggle variant="success" id="dropdown-basic">
                {this.networkToNetworkName(this.state.network)}
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item eventKey="ferrum">Ferrum Testnet</Dropdown.Item>
                <Dropdown.Item eventKey="bsc">BSC Testnet</Dropdown.Item>
                <Dropdown.Item eventKey="matic">MATIC Testnet</Dropdown.Item>
                <Dropdown.Item eventKey="avax">Avalanche Testnet</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </p>
          <label>Address:</label>
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
              onClick={() => this.transferBalance(this.state.address)}
            >
              Get 1tFRM
            </Button>
          </InputGroup>
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
      <h1 className="header">Ferrum Testnet Faucet</h1>
      <p>This faucet will dispense tFRM tokens on all deployed testnets : </p>
      <p>1. Select the Network you would like to request tFRM</p>
      <p>2. Input address and submit transaction</p>
    </Container>
    <NameForm></NameForm>
  </Container>
);

export default App;
