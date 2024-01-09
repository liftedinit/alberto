import { Box, Text } from "@liftedinit/ui"
import React from "react"

type ConsoleProps = {
  logs: string[]
}

export const LogConsole: React.FC<ConsoleProps> = ({ logs }) => {
  return (
    <Box
      bg="gray.800"
      color="white"
      p={4}
      overflowY="scroll"
      w={"95%"}
      maxHeight="300px"
    >
      {logs.map((log, index) => (
        <Text key={index} fontFamily="monospace">
          {log}
        </Text>
      ))}
    </Box>
  )
}
