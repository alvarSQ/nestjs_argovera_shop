import { BrandEntity } from '../brand.entity';

export type BrandType = Omit<BrandEntity, 'generateSlug'>;
