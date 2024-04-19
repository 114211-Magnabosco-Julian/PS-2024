import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Observable, Observer, Subscription} from "rxjs";
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {PublicationsService} from "../../../services/publications/publications.service";
import {AuthService} from "../../../services/user/auth.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Section} from "../../../models/publication/section";
import {Publication} from "../../../models/publication/publication";

@Component({
  selector: 'app-mod-publication',
  templateUrl: './mod-publication.component.html',
  styleUrl: './mod-publication.component.css'
})
export class ModPublicationComponent implements OnInit,OnDestroy {
  notfound=false;

  showConditions=true
  showMaterials=true
  showSteps=true
  showPurchasedata=true

  private subs: Subscription = new Subscription();
  form: FormGroup = this.fb.group({});

  pubImages: {url: any, file: File }[]=[]
  stepImages: {url: any, file: File }[]=[]
  video:any=""
  @ViewChild('img1') img1?: ElementRef<HTMLDivElement>;

  publication:Publication={
    difficultyValue: 0,
    video: "",
    id: 1,
    name: "",
    description: "",
    userId: 1,
    userIconUrl: "",
    username: "",
    type: "",
    difficulty: "",
    calification: 0,
    myCalification: 0,
    sections: [  ],
    canSold: false,
    price: 0,
    count: 0
  };
  constructor(private fb: FormBuilder, private service: PublicationsService,
              private userService: AuthService, private router: Router,
              private activeRoute: ActivatedRoute) {
    this.form = this.fb.group({
      name: ["", [Validators.required, Validators.maxLength(50 )]],
      description: ["", [Validators.required]],
      type: ["", [Validators.required]],
      difficulty: ["", [Validators.required]],
      image: [false, [Validators.requiredTrue]],
      video: [""],
      conditions: this.fb.array([]),
      materials: this.fb.array([]),
      steps: this.fb.array([]),
      canSold: [false],
      price: [""],
      count: [""]
    });

  }
  ngOnInit(): void {
    this.charge()
  }

  charge(){
    let id="" ;
    this.subs.add(
      this.activeRoute.params.subscribe(
        {
          next: value => {
            id = value["id"]
            this.subs.add(
              this.service.get(id,this.userService.user?.id||"1").subscribe(
                {
                  next: value => {
                    this.publication=value
                    this.setForm();
                  },
                  error: err => {
                    alert("Hubo un error al cargar");
                    this.notfound=true;
                  }
                }
              )
            );
          }
        }
      )
    );
  }

  setForm(){
    this.form.setValue({
      name: this.publication.name,
      description: this.publication.description,
      type: this.publication.type,
      difficulty: this.publication.difficultyValue,
      image: true,
      video: this.publication.video,
      conditions: [],
      materials: [],
      steps: [],
      canSold: this.publication.canSold,
      price: this.publication.price,
      count: this.publication.count
    })

    let sectionsPhoto = this.publication.sections.filter((s) => s.type=="PHOTO");
    let sectionsCond = this.publication.sections.filter((s) => s.type=="COND")
      .sort((a,b) => a.number-b.number);
    let sectionsMat = this.publication.sections.filter((s) => s.type=="MAT")
      .sort((a,b) => a.number-b.number);
    let sectionsStep = this.publication.sections.filter((s) => s.type=="STEP")
      .sort((a,b) => a.number-b.number);


    for (let s of sectionsPhoto){
      this.subs.add(
        this.service.getImages(s.imageUrl.replace("http://localhost:8080/api/image/pub/","")).subscribe(
          {
            next: value => {
              let v = value as Blob;
              this.pubImages.push(
                {url: s.imageUrl, file: new File([v],'image', {type: v.type})}
              )
            }
          }
        )
      )
    }
    this.video=this.publication.video||""

    for (let s of sectionsCond){
      this.addDetailCondition(s.text);
    }
    for (let s of sectionsMat){
      this.addDetailMaterials(s.text);
    }
    for (let s of sectionsStep){
      this.subs.add(
        this.service.getImages(s.imageUrl.replace("http://localhost:8080/api/image/pub/","")).subscribe(
          {
            next: value => {
              let v = value as Blob;
              this.addDetailsSteps(s.text, s.imageUrl);
              this.stepImages.push(
                {url: s.imageUrl, file: new File([v],'image', {type: v.type})}
              )
            }
          }
        )
      )
    }
  }
  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  get detailsConditions(){
    return this.form.get("conditions") as FormArray
  }
  addDetailCondition(text:string = ""){
    let v = this.fb.group({
      text: ["",[Validators.required,Validators.maxLength(500)]]
    })
    v.setValue({text: text})
    this.detailsConditions.push(v)
    this.detailsConditions.markAsTouched()
  }
  removeDetailCondition(id:number){
    this.detailsConditions.removeAt(id)
  }
//MAteriales
  get detailsMaterials(){
    return this.form.get("materials") as FormArray
  }
  addDetailMaterials(text:string = ""){
    let v = this.fb.group({
      text: ["",[Validators.required,Validators.maxLength(500)]]
    })
    v.setValue({text: text})
    this.detailsMaterials.push(v)
    this.detailsMaterials.markAsTouched()
  }
  removeDetailMaterials(id:number){
    this.detailsMaterials.removeAt(id)
  }
  //pasos
  get detailsSteps(){
    return this.form.get("steps") as FormArray
  }
  addDetailsSteps(text:string = "" ,url:string = ""){
    let v = this.fb.group({
      text: ["",[Validators.required,Validators.maxLength(500)]],
      image: [""]
    })
    v.setValue({text: text, image: ""})
    this.detailsSteps.push(v)
    this.detailsSteps.markAsTouched()

    this.stepImages.push({url:url, file:new File([],"") })
  }
  moveDetailsSteps(id:number,dir:number){
    let val = this.detailsSteps.at(id).value;
    this.detailsSteps.removeAt(id)
    let d = this.fb.group({
      text: ["",[Validators.required,Validators.maxLength(500)]],
      image: [""]
    })
    d.setValue(val)
    this.detailsSteps.insert(id+dir,d)
    this.detailsSteps.markAsTouched()

    let img = this.stepImages[id+1]
    this.stepImages[id+1] = this.stepImages[id+1+dir];
    this.stepImages[id+1+dir] = img;
  }

  removeDetailsSteps(id:number){
    this.detailsSteps.removeAt(id)
    this.stepImages.slice(id)
  }


  //guardar
  onSubmit(){
    if(this.form.invalid){
      alert("El formulario es invalido");
      this.form.markAllAsTouched();
      return;
    }

    let sections:any[] = [];
    for (let s in this.pubImages){
      sections.push({
        "number":"",
        "type":"PHOTO",
        "text":""
      })
    }
    for (let s in this.detailsConditions.controls){
      sections.push({
        "number":s+1,
        "type":"COND",
        "text":this.detailsConditions.controls[s].value["text"]
      })
    }
    for (let s in this.detailsMaterials.controls){
      sections.push({
        "number":s+1,
        "type":"MAT",
        "text":this.detailsMaterials.controls[s].value["text"]
      })
    }
    for (let s in this.detailsSteps.controls){
      sections.push({
        "number":s+1,
        "type":"STEP",
        "text":this.detailsSteps.controls[s].value["text"]
      })
    }

    let data = {
      "id": this.publication.id,
      "user": this.userService.user?.id,
      "name": this.form.controls['name'].value,
      "description": this.form.controls['description'].value,
      "type": this.form.controls['type'].value,
      "difficulty": this.form.controls['difficulty'].value,
      "video": this.form.controls['video'].value,
      "sections": sections,
      "canSold": this.form.controls['canSold'].value,
      "price": this.form.controls['price'].value,
      "count": this.form.controls['count'].value
    }

    this.subs.add(
      this.service.putPublication(data).subscribe(
        {
          next: value => {
            alert("La publicacion fue guardada con éxito");
            this.uploadImages(value["sections"])
          },
          error: err => { alert("Hubo un error al guardar"); }
        }
      )
    );
  }

  selectPubImages(event:any){
    if (event.target.files) {
      this.form.get("image")?.setValue(true)
      this.pubImages = []
      for (let f of event.target.files){
        var reader = new FileReader();
        reader.readAsDataURL(f); // read file as data url

        reader.onload = (event) => { // called once readAsDataURL is completed
          this.pubImages.push({url: event.target?.result, file: f})
        }
      }
    }
  }
  selectStepFile(event:any, index:number){
    if (event.target.files && event.target.files[0] && this.stepImages.at(index)) {
      var reader = new FileReader();

      this.stepImages[index].file = event.target.files[0]
      reader.readAsDataURL(event.target.files[0]); // read file as data url

      reader.onload = (event) => { // called once readAsDataURL is completed
        this.stepImages[index].url=event.target?.result
      }
    }

  }
  changeVideo(event:any){
    let value=event.target.value as string
    value=value.replace("https://www.youtube.com/watch?v=","")
      .replace("https://www.youtube.com/shorts/","")
    this.video=value.split("&")[0];
  }

  uploadImages(sections: Section[]){
    let data = new FormData()
    let indexes = ""

    let sectionsPhoto = sections.filter((s) => s.type=="PHOTO");
    let sectionsStep = sections.filter((s) => s.type=="STEP")
      .sort((a,b) => a.number-b.number);

    console.log(sectionsPhoto)
    console.log(sectionsStep)

    for (let i in sectionsPhoto){
      data.append("images",this.pubImages[i].file);
      indexes += sectionsPhoto[i].id + "_"
    }

    for (let i in sectionsStep){
      if(this.detailsSteps.controls[i].value["image"]){
        data.append("images",this.stepImages[i].file);
        indexes += sectionsStep[i].id + "_"
      }
    }

    data.append("indexes",indexes);
    console.log(indexes)

    this.subs.add(
      this.service.postImages(data).subscribe(
        {
          next: value => {
            alert("Imagenes guardada con éxito");
            this.router.navigate(["/explore"])
          },
          error: err => { alert("Hubo un error al guardar"); }
        }
      )
    );
  }

}
