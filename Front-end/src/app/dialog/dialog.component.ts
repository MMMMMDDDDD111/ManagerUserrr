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
        MatFormFieldModule, MatInputModule, MatDatepickerModule
  ],

  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.scss'
})
export class DialogComponent implements OnInit {
  userForm!: FormGroup;

  actionBtn : string = "Save"

  constructor(private formBuild: FormBuilder,
     private api: ApiService, 
     public dialogRef : MatDialogRef<DialogComponent>,
     @Inject(MAT_DIALOG_DATA) public editData : any,
    ) {}

  ngOnInit(): void {
    this.userForm = this.formBuild.group({
      id: ['', Validators.required],
      userNo: ['', Validators.required],
      fullName: ['', Validators.required],
      hireDate: ['', Validators.required],
      positionName: ['', Validators.required]
    });
    if(this.editData){
      this.actionBtn = "Update";
      this.userForm.controls['id'].setValue(this.editData.id);
      this.userForm.controls['userNo'].setValue(this.editData.userNo);
      this.userForm.controls['fullName'].setValue(this.editData.fullName);
      this.userForm.controls['hireDate'].setValue(this.editData.hireDate);
      this.userForm.controls['positionName'].setValue(this.editData.position.positionName);
    }
  }

  addUser() {
    if (!this.editData) {
      if (this.userForm.valid) {
        const userNo = this.userForm.get('userNo')?.value;
        const userRequest = {
          ...this.userForm.value,
          position: {
            positionName: this.userForm.get('positionName')?.value
          }
        };
        this.api.postUserName(userRequest).subscribe({
          next: (res) => {
            alert(`User with User No ${userNo} already exists`);
            alert('User added successfully');
            this.userForm.reset();
            this.dialogRef.close('save');
          },
          error: (err) => {
            console.error('Error while creating the user:', err);
            if (err.status === 401) {
              alert('Authentication error. Please log in again.');
            } else {
              alert('Error while creating the user: ' + (err.message || err));
            }
          }
        });
      }
    } else {
      this.updateUser();
    }
  }
  
  updateUser(){
    this.api.putUser(this.userForm.value,this.editData.id)
    .subscribe({
      next:(res)=>{
        alert("User update successfully")
        this.userForm.reset();
        this.dialogRef.close("update");
      },
      error:(err)=>{
        alert("Error while update" + err)
      }
    })
  }
}
