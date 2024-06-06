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
  selector: 'app-position',
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
    MatFormFieldModule, MatInputModule, MatDatepickerModule],
  templateUrl: './position.component.html',
  styleUrl: './position.component.scss'
})
export class PositionComponent implements OnInit {
  positionForm!: FormGroup;
  actionBtn: string = "Save";

  constructor(
    private formBuilder: FormBuilder,
    private api: ApiService,
    public dialogRef: MatDialogRef<PositionComponent>
  ) {}

  ngOnInit(): void {
    this.positionForm = this.formBuilder.group({
      positionName: ['', Validators.required],
      userIds: ['', Validators.required]
    });
  }

  addPosition(): void {
    const userIdsArray = this.positionForm.get('userIds')?.value.split(',').map((id: string) => id.trim());

    const positionRequest = {
      positionName: this.positionForm.get('positionName')?.value,
      userIds: userIdsArray
    };

    this.api.addPosition(positionRequest).subscribe({
      next: (response) => {
        console.log('Position added:', response);
        alert('Position added successfully');
        this.dialogRef.close();
      },
      error: (error) => {
        console.error('Error adding position:', error);
        alert('An error occurred while adding the position');
      }
    });
  }
}
