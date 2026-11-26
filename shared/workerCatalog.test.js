import assert from 'node:assert/strict';
import test from 'node:test';
import { filterWorkers } from './filterWorkers.js';
import { demoWorkers, featuredWorkers, workerCategoryIds, workers } from './workerCatalog.js';

test('keeps the existing eight featured cards as the default collection', () => {
  assert.equal(featuredWorkers.length, 8);
  assert.deepEqual(featuredWorkers.map(({ id }) => id), [
    'worker-1',
    'worker-2',
    'worker-3',
    'worker-4',
    'worker-5',
    'worker-6',
    'worker-7',
    'worker-8',
  ]);
});

test('provides at least 30 profiles for every service category', () => {
  for (const serviceId of workerCategoryIds) {
    assert.ok(
      workers.filter((worker) => worker.serviceId === serviceId).length >= 30,
      `${serviceId} should have at least 30 profiles`,
    );
  }
});

test('category and search filters keep the expanded catalog scoped', () => {
  for (const serviceId of workerCategoryIds) {
    assert.equal(filterWorkers(workers, '', serviceId).length, 30);
  }

  const searchResults = filterWorkers(workers, 'Christine Williams');
  assert.deepEqual(searchResults.map(({ id }) => id), ['worker-1']);
});

test('marks generated profiles as sample listings with profile details', () => {
  assert.ok(demoWorkers.length > 0);
  assert.ok(demoWorkers.every((worker) => (
    worker.isDemo
    && !worker.featured
    && !worker.verified
    && worker.experienceYears > 0
    && worker.bio
    && worker.specialties.length > 0
  )));
});
