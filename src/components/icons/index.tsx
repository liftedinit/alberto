import { Icon as BaseIcon, IconProps } from "components"
import { BiPaperPlane, BiDownload } from "react-icons/bi"
import { IoSettingsOutline, IoWalletOutline } from "react-icons/io5"

export function ReceiveIcon(props: IconProps) {
  return <BaseIcon as={BiDownload} w={6} h={6} {...props} />
}

export function SendIcon(props: IconProps) {
  return <BaseIcon as={BiPaperPlane} w={6} h={6} {...props} />
}

export function SettingsIcon(props: IconProps) {
  return <BaseIcon as={IoSettingsOutline} w={6} h={6} {...props} />
}

export function WalletIcon(props: IconProps) {
  return <BaseIcon as={IoWalletOutline} w={6} h={6} {...props} />
}
