import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpErrorResponse} from "@angular/common/http";
import {Observable, of, throwError} from 'rxjs'
import {Add_Comment, Board, Comments, ListByDate, ListResponse} from "../model/board";
import { environment } from '../../environments/environment'
import {state} from "@angular/animations";
import {catchError, map, tap} from "rxjs/operators";
import {DateQuery, ListQuery, Request, Sort,} from "./list-query";



const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json'
  })
};
/*
import {environment} from "../../environments/environment";

import {catchError, switchMap} from "rxjs/operators";
*/

@Injectable({
  providedIn: 'root'
})
export class BoardService {


  public BASE_URL = environment.baseUrl
  /*somethingUpdated = new Subject<string>();*/
  board: Board | undefined;


  constructor(private http: HttpClient) {
  }

  public BoardList(): Observable<ListResponse> {
    return this.http.get<ListResponse>('api/api/back/board/getBoardList');
  }
  // API에서 모든 게시글을 조회.

  public getBoardList(search_word?: any, search_option?: any): Observable<ListResponse>{

    const options = {
      params: {
        search_option: search_option ?? '',
        search_word: search_word ??''
      },
    };


    return this.http.get<ListResponse>('api/api/back/board/getBoardList',options)
  }
  //word&option 으로 게시글 검색.


  public getList(query?: ListQuery) {
    const uri = 'api/api/back/board/getBoardList';

    const params = {
      search_option: query?.search_option ?? '',
      search_word: query?.search_word ?? '',
      column: query?.sort_option ?? '',
      order: query?.sorting ?? '',
    }
    return this.http.get<ListResponse>(uri, { params });
  }
  // api에서 전체 게시글 리스트 조회

  public getBoardByDate(query? : DateQuery) {
    const uri = 'api/api/back/board/getBoardListByDate';


    const params = {
      request : query?.request ?? '',
      offset_date : query?.offset_date ?? '',
      limit_date : query?.limit_date ?? '',
    }
    return this.http.get<ListByDate>(uri, {params});
    }


  public getBoard(idx: number): Observable<Board> {
    return this.http.get<Board>('api/api/back/board/getPostHit/?idx=' + idx);
  }
  // API에서 상세 게시글 확인 및 조회수 증가 (idx를 통해 확인)

  public createBoard(board: Board): Observable<Board> {
    return this.http.post<Board>('api/api/back/board/insertPost', board, httpOptions);
  }
  // post로 게시글 등록(생성)

  public modifyBoard(board: Board): Observable<Board> {
    return this.http.post<Board>('api/api/back/board/updatePost', board);
  }
  //post로 게시글 수정

  public deleteBoard(idx: number): Observable<any> {
    return this.http.post('api/api/back/board/deletePost?idx=' + idx, '');
  }
  //idx값으로 DB에서 게시글 ststus=0으로 삭제

  public getComment(postidx: number): Observable<Comments> {
    return this.http.get<Comments>('api/api/back/board/getComment/?postidx=' +postidx);
  }
  //postidx(게시글 번호값)으로 덧글 조회

  public addComment(comment: Add_Comment): Observable<Add_Comment>{
    return this.http.post<Add_Comment>('api/api/back/board/addComment',comment)
  }
  //댓글 등록 (parentIdx, depth, comment, postidx)

  public ReplyComment(comment : String , postIdx : number, parentIdx : number, depth:number): Observable<Add_Comment>{

    return this.http.post<Add_Comment>('api/api/back/board/addComment',
      {
        comment : comment,
        postidx : postIdx,
        parentIdx : parentIdx,
        depth : depth
      }

      )
  }
  //답글 등록 (parentIdx, depth, comment, postidx)


}
