import axios from 'axios'

// Set base URL so you don't have to type it every time
const API = axios.create({
    baseURL: 'http://localhost:3000/api/auth',
    withCredentials: true // This applies it to ALL requests automatically
});
export async function register({username,email,password})
{
    try {
       const response=await axios.post('http://localhost:3000/api/auth/register',{
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
        const response=await axios.post("http://localhost:3000/api/auth/logout",{
            withCredentials:true
        })
        return response.data
    } catch (error) {
        console.log(error)
    }
}
export async function getMe()
{
    try {
         const response=await axios.get("http://localhost:3000/api/auth/get-me",{
            withCredentials:true
        })
        return response.data
    } catch (error) {
        console.log(error)
    }
}
export const logoutUserAPI = async () => {
    try {
        const response = await fetch('http://localhost:3000/api/auth/logout', {
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