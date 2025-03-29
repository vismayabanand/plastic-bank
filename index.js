const bodyParser = require('body-parser');
const express = require('express');
const Blockchain = require('./blockchain');
const PubSub = require('./app/pubsub');
const request = require('request');
const TransactionPool = require('./wallet/transaction-pool');
const Wallet = require('./wallet/index');
const TransactionMiner = require('./app/transaction-miner');
const path = require('path');
const node_list=require('./util/nodes');
const app = express();
const blockchain = new Blockchain();
const transactionPool = new TransactionPool();
const wallet = new Wallet();
const pubsub = new PubSub({blockchain, transactionPool });
const transactionMiner = new TransactionMiner({blockchain, transactionPool,wallet, pubsub});
const crypto=require("crypto");
const mysql=require("mysql");
const DEFAULT_PORT = 3000;
const ROOT_NODE_ADDRESS = `http://localhost:${DEFAULT_PORT}`;

setTimeout(() => pubsub.broadcastChain(),1000);

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'client/dist')));

app.get('/api/blocks', (req, res) => {
    res.json(blockchain.chain);
});
app.post('/api/mine', (req,res) => {
    const {data} = req.body;
    
    blockchain.addBlock({data});
    pubsub.broadcastChain();

    res.redirect('/api/blocks');
});

app.post('/api/transact', (req, res) => {
    const { amount, recipient } = req.body;
    let transaction = transactionPool
    .existingtransaction({inputAddress: wallet.publicKey});

    try{
        if (transaction) {
            transaction.update({ senderWallet: wallet, recipient, amount});
        }
        else{
            transaction = wallet.createTransaction({ 
                recipient,
                amount,
                chain: blockchain.chain
            });
        }
    }
    catch(error){
        return res.status(400).json({ type: 'error', message: error.message});
    }
    
    transactionPool.setTransaction(transaction);
    pubsub.broadcastTransaction(transaction);

    res.json({ type: 'Success', transaction });
});

app.get('/api/transaction-pool-map', (req, res) => {
  res.json(transactionPool.transactionMap);
});

app.get('/api/mine-transactions', (req, res) => {
  transactionMiner.mineTransactions();

  res.redirect('/api/blocks');
});

app.get('/api/wallet-info', (req, res) => {
    const address = wallet.publicKey;
    temp1=node_list(address);
    res.json({
        WalletId:wallet.walletId,
        address: wallet.publicKey,
        balance: Wallet.calculateBalance({ chain: blockchain.chain, address })
    });
});

app.get('/api/nodes',(req,res)=>{
    const nodes={}
    for (let block of blockchain.chain){
    for (let transaction of block.data){
        const recipient=Object.keys(transaction.outputMap);
        recipient.forEach(recipient =>nodes[recipient]=recipient);
    }
}
res.json(Object.keys(nodes))
})

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname,'client/dist/index1.html'));
});




const syncWithRootState = () => {
    request({ url : `${ROOT_NODE_ADDRESS}/api/blocks`}, (error, response, body) => {
        if (!error && response.statusCode === 200){
            const rootChain = JSON.parse(body);
            console.log('replace chain on a sync with', rootChain);
            blockchain.replaceChain(rootChain);
        }
    });

    request({ url: `${ROOT_NODE_ADDRESS}/api/transaction-pool-map`}, (error, response, body) => {
        if (!error && response.statusCode === 200){
            const rootTransactionPoolMap = JSON.parse(body);
            console.log('Replace Transaction Pool Map on a sync with', rootTransactionPoolMap);
            transactionPool.setMap(rootTransactionPoolMap);
        }
    });
}
// temp input
/*
const walletfoo=new Wallet();
const walletbar=new Wallet();
const generateWalletTransaction=({wallet,recipient,amount})=>{
    const transaction=wallet.createTransaction({
        recipient,amount,chain:blockchain.chain
    });
    transactionPool.setTransaction(transaction);
};
const walletAction=()=>generateWalletTransaction({
    wallet,recipient:walletfoo.publicKey,amount:5
});
const walletfooAction=()=>generateWalletTransaction({
    wallet:walletfoo,recipient:walletbar.publicKey,amount:10
});
const walletbarAction=()=>generateWalletTransaction({
    wallet:walletbar,recipient:wallet.publicKey,amount:15
});

for (let i=0;i<10; i++){
    if (i%3===0){
        walletAction();
        walletfooAction();

    }else if(i%3===1){
        walletAction();
        walletbarAction();
    }else{
        walletfooAction();
        walletbarAction();
    }
    transactionMiner.mineTransactions();    
}*/

//end of temp
let PEER_PORT;
if (process.env.GENERATE_PEER_PORT === 'true') {
    PEER_PORT = DEFAULT_PORT + Math.ceil(Math.random()*1000);
}

const PORT = PEER_PORT || DEFAULT_PORT;
app.listen(PORT, () => {
    console.log(`listening at localhost : ${PORT}`);

    if(PORT !== DEFAULT_PORT){
        syncWithRootState();
    }
});


///////db///////////////////


const db=mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'plastic-bank'
});
/*
const publicDirectory=path.join(__dirname,'./client/src');
app.post('auth',(req,res)=>{
    res.render('./client/src/auth');
})
*/
app.post('/api/register',(req,res)=>{
    const { username, password,pkey,pin } = req.body; 
    const hashedpassword=crypto.createHash('SHA256',password).digest('hex');
    db.query("INSERT INTO users1 (name,password,rpassword,pkey,pin) VALUES (?,?,?,?,?)",[username,hashedpassword,hashedpassword,pkey,pin],(err,result)=>{
        if(err){
        res.json(err.message);
        }
        else{
            console.log(result.message);
            res.json('')
        }
    })
});
app.post('/api/login',(req,res)=>{
    const {username,password}=req.body;
    const hashedpassword=crypto.createHash('SHA256',password).digest('hex');
    db.query("SELECT pkey FROM users1 WHERE name=? AND password=?",[username,hashedpassword],(err,result)=>{
        console.log(result)
        if(result.length==0){
            console.log('user doesnot exist');
            res.json('');
        }
        else{
            const r = Object.values(JSON.parse(JSON.stringify(result)));
            r.forEach((v) => res.json(v["pkey"]));
        }
    }
    )
})
app.post('/api/pincheck',(req,res)=>{
    const {username,pin}=req.body;
    db.query("SELECT pin FROM users1 WHERE name=?",[username],(err,result)=>{
        if (result){
            if (result[0]['pin']==pin){
                res.json("1");
            }
            else{
                res.json("");
            }
        }
        else{
            res.json("");
        }
    })
})

db.connect((error)=>{
    if(error){
        console.log(error);
    }
    else{
        console.log("MYSQL Connected...");
    }
})
