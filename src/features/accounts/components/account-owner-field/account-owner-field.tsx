import React from "react"
import { useController } from "react-hook-form"
import {
  Box,
  Flex,
  IconButton,
  Input,
  PlusIcon,
  Tag,
  TagLabel,
  TagCloseButton,
  Text,
  useBreakpointValue,
  VStack,
  FieldWrapper,
  MinusIcon,
  AddressBookIcon,
} from "components"
import { AccountRole } from "many-js"
import { ContactSelector, useGetContactName } from "features/contacts"
import { Role, RolesSelector } from "features/accounts"

export function AccountOwnerField({
  addressFieldName,
  rolesFieldName,
  onRemoveClick,
  isLedgerTransactEnabled,
  isMultisigEnabled,
  owners,
  roles,
}: {
  addressFieldName: string
  rolesFieldName: string
  onRemoveClick: () => void
  isLedgerTransactEnabled: boolean
  isMultisigEnabled: boolean
  owners: { address: string; roles: String[] }[]
  roles: Role[]
}) {
  const inputSize = useBreakpointValue({ base: "sm", md: "md" })
  const tagSize = useBreakpointValue({ base: "sm", md: "md" })
  const getContactName = useGetContactName()

  const {
    field: addressField,
    fieldState: { error },
  } = useController({
    name: addressFieldName,
    rules: {
      required: "Owner address is required",
      validate: {
        noDuplicates: val => {
          const count = owners.reduce(
            (acc: number, owner: { address: string }) => {
              return owner.address === val ? acc + 1 : acc
            },
            0,
          )
          return count >= 2 ? "Duplicate owners not allowed" : true
        },
      },
    },
  })
  const contactName = getContactName(addressField.value)

  const {
    field: { onChange: onRolesChange, value: rolesValue },
    fieldState: { error: rolesError },
  } = useController({
    name: rolesFieldName,
    rules: {
      required: "Roles is required",
    },
  })

  const rolesValueRef = React.useRef(rolesValue)
  rolesValueRef.current = rolesValue
  React.useEffect(() => {
    if (!isLedgerTransactEnabled || !isMultisigEnabled) {
      let result = rolesValueRef.current.slice().filter((r: string) => {
        if (
          !isLedgerTransactEnabled &&
          r === AccountRole[AccountRole.canLedgerTransact]
        ) {
          return false
        } else if (
          !isMultisigEnabled &&
          (r === AccountRole[AccountRole.canMultisigSubmit] ||
            r === AccountRole[AccountRole.canMultisigApprove])
        ) {
          return false
        }
        return true
      })
      onRolesChange(result)
    }
  }, [isLedgerTransactEnabled, isMultisigEnabled, onRolesChange])

  return (
    <Box bgColor="gray.100" p={3} rounded="md">
      <FieldWrapper
        error={error?.message}
        label="Owner"
        labelProps={{ fontSize: inputSize }}
      >
        <Flex gap={2} alignItems="center" rounded="sm" p={2} bgColor="white">
          <VStack spacing={0} w="full" alignItems="flex-start">
            {contactName ? (
              <Text
                as="span"
                fontSize={inputSize}
                fontWeight="semibold"
                casing="capitalize"
              >
                {contactName}
              </Text>
            ) : null}
            <Input
              placeholder="mahrdiqb7h7agbx..."
              variant="unstyled"
              bgColor="white !important"
              size={inputSize}
              {...addressField}
            />
          </VStack>
          <ContactSelector
            onContactClicked={(onClose, c) => {
              addressField.onChange(c.address)
              onClose()
            }}
          >
            {onOpen => {
              return (
                <IconButton
                  aria-label="select contact"
                  icon={<AddressBookIcon />}
                  size="xs"
                  variant="ghost"
                  colorScheme="brand.teal"
                  onClick={onOpen}
                />
              )
            }}
          </ContactSelector>
        </Flex>
      </FieldWrapper>
      <FieldWrapper
        error={rolesError?.message}
        label="Roles"
        mt={4}
        labelProps={{ fontSize: inputSize }}
      >
        <Flex
          gap={1}
          flexWrap="wrap"
          flexGrow={1}
          alignItems="center"
          p={2}
          bgColor="white"
          rounded="sm"
        >
          {rolesValue.map((roleName: string, idx: number, arr: string[]) => {
            return (
              <Tag
                key={roleName}
                size={tagSize}
                variant="solid"
                colorScheme="brand.teal"
              >
                <TagLabel fontSize={inputSize} fontWeight="medium">
                  {roleName}
                </TagLabel>
                <TagCloseButton
                  onClick={() => {
                    const filtered = rolesValue.filter(
                      (r: string) => r !== roleName,
                    )
                    onRolesChange(filtered)
                  }}
                />
              </Tag>
            )
          })}
          <RolesSelector
            rolesList={roles}
            selectedRoles={rolesValue}
            onRoleClicked={(_, roles) => {
              onRolesChange(roles)
            }}
          >
            {onOpen => {
              return (
                <IconButton
                  aria-label="select roles"
                  size="xs"
                  variant="ghost"
                  icon={<PlusIcon />}
                  colorScheme="brand.teal"
                  onClick={onOpen}
                />
              )
            }}
          </RolesSelector>
        </Flex>
      </FieldWrapper>
      <Flex justifyContent="flex-end" mt={2}>
        <IconButton
          size="xs"
          title="remove owner"
          aria-label="remove owner"
          colorScheme="red"
          onClick={onRemoveClick}
          icon={<MinusIcon boxSize={3} />}
        />
      </Flex>
    </Box>
  )
}
