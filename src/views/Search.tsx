import React, { useState, useContext, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import ReactPaginate from "react-paginate"
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
  { value: SearchTypes.IDENTITY, name: 'Identity' }
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

  const [limit, setLimit] = useState<any>(5)
  const [order, setOrder] = useState<Order>(Order.descending)
  const [transactionType, setTransactionType] = useState<TransactionType>(TransactionType.send)
  const [symbol, setSymbol] = useState<string>('FBT')
  const [symbolIdentity, setSymbolIdentity] = useState<any>()
  const [balances, setBalances] = useState<any>([])

  const [transactionCount, setTransactionCount] = useState<number>(0)
  const [transactions, setTransactions] = useState<any>([])

  // Paginate
  const [offset, setOffset] = useState<number>(0)
  const [pageCount, setPageCount] = useState<number>(0)

  const handleSymbolType = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value    
    if ( value !== '') {
      const identity: Identity = omni.identity.fromString(value)
      setSymbol(value)
      setSymbolIdentity(identity)
    } else {
      setSymbolIdentity(undefined)
    }
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
    setLimit(parseInt(limit))
    setOffset(1)
  }

  const handleOrderType = (event: React.ChangeEvent<HTMLInputElement>) => {
    const orderType = event.target.value
    setOrder(parseInt(orderType))
  }

  const handleTransactionType = (event: React.ChangeEvent<HTMLInputElement>) => {
    const tType = event.target.value
    setTransactionType(parseInt(tType))
  }

  const handleSearch = async (event: React.MouseEvent) => {
    if (isNaN(type)) {
      toast.warning('Please select the filter type.')
      return
    }    
    await getData()
  }

  const getData = async () => {
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
          if (symbolIdentity !== undefined) {
            const balanceInfo = await server.ledgerBalance(identity, symbolIdentity, keys!)
            console.log(balanceInfo)
            setBalances(balanceInfo)
          }
          break
        case SearchTypes.TRANSACTION:

          break
        default:
          break
      }

      /******************************************************************
      ; A filter argument for transactions.
      filter = {
          ; Filter by account affected.
          ? 0 => identity / [ * identity ],

          ; Filter by transaction type.
          ? 1 => transaction-type / [ * transaction-type ],

          ; Filter by symbol.
          ? 2 => symbol / [ * symbol ],

          ; Filter by transaction ID range.
          ? 3 => range<transaction-id>,
              ; A Range of scalar. Must specify both bounds, but can specify any bound to being
              ; unbounded. If omitted, the value is unbounded.
              range<T> = {
                  ; Lower bound.
                  ? 0 => bound<T>1,
                  ; Upper bound.
                  ? 1 => bound<T>,
              }

              ; A bound, either upper or lower, serialized.
              bound<T> =
                  ; Unbounded.
                  [] /
                  ; Inclusive bound.
                  / [0, T]
                  ; Exclusive bound.
                  / [1, T]

          ; Filter by date range.
          ? 4 => range<time>,
      }
      *****************************************************************/
      const countFilter = new Map()
      const countArgument = new Map()

      if (value !== "") {
        filter.set(0, value);        
        countFilter.set(0, value)
      }

      if (!isNaN(transactionType)) {
        filter.set(1, transactionType)
      }

      if (symbolIdentity !== undefined) {
        filter.set(2, symbolIdentity)
      }

      if (offset > 0 && !isNaN(limit) ) {
        let bound = 1
        let T = 0

        switch (order) {
          case Order.descending:
            T = transactionCount - offset * limit + parseInt(limit) + 1
            break;
          case Order.indeterminate:
          case Order.ascending:
            T = (offset - 1) * limit + 1
            bound = 0
            break;
        }

        let range = new Map()
        range.set(bound, [1, T])
        filter.set(3, range)
      }

      /******************************************************************
      ; Maximum number of transactions to return. The server can still limit the number of
      ; transactions it returns.
      ? 0 => uint,
  
      ; Whether or not to show the last transactions or the first ones. The default behaviour
      ; is left to the server implementation.
      ? 1 => order,
  
      ; Transaction filter criteria.
      ? 2 => filter,
      *****************************************************************/
      // Get Transaction Count
      

      let argument = new Map();
      if (!isNaN(limit)) {
        argument.set(0, limit)
      }

      if (!isNaN(order)) {
        argument.set(1, order)
      }

      argument.set(2, filter)
      countArgument.set(2, countFilter)
      const countTransactionInfo = await server.ledgerList(countArgument)

      const transactionInfo = await server.ledgerList(argument)

      let byTransactionId = new Map<TransactionId, TransactionDetails>();
      const transactionPayload = transactionInfo[1];
      
      if (countTransactionInfo[1]?.length > 0) {
        setTransactionCount(countTransactionInfo[1].length)
        setPageCount(Math.floor(Math.floor(parseInt(countTransactionInfo[1].length) + parseInt(limit) - 1) / limit))
      } else {
        setTransactionCount(0)
      }
      transactionPayload?.forEach((transaction: any, transactionId: TransactionId) => {
        const uid = transaction.has(0) ? transaction.get(0) : '';
        const timestamp: any = transaction.has(1) ? transaction.get(1) : null;
        const details = transaction.has(2) ? transaction.get(2) : [];

        if (details.length === 5) {
          const type: number = details[0];
          const from: string = Uint8Array2Hex(details[1]);
          const to: string = Uint8Array2Hex(details[2]);
          const symbol: Identity = omni.identity.fromString(details[3]);
          const amount: Amount = details[4];

          const detail: TransactionDetails = { uid, amount, symbol, from, to, timestamp, type };
          byTransactionId.set(transactionId, detail);
        }
      })
      setTransactions(byTransactionId)
    } catch (e) {
      displayNotification(e)
    }
  }

  useEffect(() => {
    getData()
  }, [offset])

  const handlePageNumber = (event: any) => {
    const selectedPage = event.selected;
    setOffset(selectedPage + 1)
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
            label: s[1],
            value: s[0]
          }))}
          defaultValue={symbol || "FBT"}
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
          defaultValue={order || ""}
          onChange={handleOrderType}
        />
        <Select
          name="transactionType"
          label="Transaction Type"
          options={Array.from(transactionTypes, (t) => ({
            label: t.label,
            value: t.value
          }))}
          defaultValue={transactionType || TransactionType.send}
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
        {
          transactionCount > 0 && (
            <ReactPaginate
              previousLabel={"Prev"}
              nextLabel={"Next"}
              breakLabel={"..."}
              breakClassName={"break-me"}
              pageCount={pageCount}
              onPageChange={handlePageNumber}
              containerClassName={"Pagination"}
              activeClassName={"active"}
            />
          )
        }
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