import React, { useState, useContext } from "react"
import { useNavigate, Link } from "react-router-dom"
import { toast } from 'react-toastify'
import omni from "omni"
import { Identity } from "omni/dist/identity"
import { Amount } from "../store/balances";
import { Uint8Array2Hex } from "../helper/convert"
import Header from "../components/Header"
import Page from "../components/Page"
import Button from "../components/Button"
import Input from "../components/Input"
import Select from "../components/Select"
import HistoryDetailItem from "../components/HistoryDetailItem";
import { StoreContext } from "../store"
import { displayNotification } from "../helper/common"
import { TransactionType, Order } from "omni/dist/types"
import { TransactionDetails, TransactionId } from "../store/transactions"

export interface FilterType {
  value: number,
  name: string,
}

enum SearchTypes {
  IDENTITY = 1,
  TRANSACTION = 2,
  SYMBOL = 3,
}

const filterTypes: Array<FilterType> = [
  { value: SearchTypes.IDENTITY, name: 'Identity' },
  { value: SearchTypes.TRANSACTION, name: 'Transaction Id' },  
]

const orderTypes: Array<any> = [
  { value: Order.indeterminate, label: "Indeterminate" },
  { value: Order.ascending, label: "Ascending" },
  { value: Order.descending, label: "Decending" },
]

const rowLimits: Array<any> = [
  { value: 5, label: "5 Transactions" },
  { value: 10, label: "10 Transactions" },
  { value: 50, label: "50 Transactions" },
  { value: 'all', label: "All Transactions" },
]

const transactionTypes: Array<any> = [
  { value: 'all', label: "All" },
  { value: TransactionType.send, label: "Transaction Send" },
  { value: TransactionType.mint, label: "Transaction Mint" },
  { value: TransactionType.burn, label: "Transaction Burn" },
]

const SearchView = () => {
  const navigate = useNavigate()
  const { dispatch, state } = useContext(StoreContext)

  const activeAccountId = state.accounts.activeId
  const activeServerId = state.servers.activeId
  const symbols = state.balances.symbols

  const [type, setType] = useState<number>(SearchTypes.IDENTITY)
  const [value, setValue] = useState<string>('oaffbahksdwaqeenayy2gxke32hgb7aq4ao4wt745lsfs6wijp')
  const [result, setResult] = useState([])
  const [limit, setLimit] = useState<any>(5)
  const [order, setOrder] = useState<Order>(Order.indeterminate)
  const [transactionType, setTransactionType] = useState<any>('all')
  const [symbol, setSymbol] = useState<any>('FBT')
  const [balances, setBalances] = useState<any>([])

  const [transactionCount, setTransactionCount] = useState<number>(0)
  const [transactions, setTransactions] = useState<any>([])
  const handleSymbolType = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const symbolType = parseInt(event.target.value)
    setSymbol(symbolType)
  }

  const handleFilterType = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const filterType = parseInt(event.target.value)
    setType(filterType)
  }

  const handleFilterInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const filterInput = event.target.value
    setValue(filterInput)
  }

  const handleLimit = (event: React.ChangeEvent<HTMLInputElement>) => {
    const limit = event.target.value
    setLimit(limit)
  }

  const handleOrderType = (event: React.ChangeEvent<HTMLInputElement>) => {
    const orderType: any = event.target.value
    setOrder(orderType)
  }

  const handleTransactionType = (event: React.ChangeEvent<HTMLInputElement>) => {
    const tType = event.target.value
    setTransactionType(tType)
  }

  const handleSearch = async (event: React.MouseEvent) => {
    if (isNaN(type)) {
      toast.warning('Please select the filter type.')
      return
    }
    // Get the current user
    try {
      const activeAccount = state.accounts.byId.get(activeAccountId)!
      const activeServer = state.servers.byId.get(activeServerId)!
      const { keys } = activeAccount
      const { url } = activeServer
      const server = omni.server.connect(url)
      // Filter arguments
      let filter = new Map();

      switch (type) {
        case SearchTypes.IDENTITY:
          const identity: Identity = omni.identity.fromString(value)
          // Balance Info
          const balanceInfo = await server.ledgerBalance(identity, symbol, keys!)
          setBalances(balanceInfo)
          
          break
        case SearchTypes.TRANSACTION:
          break        
        default:
          break
      }
      
      filter.set(0, value);
      if (transactionType !== 'all') {
        filter.set(1, parseInt(transactionType))
      }
      
      let argument = new Map();
      if (limit !== 'all') {
        argument.set(0, parseInt(limit))
      }
      argument.set(1, parseInt(order.toString()))
      argument.set(2, filter)
      
      const transactionInfo = await server.ledgerList(argument)
      console.log(transactionInfo)


      setTransactionCount(transactionInfo[0])
      let byTransactionId = new Map<TransactionId, TransactionDetails>();
      const transactionPayload = transactionInfo[1];

      transactionPayload?.forEach((transaction: any, transactionId: TransactionId) => {      
        const uid = transaction.has(0)? transaction.get(0) : '';  
        const timestamp: any = transaction.has(1) ? transaction.get(1) : null;
        const details = transaction.has(2) ? transaction.get(2) : [];
 
        if (details.length === 5) {
          const type: number = details[0];
          const from: string = Uint8Array2Hex(details[1]);
          const to: string = Uint8Array2Hex(details[2]);
          const symbol: string = details[3];
          const amount: Amount = details[4];

          const detail: TransactionDetails = { uid, amount, symbol, from, to, timestamp, type };          
          byTransactionId.set(transactionId, detail);
        }
      })
      setTransactions(byTransactionId)
      console.log(byTransactionId)
    } catch (e) {
      displayNotification(e)
    }
  }

  return (
    <Page>
      <Header>
        <Header.Right>
          <Link to="/">Back</Link>
        </Header.Right>
      </Header>
      <div key='Filter'>
        <Select
          name="type"
          label="Filter Type"
          onChange={handleFilterType}
          options={Array.from(filterTypes, (filterType) => ({
            label: filterType.name,
            value: filterType.value,
          }))}
          defaultValue="1"
        />
        <Input
          name="filter"
          label="Filter Input"
          onChange={handleFilterInput}
          defaultValue={value}
        />
        <Select
          name="symbol"
          label="SYMBOLS"
          options={Array.from(symbols, (s) => ({
            label: s,
            value: s
          }))}
          defaultValue={symbol}
          onChange={handleSymbolType}
        />
        <Select
          name="limit"
          label="Limit Amount"
          options={Array.from(rowLimits, (row) => ({
            label: row.label,
            value: row.value
          }))}
          defaultValue={5}
          onChange={handleLimit}
        />
        <Select
          name="order"
          label="Order Type"
          options={Array.from(orderTypes, (orderType) => ({
            label: orderType.label,
            value: orderType.value
          }))}
          defaultValue={order}
          onChange={handleOrderType}
        />
        <Select
          name="transactionType"
          label="Transaction Type"
          options={Array.from(transactionTypes, (t) => ({
            label: t.label,
            value: t.value
          }))}
          defaultValue={transactionType}
          onChange={handleTransactionType}
        />
        <Button
          label="Search..."
          onClick={handleSearch}
        />
      </div>
      <div className="SearchResult">
        {
          type === SearchTypes.IDENTITY && balances && (
            <div className="BalanceInfo">
              <h3>Balances:</h3>
              {
                Object.keys(balances).map((key) => (
                  Object.keys(balances[key]).map((s) => (
                    <div className="Balance" key={`symbol-${s}`}>
                      <span>{s}</span>
                      <span>{balances[key][s]}</span>
                    </div>
                  ))
                ))
              }
            </div>
          )
        }

        <h3>Transactions: </h3>
        <h4>All transaction count: {transactionCount}</h4>
        {Array.from(transactions, ([id, row]) => (
          <div key={row.uid}>
            <HistoryDetailItem
              transaction={row}
            />
          </div>
        ))}
      </div>
    </Page>
  )
}

export default SearchView