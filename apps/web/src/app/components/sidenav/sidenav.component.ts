import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../material.module';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { FileService } from '../../common/services/files.service';

@Component({
  selector: 'app-sidenav',
  imports: [CommonModule, MaterialModule, RouterModule],
  standalone: true,
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.scss',
})
export class SidenavComponent implements OnInit {
  isCollapsed = false;
  selectedRoute = 'Launchpad';
  profilePic: string | null = null;

  constructor(private router: Router, private fileService : FileService) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.setSelectedRoute(this.getRouteName(event.urlAfterRedirects));
      }
    });
  }

  ngOnInit(): void {
    const userData =localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!) : null;
    console.log(userData)
    if (userData) {
      const fileName  = userData?.profile_pic
      this.profilePic =this.fileService.generateFileUrlByFileName(fileName)
      console.log(this.profilePic)
    }
  }

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }

  setSelectedRoute(route: string) {
    this.selectedRoute = route;
  }

  getRouteName(url: string): string {
    const pathSegments = url.split('/').filter((segment) => segment);
    if (pathSegments.length > 1 && pathSegments[0] === 'app') {
      return this.capitalizeFirstLetter(pathSegments[1]);
    }
    return 'Dashboard';
  }

  capitalizeFirstLetter(text: string): string {
    return text.charAt(0).toUpperCase() + text.slice(1);
  }
}
