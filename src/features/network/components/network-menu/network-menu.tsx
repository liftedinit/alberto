import React from "react"
import { FiChevronDown } from "react-icons/fi"
import { useNetworkStore } from "../../store"
import {
  Box,
  Button,
  Circle,
  FormControl,
  FormLabel,
  FormHelperText,
  HStack,
  Input,
  Modal,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Stack,
  Text,
  useToast,
  UseToastOptions,
  useDisclosure,
} from "components"
import { NetworkId, NetworkParams } from "../../types"

type EditNetwork = [NetworkId, NetworkParams]

export function NetworkMenu() {
  const [editingNetwork, setEditingNetwork] = React.useState<
    EditNetwork | undefined
  >(undefined)
  const { isOpen, onClose, onOpen } = useDisclosure()
  function onEditNetwork(network: EditNetwork) {
    setEditingNetwork(network)
    onOpen()
  }
  const { activeNetwork, networks, activeId, setActiveId } = useNetworkStore(
    s => ({
      networks: Array.from(s.byId).sort((a, b) => {
        const [, { name: nameA }] = a
        const [, { name: nameB }] = b
        const nameALower = nameA.toLowerCase()
        const nameBLower = nameB.toLowerCase()
        return nameALower === nameBLower ? 0 : nameALower < nameBLower ? -1 : 1
      }),
      activeId: s.activeId,
      activeNetwork: s.byId.get(s.activeId),
      setActiveId: s.setActiveId,
    }),
  )

  return (
    <Box>
      <Menu>
        <MenuButton
          as={Button}
          rightIcon={<FiChevronDown />}
          size="sm"
          minWidth="100px"
          data-testid="active-network-menu-trigger"
        >
          <HStack justifyContent="center">
            {activeNetwork && <Circle bg="green.400" size="10px" />}
            <Text fontSize="sm" casing="uppercase" fontWeight="medium">
              {`${activeNetwork?.name ?? "no network selected"}`}
            </Text>
          </HStack>
        </MenuButton>
        <MenuList>
          <Box overflow="auto" maxHeight="40vh">
            {activeNetwork ? (
              <NetworkMenuItem
                activeId={activeId}
                id={activeId}
                network={activeNetwork!}
                onEditNetwork={onEditNetwork}
              />
            ) : null}
            {networks.map(([id, network]) =>
              id === activeId ? null : (
                <NetworkMenuItem
                  key={id}
                  activeId={activeId}
                  id={id}
                  network={network}
                  setActiveId={setActiveId}
                  onEditNetwork={onEditNetwork}
                />
              ),
            )}
          </Box>
          <MenuDivider mt={0} />
          <MenuItem as={Box} _hover={{ backgroundColor: "transparent" }}>
            <Button
              isFullWidth
              onClick={() => {
                setEditingNetwork(undefined)
                onOpen()
              }}
            >
              Add Network
            </Button>
          </MenuItem>
        </MenuList>
        <NetworkDetailsModal
          isOpen={isOpen}
          onClose={onClose}
          network={editingNetwork}
        />
      </Menu>
    </Box>
  )
}

function NetworkMenuItem({
  activeId,
  id,
  network,
  setActiveId,
  onEditNetwork,
}: {
  activeId: NetworkId
  id: NetworkId
  network: NetworkParams
  setActiveId?: (id: NetworkId) => void
  onEditNetwork: (network: EditNetwork) => void
}) {
  const [showEdit, setShowEdit] = React.useState(false)
  return (
    <MenuItem
      as={Box}
      justifyContent="space-between"
      onMouseEnter={() => !showEdit && setShowEdit(true)}
      onMouseLeave={() => showEdit && setShowEdit(false)}
    >
      {activeId === id ? (
        <HStack>
          <Circle bg="green.400" size="10px" />
          <Text casing="uppercase">{network.name}</Text>
        </HStack>
      ) : (
        <Button
          variant="link"
          onClick={() => setActiveId?.(id)}
          title="Set network active"
        >
          <Text casing="uppercase">{network?.name}</Text>
        </Button>
      )}
      <Button
        visibility={showEdit ? "visible" : "hidden"}
        variant="link"
        onClick={() => onEditNetwork([id, network])}
      >
        Edit
      </Button>
    </MenuItem>
  )
}

const commonToastOptions: UseToastOptions = {
  duration: 5000,
  variant: "subtle",
  isClosable: true,
  position: "top",
}

function NetworkDetailsModal({
  isOpen,
  onClose,
  network,
}: {
  isOpen: boolean
  onClose: () => void
  network?: [NetworkId, NetworkParams]
}) {
  const IS_UPDATE = !!network
  const [formValues, setFormValues] = React.useState({
    name: "",
    url: "",
  })
  const [deleteUrl, setDeleteUrl] = React.useState("")
  const toast = useToast()
  const { createNetwork, updateNetwork, deleteNetwork, byId } = useNetworkStore(
    ({ createNetwork, updateNetwork, deleteNetwork, byId }) => ({
      createNetwork,
      updateNetwork,
      deleteNetwork,
      byId,
    }),
  )
  function onChange(e: React.FormEvent<HTMLInputElement>) {
    const { name, value } = e.currentTarget
    setFormValues(s => ({
      ...s,
      [name]: value,
    }))
  }
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const name = formValues.name.trim()
    const url = formValues.url.trim()
    if (IS_UPDATE) {
      updateNetwork(network[0], { name, url })
      toast({
        title: "Update Network",
        description: "Network was updated.",
        status: "success",
        ...commonToastOptions,
      })
      onClose()
      return
    }

    const exists = Array.from(byId).some(
      ([, networkParams]) => networkParams.url === url,
    )
    if (exists) {
      toast({
        title: "Add Network",
        description: "Network already exists.",
        status: "warning",
        ...commonToastOptions,
      })
      return
    }

    createNetwork({ name, url })
    toast({
      title: "Add Network",
      description: "New network added. This network is now active.",
      status: "success",
      ...commonToastOptions,
    })
    onClose()
  }

  function onDelete(id: NetworkId) {
    if (!byId.has(id)) return
    deleteNetwork(id)
    toast({
      title: "Remove Network",
      description: "Network was removed.",
      status: "success",
      ...commonToastOptions,
    })
    onClose()
  }

  React.useEffect(() => {
    if (network) {
      setFormValues(network[1])
    }
  }, [network])

  React.useEffect(() => {
    if (!isOpen) {
      setDeleteUrl("")
      setFormValues({ name: "", url: "" })
    }
  }, [isOpen])

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      header={`${network ? "Update" : "Create A"} Network`}
      data-testid="network-create-update-contents"
      footer={
        <HStack justifyContent="flex-end">
          <Button form="network-create-update-form" type="submit">
            Save
          </Button>
        </HStack>
      }
    >
      <>
        <form
          onSubmit={handleSubmit}
          data-testid="create-update-network-form"
          id="network-create-update-form"
        >
          <Stack spacing={3} alignItems="stretch">
            <FormControl isRequired>
              <FormLabel htmlFor="name">Name</FormLabel>
              <Input
                autoFocus
                name="name"
                id="name"
                variant="filled"
                onChange={onChange}
                value={formValues.name}
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel htmlFor="url">URL</FormLabel>
              <Input
                name="url"
                onChange={onChange}
                id="url"
                variant="filled"
                value={formValues.url}
              />
            </FormControl>
          </Stack>
        </form>
        {IS_UPDATE && (
          <form id="remove-network-form">
            <FormControl mt={3}>
              <FormLabel color="red" htmlFor="deleteUrl">
                Remove Network
              </FormLabel>
              <HStack spacing={0}>
                <Input
                  name="deleteUrl"
                  required
                  id="deleteUrl"
                  variant="filled"
                  onChange={e => setDeleteUrl(e.currentTarget.value)}
                  value={deleteUrl}
                  borderTopRightRadius={0}
                  borderBottomRightRadius={0}
                />
                <Button
                  borderTopLeftRadius={0}
                  borderBottomLeftRadius={0}
                  colorScheme="red"
                  disabled={deleteUrl !== formValues.url}
                  onClick={() => onDelete(network[0])}
                  data-testid="remove-network-btn"
                >
                  Remove
                </Button>
              </HStack>
              <FormHelperText color="red">
                Enter the URL and click remove to remove this network.
              </FormHelperText>
            </FormControl>
          </form>
        )}
      </>
    </Modal>
  )
}
