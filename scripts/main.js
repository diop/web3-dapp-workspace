
const contract_abidefinition = '[{"constant":false,"inputs":[],"name":"getNum","outputs":[{"name":"n","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"n","type":"uint256"}],"name":"setNum","outputs":[],"payable":false,"type":"function"},{"inputs":[{"name":"x","type":"uint256"}],"payable":false,"type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"caller","type":"address"},{"indexed":true,"name":"oldNum","type":"bytes32"},{"indexed":true,"name":"newNum","type":"bytes32"}],"name":"NumberSetEvent","type":"event"}]'
const contract_bytecode = '0x6060604052341561000c57fe5b604051602080610168833981016040528080519060200190919050505b806000819055505b505b610126806100426000396000f30060606040526000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff16806367e0badb146044578063cd16ecbf146067575bfe5b3415604b57fe5b60516084565b6040518082815260200191505060405180910390f35b3415606e57fe5b60826004808035906020019091905050608f565b005b600060005490505b90565b60006000549050816000819055506000546001026000191681600102600019163373ffffffffffffffffffffffffffffffffffffffff167f108fd0bf2253f6baf35f111ba80fb5369c2e004b88e36ac8486fcee0c87e61ce60405180905060405180910390a45b50505600a165627a7a72305820b86215323334042910c2707668d7cc3c3ec760d2f5962724042482293eba5f6b0029'
const autoRetrieveFlag = true
const accounts
const filterWatch
const filterEventCounter
const contractEvent
const contractEventCounter = 0
const nodeType = 'geth'

window.addEventListener('load', function() {
  if (typeof web3 !== 'undefined') {
    window.web3 = new Web3(web3.currentProvider)
  } else {
    console.log('Injected web3 Not Found!!!')
    window.web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'))
    var provider = document.getElementById('provider_url').value
    window.web3 = new Web3(new Web3.providers.HttpProvider(provider))
  }
  startApp()
})

function startApp(){
  doFilterStopWatching()
  doContractEventWatchStop()
  if (web3 && web3.isConnected()) {
      setData('connect_status','Connected', false)
      setWeb3Version()
      if(autoRetrieveFlag) doGetAccounts()
  } else {
      setData('connect_status','Not Connected', true)
  }
  if (!autoRetrieveFlag)  return
  doGetNodeStatus()
  doGetCompilers()
}

function doConnect()    {
    var provider = document.getElementById('provider_url').value
    window.web3 = new Web3(new Web3.providers.HttpProvider(provider))
    startApp()
}

function setWeb3Version() {
    var versionJson = {}
    web3.version.getNode(function(error, result){
        if(error) setData('version_information',error,true)
        else {
            setData('version_information',result,false)
            if(result.toLowerCase().includes('metamask')){
                nodeType = 'metamask'
            } else if(result.toLowerCase().includes('testrpc')){
                nodeType = 'testrpc'
            } else {
                nodeType = 'geth'
            }
            setUIBasedOnNodeType()
        }
    })
}

function doGetNodeStatus()  {
    web3.net.getListening(function(error, result){
        if(error) setData('get_peer_count',error,true)
        else {
            web3.net.getPeerCount(  function(  error,  result ) {
            if(error){
                setData('get_peer_count',error,true)
            } else {
                setData('get_peer_count','Peer Count: '+result,(result == 0))
            }
        })
        }
    })
}

function doGetAccounts() {
    web3.eth.getAccounts(function (error, result) {
        if (error) {
            setData('accounts_count', error, true)
        } else {
            accounts = result
            setData('accounts_count', result.length, false)
            if(result.length == 0) {
                if(nodeType == 'metamask'){
                    alert('Unlock MetaMask *and* click \'Get Accounts\'')
                }
                return
            }
            removeAllChildItems('accounts_list')
            for (var i = 0; i < result.length; i++) {
                addAccountsToList('accounts_list',i,result[i])
            }
            var coinbase = web3.eth.coinbase
            if(coinbase) coinbase = coinbase.substring(0,25) + '...'
            setData('coinbase', coinbase, false)
            var defaultAccount = web3.eth.defaultAccount
            if(!defaultAccount){
                web3.eth.defaultAccount =  result[0]
                defaultAccount = '[Undef]' + result[0]
            }

            defaultAccount = defaultAccount.substring(0,25) + '...'
            setData('defaultAccount', defaultAccount, false)
        }
        doGetBalances(accounts)
        addAccountsToSelects(accounts)
    })
}

function doGetBalances(accounts) {
    removeAllChildItems('account_balances_list')
    for (var i = 0; i < accounts.length; i++) {
       web3.eth.getBalance(accounts[i],web3.eth.defaultBlock,function(error, result){
            var bal = web3.fromWei(result,'ether').toFixed(2)
            addAccountBalancesToList('account_balances_list', i, bal)
        })
    }
}

function doSendTransaction() {
    var transactionObject = createTransactionObjectJson()
    web3.eth.sendTransaction(transactionObject, function(error, result) {
        if(error){
            setData('send_transaction_error_or_result', error, true)
        } else {
            setData('send_transaction_error_or_result', result, false)
            var etherscanLinkA=document.getElementById('etherscan_io_tx_link')
            etherscanLinkA.href = createEtherscanIoUrl('tx',result)
            etherscanLinkA.innerHTML='etherscan.io'
        }
    })
}

function doUnlockAccount() {
    setData('lock_unlock_result','...',true)
    var account = document.getElementById('select_to_unlock_account').value
    var password = document.getElementById('unlock_account_password').value
    web3.personal.unlockAccount(account, password,function(error, result)  {
        if(error){
            setData('lock_unlock_result',error,true)
        } else {
            var str = account.substring(0,20) + '...Unlocked'
            if(result){
                setData('lock_unlock_result', str, false)
            } else {
                str = 'Incorrect Password???'
                setData('lock_unlock_result', str, true)
            }
        }
    })
}

function doLockAccount() {
    setData('lock_unlock_result', '...', true)
    var account = document.getElementById('select_to_unlock_account').value
    web3.personal.lockAccount(account, function(error, result){
      console.log(error,result)
        if(error){
            setData('lock_unlock_result', error, true)
        } else {
            var str = account.substring(0,20)+'...Locked'
            setData('lock_unlock_result', str, false)
        }
    })
}

function doGetCompilers() {
    web3.eth.getCompilers(function(error, result){
        if(error){
            setData('list_of_compilers', error, true)
        } else {
            if(result.length == 0)
                setData('list_of_compilers','No Compilers!!!', true)
            else
                setData('list_of_compilers', result, false)
        }
    })
}

function doCompileSolidityContract() {
    var source = document.getElementById('sourcecode').value
    console.log(flattenSource(source))
    web3.eth.compile.solidity(source, function(error, result){
        if(error){
            console.log(error)
            setData('compilation_result',error,true)
        } else {
            result = compileResultWindowsHack(result)
            console.log('Compilation Result=',JSON.stringify(result))
            var contract_1 = ''
            var code_1 = ''
            var abi_1 = ''
            for(var prop in result){
                contract_1 = prop
                code_1 = result[prop].code
                if(!code_1){
                    code_1 = result.code
                }
                if(result[prop].info){
                    abi_1 = result[prop].info.abiDefinition
                } else {
                    abi_1 = result.info.abiDefinition
                }
                break
            }
            setData('compilation_result','Contract#1: '+contract_1,false)
            document.getElementById('compiled_bytecode').value = code_1
            document.getElementById('compiled_abidefinition').value = JSON.stringify(abi_1)

        }
    })
}

function doDeployContract() {
    resetDeploymentResultUI()
    var abiDefinitionString = document.getElementById('compiled_abidefinition').value
    var abiDefinition = JSON.parse(abiDefinitionString)

    var bytecode = document.getElementById('compiled_bytecode').value
    var contract = web3.eth.contract(abiDefinition)
    var gas = document.getElementById('deployment_estimatedgas').value

    var  params = {
        from: web3.eth.coinbase,
        data: bytecode,
        gas: gas
    }

    var constructor_param = 10
    contract.new(constructor_param,params,function(error,result){
        if(error){
            setData('contracttransactionhash','Deployment Failed: '+ error, true)
        } else {
            console.log('RECV:',result)
            if(result.address){
                document.getElementById('contractaddress').value = result.address
                setEtherscanIoLink('contractaddress_link','address', result.address)
            } else {
                // gets set in the first call
                setData('contracttransactionhash',result.transactionHash, false)
                setEtherscanIoLink('contracttransactionhash_link','tx', result.transactionHash)
            }
        }
    })
}

function doDeployContractSynchronous() {

    var     abiDefinitionString = document.getElementById('compiled_abidefinition').value
    var     abiDefinition = JSON.parse(abiDefinitionString)

    var     bytecode = document.getElementById('compiled_bytecode').value
    var  contract = web3.eth.contract(abiDefinition)
    var   gas = document.getElementById('deployment_estimatedgas').value
    var  params = {
        from: web3.eth.coinbase,
        data: bytecode,
        gas: gas
    }

    var contractData = contract.new.getData(10,{'data':bytecode})
    console.log('Contract Data=',contractData)
    params.data=contractData
    var transactionHash= web3.eth.sendTransaction(params)
    console.log('TxnHash=',transactionHash)
    web3.eth.getTransactionReceipt(transactionHash, function(error, result){
        if(error) console.log('SENDTran Error=', error)
        else   if(error) console.log('SENDTran Hash=', result)
    })

    return
}

function createContractInstance(addr){
    var     abiDefinitionString = document.getElementById('compiled_abidefinition').value
    var     abiDefinition = JSON.parse(abiDefinitionString)
    var    contract = web3.eth.contract(abiDefinition)
    var    address = addr

    if(!address) address = document.getElementById('contractaddress').value
    var    instance = contract.at(address)
    return instance
}

function doContractFunctionCall() {
    var instance = createContractInstance()
    var funcName = document.getElementById('contract_select_function').value
    if(funcName === 'setNum'){
        var    parameterValue = document.getElementById('setnum_parameter').value
        var value = instance.setNum.call(parameterValue)
        setExecuteResultUI('Call', funcName, parameterValue, value, '', false)
    } else {
        instance.getNum.call({},web3.eth.defaultBlock, function(error,result){
            setExecuteResultUI('Call',funcName,'',result,'',false)
        })
    }
}

function doContractSendCall()   {
    var instance = createContractInstance()
    var estimatedGas = document.getElementById('contract_execute_estimatedgas').value
    var parameterValue = document.getElementById('setnum_parameter').value
    var funcName = document.getElementById('contract_select_function').value
    var    txnObject = {
        from: web3.eth.coinbase,
        gas: estimatedGas
    }

    if(funcName === 'setNum'){
        instance.setNum.sendTransaction(parameterValue, txnObject, function(error, result)  {
            console.log('RECVED>>',error,result)
            if(error){
                setExecuteResultUI('Send Transaction: ', funcName, '', error, '', true)
            } else {
                setExecuteResultUI('Send Transaction:   ',funcName, parameterValue, result, result, false)
            }
        })
    } else {
        instance.getNum.sendTransaction(txnObject,function(error, result)  {
            console.log('RECVED>>',error,result)
            if(error){
                setExecuteResultUI('Send Transaction:   ',funcName,'',error,'',true)
            } else {
                setExecuteResultUI('Send Transaction:   ',funcName,'',result,result,false)
            }
        })
    }
}

function doFilterWatchStart() {
    doFilterStopWatching()
    setData('watch_event_count','0',false)
    var options = generateFilterOptions()
    console.log('FILTER Watch Options:', JSON.stringify(options))
    document.getElementById('applied_watch_filter').value=JSON.stringify(options)
    filterWatch = web3.eth.filter(options)
    filterWatch.watch(function(error,result){
        if(error){
            console.error('Filter Watch Error: ', error)
        } else {
            filterEventCounter++
            setData('watch_event_count', filterEventCounter, false)
            addEventListItem('watch_events_list', result, 5)
        }
    })
}

function doFilterStopWatching()  {
    if(filterWatch){
        filterWatch.stopWatching()
        filterWatch = undefined
    }
    setData('watch_event_count','Not Watching',true)
    document.getElementById('applied_watch_filter').value = ''
    clearList('watch_events_list')
    filterEventCounter = 0
}

function doFilterGetLogs()  {
    clearList('get_logs_list')
    var options = generateFilterOptions()
    console.log('FILTER Get Options:', JSON.stringify(options))

    document.getElementById('applied_log_filter').value=JSON.stringify(options)
    var filterGet = web3.eth.filter(options)
    filterGet.get(function(error, result){
        if(error){
            console.log('GET Error:',error)
            setData('get_log_count',error, true)
        } else {
            setData('get_log_count',result.length, false)
            for(var i = 0; i < result.length ; i++){
                addEventListItem('get_logs_list',result[i],50)
            }
        }
    })
}

function doContractEventWatchStart() {
    if(contractEvent){
        doContractEventWatchStop()
    }
    setData('watch_contract_instance_event_count','0',false)
    contractEvent = createContractEventInstance()
    contractEvent.watch(function(error, result){
        if(error){
            console.error('Contract Event Error')
        } else {
            contractEventCounter++
            setData('watch_contract_instance_event_count',contractEventCounter, false )
            addEventListItem('watch_contract_events_list',result,5)
        }
    })
}

function  doContractEventWatchStop() {
    if(contractEvent){
        contractEvent.stopWatching()
        contractEvent = undefined
    }
    contractEventCounter = 0
    clearList('watch_contract_events_list')
    setData('watch_contract_instance_event_count', '---', true)
}

function doContractEventGet() {
    clearList('get_contract_instance_logs_list')
    setData('get_contract_instance_log_count', '---', true)
    var event = createContractEventInstance()
    event.get(function(error, result){
        if(error){
            setData('get_contract_instance_log_count',error,true)
        } else {
            setData('get_contract_instance_log_count',result.length, false)
            for(var i = 0; i < result.length ; i++){
                addEventListItem('get_contract_instance_logs_list',result[i],50)
            }
        }
    })
}

function createContractEventInstance(){
    var contractAddress = document.getElementById('contract_instance_address').value
    var contractInstance = createContractInstance(contractAddress)
    var indexedEventValues = document.getElementById('indexed_event_values').value
    indexedEventValues = JSON.parse(indexedEventValues)
    var additionalFilterOptions = document.getElementById('additional_filter_event_values').value
    additionalFilterOptions = JSON.parse(additionalFilterOptions)
    return contractInstance.NumberSetEvent(indexedEventValues, additionalFilterOptions)
}
