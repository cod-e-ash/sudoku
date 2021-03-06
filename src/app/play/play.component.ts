import { Difficulty, SudokuSaved } from '@src/app/helpers/helpers';
import { SudokuCreateService } from '@src/app/sudoku-create/sudoku-create.service';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
	selector: 'app-play',
	templateUrl: './play.component.html',
	styleUrls: ['./play.component.scss'],
})
export class PlayComponent implements OnInit {
	sudokuSaved: SudokuSaved;
	sudokuBoardWithAnswer: number[][];
	sudokuBoardHidden: number[][];
	sudokuBoardHiddenCloned: number[][];
	activeRow = -1;
	activeCol = -1;
	timeElapsed: { minutes: number; seconds: number };
	changing = false;
	currentNumber = 0;
	allDone = false;

	constructor(public createService: SudokuCreateService) {}

	ngOnInit(): void {
		this.startNewGame();
		// document.addEventListener('keyup', this.setValue);
		setInterval(() => {
			this.timeElapsed.seconds++;
			if (this.timeElapsed.seconds === 60) {
				this.timeElapsed.seconds = 0;
				this.timeElapsed.minutes++;
			}
			if (this.timeElapsed.minutes === 60) {
				this.timeElapsed.minutes = 0;
			}
		}, 1000);
	}

	public setActive = (row, col) => {
		if (this.allDone) { return; }

		this.currentNumber = 0;
		console.log(row, col);
		if (row > -1 && row < 9 && col > -1 && col < 9) {
			this.activeRow = row;
			this.activeCol = col;
			this.currentNumber = this.sudokuBoardHiddenCloned[row][col];
			return true;
		}
		return true;
	};

	public setValue = (event: any) => {

		if (this.allDone || this.activeRow < 0 || this.activeCol < 0) {
			return;
		}

		// Handle background colour change
		this.changing = true;
		setTimeout(() => {
			this.changing = false;
		}, 120);

		// Process arrow keys first
		if (event.key.includes && event.key.includes('Arrow')) {
			this.processArrowKeys(event);
			return;
		}

		// If field not editable, do not do anything
		if (this.sudokuBoardHidden[this.activeRow][this.activeCol] !== 0) {
			return;
		}

		// Check which key is pressed
		// delete if any of the below key is pressed
		if (
			event.key === 'Delete' ||
			event.key === 'Escape' ||
			event.key === 'Backspace'
		) {
			this.allDone = false;
			this.sudokuBoardHiddenCloned[this.activeRow][this.activeCol] = 0;
			this.createService.saveSudoku();
		} else if (/^\d*\.?\d*$/.test(event.key)) {
			this.sudokuBoardHiddenCloned[this.activeRow][
				this.activeCol
			] = Number(event.key);
			if (
				this.sudokuBoardHiddenCloned[this.activeRow][this.activeCol] !==
				this.sudokuBoardWithAnswer[this.activeRow][this.activeCol]
			) {
				this.sudokuSaved.mistakes++;
			}
			this.verify();
			this.createService.saveSudoku();
		}
	};

	public processArrowKeys = (event) => {
		let row = 0;
		let col = 0;
		let iteration = 1;

		if (event.key === 'ArrowUp') {
			row = -1;
		} else if (event.key === 'ArrowDown') {
			row = 1;
		} else if (event.key === 'ArrowLeft') {
			col = -1;
		} else if (event.key === 'ArrowRight') {
			col = 1;
		}
		while (
			!this.setActive(
				this.activeRow + row * iteration,
				this.activeCol + col * iteration
			)
		) {
			iteration++;
		}
	};

	public startNewGame = (createNew?: boolean) => {
		this.sudokuSaved = this.createService.getSudoku(
			createNew,
			Difficulty.hard
		);
		this.sudokuBoardWithAnswer = this.sudokuSaved.sudokuWithAnswers;
		this.sudokuBoardHidden = this.sudokuSaved.sudokuHidden;
		this.sudokuBoardHiddenCloned = this.sudokuSaved.userSolved;
		this.timeElapsed = this.sudokuSaved.timeElapsed;
	};

	public reset = () => {
		this.createService.resetUserSave();
		this.startNewGame(false);
	};

	public verify = () => {
		this.allDone =
			this.sudokuBoardHidden.toString() ===
			this.sudokuBoardHiddenCloned.toString();
	};
}
