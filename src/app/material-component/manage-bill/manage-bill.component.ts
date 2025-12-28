import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { BillService } from 'src/app/services/bill.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { GlobalConstants } from 'src/app/shared/global-constants';
import { ViewBillProductsComponent } from '../dialog/view-bill-products/view-bill-products.component';
import { ConfirmationComponent } from '../dialog/confirmation/confirmation.component';
import { saveAs } from 'file-saver';
import { jwtDecode } from 'jwt-decode';

@Component({
    selector: 'app-manage-bill',
    templateUrl: './manage-bill.component.html',
    styleUrls: ['./manage-bill.component.scss']
})
export class ManageBillComponent implements OnInit {
    displayedColumns: string[] = ['name', 'email', 'contactNumber', 'paymentMethod', 'total', 'actions'];
    dataSource: any;
    responseMessage: string = '';
    isAdmin: boolean = false;

    constructor(
        private dialog: MatDialog,
        private ngxService: NgxUiLoaderService,
        private billService: BillService,
        private snackbarService: SnackbarService
    ) { }

    ngOnInit(): void {
        this.checkRole();
        this.tableData();
    }

    checkRole() {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const tokenPayload: any = jwtDecode(token);
                this.isAdmin = tokenPayload.role === 'admin';
            } catch (error) {
                console.error('Error decoding token:', error);
            }
        }
    }

    tableData() {
        this.ngxService.start();
        this.billService.getBills().subscribe(
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

    viewBillProducts(data: any) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.data = {
            data: data
        };
        dialogConfig.width = '600px';
        this.dialog.open(ViewBillProductsComponent, dialogConfig);
    }

    downloadBill(element: any) {
        this.ngxService.start();
        const data = { uuid: element.uuid, productDetails: element.productDetail };
        this.billService.getPdf(data).subscribe(
            (response: Blob) => {
                this.ngxService.stop();
                saveAs(response, `Bill-${element.uuid}.pdf`);
                this.snackbarService.openSnackBar('Bill Downloaded', 'success');
            },
            (error: any) => {
                this.ngxService.stop();
                console.error(error);
                this.snackbarService.openSnackBar(GlobalConstants.genericError, GlobalConstants.error);
            }
        );
    }

    handleDeleteAction(element: any) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.data = {
            message: 'Are you sure you want to delete this bill?',
            confirmation: true
        };
        dialogConfig.width = '400px';
        const dialogRef = this.dialog.open(ConfirmationComponent, dialogConfig);
        dialogRef.componentInstance.onEmitStatusChange.subscribe((response) => {
            this.deleteBill(element.id);
            dialogRef.close();
        });
    }

    deleteBill(id: number) {
        this.billService.delete(id).subscribe(
            (response: any) => {
                this.snackbarService.openSnackBar('Bill Deleted Successfully', 'success');
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
