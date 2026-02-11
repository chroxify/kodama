import type {
  AnyVariantFactory,
  AnyVariantModule,
  KodamaShape,
  VariantInput,
  VariantInputPropsFromModule,
  VariantModuleOf,
  VariantNormalizedPropsFromModule,
} from '../types';
import { hash } from '../utils/hash';
import { isConfiguredVariant, isVariantFactory } from './factory';

const BASE_OPTION_KEYS = new Set(['name', 'size', 'shape', 'variant']);

function pickVariantPropsFromSource<P extends Record<string, unknown>>(
  source: Record<string, unknown>,
  keys: readonly string[]
): Partial<P> {
  const picked: Partial<P> = {};

  for (const key of keys) {
    if (key in source) {
      (picked as Record<string, unknown>)[key] = source[key];
    }
  }

  return picked;
}

function assertNoUnknownOptions(
  source: Record<string, unknown>,
  module: AnyVariantModule,
  includeBaseKeys: boolean
): void {
  const allowed = new Set<string>(module.propKeys as readonly string[]);

  if (includeBaseKeys) {
    for (const key of BASE_OPTION_KEYS) {
      allowed.add(key);
    }
  }

  for (const key of Object.keys(source)) {
    if (!allowed.has(key)) {
      throw new Error(`createKodama: unsupported option "${key}" for variant "${module.id}"`);
    }
  }
}

function assertNoTopLevelVariantProps(source: Record<string, unknown>, module: AnyVariantModule): void {
  const mixedKeys = (module.propKeys as readonly string[]).filter((key) => key in source);

  if (mixedKeys.length === 0) {
    return;
  }

  throw new Error(
    `createKodama: variant "${module.id}" is configured via descriptor; remove top-level props (${mixedKeys.join(', ')}) or pass the raw variant factory instead.`
  );
}

export function pickVariantProps(
  module: AnyVariantModule,
  source: Record<string, unknown>
): Partial<Record<string, unknown>> {
  return pickVariantPropsFromSource(source, module.propKeys as readonly string[]);
}

export function resolveVariantInput<V extends AnyVariantFactory>(
  input: VariantInput<V> | undefined,
  fallback: V
): VariantModuleOf<V>;
export function resolveVariantInput<V extends AnyVariantFactory>(
  input: unknown,
  fallback: V
): AnyVariantModule;
export function resolveVariantInput<V extends AnyVariantFactory>(
  input: unknown,
  fallback: V
): AnyVariantModule {
  if (input === undefined) {
    return fallback.module as VariantModuleOf<V>;
  }

  if (isConfiguredVariant(input)) {
    return input.module as VariantModuleOf<V>;
  }

  if (isVariantFactory(input)) {
    return input.module as VariantModuleOf<V>;
  }

  throw new Error('createKodama: invalid variant input');
}

export function normalizeVariantSelection<V extends AnyVariantFactory>(
  options: Record<string, unknown>,
  fallback: V
): {
  module: VariantModuleOf<V>;
  props: VariantNormalizedPropsFromModule<VariantModuleOf<V>>;
  name: string;
  size: number;
  seed: number;
  shape: KodamaShape;
} {
  const name = String(options.name ?? '');
  const size = typeof options.size === 'number' ? options.size : 40;
  const seed = hash(name);

  const VALID_SHAPES = new Set<KodamaShape>(['circle', 'squircle', 'square']);
  const rawShape = options.shape as KodamaShape | undefined;
  const shape: KodamaShape = rawShape && VALID_SHAPES.has(rawShape) ? rawShape : 'circle';

  const variantInput = (options.variant as VariantInput<V> | undefined) ?? fallback;
  const module = resolveVariantInput(variantInput, fallback);

  assertNoUnknownOptions(options, module, true);

  let rawProps: Partial<VariantInputPropsFromModule<VariantModuleOf<V>>>;

  if (isConfiguredVariant(variantInput)) {
    assertNoTopLevelVariantProps(options, module);
    rawProps = (variantInput.defaults ?? {}) as Partial<VariantInputPropsFromModule<VariantModuleOf<V>>>;
  } else {
    rawProps = pickVariantPropsFromSource<VariantInputPropsFromModule<VariantModuleOf<V>>>(
      options,
      module.propKeys as readonly string[]
    );
  }

  const props = module.normalizeProps(rawProps, {
    name,
    size,
    seed,
    shape,
  }) as VariantNormalizedPropsFromModule<VariantModuleOf<V>>;

  return {
    module,
    props,
    name,
    size,
    seed,
    shape,
  };
}
