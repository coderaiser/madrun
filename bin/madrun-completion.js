#!/usr/bin/env node

import process from 'node:process';
import fs from 'node:fs';
import path, {dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const filename = path.join(__dirname, '..', 'shell/redrun-completion.sh');
const read = fs.createReadStream(filename);
const write = process.stdout;

read.pipe(write);
