import type React from "react"

type DeepestProps = {
  deepestValue: number
}

type DeepProps = DeepestProps & {
  deepValue: number
}

type CurrentProps = DeepProps & {
  current: number
}

const Deepest: React.FC<DeepestProps> = ({ deepestValue }) => (
  <div>Deepest value: {deepestValue}</div>
)

const Deep: React.FC<DeepProps> = ({ deepValue, deepestValue }) => (
  <div>
    Deep value: {deepValue}
    <Deepest deepestValue={deepestValue} />
  </div>
)

const Current: React.FC<CurrentProps> = ({ current, ...rest }) => (
  <div>
    Current value: {current}
    <Deep {...rest} />
  </div>
)

export const PropsDrilling: React.FC = () => (
  <div>
    <Current current={1} deepValue={2} deepestValue={3} />
  </div>
)
