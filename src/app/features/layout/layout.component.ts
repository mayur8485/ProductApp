import { Component, OnInit, signal } from '@angular/core';
import { TableViewComponent } from '../../shared/components/table-view/table-view.component';
import {
  TableActionEmitter,
  TableHeaders,
} from '../../shared/components/table-view/tabe-interface';
import { ProductComponent } from '../product/product.component';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Product } from '../product/product.interface';
import { ACTIONS } from '../../shared/enums/common-enums';
import { ActionType } from '../../shared/dataTypes/common-dataTypes';
import { deleteData } from '../../ngrx/data.action';
import { BarChartComponent } from '../charts/bar-chart/bar-chart.component';
import { PRODUCT_TABLE_HEADERS } from '../../shared/configs/table.configs';
import { BarInterface } from '../charts/bar-chart/bar-chart.interface';
import {
  BAR_CHART_CONFIG_1,
  BAR_CHART_CONFIG_2,
  PIE_CHART_CONFIG_1,
  PIE_CHART_CONFIG_2,
} from '../../shared/configs/charts.configs';
import { PieComponent } from '../charts/pie/pie.component';
import { PieInterface } from '../charts/pie/pie.chart-interface';

@Component({
  selector: 'app-layout',
  imports: [
    TableViewComponent,
    ProductComponent,
    BarChartComponent,
    PieComponent,
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css',
})
export class LayoutComponent implements OnInit {
  tableHeader: TableHeaders[] = PRODUCT_TABLE_HEADERS;
  updateProduct!: Product;

  isOffcanvas: boolean = false;
  productObservable$!: Observable<any>;

  mode: ActionType = 'CREATE';

  productData = signal<Product[]>([]);

  barProperties1: BarInterface = BAR_CHART_CONFIG_1;
  barChartData1 = signal<any[]>([]);

  barProperties2: BarInterface = BAR_CHART_CONFIG_2;
  barChartData2 = signal<any[]>([]);

  pieChartProps1: PieInterface = PIE_CHART_CONFIG_1;
  pieChartData1 = signal<Record<string, number>>({});

  pieChartProps2: PieInterface = PIE_CHART_CONFIG_2;
  pieChartData2 = signal<Record<string, number>>({});

  constructor(private store: Store<any>) {
    this.productObservable$ = this.store.select('productStore');
  }

  ngOnInit(): void {
    this.productObservable$.subscribe({
      next: (response: Product[]) => {
        this.productData.set(response);
        this.prepareBarChartData();
      },
      error: (error) => {
        console.log('Data not found');
      },
    });
  }

  prepareBarChartData() {
    const baChart1Props: Record<string, number> = {};
    const baChart2Props: Record<string, number> = {};

    const data = this.productData();
    data.forEach((product: Product) => {
      baChart1Props[product.category] =
        (baChart1Props[product.category] || 0) + product.price;

      baChart2Props[product.category] =
        (baChart2Props[product.category] || 0) + product.stock;
    });

    this.pieChartData1.set(baChart1Props);
    this.pieChartData2.set(baChart2Props);

    const chart1: any[] = [],
      chart2: any[] = [];

    Object.entries(baChart1Props).forEach(([key, value]) => {
      chart1.push({
        category: key,
        price: value,
      });
      chart2.push({
        category: key,
        stock: baChart2Props[key],
      });
    });

    this.barChartData1.set(chart1);
    this.barChartData2.set(chart2);
  }

  onAddProduct() {
    this.mode = 'CREATE';
    this.isOffcanvas = true;
  }

  onCloseOffCanvas() {
    this.isOffcanvas = false;
  }

  OnTableAction(event: TableActionEmitter) {
    if (event.action.key === ACTIONS.EDIT) {
      this.isOffcanvas = true;
      this.updateProduct = event.data;
      this.mode = 'EDIT';
    } else if (event.action.key === ACTIONS.DELETE) {
      this.store.dispatch(deleteData({ id: event.data.id }));
    } else {
      this.mode = ACTIONS.CREATE;
    }
  }
}
