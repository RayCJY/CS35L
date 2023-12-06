import axios from "axios";

const request = axios.create({
  baseURL: "/api",
  timeout: 5000,
});

request.interceptors.response.use(
  (response) => {
    if (response.status !== 200) {
      console.log(response.data.msg);
      return Promise.reject(response.data.msg)
    } else {
        return Promise.resolve(response.data)
    }
  },
  (error) => {
    console.log(error);
    return Promise.reject(error);
  }
);

export default request;
