const BASE_OPTIONS = {
    baseURL: 'https://jsonplaceholder.typicode.com',
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    },
    timeout: 5000,
};

class Ajax {
    constructor(options = {}) {
        this.options = {
            ...BASE_OPTIONS,
            ...options,
            headers: {
                ...BASE_OPTIONS.headers,
                ...(options.headers || {}),
            },
        };
    }

    async _request(url, fetchOptions, localOptions = {}) {
        const config = {
            ...this.options,
            ...localOptions,
            headers: {
                ...this.options.headers,
                ...(localOptions.headers || {}),
            },
        };

        const finalUrl = config.baseURL + url;
        const controller = new AbortController();
        const timeout = config.timeout;

        const timeoutId = setTimeout(() => {
            controller.abort();
        }, timeout);

        try {
            const response = await fetch(finalUrl, {
                ...fetchOptions,
                headers: config.headers,
                signal: controller.signal,
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                let errorDetails = response.statusText;

                try {
                    const errorData = await response.json();
                    errorDetails =
                        errorData?.message || JSON.stringify(errorData);
                } catch (e) {}

                throw new Error(`HTTP ${response.status}: ${errorDetails}`);
            }

            if (response.status === 204) {
                return null;
            }

            try {
                return await response.json();
            } catch (e) {
                throw new Error('Response body is not valid JSON');
            }
        } catch (error) {
            if (error.name === 'AbortError') {
                throw new Error(`Request timed out after ${timeout}ms`);
            }

            throw new Error(`Network error: ${error.message}`);
        }
    }

    async get(url, options = {}) {
        return this._request(url, { method: 'GET' }, options);
    }

    async post(url, data, options = {}) {
        return this._request(
            url,
            {
                method: 'POST',
                body: JSON.stringify(data),
            },
            options
        );
    }

    async put(url, data, options = {}) {
        return this._request(
            url,
            {
                method: 'PUT',
                body: JSON.stringify(data),
            },
            options
        );
    }

    async delete(url, options = {}) {
        return this._request(url, { method: 'DELETE' }, options);
    }
}

export default Ajax;
