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
cadence emulator start --contracts
```

After that, start your local development wallet:
```shell
cadence dev-wallet
```

Then you can deploy project contracts with:
```shell
cadence deploy
```
