import { useBalances } from "../features/balances"

export const mockUseBalance = () => {
  const createAsset = (identity: string, symbol: string, balance: bigint) => ({
    identity,
    symbol,
    balance,
  })

  const mockBalances = {
    data: {
      ownedAssetsWithBalance: [createAsset("1", "MFX", BigInt(2000000000))],
    },
    isLoading: false,
    isError: false,
    errors: undefined,
  }

  useBalances.mockImplementation(() => mockBalances)
}
