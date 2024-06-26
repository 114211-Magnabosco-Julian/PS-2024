import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import {Purchase} from "../../../models/purchase/purchase";
import {Delivery} from "../../../models/delivery/delivery";
import {UserService} from "../../../services/user/user.service";
import {PurchaseService, stateClasses} from "../../../services/purchase/purchase.service";
import {Subscription} from "rxjs";
import {User} from "../../../models/user/user";
import {cAlert} from "../../../services/custom-alert/custom-alert.service"
import {AuthService} from "../../../services/user/auth.service";

@Component({
  selector: 'app-show-delivery',
  templateUrl: './show-delivery.component.html',
  styleUrl: './show-delivery.component.css'
})
export class ShowDeliveryComponent implements OnInit, OnDestroy, OnChanges {

  @Input() delivery?: Delivery;
  @Output() eventClose = new EventEmitter<Delivery>();
  @ViewChild("close") closeModal?: ElementRef;

  dealers: User[] = [];
  dealer?: number;
  dealerDefaultName = "";
  state?: string;

  private subs: Subscription = new Subscription();

  constructor(private userService: UserService, private purchaseService: PurchaseService,
              protected authService:AuthService) {
  }

  ngOnInit(): void {
    this.charge();
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  ngOnChanges(): void {
    this.dealer = this.delivery?.dealerId;
    this.state = this.delivery?.deliveryState;
    let del1 = this.dealers.find(d => d.id == this.dealer?.toString());
    this.dealerDefaultName = (del1?.name || "") + " " + (del1?.lastname || "");
  }

  charge() {
    this.subs.add(this.userService.getDealers().subscribe(
      {
        next: value => {
          this.dealers = value["list"] as User[]
        },
        error: err => {
          cAlert("error","Error inesperado en el servidor, revise su conexion a internet");
        }
      }))
  }

  update() {
    let data = {
      "id": this.delivery?.id,
      "dealer": this.dealer,
      "deliveryState": this.state
    }
    this.subs.add(this.purchaseService.putDeliveries(data).subscribe(
      {
        next: value => {
          cAlert("success","Delivery guardado").then(() => {
            this.eventClose.emit();
            this.closeModal?.nativeElement.click() //<-- here
          });
        },
        error: err => {
          cAlert("error","Error inesperado en el servidor, revise su conexion a internet");
        }
      }))

  }

  protected readonly stateClasses = stateClasses;
}
