import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {UserService} from "../../service/user.service";
import {User} from "../../model/user";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-admin-user-modify',
  templateUrl: './admin-user-modify.component.html',
  styleUrls: ['./admin-user-modify.component.scss']
})
export class AdminUserModifyComponent implements OnInit {
  userService : UserService;
  user = new User();
  fgModify : FormGroup;
  id_check!: boolean;
  click : boolean = false;

  constructor(private router:Router, private fb:FormBuilder,userService:UserService,) {
    this.fgModify = fb.group({
      fc_id: fb.control('', [Validators.required,Validators.minLength(2),
        Validators.maxLength(10)]),
      fc_pw : new FormControl('',[Validators.required,Validators.minLength(2),Validators.maxLength(20)]),
      fc_verify_pw : new FormControl('', [Validators.required,Validators.minLength(2),Validators.maxLength(20)]),
      fc_name : new FormControl('', [Validators.required,Validators.minLength(2)])
    });


    this.userService = userService;

    /* this.fgjoin.controls.fc_id.valueChanges.subscribe(data=>{
       this.id_check= false;
     });*/
  }

  //아이디,비번 중복검사 없이 가능하도록 설정

  ngOnInit(): void {
  }

  submit_join(): void{
    this.user.id = this.fgModify.controls.fc_id.value;
    this.user.pw = this.fgModify.controls.fc_pw.value;
    this.user.name = this.fgModify.controls.fc_name.value;


    this.userService.SignUP(this.user).subscribe(response =>{

      console.log(response,"dddd")

      this.router.navigate(['login'])
      alert("Welcome!!")
    }, error => {
      alert("다시 입력하세요");
    })
  }

  check_id(event : MouseEvent): void{
    const {fc_id} = this.fgModify.controls;

    this.userService.Check_ID(fc_id.value).subscribe(data => {
      console.log(data, "data!")
      if (data == 1) {
        alert("중복되어 사용 할 수 없는 ID입니다.")
      } else {
        alert("사용 가능 한 ID입니다.")
        this.click = !this.click;
        (event.target as HTMLButtonElement).disabled = true;

        //사용 가능할 시, 중복체크 버튼 비활성화
      }

    })
  }

  check_name(event : MouseEvent): void{
    const {fc_name} = this.fgModify.controls;
    this.userService.Check_Name(fc_name.value).subscribe(response =>{
      console.log(response,"check data!!")
      if (response == 1) {
        alert("중복되어 사용 할 수 없는 NickName입니다.")
      } else {
        alert("사용 가능 한 NickName입니다.")
        this.click = !this.click;
        (event.target as HTMLButtonElement).disabled = true;

      }
    })
  }
  adminUser() : void{
    this.router.navigate(['admin/userList'])
  }
}





