const BASE_URL = "http://localhost:8080/api"

export const apiFetch = async (path: string, options: RequestInit = {}) => {
    const token = localStorage.getItem("token")

    const response = await fetch( `${BASE_URL}${path}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...(token ? {Authorization: `Bearer ${token}`} : {}),
            ...options.headers,
        }
    } )

    if(!response.ok) 
        throw new Error(`${response.status}`)
    
    const text = await response.text();
    
    try {
    return JSON.parse(text);
    } catch {
    return text;
    }

}