import {
  TableHeaders,
  TableHeaderType,
} from '../components/table-view/tabe-interface';
import { ACTIONS } from '../enums/common-enums';

export const PRODUCT_TABLE_HEADERS: TableHeaders[] = [
  {
    label: 'Product Name',
    key: 'name',
  },
  {
    label: 'Category',
    key: 'category',
  },
  {
    label: 'Price',
    key: 'price',
  },
  {
    label: 'Stock',
    key: 'stock',
  },
  {
    label: 'Updated At',
    key: 'updatedAt',
  },
  {
    label: 'Created At',
    key: 'createdAt',
  },
  {
    label: 'Action',
    key: 'Action',
    type: TableHeaderType.BUTTON,
    actions: [
      {
        label: 'Edit',
        key: ACTIONS.EDIT,
      },
      {
        label: 'Delete',
        key: ACTIONS.DELETE,
      },
    ],
  },
];
