export const localStoragekeys = {
  userState: "userState",
};
export const USER_ROLES = JSON.parse(import.meta.env.VITE_USER_ROLE);

const main_backend_url =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:8080/";



export { main_backend_url };
