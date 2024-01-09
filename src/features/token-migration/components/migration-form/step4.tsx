import React from "react"
import { Box, Text } from "@chakra-ui/react"
import { LogConsole } from "../log-console"

interface Step4Props {
  submissionStatus: string[]
}

export const Step4 = ({ submissionStatus }: Step4Props) => {
  return (
    <Box p={4}>
      <Text mb={2}>Migration Tracking</Text>
      <LogConsole logs={submissionStatus} />
    </Box>
  )
}
