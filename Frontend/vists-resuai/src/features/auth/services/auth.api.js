import axios from 'axios'

// Set base URL so you don't have to type it every time
const API = axios.create({
    baseURL: 'https://vista-resuai-3.onrender.com/api/auth',
    withCredentials: true // This applies it to ALL requests automatically
});
export async function register({username,email,password})
{
    try {
       const response=await axios.post('https://vista-resuai-3.onrender.com/api/auth/register',{
        username,email,password
    },{
        withCredentials:true
    })
    return response.data
    } catch (error) {
        console.log(error)
    }
}
export async function login({email,password})
{
  try {
        const response = await API.post('/login', { email, password });
        return response.data;
    } catch (error) {
        // This will show you exactly what the server's 400 error message is
        console.error("Login Error:", error.response?.data || error.message);
        throw error; // Throw it so your UI component can catch it
    }
    
}

export async function logout()
{
    try {
        const response=await axios.post("https://vista-resuai-3.onrender.com/api/auth/logout",{
            withCredentials:true
        })
        return response.data
    } catch (error) {
        console.log(error)
    }
}
export async function getMe()
{
   const token = localStorage.getItem('token');
    const response = await axios.get(`https://vista-resuai-3.onrender.com/api/auth/me`, {
        headers: {
            Authorization: `Bearer ${token}` // 👈 THIS MUST BE HERE
        }
    });
    return response.data;
}
export const logoutUserAPI = async () => {
    try {
        const response = await fetch('https://vista-resuai-3.onrender.com/api/auth/logout', {
            method: 'POST', // or GET, depending on your backend setup
            headers: {
                'Content-Type': 'application/json',
            },
            // credentials: 'include' // Uncomment if you are clearing httpOnly cookies
        });

        if (!response.ok) {
            throw new Error("Failed to logout from server");
        }

        return await response.json();
    } catch (error) {
        console.error("API Error during logout:", error);
        throw error;
    }
};