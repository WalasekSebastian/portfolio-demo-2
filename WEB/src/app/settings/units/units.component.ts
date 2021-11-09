import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Unit } from 'src/app/Models/unit';
import { SettingsService } from 'src/app/services/settings.service';

@Component({
  selector: 'app-units',
  templateUrl: './units.component.html',
  styleUrls: ['./units.component.css']
})
export class UnitsComponent implements OnInit {

  openModal: boolean;
  openAdd: boolean;
  openEdit: boolean;
  addForm: FormGroup;
  editForm: FormGroup;

  unitsData = [];
  newUnit = {} as Unit;

  constructor(private setting: SettingsService, private formBuilder: FormBuilder, private toastr: ToastrService) {
    this.addForm = this.formBuilder.group({
      name: ['', Validators.required],
      shortName: ['', Validators.required]
    });
    this.editForm = this.formBuilder.group({
      name: ['', Validators.required],
      shortName: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadUnits();
  }

  loadUnits(): void {
    this.setting.getAllUnits().subscribe((data) => {
      this.unitsData = data;
    });
  }

  saveAdd(): void {
    const x = JSON.parse(JSON.stringify(this.addForm.value));
    this.newUnit.name = x.name;
    this.newUnit.shortName = x.shortName;

    this.setting.addUnit(this.newUnit).subscribe(() => {
      this.openAdd = false;
      this.toastr.success('Dodano nową jednostkę');
      this.loadUnits();
      this.addForm.reset();
    },
      error => {
        if (error.error === 'exist') {
          this.toastr.warning('Jednostka już istnieje');
        }
        else {
          this.toastr.error('Błąd dodania nowej jednostki');
        }
      });
  }

  saveEdit(): void {
    const x = JSON.parse(JSON.stringify(this.editForm.value));
    this.newUnit.name = x.name;
    this.newUnit.shortName = x.shortName;

    this.setting.updateUnit(this.newUnit).subscribe(() => {
      this.openEdit = false;
      this.toastr.success('Zaktualizowano');
      this.loadUnits();
      this.editForm.reset();
    },
      error => {
        this.toastr.error('Błąd aktualizacji');
      });
  }

  openEditModal(unit: Unit): void {
    this.openEdit = true;
    this.newUnit.id = unit.id;
    this.editForm = this.formBuilder.group({
      name: [unit.name, Validators.required],
      shortName: [unit.shortName, Validators.required]
    });
  }

  closeAdd(): void {
    this.addForm.reset();
    this.openAdd = false;
    this.newUnit = null;
  }

  closeEdit(): void {
    this.editForm.reset();
    this.openEdit = false;
    this.newUnit = null;
  }

}
