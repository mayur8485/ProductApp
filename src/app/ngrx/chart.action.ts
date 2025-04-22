import { createAction, props } from '@ngrx/store';
import { Product } from '../features/product/product.interface';

export const updateChartData = createAction(
  '[Update] ChartData',
  props<{ data: Product }>
);
