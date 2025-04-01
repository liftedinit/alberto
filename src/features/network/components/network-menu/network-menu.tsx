import React from "react"
import { useNetworkStore } from "../../store"
import {
  Box,
  Button,
  Circle,
  ChevronDownIcon,
  EditIcon,
  Flex,
  FormControl,
  FormLabel,
  FormHelperText,
  HStack,
  Input,
  IconButton,
  Modal,
  Menu,
  MenuButton,
  MenuOptionGroup,
  MenuList,
  MenuItem,
  MenuDivider,
  Stack,
  Text,
  useToast,
  useDisclosure,
} from "@liftedinit/ui"
import { NetworkId, NetworkInfo } from "../../types"

type EditNetwork = [NetworkId, NetworkInfo]

export function NetworkMenu() {
  const [editingNetwork, setEditingNetwork] = React.useState<
    EditNetwork | undefined
  >(undefined)
  const { isOpen, onClose, onOpen } = useDisclosure()
  function onEditNetwork(network: EditNetwork) {
    setEditingNetwork(network)
    onOpen()
  }
  const networkStore = useNetworkStore()
  const activeNetworkId = networkStore.activeId
  const activeNetwork = networkStore.getActiveNetwork()
  const networks = networkStore.getNetworks()

  return (
    <Flex alignItems="center" justifyContent="flex-end" minW="100px">
      <Menu autoSelect={false}>
        <MenuButton
          as={Button}
          rightIcon={<ChevronDownIcon />}
          leftIcon={
            activeNetwork ? <Circle bg="green.400" size="10px" /> : null
          }
          size="md"
          minWidth="100px"
          aria-label="active network menu trigger"
          bgColor="white"
          shadow="md"
        >
          <Text casing="capitalize" isTruncated>
            {`${activeNetwork?.name ?? "no network selected"}`}
          </Text>
        </MenuButton>
        <MenuList maxW="100vw" zIndex={2}>
          <MenuOptionGroup title="Networks" />
          <Box overflow="auto" maxHeight="40vh">
            {activeNetwork ? (
              <NetworkMenuItem
                activeId={activeNetworkId}
                id={activeNetworkId}
                network={activeNetwork}
                onEditNetwork={onEditNetwork}
              />
            ) : null}
            {Array.from(networks).map(([id, network]) =>
              id === activeNetworkId ? null : (
                <NetworkMenuItem
                  key={id}
                  activeId={activeNetworkId}
                  id={id}
                  network={network}
                  setActiveId={networkStore.setActiveId}
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
    </Flex>
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
  network: NetworkInfo
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
          <Text
            fontSize={{ base: "lg", md: "md" }}
            casing="uppercase"
            cursor="poiner"
          >
            {network.name}
          </Text>
        </HStack>
      ) : (
        <Button
          variant="link"
          onClick={() => setActiveId?.(id)}
          title="Set network active"
        >
          <Text
            fontSize={{ base: "lg", md: "md" }}
            casing="uppercase"
            cursor="poiner"
          >
            {network?.name}
          </Text>
        </Button>
      )}
      <IconButton
        variant="ghost"
        color="brand.black"
        aria-label="edit network"
        icon={<EditIcon boxSize={5} />}
        onClick={() => onEditNetwork([id, network])}
      />
    </MenuItem>
  )
}

function NetworkDetailsModal({
  isOpen,
  onClose,
  network,
}: {
  isOpen: boolean
  onClose: () => void
  network?: [NetworkId, NetworkInfo]
}) {
  const IS_UPDATE = !!network
  const IS_MANIFEST = network?.[1].name === "Manifest Ledger"
  const [formValues, setFormValues] = React.useState({
    name: "",
    url: "",
  })
  const [deleteUrl, setDeleteUrl] = React.useState("")
  const toast = useToast()
  const networkStore = useNetworkStore()
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
      const [networkId, networkInfo] = network
      networkStore.updateNetwork(networkId, { ...networkInfo, name, url })
      toast({
        title: "Update Network",
        description: "Network was updated.",
        status: "success",
      })
      onClose()
      return
    }

    const exists = Array.from(networkStore.getNetworks()).some(
      ([, info]) => info.url === url,
    )
    if (exists) {
      toast({
        title: "Add Network",
        description: "Network already exists.",
        status: "warning",
      })
      return
    }

    networkStore.createNetwork({ name, url })
    toast({
      title: "Add Network",
      description: "New network added. This network is now active.",
      status: "success",
    })
    onClose()
  }

  function onDelete(id: NetworkId) {
    if (!networkStore.getNetworks().has(id)) return
    networkStore.deleteNetwork(id)
    toast({
      title: "Remove Network",
      description: "Network was removed.",
      status: "success",
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
      <Modal.Body>
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
                disabled={IS_MANIFEST}
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel htmlFor="url">URL</FormLabel>
              <Input
                name="url"
                onChange={onChange}
                id="url"
                variant="filled"
                autoCapitalize="off"
                value={formValues.url}
              />
            </FormControl>
          </Stack>
        </form>
        {IS_UPDATE && !IS_MANIFEST && (
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
                  name="remove"
                  borderTopLeftRadius={0}
                  borderBottomLeftRadius={0}
                  colorScheme="red"
                  disabled={deleteUrl !== formValues.url}
                  onClick={() => onDelete(network[0])}
                  data-testid="remove network button"
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
      </Modal.Body>
    </Modal>
  )
}
