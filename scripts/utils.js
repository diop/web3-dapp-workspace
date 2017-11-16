var etherscanBaseUrl='https://ropsten.etherscan.io/';
function    setUIBasedOnNodeType(){
    if(nodeType === 'metamask' || nodeType == 'testrpc'){
        setData('lock_unlock_result','Unlock / lock ( ) not supported for '+nodeType,true)
    } else {
        setData('lock_unlock_result','--',false)
    }
    if(nodeType === 'geth' || nodeType === 'metamask'){

        setData('list_of_compilers','getCompilers ( ) & compileSolidity ( ) not supported for '+nodeType,true)


        document.getElementById('button_do_compile').disabled = true

        document.getElementById('sourcecode').disabled = true
    } else {
        setData('list_of_compilers','--',false);
        document.getElementById('button_do_compile').disabled = false
        document.getElementById('sourcecode').disabled = false
    }


    generateTransactionJSON()
    copyBytecodeInterfaceToUI()
}


function updateIFrameContent(iframe_id, data) {
    var iframe = document.getElementById(iframe_id)
    var iframedoc = iframe.contentDocument || iframe.contentWindow.document
    iframedoc.body.innerHTML = html
}

function setData(docElementId, html, errored) {
    document.getElementById(docElementId).innerHTML = html
    if (errored) document.getElementById(docElementId).classList = 'notready'
    else document.getElementById(docElementId).classList = 'ready'
}

function arrayToMultilineString(arr) {
    var concat = ''
    for (var i = 0; i < arr.length; i++) {
        concat += arr[i] + '<br>'
    }
    return concat
}

function addAccountsToList(listId,index,account){
    var li = document.createElement('LI')
    var input = document.createElement('INPUT')
    input.value = account
    input.id = 'account' + index
    input.disabled = true
    li.appendChild(input)
    var list = document.getElementById(listId)
    list.appendChild(li)
}

function addAccountBalancesToList(listId,index,accountBalance){
    var li = document.createElement('LI')
    li.class='ready'
    var input = document.createElement('P')
    input.class = 'ready'
    input.innerText=accountBalance+' Ether'
    li.appendChild(input)
    var list = document.getElementById(listId)
    list.appendChild(li)
}

function removeAllChildItems(elementId){
    var ele = document.getElementById(elementId);
    while (ele.hasChildNodes()) {
        ele.removeChild(ele.firstChild);
    }
}

function    addAccountsToSelects(accounts){

    removeAllChildItems('send_from_account')
    removeAllChildItems('send_to_account')
    removeAllChildItems('select_to_unlock_account')
    for (var i = 0; i < accounts.length; i++) {
        addOptionToSelect('send_from_account', accounts[i].substring(0,15)+'...', accounts[i])
        addOptionToSelect('send_to_account', accounts[i].substring(0,15)+'...', accounts[i])
        addOptionToSelect('select_to_unlock_account', accounts[i].substring(0,15)+'...', accounts[i])
    }
}


function    addOptionToSelect(selectId, text, value){
    var option = document.createElement('OPTION')
    option.text = text
    option.value = value
    var select = document.getElementById(selectId)
    select.appendChild(option)
}


function    createTransactionObjectJson(){
    var transObject = {}
    transObject.from = document.getElementById('send_from_account').value
    transObject.to = document.getElementById('send_to_account_value').value
    var valueInEther = document.getElementById('send_value_in_ether').value
    var valueInWei = web3.toWei(valueInEther,'ether')
    transObject.value = valueInWei
    if(document.getElementById('send_gas').value !== 'default')
        transObject.gas = document.getElementById('send_gas').value
    if(document.getElementById('send_gas_price').value !== 'default')
        transObject.gasPrice = document.getElementById('send_gas_price').value
    if(document.getElementById('send_data').value !== 'default'){
        var data = document.getElementById('send_data').value
        transObject.data = web3.toHex(data)
    }
    if(document.getElementById('send_nonce').value !== 'default')
        transObject.nonce = document.getElementById('send_nonce').value

    return transObject
}

function copyBytecodeInterfaceToUI(){
    document.getElementById('compiled_bytecode').value=(contract_bytecode)
    document.getElementById('compiled_abidefinition').value=(contract_abidefinition)
}

function    generateTransactionJSON(){
    var tobject = createTransactionObjectJson()
    setData('send_transaction_object_json',JSON.stringify(tobject,undefined,2),false)
}

function    resetTransactionObjectParameters(){
    document.getElementById('send_gas').value = 'default'
    document.getElementById('send_gas_price').value = 'default'
    document.getElementById('send_data').value = 'default'
    document.getElementById('send_nonce').value = 'default'
    document.getElementById('send_value_in_ether').value = 0
    generateTransactionJSON()
}

function createEtherscanIoUrl(type,hashOrNumber){
    var url = etherscanBaseUrl
    if(type === 'tx'){
        url += 'tx/'+hashOrNumber
    } else if(type === 'block'){
        url += 'block/'+hashOrNumber
    } else if(type === 'address'){
        url += 'address/'+hashOrNumber
    }
    return url
}

function   setEtherscanIoLink(aId, type, hashOrNumber){
    var etherscanLinkA=document.getElementById(aId)
    etherscanLinkA.href = createEtherscanIoUrl(type,hashOrNumber)
    if(hashOrNumber)
        etherscanLinkA.innerHTML='etherscan.io'
    else
        etherscanLinkA.innerHTML='';
}

function flattenSource(src){
    return src.replace(/\n/g, ' ');
}

function    compileResultWindowsHack(result){
    var cleaned = {}
    for(var prop in result){
        var newProp = prop.replace('<stdin>:','');
        cleaned[newProp] = result[prop];
    }
    return cleaned;
}

function    resetDeploymentResultUI(){
    console.log('utils.resetDeploymentResultUI() TO BE CODED')
}

function    setExecuteResultUI(callType,functionName, parameter, return_value, txHash, error){
    var detail = callType+':'+functionName+'('+parameter+')';
    if(error)  detail += ' FAILED '+return_value;
    else detail += 'Successful';

    setData('invoke_details',detail,(error));

    setData('invoke_return_value',return_value,(error));

    console.log('return_value=',return_value)

    setData('invoke_contracttransactionhash', txHash, false);
    setEtherscanIoLink('invoke_contracttransactionhash_link', 'tx', txHash);
}

function    generateFilterOptions()   {

    var options = {};
    var val = document.getElementById('from_block_filter').value;
    if(val && val.trim().length > 0)
                options['fromBlock'] = val;
    val = document.getElementById('to_block_filter').value;
    if(val && val.trim().length > 0)
                options['toBlock'] =  val;

    var val = document.getElementById('addresses_filter').value;
    val = val.trim();

    if(val.length > 0) {
        val = val.split('\n');
        options['address'] = val;
    }
    val = document.getElementById('topics_filter').value;
    val = val.trim();

        console.log('SIG=',getHashEventSignature('NumberSetEvent(address,bytes32,bytes32)'))

    if(val.length > 0 ){
        val = val.split('\n');

        for(var i=0; i < val.length;i++){
            val[i] = val[i].trim()
            if(val[i] === 'null') val[i]=null;
        }
        options['topics'] = val;


    }



    setData('options_filter',JSON.stringify(options,undefined,2),false);
    return options;
}

function    addEventListItem(listId, childData, len){

    console.log('Event:',childData);
    var list = document.getElementById(listId);
    if(list.childNodes.length >= len){
        var i = list.childNodes.length - 1;
        list.removeChild(list.childNodes[i]);
    }
    var li = document.createElement('LI');
    li.appendChild(createEventListItem(childData));
    list.insertBefore(li, list.childNodes[0]);
}

function    createEventListItem(childData){
    var div = document.createElement('SPAN');
    var p = document.createElement('A');
    p.text = 'Log#'+childData.logIndex+', Txn#'+childData.transactionIndex;
    div.appendChild(p);
    var aLink = document.createElement('A')
    aLink.text = ', Blk#'+childData.blockNumber;
    aLink.href = createEtherscanIoUrl('block', childData.blockNumber);
    aLink.target='_blank';
    div.appendChild(aLink);
    if(childData.transactionHash){
        aLink = document.createElement('A')
        aLink.text = ', Txn, ';
        aLink.href = createEtherscanIoUrl('tx', childData.transactionHash);
        aLink.target='_blank';
        div.appendChild(aLink);
    }

    if(childData.address){
        aLink = document.createElement('A')
        aLink.text = 'Addr';
        aLink.href = createEtherscanIoUrl('address', childData.address);
        aLink.target='_blank';
        div.appendChild(aLink);
    }
    return div;
}

function    clearList(listId){
    var list = document.getElementById(listId);
    for(var i=list.childNodes.length-1; i>=0 ;i--){
        list.removeChild(list.childNodes[i]);
    }
}

function    addContractEventListItem(listId, childData, len){
    console.log(JSON.stringify(childData))
}

function getHashEventSignature(evt){
    return web3.sha3(evt)
}
