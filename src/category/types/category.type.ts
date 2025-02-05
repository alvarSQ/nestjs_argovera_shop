import { CategoryEntity } from '../category.entity';

export type CategoryType = Omit<CategoryEntity, 'generateSlug'>;
