const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Helper per gestire le risposte
async function handleResponse(response) {
    if (response.status === 204) {
        return null;
    }

    if (response.status === 200 && response.headers.get('content-length') === '0') {
        return response;
    }

    try {
        const data = await response.json();

        if (!response.ok) {
            if (response.status === 401) {
                window.dispatchEvent(new CustomEvent('auth-error', {
                    detail: {
                        status: 401,
                        message: data.message || 'Sessione scaduta'
                    }
                }));
            }

            throw {
                status: response.status,
                message: data.message || 'Errore nella richiesta',
                data
            };
        }

        return data;
    } catch (error) {
        if (!response.ok) {
            throw {
                status: response.status,
                message: `Errore HTTP: ${response.status}`,
                data: null
            };
        }
        throw error;
    }
}

// GET
export async function get(endpoint) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include'
    });
    return handleResponse(response);
}

// POST
export async function post(endpoint, data) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data)
    });
    return handleResponse(response);
}

// PUT
export async function put(endpoint, data) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data)
    });
    return handleResponse(response);
}

//PATCH
export async function patch(endpoint, data) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data)
    });
    return handleResponse(response);
}

// DELETE
export async function del(endpoint) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include'
    });
    return handleResponse(response);
}

//HEAD

//inizialmente usato per il checksession, ma per compatibilità è stato cambiato con get
export async function head(endpoint, data = {}) {
    const token = localStorage.getItem('token');
    const url = `${API_BASE_URL}${endpoint}`;

    const response = await fetch(url, {
        method: 'HEAD',
        headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
        },
        credentials: 'include'
    });

    if (!response.ok) {
        const error = new Error(`HTTP error! status: ${response.status}`);
        error.status = response.status;
        error.response = response;
        throw error;
    }

    return response;
}

