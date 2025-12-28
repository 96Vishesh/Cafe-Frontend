import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CategoryService } from 'src/app/services/category.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { GlobalConstants } from 'src/app/shared/global-constants';

@Component({
    selector: 'app-category',
    templateUrl: './category.component.html',
    styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {
    onAddCategory = new EventEmitter();
    onEditCategory = new EventEmitter();
    categoryForm: any = FormGroup;
    dialogAction: string = 'Add';
    action: string = 'Add';

    constructor(
        @Inject(MAT_DIALOG_DATA) public dialogData: any,
        private fb: FormBuilder,
        private categoryService: CategoryService,
        private snackbarService: SnackbarService,
        public dialogRef: MatDialogRef<CategoryComponent>
    ) { }

    ngOnInit(): void {
        this.categoryForm = this.fb.group({
            name: [null, [Validators.required]]
        });

        if (this.dialogData.action === 'Edit') {
            this.dialogAction = 'Edit';
            this.action = 'Update';
            this.categoryForm.patchValue({ name: this.dialogData.data.name });
        }
    }

    onSubmit() {
        if (this.dialogAction === 'Edit') {
            this.editCategory();
        } else {
            this.addCategory();
        }
    }

    addCategory() {
        const formData = { name: this.categoryForm.value.name };
        this.categoryService.add(formData).subscribe(
            (response: any) => {
                this.dialogRef.close();
                this.onAddCategory.emit();
                this.snackbarService.openSnackBar('Category Added Successfully', 'success');
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

    editCategory() {
        const formData = {
            id: this.dialogData.data.id,
            name: this.categoryForm.value.name
        };
        this.categoryService.update(formData).subscribe(
            (response: any) => {
                this.dialogRef.close();
                this.onEditCategory.emit();
                this.snackbarService.openSnackBar('Category Updated Successfully', 'success');
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
