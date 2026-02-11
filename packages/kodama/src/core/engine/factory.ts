import type {
  AnyVariantFactory,
  AnyVariantModule,
  ConfiguredVariant,
  VariantFactory,
  VariantInputPropsFromModule,
} from '../types';

function assertSupportedKeys(
  module: AnyVariantModule,
  values: Record<string, unknown>,
  context: string
): void {
  const supported = new Set(module.propKeys);

  for (const key of Object.keys(values)) {
    if (!supported.has(key)) {
      throw new Error(`${context}: unsupported prop "${key}" for variant "${module.id}"`);
    }
  }
}

export function createVariantFactory<V extends AnyVariantModule>(module: V): VariantFactory<V> {
  const configure = ((defaults: Partial<VariantInputPropsFromModule<V>> = {}) => {
    assertSupportedKeys(module, defaults as Record<string, unknown>, 'Configured variant');

    return {
      __kodamaConfiguredVariant: true,
      module,
      defaults,
    } as ConfiguredVariant<V>;
  }) as VariantFactory<V>;

  configure.id = module.id;
  configure.module = module;
  configure.propKeys = module.propKeys as readonly Extract<keyof VariantInputPropsFromModule<V>, string>[];

  return configure;
}

export function isConfiguredVariant(value: unknown): value is ConfiguredVariant<AnyVariantModule> {
  return (
    typeof value === 'object' &&
    value !== null &&
    '__kodamaConfiguredVariant' in value &&
    (value as { __kodamaConfiguredVariant?: unknown }).__kodamaConfiguredVariant === true
  );
}

export function isVariantFactory(value: unknown): value is AnyVariantFactory {
  return typeof value === 'function' && value !== null && 'module' in value;
}
