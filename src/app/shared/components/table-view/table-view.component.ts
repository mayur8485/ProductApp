import {
  Component,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
} from '@angular/core';
import {
  TableAction,
  TableActionEmitter,
  TableHeaders,
} from './tabe-interface';
import { NgStyle } from '@angular/common';

import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-table-view',
  imports: [NgStyle, NgbPaginationModule],
  templateUrl: './table-view.component.html',
  styleUrl: './table-view.component.css',
})
export class TableViewComponent {
  @Input() headers: TableHeaders[] = [];
  @Input() data: any[] = [];
  @Input() height: string = '300px';
  @Input() recordsPerPage: number = 5;

  @Output() onActionEmit: EventEmitter<TableActionEmitter> =
    new EventEmitter<TableActionEmitter>();

  dataChunks: any[] = [];
  noOfPages: any = [];
  page: number = 0;
  startIndex: number = 0;

  ngOnInit(): void {
    if (this.data?.length > 0) {
      this.onUpdateTable();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes && changes['data']) {
      this.onUpdateTable();
    }
  }

  onUpdateTable() {
    this.noOfPages = Math.ceil(this.data.length / this.recordsPerPage) * 10;
    this.addPagination(1);
  }

  addPagination(page: number) {
    const startIndex = (page - 1) * this.recordsPerPage;
    const endIndex = startIndex + this.recordsPerPage;
    this.startIndex = startIndex;
    this.dataChunks = this.data.slice(startIndex, endIndex);
  }

  OnExecuteAction(action: TableAction, rowData: any) {
    this.onActionEmit.emit({ action: action, data: rowData });
  }
}
