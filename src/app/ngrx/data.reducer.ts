import { createReducer, on } from '@ngrx/store';
import { Product } from '../features/product/product.interface';
import { addData, deleteData, updateData } from './data.action';
import { PRODUCT_SAMPLE_DATA } from '../DummyData/dummyData';

// Initial State
const INITIAL_STATE: Product[] = PRODUCT_SAMPLE_DATA;

export const productReducer = createReducer(
  INITIAL_STATE,
  on(addData, (state, action) => {
    return [...state, action.data];
  }),
  on(updateData, (state, action) => {
    return state.map((item) =>
      item.id === action.data.id ? { ...action.data } : item
    );
  }),
  on(deleteData, (state, action) => {
    return state.filter((x) => x.id != action.id);
  })
);
