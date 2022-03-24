import { Spinner as BaseSpinner, SpinnerProps } from "@chakra-ui/react";

export function Spinner(props: SpinnerProps) {
  return (
    <BaseSpinner
      thickness="4px"
      speed="0.65s"
      emptyColor="gray.200"
      color="blue.500"
      size="xl"
      {...props}
    />
  );
}
