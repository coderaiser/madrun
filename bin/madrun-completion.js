#!/usr/bin/env node

'use strict';

const process = require('node:process');
const fs = require('node:fs');
const path = require('node:path');

const filename = path.join(__dirname, '..', 'shell/redrun-completion.sh');
const read = fs.createReadStream(filename);
const write = process.stdout;

read.pipe(write);
