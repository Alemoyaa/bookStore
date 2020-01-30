import { userInterface } from './../../../models/user';
import { AuthService } from './../../../services/auth.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  constructor(private AuthService: AuthService) { } 
  user: userInterface ={
    name: '',
    email: '',
    photoUrl: '',
    roles:{
      
    }
  };
  public providerId: string = 'null';
  ngOnInit() {
    this.AuthService.isAuth().subscribe(user => {
      if(user){
        this.user.name = user.displayName; // Si viene algun usuario lo asignamos manualmente
        this.user.email = user.email;
        this.user.photoUrl = user.photoURL;

        this.providerId = user.providerData[0].providerId; // En la posicion 0 viene el id de donde se creo
      }
    })
  }

}
