import { toast } from "react-toastify";
import { ToastConst } from "../../constants";

export const ToastHandler = (status, message) => {
  if (status === ToastConst.warn) {
    toast.warn(typeof message === "string" ? message : "Invalid message", {
      theme: "colored",
      // autoClose: 1000,
      style: {
        textTransform: "capitalize",
      },
    });
  } else if (status === ToastConst.error) {
    toast.error(typeof message === "string" ? message : "Invalid message", {
      theme: "colored",
      // autoClose: 1000,
      style: {
        textTransform: "capitalize",
      },
    });
  } else {
    toast.success(typeof message === "string" ? message : "Invalid message", {
      theme: "colored",
      // autoClose: 1000,
      style: {
        textTransform: "capitalize",
      },
    });
  }
};
