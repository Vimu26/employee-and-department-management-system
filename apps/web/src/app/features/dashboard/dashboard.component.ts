import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SidenavComponent } from '../../components/sidenav/sidenav.component';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, RouterModule, SidenavComponent],
  standalone: true,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {}
