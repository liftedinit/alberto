# Albert

Albert by L1 Labs is a cryptocurrency wallet that can hold identities and manage
communications with a ledger running as a module on a network that supports the
Many Protocol.

## Getting Started

To start Albert, install dependencies and then run locally.

```sh
npm install
npm start
```

## e2e Testing

- Start up local many-server. ex: run `./scripts/run.sh` in many-framework
- Make a duplicate of `e2e/.env.example` and name it `.env` in `e2e/`. Result
  should be `e2e/.env`
- Edit the variables in `e2e/.env`
  - `MAIN_WALLET_PEM` should be the PEM file of the address with initial tokens
    found in `ledger_state.json5` in many-framework.
  ```
  initial: {
      "maffbahksdwaqeenayy2gxke32hgb7aq4ao4wt745lsfs6wijp": {
          "MFX": 1000000000
      }
  },
  ```
  - Add the three seed phrses
- Run `npm run test:e2e` to run playwright tests locally

Albert will also be available on mobile devices as an "installable" progressive
web application via GitHub Pages once this repository has been made publicly
available.
