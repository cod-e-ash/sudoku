import { SudokuSaved, Difficulty } from '@src/app/helpers/helpers';
import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root',
})
export class SudokuCreateService {
	arrayNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
	sudokuSaved: SudokuSaved;
	sudokuWithAnswers: number[][];
	sudokuHidden: number[][];
	difficulty: Difficulty;

	i = 0;
	j = 0;

	constructor() {}

	generateSudoku = () => {
		let attempts = 0;
		let prvI = 0;
		this.i = 0;
		this.j = 0;
		if (this.sudokuWithAnswers) {
			this.sudokuWithAnswers.splice(0);
		}
		this.sudokuWithAnswers = Array.from(
			Array(9),
			() => new Array<number>(9)
		);
		while (this.i < 9) {
			while (!this.getRandom()) {
				if (attempts > 5) {
					this.i = prvI;

					if (this.i > 0) {
						this.i -= 3;
						prvI = this.i;
						attempts = 0;
					} else {
						this.i = 0;
						this.j = 0;
						attempts = 0;
						prvI = this.i;
					}
				} else if (this.j > 0) {
					this.j -= 3;
				}
				attempts++;
			}
			if (this.j === 6) {
				this.j = 0;
				this.i += 3;
			} else {
				this.j += 3;
			}
		}
	};

	public hideNumbers = (difficulty: Difficulty) => {
		let row = -1;
		let col = -1;
		// const sudokuClone = this.sudoku.map(i => i.map(j => j.toString()));
		const sudokuClone = this.sudokuWithAnswers.map((a) => a.slice());
		let totalHidden = 0;
		while (totalHidden <= difficulty) {
			for (let i = 3; i <= 9; i = i + 3) {
				for (let j = 3; j <= 9; j = j + 3) {
					if (Math.floor(Math.random() * 100) % 3 === 0) {
						while (row < i - 3) {
							row = Math.floor(Math.random() * i);
						}
						while (col < j - 3) {
							col = Math.floor(Math.random() * j);
						}
						if (sudokuClone[row][col] !== 0) {
							sudokuClone[row][col] = 0;
							totalHidden += 1;
						}
					}
					row = -1;
					col = -1;
				}
			}
		}
		this.sudokuHidden = sudokuClone;
	};

	private getRandom = (): boolean => {
		let k = 0;
		let l = 0;
		let remaingListForBox = this.arrayNumbers.slice(0);
		const toArray = Array.from(Array(3), () => new Array<number>(3));
		let ignoreList;
		// console.log(this.i, this.j,ignoreList);
		while (remaingListForBox.length > 1) {
			let position = 0;
			ignoreList = this.getIgnoreList(this.i + k, this.j + l);
			const remainingListForPosition = remaingListForBox.filter(
				(num) => ignoreList.indexOf(num) < 0
			);
			if (remainingListForPosition.length > 1) {
				position = Math.floor(
					Math.random() * remainingListForPosition.length
				);
			}
			const tempNum = remainingListForPosition.splice(position, 1)[0];
			if (!tempNum) {
				return false;
			}
			remaingListForBox = remaingListForBox.filter(
				(num) => num !== tempNum
			);
			toArray[k][l] = tempNum;
			this.sudokuWithAnswers[this.i + k][this.j + l] = tempNum;
			if (l === 2) {
				l = 0;
				k++;
			} else {
				l++;
			}
		}
		const savenum = remaingListForBox.pop();
		if (!savenum) {
			return false;
		}
		toArray[k][l] = savenum;
		this.sudokuWithAnswers[this.i + k][this.j + l] = savenum;
		return true;
	};

	private getIgnoreList = (i: number, j: number) => {
		const ignoreList = [];
		for (let k = 0; k < i; k++) {
			ignoreList.push(this.sudokuWithAnswers[k][j]);
		}
		for (let k = 0; k < j; k++) {
			ignoreList.push(this.sudokuWithAnswers[i][k]);
		}
		return ignoreList;
	};

	public getSudoku = (createNew: boolean, difficulty: Difficulty) => {
		// if (!createNew) {
		// 	const sudokuText = localStorage.getItem('sudoku');
		// 	if (sudokuText) {
		// 		this.sudokuSaved = JSON.parse(sudokuText);
		// 		if (this.sudokuSaved) {
		// 			return this.sudokuSaved;
		// 		}
		// 	}
		// }

		this.generateSudoku();
		this.hideNumbers(difficulty);
		this.sudokuSaved = {
			sudokuWithAnswers: this.sudokuWithAnswers,
			sudokuHidden: this.sudokuHidden,
			userSolved: this.sudokuHidden.map((a) => a.slice()),
			difficulty: this.difficulty,
			mistakes: 0,
			timeElapsed: { minutes: 0, seconds: 0 },
		};
		this.saveSudoku();
		return this.sudokuSaved;
	};

	public saveSudoku = () => {
		// localStorage.setItem('sudoku', JSON.stringify(this.sudokuSaved));
	};

	public resetUserSave = () => {
		if (this.saveSudoku) {
			this.sudokuSaved.userSolved = this.sudokuSaved.sudokuHidden.map((a) =>
				a.slice()
			);
		}
		this.saveSudoku();
	};
}
