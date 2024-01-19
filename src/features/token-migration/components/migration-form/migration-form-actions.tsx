import { defaultValues, StepNames, TokenMigrationFormData } from "./types"

export const initialState = {
  currentStep: StepNames.ADDRESS,
  formData: defaultValues(),
  filters: {},
  height: undefined,
  eventNumber: undefined,
  memo: crypto.randomUUID(),
  txHash: "",
  processingDone: false,
}

interface MigrationFormState {
  currentStep: StepNames
  formData: TokenMigrationFormData
  filters: Record<string, any>
  height: number | undefined
  eventNumber: number | undefined
  memo: string
  txHash: string
  processingDone: boolean
}

enum MigrationFormActionTypes {
  SET_CURRENT_STEP = "SET_CURRENT_STEP",
  SET_FORM_DATA = "SET_FORM_DATA",
  SET_FILTERS = "SET_FILTERS",
  SET_HEIGHT = "SET_HEIGHT",
  SET_EVENT_NUMBER = "SET_EVENT_NUMBER",
  SET_TX_HASH = "SET_TX_HASH",
  SET_PROCESSING_DONE = "SET_PROCESSING_DONE",
}

type MigrationFormAction =
  | { type: MigrationFormActionTypes.SET_CURRENT_STEP; payload: StepNames }
  | {
      type: MigrationFormActionTypes.SET_FORM_DATA
      payload: Partial<TokenMigrationFormData>
    }
  | { type: MigrationFormActionTypes.SET_FILTERS; payload: Record<string, any> }
  | { type: MigrationFormActionTypes.SET_HEIGHT; payload: number | undefined }
  | {
      type: MigrationFormActionTypes.SET_EVENT_NUMBER
      payload: number | undefined
    }
  | { type: MigrationFormActionTypes.SET_TX_HASH; payload: string }
  | { type: MigrationFormActionTypes.SET_PROCESSING_DONE; payload: boolean }

export const reducer = (
  state: MigrationFormState,
  action: MigrationFormAction,
) => {
  switch (action.type) {
    case MigrationFormActionTypes.SET_CURRENT_STEP:
      return { ...state, currentStep: action.payload }
    case MigrationFormActionTypes.SET_FORM_DATA:
      return { ...state, formData: { ...state.formData, ...action.payload } }

    case MigrationFormActionTypes.SET_FILTERS:
      return { ...state, filters: action.payload }

    case MigrationFormActionTypes.SET_HEIGHT:
      return { ...state, height: action.payload }

    case MigrationFormActionTypes.SET_EVENT_NUMBER:
      return { ...state, eventNumber: action.payload }

    case MigrationFormActionTypes.SET_TX_HASH:
      return { ...state, txHash: action.payload }

    case MigrationFormActionTypes.SET_PROCESSING_DONE:
      return { ...state, processingDone: action.payload }
    default:
      return state
  }
}

export const setCurrentStep = (step: StepNames): MigrationFormAction => ({
  type: MigrationFormActionTypes.SET_CURRENT_STEP,
  payload: step,
})

export const setFormData = (
  data: Partial<TokenMigrationFormData>,
): MigrationFormAction => ({
  type: MigrationFormActionTypes.SET_FORM_DATA,
  payload: data,
})

export const setFilters = (
  filters: Record<string, any>,
): MigrationFormAction => ({
  type: MigrationFormActionTypes.SET_FILTERS,
  payload: filters,
})

export const setHeight = (height: number | undefined): MigrationFormAction => ({
  type: MigrationFormActionTypes.SET_HEIGHT,
  payload: height,
})

export const setEventNumber = (
  eventNumber: number | undefined,
): MigrationFormAction => ({
  type: MigrationFormActionTypes.SET_EVENT_NUMBER,
  payload: eventNumber,
})

export const setTxHash = (txHash: string): MigrationFormAction => ({
  type: MigrationFormActionTypes.SET_TX_HASH,
  payload: txHash,
})

export const setProcessingDone = (
  processingDone: boolean,
): MigrationFormAction => ({
  type: MigrationFormActionTypes.SET_PROCESSING_DONE,
  payload: processingDone,
})
