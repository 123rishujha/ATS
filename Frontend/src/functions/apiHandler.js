import axios from "axios";

export const apiHandler = async (requestObj) => {
  try {
    const res = await axios({
      ...requestObj,
      withCredentials: true,
    });
    console.log("rrrrrrrrrres", res);
    if (res.status === 200 || res.status === 201) {
      return { ...res.data, status_code: res.status };
    }
  } catch (error) {
    if (error.response && error.code !== "ERR_NETWORK") {
      return {
        ...(error?.response?.data || {}),
        status_code: error?.response?.status,
      };
    } else if (error.code === "ERR_NETWORK") {
      return {
        status_code: 500,
        msg: error.msg || "",
      };
    } else {
      console.log("ajdf j error", error);
      return {
        status_code: 500,
        msg: "uncaught error",
      };
    }
  }
};