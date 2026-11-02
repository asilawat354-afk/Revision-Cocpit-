import { DashboardTile, TileSize } from "../types";

export interface TileDimensions {
  colSpan: number;
  rowSpan: number;
}

export function getTileSpan(size: TileSize): TileDimensions {
  switch (size) {
    case "small":
      return { colSpan: 1, rowSpan: 1 };
    case "medium":
      return { colSpan: 2, rowSpan: 1 };
    case "large":
      return { colSpan: 2, rowSpan: 2 };
    default:
      return { colSpan: 1, rowSpan: 1 };
  }
}

/**
 * Check if two tiles overlap in 2D grid space
 */
export function doTilesOverlap(
  a: { x: number; y: number; colSpan: number; rowSpan: number },
  b: { x: number; y: number; colSpan: number; rowSpan: number }
): boolean {
  return (
    a.x < b.x + b.colSpan &&
    a.x + a.colSpan > b.x &&
    a.y < b.y + b.rowSpan &&
    a.y + a.rowSpan > b.y
  );
}

/**
 * Check if a rectangular placement overlaps any existing tiles
 */
export function isSlotOccupied(
  tiles: DashboardTile[],
  target: { x: number; y: number; colSpan: number; rowSpan: number },
  excludeTileId?: string
): boolean {
  return tiles.some((t) => {
    if (excludeTileId && t.id === excludeTileId) return false;
    const span = getTileSpan(t.size);
    return doTilesOverlap(
      target,
      { x: t.x, y: t.y, colSpan: span.colSpan, rowSpan: span.rowSpan }
    );
  });
}

/**
 * Finds the nearest vacant slot starting from a desired location or top of canvas
 */
export function findNearestVacantSlot(
  tiles: DashboardTile[],
  colSpan: number,
  rowSpan: number,
  maxCols: number,
  preferredX = 0,
  preferredY = 0,
  excludeTileId?: string
): { x: number; y: number } {
  // First check if preferred spot is directly free
  if (
    preferredX >= 0 &&
    preferredX + colSpan <= maxCols &&
    preferredY >= 0 &&
    !isSlotOccupied(tiles, { x: preferredX, y: preferredY, colSpan, rowSpan }, excludeTileId)
  ) {
    return { x: preferredX, y: preferredY };
  }

  // Scan downward row by row
  for (let r = 0; r < 50; r++) {
    for (let c = 0; c <= maxCols - colSpan; c++) {
      if (!isSlotOccupied(tiles, { x: c, y: r, colSpan, rowSpan }, excludeTileId)) {
        return { x: c, y: r };
      }
    }
  }

  // Fallback to bottom of all tiles
  const maxRow = tiles.reduce((acc, t) => {
    const span = getTileSpan(t.size);
    return Math.max(acc, t.y + span.rowSpan);
  }, 0);

  return { x: 0, y: maxRow };
}

/**
 * Resolve placement when a tile is dragged and dropped onto (targetX, targetY).
 * Intelligently handles swapping or displacing colliding tiles without destructive overlap.
 */
export function resolveTilePlacement(
  tiles: DashboardTile[],
  activeTileId: string,
  targetX: number,
  targetY: number,
  maxCols: number
): DashboardTile[] {
  const activeTile = tiles.find((t) => t.id === activeTileId);
  if (!activeTile) return tiles;

  const activeSpan = getTileSpan(activeTile.size);
  const clampedX = Math.max(0, Math.min(maxCols - activeSpan.colSpan, targetX));
  const clampedY = Math.max(0, targetY);

  const targetBox = {
    x: clampedX,
    y: clampedY,
    colSpan: activeSpan.colSpan,
    rowSpan: activeSpan.rowSpan,
  };

  // Find all other tiles that collide with the drop box
  const collidingTiles = tiles.filter((t) => {
    if (t.id === activeTileId) return false;
    const tSpan = getTileSpan(t.size);
    return doTilesOverlap(targetBox, {
      x: t.x,
      y: t.y,
      colSpan: tSpan.colSpan,
      rowSpan: tSpan.rowSpan,
    });
  });

  // Case 1: No collision -> Pure free placement!
  if (collidingTiles.length === 0) {
    return tiles.map((t) =>
      t.id === activeTileId ? { ...t, x: clampedX, y: clampedY } : t
    );
  }

  // Case 2: Exactly 1 colliding tile of same size -> Clean direct swap!
  if (collidingTiles.length === 1 && collidingTiles[0].size === activeTile.size) {
    const other = collidingTiles[0];
    return tiles.map((t) => {
      if (t.id === activeTileId) {
        return { ...t, x: clampedX, y: clampedY };
      }
      if (t.id === other.id) {
        return { ...t, x: activeTile.x, y: activeTile.y };
      }
      return t;
    });
  }

  // Case 3: Multiple colliding tiles or different size -> Displace colliding tiles smoothly
  const result: DashboardTile[] = [];
  const placedActive: DashboardTile = { ...activeTile, x: clampedX, y: clampedY };
  result.push(placedActive);

  // Other non-colliding tiles remain in place
  const nonColliding = tiles.filter(
    (t) => t.id !== activeTileId && !collidingTiles.some((c) => c.id === t.id)
  );
  result.push(...nonColliding);

  // For each colliding tile, find the nearest vacant slot
  collidingTiles.forEach((collided) => {
    const cSpan = getTileSpan(collided.size);
    // Try original active tile position first if it fits
    let slot = findNearestVacantSlot(
      result,
      cSpan.colSpan,
      cSpan.rowSpan,
      maxCols,
      activeTile.x,
      activeTile.y
    );
    result.push({ ...collided, x: slot.x, y: slot.y });
  });

  return result;
}

/**
 * Automatically compacts tiles from top to bottom, left to right,
 * eliminating all holes/gaps between tiles.
 */
export function compactLayout(
  tiles: DashboardTile[],
  maxCols: number
): DashboardTile[] {
  if (tiles.length === 0) return [];

  const grid: boolean[][] = [];

  const isOccupied = (x: number, y: number): boolean => {
    if (!grid[y]) return false;
    return !!grid[y][x];
  };

  const markOccupied = (x: number, y: number, colSpan: number, rowSpan: number) => {
    for (let r = 0; r < rowSpan; r++) {
      const curY = y + r;
      if (!grid[curY]) {
        grid[curY] = [];
      }
      for (let c = 0; c < colSpan; c++) {
        grid[curY][x + c] = true;
      }
    }
  };

  const canFit = (x: number, y: number, colSpan: number, rowSpan: number): boolean => {
    if (x + colSpan > maxCols) return false;
    for (let r = 0; r < rowSpan; r++) {
      for (let c = 0; c < colSpan; c++) {
        if (isOccupied(x + c, y + r)) {
          return false;
        }
      }
    }
    return true;
  };

  return tiles.map((tile) => {
    const span = getTileSpan(tile.size);
    const colSpan = Math.min(span.colSpan, maxCols);
    const rowSpan = span.rowSpan;

    let placedX = 0;
    let placedY = 0;
    let found = false;

    for (let y = 0; y < 150; y++) {
      for (let x = 0; x <= maxCols - colSpan; x++) {
        if (canFit(x, y, colSpan, rowSpan)) {
          placedX = x;
          placedY = y;
          found = true;
          break;
        }
      }
      if (found) break;
    }

    markOccupied(placedX, placedY, colSpan, rowSpan);

    return {
      ...tile,
      x: placedX,
      y: placedY,
    };
  });
}

/**
 * Reorders a dragged tile to the target (targetX, targetY) slot
 * and packs the entire layout so NO empty gaps ever exist in between.
 */
export function reorderAndCompact(
  tiles: DashboardTile[],
  activeTileId: string,
  targetX: number,
  targetY: number,
  maxCols: number
): DashboardTile[] {
  const fromIndex = tiles.findIndex((t) => t.id === activeTileId);
  if (fromIndex === -1) return compactLayout(tiles, maxCols);

  const activeTile = tiles[fromIndex];
  const activeSpan = getTileSpan(activeTile.size);

  // Find which tile is currently occupying or closest to target (targetX, targetY)
  let targetIndex = -1;
  for (let i = 0; i < tiles.length; i++) {
    const t = tiles[i];
    if (t.id === activeTileId) continue;
    const tSpan = getTileSpan(t.size);
    if (
      targetX >= t.x &&
      targetX < t.x + tSpan.colSpan &&
      targetY >= t.y &&
      targetY < t.y + tSpan.rowSpan
    ) {
      targetIndex = i;
      break;
    }
  }

  // If not hovering directly on a tile, find position in sequential order
  if (targetIndex === -1) {
    const targetScore = targetY * maxCols + targetX;
    for (let i = 0; i < tiles.length; i++) {
      const t = tiles[i];
      if (t.id === activeTileId) continue;
      const tScore = t.y * maxCols + t.x;
      if (tScore >= targetScore) {
        targetIndex = i;
        break;
      }
    }
    if (targetIndex === -1) {
      targetIndex = tiles.length - 1;
    }
  }

  // Reorder array
  const reordered = [...tiles];
  const [moved] = reordered.splice(fromIndex, 1);
  reordered.splice(targetIndex, 0, moved);

  // Compact sequentially
  return compactLayout(reordered, maxCols);
}

/**
 * Normalizes tiles so they fit within the given maxCols
 * and are fully compacted without gaps.
 */
export function normalizeTilesForColumns(
  tiles: DashboardTile[],
  maxCols: number
): DashboardTile[] {
  // Sort tiles by current reading order before compacting
  const sorted = [...tiles].sort((a, b) => {
    if (a.y !== b.y) return a.y - b.y;
    return a.x - b.x;
  });
  return compactLayout(sorted, maxCols);
}
