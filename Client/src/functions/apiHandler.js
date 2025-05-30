import axios from "axios";

export const apiHandler = async (requestObj) => {
  try {
    const res = await axios({
      ...requestObj,
      withCredentials: true,
      timeout: 10000, // 10 second timeout
    });

    if (res.status === 200 || res.status === 201) {
      return { ...res.data, status_code: res.status };
    }
  } catch (error) {
    console.error("API Error:", error);

    // Handle CORS errors
    if (error.code === "ERR_NETWORK") {
      return {
        status_code: 500,
        msg: "Network error. Please check your connection and try again.",
      };
    }

    // Handle timeout errors
    if (error.code === "ECONNABORTED") {
      return {
        status_code: 408,
        msg: "Request timeout. Please try again.",
      };
    }

    // Handle other errors
    if (error.response) {
      return {
        ...(error.response.data || {}),
        status_code: error.response.status,
      };
    }

    // Handle unexpected errors
    return {
      status_code: 500,
      msg: "An unexpected error occurred. Please try again.",
    };
  }
};
