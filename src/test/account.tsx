import { useCombinedAccountInfo } from "../features/accounts/queries"
import { IdTypes } from "../features/token-migration/components/migration-form/types"

const mockUserAddr = "mah7vxcf3l4aklypotgjmwy36y2kk2metkqidcizo4jnfttild"
const mockAccountAddr =
  "mqd7vxcf3l4aklypotgjmwy36y2kk2metkqidcizo4jnfttiaaaaqkt"
export const mockUseCombinedAccountInfo = () => {
  const mockCombinedAccountInfo = new Map([
    // A User
    [
      mockUserAddr,
      {
        idType: IdTypes.USER,
        address: mockUserAddr,
        id: 1,
        name: "mockUser",
      },
    ],
    // An Account
    [
      mockAccountAddr,
      {
        idType: IdTypes.ACCOUNT,
        address: mockAccountAddr,
        name: "mockAccount",
      },
    ],
  ])
  useCombinedAccountInfo.mockImplementation(() => mockCombinedAccountInfo)
}
