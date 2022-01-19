import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import { environment } from "../environments/environment";
import {AuthService} from './auth.service';
import { throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PhoenixapiService {

  constructor(private http: HttpClient, private auth: AuthService) {}

  getTxns(walletAddr) {

    /*{"code":200,
      "meta":{
      "pagination":{
        "total":1,
          "pages":1,
          "page":1,
          "limit":20
      }},
      "data":[{"id":103,"post_id":123,"name":"Devagya Khanna","email":"devagya_khanna@schroeder.net","body":"Officia ea praesentium. Aliquam ex atque.","created_at":"2020-10-18T03:50:06.180+05:30","updated_at":"2020-10-18T03:50:06.180+05:30"}]}*/
    //return this.http.request("GET", "https://gorest.co.in/public-api/posts/123/comments");


    let queryURL = environment.phoenixApiURL + `/txns/${walletAddr.trim()}`;
    console.log(queryURL);
    const httpHeaders = new HttpHeaders()
      .set('x-token', this.auth.getCurrentToken())
      .set('username', this.auth.getUser())
      .set('accept', 'application/json');
    console.log('getTxns[httpHeaders]: ', httpHeaders);
    return this.http.get(queryURL, {headers: httpHeaders}).pipe(
      catchError(this.handleError)
    );
    /*{
      "txns": [
      {
        "block_hash": "00000000000000000005117449ea9707955356f57df2ad6d0bd17c40d19bd0a4",
        "block_height": 648238,
        "block_index": 966,
        "hash": "108366dbb75ad8d0ffad68005bec524b546726f6a0468f23d0fbf19672ebbf0e",
        "addresses": [
          "35tSkp1cSiKUpyaQMr2ntpazrX5nwtFz2V",
          "3EPvtBJGxWurGv7LF66qmHanYA652WBH3d",
          "3G2Njvq7z8ZbctY2Tyw6K7R8G1H5m9WgV4"
        ],
        "total": 162483222,
        "fees": 16778,
        "size": 138,
        "preference": "high",
        "confirmed": "2020-09-14T10:25:26+00:00",
        "received": "2020-09-14T10:25:26+00:00",
        "ver": 1,
        "double_spend": false,
        "vin_sz": 1,
        "vout_sz": 2,
        "confirmations": 5101,
        "confidence": 1,
        "inputs": [
          {
            "prev_hash": "f7c4b915cb5fe189cc288da00a7c3c2dfa41b1aaf27dd4d0ea1fc22554acc78f",
            "output_index": 0,
            "script": "1600141140ffcffaad950c1425b4a5e8ceab3c2186eed2",
            "output_value": 162500000,
            "sequence": 4294967295,
            "addresses": [
              "3EPvtBJGxWurGv7LF66qmHanYA652WBH3d"
            ],
            "script_type": "pay-to-script-hash",
            "age": 648238
          }
        ],
        "outputs": [
          {
            "value": 162435164,
            "script": "a9142e09cebe4daf21dedf0aacdb03b0a7da0158000f87",
            "spent_by": "bc4f04e627ec97809461e8ae21f94c731bbe702beb7c9e16bb0c956074d394b4",
            "addresses": [
              "35tSkp1cSiKUpyaQMr2ntpazrX5nwtFz2V"
            ],
            "script_type": "pay-to-script-hash"
          },
          {
            "value": 48058,
            "script": "a9149d3b0a989ea9433209756cc72ea21bf49f450f4987",
            "addresses": [
              "3G2Njvq7z8ZbctY2Tyw6K7R8G1H5m9WgV4"
            ],
            "script_type": "pay-to-script-hash"
          }
        ]
      }
      ]
    }
    */
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }

    // Return an observable with a user-facing error message.
    return throwError(
      error.status)
  }



}
