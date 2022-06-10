import {
  Breadcrumb as BaseBreadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbLinkProps,
  BreadcrumbProps,
} from "@chakra-ui/react"
import { Link as RouterLink, LinkProps } from "react-router-dom"

export function Breadcrumb(props: BreadcrumbProps) {
  return <BaseBreadcrumb {...props} />
}

Breadcrumb.BreadcrumbItem = BreadcrumbItem
Breadcrumb.BreadcrumbLink = ({
  children,
  ...props
}: BreadcrumbLinkProps & LinkProps) => (
  <BreadcrumbLink as={RouterLink} {...props}>
    {children}
  </BreadcrumbLink>
)
