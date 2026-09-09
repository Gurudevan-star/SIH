const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8000/api";

async function request(endpoint, options = {}) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!response.ok) {
    let message = "API request failed";

    try {
      const error = await response.json();
      message = error.detail || message;
    } catch {
      // Ignore JSON parsing errors
    }

    throw new Error(message);
  }

  return response.status === 204 ? null : response.json();
}

export const api = {
  createCase(data) {
    return request("/cases", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  createInvestigation(data) {
    return request("/investigations", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  getInvestigation(id) {
    return request(`/investigations/${id}`);
  },

  getStatus(id) {
    return request(`/investigations/${id}/status`);
  },

  getTransactions(id) {
    return request(`/investigations/${id}/transactions`);
  },

  getGraph(id) {
    return request(`/investigations/${id}/graph`);
  },

  getClusters(id) {
    return request(`/investigations/${id}/clusters`);
  },

  getExchangeMatches(id) {
    return request(`/investigations/${id}/exchanges`);
  },

  getRisk(id) {
    return request(`/investigations/${id}/risk`);
  },

  getEvidence(id) {
    return request(`/investigations/${id}/evidence`);
  },

  getReport(id) {
    return request(`/investigations/${id}/report`);
  },

  startMonitoring(id) {
    return request(`/investigations/${id}/monitoring`, {
      method: "POST",
    });
  },

  stopMonitoring(id) {
    return request(`/investigations/${id}/monitoring`, {
      method: "DELETE",
    });
  },
};