import { useCreateSendTxn } from "../features/transactions"

export const mockUseCreateSendTransaction = () => {
  useCreateSendTxn.mockReturnValue({
    mutateAsync: jest.fn().mockResolvedValue(true),
  })
}
