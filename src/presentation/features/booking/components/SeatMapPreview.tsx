import { memo } from 'react';
import Svg, { Path, Rect } from 'react-native-svg';

import { colors } from '@core/theme';
import type { SeatRow } from '@domain/entities/Booking';
import { GRID_COLUMNS } from '../utils/seatLayout';

interface Props {
  layout: SeatRow[];
  width: number;
  height: number;
}

/**
 * Non-interactive thumbnail of the auditorium. Drawn as a single SVG instead
 * of ~250 Views so the horizontal showtime list stays cheap to render.
 */
export const SeatMapPreview = memo(({ layout, width, height }: Props) => {
  const arcHeight = height * 0.12;
  const cell = Math.min(
    width / (GRID_COLUMNS + 2),
    (height - arcHeight) / (layout.length + 1),
  );
  const seat = cell * 0.7;
  const gridWidth = cell * GRID_COLUMNS;
  const offsetX = (width - gridWidth) / 2;
  const offsetY = arcHeight + cell * 0.6;

  return (
    <Svg width={width} height={height}>
      <Path
        d={`M ${offsetX} ${arcHeight} Q ${width / 2} 0 ${
          offsetX + gridWidth
        } ${arcHeight}`}
        stroke={colors.primary}
        strokeWidth={1}
        fill="none"
      />
      {layout.map((row, r) =>
        row.cells.map((c, i) =>
          c.type === 'seat' ? (
            <Rect
              key={c.id}
              x={offsetX + i * cell}
              y={offsetY + r * cell}
              width={seat}
              height={seat}
              rx={seat * 0.25}
              fill={
                !c.available
                  ? colors.seatUnavailable
                  : c.kind === 'vip'
                    ? colors.seatVip
                    : colors.seatRegular
              }
            />
          ) : null,
        ),
      )}
    </Svg>
  );
});

SeatMapPreview.displayName = 'SeatMapPreview';
