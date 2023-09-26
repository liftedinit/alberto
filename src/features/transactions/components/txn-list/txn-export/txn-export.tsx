import { useTransactionsList } from "../../../queries"
import { Button } from "@liftedinit/ui"
import { ListFilterArgs } from "@liftedinit/many-js"
import { useEffect, useState } from "react"

export function TxnExport({ address }: { address: string }) {
  console.log("TxnExport Rendering")
  const [shouldFetch, setShouldFetch] = useState(false)

  const queryData = useTransactionsList({
    address,
    filter: {} as ListFilterArgs,
    count: 100, // TODO: There might be more than 100txs, advise
    enabled: shouldFetch,
  })

  const initiateExport = () => {
    setShouldFetch(true)
  }

  useEffect(() => {
    if (!queryData.isLoading && shouldFetch) {
      // check if it's done loading and was triggered
      exportTransactions()
    }
  }, [queryData, shouldFetch])
  const exportTransactions = () => {
    const {
      data,
      isLoading,
      isError,
      error,
      nextBtnProps,
      prevBtnProps,
      hasNextPage,
      currPageCount,
    } = queryData

    if (!isLoading) {
      console.log("DATA:", data)
      // const flat = txn.map(group => group.children).flat()
      const a = document.createElement("a")
      // const file = new Blob([JSON.stringify(flat)], { type: "text/plain" })
      const date = new Date().toISOString().split("T")[0]
      // a.href = URL.createObjectURL(file)
      a.download = `transactions_${date}.csv`
      a.click()
    }
  }

  return (
    <>
      <Button
        lineHeight="normal"
        size="sm"
        w={{ base: "full", md: "auto" }}
        onClick={initiateExport}
      >
        Export
      </Button>
    </>
  )
}
