import React from "react"
import {
  AddAccountMethodProps,
  AddAccountMethodTypes,
} from "../add-account-modal"
import { CreateFlow, CreateContextProvider } from "./create"
import { ImportFlow } from "./import"

export function HardwareAuthenticator({
  addMethod,
  setAddMethod,
  setShowDefaultFooter,
  onSuccess,
}: AddAccountMethodProps & {
  addMethod: AddAccountMethodTypes
  setShowDefaultFooter: (show: boolean) => void
}) {
  const isCreate = addMethod === AddAccountMethodTypes.createAuthenticator

  React.useEffect(() => {
    setShowDefaultFooter(false)
    return () => {
      setShowDefaultFooter(true)
    }
  }, [setShowDefaultFooter])

  return isCreate ? (
    <CreateContextProvider>
      <CreateFlow setAddMethod={setAddMethod} onSuccess={onSuccess} />
    </CreateContextProvider>
  ) : (
    <ImportFlow setAddMethod={setAddMethod} onSuccess={onSuccess} />
  )
}
