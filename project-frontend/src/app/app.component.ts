import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { SalespersonsComponent } from './salespersons/salespersons.component';
import { AggridComponent } from './aggrid/aggrid.component';
import { ApiService } from './api.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, SalespersonsComponent, AggridComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'project-frontend';
  salespersons: any;
  constructor(private apiService: ApiService) { };
  ngOnInit(): void {
    this.apiService.getMessage().subscribe(data => {
      this.salespersons = data;
    });
  }
}
