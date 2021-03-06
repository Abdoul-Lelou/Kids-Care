import { filter, map } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { AuthentificationService } from 'src/app/services/authentification.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import 'sweetalert2/src/sweetalert2.scss'; 
import { animate, style, transition, trigger } from '@angular/animations';
import { pipe } from 'rxjs';





@Component({
  selector: 'app-appointement',
  templateUrl: './appointement.component.html',
  styleUrls: ['./appointement.component.scss'],
  animations: [
    trigger('slideOut', [
      transition(':enter', [
        style({transform: 'translateY(+100%)'}),
        animate('1000ms ease-in', style({transform: 'translateY(0%)'}))
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


export class AppointementComponent implements OnInit {

  registerForm: FormGroup; editFormAppointement:FormGroup; patient; medecin; appoint; appointMedecin;
  patients; patientBySecretaire;  add:boolean=false; edit:boolean=false; list:boolean=true; patientHaveAppoint:boolean;
  roleUserLogin;minDate; lastDate;bloc1:boolean=true;bloc2:boolean=false;medecin_id;medecin_nom;statusPatient:boolean;
  medecin_prenom;date: Date;inputStart;inputEnd;errorTime:boolean=false;timeExist:boolean; timeAppointExist:boolean;
  patientHaveAppointEdit:boolean;statusEditPatient: boolean; inputEndEdit;inputStartEdit; patientSelect;
  errorMedecin:boolean; invalidAppoint; validAppoint;appointNotValidLength;appointValidLength;
  appointNotValid; appointValid;appointExpireStatus: boolean;patientSecretaireSelect
   
  Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
  })

  constructor(private auth:AuthentificationService,private router:Router,private formBuilder: FormBuilder) { }
  ngOnInit() {

    
    this.registerForm = this.formBuilder.group({

        id: [''],
        heureFin: ['', [Validators.required]],
        patient: ['', [Validators.required]],
        medecin: ['', [Validators.required]],
        motif: ['', [Validators.required, Validators.minLength(4)]],
        date: ['', [ Validators.required]],
        heureDebut: ['', [ Validators.required]]
    });

    
    
    this.getUser();
    this.getLogin();
    // this.getAppointByMedecin();
    this.add=false;
    this.edit=false;
    this.list=true;
    this.bloc1=true;
    this.bloc2=false;
    this.timeExist=false;
    this.timeAppointExist= false;
    this.patientHaveAppoint=false;
    this.patientHaveAppointEdit=false;
    this.statusPatient= false;
    this.statusEditPatient= false;
    this.appointExpireStatus = true;
    this.errorMedecin=false;
    const day=new Date();
     this.date=new Date();
    this.lastDate=day.getFullYear();
    this.minDate=day.getFullYear() + "-" + ("0"+(day.getMonth()+1)).slice(-2) +"-"+("0" + day.getDate()).slice(-2);

    $(document).ready(function(){

      $('.add').click(function(){
      $(".list").append(
      '<div class="mb-2 row justify-content-between px-3">' +
          '<select class="mob mb-2">' +
              '<option value="opt1">Mon</option>' +
              '<option value="opt1">Tue</option>' +
              '<option value="opt1">Wed</option>' +
              '<option value="opt1">Thu</option>' +
              '<option value="opt2">Fri</option>' +
              '</select>' +
          '<div class="mob">' +
              '<label class="text-grey mr-1">From</label>' +
              '<input class="ml-1" type="time" name="from">' +
              '</div>' +
          '<div class="mob mb-2">' +
              '<label class="text-grey mr-4">To</label>' +
              '<input class="ml-1" type="time" name="to">' +
              '</div>' +
          '<div class="mt-1 cancel fa fa-times text-danger">' +
              '</div>' +
          '</div>');
      });
      
      $(".list").on('click', '.cancel', function(){
      $(this).parent().remove();
      });
      
      });
  
  }
 
 

  
  
  addAppointement() {
    let patient = this.registerForm.value.patient;
    let date = this.registerForm.value.date.split('-').join('/');
    for (const iterator of this.appoint) {     
      if (patient == iterator.patient.id  && date == iterator.date.split('-').join('/') && iterator.isEnabled){
        this.statusPatient= true;
      }
    } 
    if(!!this.statusPatient){
      this.patientHaveAppoint=true;
      this.registerForm.get('patient').patchValue(null);
      setTimeout(()=>{
        this.patientHaveAppoint= false;
        this.ngOnInit();
      }, 5000);
    }else if(!this.statusPatient){
      const appoint = {
        date: date,
        heureDebut: this.registerForm.value.heureDebut,
        heureFin: this.registerForm.value.heureFin,
        motif: this.registerForm.value.motif.replace(/[^a-zA-Z0-9 ]/g, ""),
        medecin: this.registerForm.value.medecin,
        patient: this.registerForm.value.patient,
      };

      this.auth.addAppoint(appoint).subscribe(
        data => {
          this.ngOnInit();
          this.Toast.fire({
            icon:"success",
            title: 'Ajout?? avec succ??s',
          })
          
        },
        error => { 
          this.Toast.fire({
            icon:"error",
            title: ''+error['message'],
          })
        }
      );
    }
  }
  

  updateAppointement() {
  
      let msg = 'Rendez-vous d??j?? r??serv??',infoApi;
      let patient = this.editFormAppointement.value.patient;
      let medecin = this.editFormAppointement.value.medecin;
      let date = this.editFormAppointement.value.date.split('-').join('/');
      let compteur=0;
      
      for (const iterator of this.appoint) { 

        if(patient == iterator.patient.id){
          compteur = compteur+1;
        }
       
       
        if (patient == iterator.patient.id && date == iterator.date.split('-').join('/') && iterator.isEnabled && compteur > 1){
          this.statusEditPatient= true;
        }
      } 

      if(this.statusEditPatient){
        this.patientHaveAppointEdit=true;
        this.editFormAppointement.get('patient').patchValue(null);
        setTimeout(()=>{
          this.patientHaveAppoint= false;
          this.ngOnInit();
        }, 5000);
      }else if(!this.statusEditPatient){
        const appoint = {
          id: this.editFormAppointement.value.id,
          date: this.editFormAppointement.value.date.split('-').join('/'),
          heureDebut: this.editFormAppointement.value.heureDebut,
          motif: this.editFormAppointement.value.motif.replace(/[^a-zA-Z0-9 ]/g, ""),
          heureFin: this.editFormAppointement.value.heureFin,
          patient: this.editFormAppointement.value.patient,
          medecin: this.editFormAppointement.value.medecin,
        };

        this.auth.updateAppointement(appoint.id,appoint).subscribe(
          data => {
            
            infoApi=data['message'];
  
            if(msg == infoApi){
              this.ngOnInit();
              this.Toast.fire({
                icon:"error",
                title: ''+msg,
              })
  
            }else{
              this.ngOnInit();
              this.Toast.fire({
                icon:  "success",
                title: "Modifi?? avec succ??s",
              })
            }
            
          },
          error => {
                  alert(error['message']);          
          }
        );
        }
  }      
  

  getStartTime(event){
  this.inputStart = event.target.value.split(':').join('');
  }


  getEndTime(event){ 
    this.inputEnd = event.target.value.split(':').join('');
  }


  getPatientSelect(event){ 
    this.patientSelect = event.target.value.split(':').join('');
  }


  getStartTimeEdit(event){
    this.inputStartEdit = event.target.value.split(':').join('');
  }
  

  getEndTimeEdit(event){ 
      this.inputEndEdit = event.target.value.split(':').join('');
  }



    
  editForm(appoint) { 
    this.list=false;
    this.add=false
    this.edit=true;
    
      this.editFormAppointement = this.formBuilder.group({
        id: [appoint.id, [Validators.required]],
        heureFin: [appoint.heureFin, [Validators.required]],
        patient: [appoint.patient.id, [Validators.required]],
        medecin: [appoint.medecin.id, [Validators.required]],
        motif: [appoint.motif, [Validators.required, Validators.minLength(4)]],
        date: [appoint.date, [ Validators.required]],
        heureDebut: [appoint.heureDebut, [ Validators.required]]
      });
  } 
   

  getLogin() {
    this.auth.getUserLogin().subscribe(
        data=>{
                this.roleUserLogin=data.role[0];
                this.medecin_id=data.id;
                this.medecin_nom=data.nom;
                this.medecin_prenom=data.prenom;
                if (this.roleUserLogin=='ROLE_MEDECIN') {
                    this.getPatientByMedecin();
                    this.getAppointByMedecin();

                } else {
                  this.getPatient();
                  this.getAppoint();
                }
        }
    ); 
  }   


  getPatientByMedecin() {
   this.auth.getPatientByMedecin().subscribe(
     data =>{
       this.patient =data;
     }
   )
  }
  
  getPatient(){
    return this.auth.getPatient().subscribe(
      data =>{
        this.patientBySecretaire= data;
      }
    )
  }
  
  getAppoint() {
    let date = new Date(),todayDate,appoints;
    todayDate = date.getFullYear()+''+("0"+(date.getMonth()+1)).slice(-2) +""+("0" + date.getDate()).slice(-2);

    this.auth.getAppoint().subscribe(
      data =>{  
        this.appoint =data;
        appoints =data;
        this.appointNotValid=this.appoint.filter(x => !x.isEnabled);
        this.appointValid=this.appoint.filter(x => x.isEnabled);
        this.appointNotValidLength = this.appointNotValid.length;
        this.appointValidLength = this.appointValid.length;
     }
   )
   
  }

 getAppointByMedecin() {
  
    let date = new Date(),todayDate;
    todayDate = date.getFullYear()+''+("0"+(date.getMonth()+1)).slice(-2) +""+("0" + date.getDate()).slice(-2);

    this.auth.getAppointByMedecin().subscribe(
      data =>{  
        this.appoint =data;
        this.appointNotValid=this.appoint.filter(x => !x.isEnabled);
        this.appointValid=this.appoint.filter(x => x.isEnabled);
        this.appointNotValidLength = this.appointNotValid.length;
        this.appointValidLength = this.appointValid.length;
     }
   )
 }  


 getUser() {
  this.auth.getUsers().subscribe(
    data=>{
        this.medecin=data;
    })
 }
  

 getPatientById(id) {
   this.auth.getPatientById(id).subscribe(
     data =>{
        this.patients =data;
     }
   )
 }

  
 deleteAppointement(id) {

    Swal.fire({
      title: 'Voulez-vous supprimer ce patient',
      showCancelButton: true,
      confirmButtonText: `Supprimer`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        
        Swal.fire('Ajoute!', '', 'success')
       }
    })
    Swal.fire({
      title: 'Etez-vous sure?',
      text: "Vous allez supprimer ce rendez-vous",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, Supprimer!'
    }).then((result) => {
      if (result.isConfirmed) {
       
        this.auth.deleteAppointement(id).subscribe(
          data =>{
            this.ngOnInit();
            Swal.fire(
              'Supprim??!',
              'Ce rendez-vous est supprim??',
              'success'
            )
          }
        )
        
      }
    })
    
 }
  

 statusAppointement(status){

    let  errorMessage = 'rendez-vous d??j?? r??serv??',msg,compteur= 0;
  
    for (const iterator of this.appoint) { 

      if(status.patient.id == iterator.patient.id && status.date == iterator.date.split('-').join('/') && !status.isEnabled && iterator.isEnabled){
        compteur = compteur+1;
      }
    } 
  
     
    Swal.fire({
      title: 'Etez-vous sure?',
      text: "Vous allez editer ce rendez-vous",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui!',    
     
    }).then((result) => {
      if(compteur>1){
        Swal.fire(
          'ERREUR!',
          'Ce patient a d??j?? un rendez-vous ?? cette date',
          'error',
          
        )
      } else if (result.isConfirmed ) {
        this.auth.statusAppointement(status.id).subscribe(
          data =>{
              msg= data['message'];
              if(errorMessage == msg ){
                Swal.fire(
                  'ERREUR!',
                  ''+msg,
                  'error'
                )
                this.ngOnInit(); 
              }else if(errorMessage != msg ){
                Swal.fire(
                  'effectu??!',
                  ''+data['message'],
                  'success'
                )
                 
                this.ngOnInit(); 
              }   
      
          }
        )
        
      }
      // else{
      //   Swal.fire(
      //     'ERREUR!',
      //     'Ce patient a d??j?? un rendez-vous ?? cette date',
      //     'error'
      //   )
      //   this.ngOnInit(); 
      // }
    })


 }

 appointVisite(){
  this.appointExpireStatus= true
}

notVisiteAppoint(){
  this.appointExpireStatus= false

}

 addAppointForm(){
    this.list=false;
    this.add=true;
 }

 cancel(){
    this.ngOnInit();
 }


  blockFormEdit(){
    let startTime= this.inputStartEdit;
    let endTime = this.inputEndEdit;
    
    if(endTime-startTime<30){
      this.errorTime=true;
      this.registerForm.get('heureFin').patchValue(null);
          setTimeout(() => {
            this.errorTime=false;
          },3000)
    }else{
      this.bloc1=false;
      this.bloc2=true;
    }
    
  }

  checkAppoint() { 
     
    const date= this.registerForm.value.date.split('-').join('/');
    let heureDebut= this.registerForm.value.heureDebut;
    
    for (const iterator of this.appoint) {
      if (heureDebut == iterator.heureDebut && iterator.date == date ){
        this.timeAppointExist=true;
      }
    }
  }


  blockFormAdd(){
    let startTime= this.inputStart;
    let endTime = this.inputEnd;
    const date= this.registerForm.value.date.split('-').join('/');
    let heureDebut= this.registerForm.value.heureDebut.split(':').join('');
    let medecin= this.registerForm.value.medecin;
    
    


   if (this.roleUserLogin=='ROLE_MEDECIN') {
      for (const iterator of this.appoint) {
        if (heureDebut == iterator.heureDebut.split(':').join('') && iterator.date.split('-').join('/') == date && iterator.isEnabled){
        this.timeAppointExist=true;
        }
      }
      
      if(endTime - startTime < 30 ){
        this.errorTime=true;
        this.registerForm.get('heureFin').patchValue(null);
            setTimeout(() => {
              this.errorTime=false;
            },3000);

    }else{
      if (!!this.timeAppointExist) {
        this.registerForm.get('date').patchValue(null);
        this.timeExist=true;
        setTimeout(() => {
          this.timeExist=false;
          this.ngOnInit();
        },4000);
        return;
      }
      this.bloc1 =false;
      this.bloc2= true;
    }

   }else{
        for (const iterator of this.appoint) {
          if (heureDebut == iterator.heureDebut.split(':').join('')  &&  iterator.date.split('-').join('/') == date  &&  parseInt(medecin) == parseInt(iterator.medecin.id) && iterator.isEnabled){
          this.timeAppointExist=true;
          }
        }

        if(endTime - startTime < 30 ){
          this.errorTime=true;
          this.registerForm.get('heureFin').patchValue(null);
              setTimeout(() => {
                this.errorTime=false;
              },3000);
        }else{
          if (!!this.timeAppointExist) {
             this.registerForm.get('date').patchValue(null);
             this.registerForm.get('medecin').patchValue(null);
            this.timeExist=true;
            setTimeout(() => {
              this.timeExist=false;
              this.ngOnInit();
            },4000);
            return;
          }
          this.bloc1 =false;
          this.bloc2= true;
        }
   }
     
  }

  blocFormEdit(){
    
    let startTimeEdit = parseInt(this.inputStartEdit);
    let endTimeEdit = parseInt(this.inputEndEdit);

    if( endTimeEdit - startTimeEdit <30){
      this.errorTime=true;
      this.registerForm.get('heureFin').patchValue(null);
          setTimeout(() => {
            this.errorTime=false;
          },3000)
    }else{
      this.bloc1=false;
      this.bloc2=true;
    }
    
  }
  
  // blockForm(){
  //   this.bloc1=false;
  //   this.bloc2=true;
  // }

  removeCharactere(string){
    let splitStr= string.replace(/[^a-zA-Z0-9 ]/g, "");
    splitStr= splitStr.split('/').join('');
    return splitStr.charAt(0).toUpperCase() + splitStr.slice(1);
  }

  getCurrentMedecin(){
    this.patientSecretaireSelect= this.patientBySecretaire.filter(x => x.medecin.id == this.registerForm.value.medecin);

    if(this.patientSecretaireSelect.length == 0){
      this.errorMedecin = true;
      setTimeout(()=>{
        this.registerForm.get('medecin').patchValue('null');
        this.errorMedecin= false;
      }, 3000);
    }
  }

}