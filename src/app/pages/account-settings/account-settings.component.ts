import { Component, OnInit } from '@angular/core';
import { SettingsService } from 'src/app/services/settings.service';

@Component({
  selector: 'app-account-settings',
  templateUrl: './account-settings.component.html',
  styles: [
  ]
})
export class AccountSettingsComponent implements OnInit {

  

  constructor( private settignsService: SettingsService) { }

  ngOnInit(): void {
    this.settignsService.checkCurrentTheme();
  }

  changeTheme( theme: string ){

    this.settignsService.changeTheme ( theme );

  }

}
