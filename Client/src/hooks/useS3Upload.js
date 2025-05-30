import { useSelector } from "react-redux";
import axios from "axios";
import { ToastHandler } from "@/components/myToast/ToastHandler";
import { main_backend_url } from "@/imports/mainExports";

const useS3Upload = () => {
  const { userState } = useSelector((store) => store.user);

  const handleUploadFileS3 = async (file, keyName, isStaticKey) => {
    try {
      let key = "";

      key = `${keyName}-${Date.now()}`;
      const response = await axios({
        method: "PUT",
        url: `${main_backend_url}api/aws-presigned-url-create`,
        data: {
          key: key,
          contentType: file.type,
          isPrivate: false,
        },
        headers: {
          Authorization: userState.token ? `Bearer ${userState.token}` : "",
          "Content-Type": "application/json",
        },
      });
      if (response?.data?.data?.presignedUrl) {
        const uploadRes = await axios({
          method: "PUT",
          url: response.data.data.presignedUrl,
          onUploadProgress: (progress) => console.log("progres", progress),
          headers: {
            "Content-Type": file.type,
          },
          data: file,
        });
        console.log("upload res", uploadRes);
        if (uploadRes.statusText === "OK") {
          return {
            previewLink: response?.data?.data?.previewLink,
            mainKey: response?.data?.data?.mainKey,
          };
        } else {
          ToastHandler("warn", "Something");
        }
      }
    } catch (error) {
      if (error.code === "ERR_NETWORK") {
        ToastHandler("dan", error.message);
      } else if (error.code !== "ERR_NETWORK" && error.response) {
        ToastHandler("warn", error?.response?.data?.message);
      } else {
        ToastHandler("warn", error?.message);
      }
    }
  };

  return { handleUploadFileS3 };
};

export default useS3Upload;
