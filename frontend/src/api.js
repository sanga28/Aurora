import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL + "/api/contract",
});

export const createWallet = async () => {
  const res = await API.get("/create");
  return res.data;
};

export const getBalance = async (address) => {
  const res = await API.get(`/balance/${address}`);
  return res.data;
};

export const executeContract = async (data) => {
  const res = await API.post("/execute", data);
  return res.data;
};
