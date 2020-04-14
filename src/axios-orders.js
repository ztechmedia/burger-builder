import axios from "axios";

const instance = axios.create({
  baseURL: "https://react-my-burger-12831.firebaseio.com/",
});

export default instance;
