import { describe, expect, it } from 'vitest';
import { CV_QUERY } from './sanity';
import { formatFileSize, resolveCv } from './cv';
import { degree, full, placement } from './cv.fixture';

describe('CV query', () => {
	it('looks up the single experience and education document', () => {
		expect(CV_QUERY).toContain('_type == "cv"');
		expect(CV_QUERY).toContain('[0]');
	});

	it('fetches each experience and qualification field the site shows', () => {
		for (const field of [
			'role',
			'organisation',
			'period',
			'location',
			'description',
			'qualification',
			'institution',
			'grade',
			'detail',
		]) {
			expect(CV_QUERY).toContain(field);
		}
	});

	it('fetches the CV file url and size', () => {
		expect(CV_QUERY).toContain('cvFile.asset->');
		expect(CV_QUERY).toContain('url');
		expect(CV_QUERY).toContain('size');
	});
});

describe('CV data', () => {
	describe('given no document', () => {
		it('has no entries and no file', () => {
			expect(resolveCv(null)).toEqual({ experience: [], qualifications: [] });
		});
	});

	describe('given a complete document', () => {
		it('keeps the entries and the file, in order', () => {
			expect(resolveCv(full)).toEqual(full);
		});
	});

	describe('given entries that are missing required fields', () => {
		const cv = resolveCv({
			experience: [{ _key: 'a', role: 'Engineer' }, placement],
			qualifications: [{ _key: 'b', qualification: 'BEng', institution: 'Uni' }, degree],
		});

		it('leaves them out', () => {
			expect(cv.experience).toEqual([placement]);
			expect(cv.qualifications).toEqual([degree]);
		});
	});

	describe('given blank optional fields', () => {
		it('treats them as not filled in', () => {
			const [entry] = resolveCv({
				experience: [{ ...placement, location: ' ', description: '' }],
			}).experience;
			expect(entry?.location).toBeUndefined();
			expect(entry?.description).toBeUndefined();
		});
	});

	describe('given a CV file with no url', () => {
		it('has no file', () => {
			expect(resolveCv({ cvFile: { url: null, size: null } }).cvFile).toBeUndefined();
			expect(resolveCv({ cvFile: null }).cvFile).toBeUndefined();
		});
	});
});

describe('File size', () => {
	it('shows bytes, kilobytes and megabytes in plain units', () => {
		expect(formatFileSize(512)).toBe('512 B');
		expect(formatFileSize(150 * 1024)).toBe('150 KB');
		expect(formatFileSize(1.5 * 1024 * 1024)).toBe('1.5 MB');
	});
});
