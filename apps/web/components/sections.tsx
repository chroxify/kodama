import { Kodama } from 'kodama-id/react';
import { faces } from 'kodama-id/variants';
import Link from 'next/link';
import { parseAsArrayOf, parseAsString, parseAsStringLiteral, useQueryState } from 'nuqs';
import { useCallback, useRef, useState } from 'react';
import { GRADIENTS, HERO_NAMES, MOODS, VARIETY_NAMES } from '../lib/constants';
import { IconCheck, IconCopy, IconGitHub, IconShuffle } from '../lib/icons';
import { CodeBlock, ScrollFade, Section } from './shared';

const PACKAGE_MANAGERS = [
  { value: 'bun', command: 'bun install' },
  { value: 'npm', command: 'npm install' },
  { value: 'pnpm', command: 'pnpm add' },
  { value: 'yarn', command: 'yarn add' },
] as const;

function InstallBanner() {
  const [pm, setPm] = useState<(typeof PACKAGE_MANAGERS)[number]['value']>('bun');
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const command = PACKAGE_MANAGERS.find((p) => p.value === pm)!;
  const fullCommand = `${command.command} kodama-id`;

  const handleCopy = useCallback(() => {
    navigator.clipboard?.writeText(fullCommand);
    setCopied(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setCopied(false), 2500);
  }, [fullCommand]);

  return (
    <button
      type='button'
      onClick={handleCopy}
      className='mb-1 inline-flex w-fit cursor-copy items-center gap-2 bg-transparent p-0 font-mono text-[0.6875rem] text-foreground-tertiary transition-colors hover:text-foreground-secondary'
      title='Copy to clipboard'
    >
      <code className='bg-transparent p-0 text-inherit'>
        <select
          value={pm}
          onChange={(e) => {
            e.stopPropagation();
            setPm(e.target.value as typeof pm);
          }}
          onClick={(e) => e.stopPropagation()}
          className='cursor-pointer appearance-none border-none bg-transparent font-[inherit] text-[length:inherit] text-inherit underline decoration-dashed decoration-foreground-quaternary underline-offset-2 outline-none'
          style={{ width: `${pm.length}ch` }}
        >
          {PACKAGE_MANAGERS.map((p) => (
            <option key={p.value} value={p.value}>
              {p.value}
            </option>
          ))}
        </select>{' '}
        {command.command.split(' ').slice(1).join(' ')} kodama-id
      </code>
      <span className='relative inline-flex h-3.5 w-3.5'>
        <IconCopy
          className='h-3.5 w-3.5 transition-all duration-200 ease-in-out'
          style={{
            opacity: copied ? 0 : 0.7,
            transform: copied ? 'scale(0.75)' : 'scale(1)',
          }}
        />
        <IconCheck
          className='absolute inset-0 h-3.5 w-3.5 transition-all duration-200 ease-in-out'
          style={{
            opacity: copied ? 0.7 : 0,
            transform: copied ? 'scale(1)' : 'scale(0.75)',
          }}
        />
      </span>
    </button>
  );
}

export function HeroSection() {
  return (
    <header className='relative flex flex-col gap-2'>
      <div className='flex items-center justify-between'>
        <span className='inline-flex items-center gap-1.5 text-[0.9375rem] font-medium tracking-[-0.01em] text-heading'>
          Kodama <span className='text-[0.8125rem] text-foreground-tertiary'>木魅</span>
        </span>
        <Link
          href='https://github.com/chroxify/kodama'
          target='_blank'
          rel='noopener noreferrer'
          title='GitHub'
        >
          <IconGitHub className='h-4.5 w-4.5 text-foreground-quaternary transition-colors hover:text-foreground-tertiary' />
        </Link>
      </div>

      <InstallBanner />

      <h1 className='[font-family:var(--font-serif),Georgia,serif] text-[2rem] leading-[1.2] font-normal tracking-[-0.02em] text-heading'>
        Tiny spirits, born from strings.
        <br />
        Always alive.
      </h1>

      <p className='text-[0.9375rem] leading-[1.55]'>
        Kodama (/koˈdama/) is an open-source avatar system that generates unique characters from any string.
        Unlike traditional avatars, every Kodama is <strong>fully animated</strong> — blinking, floating,
        glancing — right out of the box. <strong>145,152</strong> unique combinations ensure no two avatars
        look alike.
      </p>

      <div className='mt-6 flex h-14 flex-wrap items-center gap-2.5 overflow-hidden'>
        {HERO_NAMES.map((name, i) => (
          <Kodama
            key={name}
            name={name}
            size={56}
            animations={[(['blink', 'eyebrowBounce', 'glance', 'eyeWander'] as const)[i % 4]]}
            detailLevel='full'
          />
        ))}
      </div>
    </header>
  );
}

type FacesAnimation = 'blink' | 'float' | 'entrance' | 'sway' | 'eyeWander' | 'eyebrowBounce' | 'glance';

const ANIMATION_OPTIONS: FacesAnimation[] = [
  'blink',
  'float',
  'sway',
  'eyeWander',
  'eyebrowBounce',
  'glance',
  'entrance',
];
const SHAPE_OPTIONS = ['circle', 'squircle', 'square'] as const;
const DEPTH_OPTIONS = ['none', 'subtle', 'medium', 'dramatic'] as const;
const DETAIL_OPTIONS = ['minimal', 'basic', 'standard', 'full'] as const;
const MOOD_OPTIONS = ['none', 'happy', 'surprised', 'sleepy', 'cool', 'cheeky'] as const;
const BACKGROUND_OPTIONS = ['gradient', 'solid'] as const;

const RANDOM_NAMES = [
  'sakura',
  'atlas',
  'luna',
  'phoenix',
  'sage',
  'coral',
  'indigo',
  'wren',
  'alice',
  'bob',
  'charlie',
  'diana',
  'eve',
  'hiro',
  'ivy',
  'kira',
  'leo',
  'mia',
  'noah',
  'olivia',
  'quinn',
  'ruby',
  'sam',
  'vera',
  'octavia',
  'lexa',
  'lincoln',
  'murphy',
  'madi',
  'ashe',
  'diyoza',
  'indra',
  'helios',
  'roan',
];

function pickRandom<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]!;
}

function pickRandomAnimations(): FacesAnimation[] {
  const count = Math.floor(Math.random() * 3) + 1;
  const shuffled = [...ANIMATION_OPTIONS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

function OptionRow<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: readonly T[];
  onChange: (v: T) => void;
}) {
  return (
    <li className='flex font-[450] text-[0.8125rem] leading-normal text-foreground-secondary'>
      <strong className='w-22 shrink-0 font-[550] text-heading'>{label}</strong>
      <span>
        {options.map((opt, i) => (
          <span key={opt}>
            {i > 0 && <span className='text-foreground-quaternary cursor-default'>{' - '}</span>}
            <button
              type='button'
              onClick={() => onChange(opt)}
              className={`cursor-pointer bg-transparent p-0 font-[450] transition-colors duration-150 ${
                value === opt ? 'text-accent' : 'text-foreground-tertiary hover:text-foreground-secondary'
              }`}
            >
              {opt}
            </button>
          </span>
        ))}
      </span>
    </li>
  );
}

function AnimationRow({
  value,
  onChange,
}: {
  value: FacesAnimation[];
  onChange: (v: FacesAnimation[]) => void;
}) {
  const toggle = (anim: FacesAnimation) => {
    onChange(value.includes(anim) ? value.filter((a) => a !== anim) : [...value, anim]);
  };

  return (
    <li className='flex font-[450] text-[0.8125rem] leading-normal text-foreground-secondary'>
      <strong className='w-22 shrink-0 font-[550] text-heading'>Animations</strong>
      <span>
        {ANIMATION_OPTIONS.map((anim, i) => (
          <span key={anim}>
            {i > 0 && <span className='text-foreground-quaternary cursor-default'>{' - '}</span>}
            <button
              type='button'
              onClick={() => toggle(anim)}
              className={`cursor-pointer bg-transparent p-0 font-[450] transition-colors duration-150 ${
                value.includes(anim)
                  ? 'text-accent'
                  : 'text-foreground-tertiary hover:text-foreground-secondary'
              }`}
            >
              {anim}
            </button>
          </span>
        ))}
      </span>
    </li>
  );
}

export function QuickStartSection() {
  const [tryName, setTryName] = useQueryState('name', parseAsString.withDefault('kodama'));
  const [shape, setShape] = useQueryState('shape', parseAsStringLiteral(SHAPE_OPTIONS).withDefault('circle'));
  const [depth, setDepth] = useQueryState(
    'depth',
    parseAsStringLiteral(DEPTH_OPTIONS).withDefault('dramatic')
  );
  const [detailLevel, setDetailLevel] = useQueryState(
    'detail',
    parseAsStringLiteral(DETAIL_OPTIONS).withDefault('full')
  );
  const [mood, setMood] = useQueryState('mood', parseAsStringLiteral(MOOD_OPTIONS).withDefault('none'));
  const [background, setBackground] = useQueryState(
    'bg',
    parseAsStringLiteral(BACKGROUND_OPTIONS).withDefault('gradient')
  );
  const [animations, setAnimations] = useQueryState(
    'animations',
    parseAsArrayOf(parseAsStringLiteral(ANIMATION_OPTIONS), ',').withDefault(['blink'])
  );
  const [spinning, setSpinning] = useState(false);

  const displayName = tryName;

  const apiParams: string[] = [];
  if (shape !== 'circle') apiParams.push(`shape=${shape}`);
  if (depth !== 'dramatic') apiParams.push(`depth=${depth}`);
  if (detailLevel !== 'full') apiParams.push(`detailLevel=${detailLevel}`);
  if (mood !== 'none') apiParams.push(`mood=${mood}`);
  if (background !== 'gradient') apiParams.push(`background=${background}`);
  if (animations.length > 0) apiParams.push(`animations=${animations.join(',')}`);
  const apiQuery = apiParams.length > 0 ? `?${apiParams.join('&')}` : '';

  const sdkProps: string[] = [`name="${displayName}"`];
  sdkProps.push('size={48}');
  if (shape !== 'circle') sdkProps.push(`shape="${shape}"`);
  if (depth !== 'dramatic') sdkProps.push(`depth="${depth}"`);
  if (detailLevel !== 'full') sdkProps.push(`detailLevel="${detailLevel}"`);
  if (mood !== 'none') sdkProps.push(`mood="${mood}"`);
  if (background !== 'gradient') sdkProps.push(`background="${background}"`);
  if (animations.length > 0) {
    const animStr =
      animations.length === 1
        ? `animations={["${animations[0]}"]}`
        : `animations={[${animations.map((a) => `"${a}"`).join(', ')}]}`;
    sdkProps.push(animStr);
  }
  const sdkPropsStr = sdkProps.join('\n  ');

  return (
    <Section title='Quick Start'>
      <p>
        Try it out — enter a name, adjust the options, and watch the avatar update live.
        <br className='hidden sm:block' /> Drop it into your project with the API or React component.
      </p>

      <div className='mt-3 flex items-start gap-5'>
        <ul className='flex min-w-0 flex-1 list-none flex-col gap-1 pl-0'>
          <li className='flex font-[450] text-[0.8125rem] leading-normal text-foreground-secondary'>
            <strong className='w-22 shrink-0 font-[550] text-heading'>Name</strong>
            <input
              type='text'
              value={tryName}
              onChange={(event) => setTryName(event.target.value)}
              placeholder='type anything...'
              className='border-none bg-transparent py-0 font-[450] text-[0.8125rem] text-accent outline-none placeholder:text-foreground-quaternary'
            />
          </li>
          <OptionRow
            label='Background'
            value={background}
            options={BACKGROUND_OPTIONS}
            onChange={setBackground}
          />
          <OptionRow label='Shape' value={shape} options={SHAPE_OPTIONS} onChange={setShape} />
          <OptionRow label='Detail' value={detailLevel} options={DETAIL_OPTIONS} onChange={setDetailLevel} />
        </ul>

        <div className='flex flex-col items-center gap-2'>
          <Kodama
            name={tryName || ' '}
            size={64}
            shape={shape}
            depth={depth}
            detailLevel={detailLevel}
            mood={mood === 'none' ? undefined : mood}
            background={background}
            animations={animations}
          />
          <button
            type='button'
            onClick={() => {
              setTryName(pickRandom(RANDOM_NAMES));
              setShape(pickRandom(SHAPE_OPTIONS));
              setDepth(pickRandom(DEPTH_OPTIONS));
              setDetailLevel(pickRandom(DETAIL_OPTIONS));
              setMood(pickRandom(MOOD_OPTIONS));
              setBackground(pickRandom(BACKGROUND_OPTIONS));
              setAnimations(pickRandomAnimations());
              setSpinning(true);
              setTimeout(() => setSpinning(false), 400);
            }}
            className='cursor-pointer bg-transparent p-0 text-foreground-tertiary transition-colors hover:text-foreground-secondary'
            title='Randomize'
          >
            <IconShuffle
              className='h-3.5 w-3.5'
              style={{
                transform: spinning ? 'rotate(180deg) scale(0.95)' : 'rotate(0deg) scale(1)',
                transition: spinning ? 'transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)' : 'none',
              }}
            />
          </button>
        </div>
      </div>

      <ul className='flex list-none flex-col gap-1 pl-0'>
        <OptionRow label='Depth' value={depth} options={DEPTH_OPTIONS} onChange={setDepth} />
        <OptionRow label='Mood' value={mood} options={MOOD_OPTIONS} onChange={setMood} />
        <AnimationRow value={animations} onChange={setAnimations} />
      </ul>

      <h4 className='mt-5 mb-1 text-[0.75rem] font-[560] text-heading-tertiary'>API</h4>
      <p>
        Generate avatars as SVG over HTTP. The <code>name</code> is the URL path — all options go in the query
        string.
      </p>
      <CodeBlock>{`<img src="https://api.kodama.sh/${displayName}${apiQuery}" />`}</CodeBlock>

      <h4 className='mt-5 mb-1 text-[0.75rem] font-[560] text-heading-tertiary'>React</h4>
      <p>
        Import the <code>Kodama</code> component and pass a <code>name</code> string. Props match the API
        parameters.
      </p>
      <CodeBlock>{`import { Kodama } from "kodama-id/react";

<Kodama
  ${sdkPropsStr}
/>`}</CodeBlock>
    </Section>
  );
}

export function DeterministicSection() {
  return (
    <Section title='Deterministic'>
      <p>
        Avatars are derived from a hash of the input string — the same name always produces the same face.
        Fully deterministic, with nothing stored or fetched.
      </p>

      <div className='mt-3 flex flex-wrap gap-5 sm:gap-10 justify-between sm:justify-start'>
        <div className='flex flex-col items-center gap-1.5'>
          <div className='flex gap-1.5'>
            <Kodama name='alice' size={44} detailLevel='full' />
            <Kodama name='alice' size={44} detailLevel='full' />
            <Kodama name='alice' size={44} detailLevel='full' />
          </div>
          <span className='text-[0.6875rem] font-[450] text-foreground-tertiary'>
            &quot;alice&quot; - always identical
          </span>
        </div>

        <div className='flex flex-col items-center gap-1.5'>
          <div className='flex gap-1.5'>
            <Kodama name='alice' size={44} detailLevel='full' />
            <Kodama name='bob' size={44} detailLevel='full' />
            <Kodama name='charlie' size={44} detailLevel='full' />
          </div>
          <span className='text-[0.6875rem] font-[450] text-foreground-tertiary'>
            Different names, different faces
          </span>
        </div>
      </div>
    </Section>
  );
}

export function CombinationsSection() {
  const combinations = {
    eyes: ['round', 'cross', 'line', 'curved', 'wink', 'heart'],
    mouths: ['smile', 'grin', 'o', 'cat', 'tongue', 'smirk', 'flat'],
    eyebrows: ['arched', 'flat', 'raised', 'none'],
    cheeks: ['blush', 'none'],
    accessories: ['glasses', 'sunglasses', 'none'],
  };

  return (
    <Section title='145,152 Combinations'>
      <p>
        Faces are assembled from <strong>6</strong> eye styles x <strong>4</strong> eyebrow types x{' '}
        <strong>7</strong> mouths x <strong>2</strong> cheek options x <strong>3</strong> accessories x{' '}
        <strong>16</strong> colors x <strong>9</strong> rotations.
      </p>

      <ul className='mt-2 flex list-none flex-col gap-1 pl-0'>
        {Object.entries(combinations).map(([key, values]) => (
          <li key={key} className='flex text-[0.8125rem] leading-normal text-foreground-secondary'>
            <strong className='w-22 shrink-0 font-[550] text-heading'>
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </strong>
            <span className='text-foreground-tertiary'>
              {values.map((v, i) => (
                <span key={`${key}-${v}`}>
                  {i > 0 && <span className='cursor-default'> - </span>}
                  {v}
                </span>
              ))}
            </span>
          </li>
        ))}
      </ul>

      <div className='mt-5 flex flex-wrap gap-2'>
        {VARIETY_NAMES.map((name) => (
          <Kodama key={name} name={name} size={44} detailLevel='full' />
        ))}
      </div>
    </Section>
  );
}

export function ColorsSection() {
  return (
    <Section title='Colors'>
      <p>
        Sixteen soft pastel gradients with radial rendering for a subtle 3D appearance. <br /> Pass in a
        custom <code>gradients</code> array to use your own palette.
      </p>
      <div className='mt-5 grid grid-cols-4 gap-4'>
        {GRADIENTS.map(({ name, pair }) => (
          <div key={name} className='flex flex-col items-center gap-1.5'>
            <Kodama name={name} size={52} gradients={pair} detailLevel='full' />
            <span className='text-[0.6875rem] font-[450] text-foreground-tertiary'>{name}</span>
          </div>
        ))}
      </div>
    </Section>
  );
}

export function VariantsSection() {
  return (
    <Section title='Variants'>
      <p>
        Variants are pluggable visual styles. Each variant defines its own set of props — moods, animations,
        detail levels, and more. Pass a variant factory directly or pre-configure it with a descriptor.
      </p>

      <CodeBlock>{`import { faces } from "kodama-id/variants";

// Pass directly — configure via props
<Kodama name="luna" variant={faces} background="solid" mood="happy" />

// Or pre-configure with a descriptor
<Kodama name="luna" variant={faces({ background: "solid", detailLevel: "full" })} />`}</CodeBlock>

      <div className='mt-5 flex flex-wrap items-center gap-4'>
        <div className='flex flex-col items-center gap-1.5'>
          <Kodama name='faces' size={56} variant={faces} detailLevel='full' />
          <span className='text-[0.6875rem] font-[450] text-foreground-tertiary'>Faces</span>
        </div>
        <div className='flex flex-col items-center gap-1.5'>
          <div
            className='flex items-center justify-center rounded-full'
            style={{
              width: 56,
              height: 56,
              background: 'radial-gradient(circle at 35% 35%, #efefef, #dedede)',
            }}
          >
            <span className='select-none text-base text-foreground-muted'>?</span>
          </div>
          <span className='text-[0.6875rem] font-[450] text-foreground-tertiary'>More soon...</span>
        </div>
      </div>
    </Section>
  );
}

export function MoodsSection() {
  return (
    <Section title='Moods'>
      <p>Set a mood to give the avatar a specific expression, regardless of the generated features.</p>

      <CodeBlock>{`<Kodama name="user" mood="happy" />
<Kodama name="user" mood="cool" />`}</CodeBlock>

      <div className='mt-5 grid grid-cols-5 gap-3 max-[600px]:grid-cols-3'>
        {MOODS.map(({ mood, label, desc }) => (
          <div key={mood} className='flex flex-col items-center gap-1.5 text-center'>
            <Kodama name='mood-demo' size={52} mood={mood} detailLevel='full' />
            <div className='flex flex-col items-center gap-0.5'>
              <span className='text-xs font-medium text-heading'>{label}</span>
              <span className='text-[0.625rem] leading-[1.4] text-foreground-tertiary'>{desc}</span>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}

export function AnimationsSection() {
  return (
    <Section title='Animations'>
      <p>
        Pass an <code>animations</code> array to bring avatars to life. All animations are CSS-based and
        injected on demand — combine freely. Pass a string for defaults, or an object with <code>type</code>,{' '}
        <code>delay</code>, and <code>duration</code> for custom timing.
      </p>

      <CodeBlock>{`<Kodama
  name="sprite"
  animations={["blink", "float", "sway", "eyeWander"]}
/>

// With custom timing
<Kodama
  name="sprite"
  animations={[
    "blink",
    { type: "float", duration: 4, delay: 0.5 },
  ]}
/>`}</CodeBlock>

      <div className='mt-5 grid grid-cols-4 gap-3 max-[600px]:grid-cols-4'>
        <div className='flex flex-col items-center gap-1.5'>
          <Kodama name='blink-demo' size={48} animations={['blink']} detailLevel='full' />
          <span className='text-[0.6875rem] font-[450] text-foreground-tertiary'>blink</span>
        </div>
        <div className='flex flex-col items-center gap-1.5'>
          <Kodama name='float-demo' size={48} animations={['float']} detailLevel='full' />
          <span className='text-[0.6875rem] font-[450] text-foreground-tertiary'>float</span>
        </div>
        <div className='flex flex-col items-center gap-1.5'>
          <Kodama name='breeze' size={48} animations={['sway']} detailLevel='full' />
          <span className='text-[0.6875rem] font-[450] text-foreground-tertiary'>sway</span>
        </div>
        <div className='flex flex-col items-center gap-1.5'>
          <Kodama name='gaze' size={48} animations={['eyeWander']} detailLevel='full' />
          <span className='text-[0.6875rem] font-[450] text-foreground-tertiary'>eyeWander</span>
        </div>
        <div className='flex flex-col items-center gap-1.5'>
          <Kodama name='bounce-demo' size={48} animations={['eyebrowBounce']} detailLevel='full' />
          <span className='text-[0.6875rem] font-[450] text-foreground-tertiary'>eyebrowBounce</span>
        </div>
        <div className='flex flex-col items-center gap-1.5'>
          <Kodama name='glance-demo' size={48} animations={['glance']} detailLevel='full' depth='dramatic' />
          <span className='text-[0.6875rem] font-[450] text-foreground-tertiary'>glance</span>
        </div>
        <div className='flex flex-col items-center gap-1.5'>
          <Kodama name='entrance-demo' size={48} animations={['entrance']} detailLevel='full' />
          <span className='text-[0.6875rem] font-[450] text-foreground-tertiary'>entrance</span>
        </div>
        <div className='flex flex-col items-center gap-1.5'>
          <Kodama
            name='all-anim'
            size={48}
            animations={['blink', 'float', 'sway', 'eyeWander', 'eyebrowBounce']}
            detailLevel='full'
          />
          <span className='text-[0.6875rem] font-[450] text-foreground-tertiary'>combined</span>
        </div>
      </div>
    </Section>
  );
}

export function ShapeSection() {
  return (
    <Section title='Shape'>
      <p>Choose between a circle, squircle, or square clip for the avatar.</p>

      <CodeBlock>{`<Kodama name="user" shape="circle" />
<Kodama name="user" shape="squircle" />
<Kodama name="user" shape="square" />`}</CodeBlock>

      <div className='mt-5 flex flex-wrap items-center gap-4'>
        {(['circle', 'squircle', 'square'] as const).map((s) => (
          <div key={s} className='flex flex-col items-center gap-1.5'>
            <Kodama name='shape-demo' size={56} shape={s} detailLevel='full' animations={['blink']} />
            <span className='text-[0.6875rem] font-[450] text-foreground-tertiary'>{s}</span>
          </div>
        ))}
      </div>
    </Section>
  );
}

export function DepthEffectsSection() {
  return (
    <Section title='3D Effects'>
      <p>
        Four depth levels for CSS 3D perspective transforms. The face tilts based on the deterministic
        rotation. In React, the face flattens on hover when <code>interactive</code> is enabled.
      </p>

      <CodeBlock>{`<Kodama name="user" depth="dramatic" />`}</CodeBlock>

      <div className='mt-5 flex flex-wrap items-center gap-4'>
        {(['none', 'subtle', 'medium', 'dramatic'] as const).map((level) => (
          <div key={level} className='flex flex-col items-center gap-1.5'>
            <Kodama name='depth' size={56} depth={level} detailLevel='full' />
            <span className='text-[0.6875rem] font-[450] text-foreground-tertiary'>{level}</span>
          </div>
        ))}
      </div>
    </Section>
  );
}

export function DetailLevelsSection() {
  return (
    <Section title='Detail Levels'>
      <p>
        Feature visibility automatically adapts to size. Smaller avatars show fewer features for clarity.
        Override with the <code>detailLevel</code> prop.
      </p>

      <div className='mt-5 flex flex-wrap items-end gap-6'>
        <div className='flex flex-col items-center gap-1.5'>
          <Kodama name='detail' size={24} />
          <div className='flex flex-col items-center gap-0.5'>
            <span className='text-xs font-medium text-heading'>minimal</span>
            <span className='text-[0.625rem] leading-[1.4] text-foreground-tertiary'>
              &lt; 32px - eyes only
            </span>
          </div>
        </div>

        <div className='flex flex-col items-center gap-1.5'>
          <Kodama name='detail' size={40} />
          <div className='flex flex-col items-center gap-0.5'>
            <span className='text-xs font-medium text-heading'>basic</span>
            <span className='text-[0.625rem] leading-[1.4] text-foreground-tertiary'>32-48px - + mouth</span>
          </div>
        </div>

        <div className='flex flex-col items-center gap-1.5'>
          <Kodama name='detail' size={56} />
          <div className='flex flex-col items-center gap-0.5'>
            <span className='text-xs font-medium text-heading'>standard</span>
            <span className='text-[0.625rem] leading-[1.4] text-foreground-tertiary'>
              48-64px - + eyebrows
            </span>
          </div>
        </div>

        <div className='flex flex-col items-center gap-1.5'>
          <Kodama name='detail' size={72} />
          <div className='flex flex-col items-center gap-0.5'>
            <span className='text-xs font-medium text-heading'>full</span>
            <span className='text-[0.625rem] leading-[1.4] text-foreground-tertiary'>
              &gt;= 64px - all features
            </span>
          </div>
        </div>
      </div>
    </Section>
  );
}

export function CustomGradientsSection() {
  return (
    <Section title='Custom Gradients'>
      <p>
        Replace the default palette with your own gradient pairs via the <code>gradients</code> prop. The API
        accepts hex pairs like <code>E8D5F5-C7A4E0,FFE0D0-FFB899</code>.
      </p>

      <CodeBlock>{`const brand = [
  { from: "#667EEA", to: "#764BA2" },
  { from: "#F093FB", to: "#F5576C" },
];

<Kodama name="user" gradients={brand} />`}</CodeBlock>

      <div className='mt-5 flex flex-wrap items-center gap-4'>
        <Kodama
          name='custom-1'
          size={52}
          gradients={[{ from: '#667EEA', to: '#764BA2' }]}
          detailLevel='full'
        />
        <Kodama
          name='custom-2'
          size={52}
          gradients={[{ from: '#F093FB', to: '#F5576C' }]}
          detailLevel='full'
        />
        <Kodama
          name='custom-3'
          size={52}
          gradients={[{ from: '#43E97B', to: '#38F9D7' }]}
          detailLevel='full'
        />
        <Kodama
          name='custom-4'
          size={52}
          gradients={[{ from: '#FA709A', to: '#FEE140' }]}
          detailLevel='full'
        />
      </div>
    </Section>
  );
}

export function ReferenceSection() {
  const th =
    'border-b border-border-strong px-2.5 py-2 text-left text-[0.75rem] font-[560] whitespace-nowrap text-heading';
  const tdName =
    'border-b border-border px-2.5 py-2 align-top font-mono text-xs font-medium whitespace-nowrap text-heading';
  const tdType =
    'border-b border-border px-2.5 py-2 align-top font-mono text-[0.6875rem] whitespace-nowrap text-accent';
  const tdDefault =
    'border-b border-border px-2.5 py-2 align-top font-mono text-[0.6875rem] whitespace-nowrap text-foreground-tertiary';
  const tdDesc =
    'border-b border-border px-2.5 py-2 align-top leading-[1.45] text-foreground-secondary min-w-48';
  const reactOnly = (
    <span className='ml-1.5 select-none rounded bg-surface-badge px-1.5 py-0.5 font-sans text-[0.5625rem] font-medium tracking-wide text-badge-foreground'>
      REACT
    </span>
  );

  const thead = (
    <thead>
      <tr>
        <th className={th}>Prop / Param</th>
        <th className={th}>Type</th>
        <th className={th}>Default</th>
        <th className={th}>Description</th>
      </tr>
    </thead>
  );

  return (
    <Section title='Reference'>
      <p>
        Props and API params share the same names. In the API, <code>name</code> is the URL path — all others
        are query params.
      </p>

      <h4 className='mt-4 mb-1 text-[0.75rem] font-[560] text-heading-tertiary'>Global</h4>
      <ScrollFade>
        <table className='w-full border-collapse text-[0.8125rem]'>
          {thead}
          <tbody>
            <tr>
              <td className={tdName}>name</td>
              <td className={tdType}>string</td>
              <td className={tdDefault}>-</td>
              <td className={tdDesc}>Input string for deterministic generation. API: URL path segment.</td>
            </tr>
            <tr>
              <td className={tdName}>size</td>
              <td className={tdType}>number</td>
              <td className={tdDefault}>40 / 128</td>
              <td className={tdDesc}>Avatar dimensions in pixels. React default: 40. API default: 128.</td>
            </tr>
            <tr>
              <td className={tdName}>shape</td>
              <td className={tdType}>{'"circle" | "squircle" | "square"'}</td>
              <td className={tdDefault}>{'"circle"'}</td>
              <td className={tdDesc}>
                Avatar clipping shape. Squircle uses Apple-style continuous curvature.
              </td>
            </tr>
            <tr>
              <td className={tdName}>variant</td>
              <td className={tdType}>{'"faces"'}</td>
              <td className={tdDefault}>{'"faces"'}</td>
              <td className={tdDesc}>Variant plugin to use for rendering.</td>
            </tr>
            <tr>
              <td className={tdName}>interactive{reactOnly}</td>
              <td className={tdType}>boolean</td>
              <td className={tdDefault}>true</td>
              <td className={tdDesc}>Enable hover interaction</td>
            </tr>
          </tbody>
        </table>
      </ScrollFade>

      <h4 className='mt-5 mb-1 text-[0.75rem] font-[560] text-heading-tertiary'>Faces</h4>
      <ScrollFade>
        <table className='w-full border-collapse text-[0.8125rem]'>
          {thead}
          <tbody>
            <tr>
              <td className={tdName}>background</td>
              <td className={tdType}>{'"gradient" | "solid"'}</td>
              <td className={tdDefault}>{'"gradient"'}</td>
              <td className={tdDesc}>Background style</td>
            </tr>
            <tr>
              <td className={tdName}>mood</td>
              <td className={tdType}>{'"happy" | "surprised" | "sleepy" | "cool" | "cheeky"'}</td>
              <td className={tdDefault}>-</td>
              <td className={tdDesc}>Override expression</td>
            </tr>
            <tr>
              <td className={tdName}>detailLevel</td>
              <td className={tdType}>{'"minimal" | "basic" | "standard" | "full"'}</td>
              <td className={tdDefault}>auto</td>
              <td className={tdDesc}>Feature visibility level. Adapts to size by default.</td>
            </tr>
            <tr>
              <td className={tdName}>depth</td>
              <td className={tdType}>{'"none" | "subtle" | "medium" | "dramatic"'}</td>
              <td className={tdDefault}>{'"dramatic"'}</td>
              <td className={tdDesc}>3D perspective transform depth</td>
            </tr>
            <tr>
              <td className={tdName}>animations</td>
              <td className={tdType}>
                {
                  'Animation<"blink" | "float" | "sway" | "eyeWander" | "eyebrowBounce" | "glance" | "entrance">[]'
                }
              </td>
              <td className={tdDefault}>[]</td>
              <td className={tdDesc}>
                String or <code>{'{ type, delay?, duration? }'}</code>. API: comma-separated strings.
              </td>
            </tr>
            <tr>
              <td className={tdName}>gradients</td>
              <td className={tdType}>{'GradientPair<{ from: string, to: string }>[]'}</td>
              <td className={tdDefault}>-</td>
              <td className={tdDesc}>
                Custom gradient palette. API: hex pairs like <code>E8D5F5-C7A4E0,FFE0D0-FFB899</code>
              </td>
            </tr>
          </tbody>
        </table>
      </ScrollFade>
    </Section>
  );
}

export function PageFooter() {
  return (
    <footer className='mx-auto flex max-w-152 items-center justify-between border-t border-border px-6 py-4 text-xs text-foreground-tertiary'>
      <span>
        <span className='hidden sm:inline'>Kodama — </span>Deterministic, animated, open-source avatars.
      </span>
      <Link
        href='https://github.com/chroxify/kodama'
        target='_blank'
        rel='noopener noreferrer'
        title='GitHub'
      >
        <IconGitHub className='h-4 w-4 text-foreground-quaternary transition-colors hover:text-foreground-tertiary' />
      </Link>
    </footer>
  );
}
