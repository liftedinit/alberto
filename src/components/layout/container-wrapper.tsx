import React from "react";
import { Container, ContainerProps, useBreakpointValue } from "components";

export function ContainerWrapper({
  children,
  ...props
}: React.PropsWithChildren<ContainerProps>) {
  const isBase = useBreakpointValue({ base: true, md: false });
  const Comp = React.useMemo(() => {
    return isBase ? React.Fragment : Container;
  }, [isBase]);
  return <Comp {...(isBase ? {} : props)}>{children}</Comp>
}
