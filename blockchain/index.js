const Block = require("./block");
const { cryptoHash } = require('../util');
const { REWARD_INPUT, MINING_REWARD } = require("../config");
const Transaction = require("../wallet/transaction");
const Wallet = require("../wallet");
var fs=require('fs')
var data1=fs.readFileSync('blocks.json',{encoding:'utf8', flag:'r'})
var data2=JSON.parse(data1)

class Blockchain{
	constructor(){
		this.chain = data2
	}
	
	addBlock({data}){
		const newBlock = Block.mineBlock({
			lastBlock: this.chain[this.chain.length - 1],
			data: data
		});
		this.chain.push(newBlock);
		
		const newdata=JSON.stringify(this.chain,null,2);
		
		fs.writeFileSync('blocks.json',newdata,finished)
		function finished(err){
			console.log("done")
		}
	}

	static isValidChain(chain) {
		if (JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())) {
			console.log(JSON.stringify(chain[0]))
			console.log(JSON.stringify(Block.genesis()))

			console.log(1);
		  return false
		};
	
		for (let i=1; i<chain.length; i++) {
		  const { timestamp, lastHash, hash, nonce, difficulty, data } = chain[i];
		  const actualLastHash = chain[i-1].hash;
		  const lastDifficulty = chain[i-1].difficulty;
	
		  if (lastHash !== actualLastHash) {console.log(2);return false;}
	
		  const validatedHash = cryptoHash(timestamp, lastHash, data, nonce, difficulty);
	
		  if (hash !== validatedHash) {console.log(3);return false;}
	
		  if (Math.abs(lastDifficulty - difficulty) > 1) {console.log(4);return false;}
		}
	
		return true;
	  }

	
	replaceChain(chain,validTransaction, onSuccess){
		if (chain.length <= this.chain.length){
			console.error('The incoming chain must be longer');
			return;
		}
		if (!Blockchain.isValidChain(chain)){
			console.error('The incoming chain must be valid');
			return;
		}

		if(validTransaction && !this.validTransactionData({ chain })){
			console.error('The incoming chain has invalid data');
			return;
		}

		if (onSuccess) onSuccess();
		console.log('Replacing Chain with',chain);
		this.chain = chain;
		const newdata=JSON.stringify(this.chain,null,2);
		fs.writeFileSync('blocks.json',newdata,finished)
		function finished(err){
			console.log("done")
		}
	}

	validTransactionData({ chain }){
		for(let i=1; i< chain.length; i++ ){
			const block = chain[i];
			const transactionSet = new Set();
			let rewardTransationCount = 0;

			for(let transaction of block.data){
				if(transaction.input.address === REWARD_INPUT.address){
					rewardTransationCount+=1;
					if(rewardTransationCount > 1){
						console.error("Miner Rewards exceed limit");
						return false;
					}

					if(Object.values(transaction.outputMap)[0] !== MINING_REWARD) {
						console.error('Miner Reward Amount is invalid');
						return false;
					}
				}
				else{
					if(!Transaction.validTransaction(transaction)){
						console.error('Invalid Transaction');
						return false;
					}

					const trueBalance = Wallet.calculateBalance({
						chain: this.chain,
						address: transaction.input.address
					});
					/*if(transaction.input.amount !== trueBalance){
						console.error('Invalid input amount');
						return false;
					}*/

					if(transactionSet.has(transaction)){
						console.error('An identical transaction appears more than once in the block');
						return false;
					} else{
						transactionSet.add(transaction);
					}
				}
			}
		}
		
		return true;
	}
}

module.exports = Blockchain;
