import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-body',
  templateUrl: './body.component.html',
  styleUrls: ['./body.component.css']
})
export class BodyComponent {
  constructor (private http: HttpClient) {}
  
  converting = false;

  fileChange(event: any): void {
    this.converting = true;
    const file = event.target.files[0];
    let formData:FormData = new FormData();
    formData.append('file', file)
    
    this.http.post(`http://ec2-13-51-158-203.eu-north-1.compute.amazonaws.com:3000/upload`, formData, {responseType: "arraybuffer"})
    .subscribe(data => {
      var blob = new Blob([data], { type: "application/pdf" });
      saveAs(blob, 'result.pdf');
      this.converting = false;
    }
      );
  }
}
