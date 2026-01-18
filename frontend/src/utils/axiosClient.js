import axios from "axios";

const axiosClient=axios.create({
    baseURL: 'https://arcus-1.onrender.com',  
    withCredentials: true, // Include cookies in requests
    headers:{
        'Content-Type': 'application/json',  //data is in json format
    }
});

// axiosClient.post('/user/register', data )

export default axiosClient;
