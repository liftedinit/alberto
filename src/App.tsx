import React from "react"
import { Outlet } from "react-router"
import { Routes, Route } from "react-router-dom"
import { Layout } from "components"
import {
  Accounts,
  AccountDetails,
  AccountsList,
  Contacts,
  Home,
  SendAsset,
  SplashView,
} from "./views"

const ONE_SECOND = 1 * 1000

function App() {
  const [showSplash, setShowSplash] = React.useState(true)
  React.useEffect(() => {
    let id = setTimeout(() => setShowSplash(false), ONE_SECOND)
    return () => clearTimeout(id)
  }, [])

  if (showSplash) {
    return <SplashView />
  }
  return (
    <Routes>
      <Route
        path="/"
        element={
          <Layout>
            <Outlet />
          </Layout>
        }
      >
        <Route index element={<Home />} />
        <Route path="accounts" element={<Accounts />}>
          <Route index element={<AccountsList />} />
          <Route path=":accountAddress" element={<AccountDetails />} />
        </Route>
        <Route path="contacts" element={<Contacts />} />
        <Route path="send" element={<SendAsset />} />
      </Route>
    </Routes>
  )
}

export default App
