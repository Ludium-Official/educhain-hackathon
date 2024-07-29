# 🤑 Ludium Program

Visit [Ludium World](https://ludium.world/)

## Structure

![image](https://github.com/user-attachments/assets/24095a6c-9414-47dc-a050-1aa1af8e26d2)

<br>

## 📄 Contracts

### Main

#### LD_ProgramFactory.sol

Deployed Address : `0xb083002bfbfB442b2EBa2CDbCf770C34b5789267`
BlockScout: [0xb083002bfbfB442b2EBa2CDbCf770C34b5789267](https://opencampus-codex.blockscout.com/address/0xb083002bfbfB442b2EBa2CDbCf770C34b5789267)

The implementation contract of the bounty proxy contract.
There can be various types depending on the nature of the bounty.

#### LD_EduProgram.sol

Deployed Address : `0x676bE174Cc2958370508F2fF71f47bA12AcFd1F7`
BlockScout: [0x676bE174Cc2958370508F2fF71f47bA12AcFd1F7](https://opencampus-codex.blockscout.com/address/0x676bE174Cc2958370508F2fF71f47bA12AcFd1F7)

This contract corresponds 1:1 with the program.
It is an implementation contract, and there may be other types besides Edu in the future.
The naming convention is "LD\_`<type>`Program.sol".

#### LD_Treasury.sol

The Ludium treasury contract where the fees from bounty rewards are collected.

#### LD_EventLogger.sol

Deployed Address : `0xCA838B081F08569293ea68F813567a73FD1F1ade`
BlockScout: [0xCA838B081F08569293ea68F813567a73FD1F1ade](https://opencampus-codex.blockscout.com/address/0xCA838B081F08569293ea68F813567a73FD1F1ade)

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
