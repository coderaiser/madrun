type Scripts = Record<string, (...args: any[]) => any>;
type Env = Record<string, string | number | undefined>;

export function cutEnv(names: string | string[], opts?: string, env?: Env, scripts?: Scripts): Promise<string>;

export function run(name: string | string[], opts?: string, env?: Env, scripts?: Scripts): Promise<string>;

export function series(names: string | string[], opts?: string, env?: Env, scripts?: Scripts): Promise<string>;

export function parallel(names: string | string[], opts?: string, env?: Env, scripts?: Scripts): Promise<string>;

