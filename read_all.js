import fs from 'fs';
import PATH from 'path';

const DIR = process.cwd();

const PROBLEMS = [];

const FILES_IN_DIR = fs.readdirSync(DIR, { withFileTypes: true });

for (const suitable_files of FILES_IN_DIR) {
  if (suitable_files.isDirectory()) {
    const DIRPATH = PATH.join(DIR, suitable_files.name);
    const INFOPATH = PATH.join(DIRPATH, 'info.json');

    if (fs.existsSync(INFOPATH)) {
      const INFO_read = fs.readFileSync(INFOPATH, 'utf8');
      const INFO = JSON.parse(INFO_read);

      PROBLEMS.push({
        PATH: DIRPATH,
        ...INFO
      });
    }
  }
}

console.log('Collected problems:');
console.log(PROBLEMS);
