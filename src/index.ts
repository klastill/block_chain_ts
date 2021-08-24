import * as CryptoJS from "crypto-js";

class Block {
  static calcBlockHash = (
		index: number,
		prevHash: string,
		timestamp: number,
		data: string
	): string => CryptoJS.SHA256(index + prevHash + timestamp + data).toString();

  static validStructure = (aBlock: Block): boolean =>
    typeof aBlock.index === "number" &&
    typeof aBlock.hash === "string" &&
    typeof aBlock.prevHash === "string" &&
    typeof aBlock.timestamp === "number" &&
    typeof aBlock.data === "string";

	public index: number;
	public hash: string;
	public prevHash: string;
	public data: string;
	public timestamp: number;

	constructor(
		index: number,
		hash: string,
		prevHash: string,
		data: string,
		timestamp: number
	) {
		this.index = index;
		this.hash = hash;
		this.prevHash = prevHash;
		this.data = data;
		this.timestamp = timestamp;
	}
}

const genesisBlock: Block = new Block(
	0,
	"000000000000",
	"hash",
	"initial",
	202107
);

let blockchain: Block[] = [genesisBlock];

const getBlockchain = (): Block[] => blockchain;
const getLatestBlock = (): Block => blockchain[blockchain.length - 1];
const getNewTimestamp = (): number => Math.round(new Date().getTime() / 1000);

const createNewBlock = (data: string): Block => {
	const prevBlock: Block = getLatestBlock();
	const newIndex: number = prevBlock.index + 1;
	const newTimestamp: number = getNewTimestamp();
	const newHash: string = Block.calcBlockHash(
		newIndex,
		prevBlock.hash,
		newTimestamp,
		data
	);
	const newBlock: Block = new Block(
		newIndex,
		newHash,
		prevBlock.hash,
		data,
		newTimestamp
	);
  
  addBlock(newBlock);
  
  return newBlock;
};

const getHashForBlock = (aBlock: Block): string => Block.calcBlockHash(aBlock.index, aBlock.prevHash, aBlock.timestamp, aBlock.data);

const isBlockValid = (candidBlock: Block, prevBlock: Block): boolean => {
  if (!Block.validStructure(candidBlock)) {
    return false;
  } else if (prevBlock.index + 1 !== candidBlock.index) {
    return false;
  } else if (prevBlock.hash !== candidBlock.prevHash) {
    return false;
  } else if (getHashForBlock(candidBlock) !== candidBlock.hash) {
    return false;
  } else {
    return true;
  }
}

const addBlock = (candidBlock: Block): void => {
  if (isBlockValid(candidBlock, getLatestBlock())) {
    blockchain.push(candidBlock);
  }
}
createNewBlock("second");
createNewBlock("third");
createNewBlock("fourth");

console.log(getBlockchain());

export {};
