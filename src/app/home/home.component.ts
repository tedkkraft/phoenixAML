import {
  Component,
  ElementRef,
  OnInit,
  ViewChild
} from '@angular/core';
import {AuthService} from '../auth.service';
import {PhoenixapiService} from '../phoenixapi.service';
import { Router } from  '@angular/router';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatProgressSpinnerModule, MatSpinner} from '@angular/material/progress-spinner'
import {HttpClient} from '@angular/common/http';
import {MatTableDataSource} from '@angular/material/table';
import * as d3 from 'd3';
import {jsPDF} from 'jspdf';
import autoTable from 'jspdf-autotable'
import html2canvas from 'html2canvas';
import {AccessorType, ScaleType} from '../utils/types';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {
  txns: any[]
  balance: string
  nTxns: number
  totalRecieved: string
  totalSent: string
  time_received: Date
  displayDate: Date
  dataSource
  displayedColumns: string[] = ['row_number', 'time_received', 'btc', 'type', 'legality'];
  resultsLength = 0;
  isLoading = false;
  clientId: string
  walletAddress: string
  date: number
  uniquePhoenixReportId: string
  legality: string
  isVisible = false;
  tableData;
  errorMessage

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) matSort: MatSort;
  @ViewChild(MatProgressSpinnerModule) spinner: MatProgressSpinnerModule;
  @ViewChild('content') content: ElementRef;

  // Creates a downloadable PDF file of a wallet's transaction history when a user clicks the "Download PDF" button
  public printPDF(): void {
    // Creating a snapshot ('content') of the Account Details region of the Wallet Report
    window.scrollTo(0, 0);
    let content = this.content.nativeElement;
    // Printing 'content' to PDF canvas as PNG file
    html2canvas(content, {
      scale: 2
    }).then(canvas => {
      const FILEURI = canvas.toDataURL('image/png')
      let fileWidth = 208;
      let fileHeight = canvas.height * fileWidth / canvas.width;
      // Creating new PDF file via jsPDF
      let doc = new jsPDF('p', 'mm', 'a4');
      doc.addImage(FILEURI, 'PNG', 0, 10, fileWidth, fileHeight);
      // Creating transaction table headers
      const head = [['Index', 'Date', 'Amount', 'Type', 'Illicit Activity']]
      this.createTableData();
      const data = this.tableData;

      // autoTable is used to create and position the transaction table onto the PDF
      autoTable(doc, {
        startY: 88,
        head: head,
        body: data,
        didDrawPage: (dataArg) => {
          doc.setFontSize(13);
          // doc.text('Transactions', dataArg.settings.margin.left, 76);
        }
   });
      // Naming and downloading the PDF file to the user's browser
      doc.save('BTC Address Report.pdf');

    });
  }

  // Packaging transaction data ('tableData') for use by autoTable to create PDF transactions table
  createTableData(){
    let tableArray = []
    for (let i = 0; i < this.resultsLength; i++) {
    tableArray.push([i+1, this.txns[i].time_received, this.txns[i].btc, this.txns[i].type, this.txns[i].legality]);
    }
    this.tableData = tableArray;
  }

  public formatDate: (date: object) => string = d3.timeFormat("%-b %-d")
  dateAccessor: AccessorType
  temperatureAccessor: AccessorType

  constructor(public authService: AuthService, public phoenixService: PhoenixapiService,
              private router: Router, private _httpClient: HttpClient) {
    this.txns = []
  }

  errorResponse (error: any) {
    if (this.walletAddress.length != 34) {
      this.errorMessage = `Address needs to be 34 character long. Inputed address length: ${ this.walletAddress.length }`;
    }
    else if (error == 400){
      this.errorMessage = "The address entered does not match any address on the blockchain";
    }
    this.isVisible = false;
  }

  ngOnInit() {
    this.dateAccessor = (d) => {
      //console.log("d.time_received", new Date(d.time_received))
      return new Date(d.time_received)
    }
    this.temperatureAccessor = (d) => {
      //console.log("d.satoshis", d.satoshis)
      return d.satoshis/1e8

    }
    //this.getTxns("3G2Njvq7z8ZbctY2Tyw6K7R8G1H5m9WgV4")
    this.clientId = this.authService.current_user

    this.date = Date.now();

  }

  logout(): boolean {
    this.authService.logout();
    this.router.navigate(['/login']);
    return false;
  }

  getTxns(walletAddr) {
    this.errorMessage = null;
    this.isVisible = false;
    this.walletAddress = walletAddr;
    this.isLoading = true;
    console.log('Submit btn clicked');
    console.log('getTxns, isLoading:', this.isLoading);
    this.phoenixService.getTxns(walletAddr).subscribe(
    (data: any[])=>{
      console.log('getTxns resp:', data);
      console.log('getTxns data:', data['status']);
      if (data['status'] == 400) {
        this.errorMessage = "The address entered does not match any address on the blockchain";
      }
      this.txns = [];
      let txn_ct = 0
      let ct = 0
      data['txn_list'].forEach((tx) => {
        let value = 0
        let tx_type =''
        if(tx['total_sent'] < 0) {
          value = tx['total_sent'];
          tx_type = 'Sent';
        }
        if(tx['total_recv'] > 0) {
          value = tx['total_recv'];
          tx_type = 'Received';
        }
        let btcConversion =  value * 0.00000001
        let btcRounded = btcConversion.toFixed(8)
        let tx_date = new Date(tx["t"])
        let formatDate = tx_date.toLocaleTimeString(navigator.language, {year: '2-digit', day: '2-digit', month: '2-digit', hour: '2-digit', minute:'2-digit'});
        let legality = tx['legality']

        this.txns.push({
          "btc": btcRounded,
          "time_received": formatDate,
          "type": tx_type,
          "legality": legality
        })
        console.log('txns pushed; isLoading:', this.isLoading);

      });



      console.log(this.txns);
      this.resultsLength = this.txns.length;
      console.log('this.resultsLength', this.resultsLength);
      this.dataSource = new MatTableDataSource(this.txns);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.matSort;

      this.nTxns = data['raw']['final_n_tx']

      let rawBalance = data['raw']['final_balance']
      let convertedBalance = rawBalance * 0.00000001
      let roundedBalance = convertedBalance.toFixed(8)
      this.balance = roundedBalance

      let rawRecieved = data['raw']['total_received']
      let convertedRecieved = rawRecieved * 0.00000001
      let roundedReceived = convertedRecieved.toFixed(8)
      this.totalRecieved = roundedReceived

      let rawSent = data['raw']['total_sent']
      let convertedSent = rawSent * 0.00000001
      let roundedSent = convertedSent.toFixed(8)
      this.totalSent = roundedSent

      this.uniquePhoenixReportId = uuidv4();
      this.isVisible = true;
      this.isLoading = false;
      console.log(this.txns)
      console.log('end of getTxns; isLoading:', this.isLoading);
    },
     (error: any[])=>{
      console.log('getTxns error: ', error)
      console.log('Input length ', this.walletAddress.length)
      this.errorResponse(error);
      return false;
    })
    //this.updateScales();

  }
}

export function compute(number) {
  if (number < 0)
    return 0;

  return number + 1;
}
