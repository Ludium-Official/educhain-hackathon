# 🤑 Ludium Bounty

<br>

## 📄 Contracts

### BountyProxy

Proxy contract for each bounty program

### Bounty

The implementation contract of the bounty proxy contract.
There can be various types depending on the nature of the bounty.
Currently, only the beta version, "education v0.1" is implemented.

### Treasury

The Ludium treasury contract where the fees from bounty rewards are collected.

### EventLogger

Contract that records various events such as bounty creation, bounty claiming, etc.
By querying the Tracker, all events can be logged without the need to track events from multiple proxy contracts.

<br>

## Documentation

TBD

<br>

## Usage

### Start

```shell
forge install
```

### Build

```shell
forge build
```

### Test

```shell
forge test
```

### Deploy

```shell
forge script script/Counter.s.sol:CounterScript --rpc-url <your_rpc_url> --private-key <your_private_key>
```
