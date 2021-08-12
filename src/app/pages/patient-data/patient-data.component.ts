import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AuthentificationService } from 'src/app/services/authentification.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import 'sweetalert2/src/sweetalert2.scss';
// import pdfMake from 'pdfmake/build/pdfmake';
// import pdfFonts from 'pdfmake/build/vfs_fonts';
// pdfMake.vfs = pdfFonts.pdfMake.vfs;
import { animate, style, transition, trigger } from '@angular/animations';


declare var jsPDF: any;

@Component({
  selector: 'app-patient-data',
  templateUrl: './patient-data.component.html',
  styleUrls: ['./patient-data.component.scss'],
  animations:[
    trigger(
      'inOutAnimation', 
      [
        transition(
          ':enter', 
          [
            style({ height: 0, opacity: 0 }),
            animate('1s ease-out', 
                    style({ height: 300, opacity: 1 }))
          ]
        ),
        // transition(
        //   ':leave', 
        //   [
        //     style({ height: 100, opacity: 1 }),
        //     animate('1s ease-in', 
        //             style({ height: 0, opacity: 0 }))
        //   ]
        // )
      ]
    ),

    trigger('slideInOut', [
      transition(':enter', [
        style({transform: 'translateY(-100%)'}),
        animate('700ms ease-in', style({transform: 'translateY(0%)'}))
      ])
    ])
  ]
})
export class PatientDataComponent implements OnInit {

  registerDataForm: FormGroup;registerDataFormEdit:FormGroup;ordonnanceDataForm: FormGroup;editOrdonnance:boolean; 
  submitted=false;mainContent:boolean=false;showOrdonnance:boolean=false;donnee:boolean=false;infoTaille:boolean;
  patientData;roleUserLogin;patient;user;patientOrdonnance;ordonnance;today;patientName;symptome;constat;infoData;checkData;
  @ViewChild('pdf', { static: false }) pdf: ElementRef;
  quantite;dosage;patientDataIdEdit;idDataPatient;dataInfo;patientDataAll;patientDataMedecin;date;patientDataSecretaire;
  dataInfos:string[]=[];patientAll= new Array();patientMedecin :any=new Array();
  edit:boolean;add:boolean;bloc1:boolean;bloc2:boolean;showMainData:boolean;tailleError:boolean;infoGroupeSanguin:boolean; 

  constructor(private auth:AuthentificationService,private router:Router,private formBuilder: FormBuilder) { }

  ngOnInit()
  {
        this.registerDataForm = this.formBuilder.group({
        id: ['', ],
        groupe: ['', [Validators.required, Validators.minLength(2)]],
        poids: ['', [Validators.required, Validators.minLength(1)]],
        taille: ['', [Validators.required , Validators.minLength(3)]],
        medicament: ['', [Validators.required]],
        dosage: ['', [Validators.required]],
        patient: ['', [Validators.required]],
        quantite: ['', [Validators.required]],
        symptome: ['', [Validators.required]],  
        constat: ['', [ Validators.required]],
    });

    this.today=  new Date().toJSON().slice(0,10).replace(/-/g,'/');
    this.date = new Date();
    this.getUsers();
    this.getLogin();
    this.donnee=false;
    this.showOrdonnance=false; 
    this.mainContent=true;
    this.showMainData=false;
    this.edit=false;
    this.add=false;
    this.bloc1=true;
    this.bloc2=false;
    this.checkData=false
    this.tailleError=false;
    this.infoGroupeSanguin = false;
    this.infoTaille = false;
    this.editOrdonnance = false;

    
   
   
  }

  
  addPatientData() {
    this.submitted = true;
   
    if (this.submitted) {
    
      const dataPatient = { 
       // patient: this.registerDataForm.value.patient,
       // medecin: this.registerDataForm.value.medecin,
        symptome: this.registerDataForm.value.symptome,
        groupe: this.registerDataForm.value.groupe,
        // heure: this.registerDataForm.value.heure,
        // date: this.registerDataForm.value.date,
        constat: this.registerDataForm.value.constat,
        taille: this.registerDataForm.value.taille,
        poids: this.registerDataForm.value.poids,
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

      this.auth.addPatientData(dataPatient).subscribe(
        data => {
          this.ngOnInit(); 
          Toast.fire({
            icon:"success",
            title: 'Ajouté avec succès'
          })                          
        },
        error => {
          alert(error['message']);
          Toast.fire({
            icon:"error",
            title: ''+error['message']
          })            
        }
      );
    }
  }
  
  updateDataPatient() {
   
    let verifGroup:boolean = false, verifTaille: boolean =false;
    let groupe = this.registerDataFormEdit.value.groupe;
    let taille = this.registerDataFormEdit.value.taille;
    let compteurGroupe, groupes = 0;
  
    if (this.roleUserLogin == 'ROLE_MEDECIN') {
      for (const iterator of this.patientDataMedecin)  {
   
        if(this.patientDataIdEdit == iterator.id  && groupe != iterator.groupe){
          verifGroup= true;
          compteurGroupe = iterator.patient.id;
        }else if(this.patientDataIdEdit == iterator.id  && taille < iterator.taille){
          verifTaille = true;
        }
      }

      for (const iterator of this.patientDataMedecin) {
        if(iterator.patient.id == compteurGroupe){
          groupes= groupes+1
        }
      }
    }else if (this.roleUserLogin == 'ROLE_ADMIN') {
      for (const iterator of this.patientDataAll) {
        if(iterator.id == this.patientDataIdEdit && iterator.groupe != groupe){
          verifGroup= true;
          compteurGroupe = iterator.patient.id;
        }else if(iterator.id == this.patientDataIdEdit && iterator.taille > taille){
          verifTaille= true;
        }
      }

      for (const iterator of this.patientDataAll) {
        if(iterator.patient.id == compteurGroupe){
          groupes= groupes+1
        }
      }
    }


  
    if(!!verifGroup && groupes > 1){

      this.registerDataFormEdit.get('groupe').patchValue(null);
      this.infoGroupeSanguin = true;
      setTimeout(()=>{
      this.infoGroupeSanguin = false;
      },3000)
    }else if(!!verifTaille){

      this.infoTaille = true;
      this.registerDataFormEdit.get('taille').patchValue(null);
      setTimeout(()=>{
        this.infoTaille = false;
        },3000);
    }else{

      const dataPatient = {
        id: this.registerDataFormEdit.value.id,
        patient: this.registerDataFormEdit.value.patient,
        medecin: this.registerDataFormEdit.value.medecin,
        symptome: this.registerDataFormEdit.value.symptome,
        groupe: this.registerDataFormEdit.value.groupe,
        heure: this.registerDataFormEdit.value.heure,
        date: this.registerDataFormEdit.value.date,
        constat: this.registerDataFormEdit.value.constat,
        taille: this.registerDataFormEdit.value.taille,
        poids: this.registerDataFormEdit.value.poids,
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
      this.auth.updateDataPatient(dataPatient.id,dataPatient).subscribe(
        data => {
          this.ngOnInit();
         
          Toast.fire({
            icon:"success",
            title: 'Modifié avec succès'
          })                  
        }
      );
    }

      
    
  }

  getPatientDataId(id){
    this.showMainData=false; this.donnee=true;
     this.auth.getPatientDataById(id).subscribe(
       data =>{
        this.dataInfo=data;
        console.log(data)
       }
     )
  } 

  getPatientByMedecin() { 
    let patientFolder;
    this.patientMedecin=[];
    this.auth.getPatientByMedecin().subscribe(
      data =>{
      
         patientFolder =data;
         console.log(patientFolder.filter(x => x.patientData))
         for (const patient of patientFolder) {
           
          if(patient.patientData.length>0){
            this.patientMedecin.push(patient); 
          }
        }
      }
    );
  } 

  getPatientDataAll(){
    this.auth.getPatientData().subscribe(
      data=>{
            this.patientDataAll = data;
          }
      ); 
  }

  getPatientDataMedecin(){
    this.auth.getPatientDataByMedecin().subscribe(
      data=>{
            this.patientDataMedecin = data;
          }
      ); 
  }

  getPatientAll() {   
  
    let patient; this.patientAll=[];
    this.auth.getPatient().subscribe(
      data =>{       
       patient=data;
      
        for (const iterator of patient) {
         if(iterator.patientData.length>0){
           this.patientAll.push(iterator)
         }
        }
      }      
    );
  } 

  getLogin() {
    this.auth.getUserLogin().subscribe(
        data=>{
              this.roleUserLogin=data.role[0];
              if (this.roleUserLogin=='ROLE_MEDECIN') {
                this.getPatientByMedecin();
                this.getPatient();
                this. getPatientDataMedecin();
              }else{
                this.getPatientAll();
                this. getPatientDataAll();
                this.getPatient();
              }
            }
        ); 
  }

  check(id){
    this.checkData=false;
    this.auth.getPatientDataById(id).subscribe(
      data =>{
        if(!data){
          this.checkData=true;
        }
      
      }
    );
  }

  examinePatient() {
    
      const examen = { 
        patient: this.registerDataForm.value.patient,
        symptome: this.registerDataForm.value.symptome,
        groupe: this.registerDataForm.value.groupe,
        taille: this.registerDataForm.value.taille,
        poids: this.registerDataForm.value.poids,
        constat: this.registerDataForm.value.constat,
        medicament: this.registerDataForm.value.medicament,
        dosage: this.registerDataForm.value.dosage,
        quantite: this.registerDataForm.value.quantite,
        date: this.date.getDate()+"/"+this.date.getMonth()+"/"+this.date.getFullYear(),
        heure: this.date.toLocaleTimeString('fr-FR', { hour12: false, 
          hour: "numeric", 
          minute: "numeric"})
      };
      console.log(examen);
      
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
            title: 'Examiné avec succès',
           // imageUrl: '/assets/success.svg'
          })
          this.ngOnInit();
        }, error => {
          Toast.fire({
            icon: 'success',
            title: error['message'],
           
          })
        }
      );
    
  }

  patientDataDetaill(id){
  
    this.auth.getPatientDataById(id).subscribe(
      data =>{
      
        if(!data){
          this.checkData=true;
          return;
        }
        this.checkData=false;

         Swal.fire({  
          html: 
            "<strong class='fs-5'>CONSTAT</strong>"+
            "<div class='col border shadow-none  p-3 mb-5 bg-light rounded flex'>"+
              "<div class='row'>"+
                "<div class='col'><strong></strong> <em>"+data.constat+"</em>&nbsp;&nbsp;</div>"+
              "</div>"+
              
                "</div>",  
           width: '400px',
           background: 'coral',
           padding:'10px'
          //  height: '100px' 
         });
      }
    )
  }

  getPatientDataById(id) { 
    this.showMainData=false;this.donnee=true;this.idDataPatient=id;
    this.auth.getPatientDataById(id).subscribe(
      data =>{
       
        this.idDataPatient=data.patient.id;
        this.patientName= data.patient.prenom+" "+data.patient.nom;
        this.symptome=data.symptome;
        this.constat=data.constat;
      
        this.dataInfo.shift();
        this.infoData= data; 
        this.dataInfo.push(this.infoData);
        
      }
    )
  } 

  editData(user) {  
      this.donnee=false;this.edit=true;
      this.patientDataIdEdit= user.id;
      
      this.registerDataFormEdit = this.formBuilder.group({
        id: [user.id, [Validators.required]],
        patient: [user.medecin, [Validators.required]],
        medecin: [user.prenom, [Validators.required]],
        symptome: [user.symptome, [Validators.required]],  
        temperature: [user.temperature, [Validators.required]],
        heure: [user.heure, [Validators.required]],
        date: [user.date, [Validators.required]],
        taille: [user.taille, [Validators.required]],
        poids: [user.poids, [Validators.required]],
        constat: [user.constat, [Validators.required]],
        groupe: [user.groupe, [Validators.required]]

      });
  } 
   
  getPatient() {
    if(this.roleUserLogin == 'ROLE_MEDECIN'){
      this.auth.getPatientByMedecin().subscribe(
        data =>{
          this.patient =data;
        }
      )
    }else{
      this.auth.getPatient().subscribe(
        data =>{
          this.patient =data;
        }
      )
    } 
  }

  getPatientDataByPatientId(id) { 
    this.auth.getPatientDataByPatientId(id).subscribe(
      data =>{
        this.mainContent=false; 
        this.showMainData=true;
        this.patientData=data;
        console.log(data)
      }
    )
  }
  
  getUsers() { 
       this.auth.getUsers().subscribe(
         data =>{
            this.user =data;            
         }
       );   
  }

  deleteDataPatient(id) {

    
    Swal.fire({
      title: 'Etez-vous sure?',
      text: "Vous allez supprimer ce dossier",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, Supprimer!'
    }).then((result) => {
      if (result.isConfirmed) {
       
        this.auth.deleteDataPatient(id).subscribe(
          data =>{
            this.ngOnInit();
            Swal.fire(
              'Supprimé!',
              ''+data['message'],
              'success'
            )
          }
        )
        
      }
    })
    
  }

  getOrdonnance(id) {
    this.donnee=false;
    this.showOrdonnance=true;
    this.auth.getPatientDataById(id).subscribe(
        data=>{
             this.patientOrdonnance=data;
            }
        ); 
  }

  prints() {  
    var pdf = new jsPDF({
      orientation: 'p', 
      unit: 'mm', 
      format: [312, 292]
    });
    pdf.addHTML(document.getElementById('pdf'),function() {
        pdf.save('ordonnance.pdf');
    });
  }

  updateOrdonnance(){
    console.log(this.ordonnanceDataForm.value.id)
    const id= this.ordonnanceDataForm.value.id;
    const ordonnance = {
      medicament: this.ordonnanceDataForm.value.medicament,
      dosage: this.ordonnanceDataForm.value.dosage,
      quantite: this.ordonnanceDataForm.value.quantite
    }
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

    this.auth.updateMedicament(id,ordonnance).subscribe(
      data =>{
        console.log(data);
        this.ngOnInit();
        Toast.fire({
          icon:"success",
          title: 'Modifié avec succès',
          //imageUrl: 'https://i.imgur.com/4NZ6uLY.jpg'
  
        })       
      },error=>{
        Toast.fire({
          icon:"error",
          title: "Une erreur s'est produit",
          //imageUrl: 'https://i.imgur.com/4NZ6uLY.jpg'
  
        })       
      }
    );

  }

  ordonnanceForm(id,medicament,dosage,quantite){
    this.ordonnanceDataForm = this.formBuilder.group({
      id: [id, [Validators.required]],
      medicament: [medicament, [Validators.required]],
      dosage: [dosage, [Validators.required]],
      quantite: [quantite, [Validators.required]]
  });
    this.showOrdonnance = false;
    this.editOrdonnance = true;
  }
  async updateMedoc(id,medical,quantity,dose){
    console.log(id);
    let medicament; let dosage; let quantite; let quantities=parseInt(quantity);
    const {value: formValues} = await Swal.fire({
      title: 'Medicaments',
      html:
      'Medicament'+
        '<input id="swal-input1" class="swal2-input" placeholder="medicament" value='+medical+'>' +
        'Quantité'+
        '<input id="swal-input2" class="swal2-input" value='+quantities+'>'+
        'Dosage'+
        '<input id="swal-input3" class="swal2-input" placeholder="dosage" value='+dose+'>',
      width: '410px', 
      showCancelButton: true, 
      focusConfirm: true,
      preConfirm: () => {
        return [
        medicament = (<HTMLInputElement>document.getElementById('swal-input1')).value,
        quantite = (<HTMLInputElement>document.getElementById('swal-input2')).value,
        dosage = (<HTMLInputElement>document.getElementById('swal-input3')).value
        ]
      }
    })

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
  const updatemedoc={medicament:medicament,quantite:quantite,dosage:dosage};
 
  
if (!medicament || !quantite || !dosage) 
{ 
  Toast.fire({
    icon:"info",
    title: 'Operation annuler',
    //imageUrl: 'https://i.imgur.com/4NZ6uLY.jpg'

  })   
  return false;
} 

  this.auth.updateMedicament(id,updatemedoc).subscribe(
    data =>{
      console.log(data);
      this.ngOnInit();
      Toast.fire({
        icon:"success",
        title: 'Modifié avec succès',
        //imageUrl: 'https://i.imgur.com/4NZ6uLY.jpg'

      })       
    },error=>{
      Toast.fire({
        icon:"error",
        title: "Une erreur s'est produit",
        //imageUrl: 'https://i.imgur.com/4NZ6uLY.jpg'

      })       
    }
  );
    
    // if (formValues) {
    //  return formValues;
    //   // Swal.fire(JSON.stringify(formValues))
    // }
  }

  removeSpaces(string){
    let splitStr = string.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '');
    splitStr= splitStr.replace(/[^a-zA-Z]+/g, '');
    splitStr= splitStr.split(' ').join('');
    return splitStr;
  }

  removeLetter(string){
    let splitStr = string.replace(/[^0-9,]+/g, '');
    splitStr= splitStr.split(' ').join('');
    return splitStr;
  }

  removeLetterPoids(string){
    let splitStr = string.replace(/[^0-9]+/g, '');
    splitStr= splitStr.split(' ').join('');
    splitStr = string.match(/^(?:[1-9]\d*|0)$/);
   return splitStr;
  }
 
  removeLetterTaille(n){
    var numFloat=n.toString().split(".");
    numFloat= numFloat[0].replace(/[^0-9]+/g, '').replace(/\B(?=(\d{2})+(?!\d))/g, ".") + (numFloat[1] ? "." + numFloat[1] : "");
    if(parseFloat(numFloat)<=0){
      return null
    }else{
      return numFloat;
    }
    
  }

  removeCharactere(string){
    let splitStr= string.replace(/[^a-zA-Z0-9 ]/g, "");
    splitStr= splitStr.split('/').join('');
    return splitStr;
  }

  removeCharactereOrdonnance(string){
    let splitStr= string.replace(/[^a-zA-Z0-9,  ]/g, "");
    splitStr= splitStr.split('/').join('');
    return splitStr;
  }

  cancel(){
    this.ngOnInit();
  }

  cancelMain(){
    this.showOrdonnance=false;
    this.donnee=true;
  }

  cancelMainContent(){
    this.showMainData=false;
    this.mainContent=true;
  }

  blocFormAdd(){

    let verifGroup:boolean, verifTaille: boolean;
    let groupe = this.registerDataForm.value.groupe;
    let taille = this.registerDataForm.value.taille;
    let patient = this.registerDataForm.value.patient;
   
    if (this.roleUserLogin == 'ROLE_MEDECIN') {
      for (const iterator of this.patientDataMedecin)  {
        console.log(iterator);
        if(iterator.patient.id == patient && iterator.groupe != groupe){
          verifGroup= true;
        }else if(iterator.patient.id == patient && iterator.taille > taille){
          verifTaille = true;
        }
      }
    }else{
      for (const iterator of this.patientDataAll) {
        console.log(iterator);
        if(iterator.patient.id == patient && iterator.groupe != groupe){
          verifGroup= true;
        }else if(iterator.patient.id == patient && iterator.taille > taille){
          verifTaille = true;
        }
      }
    }
    
  
    if(!!verifGroup){
      this.registerDataForm.get('groupe').patchValue(null);
      this.infoGroupeSanguin = true;
      setTimeout(()=>{
      this.infoGroupeSanguin = false;
      },4000)
    }else if(!!verifTaille){
      this.infoTaille = true;
      this.registerDataForm.get('taille').patchValue(null);
      setTimeout(()=>{
        this.infoTaille = false;
        },4000);
    }else{
      this.bloc1 = false;
      this.bloc2 = true;
    }
    
  }

  addPatientDataForm(){
    this.mainContent=false;
    this.donnee=false;
    this.add=true;
  }
  
}