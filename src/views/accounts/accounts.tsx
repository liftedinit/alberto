import { Outlet, useParams } from "react-router-dom"
import {
  Box,
  Breadcrumb,
  Layout,
  PageContainer,
  PageContainerProvider,
  SlideFade,
} from "components"
import { useGetAccountInfo } from "features/accounts"

export function Accounts() {
  return (
    <PageContainerProvider>
      <Layout.Main>
        <SlideFade in={true}>
          <PageContainer>
            <Box my={4}>
              <AccountsHeader />
            </Box>
            <Box rounded="md" shadow="md" bgColor="white" p={4}>
              <Outlet />
            </Box>
          </PageContainer>
        </SlideFade>
      </Layout.Main>
    </PageContainerProvider>
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

      {data?.accountInfo?.name && (
        <Breadcrumb.BreadcrumbItem isCurrentPage={!!accountAddress}>
          <Breadcrumb.BreadcrumbLink to={`${accountAddress}`}>
            {data.accountInfo.name}
          </Breadcrumb.BreadcrumbLink>
        </Breadcrumb.BreadcrumbItem>
      )}
    </Breadcrumb>
  )
}
