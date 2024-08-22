export const LD_ProgramFactoryABI = [
  {
    type: 'constructor',
    inputs: [
      { name: '_implementation', type: 'address', internalType: 'address' },
      { name: '_feeRatio', type: 'uint256', internalType: 'uint256' },
      { name: '_treasury', type: 'address', internalType: 'address' },
    ],
    stateMutability: 'nonpayable',
  },
  { type: 'receive', stateMutability: 'payable' },
  {
    type: 'function',
    name: 'createProgram',
    inputs: [
      { name: 'programId', type: 'uint256', internalType: 'uint256' },
      { name: 'managers', type: 'address[]', internalType: 'address[]' },
      {
        name: 'prizeConfig',
        type: 'tuple[]',
        internalType: 'struct EduBounty.PrizeConfig[]',
        components: [
          { name: 'auditor', type: 'address', internalType: 'address' },
          { name: 'prize', type: 'uint256', internalType: 'uint256' },
        ],
      },
      { name: 'start', type: 'uint256', internalType: 'uint256' },
      { name: 'end', type: 'uint256', internalType: 'uint256' },
    ],
    outputs: [{ name: '', type: 'address', internalType: 'address' }],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    name: 'eventLogger',
    inputs: [],
    outputs: [{ name: '', type: 'address', internalType: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'feeRatio',
    inputs: [],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'implementation',
    inputs: [],
    outputs: [{ name: '', type: 'address', internalType: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'treasury',
    inputs: [],
    outputs: [{ name: '', type: 'address', internalType: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'event',
    name: 'EventLogger',
    inputs: [{ name: 'eventLogger', type: 'address', indexed: true, internalType: 'address' }],
    anonymous: false,
  },
] as const;
