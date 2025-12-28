import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ProductService } from 'src/app/services/product.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { GlobalConstants } from 'src/app/shared/global-constants';
import { ProductComponent } from '../dialog/product/product.component';
import { ConfirmationComponent } from '../dialog/confirmation/confirmation.component';

@Component({
    selector: 'app-manage-product',
    templateUrl: './manage-product.component.html',
    styleUrls: ['./manage-product.component.scss']
})
export class ManageProductComponent implements OnInit {
    displayedColumns: string[] = ['name', 'categoryName', 'description', 'price', 'status', 'edit'];
    dataSource: any;
    responseMessage: string = '';

    constructor(
        private dialog: MatDialog,
        private ngxService: NgxUiLoaderService,
        private productService: ProductService,
        private snackbarService: SnackbarService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.tableData();
    }

    tableData() {
        this.ngxService.start();
        this.productService.getProducts().subscribe(
            (response: any) => {
                this.ngxService.stop();
                this.dataSource = new MatTableDataSource(response);
            },
            (error: any) => {
                this.ngxService.stop();
                console.log(error.error?.message);
                if (error.error?.message) {
                    this.responseMessage = error.error?.message;
                } else {
                    this.responseMessage = GlobalConstants.genericError;
                }
                this.snackbarService.openSnackBar(this.responseMessage, GlobalConstants.error);
            }
        );
    }

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    handleAddAction() {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.data = { action: 'Add' };
        dialogConfig.width = '550px';
        const dialogRef = this.dialog.open(ProductComponent, dialogConfig);
        this.router.events.subscribe(() => {
            dialogRef.close();
        });
        dialogRef.componentInstance.onAddProduct.subscribe((response) => {
            this.tableData();
        });
    }

    handleEditAction(data: any) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.data = { action: 'Edit', data: data };
        dialogConfig.width = '550px';
        const dialogRef = this.dialog.open(ProductComponent, dialogConfig);
        this.router.events.subscribe(() => {
            dialogRef.close();
        });
        dialogRef.componentInstance.onEditProduct.subscribe((response) => {
            this.tableData();
        });
    }

    handleToggleStatus(element: any) {
        const data = {
            id: element.id,
            status: element.status === 'true' ? 'false' : 'true'
        };
        this.productService.updateStatus(data).subscribe(
            (response: any) => {
                this.snackbarService.openSnackBar('Status Updated Successfully', 'success');
                this.tableData();
            },
            (error: any) => {
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

    handleDeleteAction(element: any) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.data = {
            message: 'Are you sure you want to delete this product?',
            confirmation: true
        };
        dialogConfig.width = '400px';
        const dialogRef = this.dialog.open(ConfirmationComponent, dialogConfig);
        dialogRef.componentInstance.onEmitStatusChange.subscribe((response) => {
            this.deleteProduct(element.id);
            dialogRef.close();
        });
    }

    deleteProduct(id: number) {
        this.productService.delete(id).subscribe(
            (response: any) => {
                this.snackbarService.openSnackBar('Product Deleted Successfully', 'success');
                this.tableData();
            },
            (error: any) => {
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
}
