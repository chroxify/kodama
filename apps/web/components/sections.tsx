import { Kodama } from 'kodama-id/react';
import { faces } from 'kodama-id/variants';
import { GRADIENTS, HERO_NAMES, MOODS, VARIETY_NAMES } from '../lib/constants';
import { CodeBlock, CopyIcon, Section } from './shared';

export function HeroSection() {
  return (
    <header className='relative mb-2 flex flex-col gap-2 pb-4'>
      <div className='mb-3 flex items-center gap-2'>
        <Kodama name='kodama' size={28} detailLevel='full' animations={['blink']} />
        <span className='text-[0.9375rem] font-medium tracking-[-0.01em] text-black/85'>kodama</span>
      </div>

      <button
        type='button'
        className='mb-1 inline-flex w-fit cursor-pointer items-center gap-2 bg-transparent p-0 font-mono text-[0.6875rem] text-black/40 transition-colors hover:text-black/65'
        onClick={() => navigator.clipboard?.writeText('bun install kodama-id')}
        title='Copy to clipboard'
      >
        <code className='bg-transparent p-0 text-inherit'>bun install kodama-id</code>
        <span className='opacity-70'>
          <CopyIcon />
        </span>
      </button>

      <h1 className='[font-family:var(--font-serif),Georgia,serif] text-[2rem] leading-[1.2] font-normal tracking-[-0.02em] text-black/85'>
        Same name, same face.
        <br />
        Every time.
      </h1>

      <p className='text-[0.9375rem] leading-[1.55]'>
        Kodama generates unique, animated character faces from any string - a name, email, or user ID. Same
        input, same face, deterministically. <strong>145,152</strong> possible combinations across 16 pastel
        gradients, 6 eye styles, 7 mouths, 4 eyebrows, and 3 accessories.
      </p>

      <div className='mt-6 flex flex-wrap items-center gap-2.5'>
        {HERO_NAMES.map((name) => (
          <Kodama key={name} name={name} size={56} animations={['blink']} detailLevel='full' />
        ))}
      </div>
    </header>
  );
}

export function QuickStartSection({
  tryName,
  setTryName,
}: {
  tryName: string;
  setTryName: (name: string) => void;
}) {
  return (
    <Section title='Quick Start'>
      <p>
        Import the <code>Kodama</code> component and pass a <code>name</code> string. The avatar is
        deterministically generated from the input.
      </p>
      <CodeBlock>{`import { Kodama } from "kodama-id/react";

<Kodama name="sakura@example.com" size={48} />`}</CodeBlock>

      <div className='mt-3.5 flex items-center gap-4 rounded-lg border border-black/8 bg-black/2 p-4 max-[600px]:flex-col'>
        <input
          type='text'
          value={tryName}
          onChange={(event) => setTryName(event.target.value)}
          placeholder='Type any string...'
          className='flex-1 rounded-md border border-black/10 bg-white px-3 py-2 text-[0.875rem] text-black/85 outline-none transition-colors placeholder:text-black/25 focus:border-[#4c74ff]'
        />
        <Kodama name={tryName || ' '} size={64} detailLevel='full' animations={['blink']} />
      </div>
    </Section>
  );
}

export function DeterministicSection() {
  return (
    <Section title='Deterministic'>
      <p>
        Avatars are computed from a hash of the input string. No randomness, no server, no storage. The same
        name always produces an identical face.
      </p>

      <div className='mt-3 flex flex-wrap gap-10'>
        <div className='flex flex-col items-center gap-1.5'>
          <div className='flex gap-1.5'>
            <Kodama name='alice' size={44} detailLevel='full' />
            <Kodama name='alice' size={44} detailLevel='full' />
            <Kodama name='alice' size={44} detailLevel='full' />
          </div>
          <span className='text-[0.6875rem] font-[450] text-black/40'>
            &quot;alice&quot; - always identical
          </span>
        </div>

        <div className='flex flex-col items-center gap-1.5'>
          <div className='flex gap-1.5'>
            <Kodama name='alice' size={44} detailLevel='full' />
            <Kodama name='bob' size={44} detailLevel='full' />
            <Kodama name='charlie' size={44} detailLevel='full' />
          </div>
          <span className='text-[0.6875rem] font-[450] text-black/40'>Different names, different faces</span>
        </div>
      </div>
    </Section>
  );
}

export function CombinationsSection() {
  return (
    <Section title='145,152 Combinations'>
      <p>
        Faces are assembled from <strong>6</strong> eye styles x <strong>4</strong> eyebrow types x{' '}
        <strong>7</strong> mouths x <strong>2</strong> cheek options x <strong>3</strong> accessories x{' '}
        <strong>16</strong> colors x <strong>9</strong> rotations.
      </p>

      <ul className='mt-2 flex list-none flex-col gap-1 pl-0'>
        <li className='text-[0.8125rem] leading-normal text-black/65'>
          <strong className='inline-block min-w-22 font-[550] text-black/85'>Eyes</strong>
          <span className='text-black/40'>round - cross - line - curved - wink - heart</span>
        </li>
        <li className='text-[0.8125rem] leading-normal text-black/65'>
          <strong className='inline-block min-w-22 font-[550] text-black/85'>Mouths</strong>
          <span className='text-black/40'>smile - grin - o - cat - tongue - smirk - flat</span>
        </li>
        <li className='text-[0.8125rem] leading-normal text-black/65'>
          <strong className='inline-block min-w-22 font-[550] text-black/85'>Eyebrows</strong>
          <span className='text-black/40'>arched - flat - raised - none</span>
        </li>
        <li className='text-[0.8125rem] leading-normal text-black/65'>
          <strong className='inline-block min-w-22 font-[550] text-black/85'>Cheeks</strong>
          <span className='text-black/40'>blush - none</span>
        </li>
        <li className='text-[0.8125rem] leading-normal text-black/65'>
          <strong className='inline-block min-w-22 font-[550] text-black/85'>Accessories</strong>
          <span className='text-black/40'>glasses - sunglasses - none</span>
        </li>
      </ul>

      <div className='mt-3 flex flex-wrap gap-2'>
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
        Sixteen Apple-inspired pastel gradients with radial gradient rendering for a subtle 3D appearance.
        Pass a custom <code>gradients</code> array to use your own palette.
      </p>
      <div className='mt-3 grid grid-cols-4 gap-4 max-[600px]:grid-cols-2'>
        {GRADIENTS.map(({ name, pair }) => (
          <div key={name} className='flex flex-col items-center gap-1.5'>
            <Kodama name={name} size={52} gradients={pair} detailLevel='full' />
            <span className='text-[0.6875rem] font-[450] text-black/40'>{name}</span>
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

      <div className='mt-3 flex flex-wrap items-center gap-4'>
        <div className='flex flex-col items-center gap-1.5'>
          <Kodama name='faces' size={56} variant={faces} detailLevel='full' />
          <span className='text-[0.6875rem] font-[450] text-black/40'>Faces</span>
        </div>
        <div className='flex flex-col items-center gap-1.5'>
          <div
            className='flex items-center justify-center rounded-full bg-black/[0.04]'
            style={{ width: 56, height: 56 }}
          >
            <span className='select-none text-base text-black/20'>?</span>
          </div>
          <span className='text-[0.6875rem] font-[450] text-black/40'>Create your own</span>
        </div>
      </div>
    </Section>
  );
}

export function MoodsSection() {
  return (
    <Section title='Moods'>
      <p>Five preset moods override the generated facial features to express specific emotions.</p>

      <CodeBlock>{`<Kodama name="user" mood="happy" />
<Kodama name="user" mood="cool" />`}</CodeBlock>

      <div className='mt-3 grid grid-cols-5 gap-3 max-[600px]:grid-cols-3'>
        {MOODS.map(({ mood, label, desc }) => (
          <div key={mood} className='flex flex-col items-center gap-1.5 text-center'>
            <Kodama name='mood-demo' size={52} mood={mood} detailLevel='full' />
            <span className='text-xs font-medium text-black/85'>{label}</span>
            <span className='text-[0.625rem] leading-[1.4] text-black/40'>{desc}</span>
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
        injected on demand - combine freely.
      </p>

      <CodeBlock>{`<Kodama
  name="sprite"
  animations={["blink", "float", "sway", "eyeWander"]}
/>`}</CodeBlock>

      <div className='mt-3 grid grid-cols-4 gap-3 max-[600px]:grid-cols-3'>
        <div className='flex flex-col items-center gap-1.5'>
          <Kodama name='blink-demo' size={48} animations={['blink']} detailLevel='full' />
          <span className='text-[0.6875rem] font-[450] text-black/40'>blink</span>
        </div>
        <div className='flex flex-col items-center gap-1.5'>
          <Kodama name='float-demo' size={48} animations={['float']} detailLevel='full' />
          <span className='text-[0.6875rem] font-[450] text-black/40'>float</span>
        </div>
        <div className='flex flex-col items-center gap-1.5'>
          <Kodama name='breeze' size={48} animations={['sway']} detailLevel='full' />
          <span className='text-[0.6875rem] font-[450] text-black/40'>sway</span>
        </div>
        <div className='flex flex-col items-center gap-1.5'>
          <Kodama name='gaze' size={48} animations={['eyeWander']} detailLevel='full' />
          <span className='text-[0.6875rem] font-[450] text-black/40'>eyeWander</span>
        </div>
        <div className='flex flex-col items-center gap-1.5'>
          <Kodama name='bounce-demo' size={48} animations={['eyebrowBounce']} detailLevel='full' />
          <span className='text-[0.6875rem] font-[450] text-black/40'>eyebrowBounce</span>
        </div>
        <div className='flex flex-col items-center gap-1.5'>
          <Kodama name='glance-demo' size={48} animations={['glance']} detailLevel='full' depth='dramatic' />
          <span className='text-[0.6875rem] font-[450] text-black/40'>glance</span>
        </div>
        <div className='flex flex-col items-center gap-1.5'>
          <Kodama name='entrance-demo' size={48} animations={['entrance']} detailLevel='full' />
          <span className='text-[0.6875rem] font-[450] text-black/40'>entrance</span>
        </div>
        <div className='flex flex-col items-center gap-1.5'>
          <Kodama
            name='all-anim'
            size={48}
            animations={['blink', 'float', 'sway', 'eyeWander', 'eyebrowBounce']}
            detailLevel='full'
          />
          <span className='text-[0.6875rem] font-[450] text-black/40'>combined</span>
        </div>
      </div>
    </Section>
  );
}

export function ShapeSection() {
  return (
    <Section title='Shape'>
      <p>
        Control the avatar shape with the <code>shape</code> prop. Applies to both the React component and SVG
        output.
      </p>

      <CodeBlock>{`<Kodama name="user" shape="circle" />
<Kodama name="user" shape="squircle" />
<Kodama name="user" shape="square" />`}</CodeBlock>

      <div className='mt-3 flex flex-wrap items-center gap-4'>
        {(['circle', 'squircle', 'square'] as const).map((s) => (
          <div key={s} className='flex flex-col items-center gap-1.5'>
            <Kodama name='shape-demo' size={56} shape={s} detailLevel='full' animations={['blink']} />
            <span className='text-[0.6875rem] font-[450] text-black/40'>{s}</span>
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

      <div className='mt-3 flex flex-wrap items-center gap-4'>
        {(['none', 'subtle', 'medium', 'dramatic'] as const).map((level) => (
          <div key={level} className='flex flex-col items-center gap-1.5'>
            <Kodama name='depth' size={56} depth={level} detailLevel='full' />
            <span className='text-[0.6875rem] font-[450] text-black/40'>{level}</span>
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

      <div className='mt-3 flex flex-wrap items-end gap-6'>
        <div className='flex flex-col items-center gap-1.5'>
          <Kodama name='detail' size={24} />
          <div>
            <span className='text-[0.6875rem] font-[450] text-black/40'>minimal</span>
            <span className='mt-0.5 block text-[0.625rem] text-black/25'>&lt; 32px - eyes only</span>
          </div>
        </div>

        <div className='flex flex-col items-center gap-1.5'>
          <Kodama name='detail' size={40} />
          <div>
            <span className='text-[0.6875rem] font-[450] text-black/40'>basic</span>
            <span className='mt-0.5 block text-[0.625rem] text-black/25'>32-48px - + mouth</span>
          </div>
        </div>

        <div className='flex flex-col items-center gap-1.5'>
          <Kodama name='detail' size={56} />
          <div>
            <span className='text-[0.6875rem] font-[450] text-black/40'>standard</span>
            <span className='mt-0.5 block text-[0.625rem] text-black/25'>48-64px - + eyebrows</span>
          </div>
        </div>

        <div className='flex flex-col items-center gap-1.5'>
          <Kodama name='detail' size={72} />
          <div>
            <span className='text-[0.6875rem] font-[450] text-black/40'>full</span>
            <span className='mt-0.5 block text-[0.625rem] text-black/25'>&gt;= 64px - all features</span>
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
        Replace the default palette with your own gradient pairs via the <code>gradients</code> prop.
      </p>

      <CodeBlock>{`const brand = [
  { from: "#667EEA", to: "#764BA2" },
  { from: "#F093FB", to: "#F5576C" },
];

<Kodama name="user" gradients={brand} />`}</CodeBlock>

      <div className='mt-3 flex flex-wrap items-center gap-4'>
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

export function ApiSection() {
  return (
    <Section title='API'>
      <p>
        Generate avatars as SVG over HTTP. Responses are edge-cached with <strong>immutable</strong> headers
        for instant delivery. Same name, same face — cached for a year.
      </p>

      <CodeBlock>{`GET /:name

<!-- As an image -->
<img src="https://kodama.example.com/alice" />

<!-- With options -->
<img src="https://kodama.example.com/alice?variant=faces&size=256&mood=happy&background=solid" />`}</CodeBlock>

      <p>
        All parameters match the React props by name. The avatar <code>name</code> is the URL path —
        everything else goes in the query string.
      </p>

      <CodeBlock>{`# Full example
/alice?variant=faces&size=256&shape=squircle&background=gradient&mood=cool&detailLevel=full&depth=dramatic&animations=blink,float`}</CodeBlock>
    </Section>
  );
}

export function ReferenceSection() {
  const th =
    'border-b border-black/12 px-2.5 py-2 text-left text-[0.75rem] font-[560] whitespace-nowrap text-black/85';
  const tdName =
    'border-b border-black/8 px-2.5 py-2 align-top font-mono text-xs font-medium whitespace-nowrap text-black/85';
  const tdType =
    'border-b border-black/8 px-2.5 py-2 align-top font-mono text-[0.6875rem] whitespace-nowrap text-[#4c74ff]';
  const tdDefault =
    'border-b border-black/8 px-2.5 py-2 align-top font-mono text-[0.6875rem] whitespace-nowrap text-black/40';
  const tdDesc = 'border-b border-black/8 px-2.5 py-2 align-top leading-[1.45] text-black/65';
  const reactOnly = (
    <span className='ml-1.5 rounded bg-black/5 px-1.5 py-0.5 font-sans text-[0.5625rem] font-medium tracking-wide text-black/35'>
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

      <h4 className='mt-4 mb-1 text-[0.75rem] font-[560] text-black/60'>Global</h4>
      <div className='overflow-x-auto'>
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
              <td className={tdType}>VariantFactory</td>
              <td className={tdDefault}>faces</td>
              <td className={tdDesc}>
                Variant plugin factory, e.g. <code>faces</code>
              </td>
            </tr>
            <tr>
              <td className={tdName}>interactive{reactOnly}</td>
              <td className={tdType}>boolean</td>
              <td className={tdDefault}>true</td>
              <td className={tdDesc}>Enable hover interaction</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h4 className='mt-5 mb-1 text-[0.75rem] font-[560] text-black/60'>Faces variant</h4>
      <div className='overflow-x-auto'>
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
              <td className={tdType}>Animation[]</td>
              <td className={tdDefault}>[]</td>
              <td className={tdDesc}>
                <code>blink</code> - <code>float</code> - <code>sway</code> - <code>eyeWander</code> -{' '}
                <code>eyebrowBounce</code> - <code>glance</code> - <code>entrance</code>. API:
                comma-separated.
              </td>
            </tr>
            <tr>
              <td className={tdName}>gradients</td>
              <td className={tdType}>GradientPair[]</td>
              <td className={tdDefault}>-</td>
              <td className={tdDesc}>
                Custom gradient palette. API: hex pairs like <code>E8D5F5-C7A4E0,FFE0D0-FFB899</code>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </Section>
  );
}

export function PageFooter() {
  return (
    <footer className='mx-auto max-w-152 border-t border-black/8 px-6 py-6 text-xs text-black/40'>
      Kodama - Deterministic animated avatars.
    </footer>
  );
}
