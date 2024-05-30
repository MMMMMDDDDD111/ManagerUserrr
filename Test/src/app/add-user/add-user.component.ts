import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../services/user.service';


@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent implements OnInit {
  addUserForm: FormGroup;

  constructor(private fb: FormBuilder, private userService: UserService) {
    this.addUserForm = this.fb.group({
      id:['',[Validators.required]],
      userNo: ['', [Validators.required]],
      fullName: ['', [Validators.required]],
      hireDate: ['', [Validators.required]],
      positionName: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.addUserForm.valid) {
      this.userService.addUser(this.addUserForm.value).subscribe((response: any) => {
        console.log('User added successfully', response);
      }, (error: any) => {
        console.error('Error adding user', error);
      });
    }
  }
}
