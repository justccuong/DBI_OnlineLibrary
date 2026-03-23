const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || ""

const buildUrl = (path, query) => {
    const url = new URL(`${API_BASE_URL}${path}`, window.location.origin)

    if (query) {
        Object.entries(query).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== "") {
                url.searchParams.set(key, value)
            }
        })
    }

    return url.toString()
}

const request = async (path, options = {}) => {
    const { method = "GET", body, token, query } = options
    const response = await fetch(buildUrl(path, query), {
        method,
        headers: {
            ...(body ? { "Content-Type": "application/json" } : {}),
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: body ? JSON.stringify(body) : undefined,
    })

    const text = await response.text()
    const data = text ? JSON.parse(text) : null

    if (!response.ok) {
        throw new Error(data?.message || "Request failed")
    }

    return data
}

export const api = {
    get: (path, options) => request(path, { ...options, method: "GET" }),
    post: (path, body, options) => request(path, { ...options, method: "POST", body }),
    put: (path, body, options) => request(path, { ...options, method: "PUT", body }),
    delete: (path, options) => request(path, { ...options, method: "DELETE" }),
}
