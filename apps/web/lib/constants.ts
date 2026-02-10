import type { Mood } from 'kodama-id';

export const HERO_NAMES = ['Sakura', 'Atlas', 'Luna', 'Phoenix', 'Sage', 'Coral', 'Indigo', 'Wren'];

export const VARIETY_NAMES = [
  'alice',
  'bob',
  'charlie',
  'diana',
  'eve',
  'frank',
  'grace',
  'hiro',
  'ivy',
  'jack',
  'kira',
  'leo',
  'mia',
  'noah',
  'olivia',
  'pete',
  'quinn',
  'ruby',
  'sam',
  'tara',
  'uma',
  'vera',
  'wren',
  'xena',
] as const;

export const MOODS: { mood: Mood; label: string; desc: string }[] = [
  { mood: 'happy', label: 'Happy', desc: 'Curved eyes, grin' },
  { mood: 'surprised', label: 'Surprised', desc: 'Round eyes, O mouth' },
  { mood: 'sleepy', label: 'Sleepy', desc: 'Line eyes, flat mouth' },
  { mood: 'cool', label: 'Cool', desc: 'Sunglasses, smirk' },
  { mood: 'cheeky', label: 'Cheeky', desc: 'Wink, tongue, blush' },
];

export const GRADIENTS: { name: string; pair: { from: string; to: string }[] }[] = [
  { name: 'Lavender', pair: [{ from: '#E8D5F5', to: '#C7A4E0' }] },
  { name: 'Peach', pair: [{ from: '#FFE0D0', to: '#FFB899' }] },
  { name: 'Mint', pair: [{ from: '#D5F5E3', to: '#A8E6CF' }] },
  { name: 'Sky', pair: [{ from: '#D6EEFF', to: '#9DD1F5' }] },
  { name: 'Coral', pair: [{ from: '#FFD4D4', to: '#FF9E9E' }] },
  { name: 'Butter', pair: [{ from: '#FFF5CC', to: '#FFE580' }] },
  { name: 'Sage', pair: [{ from: '#E0EFD9', to: '#B8D4A8' }] },
  { name: 'Blush', pair: [{ from: '#FFE4EE', to: '#FFB6D0' }] },
  { name: 'Sand', pair: [{ from: '#F5E6D0', to: '#E8C9A0' }] },
  { name: 'Ice', pair: [{ from: '#D0F0F5', to: '#A0DDE8' }] },
  { name: 'Orchid', pair: [{ from: '#F0D5E8', to: '#E0A4CC' }] },
  { name: 'Steel', pair: [{ from: '#D5E8F5', to: '#A4C7E0' }] },
  { name: 'Cream', pair: [{ from: '#F5F0D5', to: '#E8DDA0' }] },
  { name: 'Iris', pair: [{ from: '#E0D5F0', to: '#BCA4E0' }] },
  { name: 'Rose', pair: [{ from: '#F5D5D0', to: '#E8A4A0' }] },
  { name: 'Fern', pair: [{ from: '#D0F5E0', to: '#A0E8BF' }] },
];
