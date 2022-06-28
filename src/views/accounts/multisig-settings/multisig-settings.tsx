import React from "react"
import {
  AccountFeatureTypes,
  AccountInfoData,
  AccountMultisigArgument,
} from "many-js"
import {
  Alert,
  AlertIcon,
  AlertDescription,
  Box,
  Button,
  FormControl,
  FormLabel,
  FormHelperText,
  Flex,
  Input,
  InputProps,
  RadioGroup,
  Radio,
  HStack,
  Select,
  VStack,
} from "components"
import { approverRoles, useMultisigSetDefaults } from "features/accounts"
import { getHoursMinutesSecondsFromSeconds } from "helper/convert"

export function MultisigSettings({
  accountAddress,
  accountInfo,
}: {
  accountAddress: string | undefined
  accountInfo: AccountInfoData | undefined
}) {
  const isInitialValuesSet = React.useRef(false)

  const commonNumberInputStyles: InputProps = {
    type: "number",
    w: "70px",
    textAlign: "center",
    min: 0,
  }

  const {
    mutate: doSetMultisigDefaults,
    isLoading: isSaving,
    isSuccess,
    error,
  } = useMultisigSetDefaults(accountAddress ?? "")

  const [executeAutomatically, setExecuteAutomatically] = React.useState(0)

  const featureKey = AccountFeatureTypes[AccountFeatureTypes.accountMultisig]
  const multisigFeature = accountInfo?.features?.get(featureKey) as Map<
    string,
    unknown
  >

  const maxApprovers = Array.from(accountInfo?.roles ?? [])?.reduce(
    (acc, roleData) => {
      const [, roles] = roleData
      if (roles?.some(r => approverRoles.includes(r))) {
        acc += 1
      }
      return acc
    },
    0,
  )

  const thresholdRef = React.useRef<HTMLSelectElement>(null)
  const hoursRef = React.useRef<HTMLInputElement>(null)
  const minutesRef = React.useRef<HTMLInputElement>(null)
  const secondsRef = React.useRef<HTMLInputElement>(null)

  function onSave(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault()
    const threshold = Number(thresholdRef.current!.value.trim())
    const hoursInSecs = Number(hoursRef.current!.value.trim()) * 3600
    const minutesInSecs = Number(minutesRef.current!.value.trim()) * 60
    const seconds = Number(secondsRef.current!.value.trim())
    const expireInSecs = hoursInSecs + minutesInSecs + seconds

    doSetMultisigDefaults({
      expireInSecs,
      threshold,
      executeAutomatically: Boolean(executeAutomatically),
    })
  }

  React.useEffect(
    function setInitialValues() {
      if (multisigFeature && !isInitialValuesSet.current) {
        isInitialValuesSet.current = true
        const currExecuteAutomatically = multisigFeature.get(
          AccountMultisigArgument[AccountMultisigArgument.executeAutomatically],
        )
        setExecuteAutomatically(currExecuteAutomatically ? 1 : 0)

        const currThreshold = multisigFeature.get(
          AccountMultisigArgument[AccountMultisigArgument.threshold],
        )
        thresholdRef.current!.value = String(currThreshold)
        const currentExpire = multisigFeature.get(
          AccountMultisigArgument[AccountMultisigArgument.expireInSecs],
        ) as number
        const { hours, minutes, seconds } =
          getHoursMinutesSecondsFromSeconds(currentExpire)
        hoursRef.current!.value = String(hours)
        minutesRef.current!.value = String(minutes)
        secondsRef.current!.value = String(seconds)
      }
    },
    [multisigFeature],
  )

  return (
    <form onSubmit={onSave}>
      <VStack alignItems="flex-start" spacing={6}>
        <FormControl isRequired>
          <FormLabel htmlFor="name">Required Approvers</FormLabel>
          <Select
            name="threshold"
            id="threshold"
            ref={thresholdRef}
            width={{ base: "full", md: "100px" }}
          >
            {new Array(maxApprovers).fill(1).map((num, idx) => {
              const val = num + idx
              return (
                <option key={val} value={String(val)}>
                  {val}
                </option>
              )
            })}
          </Select>
          <FormHelperText>
            The amount of approvers required to execute a transaction.
          </FormHelperText>
        </FormControl>
        <FormControl isRequired>
          <FormLabel htmlFor="name">Transaction Expiration</FormLabel>
          <HStack>
            <Flex>
              <Input
                {...commonNumberInputStyles}
                placeholder="H"
                ref={hoursRef}
              />
            </Flex>
            <Box>:</Box>
            <Box>
              <Input
                {...commonNumberInputStyles}
                placeholder="M"
                max={59}
                ref={minutesRef}
              />
            </Box>
            <Box>:</Box>
            <Box>
              <Input
                {...commonNumberInputStyles}
                max={59}
                placeholder="S"
                ref={secondsRef}
              />
            </Box>
          </HStack>
          <FormHelperText>
            The elapsed time after a transaction has been submitted before it is
            expired.
          </FormHelperText>
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Execute Automatically</FormLabel>
          <RadioGroup
            name="executeAutomatically"
            onChange={nextVal => {
              setExecuteAutomatically(Number(nextVal))
            }}
            value={executeAutomatically}
            colorScheme="brand.teal"
          >
            <HStack spacing={4}>
              <Radio value={0}>No</Radio>
              <Radio value={1}>Yes</Radio>
            </HStack>
          </RadioGroup>
          <FormHelperText>
            Execute transactions automatically when threshold has been reached.
          </FormHelperText>
        </FormControl>
        {error && (
          <Alert status="warning" variant="left-accent">
            <AlertIcon />
            <AlertDescription>
              {error?.message ?? "An unexpected error occurred."}
            </AlertDescription>
          </Alert>
        )}
        {isSuccess && (
          <Alert status="success" variant="left-accent">
            <AlertIcon />
            <AlertDescription>Settings saved</AlertDescription>
          </Alert>
        )}
        <Button
          type="submit"
          colorScheme="brand.teal"
          isLoading={isSaving}
          loadingText="Saving"
          w={{ base: "full", md: "auto" }}
        >
          Save
        </Button>
      </VStack>
    </form>
  )
}
