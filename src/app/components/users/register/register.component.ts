import { AngularFireStorage } from '@angular/fire/storage';
import { Router } from '@angular/router';
import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { finalize } from 'rxjs/operators';
import { Observable } from 'rxjs/internal/Observable';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  constructor(
    private router: Router,
    private authService: AuthService,
    private storage: AngularFireStorage
  ) {}

  @ViewChild('imageUser', {static: true}) inputImageUser: ElementRef;
  // View child permite obtener las instancias de elementos nativos, directivas y componentes que esten en el template del mismo

  public email = '';
  public password = '';

  uploadPercent: Observable<number>;
  urlImage: Observable<string>;

  ngOnInit() {}

  onUpload(e) {
    // e es un evento el cual ocurre al subir una imagen
    // console.log('subir', e.target.files[0]); // Target es la imagen que se subio
    const id = Math.random()
      .toString(36)
      .substring(2);
    const file = e.target.files[0];
    const filePath = `uploads/profile_${id}`; // esto dberia generar un nombre aleatorio para cada imagen subida
    const ref = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, file); // Subimos el fichero con su ruta

    this.uploadPercent = task.percentageChanges(); // Porcentaje de carga del fichero
    task
      .snapshotChanges()
      .pipe(finalize(() => (this.urlImage = ref.getDownloadURL())))
      .subscribe(); // Recuperamos la url
  }

  onAddUser() {
    this.authService
      .registerUser(this.email, this.password)
      .then(res => {
        this.authService.isAuth().subscribe(user => {
          if (user) {
            user
              .updateProfile({
                displayName: 'pepito',
                photoURL: this.inputImageUser.nativeElement.value // Recuperamos la url de la imagen para hacer un update
              })
              .then(() => {
                this.router.navigate(['admin/list-books']);
              })
              .catch(err => {
                console.log('error', err.message);
              });
          }
        });
      })
      .catch(err => console.log('err', err.message));
  }

  onLoginGoogle(): void {
    this.authService
      .loginGoogleUser()
      .then(res => {
        console.log('resUser', res);
        this.onLoginRedirect();
      })
      .catch(err => console.log('error', err.message));
  }

  onLoginFacebook(): void {
    this.authService
      .loginFacebookUser()
      .then(res => {
        this.onLoginRedirect();
      })
      .catch(err => console.log('err', err.message));
  }

  onLoginRedirect(): void {
    this.router.navigate(['admin/list-books']);
  }
}
