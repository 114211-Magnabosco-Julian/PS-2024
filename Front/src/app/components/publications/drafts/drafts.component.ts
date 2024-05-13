import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {Subscription} from "rxjs";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {PublicationMin} from "../../../models/publication/publication-min";
import {PublicationsService} from "../../../services/publications/publications.service";
import {ActivatedRoute, Params, Router} from "@angular/router";

@Component({
  selector: 'app-drafts',
  templateUrl: './drafts.component.html',
  styleUrl: './drafts.component.css'
})
export class DraftsComponent implements OnInit,OnDestroy {

  private subs: Subscription = new Subscription();

  list: PublicationMin[] = [
  ];

  @Output() selectEvent= new EventEmitter<any>();

  constructor(private service: PublicationsService,
              private router: Router) {
  }
  ngOnInit(): void {
    this.charge()
  }
  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }


  charge(){

    this.subs.add(
      this.service.getDrafts().subscribe(
        {
          next: value => {
            this.list=value
          },
          error: err => {
            console.log(err)
            alert("Hubo un error al buscar");
          }
        }
      )
    );
  }

  delete(id:number){

   if(confirm("Quieres eliminar el borrador?")){
     this.subs.add(
       this.service.delete(id.toString()).subscribe(
         {
           next: value => {
             this.charge()
           },
           error: err => {
             console.log(err)
             alert("Hubo un error al buscar");
           }
         }
       )
     );
   }
  }

  selectDraft(id:number){
    this.selectEvent.emit(id)

  }
}