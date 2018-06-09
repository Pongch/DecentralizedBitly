import React, { Component } from 'react'
import PersistentBit from '../build/contracts/PersistentBit.json'
import SimpleStorageContract from '../build/contracts/SimpleStorage.json'
import getWeb3 from './utils/getWeb3'
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Link
} from 'react-router-dom'
import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'
import 'materialize-css';
import 'materialize-css/dist/css/materialize.min.css';
import {Row, Input, Button} from 'react-materialize'



class main extends Component {
  
  constructor(props) {
    super(props)

    this.state = {
      storageValue: 0,
      web3: null,
      shortUrl: "",
      longUrl:""
    }
    this.newUrl = this.newUrl.bind(this);
    this.setShortUrl = this.setShortUrl.bind(this);
    this.setLongUrl = this.setLongUrl.bind(this);
    this.getUrl = this.getUrl.bind(this);
  }

  componentWillMount() {
    // Get network provider and web3 instance.
    // See utils/getWeb3 for more info.

    getWeb3
    .then(results => {
      this.setState({
        web3: results.web3
      })

      // Instantiate contract once web3 provided.
      //this.newUrl()
    })
    .catch(() => {
      console.log('Error finding web3.')
    })
  }

  setShortUrl(event){
    this.setState({
      shortUrl: event.target.value
    })
  }

  setLongUrl(event){
    this.setState({
      longUrl: event.target.value
    })
  }

  newUrl() {
    
    
    const contract = require('truffle-contract')
    const persistentBit = contract(PersistentBit)
    persistentBit.setProvider(this.state.web3.currentProvider)

    // Declaring this for later so we can chain functions on SimpleStorage.
    var persistentBitInstance

    // Get accounts.
    this.state.web3.eth.getAccounts((error, accounts) => {
      persistentBit.deployed().then((instance) => {
        persistentBitInstance = instance

        // Stores a given value, 5 by default.
        return persistentBitInstance.newUrl(this.state.shortUrl, this.state.longUrl, {from: accounts[0]})
      })
    })
    
  }

  getUrl(){
    const contract = require('truffle-contract')
    const persistentBit = contract(PersistentBit)
    persistentBit.setProvider(this.state.web3.currentProvider)

    // Declaring this for later so we can chain functions on SimpleStorage.
    var persistentBitInstance

    // Get accounts.
    this.state.web3.eth.getAccounts((error, accounts) => {
      persistentBit.deployed().then((instance) => {
        persistentBitInstance = instance

        // Stores a given value, 5 by default.
        persistentBitInstance.getUrl(this.state.shortUrl)
          .then((res)=> window.location.replace(res))
        
      })
    })
  }

  instantiateContract() {
    /*
     * SMART CONTRACT EXAMPLE
     *
     * Normally these functions would be called in the context of a
     * state management library, but for convenience I've placed them here.
     */

    const contract = require('truffle-contract')
    const simpleStorage = contract(SimpleStorageContract)
    simpleStorage.setProvider(this.state.web3.currentProvider)

    // Declaring this for later so we can chain functions on SimpleStorage.
    var simpleStorageInstance

    // Get accounts.
    this.state.web3.eth.getAccounts((error, accounts) => {
      simpleStorage.deployed().then((instance) => {
        simpleStorageInstance = instance

        // Stores a given value, 5 by default.
        return simpleStorageInstance.set(5, {from: accounts[0]})
      }).then((result) => {
        // Get the value from the contract to prove it worked.
        return simpleStorageInstance.get.call(accounts[0])
      }).then((result) => {
        // Update state with the result.
        return this.setState({ storageValue: result.c[0] })
      })
    })
  }

  render() {

    return (
      <div className="App">
        <h1>PersistentBit</h1>
        <p>URL Shortener that lives forever</p>
        <Row>
          <Input onChange={this.setShortUrl} type="text" placeholder="eth-reddit" label="Shortend URL"/>
          <Input onChange={this.setLongUrl} type="text" placeholder="https://www.reddit.com/r/ethereum/" label="Long URL"/>
        </Row>
        <Button onClick={this.newUrl}>Create New URL</Button>
        <Button onClick={this.getUrl}>redirect</Button>
      </div>
    );
  }
}

export default main
