import fetch from 'node-fetch';
export class HttpClientService {
  constructor({ logger }) {
    this.logger = logger;
  }

  async post(url, options = {}) {
    const response = await fetch(url, {
      method: 'POST',
      ...options,
    });

    if (!response.ok) {
      const error = await response.text();
      this.logger.error(`HTTP Error: ${error}`);
      return null;
    }

    return await response.json();
  }

  async postFormData(url, formData) {
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
      headers: { ...formData.getHeaders() },
    });

    if (!response.ok) {
      const error = await response.text();
      this.logger.error(`HTTP Error: ${error}`);
      return null;
    }

    return await response.json();
  }
}
