import { LabelKey } from '../../Interfaces/common-interfaces';

export interface TableHeaders extends LabelKey {
  type?: TableHeaderType;
  actions?: TableAction[];
  icon?: string;
}

export interface TableAction extends LabelKey {}

export interface TableActionEmitter {
  action: TableAction;
  data: any;
}

export enum TableHeaderType {
  BUTTON = 'BUTTON',
  TEXT = 'TEXT',
}
