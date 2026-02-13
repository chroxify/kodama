<div align="center">
  <br />
  <a href="https://api.kodama.sh/Sakura?size=80&detailLevel=full&animations=float"><img src="https://api.kodama.sh/Sakura?size=80&detailLevel=full&animations=float" width="80" height="80" alt="Sakura" /></a>&nbsp;&nbsp;
  <a href="https://api.kodama.sh/Atlas?size=80&detailLevel=full&animations=eyebrowBounce"><img src="https://api.kodama.sh/Atlas?size=80&detailLevel=full&animations=eyebrowBounce" width="80" height="80" alt="Atlas" /></a>&nbsp;&nbsp;
  <a href="https://api.kodama.sh/Luna?size=80&detailLevel=full&animations=glance"><img src="https://api.kodama.sh/Luna?size=80&detailLevel=full&animations=glance" width="80" height="80" alt="Luna" /></a>&nbsp;&nbsp;
  <a href="https://api.kodama.sh/Phoenix?size=80&detailLevel=full&animations=eyeWander,sway"><img src="https://api.kodama.sh/Phoenix?size=80&detailLevel=full&animations=eyeWander,sway" width="80" height="80" alt="Phoenix" /></a>&nbsp;&nbsp;
  <a href="https://api.kodama.sh/Steve?size=80&detailLevel=full&animations=blink,glance"><img src="https://api.kodama.sh/Steve?size=80&detailLevel=full&animations=blink,glance" width="80" height="80" alt="Steve" /></a>
  <br /><br />

  <h3>Kodama <small>木魅</small></h3>

  <p><em>Tiny spirits, born from strings. Always alive.</em></p>

  <p>
    <a href="https://www.npmjs.com/package/kodama-id"><img src="https://img.shields.io/npm/v/kodama-id" alt="npm" /></a>
    <a href="https://github.com/chroxify/kodama/blob/main/LICENSE"><img src="https://img.shields.io/github/license/chroxify/kodama" alt="license" /></a>
  </p>

  <p>
    <a href="https://kodama.sh">Documentation</a> · <a href="https://api.kodama.sh">API</a> · <a href="https://www.npmjs.com/package/kodama-id">npm</a>
  </p>
</div>

<br />

Kodama is an open-source avatar system that generates unique, animated characters from any string. Unlike traditional avatars, every Kodama is **fully animated** — blinking, floating, glancing — right out of the box. **145,152** unique combinations ensure no two avatars look alike.

## Install

```bash
# bun
bun install kodama-id

# npm
npm install kodama-id

# pnpm
pnpm add kodama-id
```

## Quick Start

### API

Generate avatars as SVG over HTTP. The name is the URL path — all options go in the query string.

```html
<img src="https://api.kodama.sh/kodama" />
```

### React

Import the `Kodama` component and pass a `name` string. Props match the API parameters.

```jsx
import { Kodama } from "kodama-id/react";

<Kodama
  name="kodama"
  size={48}
  animations={["blink"]}
/>
```

## Features

### Deterministic

Avatars are derived from a hash of the input string — the same name always produces the same face. Fully deterministic, with nothing stored or fetched.

### 145,152 Combinations

Faces are assembled from **6** eye styles, **4** eyebrow types, **7** mouths, **2** cheek options, **3** accessories, **16** colors, and **9** rotations.

### Animations

All animations are CSS-based and injected on demand — combine freely.

| Animation | Description |
|-----------|-------------|
| `blink` | Periodic blinking |
| `float` | Gentle vertical bob |
| `sway` | Subtle horizontal sway |
| `eyeWander` | Eyes drift around |
| `eyebrowBounce` | Eyebrows bounce |
| `glance` | Eyes glance to the side |
| `entrance` | Animated entrance |

### Moods

Set a mood to give the avatar a specific expression, regardless of the generated features.

`happy` · `surprised` · `sleepy` · `cool` · `cheeky`

### Shapes & Depth

Three clipping shapes — `circle`, `squircle`, `square` — and four 3D depth levels — `none`, `subtle`, `medium`, `dramatic`.

### Custom Gradients

Replace the default palette with your own gradient pairs.

```jsx
<Kodama
  name="user"
  gradients={[
    { from: "#667EEA", to: "#764BA2" },
    { from: "#F093FB", to: "#F5576C" },
  ]}
/>
```

## Reference

Props and API params share the same names. In the API, `name` is the URL path — all others are query params.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `name` | `string` | — | Input string for deterministic generation |
| `size` | `number` | `40` / `128` | Avatar size in px. React: 40, API: 128 |
| `shape` | `"circle" \| "squircle" \| "square"` | `"circle"` | Clipping shape |
| `variant` | `"faces"` | `"faces"` | Variant plugin |
| `background` | `"gradient" \| "solid"` | `"gradient"` | Background style |
| `mood` | `"happy" \| "surprised" \| "sleepy" \| "cool" \| "cheeky"` | — | Override expression |
| `detailLevel` | `"minimal" \| "basic" \| "standard" \| "full"` | auto | Feature visibility. Adapts to size by default |
| `depth` | `"none" \| "subtle" \| "medium" \| "dramatic"` | `"dramatic"` | 3D perspective depth |
| `animations` | `Animation[]` | `[]` | CSS animations. API: comma-separated |
| `gradients` | `{ from, to }[]` | — | Custom gradient palette |

## Documentation

For interactive examples, a live playground, and the full API reference, visit **[kodama.sh](https://kodama.sh)**.

## License

Kodama is licensed under the [MIT License](LICENSE).
