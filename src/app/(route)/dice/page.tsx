'use client'

import { useRef, useState, useCallback } from 'react'
import { DiceRoller } from './DiceRoller'
import TileBoard from './TileBoard'

export default function Home() {
  const rollerRef = useRef<{ rollAll: () => Promise<void> }>(null)

  const [step, setStep] = useState(0)
  const [currentIndex, setCurrentIndex] = useState(0)
  const tileCount = 12

  const handleRoll = useCallback(async () => {
    if (rollerRef.current) {
      await rollerRef.current.rollAll()
    }
  }, [])

  const handleRollEnd = useCallback((totals: { rdp: number; bdp: number; gdp: number }) => {
    const { rdp, bdp, gdp } = totals
    const dp = rdp + bdp + gdp

    console.log(`굴리기 완료! RDP: ${rdp}, BDP: ${bdp}, GDP: ${gdp}, 총 DP: ${dp}`)

    setStep(dp)

    setCurrentIndex(prev => {
      const newIndex = (prev + dp) % tileCount
      return newIndex >= 0 ? newIndex : newIndex + tileCount
    })
  }, [tileCount])

  return (
    <div className="min-h-screen p-4 bg-gray-100">
      <div className="max-w-md mx-auto flex flex-col items-center space-y-6">
        <TileBoard
          mapData={{
            tileSize: 4,
            tileData: Array.from({ length: tileCount }).map((_, i) => ({
              tileIndex: i,
              tileName: `타일 ${i + 1}`,
              tileOption: `옵션 ${i + 1}`,
              tileImageUrl: '/tiles.png',
            })),
          }}
          currentIndex={currentIndex}
          step={step}
        />
        <button
          onClick={handleRoll}
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          type="button"
        >
          Roll
        </button>
        <DiceRoller
          ref={rollerRef}
          red={10}
          blue={10}
          green={10}
          onRollEnd={handleRollEnd}
        />
      </div>
    </div>
  )
}
