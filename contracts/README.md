# 🤑 Ludium Program

Visit [Ludium World](https://ludium.world/)

## Structure

![image](https://github.com/user-attachments/assets/24095a6c-9414-47dc-a050-1aa1af8e26d2)

<br>

## 📄 Contracts

### Main

#### LD_ProgramFactory.sol

Deployed Address : `0xD5595Cb547b4d071953d5E9f3De855D8AD5512dC`

BlockScout: [0xD5595Cb547b4d071953d5E9f3De855D8AD5512dC](https://opencampus-codex.blockscout.com/address/0xD5595Cb547b4d071953d5E9f3De855D8AD5512dC)

The implementation contract of the bounty proxy contract.
There can be various types depending on the nature of the bounty.

#### LD_EduProgram.sol

Deployed Address : `0x260089fe94760c6ac1f0edf792a61d879106e371`

BlockScout: [0x260089fe94760c6ac1f0edf792a61d879106e371](https://opencampus-codex.blockscout.com/address/0x260089fe94760c6ac1f0edf792a61d879106e371)

This contract corresponds 1:1 with the program.
It is an implementation contract, and there may be other types besides Edu in the future.
The naming convention is "LD\_`<type>`Program.sol".

#### LD_Treasury.sol

The Ludium treasury contract where the fees from bounty rewards are collected.

#### LD_EventLogger.sol

Deployed Address : `0xcf905320ce1bd7488f77627210903d69a3cb3a80`

BlockScout: [0xcf905320ce1bd7488f77627210903d69a3cb3a80](https://opencampus-codex.blockscout.com/address/0xcf905320ce1bd7488f77627210903d69a3cb3a80)

Contract that records various events such as bounty creation, bounty claiming, etc.
By querying the EventLogger, all events can be logged without the need to track events from multiple proxy contracts.

<br>

### Extensions

Contracts are divided by functionality. All functions are defined as internal in Extensions,
and the necessary functions are defined in the "LD\_`<type>`Program.sol" contract.

#### EduBounty.sol

Functions of bounty

#### Log.sol

Functions of logging

<br>

## Requirement

```
# foundry
curl -L https://foundry.paradigm.xyz | bash
```

## Usage

### Start

```shell
forge install
yarn install
# or npm install
```

### Documentation

```shell
yarn doc
```

### Build

```shell
yarn build
```

### Test

```shell
yarn test

# if you want gas report
forge test -vvv --ffi --gas-report

# if you want see all transaction trace
forge test -vvvvv --ffi
```

### Deploy

```shell
yarn deploy
```
