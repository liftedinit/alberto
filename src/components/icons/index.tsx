import { Icon as BaseIcon, IconProps } from "components"
import { BiDownload, BiMinusCircle, BiPlusCircle } from "react-icons/bi"
import { BsLightningFill, BsPersonDash, BsPersonPlus } from "react-icons/bs"
import { CgUsb } from "react-icons/cg"
import {
  FaAddressBook,
  FaAddressCard,
  FaCheck,
  FaCheckCircle,
  FaGithub,
  FaLink,
  FaMinus,
  FaRegAddressBook,
  FaRegAddressCard,
  FaRegPlayCircle,
  FaTimes,
  FaTimesCircle,
  FaTwitter,
  FaUserCircle,
} from "react-icons/fa"
import {
  FiChevronDown,
  FiChevronLeft,
  FiChevronRight,
  FiChevronUp,
  FiEdit,
  FiPlus,
} from "react-icons/fi"
import { FcGoogle } from "react-icons/fc"
import { HiOutlineRefresh } from "react-icons/hi"
import { IoMdUndo } from "react-icons/io"
import {
  IoPaperPlane,
  IoPaperPlaneOutline,
  IoSearch,
  IoSettingsOutline,
  IoSettingsSharp,
  IoTimeOutline,
  IoWallet,
  IoWalletOutline,
} from "react-icons/io5"
import { MdContentCopy } from "react-icons/md"

const Icon: typeof BaseIcon = (props: IconProps) => {
  return <BaseIcon boxSize={6} {...props} />
}

export function ReceiveIcon(props: IconProps) {
  return <Icon as={BiDownload} {...props} />
}

export function SendIcon(props: IconProps) {
  return <Icon as={IoPaperPlane} {...props} />
}

export function SendOutlineIcon(props: IconProps) {
  return <Icon as={IoPaperPlaneOutline} {...props} />
}

export function SettingsIcon(props: IconProps) {
  return <Icon as={IoSettingsSharp} {...props} />
}

export function SettingsOutlineIcon(props: IconProps) {
  return <Icon as={IoSettingsOutline} {...props} />
}

export function WalletIcon(props: IconProps) {
  return <Icon as={IoWallet} {...props} />
}

export function WalletOutlineIcon(props: IconProps) {
  return <Icon as={IoWalletOutline} {...props} />
}

export function AddressBookIcon(props: IconProps) {
  return <Icon as={FaAddressBook} {...props} />
}
export function AddressBookOutlineIcon(props: IconProps) {
  return <Icon as={FaRegAddressBook} {...props} />
}

export function UserIcon(props: IconProps) {
  return <Icon as={FaUserCircle} {...props} />
}

export function EditIcon(props: IconProps) {
  return <Icon as={FiEdit} {...props} />
}

export function ChevronDownIcon(props: IconProps) {
  return <Icon as={FiChevronDown} {...props} />
}

export function ChevronUpIcon(props: IconProps) {
  return <Icon as={FiChevronUp} {...props} />
}

export function ChevronLeftIcon(props: IconProps) {
  return <Icon as={FiChevronLeft} {...props} />
}

export function ChevronRightIcon(props: IconProps) {
  return <Icon as={FiChevronRight} {...props} />
}

export function CloseIcon(props: IconProps) {
  return <Icon as={FaTimes} {...props} />
}

export function TimesCircleIcon(props: IconProps) {
  return <Icon as={FaTimesCircle} {...props} />
}

export function SearchIcon(props: IconProps) {
  return <Icon as={IoSearch} {...props} />
}

export function UsbIcon(props: IconProps) {
  return <Icon as={CgUsb} {...props} />
}

export function CopyIcon(props: IconProps) {
  return <Icon as={MdContentCopy} {...props} />
}

export function RefreshIcon(props: IconProps) {
  return <Icon as={HiOutlineRefresh} {...props} />
}

export function AccountsIcon(props: IconProps) {
  return <Icon as={FaAddressCard} {...props} />
}

export function AccountsOutlineIcon(props: IconProps) {
  return <Icon as={FaRegAddressCard} {...props} />
}

export function PlusIcon(props: IconProps) {
  return <Icon as={FiPlus} {...props} />
}

export function MinusIcon(props: IconProps) {
  return <Icon as={FaMinus} {...props} />
}

export function PendingIcon(props: IconProps) {
  return <Icon as={IoTimeOutline} {...props} />
}

export function CheckCircleIcon(props: IconProps) {
  return <Icon as={FaCheckCircle} {...props} />
}

export function CheckIcon(props: IconProps) {
  return <Icon as={FaCheck} {...props} />
}

export function UndoIcon(props: IconProps) {
  return <Icon as={IoMdUndo} {...props} />
}

export function ExecuteIcon(props: IconProps) {
  return <Icon as={FaRegPlayCircle} {...props} />
}

export function MinusCircleIcon(props: IconProps) {
  return <Icon as={BiMinusCircle} {...props} />
}

export function PlusCircleIcon(props: IconProps) {
  return <Icon as={BiPlusCircle} {...props} />
}

export function UserMinusIcon(props: IconProps) {
  return <Icon as={BsPersonDash} {...props} />
}

export function UserPlusIcon(props: IconProps) {
  return <Icon as={BsPersonPlus} {...props} />
}

export function LinkIcon(props: IconProps) {
  return <Icon as={FaLink} {...props} />
}

export function LightningIcon(props: IconProps) {
  return <Icon as={BsLightningFill} {...props} />
}

export function GoogleIcon(props: IconProps) {
  return <Icon as={FcGoogle} {...props} />
}

export function GithubIcon(props: IconProps) {
  return <Icon as={FaGithub} {...props} />
}

export function TwitterIcon(props: IconProps) {
  return <Icon as={FaTwitter} color="#1d9bf0" {...props} />
}
