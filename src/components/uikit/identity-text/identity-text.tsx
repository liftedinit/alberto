import { Text, TextProps } from "components"
import { makeShortId } from "helper/common"

export function IdentityText({
  fullIdentity,
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
      {makeShortId(fullIdentity)}
    </Text>
  )
}
