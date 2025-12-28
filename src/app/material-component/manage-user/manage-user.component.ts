import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { UserService } from 'src/app/services/user.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { GlobalConstants } from 'src/app/shared/global-constants';

@Component({
    selector: 'app-manage-user',
    templateUrl: './manage-user.component.html',
    styleUrls: ['./manage-user.component.scss']
})
export class ManageUserComponent implements OnInit {
    displayedColumns: string[] = ['name', 'email', 'contactNumber', 'status', 'actions'];
    dataSource: any;
    responseMessage: string = '';

    constructor(
        private ngxService: NgxUiLoaderService,
        private userService: UserService,
        private snackbarService: SnackbarService
    ) { }

    ngOnInit(): void {
        this.tableData();
    }

    tableData() {
        this.ngxService.start();
        this.userService.getUsers().subscribe(
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

    handleToggleStatus(element: any) {
        const data = {
            id: element.id,
            status: element.status === 'true' ? 'false' : 'true'
        };
        this.userService.update(data).subscribe(
            (response: any) => {
                this.snackbarService.openSnackBar('User Status Updated', 'success');
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
