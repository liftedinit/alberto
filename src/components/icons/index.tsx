import { Icon as BaseIcon, IconProps } from "components"
import { BiDownload } from "react-icons/bi"
import {
  IoWallet,
  IoWalletOutline,
  IoSettingsSharp,
  IoSearch,
  IoSettingsOutline,
} from "react-icons/io5"
import {
  FaAddressBook,
  FaRegAddressBook,
  FaUserCircle,
  FaRegPaperPlane,
  FaPaperPlane,
} from "react-icons/fa"
import { FiChevronDown, FiEdit, FiX } from "react-icons/fi"

export function ReceiveIcon(props: IconProps) {
  return <BaseIcon as={BiDownload} w={6} h={6} {...props} />
}

export function SendIcon(props: IconProps) {
  return <BaseIcon as={FaPaperPlane} w={6} h={6} {...props} />
}

export function SendOutlineIcon(props: IconProps) {
  return <BaseIcon as={FaRegPaperPlane} w={6} h={6} {...props} />
}

export function SettingsIcon(props: IconProps) {
  return <BaseIcon as={IoSettingsSharp} w={6} h={6} {...props} />
}

export function SettingsOutlineIcon(props: IconProps) {
  return <BaseIcon as={IoSettingsOutline} w={6} h={6} {...props} />
}

export function WalletIcon(props: IconProps) {
  return <BaseIcon as={IoWallet} w={6} h={6} {...props} />
}

export function WalletOutlineIcon(props: IconProps) {
  return <BaseIcon as={IoWalletOutline} w={6} h={6} {...props} />
}

export function AddressBookIcon(props: IconProps) {
  return <BaseIcon as={FaAddressBook} w={6} h={6} {...props} />
}
export function AddressBookOutlineIcon(props: IconProps) {
  return <BaseIcon as={FaRegAddressBook} w={6} h={6} {...props} />
}

export function UserIcon(props: IconProps) {
  return <BaseIcon as={FaUserCircle} w={6} h={6} {...props} />
}

export function EditIcon(props: IconProps) {
  return <BaseIcon as={FiEdit} w={6} h={6} {...props} />
}

export function ChevronDownIcon(props: IconProps) {
  return <BaseIcon as={FiChevronDown} w={6} h={6} {...props} />
}

export function CloseIcon(props: IconProps) {
  return <BaseIcon as={FiX} w={6} h={6} {...props} />
}

export function SearchIcon(props: IconProps) {
  return <BaseIcon as={IoSearch} w={6} h={6} {...props} />
}