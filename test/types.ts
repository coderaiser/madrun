import {run, series, parallel, cutEnv} from '../lib/madrun.js';

// These should all pass type checking
export const a: Promise<string> = run('test');
export const b: Promise<string> = run(['lint', 'test']);
export const c: Promise<string> = run('lint', '--fix');
export const d: Promise<string> = run('lint', '', {NODE_ENV: 'test'});
export const e: Promise<string> = run('lint', '', {}, {});
export const f: Promise<string> = series('test');
export const g: Promise<string> = series(['lint', 'test']);
export const h: Promise<string> = parallel('test');
export const i: Promise<string> = parallel(['lint', 'test']);
export const j: Promise<string> = cutEnv('test');
export const k: Promise<string> = cutEnv(['lint', 'test']);
