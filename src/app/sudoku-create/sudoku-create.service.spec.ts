import { TestBed } from '@angular/core/testing';

import { SudokuCreateService } from './sudoku-create.service';

describe('SudokuCreateService', () => {
	let service: SudokuCreateService;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(SudokuCreateService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
