import { bookInterface } from './../../models/book';
import { DataApiService } from './../../services/data-api.service';
import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit {

  constructor(protected dataApi: DataApiService) { }
  
  @ViewChild('btnClose', {static: true}) btnClose: ElementRef;
  @Input() userUid: string;
  ngOnInit() {
  }

  onSaveBook(bookForm: NgForm): void{
    if(bookForm.value.id === null){ // new
    
    bookForm.value.userUid = this.userUid;// Cuando guardemos un libro en el objeto se le guardara esta propiedad tambien
    this.dataApi.addBook(bookForm.value); // Agregamos el libro que se ingreso al formulario, a nuestra DB
    }
    else{ // update
      this.dataApi.updateBook(bookForm.value);
    }
    bookForm.resetForm(); // Reseteamos el formulario
    this.btnClose.nativeElement.click();
  }

}
