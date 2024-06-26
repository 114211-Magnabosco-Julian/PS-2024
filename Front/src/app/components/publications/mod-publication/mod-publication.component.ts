import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Subscription} from "rxjs";
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {PublicationsService} from "../../../services/publications/publications.service";
import {AuthService} from "../../../services/user/auth.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Section} from "../../../models/publication/section";
import {Publication} from "../../../models/publication/publication";
import {cAlert} from "../../../services/custom-alert/custom-alert.service"
import {FormPublicationComponent} from "../form-publication/form-publication.component";

@Component({
  selector: 'app-mod-publication',
  templateUrl: './mod-publication.component.html',
  styleUrl: './mod-publication.component.css'
})
export class ModPublicationComponent implements OnInit, OnDestroy {
  id=0;

  private subs: Subscription = new Subscription();

  @ViewChild(FormPublicationComponent) fp?: FormPublicationComponent;

  constructor( private route: ActivatedRoute) {

  }

  charge(id:number){
    this.id=id
  }
  ngOnInit(): void {
    this.subs.add(this.route.params.subscribe({
      next: value=> {
        this.charge(value["id"])
      }
    }))
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

}
