import {Component, OnDestroy, OnInit} from '@angular/core';
import {PurchaseService, stateClasses} from "../../services/purchase/purchase.service";
import {Subscription} from "rxjs";
import {Delivery} from "../../models/delivery/delivery";
import {AuthService} from "../../services/user/auth.service";
import {Router} from "@angular/router";
import {PublicationsService} from "../../services/publications/publications.service";
import {Cart} from "../../models/cart/cart";
import {cAlert} from "../../services/custom-alert/custom-alert.service";

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit,OnDestroy {

  private subs: Subscription = new Subscription();

  list: Cart[] = [
  ];

  listCounts: number[] = [
  ];
  total:number=0;

  constructor(private service: PublicationsService,private purchaseService: PurchaseService) {
  }
  ngOnInit(): void {
    this.charge()
  }
  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  charge(){

    this.subs.add(
      this.service.getCart().subscribe(
        {
          next: value => {
            // this.elements=value["elements"]
            // this.list=value["list"]
            console.log(value)
            this.list=value as Cart[]
            this.total =0;
            for (let card of this.list){
              this.listCounts.push(card.selectedCount)
              this.total += card.price*card.selectedCount
            }
          },
          error: err => {
            console.log(err)
            cAlert("error","Error inesperado en el servidor, revise su conexion a internet");
          }
        }
      )
    );
  }

  update(count:number, cart:Cart){
    if(count==null){
      return
    }
    let data = {
      pubId: cart.id,
      value: count
    }
    this.subs.add(
      this.service.postCart(data).subscribe({
        next: value => {

          cAlert("success",count<=0?"Eliminado":"Añadido al carrito").then((value)=>{
            this.charge()
          });
        },
        error:err => {
          cAlert("error","Error inesperado en el servidor, revise su conexion a internet");
        }
      })
    )

  }
  buy(){
    let items=[];
    for(let item of this.list){
      items.push({
        idPub: item.id,
        count: item.selectedCount
      })
    }
    let data = {
      items: items
    }
    this.subs.add(
      this.purchaseService.postSale(data).subscribe(
        {
          next: value => {
            // console.log(value["preference"]["initPoint"])
            window.location.href = value["preference"]["initPoint"]
          },
          error: err => {
            console.log(err)
            if(err.status==400){
              cAlert("error","El usuario no posee los datos de compra completos");
            }else {
              cAlert("error","Error inesperado en el servidor, revise su conexion a internet");
            }
          }
        }
      )
    );
  }
  buyAlone(cart:Cart){
    let item={

      idPub: cart.id,
      count: cart.selectedCount
    }
    let data = {
      items: [item]
    }
    this.subs.add(
      this.purchaseService.postSale(data).subscribe(
        {
          next: value => {
            // console.log(value["preference"]["initPoint"])
            window.location.href = value["preference"]["initPoint"]
          },
          error: err => {
            console.log(err)
            if(err.status==400){
              cAlert("error","El usuario no posee los datos de compra completos");
            }else {
              cAlert("error","Error inesperado en el servidor, revise su conexion a internet");
            }
          }
        }
      )
    );
  }

  notupdate(i:number,cart:Cart){
    this.listCounts[i] = cart.selectedCount
  }
  remove(cart:Cart){
    this.update(0,cart)
  }

  get checkCanBuy(){
    for(let item of this.list){
      if(item.count<item.selectedCount) return false;
    }
    return true;
  }
}
