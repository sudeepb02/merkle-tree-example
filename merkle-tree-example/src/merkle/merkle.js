// It would probably be better to store this as a json or in another file, but just for sake of example
const whitelist = [
    "0x29c36265c63fE0C3d024b2E4d204b49deeFdD671",
    "0x1f558fa1e453947c7317b37a9f816d449979a6a8",
    "0x1c72f37a8a778c3c284f06d1b87aaf8463206f59",
    "0xd7a9ccad4ddb88f9a39fcc87748a045767baf5dd",
    "0x97bb1efc534ff3dc0ddf5fb83743605d5faecb27",
    "0x955b6f06981d77f947f4d44ca4297d2e26a916d7",
    "0xb5696e4057b9ba76616cecb5a537eaca7b3cdf54",
    "0x7daa8740fe15f9a0334ff2d6210ef65bd61ee8bf",
    "0x67f155474eb685aef6cd874169f25b3bded6aea6",
]

const { MerkleTree } = require("merkletreejs");
const keccak256 = require('keccak256')

const buf2hex = x => '0x'+x.toString('hex')

const leaves = whitelist.map(x => keccak256(x))
const tree = new MerkleTree(leaves, keccak256);
// const root = tree.getRoot();
// const hexRoot = buf2hex(root);
// console.log(hexRoot)

// const leaf = keccak256("0x29c36265c63fE0C3d024b2E4d204b49deeFdD671")
// const hexLeaf = buf2hex(leaf)
// const proof = tree.getProof(leaf)
// const hexProof = tree.getProof(leaf).map(x => buf2hex(x.data))
// const positions = tree.getProof(leaf).map(x => x.position === 'right' ? 1 : 0)

export { tree };