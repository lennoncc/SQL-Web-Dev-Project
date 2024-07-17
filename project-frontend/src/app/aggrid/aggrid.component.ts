import { Component } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, GridReadyEvent, CellValueChangedEvent } from 'ag-grid-community';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';

// Row Data Interface
interface IRow {
  BusinessEntityID: number;
  Title: string;
  FirstName: string;
  MiddleName: string;
  LastName: string;
  Suffix: string;
  JobTitle: string;
  PhoneNumber: number;
  PhoneNumberType: string;
  EmailAddress: string;
  EmailPromotion: number;
  AddressLine1: string;
  AddressLine2: string;
  City: string;
  StateProvinceName: string;
  PostalCode: string;
  CountryRegionName: string;
  TerritoryName: string;
  TerritoryGroup: string;
  SalesQuota: number;
  SalesYTD: number;
  SalesLastYear: number;
}

@Component({
  selector: 'app-aggrid',
  standalone: true,
  imports: [AgGridAngular],
  // templateUrl: './aggrid.component.html',
  // styleUrl: './aggrid.component.css',
  template: `
  <!-- The AG Grid component -->
  <ag-grid-angular
    style="height: 600px; width: 100%"
    [rowData]="rowData"
    [columnDefs]="colDefs"
    class="ag-theme-quartz"
    (gridReady)="onGridReady($event)"
    (cellValueChanged)="OnCellValueChanged($event)"
  />
  `,
})
export class AggridComponent {
  // Load Data onto grid when ready
  constructor(private http: HttpClient) {}
  onGridReady(params: GridReadyEvent) {
    this.http
    .get<any[]>('http://localhost:3333/api/allSalespersons')
    .subscribe(data => this.rowData = data);
  }
  // Row Data: Data to be displayed
  rowData: IRow[] = [];
  // Column Definitions: Defines columns to be displayed
  colDefs: ColDef[] = [
    { field: "BusinessEntityID" },
    { field: "Title" },
    { field: "FirstName" },
    { field: "MiddleName" },
    { field: "LastName" },
    { field: "Suffix" },
    { field: "JobTitle" },
    { field: "PhoneNumber" },
    { field: "PhoneNumberType" },
    { field: "EmailAddress" },
    { field: "EmailPromotion" },
    { field: "AddressLine1",
      editable: true
     },
    { field: "AddressLine2",
      editable: true
     },
    { field: "City" },
    { field: "StateProvinceName" },
    { field: "PostalCode" },
    { field: "CountryRegionName" },
    { field: "TerritoryName" },
    { field: "TerritoryGroup" },
    { field: "SalesQuota" },
    { field: "SalesYTD" },
    { field: "SalesLastYear" },
  ];
  OnCellValueChanged(event: CellValueChangedEvent) {
    console.log("Data after change: ", event.data)
    this.http
    .patch('http://localhost:3333/api/updateaddress', 
      {
        "data" : event.data,
      })
      .subscribe(
        (val) => {
          console.log("PATCH call successful value returned in body", 
            val);
        },
        response => {
          console.log("PATCH call in error", response);
        },
        () => {
          console.log("The PATCH observable is now completed.");
        });
  }
}
