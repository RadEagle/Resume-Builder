// use this for Vite
const base = import.meta.env.VITE_API_URL.replace(/\/$/, '') + '/';


// build URLs
function buildUrl(path: string) {
    if (base == undefined) {
        throw new Error('API URL is not defined');
    }
    return new URL(path, base).toString();
}


// fetch API with token
async function fetchApi(path: string, options?: RequestInit & { token?: string }) {
    const url = buildUrl(path)
    const headers = new Headers(options?.headers)
    if (options?.token) {
        headers.set('Authorization', `Bearer ${options.token}`)
    }
    const response = await fetch(url, { ...options, headers })
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
    }
    return response.json()
}

export { buildUrl, fetchApi };