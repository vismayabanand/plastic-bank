const hexToBinary = require('hex-to-binary');
const Block = require('./block');
const {GENESIS_DATA, MINE_RATE} = require('../config');
const { cryptoHash } = require('../util');

describe('Block', () => {
    const timestamp = 2000;
    const data = ["Trans1", "Trans2"];
    const lastHash = '0';
    const hash = '0000x123456789abcd';
    const nonce = 1;
    const difficulty = 1;
    const block = new Block({timestamp,data,lastHash,hash,nonce,difficulty});

    it('has timestamp, data, lastHash, Hash, nonce and difficulty', () => {
        expect(block.timestamp).toEqual(timestamp);
        expect(block.data).toEqual(data);
        expect(block.lastHash).toEqual(lastHash);
        expect(block.hash).toEqual(hash);
        expect(block.nonce).toEqual(nonce);
        expect(block.difficulty).toEqual(difficulty);
    });

    describe('genesis()', () => {
        const genesisBlock = Block.genesis();

        console.log("Genesis Block : ",genesisBlock);

        it('returns a genesis block', () => {
            expect(genesisBlock instanceof Block).toBe(true);
        });

        it('returns a genesis block', () => {
            expect(genesisBlock).toEqual(GENESIS_DATA);
        });
    });

    describe('mineBlock()', () => {
        const lastBlock = Block.genesis();
        const data = 'Mined Data';
        const minedBlock = Block.mineBlock({lastBlock,data});

        it('returns a Mined Block', () =>{
            expect(minedBlock instanceof Block).toBe(true);
        });

        it("Equates 'LastHash' of minedBlock to 'hash' of lastBlock", () => {
            expect(minedBlock.lastHash).toEqual(lastBlock.hash);
        });

        it('Sets the `data`',() => {
            expect(minedBlock.data).toEqual(data);
        });

        it('Timestamp is defined', () => {
            expect(minedBlock.timestamp).not.toEqual(undefined);
        });

        it('Returns hash of the mined Block', () => {
            expect(minedBlock.hash).toEqual(cryptoHash(minedBlock.timestamp, data, lastBlock.hash, minedBlock.nonce, minedBlock.difficulty));
        });

        it('sets a hash that matches the difficulty criteria', () => {
            expect(hexToBinary(minedBlock.hash).substring(0,minedBlock.difficulty)).toEqual('0'.repeat(minedBlock.difficulty));
        });

        it('adjusts the difficulty', () => {
            const possibleResults = [lastBlock.difficulty-1, lastBlock.difficulty+1];
            expect(possibleResults.includes(minedBlock.difficulty)).toBe(true);
        });

    });

    describe('adjustDifficulty()', () => {
        it('raises the difficulty for a quickly mined block',() => {
            expect(Block.adjustDifficulty({
                originalBlock : block, timestamp : (block.timestamp + MINE_RATE - 100)
                })).toEqual(block.difficulty+1);
        });

        it('lowers the difficulty for a slowly mined block',() =>{
            expect(Block.adjustDifficulty({
                originalBlock : block, timestamp : (block.timestamp + MINE_RATE + 100)
                })).toEqual(block.difficulty-1);
        });

        it('has a lower limit of 1', () => {
            block.difficulty = -1;
            expect(Block.adjustDifficulty({originalBlock : block})).toEqual(1);
        });
    });
});