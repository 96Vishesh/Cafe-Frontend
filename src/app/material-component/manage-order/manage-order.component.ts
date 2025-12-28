import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { BillService } from 'src/app/services/bill.service';
import { CategoryService } from 'src/app/services/category.service';
import { ProductService } from 'src/app/services/product.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { GlobalConstants } from 'src/app/shared/global-constants';
import { saveAs } from 'file-saver';

@Component({
    selector: 'app-manage-order',
    templateUrl: './manage-order.component.html',
    styleUrls: ['./manage-order.component.scss']
})
export class ManageOrderComponent implements OnInit {
    orderForm: any = FormGroup;
    categories: any[] = [];
    products: any[] = [];
    selectedCategory: any;
    selectedProduct: any;
    price: number = 0;
    quantity: number = 1;
    totalAmount: number = 0;
    orderColumns: string[] = ['name', 'category', 'price', 'quantity', 'total', 'delete'];
    dataSource: any[] = [];
    responseMessage: string = '';

    constructor(
        private fb: FormBuilder,
        private ngxService: NgxUiLoaderService,
        private categoryService: CategoryService,
        private productService: ProductService,
        private billService: BillService,
        private snackbarService: SnackbarService
    ) { }

    ngOnInit(): void {
        this.orderForm = this.fb.group({
            name: [null, [Validators.required, Validators.pattern(GlobalConstants.nameRegex)]],
            email: [null, [Validators.required, Validators.pattern(GlobalConstants.emailRegex)]],
            contactNumber: [null, [Validators.required, Validators.pattern(GlobalConstants.contactNumberRegex)]],
            paymentMethod: [null, [Validators.required]]
        });
        this.getCategories();
    }

    getCategories() {
        this.categoryService.getFilteredCategories().subscribe(
            (response: any) => {
                this.categories = response;
            },
            (error: any) => {
                console.error(error);
                this.snackbarService.openSnackBar(GlobalConstants.genericError, GlobalConstants.error);
            }
        );
    }

    getProductsByCategory(event: any) {
        this.productService.getProductsByCategory(event.value.id).subscribe(
            (response: any) => {
                this.products = response;
                this.selectedProduct = null;
                this.price = 0;
                this.quantity = 1;
                this.totalAmount = 0;
            },
            (error: any) => {
                console.error(error);
                this.snackbarService.openSnackBar(GlobalConstants.genericError, GlobalConstants.error);
            }
        );
    }

    getProductDetails(event: any) {
        this.productService.getProductById(event.value.id).subscribe(
            (response: any) => {
                if (response && response.length > 0) {
                    this.price = response[0].price;
                    this.quantity = 1;
                    this.totalAmount = this.price;
                }
            },
            (error: any) => {
                console.error(error);
                this.snackbarService.openSnackBar(GlobalConstants.genericError, GlobalConstants.error);
            }
        );
    }

    setQuantity(event: any) {
        const qty = parseInt(event.target.value);
        if (qty > 0) {
            this.quantity = qty;
            this.totalAmount = this.price * this.quantity;
        }
    }

    addToOrder() {
        if (!this.selectedProduct || this.quantity < 1) return;

        const item = {
            id: this.selectedProduct.id,
            name: this.selectedProduct.name,
            category: this.selectedCategory.name,
            price: this.price,
            quantity: this.quantity,
            total: this.totalAmount
        };

        this.dataSource = [...this.dataSource, item];

        // Reset selection
        this.selectedProduct = null;
        this.price = 0;
        this.quantity = 1;
        this.totalAmount = 0;
    }

    removeItem(index: number) {
        this.dataSource.splice(index, 1);
        this.dataSource = [...this.dataSource];
    }

    getGrandTotal(): number {
        return this.dataSource.reduce((sum, item) => sum + item.total, 0);
    }

    submitOrder() {
        if (!this.orderForm.valid || this.dataSource.length === 0) return;

        this.ngxService.start();

        const formData = {
            name: this.orderForm.value.name,
            email: this.orderForm.value.email,
            contactNumber: this.orderForm.value.contactNumber,
            paymentMethod: this.orderForm.value.paymentMethod,
            totalAmount: String(this.getGrandTotal()),
            productDetails: JSON.stringify(this.dataSource.map(item => ({
                ...item,
                quantity: String(item.quantity),
                price: item.price,
                total: item.total
            })))
        };

        this.billService.generateReport(formData).subscribe(
            (response: any) => {
                this.ngxService.stop();
                this.downloadBill(response.uuid);
                this.snackbarService.openSnackBar('Bill Generated Successfully', 'success');
                // Reset form
                this.orderForm.reset();
                this.dataSource = [];
                this.selectedCategory = null;
                this.selectedProduct = null;
            },
            (error: any) => {
                this.ngxService.stop();
                console.error(error);
                if (error.error?.message) {
                    this.responseMessage = error.error?.message;
                } else {
                    this.responseMessage = GlobalConstants.genericError;
                }
                this.snackbarService.openSnackBar(this.responseMessage, GlobalConstants.error);
            }
        );
    }

    downloadBill(uuid: string) {
        const data = { uuid: uuid, productDetails: JSON.stringify(this.dataSource) };
        this.billService.getPdf(data).subscribe(
            (response: Blob) => {
                saveAs(response, `Bill-${uuid}.pdf`);
            },
            (error: any) => {
                console.error(error);
            }
        );
    }
}
