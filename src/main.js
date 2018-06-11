import React, { Component } from 'react'
import PersistentBit from '../build/contracts/PersistentBit.json'
import SimpleStorageContract from '../build/contracts/SimpleStorage.json'
import getWeb3 from './utils/getWeb3'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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
import {Row, Input, Button, Col} from 'react-materialize'



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

  registerClick(){
    this.newUrl;
  }

  notification() {
    
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
    if(this.state.longUrl.indexOf("http")>= 0 ){
      toast.success(`Your Bitly Link is at http://bitly.surge.sh/${this.state.shortUrl} give it a second`, { autoClose: 30000 })
    
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
    } else {
      toast.error(`Your Long URL does not Contain http:// !`, { autoClose: 10000 })
    }
    
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


  render() {

    return (
      <div className="App">
        <div className="center-align">
          <h1>DecentralizedBitly</h1>
          <p>URL Shortener that lives forever (now on <b>Ropsten</b> network) </p>
          <div className="container">
          <Row>
              <Input onChange={this.setShortUrl} s={6} type="text" placeholder="heyheyhey" label="Your Unique Custom Name"/>
              <Input onChange={this.setLongUrl} s={6} type="text" placeholder="https://www.youtube.com/watch?v=e5nyQmaq4k4" label="The Actual URL"/>
          </Row>
          
          </div>
          <Button onClick={this.newUrl}>Create New URL</Button>
          <p>* Test it out: <a href="/heyheyhey">bitlyd.app/heyheyhey</a></p>
          <p>** No duplicate Custom URL ever, your URL is unique :D </p>
        </div>
        <ToastContainer />
      </div>
    );
  }
}

export default main
