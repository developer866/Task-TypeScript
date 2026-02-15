const API_URL = "http://localhost:5000/api";

export const registerUser = async (userData: {userData: {name:string, email: string; password: string ,role:string}}) => {
  const response = await fetch(`${API_URL}/users/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  const data = await response.json(); // parse JSON

  if (!response.ok) {
    throw new Error(data.message || "Request failed"); // use backend message
  }


  return data;
};
