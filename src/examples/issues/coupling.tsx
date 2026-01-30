import { useState, type Dispatch, type SetStateAction } from "react"
import type React from "react"

type CounterProps = {
  count: number
  setCount: Dispatch<SetStateAction<number>>
}

const Counter: React.FC<CounterProps> = ({ count, setCount }) => (
  <div>
    <div>Count: {count}</div>
    <button onClick={() => setCount((prev) => prev + 1)}>Increment</button>
  </div>
)

const CounterContainer: React.FC<CounterProps> = (props) => (
  <Counter {...props} />
)

export const Coupling: React.FC = () => {
  const [count, setCount] = useState<number>(0)

  return <CounterContainer count={count} setCount={setCount} />
}
