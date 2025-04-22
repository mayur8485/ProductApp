import { createAction, props } from '@ngrx/store';
import { Product } from '../features/product/product.interface';

export const addData = createAction(
  '[NewData] AddData',
  props<{ data: Product }>()
);

export const updateData = createAction(
  '[Update] UpdateData',
  props<{ data: Product }>()
);

export const deleteData = createAction(
  '[Delete] DeleteData',
  props<{ id: number }>()
);
