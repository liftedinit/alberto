import { act } from "react-dom/test-utils"
import actualCreate from "zustand"

const storeResetFns = new Set()

const create = (createState: any) => {
  const store = actualCreate(createState)
  const initialState = store.getState()
  storeResetFns.add(() => store.setState(initialState, true))
  return store
}

afterEach(() => {
  act(() => storeResetFns.forEach((resetFn: any) => resetFn()))
})

export default create
