import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../material.module';

@Component({
  selector: 'app-launchpad',
  imports: [CommonModule, MaterialModule],
  standalone: true,
  templateUrl: './launchpad.component.html',
  styleUrl: './launchpad.component.scss',
})
export class LaunchpadComponent implements OnInit {
  name = '';

  ngOnInit(): void {
    const userData = localStorage.getItem('user')
      ? JSON.parse(localStorage.getItem('user')!)
      : null;
    if (userData) {
      this.name = userData?.name?.first_name + ' ' + userData?.name?.last_name;
    }
  }
}
