import { Component, OnInit, SecurityContext } from '@angular/core';
import { AuthentificationService } from './../../services/authentification.service';
import { DomSanitizer,SafeResourceUrl,SafeUrl } from '@angular/platform-browser';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-accueil',
  templateUrl: './accueil.component.html',
  styleUrls: ['./accueil.component.scss'],
  animations:[
    trigger('slideOut', [
      transition(':enter', [
        style({transform: 'translateY(+100%)'}),
        animate('800ms ease-in', style({transform: 'translateY(0%)'}))
      ])
    ])
  ]

})
export class AccueilComponent implements OnInit {


nom; prenom; sexe; specialite; role; user; compteurFeminin=0; compteurMasculin=0;patients;nombrePatient;
patient;nombreAppoint; appoint; appoints;nombrePatientData;dossier;dossiers;nombreMedecin;nombreOrdonnance; 
images; idProfile;imageDefaut: boolean;

  constructor(private auth: AuthentificationService ,private domSanitizer: DomSanitizer) { }
    
  ngOnInit() 
  {    
    this.getLogin();
    this.getUser();
    this.getOrdonnance();
    this.imageDefaut = false;
  }  
  
  
  
  getLogin() {
    let profile;
    this.auth.getUserLogin().subscribe(
        data=>{
          profile= data;
       //   this.idProfile = profile.profil.id;
         
            this.prenom =data.prenom;
            this.nom =data.nom;
            this.sexe=data.sexe;
            this.role=data.role[0];
            this.specialite=data.specialite;
            this.imageDefaut = true;
            if (this.role=='ROLE_ADMIN' || this.role=='ROLE_SECRETAIRE') {
              this.getPatients();
              this.getAppointement();
              this.getPatientData();
              if(profile.profil !== null){
                this.getProfile(profile.profil.id)
                this.imageDefaut = false;
              }
            }else if (this.role=='ROLE_MEDECIN'){
              this.getPatientByMedecin();
              this.getAppointementByMedecin();
              this.getPatientDataByMedecin();
              this.getPatientData();
              if(profile.profil !== null){
                this.getProfile(profile.profil.id)
                this.imageDefaut = false;
              //  this.idProfile = profile.profil.id;
              }
            }
          }
        ); 
  }


      getUser() { 
        let users,compteur=0;
        this.auth.getUsers().subscribe(
          data =>{
            users =data; 
            this.user= data; 
            for (const iterator of this.user) {if (iterator.role[0] != 'ROLE_ADMIN' ) {compteur+=+1;}}  
            this.nombreMedecin=compteur;  
          }
        )
      }

      getPatientByMedecin() { 
        let patient;
       this.auth.getPatientByMedecin().subscribe(
         data =>{
           patient=data;
           this.patients =patient;
           this.nombrePatient= this.patients.length;     
         }
       )
     }

     getPatients() { 
      let patient;
     this.auth.getPatient().subscribe(
       data =>{
         patient=data;
         this.patient =patient;
         this.nombrePatient= this.patient.length;
         
       }
     )
    }
    getAppointementByMedecin() { 
      let appoint;
     this.auth.getAppointByMedecin().subscribe(
       data =>{
        appoint=data;
         this.appoints =appoint;
         this.nombreAppoint= this.appoints.length;
       }
     )
    }

    getAppointement() { 
    let appoints;
    this.auth.getAppoint().subscribe(
     data =>{
      appoints=data;
       this.appoint =appoints;
       this.nombreAppoint= this.appoint.length;
     }
    )
    }

    getPatientDataByMedecin() { 
      let dossier;
     this.auth.getPatientDataByMedecin().subscribe(
       data =>{
        dossier=data;
         this.dossiers =dossier;
         this.nombrePatientData= dossier.length;
       }
     )
    }

    getPatientData() { 
      let dossiers;
     this.auth.getPatientData().subscribe(
       data =>{
        dossiers=data;
         this.dossier =dossiers;
         this.nombrePatientData= dossiers.length;
       }
     )
    }

    getOrdonnance() { 
     let ordon,compteur=0;
     this.auth.getPatientDataByMedecin().subscribe(
       data =>{
        ordon=data;
        for (const iterator of ordon) {
          compteur=compteur+1;
        }
        this.nombreOrdonnance = compteur;
       }
     )
    }
    
    getProfile(id){
      let images;
       return this.auth.getImage(id).subscribe(
         data =>{
           images= window.URL.createObjectURL(data);   
           this.images = this.domSanitizer.bypassSecurityTrustUrl(images);
         }
       )
    }

}
