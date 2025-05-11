import Cookies from "js-cookie";

export const getUser = () => {
  const token = Cookies.get("token");

  if (!token) return;

  return JSON.parse(token);
};
