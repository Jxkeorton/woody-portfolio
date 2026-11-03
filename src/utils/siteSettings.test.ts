import { describe, expect, it } from 'vitest';
import { SITE_SETTINGS_QUERY } from './sanity';
import { DEFAULT_SITE_SETTINGS, resolveSiteSettings } from './siteSettings';
import { full, minimal, rawCleared } from './siteSettings.fixture';

describe('Site settings query', () => {
	it('looks up the single site settings document', () => {
		expect(SITE_SETTINGS_QUERY).toContain('_type == "siteSettings"');
		expect(SITE_SETTINGS_QUERY).toContain('[0]');
	});

	it('fetches only the fields the site uses', () => {
		for (const field of [
			'name',
			'statement',
			'roleLine',
			'availabilityLine',
			'details',
			'label',
			'value',
			'skills',
			'about',
			'profileImage',
			'email',
			'linkedinUrl',
			'contactHeading',
			'siteTitle',
			'siteDescription',
		]) {
			expect(SITE_SETTINGS_QUERY).toContain(field);
		}
		expect(SITE_SETTINGS_QUERY).not.toContain('...');
	});

	it('fetches the profile image with its alt text, focal point, crop, preview and size', () => {
		for (const field of ['alt', 'hotspot', 'crop', 'lqip', 'dimensions']) {
			expect(SITE_SETTINGS_QUERY).toContain(field);
		}
	});
});

describe('Site settings with defaults', () => {
	describe('given no settings document', () => {
		it('uses the built-in defaults so the site still builds', () => {
			expect(resolveSiteSettings(null)).toEqual(DEFAULT_SITE_SETTINGS);
		});

		it('uses Woody’s email address', () => {
			expect(resolveSiteSettings(null).email).toBe('woodyorton@outlook.com');
		});

		it('links to Woody’s LinkedIn profile', () => {
			expect(resolveSiteSettings(null).linkedinUrl).toBe('https://www.linkedin.com/in/w-orton/');
		});

		it('uses the default About text', () => {
			const { about } = resolveSiteSettings(null);
			expect(about).toContain('second-year BEng Automotive Engineering student');
			expect(about).toContain('Loughborough University');
			expect(about?.length).toBeLessThanOrEqual(600);
		});
	});

	describe('given no settings document', () => {
		it('names the site after Woody Orton', () => {
			expect(resolveSiteSettings(null).name).toBe('Woody Orton');
		});

		it('has no title block details and no skills', () => {
			expect(resolveSiteSettings(null).details).toEqual([]);
			expect(resolveSiteSettings(null).skills).toEqual([]);
		});
	});

	describe('given details and skills with blank entries', () => {
		const settings = resolveSiteSettings({
			details: [
				{ _key: 'a', label: 'Degree', value: 'BEng' },
				{ _key: 'b', label: 'Based', value: '  ' },
				{ _key: 'c', label: '', value: 'Orphan' },
			],
			skills: ['CATIA', '', '  ', 'Python'],
		});

		it('drops details that are missing a label or a value', () => {
			expect(settings.details.map((d) => d.label)).toEqual(['Degree']);
		});

		it('drops blank skills and keeps the order of the rest', () => {
			expect(settings.skills).toEqual(['CATIA', 'Python']);
		});
	});

	describe('given a document with every field filled in', () => {
		it('keeps what the editor wrote', () => {
			expect(resolveSiteSettings(full)).toEqual(full);
		});
	});

	describe('given a document where every field is cleared', () => {
		const settings = resolveSiteSettings(rawCleared);

		it('falls back to the defaults for the fields the page cannot do without', () => {
			expect(settings.name).toBe(DEFAULT_SITE_SETTINGS.name);
			expect(settings.statement).toBe(DEFAULT_SITE_SETTINGS.statement);
			expect(settings.contactHeading).toBe(DEFAULT_SITE_SETTINGS.contactHeading);
			expect(settings.email).toBe(DEFAULT_SITE_SETTINGS.email);
			expect(settings.linkedinUrl).toBe(DEFAULT_SITE_SETTINGS.linkedinUrl);
			expect(settings.about).toBe(DEFAULT_SITE_SETTINGS.about);
			expect(settings.siteTitle).toBe(DEFAULT_SITE_SETTINGS.siteTitle);
			expect(settings.siteDescription).toBe(DEFAULT_SITE_SETTINGS.siteDescription);
		});

		it('has no details or skills', () => {
			expect(settings.details).toEqual([]);
			expect(settings.skills).toEqual([]);
		});

		it('leaves the optional fields out', () => {
			expect(settings.roleLine).toBeUndefined();
			expect(settings.availabilityLine).toBeUndefined();
			expect(settings.profileImage).toBeUndefined();
		});
	});

	describe('given a document with only the required fields', () => {
		it('keeps them, and uses the default About text and email for the rest', () => {
			const settings = resolveSiteSettings(minimal);
			expect(settings.name).toBe(minimal.name);
			expect(settings.about).toBe(DEFAULT_SITE_SETTINGS.about);
			expect(settings.email).toBe(DEFAULT_SITE_SETTINGS.email);
			expect(settings.profileImage).toBeUndefined();
		});
	});
});
