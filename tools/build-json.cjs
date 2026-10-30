const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const GROUP_ID = 'franklin';

const OUTPUT_FILES = {
  definitions: 'component-definition.json',
  models: 'component-models.json',
  filters: 'component-filters.json',
};

function readJson(fullPath) {
  return JSON.parse(fs.readFileSync(fullPath, 'utf8'));
}

function readOutput(file, fallback) {
  const fullPath = path.join(ROOT, file);
  return fs.existsSync(fullPath) ? readJson(fullPath) : fallback;
}

function upsert(list, item) {
  const index = list.findIndex((entry) => entry.id === item.id);
  if (index >= 0) {
    list[index] = item;
  } else {
    list.push(item);
  }
}

function findPartialFiles() {
  const dirs = [path.join(ROOT, 'models')];
  const blocksDir = path.join(ROOT, 'blocks');

  if (fs.existsSync(blocksDir)) {
    fs.readdirSync(blocksDir).forEach((name) => {
      dirs.push(path.join(blocksDir, name));
    });
  }

  return dirs
    .filter((dir) => fs.existsSync(dir) && fs.statSync(dir).isDirectory())
    .flatMap((dir) => fs.readdirSync(dir)
      .filter((file) => file.startsWith('_') && file.endsWith('.json'))
      .map((file) => path.join(dir, file)));
}

function getGroup(definitions) {
  let group = definitions.groups.find((g) => g.id === GROUP_ID);
  if (!group) {
    group = { id: GROUP_ID, title: 'Franklin - Blocks', components: [] };
    definitions.groups.push(group);
  }
  return group;
}

function build() {
  const definitions = readOutput(OUTPUT_FILES.definitions, { groups: [] });
  const models = readOutput(OUTPUT_FILES.models, { models: [] });
  const filters = readOutput(OUTPUT_FILES.filters, { filters: [] });

  const group = getGroup(definitions);

  findPartialFiles().forEach((fullPath) => {
    const partial = readJson(fullPath);

    (partial.definitions || []).forEach((item) => upsert(group.components, item));
    (partial.models || []).forEach((item) => upsert(models.models, item));
    (partial.filters || []).forEach((item) => upsert(filters.filters, item));
  });

  const outputs = { definitions, models, filters };
  Object.keys(OUTPUT_FILES).forEach((key) => {
    const fullPath = path.join(ROOT, OUTPUT_FILES[key]);
    fs.writeFileSync(fullPath, `${JSON.stringify(outputs[key], null, 2)}\n`);
  });

  process.stdout.write('JSON de componentes generado\n');
}

build();
