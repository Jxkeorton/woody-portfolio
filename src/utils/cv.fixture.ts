import type { Cv, ExperienceEntry, QualificationEntry } from './cv.types';

export const placement: ExperienceEntry = {
	_key: 'placement',
	role: 'Placement engineer',
	organisation: 'Ford, Dunton',
	period: 'Jun – Sep 2024',
	location: 'Essex',
	description: 'Ran brake fade tests on the dyno and cut test setup time by a third.',
};

export const society: ExperienceEntry = {
	_key: 'society',
	role: 'Suspension lead',
	organisation: 'Formula Student team',
	period: '2023 – Present',
};

export const degree: QualificationEntry = {
	_key: 'degree',
	qualification: 'BEng Automotive Engineering',
	institution: 'University of Coventry',
	period: '2022 – 2026',
	grade: 'First-class honours (expected)',
	detail: 'Dissertation: turbo response mapping.',
};

export const aLevels: QualificationEntry = {
	_key: 'alevels',
	qualification: 'A-levels: Maths, Physics, Design Technology',
	institution: 'Hillcrest Sixth Form',
	period: '2020 – 2022',
};

export const full: Cv = {
	experience: [placement, society],
	qualifications: [degree, aLevels],
	cvFile: { url: 'https://cdn.sanity.io/files/abc/production/cv123.pdf', size: 153600 },
};

export const empty: Cv = { experience: [], qualifications: [] };

export const longEntry: ExperienceEntry = {
	_key: 'long',
	role: 'Graduate powertrain calibration and emissions compliance engineer, hybrid programmes',
	organisation: 'A very long organisation name that keeps going Ltd',
	period: 'September 2024 – December 2025',
	description: 'Calibrated engine maps. '.repeat(8).trim(),
};
