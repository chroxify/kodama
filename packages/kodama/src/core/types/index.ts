export type GradientPair = {
  from: string;
  to: string;
};

export type Rotation = {
  x: number;
  y: number;
};

export type FeatureShape = {
  viewBox: string;
  paths: Array<string | { d: string; fill?: string; opacity?: string }>;
  strokes?: Array<{
    d: string;
    strokeWidth: string;
    strokeLinecap?: string;
    fill?: string;
  }>;
  circles?: Array<{
    cx: string;
    cy: string;
    r: string;
    fill?: string;
    stroke?: string;
    strokeWidth?: string;
    opacity?: string;
  }>;
  ellipses?: Array<{
    cx: string;
    cy: string;
    rx: string;
    ry: string;
    stroke?: string;
    strokeWidth?: string;
    fill?: string;
  }>;
  rects?: Array<{
    x: string;
    y: string;
    width: string;
    height: string;
    rx?: string;
    fill?: string;
    opacity?: string;
  }>;
};

export type KodamaShape = 'circle' | 'squircle' | 'square';

export type VariantCapabilities = {
  backgrounds?: readonly string[];
  animations?: readonly string[];
};

export type VariantContext = {
  name: string;
  size: number;
  seed: number;
  shape: KodamaShape;
};

export type VariantModule<
  Id extends string,
  InputProps extends Record<string, unknown>,
  NormalizedProps extends Record<string, unknown>,
  Result extends { variant: Id; svg: string },
> = {
  id: Id;
  propKeys: readonly Extract<keyof InputProps, string>[];
  capabilities: VariantCapabilities;
  normalizeProps(props: Partial<InputProps>, context: VariantContext): NormalizedProps;
  resolve(context: VariantContext & { props: NormalizedProps }): Result;
};

export type VariantInputPropsFromModule<V extends AnyVariantModule> =
  V extends VariantModule<string, infer P, Record<string, unknown>, { variant: string; svg: string }>
    ? P
    : never;

export type VariantNormalizedPropsFromModule<V extends AnyVariantModule> =
  V extends VariantModule<string, Record<string, unknown>, infer P, { variant: string; svg: string }>
    ? P
    : never;

export type ConfiguredVariant<V extends AnyVariantModule> = {
  __kodamaConfiguredVariant: true;
  module: V;
  defaults: Partial<VariantInputPropsFromModule<V>>;
};

export type VariantFactory<V extends AnyVariantModule> = {
  id: V['id'];
  module: V;
  propKeys: readonly Extract<keyof VariantInputPropsFromModule<V>, string>[];
  (defaults: Partial<VariantInputPropsFromModule<V>>): ConfiguredVariant<V>;
};

export type VariantModuleOf<V extends AnyVariantFactory> = V['module'];

export type VariantPropsFromModule<V extends AnyVariantModule> = VariantInputPropsFromModule<V>;

export type VariantPropsOf<V extends AnyVariantFactory> = VariantInputPropsFromModule<VariantModuleOf<V>>;

export type VariantResultFromModule<V extends AnyVariantModule> =
  V extends VariantModule<string, Record<string, unknown>, Record<string, unknown>, infer R> ? R : never;

export type VariantResultOf<V extends AnyVariantFactory> = VariantResultFromModule<VariantModuleOf<V>>;

export type VariantInput<V extends AnyVariantFactory> = V | ConfiguredVariant<VariantModuleOf<V>>;

export type NeverProps<T extends Record<string, unknown>> = {
  [K in keyof T]?: never;
};

export type AnyVariantModule = VariantModule<
  string,
  Record<string, unknown>,
  Record<string, unknown>,
  { variant: string; svg: string }
>;

export type AnyVariantFactory = VariantFactory<AnyVariantModule>;
