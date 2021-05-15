/*
    Tutorial followed:
    Creating a blockchain with Javascript (Blockchain, part 1)
    https://www.youtube.com/watch?v=zVqczFZr124&ab_channel=SimplyExplained
*/

const SHA256 = require('crypto-js/sha256');

class Block {
    constructor(index, timestamp, data, previousHash = '') {
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
    }

    calculateHash() {
        //sha256 as a hash function
        return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data)).toString();
    }
}

class Blockchain {
    constructor() {
        this.chain = [this.createGenesisBlock()];
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
        newBlock.hash = newBlock.calculateHash();
        this.chain.push(newBlock);
    }

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
sosoCoin.addBlock(new Block(1, '15/04/2021', { amount : 4 }));
sosoCoin.addBlock(new Block(2, '10/05/2021', { amount : 10 }));

console.log(JSON.stringify(sosoCoin, null, 4));

console.log('Is blockchain valid? ' + sosoCoin.isChainValid());

// Tamper with the blockchain
sosoCoin.chain[1].data = { amount: 100 };
sosoCoin.chain[1].hash = sosoCoin.chain[1].calculateHash();

console.log('Is blockchain valid? ' + sosoCoin.isChainValid());

