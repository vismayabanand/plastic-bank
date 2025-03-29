const hexToBinary = require('hex-to-binary');
const { GENESIS_DATA, MINE_RATE } = require("../config");
const { cryptoHash } = require('../util');
   
class Block{
    constructor({timestamp, data, lastHash, hash,nonce,difficulty }){
        this.timestamp = timestamp;
        this.data=data;
        this.lastHash=lastHash;
        this.hash=hash;
        this.nonce=nonce;
        this.difficulty=difficulty;

    }

    static genesis() {
        return new this(GENESIS_DATA);
    }

    static mineBlock({lastBlock, data}) {
        let hash, timestamp;
        const lastHash = lastBlock.hash;
        let {difficulty} = lastBlock;
        let nonce = 0;

        do{
            nonce++;
            timestamp = Date.now()
            difficulty = this.adjustDifficulty({originalBlock : lastBlock, timestamp});
            hash = cryptoHash(nonce, timestamp, lastHash, difficulty, data);
        }while(hexToBinary(hash).substring(0,difficulty) !== '0'.repeat(difficulty));

        return new this({timestamp, data, lastHash, nonce, difficulty,hash});
    }

    static adjustDifficulty({originalBlock, timestamp}){
        const {difficulty} = originalBlock;
        if (difficulty < 1) return 1;
        if((timestamp - originalBlock.timestamp) > MINE_RATE ) return difficulty - 1;
        return difficulty + 1;
    }
}
module.exports=Block