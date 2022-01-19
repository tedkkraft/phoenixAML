import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-address-form',
  templateUrl: './address-form.component.html',
  styleUrls: ['./address-form.component.css']
})
export class AddressFormComponent implements OnInit {

  addressForm = new FormControl('', [
    Validators.required,
    Validators.minLength(34),
    Validators.maxLength(34),
    // forbiddenNameValidator(/bob/i) // <-- Here's how you pass in the custom validator.
  ]);

  constructor() { 

    // this.addressInfoForm = fc 
    // this.addressInfoForm.value == "Hello";

    // this.addressInfoForm = fb.group({
    //   'Address':  ['', Validators.required]
    // });

    // this.addressInfoForm.valueChanges.subscribe(
    //   (form: any) => {
    //     console.log('form has been changed');
    //   }

  }

  ngOnInit(): void {
  }



}
