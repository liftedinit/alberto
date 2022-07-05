import React from "react"
import { AccountFeatureTypes, AccountMultisigArgument } from "many-js"
import {
  Box,
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
} from "components"
import { approverRoles, useGetAccountInfo } from "features/accounts"
import {
  getHoursMinutesSecondsFromSeconds,
  getSecondsFromHoursMinutesSeconds,
} from "helper/convert"

export function MultisigSettingsFields({
  accountAddress,
  canEdit = true,
}: {
  accountAddress: string
  canEdit?: boolean
}) {
  const {
    thresholdRef,
    maxApprovers,
    expireInSecsRef,
    onExpireTimeChange,
    hoursRef,
    minutesRef,
    secondsRef,
    executeAutomaticallyProps,
  } = useMultisigSettingsFields(accountAddress)

  const commonNumberInputStyles: InputProps = {
    type: "number",
    w: "70px",
    textAlign: "center",
    min: 0,
    isReadOnly: !canEdit,
    onChange: onExpireTimeChange,
  }

  return (
    <>
      <FormControl isRequired>
        <FormLabel htmlFor="threshold">Required Approvers</FormLabel>
        <Select
          name="threshold"
          ref={thresholdRef}
          id="threshold"
          focusBorderColor="teal.300"
          width={{ base: "full", md: "100px" }}
          pointerEvents={canEdit ? undefined : "none"}
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
        <FormLabel>Transaction Expiration</FormLabel>
        <Input type="hidden" name="expireInSecs" ref={expireInSecsRef} />
        <HStack>
          <Flex>
            <Input
              {...commonNumberInputStyles}
              name="hours"
              placeholder="H"
              ref={hoursRef}
            />
          </Flex>
          <Box>:</Box>
          <Box>
            <Input
              {...commonNumberInputStyles}
              name="minutes"
              placeholder="M"
              max={59}
              ref={minutesRef}
            />
          </Box>
          <Box>:</Box>
          <Box>
            <Input
              {...commonNumberInputStyles}
              name="seconds"
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
          colorScheme="brand.teal"
          {...executeAutomaticallyProps}
        >
          <HStack spacing={4}>
            <Radio value={0} isReadOnly={!canEdit}>
              No
            </Radio>
            <Radio value={1} isReadOnly={!canEdit}>
              Yes
            </Radio>
          </HStack>
        </RadioGroup>
        <FormHelperText>
          Execute transactions automatically when threshold has been reached.
        </FormHelperText>
      </FormControl>
    </>
  )
}

export function useMultisigSettingsFields(accountAddress: string) {
  const isInitialValuesSet = React.useRef(false)

  const { data } = useGetAccountInfo(accountAddress)
  const accountInfo = data?.accountInfo

  const thresholdRef = React.useRef<HTMLSelectElement>(null)
  const hoursRef = React.useRef<HTMLInputElement>(null)
  const minutesRef = React.useRef<HTMLInputElement>(null)
  const secondsRef = React.useRef<HTMLInputElement>(null)
  const expireInSecsRef = React.useRef<HTMLInputElement>(null)
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

  function onExpireTimeChange() {
    const hours = Number(hoursRef.current!.value)
    const minutes = Number(minutesRef.current!.value)
    const seconds = Number(secondsRef.current!.value)
    const expireInSecs = getSecondsFromHoursMinutesSeconds(
      hours,
      minutes,
      seconds,
    )
    expireInSecsRef.current!.value = String(expireInSecs)
  }

  React.useEffect(
    function setInitialValues() {
      if (
        multisigFeature &&
        !isInitialValuesSet.current &&
        thresholdRef.current
      ) {
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
        expireInSecsRef.current!.value = String(currentExpire)
        const { hours, minutes, seconds } =
          getHoursMinutesSecondsFromSeconds(currentExpire)
        hoursRef.current!.value = String(hours)
        minutesRef.current!.value = String(minutes)
        secondsRef.current!.value = String(seconds)
      }
    },
    [multisigFeature],
  )

  return {
    thresholdRef,
    expireInSecsRef,
    onExpireTimeChange,
    hoursRef,
    minutesRef,
    secondsRef,
    maxApprovers,
    executeAutomaticallyProps: {
      value: executeAutomatically,
      onChange: (nextVal: string) => {
        setExecuteAutomatically(Number(nextVal))
      },
    },
  }
}
