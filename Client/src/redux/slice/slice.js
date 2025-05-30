import { createApi } from "@reduxjs/toolkit/query/react";
import { localStoragekeys, main_backend_url } from "../../imports/mainExports";
import { apiHandler } from "../../functions/apiHandler";
import { ToastHandler } from "../../components/myToast/ToastHandler";
import { ToastConst } from "../../constants";
import getToken from "@/imports/getToken";

const baseQueryFunc = async (payload, api) => {
  const token = getToken();
  const requestObj = {
    method: payload.method,
    url: `${main_backend_url}${payload.url}`,
    data: payload.body,
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
      "Content-Type": payload.contentType ?? "application/json",
    },
    withCredentials: true, // Enable credentials
  };
  const response = await apiHandler(requestObj);
  let responseObj = {};
  if (response.status_code === 200 || response.status_code === 201) {
    if (payload.msz) {
      // alert(response.msg);
      console.log("aklf msg", response);
      ToastHandler(ToastConst.success, response.msg);
    }
    responseObj = {
      data: response,
    };
  } else if (
    response.status_code === 400 ||
    response.status_code === 401 ||
    response.status_code === 402 ||
    response.status_code === 404
  ) {
    if (!payload.skipError) {
      // alert(response.msg);
      ToastHandler(ToastConst.warn, response.msg);
    }
    responseObj = {
      error: response,
    };
  } else {
    ToastHandler(ToastConst.error, response.msg);
    responseObj = {
      error: response,
    };
  }
  return responseObj;
};

export const slice = createApi({
  reducerPath: "api",
  baseQuery: baseQueryFunc,
  endpoints: (builder) => ({}),
});
