import React from 'react';
import Svg, { Circle, Path } from 'react-native-svg';

interface IconProps {
  size?: number;
  color?: string;
  strokeWidth?: number;
}

export function PinIcon({ size = 18, color = '#fff', strokeWidth = 2, filledDot = true }: IconProps & { filledDot?: boolean }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 21s7-6.6 7-12a7 7 0 10-14 0c0 5.4 7 12 7 12z"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
      />
      {filledDot ? (
        <Circle cx="12" cy="9" r="2.4" fill={color} />
      ) : (
        <Circle cx="12" cy="9" r="2.6" stroke={color} strokeWidth={strokeWidth} />
      )}
    </Svg>
  );
}

export function SearchIcon({ size = 17, color = '#6B7A72', strokeWidth = 2 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="11" cy="11" r="7" stroke={color} strokeWidth={strokeWidth} />
      <Path d="M21 21l-4.3-4.3" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    </Svg>
  );
}

export function BellIcon({ size = 16, color = '#fff', strokeWidth = 1.7 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 3a5 5 0 00-5 5v3.4c0 .7-.3 1.4-.8 1.9L5 15h14l-1.2-1.7c-.5-.5-.8-1.2-.8-1.9V8a5 5 0 00-5-5z"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
      />
      <Path d="M10 18a2 2 0 004 0" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    </Svg>
  );
}

export function CartIcon({ size = 18, color = '#fff', strokeWidth = 1.8 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M6 6h15l-1.5 9h-12L6 6zm0 0L5 3H2" stroke={color} strokeWidth={strokeWidth} strokeLinejoin="round" />
      <Circle cx="9" cy="20" r="1.4" fill={color} />
      <Circle cx="17" cy="20" r="1.4" fill={color} />
    </Svg>
  );
}

export function UserIcon({ size = 21, color = '#B7C0BA', strokeWidth = 1.7 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 3a5 5 0 00-5 5v3.4c0 .7-.3 1.4-.8 1.9L5 15h14l-1.2-1.7c-.5-.5-.8-1.2-.8-1.9V8a5 5 0 00-5-5z"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
      />
      <Circle cx="12" cy="17" r="6" stroke={color} strokeWidth={strokeWidth} />
    </Svg>
  );
}

export function HomeTabIcon({ size = 21, color = '#B7C0BA', strokeWidth = 2 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M4 11l8-7 8 7v9a1 1 0 01-1 1h-4v-6h-6v6H5a1 1 0 01-1-1v-9z"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function ChevronLeftIcon({ size = 9, color = '#fff', strokeWidth = 2 }: IconProps) {
  return (
    <Svg width={size} height={size * (14 / 8)} viewBox="0 0 8 14">
      <Path
        d="M7 1L1 7l6 6"
        stroke={color}
        strokeWidth={strokeWidth}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function ChevronRightIcon({ size = 9, color = 'rgba(255,255,255,0.7)', strokeWidth = 2 }: IconProps) {
  return (
    <Svg width={size} height={size * (14 / 8)} viewBox="0 0 8 14">
      <Path
        d="M1 1l6 6-6 6"
        stroke={color}
        strokeWidth={strokeWidth}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function TagIcon({ size = 16, color = '#146C43', strokeWidth = 1.7 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M20 12.6L12.6 20a2 2 0 01-2.8 0l-6.8-6.8a2 2 0 010-2.8L10.2 3H19a1 1 0 011 1v8.6z"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
      />
      <Circle cx="15" cy="8" r="1.6" fill={color} />
    </Svg>
  );
}

export function StoreIcon({ size = 16, color = '#146C43', strokeWidth = 1.7 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M4 9l1-5h14l1 5M4 9a2.2 2.2 0 004.4 0 2.2 2.2 0 004.4 0 2.2 2.2 0 004.4 0M4 9v10h16V9"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <Path d="M9 19v-5h6v5" stroke={color} strokeWidth={strokeWidth} strokeLinejoin="round" />
    </Svg>
  );
}

export function InfoIcon({ size = 16, color = '#146C43', strokeWidth = 1.7 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="8.5" stroke={color} strokeWidth={strokeWidth} />
      <Circle cx="12" cy="8.2" r="1" fill={color} />
      <Path d="M12 11.5v5.3" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    </Svg>
  );
}
