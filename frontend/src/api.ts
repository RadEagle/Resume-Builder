// use this for Vite
const base = import.meta.env.VITE_API_URL.replace(/\/$/, '') + '/';


// build URLs
function buildUrl(path: string) {
    if (base == undefined) {
        throw new Error('API URL is not defined');
    }
    return new URL(path, base).toString();
}

export { buildUrl };