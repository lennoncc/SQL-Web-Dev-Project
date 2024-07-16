import { Component } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';


@Component({
  selector: 'app-aggrid',
  standalone: true,
  imports: [AgGridAngular],
  // templateUrl: './aggrid.component.html',
  // styleUrl: './aggrid.component.css',
  template: `
  <!-- The AG Grid component -->
  <ag-grid-angular
    [rowData]="rowData"
    [columnDefs]="colDefs"
    class="ag-theme-quartz"
    style="height: 500px;" />
  `,
})
export class AggridComponent {
  // Row Data: Data to be displayed
  rowData = [
    { make: "Toyota", model: "GR Corolla", price: 45000, electric: false},
    { make: "Honda", model: "Prelude", price: 40000, electric: true},
    { make: "Nissan", model: "GTR", price: 100000, electric: false}
  ];
  // Column Definitions: Defines columns to be displayed
  colDefs: ColDef[] = [
    { field: "make" },
    { field: "model" },
    { field: "price" },
    { field: "electric" },
  ];
}
