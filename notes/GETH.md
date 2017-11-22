## The Geth Console & Web3
+ The Geth client provides a Javascript runtime environment.
+ It provides access to a Web3 API and the Management API
```
geth-testnet.attach

```

## We use Web3 to build decentralized applications.
+ Creating Dapps
+ Under the console the APIs are available in an Interactive and Non Interactive mode.

## Options
+ web3.eth  
+ web3.net
+ web3.db  
+ web3.shh

## API available as shorthands for
+ eth
+ net

## Admin
+ Node Management

```shell
$ admin.nodeInfo
$ admin.datadir
$ admin.peers
$ admin.peers.length
$ admin.peers[0]
```

## Personal
+ Account Management

# Miner
+ Control mining operations
+ Start or Stop mining using Methods available.

## txpool
+ Makes it easy to manage transaction pool

## Debug
+ Node Debugging

## JSON RPC Interface
+ Having it up exposes you to security attacks
+ You have to specify them at the time you start the Geth Node.
+ The advantage of the admin Interface is that you can specify them or injst them at run time.
```shell
admin.startRPC('localhost', 8545, 'web3') // The third argument is the list of APIs. (ie eth, net)
admin.stopRPC() // check localhost:8545 in the browser
```
## Manage Websocket Interface (WS) Interface
```
$ admin.startWS()
$ admin.stopWS()

```

## Solidity Compiler
```
$ admin.setSolc('path to solidity compiler')

```

## Export chain and Import chain to speedup the synching of your clients

## Personal - Account Commands
```
$ personal.newAccount("password")
$ personal.listAccounts
$ personal.importRawKey(keydata, passphrase) // Note imports unencrypted private key
$ account.import

```

## Security
+ geth CLI --unlock option vs personal.unlockAccount()
```
$ personal.unlockAccount()
$ personal.lockAccount()

```

## Ether Transactions - Note - the specified value NEEDS to be in Wei!
```
$ personal.sendTransaction(txn_obj, "paraphrase")
$ from = personal.listAccounts[0]
$ to = personal.listAccounts[1] // Could be on the same Geth node or any valid ethereum address
$ tx = { from: from, to: to, value: web3.toWei(1)} // The from account has to be from the Geth you're connected to.

```

## Mining operation

```
$ miner.start(num_threads)
$ miner.stop()
$ miner.setEtherbase(address)
$ miner.setGasPrice(num)
$ miner.setExtra(data)
$ miner.setEtherbase(personal.listAccounts[1])
$ miner.setExtra("Oakland Blockchain Developers") // Add extra data to the Block.
$ miner.start() // To start making cheddar!

```

## Transaction Pool
+ Account Nonce. Transaction counter in each account. Every transaction under the account has a unique nonce.
+ The transaction object can take a nonce as well. personal.sendTransaction can specify a nonce.
+ if nonce == nonce of last confirmed transaction for the account + 1 then send to Pending Pool.
If not send it to the Q Pool to fend off replay attacks.
```
$ txpool.Status // Count of transactions in the pools.
$ txpool.inspect
$ txpool.content // Detsils of transactions in the pools.

```

# Information - Performance - Go Code Below

## Debug APIs
+ Provides access to non standard RPC Methods for inspction, debugging and to set debug parameters.
```
$ debug.verbosity(level)
$ debug.dumpBlock(blockNumber) // Dumps block data.
$ debug.traceBlockByNumber(number) // Replays the block.
$ debug.traceBlockByHash(hash) // Replays the block.
$ geth --verbosity 0 console
$ geth.gcStats() // Check the garbage collection stats for when the application hangs.
$ debug.memStats() // Get information about memory usage.

```

## Gocode Level Debugging
```
debug.goTrace(file, seconds)
debug.stacks()
debug.vmodule(string)

```
