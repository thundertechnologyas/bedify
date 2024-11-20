import { Component } from '@angular/core';

import data from '../../../assets/data/availableLangs.json';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-language-selector',
  templateUrl: './language-selector.component.html',
  styleUrl: './language-selector.component.scss'
})

export class LanguageSelectorComponent {

  public availableLangs = data;

  constructor(private dialogRef: MatDialogRef<LanguageSelectorComponent>) {

  }

  select(lang : any) {
    this.dialogRef.close(lang);
  }
}
