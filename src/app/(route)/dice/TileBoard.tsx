"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
//import { Button } from "@/components/ui/button";

type Tile = {
  tileIndex: number;
  tileName: string;
  tileOption: string;
  tileImageUrl?: string; // 이미지 URL 추가
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
  //step,
  //onMove,
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

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <div
        className="/*w-full*/ grid"
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${tileSize}, minmax(4rem, 1fr))`,
          gridTemplateRows: `repeat(${tileSize}, minmax(4rem, 1fr))`,
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
                className={`w-full h-full aspect-square relative overflow-hidden`}
                style={{
                  //backgroundImage: tileInfo?.tileImageUrl ? `url(${tileInfo.tileImageUrl})` : undefined,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                }}
              >
                {isPawn && (
                  <div className="absolute inset-0 bg-blue-300/60 z-10" />
                )}
                <CardContent className="p-0 flex flex-col items-center justify-center w-full h-full text-center space-y-1 relative z-20 /*bg-white/60*/">
                  <div className="font-bold">{tileInfo?.tileName ?? `타일 ${tileIndex + 1}`}</div>
                  {tileInfo?.tileOption && (
                    <div className="text-[10px] text-muted-foreground">
                      {tileInfo.tileOption}
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div key={`${row}-${col}`} className="aspect-square w-full h-full" />
            );
          })
        )}
      </div>
    </div>
  );
}
