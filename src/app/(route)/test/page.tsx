// components/TileBoard.tsx
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type Tile = {
  tileIndex: number;
  tileName: string;
  tileOption: string;
};

type MapData = {
  tileSize: number;
  tileData: Tile[];
};

interface TileBoardProps {
  mapData: MapData;
  currentIndex: number;
  step: number;
  onMove?: (newIndex: number) => void;
}

export default function TileBoard({
  mapData,
  currentIndex,
  step,
  onMove,
}: TileBoardProps) {
  const { tileSize, tileData } = mapData;
  const [position, setPosition] = useState(currentIndex);

  useEffect(() => {
    setPosition(currentIndex);
  }, [currentIndex]);

  const getEdgePath = () => {
    const path: [number, number][] = [];
    const size = tileSize;

    for (let col = 0; col < size; col++) path.push([0, col]);
    for (let row = 1; row < size - 1; row++) path.push([row, size - 1]);
    for (let col = size - 1; col >= 0; col--) path.push([size - 1, col]);
    for (let row = size - 2; row >= 1; row--) path.push([row, 0]);

    return path;
  };

  const path = getEdgePath();
  const currentPos = path[position];

  const move = () => {
    const newIndex = (position + step) % path.length;
    setPosition(newIndex);
    if (onMove) onMove(newIndex);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        className="gap-1 w-full max-w-5xl grid"
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${tileSize}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${tileSize}, minmax(0, 1fr))`,
        }}
      >
        {Array.from({ length: tileSize }).map((_, row) =>
          Array.from({ length: tileSize }).map((_, col) => {
            const tileIndex = path.findIndex(([r, c]) => r === row && c === col);
            const tileInfo = tileData.find((tile) => tile.tileIndex === tileIndex);
            const isEdge = tileIndex !== -1;
            const isPawn = currentPos[0] === row && currentPos[1] === col;

            return isEdge ? (
              <Card
                key={`${row}-${col}`}
                className={`aspect-square flex flex-col items-center justify-center p-2 text-xs ${
                  isPawn ? "bg-blue-200" : ""
                }`}
              >
                <CardContent className="p-0 flex flex-col items-center justify-center w-full h-full text-center space-y-1">
                  <div className="font-bold">{tileInfo?.tileName ?? `타일 ${tileIndex + 1}`}</div>
                  {tileInfo?.tileOption && <div className="text-[10px] text-muted-foreground">{tileInfo.tileOption}</div>}
                </CardContent>
              </Card>
            ) : (
              <div key={`${row}-${col}`} className="aspect-square" />
            );
          })
        )}
      </div>

      <Button onClick={move}>이동</Button>
    </div>
  );
}
