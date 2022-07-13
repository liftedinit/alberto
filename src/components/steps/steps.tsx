import React from "react"
import { motion } from "framer-motion"
import { Box, Center, Collapse, CheckIcon } from "components"

type UseSteps = {
  initialStep: number
}

const MotionCenter = motion(Center)

export function Steps({ children }: React.PropsWithChildren<{}>) {
  const { activeStep } = useStepsContext()
  const steps = React.Children.toArray(children)
  const stepCount = steps.length

  return (
    <>
      {React.Children.map(children, (child, i) => {
        const isCompletedStep =
          (React.isValidElement(child) && child.props.isCompletedStep) ??
          i < activeStep

        const isLastStep = i === stepCount - 1
        const isCurrentStep = i === activeStep

        const stepProps = {
          activeStep,
          index: i,
          isCompletedStep,
          isCurrentStep,
          isLastStep,
        }

        if (React.isValidElement(child)) {
          return React.cloneElement(child, stepProps)
        }
        return null
      })}
    </>
  )
}

const animationConfig = {
  transition: {
    duration: 0.25,
  },
  exit: { scale: 0.5, opacity: 0 },
  initial: { scale: 0.5, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
}
const centerProps = {
  rounded: "full",
  boxSize: 8,
}
export function Step({
  activeStep,
  isCompletedStep,
  index,
  label,
  children,
}: React.PropsWithChildren<{
  activeStep?: number
  isCompletedStep?: boolean
  index?: number
  label: string
}>) {
  const isActive = activeStep === index
  return (
    <>
      <Box
        display="flex"
        alignItems="center"
        flex="1"
        textAlign="left"
        gap={4}
        p={2}
      >
        {isCompletedStep ? (
          <MotionCenter
            {...centerProps}
            {...animationConfig}
            bgColor="gray.100"
          >
            <CheckIcon boxSize={5} color="green.500" />
          </MotionCenter>
        ) : (
          <Center
            bgColor={isActive ? "brand.teal.500" : "gray.100"}
            color={isActive ? "white" : "brand.black"}
            {...centerProps}
          >
            {(index || 0) + 1}
          </Center>
        )}
        {label}
      </Box>
      <Collapse in={activeStep === index}>
        <Box pb={4}>{children}</Box>
      </Collapse>
    </>
  )
}

type UseStepsReturnType = ReturnType<typeof useSteps>
export function useSteps({ initialStep }: UseSteps) {
  const [activeStep, setActiveStep] = React.useState(initialStep)

  const nextStep = () => {
    setActiveStep(prev => prev + 1)
  }

  const prevStep = () => {
    setActiveStep(prev => prev - 1)
  }

  const reset = () => {
    setActiveStep(initialStep)
  }

  const setStep = (step: number) => {
    setActiveStep(step)
  }

  return { nextStep, prevStep, reset, setStep, activeStep }
}

const StepsContext = React.createContext<UseStepsReturnType>({
  activeStep: 0,
  prevStep: () => {},
  reset: () => {},
  setStep: () => {},
  nextStep: () => {},
})

export function StepsProvider({
  value,
  children,
}: React.PropsWithChildren<{ value: UseStepsReturnType }>) {
  return <StepsContext.Provider value={value}>{children}</StepsContext.Provider>
}

export function useStepsContext() {
  return React.useContext(StepsContext)
}
