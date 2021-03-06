import { Component, OnInit } from '@angular/core';
import {Router,ActivatedRoute} from "@angular/router";
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
  userList : User |undefined;
  user = new User();
  fg_Modify : FormGroup;
  password : string |undefined;
 name : string | undefined;
  idx : number |undefined;
  click : boolean = false;
  Idx :number |undefined;
  id : string |undefined;
  doubleCheck : boolean | undefined = false
  // @ts-ignore
  confirm : boolean |undefined;
  confirmAdmin : string | undefined;
  delogateAdmin : boolean |undefined = false;
  revokeAdmin : boolean |undefined = false;

  constructor(private router:Router, private fb:FormBuilder,userService:UserService,private activatedRoute: ActivatedRoute) {
    this.Idx = this.activatedRoute.snapshot.params["idx"]
    this.fg_Modify = fb.group({
      password : new FormControl('',[Validators.required, Validators.minLength(4),]),
      name : new  FormControl('',[Validators.required]),
      id : this.user.id
       });
    this.userService = userService;
  }

  //아이디,비번 중복검사 없이 가능하도록 설정

  ngOnInit(): void {
    // @ts-ignore
    this.userService.Select_User(this.Idx).subscribe(data=>{
      this.Idx = data.idx;
      this.id = data.id;
      this.password = data.password;
      this.name = data.name;
    })
    // @ts-ignore
    this.userService.Confirm_Admin(this.Idx).subscribe(data=>{
      // @ts-ignore
      this.confirm = data;
      if(this.confirm == true){
        this.confirmAdmin = "Admin";
        this.revokeAdmin = true;
      } else {
        this.confirmAdmin = "User";
        this.delogateAdmin = true;
      }
    })
  }
  //this.modifyform.value.idx = this.postIdx
  //     // form contorl 의 입력된 { 제목, 내용 } 에 + 게시글의 idx 값도 추가한다.
  //     this.boardService.modifyBoard(this.modifyform.value).subscribe(data => {
  //       console.log("정상출력:" + this.modifyform)
  //       this.reload()

  submit_modify(): void{
   /* this.user.id = this.fg_Modify.controls.fc_id.value;
    this.user.pw = this.fg_Modify.controls.fc_pw.value;
    this.user.name = this.fg_Modify.controls.fc_name.value;
*/ if(this.doubleCheck == true){
    this.fg_Modify.value.idx =  this.Idx
    this.user.password = this.fg_Modify.controls.password.value;
    this.user.name = this.fg_Modify.controls.name.value;
    this.user.id = this.fg_Modify.value.id
    this.userService.Modify_User(this.fg_Modify.value).subscribe(data=>{
      console.log("정상출력:" + this.fg_Modify.value.password)
      this.adminUser()
    })} else {
    alert("중복확인이 필요합니다.")
    }
  }


  check_name(event : MouseEvent): void{
    const {name} = this.fg_Modify.controls;
    this.userService.Check_Name(name.value).subscribe(response =>{
      console.log(response,"check data!!")
      if (response == 1) {
        alert("중복되어 사용 할 수 없는 NickName입니다.")
        this.doubleCheck = false;
      } else {
        alert("사용 가능 한 NickName입니다.")
        this.click = !this.click;
        (event.target as HTMLButtonElement).disabled = true;
        this.doubleCheck = true

      }
    })
  }
  adminUser() : void{
    this.router.navigate(['admin/userList'])
  }
  adminBoard() : void{
    this.router.navigate(['admin/boardList'])
  }
  userboard() :void{
    this.router.navigate(["/boardList"])
  }
  deleteUser() : void {
    // @ts-ignore
    this.userService.Delete_User(this.Idx).subscribe(data=>{
      alert("회원 정보가 삭제되었습니다.")
      this.adminUser()
    })
  }
  delegate() : void {
    // @ts-ignore
    this.userService.Delegate_Admin(this.Idx).subscribe(date=>{
      console.log("회원 idx" + this.Idx)
      alert("관리자 권한을 부여합니다.")
      history.back()
    })
  }

  revoke() : void {
    // @ts-ignore
    this.userService.Revoke_Admin(this.Idx).subscribe(data=>{
      alert("관리자 권한을 삭제합니다.")
      history.back()
    })
  }


}





