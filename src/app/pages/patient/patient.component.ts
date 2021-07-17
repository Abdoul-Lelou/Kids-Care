import { AuthentificationService } from 'src/app/services/authentification.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import 'sweetalert2/src/sweetalert2.scss';
import { animate, style, transition, trigger } from '@angular/animations';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

declare var jquery: any;


@Component({
  selector: 'app-patient',
  templateUrl: './patient.component.html',
  styleUrls: ['./patient.component.scss'],
  animations: [
    trigger('slideIn', [
      transition(':enter', [
        style({transform: 'translateY(-100%)'}),
        animate('800ms ease-in', style({transform: 'translateY(0%)'}))
      ])
    ]),
    trigger('slideOut', [
      transition(':enter', [
        style({transform: 'translateY(+100%)'}),
        animate('1000ms ease-in', style({transform: 'translateY(0%)'}))
      ])
    ])
  ]
})

export class PatientComponent implements OnInit {

  registerForm: FormGroup; examenFormGroupe: FormGroup; registerFormEdit; FormGroup; submitted = false; profile: boolean = false;
  IsmodelShow: boolean = false; alertErrorMedecin: boolean = false; edit: boolean = false; supp: boolean = false;
  patient; $: any; patients; patientProfile: string[] = []; profilerPatient;
  user; display; role_medecin: boolean = true; roles; patientTraite;appointMedecin;appoint;
  login; add: boolean = false; list: boolean = true; medecin; date; consult: boolean = false; checkData: boolean;
  inputSearch: boolean = false; medecin_id; medecin_prenom; medecin_nom;
  closeResult: string; bloc1: boolean = true; bloc2: boolean = false; bloc3: boolean = false; bloc4: boolean = false;
  roleUserLogin: string; patientMedecin; patientDataById;inputTel; patientData
  blocExamen: boolean = false; nom;checkNumber:boolean;timeAppointExist:boolean;timeExist:boolean;isVisite:boolean;
  inputStart;inputEnd;errorTime: boolean;patientIdExamen;infoGroupeSanguin: boolean;infoTaille: boolean;

  constructor(private auth: AuthentificationService, private router: Router, private formBuilder: FormBuilder) { }
  

  ngOnInit() {

    this.registerForm = this.formBuilder.group({
      id: [''],
      sexe: ['', [Validators.required]],
      adresse: ['', [Validators.required, Validators.minLength(3)]],
      prenom: ['', [Validators.required, Validators.minLength(2)]],
      nom: ['', [Validators.required, Validators.minLength(2)]],
      age: ['', [Validators.required, Validators.pattern(/^-?(0|[1-9]\d*)?$/), Validators.minLength(1), Validators.maxLength(3)]],
      tel: ['', [Validators.required, Validators.pattern(/^-?(0|[7]\d*)?$/), Validators.maxLength(9), Validators.minLength(9)]],
      heureFin: ['', [Validators.required]],
      medecin: ['', [Validators.required]],
      motif: ['', [Validators.required, Validators.minLength(4)]],
      date: ['', [Validators.required]],
      heureDebut: ['', [Validators.required]]

    });

     this.examenFormGroupe = this.formBuilder.group({

      groupe: ['',[Validators.required]],
              poids: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(3)]],
              taille: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(4)]],
              heure: ['', [Validators.required]],
              date: ['', [Validators.required]],
              patient: ['', [Validators.required]],
              symptome: ['', [Validators.required]],
              constat: ['', [Validators.required]],
              dosage: ['', [Validators.required]],
              medicament: ['', [Validators.required]],
              quantite: ['', [Validators.required]],
    });
    this.date = new Date();
    $(document).ready(() => {
      setInterval(() => {
      //  $('table').fadeIn();
       //  $('table').fadeOut(); 
      }, 1000);

    });




    this.getPatient();
    this.getLogin();
    this.add = false;
    this.getUser();
    this.list = true;
    this.add = false
    this.edit = false;
    this.blocExamen = false;
    this.consult = false;
    this.bloc1 = true;
    this.bloc2 = false;
    this.bloc3 = false;
    this.bloc4 = false;
    this.profile = false;
    this.alertErrorMedecin = false;
    this.checkNumber = false;
    this.errorTime = false;
    this.timeAppointExist = false;
    this.timeExist = false;
    this.infoGroupeSanguin = false;
    this.infoTaille = false;
    this.isVisite = false;
  }


  addPatient() {
    this.submitted = true;
    
    let startTime= this.registerForm.value.heureDebut.split(':').join('');
    let endTime = this.registerForm.value.heureFin.split(':').join('');
    const date= this.registerForm.value.date.split('-').join('/');
    //let heureDebut= this.registerForm.value.heureDebut.split(':').join('');
    let medecin= this.registerForm.value.medecin;
    
    console.log(this.appoint)
   
    if( parseInt(endTime) - parseInt(startTime) <30 ){
      this.errorTime=true;
      this.registerForm.get('heureFin').patchValue(null);
          setTimeout(() => {
            this.errorTime=false;
          },3000)
          return;
    }else if(this.roleUserLogin =='ROLE_MEDECIN'){
      for (const iterator of this.appointMedecin) {
        console.log( iterator.heureDebut)
        if (startTime == iterator.heureDebut.split(':').join('') && iterator.date.split('-').join('/') == date && iterator.isEnabled){
        this.timeAppointExist=true;
        console.log( "this.timeAppointExist")
        }
      }
      if (!!this.timeAppointExist) {
        this.registerForm.get('date').patchValue(null);
        this.timeExist=true;
        setTimeout(() => {
          this.timeExist=false;
          this.ngOnInit();
          this.list= false;
          this.add=true;
        },4000);
        return;
      }

        const user = {
          nom: this.registerForm.value.nom.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, ''),
          prenom: this.registerForm.value.prenom.replace(/[^a-zA-Z ]/g, ""),
          age: this.registerForm.value.age.replace(/[^0-9]+/g, ''),
          adresse: this.registerForm.value.adresse.replace(/[^a-zA-Z0-9 ]/g, ""),
          tel: this.registerForm.value.tel.replace(/[^0-9]+/g, ''),
          sexe: this.registerForm.value.sexe,
          heureFin: this.registerForm.value.heureFin,
          medecin: this.registerForm.value.medecin,
          // email: ['', [Validators.required, Validators.email]],
          motif: this.registerForm.value.motif.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, ''),
          date: this.registerForm.value.date,
          heureDebut: this.registerForm.value.heureDebut,
        };
        console.log(user);
        const Toast = Swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
          }
        })
  
        this.auth.addPatient(user).subscribe(
          data => {
            Toast.fire({
              icon: 'success',
              title: 'Ajouté avec succès',
              // imageUrl: '/assets/success.svg'
            })
            this.ngOnInit();
          },
          error => {
            alert(error['message']);
          }
        );

    }else{

      for (const iterator of this.appoint) {
          
        console.log(iterator);
        if (startTime == iterator.heureDebut.split(':').join('')  &&  iterator.date.split('-').join('/') == date  &&  parseInt(medecin) == parseInt(iterator.medecin.id) && iterator.isEnabled){
        this.timeAppointExist=true;
        console.log( this.timeAppointExist)
        }
      }

      if (!!this.timeAppointExist) {
        this.registerForm.get('date').patchValue(null);
        this.registerForm.get('medecin').patchValue(null);
        this.timeExist=true;
       setTimeout(() => {
         this.timeExist=false;
         this.ngOnInit();
         this.list= false;
         this.add=true;
       },4000);
       return;
      }
      
      const user = {
        nom: this.registerForm.value.nom.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, ''),
        prenom: this.registerForm.value.prenom.replace(/[^a-zA-Z ]/g, ""),
        age: this.registerForm.value.age.replace(/[^0-9]+/g, ''),
        adresse: this.registerForm.value.adresse.replace(/[^a-zA-Z0-9 ]/g, ""),
        tel: this.registerForm.value.tel.replace(/[^0-9]+/g, ''),
        sexe: this.registerForm.value.sexe,
        heureFin: this.registerForm.value.heureFin,
        medecin: this.registerForm.value.medecin,
        // email: ['', [Validators.required, Validators.email]],
        motif: this.registerForm.value.motif.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, ''),
        date: this.registerForm.value.date,
        heureDebut: this.registerForm.value.heureDebut,
      };
    
      const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer)
          toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
      })

      this.auth.addPatient(user).subscribe(
        data => {
          Toast.fire({
            icon: 'success',
            title: 'Ajouté avec succès',
            // imageUrl: '/assets/success.svg'
          })
          this.ngOnInit();
        },
        error => {
          alert(error['message']);
        }
      );

    }
  }

  updatePatient() {
    this.submitted = true;
   
    if (this.submitted) {
      const user = {
        id: this.registerFormEdit.value.id,
        nom: this.registerFormEdit.value.nom.replace(/[^a-zA-Z ]/g, ""),
        prenom: this.registerFormEdit.value.prenom.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, ''),
        age: this.registerFormEdit.value.age,
        adresse: this.registerFormEdit.value.adresse.replace(/[^a-zA-Z0-9 ]/g, ""),
        tel: this.registerFormEdit.value.tel,
        sexe: this.registerFormEdit.value.sexe,
        medecin: this.registerFormEdit.value.medecin
      };


      const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer)
          toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
      })
      this.auth.updatePatient(user.id, user).subscribe(
        data => {
          this.ngOnInit();
          Toast.fire({
            icon: "success",
            title: 'Modifié avec succès',
            //imageUrl: 'https://i.imgur.com/4NZ6uLY.jpg'

          })

        },
        error => {
          this.alertErrorMedecin = true;
          setTimeout(() => {
            this.alertErrorMedecin = false;
          }, 2000)

        }
      );
    }
  }

  getAppoint() {
    this.auth.getAppoint().subscribe(
      data =>{  
        this.appoint =data;  
      }
    )
  }
 
  getAppointByMedecin() {
   this.auth.getAppointByMedecin().subscribe(
     data =>{  
       this.appointMedecin =data;    
     }
   )
  }

  getPatient() {
    this.auth.getPatient().subscribe(
      data => {
        this.patients = data;
      }
    )
  }

  getPatientByMedecin() {

    this.auth.getPatientByMedecin().subscribe(
      data => {
        this.patientMedecin = data;
      }
    );
  }

  getLogin() {
    this.auth.getUserLogin().subscribe(
      data => {
        this.roleUserLogin = data.role[0];
        this.medecin_id = data.id;
        this.medecin_prenom = data.prenom;
        this.medecin_nom = data.nom;
        if (this.roleUserLogin == 'ROLE_MEDECIN') {
          this.getPatientByMedecin();
          this.getAppointByMedecin();
          this.auth.getPatientDataByMedecin().subscribe(
            data =>{
                this.patientData = data;
            }
          );
        }else{
          this.getAppoint();
          this.auth.getPatientData().subscribe(
            data =>{
               this.patientData=data;
            }
          );
        }
      }
    );
  }

  examenForm(id_Patient) {
    this.list = false;
    this.consult = true;
    this.patientIdExamen= id_Patient;
    let  patient, groupeSanguin, taille;
    if (this.roleUserLogin == 'ROLE_MEDECIN') {
      for (const iterator of this.patientMedecin) {
        if(iterator.id == id_Patient && iterator.isVisit == true){
          for (const data of iterator.patientData) {
            groupeSanguin= data.groupe;
            taille= data.taille; 
            this.isVisite = true;
          }
         
        }
      }

      if(!this.isVisite){
        this.examenFormGroupe = this.formBuilder.group({
  
          groupe: ['', [Validators.required]],
                  poids: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(3)]],
                  taille: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(4)]],
                  heure: ['', [Validators.required]],
                  date: ['', [Validators.required]],
                  patient: [id_Patient, [Validators.required]],
                  symptome: ['', [Validators.required]],
                  constat: ['', [Validators.required]],
                  dosage: ['', [Validators.required]],
                  medicament: ['', [Validators.required]],
                  quantite: ['', [Validators.required]],
    
        });
      }
      this.examenFormGroupe = this.formBuilder.group({
  
        groupe: [groupeSanguin,[Validators.required]],
                poids: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(3)]],
                taille: [taille, [Validators.required, Validators.minLength(3), Validators.maxLength(4)]],
                heure: ['', [Validators.required]],
                date: ['', [Validators.required]],
                patient: [id_Patient, [Validators.required]],
                symptome: ['', [Validators.required]],
                constat: ['', [Validators.required]],
                dosage: ['', [Validators.required]],
                medicament: ['', [Validators.required]],
                quantite: ['', [Validators.required]],
      });
     
    } else {

      for (const iterator of this.patients) {
        if(iterator.id == id_Patient && iterator.isVisit == true){
          for (const data of iterator.patientData) {
            groupeSanguin= data.groupe;
            taille= data.taille; 
            this.isVisite = true;
          }
         
        }
      }
      
      if(!this.isVisite){
        this.examenFormGroupe = this.formBuilder.group({
  
          groupe: ['', [Validators.required]],
                  poids: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(3)]],
                  taille: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(4)]],
                  heure: ['', [Validators.required]],
                  date: ['', [Validators.required]],
                  patient: [id_Patient, [Validators.required]],
                  symptome: ['', [Validators.required]],
                  constat: ['', [Validators.required]],
                  dosage: ['', [Validators.required]],
                  medicament: ['', [Validators.required]],
                  quantite: ['', [Validators.required]],
    
        });
      }
      this.examenFormGroupe = this.formBuilder.group({
  
        groupe: [groupeSanguin,[Validators.required]],
                poids: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(3)]],
                taille: [taille, [Validators.required, Validators.minLength(3), Validators.maxLength(4)]],
                heure: ['', [Validators.required]],
                date: ['', [Validators.required]],
                patient: [id_Patient, [Validators.required]],
                symptome: ['', [Validators.required]],
                constat: ['', [Validators.required]],
                dosage: ['', [Validators.required]],
                medicament: ['', [Validators.required]],
                quantite: ['', [Validators.required]],
      });
     
    }
    

  }

  editForm(user) {
    this.list = false;
    this.add = false
    this.edit = true;

    this.registerFormEdit = this.formBuilder.group({

      id: [user.id, [Validators.required]],
      adresse: [user.adresse, [Validators.required, Validators.minLength(4)]],
      prenom: [user.prenom, [Validators.required, Validators.minLength(3)]],
      nom: [user.nom, [Validators.required, Validators.minLength(2)]],
      age: [user.age, [Validators.pattern(/^-?(0|[1-9]\d*)?$/), Validators.minLength(1), Validators.maxLength(3)]],
      sexe: [user.sexe, [Validators.required]],
      medecin: [user.medecin, [Validators.required]],
      tel: [user.tel, [Validators.pattern(/^-?(0|[7]\d*)?$/), Validators.maxLength(14), Validators.minLength(9)]],

    });
  }

  examinePatient() {

    let taille = this.examenFormGroupe.value.taille.toString().split(".");
    taille= taille[0].replace(/[^0-9]+/g, '').replace(/\B(?=(\d{2})+(?!\d))/g, ".") + (taille[1] ? "." + taille[1] : "");
    
      const examen = {
        patient: this.examenFormGroupe.value.patient,
        symptome: this.examenFormGroupe.value.symptome.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, ''),
        groupe: this.examenFormGroupe.value.groupe,
        taille: taille,
        poids: this.examenFormGroupe.value.poids,
        constat: this.examenFormGroupe.value.constat.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, ''),
        medicament: this.examenFormGroupe.value.medicament.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, ''),
        dosage: this.examenFormGroupe.value.dosage,
        quantite: this.examenFormGroupe.value.quantite.replace(/[^0-9]+/g, ''),
        date: this.date.getDate() + "/" + this.date.getMonth() + "/" + this.date.getFullYear(),
        heure: this.date.toLocaleTimeString('fr-FR', {
          hour12: false,
          hour: "numeric",
          minute: "numeric"
        })
      };
  
      const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer)
          toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
      })

      this.auth.examinePatient(examen).subscribe(
        data => {

          Toast.fire({
            icon: 'success',
            title: 'Examiné avec succès'
            // imageUrl: '/assets/success.svg'
          })
          this.ngOnInit();
        }, error => {
          Toast.fire({
            icon: 'error',
            title: error['message'],

          })
        }
      );
    
  }

  deletePatient(id) {

    Swal.fire({
      title: 'Voulez-vous supprimer ce patient',
      // showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: `Supprimer`,
      //  denyButtonText: `Don't save`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {

        Swal.fire('Ajoute!', '', 'success')
      }// else if (result.isDenied) {
      //   Swal.fire('Changes are not saved', '', 'info')
      // }
    })
    Swal.fire({
      title: 'Etez-vous sure?',
      text: "Vous allez supprimer toute les donnees du patient",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, Supprime!'
    }).then((result) => {
      if (result.isConfirmed) {
        console.log("supp");
        this.auth.deletePatient(id).subscribe(
          data => {
            this.ngOnInit();
            Swal.fire(
              'Supprimé!',
              'Ce patient a été supprimé.',
              'success'
            )
          }
        )

      }
    })

  }

  getUser() {
    this.auth.getUsers().subscribe(
      data => {
        this.medecin = data;
      })
  }

  getPatientDataById(id) {

    this.auth.getPatientDataById(id).subscribe(
      data => {

        this.list = false;
        this.profile = true;
        this.patientProfile.shift();
        this.profilerPatient = data;
        this.patientProfile.push(this.profilerPatient);

      }
    )
  }

  addPatientForm() {
    this.list = false;
    this.add = true;
  }

  cancel() {
    this.ngOnInit();
  }
  
  blockForm() {
    let splitStrAdd= this.registerForm.get('age').value;
    
    if(parseInt(splitStrAdd)>100 || parseInt(splitStrAdd)<=0){
      this.registerForm.get('age').patchValue(' ');
    }else{
      this.bloc1 = false;
      this.bloc2 = true;
    }
  }

  blockFormEdit(){
    let splitStrEdit= this.registerFormEdit.get('age').value;
    
    if(parseInt(splitStrEdit)>100 || parseInt(splitStrEdit)<=0){
      this.registerFormEdit.get('age').patchValue(' ');
    }else{
      this.bloc1 = false;
      this.bloc2 = true;
    }
  }

  blockForm2() {
    this.bloc2 = false;
    this.bloc3 = true;
  }

  getStartTime(event){
    this.inputStart = event.target.value.split(':').join('');
  }

  getEndTime(event){ 
    this.inputEnd = event.target.value.split(':').join('');
  }

  blockForm3() {
    this.bloc3 = false;
    this.bloc4 = true;
  }

  makeExamen() {
    this.list = false;
    this.consult = true;
  }

  blockExamen() {

    let verifGroup:boolean, verifTaille: boolean;
    let groupe = this.examenFormGroupe.value.groupe;
    let taille = this.examenFormGroupe.value.taille;

    for (const iterator of this.patientData) {
      if(iterator.patient.id == this.patientIdExamen && iterator.groupe != groupe){
        verifGroup= true;
      }else if(iterator.patient.id == this.patientIdExamen && iterator.taille > taille){
        verifTaille = true;
      }
    }
  
    if(!!verifGroup){
      this.examenFormGroupe.get('groupe').patchValue(null);
      this.infoGroupeSanguin = true;
      setTimeout(()=>{
      this.infoGroupeSanguin = false;
      },4000)
    }else if(!!verifTaille){
      this.infoTaille = true;
      this.examenFormGroupe.get('taille').patchValue(null);
      setTimeout(()=>{
        this.infoTaille = false;
        },4000);
    }else{
      this.bloc1 = false;
      this.blocExamen = true;
    }
  }

  
  checkTel(){
    let tel,checkTel
    
    return this.auth.getPatient().subscribe(
      data =>{     
        for(var index in data){
          tel = data[index].tel;
          checkTel=this.inputTel;
         
          if(tel == checkTel){
            this.checkNumber=true;
            this.registerForm.get('tel').patchValue(null);
            this.registerFormEdit.get('tel').patchValue(null);
            setTimeout(() => {
              this.checkNumber=false;
            },3000);
            
          }
        }
      }
    )
  }

  chechAge(){
   let splitStr= this.registerForm.get('age').value;
  if(parseInt(splitStr)>100 || parseInt(splitStr)<5){
    return null
  }

 }
 
  getInputTel(event){
    this.inputTel = event.target.value;
  }

  removeSpaces(string){
    let splitStr = string.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '');
    splitStr= splitStr.replace(/[^a-zA-Z]+/g, '');
    splitStr= splitStr.split(' ').join('');
    return splitStr;
  }


  removeLetter(string){
    let splitStr = string.replace(/[^0-9]+/g, '');
    splitStr= splitStr.split(' ').join('');
    return splitStr;
  }


  removeLetterAge(string){
    let splitStr = string.replace(/[^0-9]+/g, '');
    splitStr= splitStr.split(' ').join('');
    
    return splitStr;
  }

  removeLetterPoids(string){
    let splitStr = string.replace(/[^0-9]+/g, '');
    splitStr= splitStr.split(' ').join('');
    splitStr = string.match(/^(?:[1-9]\d*|0)$/);
    if(splitStr <= 0){
      this.examenFormGroupe.get('poids').patchValue(null);
    }
   return splitStr;
  }
 
  removeLetterTaille(event){
    var numFloat=event.toString().split(".");
    numFloat= numFloat[0].replace(/[^0-9]+/g, '').replace(/\B(?=(\d{2})+(?!\d))/g, ".") + (numFloat[1] ? "." + numFloat[1] : "");
    if(parseFloat(numFloat)<=0){
      return null
    }else{
      console.log(numFloat)
      return numFloat;
    }
  }

  removeSpacesTel(string){
    let splitStr = string.replace(/[^0-9]+/g, '');
    splitStr= splitStr.split(' ').join('');
    this.inputTel =splitStr;
    return splitStr;
  }

  removeCharactere(string){
    let splitStr= string.replace(/[^a-zA-Z0-9 ]/g, "");
    splitStr= splitStr.split('/').join('');
    return splitStr;
  }

  removeCharAndNumber(string){
    let splitStr= string.replace(/[^a-zA-Z ]/g, "");
    splitStr= splitStr.split('/').join('');
    return splitStr;
  }
}
