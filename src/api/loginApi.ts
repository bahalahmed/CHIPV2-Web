import axios from 'axios';

const API_URL = 'https://api.freeapi.app/api/v1/users/login';

export const loginUser = async (username: string, password: string) => {
  try {
    const response = await axios.post(
      API_URL,
      { username, password },
      {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        withCredentials: true, // important to handle httpOnly cookie
      }
    );
    return response.data;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Login failed');
  }
};
