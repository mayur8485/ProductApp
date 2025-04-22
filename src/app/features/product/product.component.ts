import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgbOffcanvas, NgbOffcanvasRef } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { addData, updateData } from '../../ngrx/data.action';
import { Product } from './product.interface';
import { ActionType } from '../../shared/dataTypes/common-dataTypes';
import { ACTIONS } from '../../shared/enums/common-enums';

@Component({
  selector: 'app-product',
  imports: [ReactiveFormsModule],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css',
})
export class ProductComponent implements OnInit, OnChanges {
  @ViewChild('offcanvasContent', { static: true }) offcanvas!: ElementRef;

  @Input() isOffcanvas: boolean = false;
  @Input() updateProduct!: Product;
  @Input() mode: ActionType = 'CREATE';
  @Output() enabledChange = new EventEmitter<boolean>();

  productForm!: FormGroup;
  hasError: boolean = false;

  constructor(
    private offcanvasService: NgbOffcanvas,
    private fb: FormBuilder,
    private store: Store
  ) {
    this.prepateProductForm();
  }

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isOffcanvas']['currentValue']) {
      this.productForm.reset();
      this.openOffcanvas(this.offcanvas);
      if (this.mode === 'EDIT') {
        this.openFormInMode();
      }
    }
    if (changes['mode']) {
      if (changes['mode']['currentValue'] === ACTIONS.EDIT) {
        this.mode = ACTIONS.EDIT;
        this.openFormInMode();
      } else if (changes['mode']['currentValue'] === ACTIONS.CREATE) {
        this.mode = ACTIONS.CREATE;
        this.openFormInMode();
      }
    }
  }

  openFormInMode() {
    if (this.mode === ACTIONS.CREATE) {
      this.productForm.reset();
    } else if (this.mode === ACTIONS.EDIT) {
      this.productForm.patchValue(this.updateProduct);
    }
  }

  getRandomId() {
    return Math.floor(Math.random() * 1000 + 1);
  }

  formatDate() {
    const date = new Date();

    const formatted = new Intl.DateTimeFormat('en-US', {
      month: 'short', // "Jun"
      day: '2-digit', // "15"
      year: 'numeric', // "2015"
      hour: 'numeric', // "9"
      minute: '2-digit', // "03"
      second: '2-digit', // "01"
      hour12: true, // "AM" or "PM"
    }).format(date);
    return formatted;
  }

  prepareDataToSave(): Product {
    const data = this.productForm.getRawValue();
    const id =
      this.mode === ACTIONS.CREATE ? this.getRandomId() : this.updateProduct.id;

    const createdAt =
      this.mode === ACTIONS.CREATE
        ? this.formatDate()
        : this.updateProduct.createdAt;

    return {
      ...data,
      id: id,
      createdAt: createdAt,
      updatedAt: this.formatDate(),
    };
  }

  submitFormOnMode() {
    if (this.mode === ACTIONS.CREATE) {
      this.store.dispatch(addData({ data: this.prepareDataToSave() }));
    } else if (this.mode === ACTIONS.EDIT) {
      this.store.dispatch(updateData({ data: this.prepareDataToSave() }));
    }
  }

  onSubmit(offcanvas: any) {
    if (this.productForm.valid) {
      this.submitFormOnMode();
      this.toggle(offcanvas);
    } else {
      this.hasError = true;
    }
  }

  prepateProductForm() {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      category: ['', Validators.required],
      price: [null, Validators.required],
      stock: [null, Validators.required],
    });
  }

  openOffcanvas(content: any) {
    const offcanvasRef: NgbOffcanvasRef = this.offcanvasService.open(content, {
      position: 'end',
      backdrop: true,
      panelClass: 'w-50',
    });
    offcanvasRef.dismissed.subscribe((result) => {
      this.enabledChange.emit(this.isOffcanvas);
    });
  }

  closeOffcanvas(offcanvas: any) {
    this.toggle(offcanvas);
    offcanvas.dismiss('Cross click');
  }

  toggle(offcanvas: any) {
    offcanvas.close();
    this.enabledChange.emit(this.isOffcanvas);
  }
}
