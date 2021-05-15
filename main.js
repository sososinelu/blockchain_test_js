const SHA256 = require('crypto-js/sha256');

class Block {
    constructor(index, timestamp, data, previousHash = '') {
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }

    calculateHash() {
        //sha256 as a hash function
        return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString();
    }

    mineBlock(difficulty) {
        while(this.hash.substring(0, difficulty) !== Array(difficulty + 1).join('0')) {
            this.nonce++;
            this.hash = this.calculateHash();
        }

        console.log('Block mined: '+ this.hash);
    }
}

class Blockchain {
    constructor() {
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 4;
    }

    // Generates the genesis block when we create the blockchain
    createGenesisBlock() {
        return new Block(0, '01/01/2021', 'Genesis block', 0)
    }

    // Retrieves the latest block in the blockchain
    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    // Add a new block to the blockchain
    addBlock(newBlock) {
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.mineBlock(this.difficulty);
        this.chain.push(newBlock);
    }

    // Check if the block is valid
    isChainValid() {
        for(let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            // Calculate current block hash and check it's valid
            if(currentBlock.hash !== currentBlock.calculateHash()) {
                return false;
            }

            // Check if current block previous hash points at the previous block hash
            if(currentBlock.previousHash !== previousBlock.hash) {
                return false;
            }
        }

        // All good!!!
        return true;
    }
}

let sosoCoin = new Blockchain();

console.log('Mining block 1...');
sosoCoin.addBlock(new Block(1, '15/04/2021', { amount : 4 }));

console.log('Mining block 2...');
sosoCoin.addBlock(new Block(2, '10/05/2021', { amount : 10 }));

// // List the blockshain
// console.log(JSON.stringify(sosoCoin, null, 4));

// // Check if the blockchain is valid
// console.log('Is blockchain valid? ' + sosoCoin.isChainValid());

// // Tamper with the blockchain
// sosoCoin.chain[1].data = { amount: 100 };
// sosoCoin.chain[1].hash = sosoCoin.chain[1].calculateHash();

// console.log('Is blockchain valid? ' + sosoCoin.isChainValid());

