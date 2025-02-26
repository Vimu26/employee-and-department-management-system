import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-launchpad',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './launchpad.component.html',
  styleUrl: './launchpad.component.scss',
})
export class LaunchpadComponent {}
