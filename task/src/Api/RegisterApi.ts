const API_URL = "http://localhost:5000/api";

export const registerUser = async (userData: any) => {
  const response = await fetch(`${API_URL}/users/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    throw new Error("Request failed");
  }

  return response.json();
};
