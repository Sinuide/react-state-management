import type React from "react"
import { useState } from "react"

type CountProps = {
  count: number
}

const CompA: React.FC<CountProps> = ({ count }) => <div>Comp A: {count}</div>

const CompB: React.FC<CountProps> = ({ count }) => <div>Comp B: {count}</div>

export const SharedState: React.FC = () => {
  const [count, setCount] = useState<number>(0)

  return (
    <div>
      <CompA count={count} />
      <CompB count={count} />
      <button onClick={() => setCount((prev) => prev + 1)}>Increment</button>
    </div>
  )
}
