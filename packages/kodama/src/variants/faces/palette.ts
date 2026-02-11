import type { GradientPair } from '../../core/types';

export const DEFAULT_GRADIENTS: readonly GradientPair[] = [
  { from: '#E8D5F5', to: '#C7A4E0' },
  { from: '#FFE0D0', to: '#FFB899' },
  { from: '#D5F5E3', to: '#A8E6CF' },
  { from: '#D6EEFF', to: '#9DD1F5' },
  { from: '#FFD4D4', to: '#FF9E9E' },
  { from: '#FFF5CC', to: '#FFE580' },
  { from: '#E0EFD9', to: '#B8D4A8' },
  { from: '#FFE4EE', to: '#FFB6D0' },
  { from: '#F5E6D0', to: '#E8C9A0' },
  { from: '#D0F0F5', to: '#A0DDE8' },
  { from: '#F0D5E8', to: '#E0A4CC' },
  { from: '#D5E8F5', to: '#A4C7E0' },
  { from: '#F5F0D5', to: '#E8DDA0' },
  { from: '#E0D5F0', to: '#BCA4E0' },
  { from: '#F5D5D0', to: '#E8A4A0' },
  { from: '#D0F5E0', to: '#A0E8BF' },
] as const;

export function getGradient(gradients: readonly GradientPair[] | undefined, index: number): GradientPair {
  const palette = gradients && gradients.length > 0 ? gradients : DEFAULT_GRADIENTS;
  return palette[index % palette.length] ?? { from: '#E8D5F5', to: '#C7A4E0' };
}
