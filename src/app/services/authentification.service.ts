import { Role } from './../models/role';
import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { Appointement } from '../models/appointement';
import { Patient } from '../models/patient';
import { Profile } from '../models/profile';
import { Examen } from '../models/examen';
import { Images } from '../models/images';


import { Ordonnance } from '../models/ordonnance';
import { PatientData } from '../models/patient-data';
import { HttpClient } from '@angular/common/http';
import {  map } from 'rxjs/operators';
import { BehaviorSubject,Observable } from 'rxjs';
import { JwtHelperService,JwtModule } from "@auth0/angular-jwt";




@Injectable({
  providedIn: 'root'
})
export class AuthentificationService {

  private currentUserSubject: BehaviorSubject<User>;

  constructor(private httpClient:HttpClient) {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  getConnexion(user:User){
    return this.httpClient.post<User>(`${environment.apiUrl}/api/login_check`,user).
      pipe(map(user => {
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
        return user;
      }));

  }

  getRoles(){
    return this.httpClient.get<Role>(`${environment.apiUrl}/api/roles`);
  }

  getUsers() {
    return this.httpClient.get<User>(`${environment.apiUrl}/api/users`);
  }

  getUserLogin() {
    return this.httpClient.get<User>(`${environment.apiUrl}/api/connect`);
  } 

  // getUserConnect() {
  //   return this.httpClient.get<User>(`${environment.apiUrl}/api/connect`);
  // }

  getProfile() {
    return this.httpClient.get<Profile>(`${environment.apiUrl}/api/profil`);
  }
   

  getProfileById(id):Observable<any>  {
    return this.httpClient.get<Profile>(`${environment.apiUrl}/api/profil/${id}`,id);
   }

  editProfile(id,user:User){
    return this.httpClient.put<User>(`${environment.apiUrl}/api/update/login/${id}`, user);
  }

  uploadImage(image) {
   return this.httpClient.post<Images>(`${environment.apiUrl}/api/profil`, image ,{  
      reportProgress: true,  
      observe: 'events'  
   })
  }

  getImage(id): Observable<Blob> {
    return this.httpClient.get(`${environment.apiUrl}/api/profil/${id}`, {responseType: "blob"});
  }

  addProfile(profile: Profile) {
    return this.httpClient.post<Profile>(`${environment.apiUrl}/api/profil`,profile);
  }

  deleteProfile(profile) {
    return this.httpClient.delete<Profile>(`${environment.apiUrl}/api/profil/${profile}`,profile);
  }

  disUnable(user: User) {
    return this.httpClient.put<User>(`${environment.apiUrl}/api/users/disunable/${user}`, user);
  }

  upDate(id,user: User) {
    return this.httpClient.put<User>(`${environment.apiUrl}/api/users/update/${id}`, user);
  }

  addUser(user: User) {
    return this.httpClient.post<User>(`${environment.apiUrl}/api/users`, user);
  }

  deleteUser(user) {
    return this.httpClient.delete<User>(`${environment.apiUrl}/api/users/${user}`, user);
  }  

  getPatient() {
    return this.httpClient.get<Patient>(`${environment.apiUrl}/api/patient`);
  }
  
  getPatientByMedecin() {
    return this.httpClient.get<Patient>(`${environment.apiUrl}/api/patient/medecin`);
  }
  
  getPatientById(id) {
    return this.httpClient.get<Patient>(`${environment.apiUrl}/api/patient/${id}`);
  }

  getAppointById(id) {
    return this.httpClient.get<Patient>(`${environment.apiUrl}/api/appointement/${id}`);
  }

  addPatient(patient: Patient) {
    return this.httpClient.post<Patient>(`${environment.apiUrl}/api/patient`, patient);
  }

  updatePatient(id,patient: Patient) {
    return this.httpClient.put<Patient>(`${environment.apiUrl}/api/patient/${id}`, patient);
  }

  deletePatient(user) {
    return this.httpClient.delete<Patient>(`${environment.apiUrl}/api/patient/${user}`, user);
  }

  getPatientDataByMedecin() {
   return this.httpClient.get<PatientData>(`${environment.apiUrl}/api/patientdata/medecin`);
  }

  getPatientData() {
    return this.httpClient.get<PatientData>(`${environment.apiUrl}/api/patientdata/data`);
  }

  getPatientDataById(id) {
    return this.httpClient.get<PatientData>(`${environment.apiUrl}/api/patientdata/data/${id}`);
  }

  getAppointByMedecin() {
   return this.httpClient.get<Appointement>(`${environment.apiUrl}/api/appointement/medecin`);
  }
  
  getAppoint() {
    return this.httpClient.get<Appointement>(`${environment.apiUrl}/api/appointement`);
  }
  
  addAppoint(appoint: Appointement) {
    return this.httpClient.post<Appointement>(`${environment.apiUrl}/api/appointement`, appoint);
  }
  
  updateAppointement(id,appoint: Appointement) {
    return this.httpClient.put<Appointement>(`${environment.apiUrl}/api/appointement/${id}`, appoint);
  }
  
  deleteAppointement(appoint) {
    return this.httpClient.delete<Appointement>(`${environment.apiUrl}/api/appointement/${appoint}`, appoint);
  }

  statusAppointement(appoint: Appointement) {
    return this.httpClient.put<Appointement>(`${environment.apiUrl}/api/appointement/status/${appoint}`, appoint);
  }
  
  examinePatient(examen:Examen){
    return this.httpClient.post<Examen>(`${environment.apiUrl}/api/patient/examen`, examen);
  }
  addPatientData(patientData: PatientData) {
    return this.httpClient.post<PatientData>(`${environment.apiUrl}/api/patientdata/data`, patientData);
  }

  getPatientDataByPatientId(id) {
    return this.httpClient.get<PatientData>(`${environment.apiUrl}/api/patient/data/${id}`);
  }

  updateDataPatient(id,patientData: PatientData) {
    return this.httpClient.put<PatientData>(`${environment.apiUrl}/api/patientdata/data/${id}`, patientData);
  }
  
  deleteDataPatient(id) {
    return this.httpClient.delete<PatientData>(`${environment.apiUrl}/api/patientdata/data/${id}`, id);
  }

  getOrdonnance() {
    return this.httpClient.get<Ordonnance>(`${environment.apiUrl}/api/ordonnance`);
  }

  getOrdonnanceByMedecin() {
    return this.httpClient.get<Ordonnance>(`${environment.apiUrl}/api/patientData/ordonnance`);
  }

  getOrdonnanceById(id) {
    return this.httpClient.get<Ordonnance>(`${environment.apiUrl}/api/ordonnance/${id}`);
  }
  
  updateMedicament(id,ordonnance: Ordonnance) {
    return this.httpClient.put<Ordonnance>(`${environment.apiUrl}/api/ordonnance/${id}`, ordonnance);
  }

  getLoggedIn(){

    if(!this.currentUserValue) {
      return false;
    }
    return true;
  }

  logout() {
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);
    }
}
