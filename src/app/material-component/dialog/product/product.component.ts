import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CategoryService } from 'src/app/services/category.service';
import { ProductService } from 'src/app/services/product.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { GlobalConstants } from 'src/app/shared/global-constants';

@Component({
    selector: 'app-product',
    templateUrl: './product.component.html',
    styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {
    onAddProduct = new EventEmitter();
    onEditProduct = new EventEmitter();
    productForm: any = FormGroup;
    dialogAction: string = 'Add';
    action: string = 'Add';
    categories: any[] = [];

    constructor(
        @Inject(MAT_DIALOG_DATA) public dialogData: any,
        private fb: FormBuilder,
        private categoryService: CategoryService,
        private productService: ProductService,
        private snackbarService: SnackbarService,
        public dialogRef: MatDialogRef<ProductComponent>
    ) { }

    ngOnInit(): void {
        this.productForm = this.fb.group({
            name: [null, [Validators.required, Validators.pattern(GlobalConstants.nameRegex)]],
            categoryId: [null, [Validators.required]],
            price: [null, [Validators.required]],
            description: [null, [Validators.required]]
        });

        if (this.dialogData.action === 'Edit') {
            this.dialogAction = 'Edit';
            this.action = 'Update';
            this.productForm.patchValue(this.dialogData.data);
        }

        this.getCategories();
    }

    getCategories() {
        this.categoryService.getCategories().subscribe(
            (response: any) => {
                this.categories = response;
            },
            (error: any) => {
                console.error(error);
                if (error.error?.message) {
                    this.snackbarService.openSnackBar(error.error?.message, GlobalConstants.error);
                } else {
                    this.snackbarService.openSnackBar(GlobalConstants.genericError, GlobalConstants.error);
                }
            }
        );
    }

    onSubmit() {
        if (this.dialogAction === 'Edit') {
            this.editProduct();
        } else {
            this.addProduct();
        }
    }

    addProduct() {
        const formData = this.productForm.value;
        formData.status = 'true';
        this.productService.add(formData).subscribe(
            (response: any) => {
                this.dialogRef.close();
                this.onAddProduct.emit();
                this.snackbarService.openSnackBar('Product Added Successfully', 'success');
            },
            (error: any) => {
                this.dialogRef.close();
                console.error(error);
                if (error.error?.message) {
                    this.snackbarService.openSnackBar(error.error?.message, GlobalConstants.error);
                } else {
                    this.snackbarService.openSnackBar(GlobalConstants.genericError, GlobalConstants.error);
                }
            }
        );
    }

    editProduct() {
        const formData = this.productForm.value;
        formData.id = this.dialogData.data.id;
        this.productService.update(formData).subscribe(
            (response: any) => {
                this.dialogRef.close();
                this.onEditProduct.emit();
                this.snackbarService.openSnackBar('Product Updated Successfully', 'success');
            },
            (error: any) => {
                this.dialogRef.close();
                console.error(error);
                if (error.error?.message) {
                    this.snackbarService.openSnackBar(error.error?.message, GlobalConstants.error);
                } else {
                    this.snackbarService.openSnackBar(GlobalConstants.genericError, GlobalConstants.error);
                }
            }
        );
    }
}
