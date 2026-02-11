# kodama-id

Kodama is a deterministic avatar library with a plugin architecture.

## Entry points

- `kodama-id` core engine and `createKodama`
- `kodama-id/react` React component
- `kodama-id/variants` built-in variant factories (`faces`)

## Quick examples

```ts
import { createKodama } from 'kodama-id';
import { faces } from 'kodama-id/variants';

createKodama({ name: 'sakura' });
createKodama({ name: 'sakura', variant: faces, mood: 'happy', background: 'solid' });
createKodama({ name: 'sakura', variant: faces({ mood: 'cool', background: 'gradient' }) });
```

```tsx
import { Kodama } from 'kodama-id/react';
import { faces } from 'kodama-id/variants';

<Kodama name='sakura' />
<Kodama name='sakura' variant={faces} mood='happy' />
<Kodama name='sakura' variant={faces({ mood: 'cool', background: 'solid' })} />
```
