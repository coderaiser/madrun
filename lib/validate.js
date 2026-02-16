import {tryCatch} from 'try-catch';

export default (runners) => {
    for (const run of Object.keys(runners)) {
        const [e] = tryCatch(run);
        
        if (e)
            return e;
    }
    
    return null;
};
