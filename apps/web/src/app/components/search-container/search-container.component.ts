import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../material.module';
import { chipData } from '@employee-and-department-management-system/interfaces';
import { CHIP_TYPES } from '@employee-and-department-management-system/enums';

@Component({
  selector: 'app-search-container',
  templateUrl: './search-container.component.html',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    RouterModule,
    FormsModule,
  ],
  styleUrls: ['./search-container.component.scss'],
})
export class SearchContainerComponent {
  @Input() inputFields: chipData[] = [];
  @Output() searchQuery = new EventEmitter<{ [key: string]: string }>();
  CHIP_TYPES = CHIP_TYPES;

  onSearch() {
    const searchData: { [key: string]: string } = this.inputFields.reduce(
      (acc, input) => {
        if (input.value) {
          acc[input.key] = input.value;
        }
        return acc;
      },
      {} as { [key: string]: string }
    );

    this.searchQuery.emit(searchData);
  }
}
