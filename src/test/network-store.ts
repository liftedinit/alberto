const SYMBOLS = {
  mabc: "ABC",
  mdef: "DEF",
  mghi: "GHI",
}

const BALANCES = {
  mabc: BigInt(1000000),
  mghi: BigInt(5000000),
}

function makeTimeInSecs(dateStr: string) {
  return new Date(dateStr).getTime() / 1000
}

function createEvent(
  id: string,
  type: string,
  from: string,
  to: string,
  time: string,
  symbolAddress: string,
  amount: BigInt,
) {
  return {
    id: Buffer.from(id),
    type,
    from,
    to,
    time: makeTimeInSecs(time),
    symbolAddress,
    amount,
  }
}

async function listEvents() {
  return {
    count: 4,
    events: [
      createEvent(
        "1",
        "send",
        "m111",
        "m888",
        "2023-05-09T08:03:00",
        "mabc",
        BigInt(1),
      ),
      createEvent(
        "2",
        "send",
        "m888",
        "ma111",
        "2022-04-07T08:01:00",
        "mghi",
        BigInt(3),
      ),
    ],
  }
}

async function getLedgerInfo() {
  return {
    symbols: new Map(Object.entries(SYMBOLS)),
  }
}

async function getBalance() {
  return {
    balances: new Map(Object.entries(BALANCES)),
  }
}

export const mockNetwork = () => {
  return {
    url: "mock/api",
    events: {
      list: jest.fn().mockImplementation(listEvents),
    },
    ledger: {
      info: jest.fn().mockImplementation(getLedgerInfo),
      balance: jest.fn().mockImplementation(getBalance),
    },
  }
}

export const mockErrorNetwork = () => {
  const network = mockNetwork()
  network.ledger.balance = jest
    .fn()
    .mockRejectedValue(new Error("an unexpected error occurred"))
  return network
}
