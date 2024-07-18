import { Component, Inject } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, GridReadyEvent, CellValueChangedEvent, CellDoubleClickedEvent } from 'ag-grid-community';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import { NgIf } from '@angular/common';
import { DialogModule, Dialog, DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { FormsModule } from '@angular/forms';


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
  imports: [AgGridAngular, NgIf, FormsModule, DialogModule],
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
    (cellDoubleClicked)="onCellDoubleClicked($event)"
  />
  <div *ngIf = "anyChanges">
    <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" (click)="onSubmit()">
      Submit
    </button>
  </div>
  <div *ngIf = "noAddresses">
    <p>No Addresses to submit!</p>
  </div>
  `,
  
})
export class AggridComponent {

  noAddresses = false;
  anyChanges = false;
  addresses = new Map();
  // Load Data onto grid when ready
  constructor(private http: HttpClient, public dialog: Dialog) {}
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
    { field: "AddressLine1" },
    { field: "AddressLine2" },
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
    console.log("Cell Value Changed: ", event.data)
    this.anyChanges = true
    // When cell value changes, store in dictionary with following structure:
    // BusinessEntityID : changed data
    this.addresses.set(event.data.BusinessEntityID, event.data)
  }

  onCellDoubleClicked(event: CellDoubleClickedEvent) {
    console.log("clicked on", event.data)
    const dialogRef = this.dialog.open<string>(CdkDialogAggridComponent, {
      width: '85%',
      data: {
        everything: event.data,
        BusinessEntityID: event.data.BusinessEntityID,
        Title: event.data.Title,
        FirstName: event.data.FirstName,
        MiddleName: event.data.MiddleName,
        LastName: event.data.LastName,
        Suffix: event.data.Suffix,
        JobTitle: event.data.JobTitle,
        PhoneNumber: event.data.PhoneNumber,
        PhoneNumberType: event.data.PhoneNumberType,
        EmailAddress: event.data.EmailAddress,
        EmailPromotion: event.data.EmailPromotion,
        AddressLine1: event.data.AddressLine1,
        AddressLine2: event.data.AddressLine2,
        City: event.data.City,
        StateProvinceName: event.data.StateProvinceName,
        PostalCode: event.data.PostalCode,
        CountryRegionName: event.data.CountryRegionName,
        TerritoryName: event.data.TerritoryName,
        TerritoryGroup: event.data.TerritoryGroup,
        SalesQuota: event.data.SalesQuota,
        SalesYTD: event.data.SalesYTD,
        SalesLastYear: event.data.SalesLastYear,
      },
    });
    dialogRef.closed.subscribe(result => {
      console.log('The dialog was closed');
      console.log(result)
    });
  }

  // Functionality for submit button, loops through map and sends patch request for all cells changed
  onSubmit() {
    console.log("Button pressed!");
    if (this.addresses.size == 0) {
      console.log("Nothing to change!");
      this.noAddresses = true;
    } else {
      this.noAddresses = false;
      this.anyChanges = false;
      for (const [key, value] of this.addresses.entries()) {
        this.http
        .patch(`http://localhost:3333/api/updateaddress/${key}`, 
          {
            "data" : value,
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

    
  }
  

}


@Component({
  selector: 'cdk-dialog-aggrid-component',
  templateUrl: 'cdk-dialog-aggrid-component.html',
  styleUrl: 'cdk-dialog-aggrid-component.css',
  standalone: true,
  imports: [FormsModule, AgGridAngular],
})
export class CdkDialogAggridComponent {
  constructor(
    public dialogRef: DialogRef<string>,
    @Inject(DIALOG_DATA) public data: IRow,
    private http: HttpClient
  ) {}
  newAddress = new Map();
  // Row Data: Data to be displayed
  rowData: IRow[] = [this.data];
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
  onSubmit() {
    console.log("Button pressed!");
    for (const [key, value] of this.newAddress.entries()) {
      this.http
      .patch(`http://localhost:3333/api/updateaddress/${key}`, 
        {
          "data" : value,
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
  OnCellValueChanged(event: CellValueChangedEvent) {
    console.log("Cell Value Changed: ", event.data)
    this.newAddress.set(event.data.BusinessEntityID, event.data)
  }
}