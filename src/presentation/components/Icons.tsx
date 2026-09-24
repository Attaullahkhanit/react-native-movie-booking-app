import React, { memo } from 'react';
import Svg, { Circle, Path, Rect } from 'react-native-svg';

import { colors } from '@core/theme';

interface IconProps {
  size?: number;
  color?: string;
}

export const SearchIcon = memo(
  ({ size = 20, color = colors.textPrimary }: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx={11} cy={11} r={7} stroke={color} strokeWidth={2} />
      <Path
        d="M20 20l-3.5-3.5"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
      />
    </Svg>
  ),
);

export const CloseIcon = memo(
  ({ size = 20, color = colors.textPrimary }: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M5 5l14 14M19 5L5 19"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
      />
    </Svg>
  ),
);

export const ChevronLeftIcon = memo(
  ({ size = 22, color = colors.textPrimary }: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M15 4l-8 8 8 8"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  ),
);

export const PlayIcon = memo(
  ({ size = 14, color = colors.textOnDark }: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="M6 4l14 8-14 8z" fill={color} />
    </Svg>
  ),
);

export const MoreDotsIcon = memo(
  ({ size = 24, color = colors.primary }: IconProps) => (
    <Svg width={size} height={size / 4} viewBox="0 0 24 6">
      <Circle cx={3} cy={3} r={2.2} fill={color} />
      <Circle cx={12} cy={3} r={2.2} fill={color} />
      <Circle cx={21} cy={3} r={2.2} fill={color} />
    </Svg>
  ),
);

export const PlusIcon = memo(
  ({ size = 16, color = colors.textPrimary }: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 5v14M5 12h14"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
      />
    </Svg>
  ),
);

export const MinusIcon = memo(
  ({ size = 16, color = colors.textPrimary }: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M5 12h14" stroke={color} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  ),
);

export const WifiOffIcon = memo(
  ({ size = 16, color = colors.textOnDark }: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M2 8.5a15 15 0 0120 0M5 12a10 10 0 0114 0M8.5 15.5a5 5 0 017 0"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
      />
      <Circle cx={12} cy={19} r={1.4} fill={color} />
      <Path
        d="M3 3l18 18"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
      />
    </Svg>
  ),
);

/** Seat glyph used by the seat map legend. */
export const SeatIcon = memo(
  ({ size = 18, color = colors.seatRegular }: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 18 16">
      <Rect x={1} y={0} width={16} height={11} rx={3} fill={color} />
      <Rect x={0} y={12.5} width={18} height={2.5} rx={1.2} fill={color} />
    </Svg>
  ),
);

// ---- Tab bar icons ----

export const DashboardIcon = memo(
  ({ size = 18, color = colors.tabInactive }: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 18 18">
      <Circle cx={4.5} cy={4.5} r={3.5} fill={color} />
      <Circle cx={13.5} cy={4.5} r={3.5} fill={color} />
      <Circle cx={4.5} cy={13.5} r={3.5} fill={color} />
      <Circle cx={13.5} cy={13.5} r={3.5} fill={color} />
    </Svg>
  ),
);

export const WatchIcon = memo(
  ({ size = 18, color = colors.tabInactive }: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 18 18">
      <Rect x={0} y={0} width={18} height={18} rx={4} fill={color} />
      <Path d="M7 5.5l5.5 3.5L7 12.5z" fill={colors.tabBar} />
    </Svg>
  ),
);

export const MediaLibraryIcon = memo(
  ({ size = 18, color = colors.tabInactive }: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 18 18">
      <Rect x={2.5} y={0} width={13} height={2} rx={1} fill={color} />
      <Rect x={0} y={3.5} width={18} height={14.5} rx={2.5} fill={color} />
    </Svg>
  ),
);

export const MoreListIcon = memo(
  ({ size = 18, color = colors.tabInactive }: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 18 18">
      {[2, 9, 16].map(y => (
        <React.Fragment key={y}>
          <Circle cx={1.6} cy={y} r={1.6} fill={color} />
          <Rect
            x={5}
            y={y - 1.2}
            width={13}
            height={2.4}
            rx={1.2}
            fill={color}
          />
        </React.Fragment>
      ))}
    </Svg>
  ),
);

SearchIcon.displayName = 'SearchIcon';
CloseIcon.displayName = 'CloseIcon';
ChevronLeftIcon.displayName = 'ChevronLeftIcon';
PlayIcon.displayName = 'PlayIcon';
MoreDotsIcon.displayName = 'MoreDotsIcon';
PlusIcon.displayName = 'PlusIcon';
MinusIcon.displayName = 'MinusIcon';
WifiOffIcon.displayName = 'WifiOffIcon';
SeatIcon.displayName = 'SeatIcon';
DashboardIcon.displayName = 'DashboardIcon';
WatchIcon.displayName = 'WatchIcon';
MediaLibraryIcon.displayName = 'MediaLibraryIcon';
MoreListIcon.displayName = 'MoreListIcon';
