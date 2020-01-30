import { userInterface } from './../../../models/user';
import { AngularFireAuth } from '@angular/fire/auth';
import { AuthService } from './../../../services/auth.service';
import { bookInterface } from './../../../models/book';
import { DataApiService } from './../../../services/data-api.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-list-books',
  templateUrl: './list-books.component.html',
  styleUrls: ['./list-books.component.css']
})
export class ListBooksComponent implements OnInit {

  constructor(private dataApi: DataApiService, private AuthService: AuthService) { }
  books: bookInterface[];
  public isAdmin: any = null;
  public userUid: string = null;

  ngOnInit() {
    this.getListBooks();
    this.getCurrentUser();
  }

  getCurrentUser(){ // Comprobamos si nuestro usuario es un admin o no
    this.AuthService.isAuth().subscribe(auth =>{
      if(auth){
        this.userUid = auth.uid;
        this.AuthService.isUserAdmin(this.userUid).subscribe(userRole => {
          this.isAdmin = Object.assign({}, userRole.roles).hasOwnProperty('admin');
          //this.isAdmin = true;
        })
      }
    })
  }

  getListBooks() {
    this.dataApi.getAllBooks().subscribe(books => {
      this.books = books;
    });
  }

  onDeleteBook(idBook: string){
    const confirmacion = confirm('Are you sure?')
    if(confirmacion){
      this.dataApi.deleteBook(idBook);
    }
  }

  onPreUpdateBook(book: bookInterface){
    this.dataApi.selectedBook = Object.assign({}, book);
    console.log("aaa", book);
  }

}
