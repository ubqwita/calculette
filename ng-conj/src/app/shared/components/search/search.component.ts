import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FacadeService } from '@app/services/facade.service';
import { ValidationService } from '@app/services/validation.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit, OnDestroy {

  isLoading: boolean;
  inputForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private facade: FacadeService,
  ) {
    this.buildForm();
  }

  get ctrl(): { [p: string]: AbstractControl } {
    return this.inputForm.controls;
  }

  ngOnInit(): void {
    this.facade.loadingState
      .subscribe((state) => this.isLoading = state);
  }

  ngOnDestroy(): void {
    this.facade.loadingState.unsubscribe();
  }

  onSubmit(): void {
    this.facade.loadingState.next(true);
    const userInput = (this.inputForm.value.verb as string).toLowerCase();

    console.log(`User Input = ${userInput}`);
    console.log('Submit form values:', {...this.inputForm.value});

    this.facade.navigateTo(userInput);
    this.inputForm.reset();
  }

  private buildForm(): void {
    this.inputForm = this.fb.group({
      verb: ['',
        [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(24),
          ValidationService.twoWordsPattern,
        ]],
    });
  }
}