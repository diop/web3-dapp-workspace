## Meetup Notes - A guide to building decentralized applications with Web3.js

+ [Web3.js Official Documentation](web3js.readthedocs.io/en/1.0)
+ [Web3.js 1.0](https://github.com/ethereum/web3.js/tree/1.0)
+ [Ethereum Wiki](https://github.com/ethereum/wiki/wiki/JavaScript-API)

## Intro
+ Who here knows a fair amount the Blockchain?
+ Who here has no idea what the Blockchain is?
+ A Blockchain is a group os signed transactions, added to a signed block, which are added to a chain.
Which is Append Only (adding at the end of the chain.) Linked list, which is then stored on a hard drive.
in a manner such a bunch of computer which do not trust each other can come to a consensus as to what's on that Link List.
+ What is a transaction? It's essentially a rest call.

```
http://somesite.com/sendvalue?from=fode&to=debray&amount=1000.00
```
```
http://somesite.com/sendvalue?from=fode&to=debray&amount=1000.00&signature=1981902819719ghdsghdhjg
```

+ We take a transaction, hash it, and then encrypt it with your private key.
So the person who has your public key knows that you initiated this transaction and can decrypt it.
To make sure that the signer is who they say they are. Without access to your private key no one can forge your signature.
+ In the end all the nodes agree that this is the current state of the Blockchain.
+ Nobody can go back and change the past, because we all already agreed.
+ In Ethereum a transaction does not just transfer value.
+ A Transaction can POST a Contract.
+ Another transaction can call that Contract.
+ Then the Contract is compiled down to Bytecode so the EVM can read it.
+ Again main difference between Bitcoin and Ethereum: Bitcoin Nodes are accounting machines, while Ethereum Nodes have Virtual Machines as well.
+ Posting a contract is like Code Injection - Then you expose the methods as entry points.
+ What's in a Contract?
instance data that is persistent, methods with parameters and local data, constructors, it can hold value, it can send and receive value, it is excuted by every node to get consensus.
+ Consensus in the agreement on the transactions
+ The effect is that the internal State of every node will be the same.
+ Two ways to interact with Contracts: Transactions and Calls - Can only return results by Events. !!!
+ Transactions: Make changes to the storage (Cost Ether) - Executed on every node - Can only return results by events.
+ If a transaction fails ALL changes are reverted and NO logs are produced.

+ Calls: Query the state of the storage or the result of a calculation
+ only executed on Local Node
+ Get an immediate response
+ Cannot Change the State of the Storage.
+ When you make a query, your node has the same data as everybody else.
+ Events cannot be called but are put in the logs.
+ What have we achieved? What does the Blockchain give us? An immutable record system - Role Restricted Activities - Records that cannot be forged - Public Auditable Data: Using an easily available infrastructure with minimal setup.

## What is Web3 anyway?
+ Web3 API exposes Objects which group the methods based on Functionality
+ If there were no Web3 we would have to directly talk to the EVM and handle all the encoding and decoding ourselves.
+ It's a Javascript Library which allows you to interact with your Ethereum Node.
(From Devcon3 by Fabian Fogelsteller - Day3 Stream Afternoon)
+ A nice Javascript Object which acts like a middleware (instead of dealing with low level abstractions)
+ The EVM only understands Bytecode - The program needs to be compiled into Bytecode.
+ JSON RPC
+ API has synchronous and asynchronous options
+ Asynchronous --> Error-First Callback

```
web3.net.getPeerCount((error, result) => {
  if (error) {
    // Do something
  } else {
    // Do something else
  }
})
```

```
curl -X POST --data '{"jsonrpc": "2.0", "method": "eth_accounts", "params": [], "id":1}'
```

## Accounts
+ Personal Accounts (EOA): Has an address and a Private Key protected by a password
+ Contract Accounts: Has an  address but no private keys. Could be associated with multiple accounts. Contract Accounts are not free to use because they run code.
Multisig vs Single Owner 

## web3JS uses BigNumber Library
+ Cannot handle more than  20 floating points
+ Always manage Account balances in Wei (Rather than Ether)


## web3 1.0
+

## web3.utils
+

## web3.eth
+ Exposes methods related to Ethereum Blockchain

## web3.net
+ Node's network Status.

## web3.eth.accounts
+

## web3.eth.contract
+

## web3.eth.abi
+

## web3.eth.personal
+ Expose account related methods

## web3.eth.iban
+

## web3.bzz
+ Swarm

## web3.shh
+ Whisper

## web3.db
+ Get/Put for local LevelDB


## The fundamentals

+ Main difference between Ethereum and Bitcoin: Executable code on the individual Nodes.
+ Typical frontend apps: Browser |> Server / Mid-tier |> Data
+ Dapps: Frontend connects directly to the Ethereum network |> Backend is a smart
contract on the Ethereum Blockchain. The data lives in the contract instance.
Everybody can have access to the Data. Decentralized resources - Public Domain
+ Flow: The data is managed in contracts; state changes - Contracts Generate Events - Transactions are recorded on Chain.


## Transactions and gas

+ Transaction Fee = GasUsed * GasPrice
gasUsed = Instructions executed (summed up gas)
gasPrice = User Specified in the transaction & Miner decides the minimal acceptable price.
gasLimit: The max units of gas the originator is willing to spend
Gas Price: Per unit price that originator is willing to pay.
Max amount of Gas the user is willing to pay: gasLimit * gasPrice
Refund = gasLimit - gasUsed) * gasPrice

## Web3 Providers

+ IPC is short for inter-process communication and is no standard file in your installation or environment but rather a domain socket.

+ After you installed geth the ipc socket is not automatically created and its also not considerable a permanent resource.

+ The geth.ipc socket only exists as long as geth is running. You can specify the ipc path with the --ipcpath "/path/to/my/geth.ipc" flag. You can control the available apis with the --ipcapi flag. You can disable IPC with --ipcdisable. From geth --help:

```
--ipcdisable                                                    Disable the IPC-RPC server
--ipcapi "admin,eth,debug,miner,net,shh,txpool,personal,web3"   API's offered over the IPC-RPC interface
--ipcpath "geth.ipc"                                            Filename for IPC socket/pipe within the datadir (explicit paths escape it)

```

## Tools & Resources
+ [Ropsten Etherscan](https://ropsten.etherscan.io/)
+ [Ethereum Converter](https://etherconverter.online/)
+ [Ether Party Explorer](https://github.com/etherparty/explorer)
+ [Ethereum Builders](https://ethereumbuilders.gitbooks.io/guide/content/en/ethereum_javascript_api.html)

## Where to go from here?
+ [Building Blockchain Projects](https://www.packtpub.com/big-data-and-business-intelligence/building-blockchain-projects)
+ [Diving Into The Ethereum VM](https://medium.com/@hayeah/diving-into-the-ethereum-vm-6e8d5d2f3c30)
+ [Blockchain – The Next Big Thing for Middleware](https://www.infoq.com/articles/blockchain-middleware)


## Inspiration and References
+ [Vlad Wulf](https://www.youtube.com/channel/UCsVoOobxAQL6NbWY2t6E6Sg)
+ [Shlomi Zeltsinger](https://www.youtube.com/channel/UCi9Mf3veSDDIMdGGtPmPu1g)
+ [What The Func?](https://www.youtube.com/channel/UC0Wu-J4_SoFOYVKA8JRuRRg)
+ [Dave Appleton](https://www.youtube.com/watch?v=AJHUcHGM3Eg&t=885s)

## Web3 Alternatives
+ [EthJS](http://ethjs-examples.surge.sh/)
+ [Ethers.js](https://ethers.io)
+ [EthereumJS](https://github.com/ethereumjs)
+ [Ethecore](https://blog.ethcore.io/)
+ [Web3J]()
+ [Nethereum]()
+ [Web3.py]()
