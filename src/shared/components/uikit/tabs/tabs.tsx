import { Tab as BaseTab, TabProps } from "@chakra-ui/react"

export function Tab(props: TabProps) {
  return (
    <BaseTab
      textTransform="capitalize"
      fontSize={{ base: "sm", md: "md" }}
      {...props}
    >
      {props.children}
    </BaseTab>
  )
}
