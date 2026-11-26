const serviceSkills = {
  carpentry: ['carpenter'],
  electrician: ['electrician'],
  plumbing: ['plumber'],
  painting: ['painter'],
  cleaning: ['cleaner'],
  'ac-repair': ['ac technician', 'hvac technician'],
  masonry: ['mason', 'welder', 'site observer'],
  gardening: ['gardener'],
};

export function filterWorkers(workers, search = '', serviceId = '') {
  const normalizedSearch = search.trim().toLowerCase();
  return workers.filter((worker) => {
    const skill = String(worker.skill || '').toLowerCase();
    const matchesService = !serviceId || worker.serviceId === serviceId || serviceSkills[serviceId]?.includes(skill);
    const searchableFields = [worker.name, worker.skill, worker.bio, ...(worker.specialties || [])];
    const matchesSearch = !normalizedSearch || searchableFields.some((field) => String(field || '').toLowerCase().includes(normalizedSearch));
    return matchesService && matchesSearch;
  });
}
