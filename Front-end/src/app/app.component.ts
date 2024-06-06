import { Component, OnInit, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import {MatDialogModule} from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatPaginator} from '@angular/material/paginator';
import { MatPaginatorModule } from '@angular/material/paginator';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogTitle,
  MatDialogContent,
} from '@angular/material/dialog';
import { DialogComponent } from './dialog/dialog.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ApiService } from './services/api.service';
import { LoginComponent } from './login/login.component';
import { Router } from '@angular/router';
import { PositionComponent } from './position/position.component';
import { Position, Users } from './interfaces/userModel';
import { CookieService } from 'ngx-cookie-service';
import { ButtonModule } from 'primeng/button';
import { PanelMenuModule } from 'primeng/panelmenu';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { MenuItem } from 'primeng/api';
import { MenuModule } from 'primeng/menu';




@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet, 
    CommonModule, 
    MatIconModule, 
    MatToolbarModule, 
    MatButtonModule, 
    MatDialogModule, 
    MatFormFieldModule, 
    MatInputModule,
    ReactiveFormsModule,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
    MatIconModule,
    ButtonModule,
    PanelMenuModule,
    TieredMenuModule,
    MenuModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  
})
export class AppComponent implements OnInit{
[x: string]: any;
  title = 'Front-end';
  isLoggedIn: boolean = false;
  user$ = this.api.user$;
  
  loginItems: MenuItem[] = [
    {
        label: 'Login',
        icon: 'pi pi-sign-in',
        command: () => {
            this.openDialogLogin();
        }
    }
];

items: MenuItem[] = [
    {
                label: 'Profile',
                icon: 'pi pi-plus',
                items: [
                  {
                      label: 'Setting',
                      icon: 'pi pi-search',
                      command: () => {
                          this.navigateToSettings();
                      }
                  },
                  {
                      label: 'Logout',
                      icon: 'pi pi-print',
                      command: () => {
                          this.logout();
              
                      }
                  }
                ]
            },
        ]


  navigateToProfile() {
    this.router.navigate(['/profile']);
  }

  navigateToSettings() {

  }


  displayedColumns: string[] = ['id', 'userNo', 'fullName', 'hireDate','positionName','action'];
  dataSource = new MatTableDataSource<Users>();
  positions: Position[] = [];
  users: Users[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private dialog : MatDialog, 
    private api : ApiService,
    private router: Router,
    private cookieService: CookieService
  ){
    this.api.user$.subscribe(user => {
      this.isLoggedIn = !!user;
    });
  }

  ngOnInit(): void {
    this.getAllUsers();
    this.checkLoginStatus();
    this.getAllPositions();
   
}

  //CHECK LOGIN STATUS 
  checkLoginStatus(): void {
    const token = this.cookieService.get('authToken')
    this.isLoggedIn = !!token;
  }

  //LOGOUT
  logout() {
    this.cookieService.delete('authToken');
    
    this.isLoggedIn = false;
  
    this.router.navigate(['login']);
  }

  //OPEN DIALOG
  openDialog() {
    this.dialog.open(DialogComponent, {
      width: '30%'
    }).afterClosed().subscribe(val => {
      if (val === 'save') {
        this.getAllUsers();
      }
    });
  }

  //OPEN DIALOG POSITION
  openDialogPosition(position?: any): void {
    const dialogRef = this.dialog.open(PositionComponent, {
      width: '400px',
      data: position ? position : null
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'save' || result === 'update') {
        this.getAllPositions(); 
      }
    });
  }

  //GET ALL POSITION
  getAllPositions(): void {
    this.api.getAllPositions().subscribe({
      next: (positions: Position[]) => {
        this.positions = positions;
        console.log('Positions received:', positions);
      },
      error: (err) => {
        console.error('Error fetching positions:', err);
      }
    });
  }
  
  //OPEN DIALOG LOGIN
  openDialogLogin() {
    this.dialog.open(LoginComponent, {
      width: '50%'
    }).afterClosed().subscribe(() => {
      this.checkLoginStatus();
    });
  }

  //GET ALL USERS
  getAllUsers(): void {
    this.api.getUsers().subscribe({
      next: (users: Users[]) => {
        this.dataSource.data = users;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: (err) => {
        console.error('Error fetching users:', err);
        alert("User needs to login!!!");
      }
    });
  }

  //UPDATE USER
  editUser(row : any){
    this.dialog.open(DialogComponent,{
      width: '30%',
      data: row
    }).afterClosed().subscribe(val=>{
      if(val === 'update'){
        this.getAllUsers();
        this.editUser(val);
      }
    })
  }

  //DELETE USER BY ID 
  deleteUser(user: Users): void {
    if (user && user.id) {
      this.api.deleteUser(user.id).subscribe(
        response => {
          console.log('Delete user:', response);
          this.getAllUsers(); 
        },
        error => {
          console.error('Error deleting user:', error);
        }
      );
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}



