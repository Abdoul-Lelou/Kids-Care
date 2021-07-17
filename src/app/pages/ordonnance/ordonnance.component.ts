import { Component, OnInit ,ViewChild, ElementRef} from '@angular/core';
import { AuthentificationService } from './../../services/authentification.service';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { animate, style, transition, trigger } from '@angular/animations';
declare var jsPDF: any;


@Component({
  selector: 'app-ordonnance',
  templateUrl: './ordonnance.component.html',
  styleUrls: ['./ordonnance.component.scss'],
  animations: [
    trigger('slideOut', [
      transition(':enter', [
        style({transform: 'translateY(+100%)'}),
        animate('800ms ease-in', style({transform: 'translateY(0%)'}))
      ])
    ]),
    trigger('slideIn', [
      transition(':enter', [
        style({transform: 'translateY(-100%)'}),
        animate('800ms ease-in', style({transform: 'translateY(0%)'}))
      ])
    ])
  ]
})
export class OrdonnanceComponent implements OnInit {
 ordonnanceMedecin;
 today;
 myStyle: SafeHtml;
 @ViewChild('pdf', { static: false }) pdf: ElementRef;
  roleUserLogin: string;
  ordonnances;

  constructor(private auth: AuthentificationService, private _sanitizer: DomSanitizer) { }
  // ngAfterViewInit () {}

  ngOnInit() {

     this.getLogin();
     this.today=  new Date().toJSON().slice(0,10).replace(/-/g,'/');
     
    }
  
  // prints() {  

  //     var pdf = new jsPDF({
  //       orientation: 'p', 
  //       unit: 'mm', 
  //       format: [312, 392]
  // });
  //     pdf.addHTML(document.getElementById('pdf'),function() {
  //         pdf.save('ordonnance.pdf');
  //     });
  // }

  prints() {  
    var pdf = new jsPDF({
      orientation: 'p', 
      unit: 'mm', 
      format: [330, 292]
});
    pdf.addHTML(document.getElementById('pdf'),function() {
        pdf.save('ordonnance.pdf');
    });
  }

  getOrdonnance() {
    this.auth.getOrdonnanceByMedecin().subscribe(
        data=>{
             this.ordonnanceMedecin=data;
            }
        ); 
  }
  
  getAllOrdonnance() {
    this.auth.getPatientData().subscribe(
        data=>{
             this.ordonnances=data;
            }
        ); 
  } 
  
  getLogin() {
    this.auth.getUserLogin().subscribe(
        data=>{
              this.roleUserLogin=data.role[0];
              if (this.roleUserLogin =="ROLE_MEDECIN") {
                this.getOrdonnance();
              } else if(this.roleUserLogin =="ROLE_ADMIN") {
                this.getAllOrdonnance();
              }
            }
        ); 
  }
}