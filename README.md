<div align="center">
	<br>
	<img alt="Flowser logo" src="./logo.svg" width="150" height="150">
	<h1>FlowTea</h1>
	<p>
		<b>Let your appreciators buy you a Flow tea.</b>
	</p>
	<br>
	<br>
</div>

## 👋 Get started

### 1. Clone project

```shell
git clone https://github.com/onflowser/flowtea
```

### 2. Install dependencies

**Prerequisites:**
- Node.js (+ npm)
- [Flow CLI](https://docs.onflow.org/flow-cli/)

If the above requirements are met, you can proceed with npm lib installation.

```shell
cd frontend && npm i
cd ../backend && npm i
```

### 3. Run project

- backend: `npm run start:local`
- frontend: `npm run dev`
- flow emulator: check out [frontend/README](./frontend/README.md#Cadence)

## Configuration

The following env variables are available for configuration.

### Flow

Example configuration for staging deployment (`flow.staging.json`).
```json
{
  "accounts": {
    "testnet-account": {
      "address": "<insert-account-address>",
      "key": "<insert-private-key>"
    }
  },
  "deployments": {
    "testnet": {
      "testnet-account": [
        {
          "name": "FlowTea",
          "args": [
            {
              "type": "Address",
              "value": "0x7cba6748efed6e93"
            },
            {
              "type": "UFix64",
              "value": "0.05"
            }
          ]
        }
      ]
    }
  }
}

```

### Frontend
- `NEXT_PUBLIC_API_HOST` (default: `http://localhost:3000`)
- `NEXT_PUBLIC_FLOW_DEPLOYMENT_ACCOUNT_ADDRESS` (default: `0xf8d6e0586b0a20c7`)
- `NEXT_PUBLIC_FLOWTEA_ENV` (default: `development`)

### Backend

#### General
- `NODE_ENV` (default: `development`)

#### Database
- `TYPEORM_TYPE` (default: `mariadb`)
- `TYPEORM_HOST` (default: `localhost`)
- `TYPEORM_USERNAME` (default: ``)
- `TYPEORM_PASSWORD` (default: ``)
- `TYPEORM_DATABASE` (default: `test`)

#### Flow
- `FLOW_ACCESS_NODE` (default: `http://localhost:8080`)
- `FLOW_DEPLOYMENT_ACCOUNT_ADDRESS` (default: `0xf8d6e0586b0a20c7`)

#### Email
- `EMAIL_ENABLE_SENDING` (default: `false`)
- `EMAIL_SENDGRID_API_KEY` (required)
