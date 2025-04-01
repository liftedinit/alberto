import React from "react"
import { Box } from "@liftedinit/ui"
import termsContent from "../../assets/terms-and-conditions_migration.md"
import { marked } from "marked"

export const TokenMigrationTermsAndConditions: React.FC = () => {
  const htmlContent = marked(termsContent, { async: false })

  return (
    <Box maxH="500px" overflowY="auto" p={4}>
      <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
    </Box>
  )
}
