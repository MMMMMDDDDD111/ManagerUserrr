import { Component, Inject, OnInit } from '@angular/core';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import {MatSelectModule} from '@angular/material/select';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import {MatButtonModule} from '@angular/material/button';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { HttpClientModule,HttpClient } from '@angular/common/http';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';


@Component({
  selector: 'app-dialog',
  standalone: true,
  imports: [MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        MatSelectModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatButtonModule,
        ReactiveFormsModule,
        FormsModule,
        HttpClientModule,
  ],

  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.scss'
})
export class DialogComponent implements OnInit {
  userForm!: FormGroup;
  @Inject(MAT_DIALOG_DATA) public editData : any;
  actionBtn : string = "Save"

  constructor(private formBuild: FormBuilder,
     private api: ApiService, 
     public dialogRef : MatDialogRef<DialogComponent>
    ) {}

  ngOnInit(): void {
    this.userForm = this.formBuild.group({
      id: ['', Validators.required],
      userNo: ['', Validators.required],
      fullName: ['', Validators.required],
      hireDate: ['', Validators.required],
      position: ['', Validators.required]
    });
    if(this.editData){
      this.actionBtn = "Update";
      this.userForm.controls['id'].setValue(this.editData.id);
      this.userForm.controls['userNo'].setValue(this.editData.userNo);
      this.userForm.controls['fullName'].setValue(this.editData.fullName);
      this.userForm.controls['hireDate'].setValue(this.editData.hireDate);
      this.userForm.controls['position'].setValue(this.editData.position); 
    }
  }

  addUser() {
    if(!this.editData){
      if (this.userForm.valid) {
        console.log('Form Value:', this.userForm.value);
        this.api.postUserName(this.userForm.value).subscribe({
          next: (res) => {
            alert('User added successfully');
            this.userForm.reset();
            this.dialogRef.close('save');
          },
          error: (err) => {
            console.log(err);
            alert('Error while creating the user');
          }
        });
      }
    }else{
      this.updateUser()
    }
  }
  updateUser(){

  }
}
