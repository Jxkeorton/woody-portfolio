export type FigureVariant = 'rotor' | 'curve' | 'section' | 'gear';

export interface ProjectFigure {
	variant: FigureVariant;
	caption: string;
}

export interface Project {
	id: string;
	title: string;
	system: string;
	discipline: string;
	year: string;
	/** One or two drawings. */
	figures: [ProjectFigure] | [ProjectFigure, ProjectFigure];
	/** One to six paragraphs describing the project. */
	paragraphs: [string, ...string[]];
}

export const MAX_PARAGRAPHS = 6;
