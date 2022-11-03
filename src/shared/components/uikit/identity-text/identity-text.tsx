import { Text, TextProps } from "shared/components"
import { makeShortId } from "shared/helpers"

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
