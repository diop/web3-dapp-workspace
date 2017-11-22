# Web3 1.0 Specs & Objects

``` js
var Web3 = require('web3');
var web3 = new Web3('http://localhost:8545');
// or
var web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));

// change provider
web3.setProvider('ws://localhost:8546');
// or
web3.setProvider(new Web3.providers.WebsocketProvider('ws://localhost:8546'));

// Using the IPC provider in node.js
var net = require('net');
var web3 = new Web3('/Users/myuser/Library/Ethereum/geth.ipc', net); // mac os path
// or
var web3 = new Web3(new Web3.providers.IpcProvider('/Users/myuser/Library/Ethereum/geth.ipc', net)); // mac os path
// on windows the path is: "\\\\.\\pipe\\geth.ipc"
// on linux the path is: "/users/myuser/.ethereum/geth.ipc"
```

## web3.utils
+

## web3.subscribe
+ The web3.eth.subscribe function lets you subscribe to specific events in the blockchain.

## web3.eth
+ Exposes methods related to Ethereum Blockchain
+ The web3-eth package allows you to interact with an Ethereum blockchain and Ethereum smart contracts.

``` js
var Eth = require('web3-eth');

// "Eth.providers.givenProvider" will be set if in an Ethereum supported browser.
var eth = new Eth(Eth.givenProvider || 'ws://some.local-or-remote.node:8546');


// or using the web3 umbrella package

var Web3 = require('web3');
var web3 = new Web3(Web3.givenProvider || 'ws://some.local-or-remote.node:8546');

// -> web3.eth
```

## web3.net
+ Node's network Status.
+ The web3-net package allows you to interact with the Ethereum nodes network properties.

## web3.eth.accounts
+ The web3.eth.accounts contains functions to generate Ethereum accounts and sign transactions and data.


## web3.eth.Contract
+ The web3.eth.Contract object makes it easy to interact with smart contracts on the ethereum blockchain. When you create a new contract object you give it the json interface of the respective smart contract and web3 will auto convert all calls into low level ABI calls over RPC for you.
This allows you to interact with smart contracts as if they were JavaScript objects.

## web3.eth.abi
+ The web3.eth.abi functions let you de- and encode parameters to ABI (Application Binary Interface) for function calls to the EVM (Ethereum Virtual Machine).

## web3.eth.personal
+ Expose account related methods
+ The web3-eth-personal package allows you to interact with the Ethereum node’s accounts.
```js
var Personal = require('web3-eth-personal');

// "Personal.providers.givenProvider" will be set if in an Ethereum supported browser.
var personal = new Personal(Personal.givenProvider || 'ws://some.local-or-remote.node:8546');


// or using the web3 umbrella package

var Web3 = require('web3');
var web3 = new Web3(Web3.givenProvider || 'ws://some.local-or-remote.node:8546');

// -> web3.eth.personal
```

## web3.eth.iban
+ The web3.eth.Iban function lets convert ethereum addresses from and to IBAN and BBAN.

## web3.bzz
+ Swarm
+ The web3-bzz package allows you to interact swarm the decentralized file store. For more see the

## web3.shh
+ Whisper
+ The web3-shh package allows you to interact with an the whisper protocol for broadcasting.

## web3.db
+ Get/Put for local LevelDB
