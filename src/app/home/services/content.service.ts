import { Injectable } from '@angular/core';
import {Folder} from '../models/folder';
import {File} from '../models/file';
import {AuthService} from '../../auth/services/auth.service';
import {UserInfoService} from '../../auth/services/user-info.service';
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpParams, HttpRequest} from '@angular/common/http';
import {catchError, map, tap} from 'rxjs/operators';
import {MessageService} from '../../auth/services/message.service';
import {Observable, of, throwError} from 'rxjs';
import {baseUrl, FILE_UPLOAD_COMPONENT, FOLDER_CREATE_COMPONENT, FOLDER_VIEW_COMPONENT} from '../../constants';
import {FolderContents} from '../models/folder-contents';

@Injectable({
  providedIn: 'root'
})
export class ContentService {
  public baseId: string;

  constructor(
    private authService: AuthService,
    private userInfoService: UserInfoService,
    private http: HttpClient,
    private messageService: MessageService
  ) { }

  httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
  };

  initializeContent() {
    if (!this.baseId) {
      return this.http.get(baseUrl + 'api/root', this.httpOptions).pipe(
        map(data => JSON.parse(JSON.stringify(data))),
        tap(data => {
          this.baseId = data.id;
        }),
        catchError((error: HttpErrorResponse) => {
          this.messageService.delete(FOLDER_VIEW_COMPONENT);
          this.messageService.add(error.error.message, FOLDER_VIEW_COMPONENT);
          return throwError(error);
        })
      );
    } else {
      return of(null);
    }
  }

  fetchFolder(folderId: string = this.baseId): Observable<Folder> { // either root or desired folder
    return this.http.get<Folder>(baseUrl + 'api/' + folderId, this.httpOptions)
      .pipe(catchError((error: HttpErrorResponse) => {
        this.messageService.delete(FOLDER_VIEW_COMPONENT);
        this.messageService.add(error.error.message, FOLDER_VIEW_COMPONENT);
        return throwError(error);
      }));
  }

  fetchFile(folderId: string, fileId: string): Observable<File> {
    return this.http.get<File>(baseUrl + 'api/' + folderId + '/' + fileId, this.httpOptions)
      .pipe(catchError((error: HttpErrorResponse) => {
        this.messageService.delete(FOLDER_VIEW_COMPONENT);
        this.messageService.add(error.error.message, FOLDER_VIEW_COMPONENT);
        return throwError(error);
      }));
  }

  fetchFolderContents(folderId: string): Observable<FolderContents> {
    console.log(folderId);

    return this.http.get<FolderContents>(baseUrl + 'api/' + folderId + '/contents', this.httpOptions)
      .pipe(
        map((data) => {
          const files: Array<File> = [];
          const folders: Array<Folder> = [];
          data.files.forEach(value => {
            console.log('in iteration');
            files.push(new File(value.id, value.name,
              value.size, value.dateCreated, value.dateModified,
              value.type, value.extension));
          });
          data.folders.forEach(value => {
            folders.push(new Folder(value.id, value.name,
              value.contents, value.parentId, value.dateCreated, value.dateModified));
          });
          return new FolderContents(files, folders);
        }),
        catchError((error: HttpErrorResponse) => {
        this.messageService.delete(FOLDER_VIEW_COMPONENT);
        this.messageService.add(error.error.message, FOLDER_VIEW_COMPONENT);
        return throwError(error);
      }));
  }

  createFolder(currentFolderId: string, folderName: string): Observable<any> {
    return this.http.post(baseUrl + 'api/' + currentFolderId + '/create-folder', {
      newFolderName: folderName
    }, this.httpOptions).pipe(
      catchError((error: HttpErrorResponse) => {
        this.messageService.delete(FOLDER_CREATE_COMPONENT);
        this.messageService.add(error.error.message, FOLDER_CREATE_COMPONENT);
        return throwError(error);
      }));
  }

  uploadFile(fileToUpload, folderId: string) {
    const formData = new FormData();
    formData.append('file', fileToUpload);
    console.log(JSON.stringify(fileToUpload));
    return this.http.post(baseUrl + 'api/' + folderId + '/upload', formData)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          this.messageService.delete(FILE_UPLOAD_COMPONENT);
          this.messageService.add(error.error.message, FOLDER_CREATE_COMPONENT);
          return throwError(error);
        })
      );
  }
}
