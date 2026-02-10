import * as React from 'react';
import { applyMood, generate } from '../core/generation/generate';
import { DEFAULT_GRADIENTS, getGradient } from '../core/palette/gradients';
import {
  ACCESSORY_SHAPES,
  CHEEK_SHAPES,
  EYE_SHAPES,
  EYEBROW_SHAPES,
  MOUTH_SHAPES,
} from '../core/svg/features';
import { renderFeature } from '../core/svg/svg';
import type { Animation, DetailLevel, GradientPair, Mood, Variant } from '../core/types';
import { hash } from '../core/utils/hash';

export type Depth = 'none' | 'subtle' | 'medium' | 'dramatic';

export interface KodamaProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  name: string;
  size?: number | string;
  variant?: Variant;
  depth?: Depth;
  interactive?: boolean;
  showMouth?: boolean;
  animations?: Animation[];
  mood?: Mood;
  detailLevel?: DetailLevel;
  gradients?: GradientPair[];
}

const DEPTH_PRESETS = {
  none: { rotateRange: 0, translateZ: 0, perspective: 'none', contentScale: 1 },
  subtle: { rotateRange: 5, translateZ: 4, perspective: '800px', contentScale: 0.97 },
  medium: { rotateRange: 10, translateZ: 8, perspective: '500px', contentScale: 0.94 },
  dramatic: { rotateRange: 15, translateZ: 12, perspective: '300px', contentScale: 0.9 },
} as const;

const ALL_KEYFRAMES = `
@keyframes kodama-blink {
	0%, 92%, 100% { transform: scaleY(1); }
	96% { transform: scaleY(0.05); }
}
@keyframes kodama-eyebrow-bounce {
	0%, 88%, 100% { transform: translateY(0); }
	94% { transform: translateY(-2px); }
}
@keyframes kodama-float {
	0%, 100% { transform: translateY(0); }
	50% { transform: translateY(-3px); }
}
@keyframes kodama-sway {
	0%, 100% { transform: translateX(0); }
	25% { transform: translateX(-2px); }
	75% { transform: translateX(2px); }
}
@keyframes kodama-eye-wander {
	0%, 100% { transform: translateX(0) translateY(0); }
	20% { transform: translateX(1.5px) translateY(-0.5px); }
	40% { transform: translateX(0.5px) translateY(0.5px); }
	60% { transform: translateX(-1.5px) translateY(0); }
	80% { transform: translateX(-0.5px) translateY(-0.5px); }
}
@keyframes kodama-entrance-scale {
	0% { transform: scale(0.8); opacity: 0; }
	100% { transform: scale(1); opacity: 1; }
}
@keyframes kodama-entrance-eyes {
	0% { transform: scaleY(0.05); }
	100% { transform: scaleY(1); }
}
`;

let keyframesInjected = false;

function injectKeyframes() {
  if (keyframesInjected || typeof document === 'undefined') {
    return;
  }
  const style = document.createElement('style');
  style.textContent = ALL_KEYFRAMES;
  document.head.appendChild(style);
  keyframesInjected = true;
}

function getAutoDetailLevel(size: number): DetailLevel {
  if (size < 32) return 'minimal';
  if (size < 48) return 'basic';
  if (size < 64) return 'standard';
  return 'full';
}

export const Kodama = React.forwardRef<HTMLDivElement, KodamaProps>(
  (
    {
      name,
      size = 40,
      variant = 'gradient',
      depth = 'dramatic',
      interactive = true,
      showMouth: showMouthProp = true,
      animations = [],
      mood,
      detailLevel: detailLevelProp,
      gradients,
      className,
      style,
      onMouseEnter,
      onMouseLeave,
      ...props
    },
    ref
  ) => {
    const [isHovered, setIsHovered] = React.useState(false);

    const numericSize = typeof size === 'number' ? size : 40;
    const detail = detailLevelProp ?? getAutoDetailLevel(numericSize);

    const has = React.useMemo(() => {
      const set = new Set(animations);
      return {
        blink: set.has('blink'),
        float: set.has('float'),
        entrance: set.has('entrance'),
        sway: set.has('sway'),
        eyeWander: set.has('eyeWander'),
        eyebrowBounce: set.has('eyebrowBounce'),
      };
    }, [animations]);

    if (animations.length > 0) {
      injectKeyframes();
    }

    const { face, gradient, rotation, blinkStyle } = React.useMemo(() => {
      const h = hash(name);
      const colorsLength = gradients?.length ?? DEFAULT_GRADIENTS.length;
      const data = generate({ name, colorsLength });
      let faceData = data.face;
      if (mood) {
        faceData = applyMood(faceData, mood);
      }
      const _gradient = getGradient(gradients, data.colorIndex);

      const blinkSeed = h * 31;
      const blinkDelay = (blinkSeed % 40) / 10;
      const blinkDuration = 2 + (blinkSeed % 40) / 10;

      return {
        face: faceData,
        gradient: _gradient,
        rotation: data.rotation,
        blinkStyle: `animation:kodama-blink ${blinkDuration}s ease-in-out ${blinkDelay}s infinite;transform-origin:center center;`,
      };
    }, [name, gradients, mood]);

    // Render feature SVGs
    const eyeShapeData = EYE_SHAPES[face.eyes] ?? EYE_SHAPES.round;
    const eyebrowShapeData = EYEBROW_SHAPES[face.eyebrows];
    const mouthShapeData = MOUTH_SHAPES[face.mouth] ?? MOUTH_SHAPES.smile;
    const cheekShapeData = CHEEK_SHAPES[face.cheeks];
    const accessoryShapeData = ACCESSORY_SHAPES[face.accessory];

    const eyeHtml = React.useMemo(
      () =>
        renderFeature(
          eyeShapeData,
          'currentColor',
          'currentColor',
          has.blink ? blinkStyle : undefined,
          'width:100%;height:auto;max-width:90%;max-height:40%'
        ),
      [eyeShapeData, has.blink, blinkStyle]
    );
    const eyebrowHtml = React.useMemo(
      () =>
        eyebrowShapeData
          ? renderFeature(
              eyebrowShapeData,
              'currentColor',
              'currentColor',
              undefined,
              'width:100%;height:auto'
            )
          : null,
      [eyebrowShapeData]
    );
    const mouthHtml = React.useMemo(
      () =>
        renderFeature(mouthShapeData, 'currentColor', 'currentColor', undefined, 'width:100%;height:auto'),
      [mouthShapeData]
    );
    const cheekHtml = React.useMemo(
      () =>
        cheekShapeData
          ? renderFeature(cheekShapeData, '#FF9EBB', '#FF9EBB', undefined, 'width:100%;height:auto')
          : null,
      [cheekShapeData]
    );
    const accessoryHtml = React.useMemo(
      () =>
        accessoryShapeData
          ? renderFeature(
              accessoryShapeData,
              'currentColor',
              'currentColor',
              undefined,
              'width:110%;height:auto'
            )
          : null,
      [accessoryShapeData]
    );

    const preset = DEPTH_PRESETS[depth];

    const transform = React.useMemo(() => {
      if (depth === 'none') return;
      const rotateX = isHovered && interactive ? 0 : rotation.x * preset.rotateRange;
      const rotateY = isHovered && interactive ? 0 : rotation.y * preset.rotateRange;
      return `scale(${preset.contentScale}) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(${preset.translateZ}px)`;
    }, [depth, isHovered, interactive, rotation, preset]);

    const sizeValue = typeof size === 'number' ? `${size}px` : size;

    const backgroundStyle = React.useMemo((): React.CSSProperties => {
      if (variant === 'solid') return { backgroundColor: gradient.from };
      return {
        background: `radial-gradient(circle at 40% 40%, ${gradient.from} 0%, ${gradient.to} 100%)`,
      };
    }, [variant, gradient]);

    const handleMouseEnter = React.useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        if (interactive) setIsHovered(true);
        onMouseEnter?.(e);
      },
      [interactive, onMouseEnter]
    );

    const handleMouseLeave = React.useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        if (interactive) setIsHovered(false);
        onMouseLeave?.(e);
      },
      [interactive, onMouseLeave]
    );

    const showEyebrows = detail === 'standard' || detail === 'full';
    const showMouth = detail !== 'minimal';
    const showCheeks = detail === 'full';
    const showAccessories = detail === 'full';
    const hasGlasses = face.accessory === 'glasses' || face.accessory === 'sunglasses';
    const showEyes = !(showAccessories && hasGlasses);
    const glassesActive = showAccessories && hasGlasses;

    return (
      // biome-ignore lint/a11y/noStaticElementInteractions: Decorative avatar component
      <div
        className={['kodama', className].filter(Boolean).join(' ')}
        data-interactive={interactive || undefined}
        data-kodama=''
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        ref={ref}
        style={{
          width: sizeValue,
          height: sizeValue,
          borderRadius: '50%',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          containerType: 'size',
          ...(depth !== 'none' && {
            perspective: preset.perspective,
            transformStyle: 'preserve-3d',
          }),
          ...backgroundStyle,
          ...(has.entrance && {
            animation: 'kodama-entrance-scale 0.4s ease-out forwards',
          }),
          ...style,
        }}
        {...props}
      >
        {variant === 'gradient' && (
          <div
            data-kodama-gradient=''
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: '50%',
              pointerEvents: 'none',
              zIndex: 1,
              background:
                'radial-gradient(ellipse 100% 100% at 50% 50%, rgba(255,255,255,0.15) 0%, transparent 60%)',
            }}
          />
        )}

        <div
          data-kodama-sway=''
          style={{
            position: 'absolute',
            inset: 0,
            ...(has.sway && {
              animation: 'kodama-sway 5s ease-in-out infinite',
            }),
          }}
        >
          <div
            data-kodama-face=''
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 2,
              transform,
              transformStyle: depth !== 'none' ? 'preserve-3d' : undefined,
              transition: interactive ? 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)' : undefined,
              ...(has.float && {
                animation: 'kodama-float 3s ease-in-out infinite',
              }),
            }}
          >
            {showEyebrows && eyebrowHtml && (
              <div
                data-kodama-eyebrows=''
                style={{
                  width: '55%',
                  marginBottom: glassesActive ? '6%' : '2%',
                  ...(has.eyebrowBounce
                    ? { animation: 'kodama-eyebrow-bounce 4s ease-in-out infinite' }
                    : {}),
                }}
                dangerouslySetInnerHTML={{ __html: eyebrowHtml }}
              />
            )}

            <div
              data-kodama-eyes=''
              style={{
                width: '60%',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                ...(has.entrance && {
                  animation: 'kodama-entrance-eyes 0.3s ease-out 0.2s both',
                }),
                ...(has.eyeWander &&
                  !has.entrance && {
                    animation: 'kodama-eye-wander 8s ease-in-out infinite',
                  }),
                ...(has.eyeWander &&
                  has.entrance && {
                    animation:
                      'kodama-entrance-eyes 0.3s ease-out 0.2s both, kodama-eye-wander 8s ease-in-out 0.5s infinite',
                  }),
              }}
            >
              {showEyes && (
                <div style={{ display: 'contents' }} dangerouslySetInnerHTML={{ __html: eyeHtml }} />
              )}
              {showAccessories && accessoryHtml && (
                <div
                  data-kodama-accessory=''
                  style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    pointerEvents: 'none',
                  }}
                  dangerouslySetInnerHTML={{ __html: accessoryHtml }}
                />
              )}
            </div>

            {showMouth && showMouthProp && (
              <div
                data-kodama-mouth=''
                style={{
                  marginTop: glassesActive ? '8%' : '4%',
                  width: '35%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                dangerouslySetInnerHTML={{ __html: mouthHtml }}
              />
            )}

            {showCheeks && cheekHtml && (
              <div
                data-kodama-cheeks=''
                style={{
                  position: 'absolute',
                  bottom: '18%',
                  left: '5%',
                  right: '5%',
                  pointerEvents: 'none',
                }}
                dangerouslySetInnerHTML={{ __html: cheekHtml }}
              />
            )}
          </div>
        </div>
      </div>
    );
  }
);

Kodama.displayName = 'Kodama';
