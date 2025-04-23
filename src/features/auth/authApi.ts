// src/features/auth/authApi.ts
import axios from 'axios';

const API_URL = 'https://api.freeapi.app/api/v1/users';

export const loginUser = async (username: string, password: string) => {
  const response = await axios.post(
    `${API_URL}/login`,
    {
      username, // 👈 FreeAPI expects "username"
      password,
    },
    {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      withCredentials: true, // 👈 required if using cookies
    }
  );
  return response.data;
};
