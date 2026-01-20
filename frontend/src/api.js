const BASE_URL = "http://localhost:3000";

function getToken() {
  return localStorage.getItem("token");
}

export async function apiGet(path) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  });
  return res.json();
}

export async function apiPost(path, body = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`
    },
    body: JSON.stringify(body)
  });
  return res.json();
}
