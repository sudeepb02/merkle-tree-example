export const WhitelistAbi = [
    {
        "inputs": [
            {
                "internalType": "bytes32",
                "name": "_merkleRoot",
                "type": "bytes32"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "inputs": [],
        "name": "merkleRoot",
        "outputs": [
            {
                "internalType": "bytes32",
                "name": "",
                "type": "bytes32"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "bytes32",
                "name": "root",
                "type": "bytes32"
            },
            {
                "internalType": "bytes32",
                "name": "leaf",
                "type": "bytes32"
            },
            {
                "internalType": "bytes32[]",
                "name": "proof",
                "type": "bytes32[]"
            },
            {
                "internalType": "uint256[]",
                "name": "positions",
                "type": "uint256[]"
            }
        ],
        "name": "verify",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "pure",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "bytes32[]",
                "name": "_proof",
                "type": "bytes32[]"
            },
            {
                "internalType": "uint256[]",
                "name": "_positions",
                "type": "uint256[]"
            }
        ],
        "name": "verifyWhitelist",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
]