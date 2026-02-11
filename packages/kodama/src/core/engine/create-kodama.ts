import { faces } from '../../variants';
import type {
  AnyVariantFactory,
  AnyVariantModule,
  ConfiguredVariant,
  KodamaShape,
  VariantPropsFromModule,
  VariantPropsOf,
  VariantResultOf,
} from '../types';
import { normalizeVariantSelection } from './resolve';

type BaseCreateKodamaOptions = {
  name: string;
  size?: number;
  shape?: KodamaShape;
};

export type CreateKodamaDefaultOptions = BaseCreateKodamaOptions &
  Partial<VariantPropsOf<typeof faces>> & {
    variant?: undefined;
  };

export type CreateKodamaWithVariantOptions<V extends AnyVariantFactory> = BaseCreateKodamaOptions &
  Partial<VariantPropsOf<V>> & {
    variant: V;
  };

export type CreateKodamaWithConfiguredVariantOptions<M extends AnyVariantModule> = BaseCreateKodamaOptions &
  Partial<VariantPropsFromModule<M>> & {
    variant: ConfiguredVariant<M>;
  };

export function createKodama(options: CreateKodamaDefaultOptions): VariantResultOf<typeof faces>;
export function createKodama<V extends AnyVariantFactory>(
  options: CreateKodamaWithVariantOptions<V>
): VariantResultOf<V>;
export function createKodama<M extends AnyVariantModule>(
  options: CreateKodamaWithConfiguredVariantOptions<M>
): { variant: string; svg: string };
export function createKodama(options: Record<string, unknown>): { variant: string; svg: string } {
  const { module, props, name, size, seed, shape } = normalizeVariantSelection(options, faces);
  return module.resolve({ name, size, seed, shape, props });
}
