import { Outlet, useParams } from "react-router-dom"
import {
  AddressText,
  Box,
  Breadcrumb,
  Container,
  Flex,
  SlideFade,
} from "@liftedinit/ui"
import { Layout } from "views"
import { useGetAccountInfo } from "features/accounts"

export function Accounts() {
  return (
    <Layout.Main>
      <SlideFade in={true}>
        <Container
          maxW={{
            base: "auto",
            md: "container.sm",
            lg: "container.md",
            xl: "container.lg",
          }}
        >
          <Box my={4}>
            <AccountsHeader />
          </Box>
          <Box rounded="md" shadow="md" bgColor="white" p={4}>
            <Outlet />
          </Box>
        </Container>
      </SlideFade>
    </Layout.Main>
  )
}

function AccountsHeader() {
  const { accountAddress } = useParams()
  const { data } = useGetAccountInfo(accountAddress)

  return (
    <Breadcrumb>
      <Breadcrumb.BreadcrumbItem>
        <Breadcrumb.BreadcrumbLink
          to="/accounts"
          isCurrentPage={!accountAddress}
        >
          Accounts
        </Breadcrumb.BreadcrumbLink>
      </Breadcrumb.BreadcrumbItem>

      {data?.accountInfo?.description && (
        <Breadcrumb.BreadcrumbItem isCurrentPage={!!accountAddress}>
          <Breadcrumb.BreadcrumbLink to={`${accountAddress}`}>
            <Flex>
              {data.accountInfo.description}
              {accountAddress && (
                <>
                  &nbsp; (
                  <AddressText
                    addressText={accountAddress}
                    p={0}
                    iconProps={{ boxSize: 4 }}
                    bgColor={undefined}
                    textProps={{
                      "aria-label": "account address",
                    }}
                  />
                  )
                </>
              )}
            </Flex>
          </Breadcrumb.BreadcrumbLink>
        </Breadcrumb.BreadcrumbItem>
      )}
    </Breadcrumb>
  )
}
