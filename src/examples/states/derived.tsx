import type React from "react"
import { useMemo, useState } from "react"

export const DerivedState: React.FC = () => {
  const [numbers, setNumbers] = useState<number[]>([1, 2, 3, 4])

  const sum = useMemo(() => {
    console.count("useMemo called")
    // Notice that React will always replay the useMemo
    // Even with same numbers using JSON.stringify or join()
    // useMemo is not a cache
    return numbers.reduce((total, value) => total + value, 0)
  }, [numbers])

  return (
    <div>
      <div>Total: {sum}</div>
      <div className="button-group">
        <button
          onClick={() =>
            setNumbers((prev) => {
              const newValue = (prev.at(-1) ?? 0) + 1
              const next = [...prev, newValue]
              return next
            })
          }
        >
          Add next value
        </button>
        <button
          onClick={() =>
            setNumbers((prev) => {
              const next = prev.slice(0, -1)
              return next
            })
          }
        >
          Remove last value
        </button>
      </div>
    </div>
  )
}
