import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MaterialModule } from './material.module';
import { FooterComponent } from './components/footer/footer.component';

@Component({
  imports: [RouterModule,MaterialModule,FooterComponent],
  standalone:true,
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'web';
}
