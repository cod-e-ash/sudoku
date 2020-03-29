export enum Difficulty {
	easy = 30,
	medium = 40,
	hard = 50,
	expert = 60,
}

export interface SudokuSaved {
	sudokuWithAnswers: number[][];
	sudokuHidden: number[][];
	difficulty: Difficulty;
	userSolved: number[][];
	mistakes: number;
	timeElapsed: {minutes: number, seconds: number};
}
