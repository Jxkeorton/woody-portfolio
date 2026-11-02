import type { Cv, ExperienceEntry, QualificationEntry, RawCv } from './cv.types';

/** Treats null and empty strings from Sanity as "not filled in". */
const filled = (value: string | null | undefined) => (value?.trim() ? value : undefined);

const experienceEntry = (raw: Partial<ExperienceEntry>): ExperienceEntry[] => {
	const role = filled(raw.role);
	const organisation = filled(raw.organisation);
	const period = filled(raw.period);
	if (!raw._key || !role || !organisation || !period) return [];
	return [
		{
			_key: raw._key,
			role,
			organisation,
			period,
			location: filled(raw.location),
			description: filled(raw.description),
		},
	];
};

const qualificationEntry = (raw: Partial<QualificationEntry>): QualificationEntry[] => {
	const qualification = filled(raw.qualification);
	const institution = filled(raw.institution);
	const period = filled(raw.period);
	if (!raw._key || !qualification || !institution || !period) return [];
	return [
		{
			_key: raw._key,
			qualification,
			institution,
			period,
			grade: filled(raw.grade),
			detail: filled(raw.detail),
		},
	];
};

/** Entries missing a required field are dropped so the page never shows half an entry. */
export const resolveCv = (raw: RawCv | null): Cv => ({
	experience: (raw?.experience ?? []).flatMap(experienceEntry),
	qualifications: (raw?.qualifications ?? []).flatMap(qualificationEntry),
	...(raw?.cvFile?.url
		? { cvFile: { url: raw.cvFile.url, ...(raw.cvFile.size ? { size: raw.cvFile.size } : {}) } }
		: {}),
});

export const formatFileSize = (bytes: number) => {
	if (bytes < 1024) return `${bytes} B`;
	if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
	return `${Math.round((bytes / (1024 * 1024)) * 10) / 10} MB`;
};
