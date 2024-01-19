import { BlockchainBlock, BlockchainTransaction } from "@liftedinit/many-js"

const transactionToHash = (transaction: BlockchainTransaction) => {
  return Buffer.from(transaction.transactionIdentifier.hash).toString("hex")
}

export const processBlock = (block: BlockchainBlock, eventNumber: number) => {
  if (block.transactions.length === 0) {
    throw new Error("No transactions found in the block.")
  }

  if (eventNumber < 1 || eventNumber > block.transactions.length) {
    throw new Error(
      `Event number ${eventNumber} is out of bounds for the transactions array.`,
    )
  }

  const transaction = block.transactions[eventNumber - 1]
  return transactionToHash(transaction)
}
