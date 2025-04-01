import React from "react"
import { Box } from "@liftedinit/ui"
import termsContent from "../../assets/terms-and-conditions_migration.md"

export const TokenMigrationTermsAndConditions: React.FC = () => {
  return (
    <Box maxH="500px" overflowY="auto" p={4}>
      <div dangerouslySetInnerHTML={{ __html: termsContent }} />
    </Box>
  )
}
