'use client'

import {
  useState,
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef,
} from 'react'

type DiceGroup = 'red' | 'blue' | 'green'

type DiceRollerProps = {
  red: number
  blue: number
  green: number
  onRollEnd?: (totals: { rdp: number; bdp: number; gdp: number }) => void
}

const dotPositions: Record<number, [number, number][]> = {
  0: [],
  1: [[1, 1]],
  2: [[0, 0], [2, 2]],
  3: [[0, 0], [1, 1], [2, 2]],
  4: [[0, 0], [0, 2], [2, 0], [2, 2]],
  5: [[0, 0], [0, 2], [1, 1], [2, 0], [2, 2]],
  6: [[0, 0], [1, 0], [2, 0], [0, 2], [1, 2], [2, 2]],
}

export const DiceRoller = forwardRef(function DiceRoller(
  { red, blue, green, onRollEnd }: DiceRollerProps,
  ref
) {
  const diceList: { group: DiceGroup }[] = [
    ...Array(red).fill({ group: 'red' }),
    ...Array(blue).fill({ group: 'blue' }),
    ...Array(green).fill({ group: 'green' }),
  ]

  const COUNT = diceList.length

  const [diceNumbers, setDiceNumbers] = useState<(number | null)[]>([])
  const [diceAngles, setDiceAngles] = useState<number[]>([])
  const [spinning, setSpinning] = useState<boolean[]>([])
  const [rdp, setRdp] = useState<number>(0)
  const [bdp, setBdp] = useState<number>(0)
  const [gdp, setGdp] = useState<number>(0)

  // 숫자 커졌다 작아지는 애니메이션 스케일 상태
  const [rdpScale, setRdpScale] = useState(1)
  const [bdpScale, setBdpScale] = useState(1)
  const [gdpScale, setGdpScale] = useState(1)

  // 애니메이션 타이머 관리용 ref
  const rdpTimerRef = useRef<NodeJS.Timeout | null>(null)
  const bdpTimerRef = useRef<NodeJS.Timeout | null>(null)
  const gdpTimerRef = useRef<NodeJS.Timeout | null>(null)

  const diceNumbersRef = useRef<(number | null)[]>([])
  const intervalRefs = useRef<number[]>([])
  const completedCountRef = useRef(0)

  useEffect(() => {
    const initial = Array(COUNT).fill(null)
    setDiceNumbers(initial)
    diceNumbersRef.current = [...initial]
    setDiceAngles(Array(COUNT).fill(0))
    setSpinning(Array(COUNT).fill(false))
    setRdp(0)
    setBdp(0)
    setGdp(0)
    completedCountRef.current = 0

    return () => {
      intervalRefs.current.forEach(clearInterval)
      intervalRefs.current = []
    }
  }, [red, blue, green, COUNT])

  // 숫자 변경 애니메이션: 스케일을 강제로 1로 리셋 후 2로 커지게 구현
  useEffect(() => {
    if (rdpTimerRef.current) clearTimeout(rdpTimerRef.current)
    setRdpScale(1) // 강제 리셋

    // 20ms 딜레이 후 2로 커짐
    rdpTimerRef.current = setTimeout(() => {
      setRdpScale(2)
      rdpTimerRef.current = setTimeout(() => {
        setRdpScale(1)
      }, 300)
    }, 20)

    return () => {
      if (rdpTimerRef.current) clearTimeout(rdpTimerRef.current)
    }
  }, [rdp])

  useEffect(() => {
    if (bdpTimerRef.current) clearTimeout(bdpTimerRef.current)
    setBdpScale(1)

    bdpTimerRef.current = setTimeout(() => {
      setBdpScale(2)
      bdpTimerRef.current = setTimeout(() => {
        setBdpScale(1)
      }, 300)
    }, 20)

    return () => {
      if (bdpTimerRef.current) clearTimeout(bdpTimerRef.current)
    }
  }, [bdp])

  useEffect(() => {
    if (gdpTimerRef.current) clearTimeout(gdpTimerRef.current)
    setGdpScale(1)

    gdpTimerRef.current = setTimeout(() => {
      setGdpScale(2)
      gdpTimerRef.current = setTimeout(() => {
        setGdpScale(1)
      }, 300)
    }, 20)

    return () => {
      if (gdpTimerRef.current) clearTimeout(gdpTimerRef.current)
    }
  }, [gdp])

  const rollDiceAt = (
    idx: number,
    group: DiceGroup,
    delay: number
  ): Promise<void> => {
    return new Promise(resolve => {
      setSpinning(prev => {
        const nxt = [...prev]
        nxt[idx] = true
        return nxt
      })

      const interval = window.setInterval(() => {
        setDiceAngles(prev => {
          const nxt = [...prev]
          nxt[idx] += (1800 * 20) / 1000
          return nxt
        })
      }, 20)
      intervalRefs.current.push(interval)

      window.setTimeout(() => {
        clearInterval(interval)

        const offset = Math.random() * 360
        setDiceAngles(prev => {
          const nxt = [...prev]
          nxt[idx] += offset
          return nxt
        })

        const newValue = Math.floor(Math.random() * 7) // 0~6
        const oldValue = diceNumbersRef.current[idx] ?? 0

        setDiceNumbers(prev => {
          const nxt = [...prev]
          nxt[idx] = newValue
          return nxt
        })
        diceNumbersRef.current[idx] = newValue

        if (group === 'red') setRdp(prev => prev + newValue - oldValue)
        else if (group === 'blue') setBdp(prev => prev + newValue - oldValue)
        else if (group === 'green') setGdp(prev => prev + newValue - oldValue)

        setSpinning(prev => {
          const nxt = [...prev]
          nxt[idx] = false
          return nxt
        })

        completedCountRef.current += 1
        resolve()
      }, delay)
    })
  }

  // 그룹별 주사위를 순차적으로, 하지만 총시간 안에 굴리도록 실행
  const rollGroupSequentially = async (indices: number[], group: DiceGroup) => {
    if (indices.length === 0) return
  
    const TOTAL_TIME = 1000
    const delayPerDice = TOTAL_TIME / indices.length
  
    await Promise.all(
      indices.map((idx, i) =>
        new Promise(resolve =>
          setTimeout(() => {
            rollDiceAt(idx, group, delayPerDice).then(resolve)
          }, delayPerDice * i)
        )
      )
    )
  }
  

  const rollAll = async () => {
    if (spinning.some(Boolean)) return

    setDiceNumbers(Array(COUNT).fill(null))
    diceNumbersRef.current = Array(COUNT).fill(null)
    setDiceAngles(Array(COUNT).fill(0))
    setSpinning(Array(COUNT).fill(false))
    setRdp(0)
    setBdp(0)
    setGdp(0)
    completedCountRef.current = 0
    intervalRefs.current.forEach(clearInterval)
    intervalRefs.current = []

    const groups: Record<DiceGroup, number[]> = { red: [], blue: [], green: [] }
    diceList.forEach((dice, idx) => {
      groups[dice.group].push(idx)
    })

    // 각 그룹별 주사위는 순차 실행, 전체 그룹은 병렬 실행
    await Promise.all([
      rollGroupSequentially(groups.red, 'red'),
      rollGroupSequentially(groups.blue, 'blue'),
      rollGroupSequentially(groups.green, 'green'),
    ])

    if (onRollEnd) {
      onRollEnd({
        rdp: groups.red.reduce(
          (sum, i) => sum + (diceNumbersRef.current[i] ?? 0),
          0
        ),
        bdp: groups.blue.reduce(
          (sum, i) => sum + (diceNumbersRef.current[i] ?? 0),
          0
        ),
        gdp: groups.green.reduce(
          (sum, i) => sum + (diceNumbersRef.current[i] ?? 0),
          0
        ),
      })
    }
  }

  useImperativeHandle(ref, () => ({
    rollAll,
  }))

  const renderDots = (num: number, group: DiceGroup) => {
    const positions = dotPositions[num] ?? []

    const colorMap: Record<DiceGroup, string> = {
      red: 'red',
      blue: 'blue',
      green: 'green',
    }

    return (
      <div className="grid grid-rows-3 grid-cols-3 w-full h-full gap-[0.0025rem]">
        {Array.from({ length: 3 }).map((_, r) =>
          Array.from({ length: 3 }).map((_, c) => (
            <div key={`${r}-${c}`} className="flex items-center justify-center">
              {positions.some(([rr, cc]) => rr === r && cc === c) && (
                <div
                  className="rounded-full"
                  style={{
                    width: '0.1875rem',
                    height: '0.1875rem',
                    backgroundColor: colorMap[group],
                  }}
                />
              )}
            </div>
          ))
        )}
      </div>
    )
  }

  return (
    <div className="flex flex-col items-start space-y-2">
      {(['red', 'blue', 'green'] as DiceGroup[]).map(group => {
        const groupDices = diceList
          .map((dice, idx) => ({ dice, idx }))
          .filter(({ dice }) => dice.group === group)

        return (
          <div
            key={group}
            className="flex flex-row items-center w-full flex-wrap"
            style={{ paddingLeft: '0.25rem', paddingRight: '0.25rem' }}
          >
            {groupDices.map(({ idx }) => {
              const num = diceNumbers[idx]
              return (
                <div
                  key={idx}
                  style={{
                    width: '1.525rem',
                    height: '1.525rem',
                    transform: `rotate(${diceAngles[idx]}deg)`,
                    transition: spinning[idx]
                      ? 'none'
                      : 'transform 0.5s ease-out',
                    marginLeft: '-0.45rem',
                  }}
                  className="bg-white rounded-sm shadow-sm p-[0.205rem] origin-center border border-gray-300"
                >
                  {num != null && renderDots(num, group)}
                </div>
              )
            })}
          </div>
        )
      })}

      <div className="mt-4 space-y-1 text-sm font-semibold text-gray-800">
        <div
          className="text-red-600"
          style={{
            transform: `scale(${rdpScale})`,
            transition: 'transform 0.2s ease',
            transformOrigin: 'center',
          }}
        >
          RDP: {rdp}
        </div>
        <div
          className="text-blue-600"
          style={{
            transform: `scale(${bdpScale})`,
            transition: 'transform 0.2s ease',
            transformOrigin: 'center',
          }}
        >
          BDP: {bdp}
        </div>
        <div
          className="text-green-600"
          style={{
            transform: `scale(${gdpScale})`,
            transition: 'transform 0.2s ease',
            transformOrigin: 'center',
          }}
        >
          GDP: {gdp}
        </div>
      </div>
    </div>
  )
})
