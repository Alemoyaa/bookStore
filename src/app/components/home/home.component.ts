import { DataApiService } from './../../services/data-api.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private dataApi: DataApiService) { }
  public books = [];
  public book = ' ' ;
  ngOnInit() {
    this.dataApi.getAllBooks().subscribe((books) => { // Recuperamos desde el servicio todos los libros
      console.log('BOOKS', books);
      this.books = books;
    });
  }

}
