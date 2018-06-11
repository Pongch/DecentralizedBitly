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
      longUrl:"",
      error:""
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
      this.getUrl()
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

        persistentBitInstance.getUrl(this.props.match.params.id)
            .then((res)=> {
                if(res.indexOf("http")>= 0){
                    window.location.replace(res)
                } else {
                    this.setState({
                        error: "OH DEAR LAWD, THIS URL DOESNT EXIST. Give the Blockchain a second"
                    })
                }        
            })
        })
    })
  }


  render() {
    console.log("redirect component")
    return (
      <div className="App">
        <h1>{this.state.error}</h1>
        <h3>THANKS FOR USING PERSISTENT BIT  </h3>
        
      </div>
    );
  }
}

export default main
