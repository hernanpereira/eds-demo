const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');

// Qué clave del JSON final corresponde a cada archivo de salida
const targets = {
  definitions: 'component-definition.json',
  models: 'component-models.json',
  filters: 'component-filters.json',
};

// Carpetas donde buscamos los archivos _*.json
const sourceDirs = [path.join(root, 'blocks'), path.join(root, 'models')];

// Lee el JSON de salida si existe, para no perder lo que ya tenía
function readOutput(file, key) {
  const p = path.join(root, file);
  if (!fs.existsSync(p)) return { [key]: [] };
  const data = JSON.parse(fs.readFileSync(p, 'utf8'));
  if (!Array.isArray(data[key])) data[key] = [];
  return data;
}

const out = {};
for (const [key, file] of Object.entries(targets)) {
  out[key] = readOutput(file, key);
}

// Recorre cada carpeta de bloques (o models) y mete sus _*.json en la salida
for (const base of sourceDirs) {
  if (!fs.existsSync(base)) continue;
  const entries = fs.readdirSync(base);
  const folders = base.endsWith('blocks') ? entries : [''];

  for (const folder of folders) {
    const dir = path.join(base, folder);
    if (!fs.statSync(dir).isDirectory()) continue;

    for (const f of fs.readdirSync(dir)) {
      if (!f.startsWith('_') || !f.endsWith('.json')) continue;
      const src = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'));

      for (const key of Object.keys(targets)) {
        for (const item of src[key] || []) {
          const list = out[key][key];
          const i = list.findIndex((x) => x.id === item.id);
          if (i >= 0) list[i] = item; // ya existe: lo actualiza
          else list.push(item);       // nuevo: lo añade
        }
      }
    }
  }
}

// Escribe los tres archivos finales
for (const [key, file] of Object.entries(targets)) {
  fs.writeFileSync(path.join(root, file), JSON.stringify(out[key], null, 2) + '\n');
}

console.log('JSON de componentes generado');