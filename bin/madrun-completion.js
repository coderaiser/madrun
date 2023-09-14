#!/usr/bin/env node

'use strict';

const process = require('process');
const fs = require('fs');
const path = require('path');

const filename = path.join(__dirname, '..', 'shell/redrun-completion.sh');
const read = fs.createReadStream(filename);
const write = process.stdout;

read.pipe(write);
