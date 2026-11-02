export interface ExperienceEntry {
	_key: string;
	role: string;
	organisation: string;
	/** Free text, for example "Jun 2024 – Sep 2024" or "2023 – Present". */
	period: string;
	location?: string;
	description?: string;
}

export interface QualificationEntry {
	_key: string;
	qualification: string;
	institution: string;
	period: string;
	/** For example "First-class honours (expected)" or "2:1". */
	grade?: string;
	detail?: string;
}

export interface CvFile {
	url: string;
	/** Size in bytes. */
	size?: number;
}

export interface Cv {
	experience: ExperienceEntry[];
	qualifications: QualificationEntry[];
	cvFile?: CvFile;
}

/** What Sanity returns: entries may be missing fields and unset values come back as null. */
export interface RawCv {
	experience?: Partial<ExperienceEntry>[] | null;
	qualifications?: Partial<QualificationEntry>[] | null;
	cvFile?: { url?: string | null; size?: number | null } | null;
}
