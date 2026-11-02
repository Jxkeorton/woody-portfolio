import { describe, expect, it } from 'vitest';
import { nextProject } from './project';
import { one, two } from '../components/ProjectList/projectList.fixture';

const three = { ...two, title: 'Third', slug: 'third' };

describe('Next project', () => {
	describe('given a project that is not last in the list', () => {
		it('is the one after it', () => {
			expect(nextProject([one, two, three], one.slug)).toEqual(two);
			expect(nextProject([one, two, three], two.slug)).toEqual(three);
		});
	});

	describe('given the last project', () => {
		it('wraps round to the first', () => {
			expect(nextProject([one, two, three], three.slug)).toEqual(one);
		});
	});

	describe('given only one project', () => {
		it('has no next project', () => {
			expect(nextProject([one], one.slug)).toBeNull();
		});
	});

	describe('given a slug that is not in the list', () => {
		it('has no next project', () => {
			expect(nextProject([one, two], 'missing')).toBeNull();
		});
	});
});
