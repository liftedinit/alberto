import { Text, TextProps } from "components"
import { makeShortId } from "helper/common"

export function IdentityText({
  fullIdentity,
  children,
  ...props
}: TextProps & {
  fullIdentity: string
}) {
  return (
    <Text
      {...props}
      onCopy={e => {
        e.clipboardData.setData("text/plain", fullIdentity)
        e.preventDefault()
      }}
    >
      {children ? children : makeShortId(fullIdentity)}
    </Text>
  )
}
