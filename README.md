# Alberto

[![coverage](https://img.shields.io/codecov/c/gh/liftedinit/alberto)](https://app.codecov.io/gh/liftedinit/alberto)

Alberto by Lifted Labs is a cryptocurrency wallet that can hold identities and
manage communications with a ledger running as a module on a network that
supports the Many Protocol.

## Getting Started

To start Alberto, install dependencies and then run locally.

```sh
npm install
npm start
```

## e2e Testing

- Start up local many-server. ex: run `./scripts/run.sh` in many-framework
- Make a duplicate of `e2e/.env.example` and name it `.env` in `e2e/`. Result
  should be `e2e/.env`
- Edit the variables in `e2e/.env` if needed
  - If address (...wijp) below differs from what's found in `ledger_state.json5`
    in `many-framework`, change `MAIN_WALLET_PEM` to be the PEM file of that
    address. Otherwise, keep the default.
  ```
  initial: {
      "maffbahksdwaqeenayy2gxke32hgb7aq4ao4wt745lsfs6wijp": {
          "MFX": 1000000000
      }
  },
  ```
  - Three seed phrases are already included. Change them if you prefer to use
    different ones.
- Run `npm run test:e2e` to run playwright tests locally

Alberto will also be available on mobile devices as an "installable" progressive
web application via GitHub Pages once this repository has been made publicly
available.

## Web3auth

- Lifted web3auth dashboard: https://dashboard.web3auth.io/
- Users dashboard: https://app.openlogin.com/

## Version

Alberto is currently pre-release alpha software, so incrementing the version
(which will trigger creating a GitHub Release) is best accomplished with the
following command:

```sh
npm version prerelease --preid alpha
```
