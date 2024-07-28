# 🤑 Ludium Bounty

Visit [Ludium World](https://ludium.world/)

## 📄 Contracts

### Main

#### LD_ProgramFactory.sol

The implementation contract of the bounty proxy contract.
There can be various types depending on the nature of the bounty.
Currently, only the beta version, "education v0.1" is implemented.

#### LD_EduProgram.sol

TBD.

#### LD_Treasury.sol

The Ludium treasury contract where the fees from bounty rewards are collected.

#### LD_EventLogger.sol

Contract that records various events such as bounty creation, bounty claiming, etc.
By querying the EventLogger, all events can be logged without the need to track events from multiple proxy contracts.

<br>

### Extensions

TBD.

#### EduBounty.sol

TBD.

#### Log.sol

TBD.

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
forge doc --open --serve --port 7878 --include-libraries
```

### Build

```shell
forge build
```

### Test

```shell
forge test -vvv --ffi

# if you want gas report
forge test -vvv --ffi --gas-report

# if you want see all transaction trace
forge test -vvvvv --ffi
```

### Deploy

```shell
forge script script/Deploy.s.sol:Deploy --rpc-url <your_rpc_url>
```
