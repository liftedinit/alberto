import { randomUUID } from "crypto"

export const mockRandomUUID = () => {
  const mockUuid = "mockUUID"
  randomUUID.mockReturnValue(mockUuid)
}
