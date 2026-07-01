import {run, series, parallel, cutEnv} from '../lib/madrun.js';

// THROWS Argument of type 'number' is not assignable to parameter of type 'string | string[]'
run(1);

// THROWS Argument of type 'number' is not assignable to parameter of type 'string | string[]'
series(1);

// THROWS Argument of type 'number' is not assignable to parameter of type 'string | string[]'
parallel(1);

// THROWS Argument of type 'number' is not assignable to parameter of type 'string | string[]'
cutEnv(1);
