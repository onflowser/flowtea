# FlowTea client

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Cadence

All Cadence related files (for Flow blockchain) are located under `flow` module.

In development, first start your local emulator blockchain:
```shell
flow emulator start --dev-wallet --contracts
```

Then you can deploy project contracts with:
```shell
flow deploy
```
