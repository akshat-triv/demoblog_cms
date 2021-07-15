import { sendAlert } from "./alerts.js";
import axios from "axios";
import "regenerator-runtime/runtime";

export default async (env, form) => {
  for (var pair of form.entries()) {
    console.log(pair[0] + ", " + pair[1]);
  }
  try {
    const res = await axios({
      url: `${
        env === "dev"
          ? "https://akshattrivedi.herokuapp.com/api/v1/article"
          : "/api/v1/article"
      }`,
      method: "POST",
      data: form,
      headers: {
        "content-type": "multipart/form-data",
        Accept: "*/*",
        "Accept-Encodig": "gzip,deflate,br",
      },
      onUploadProgress: function (progressEvent) {
        let loaded = Math.floor(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        loaded -= 10;
        document.querySelector(".loading").style.width = `${loaded}%`;
      },
    });
    if (res) {
      document.querySelector(".loading").style.width = `100%`;
      setTimeout(() => {
        document.querySelector(".loading").style.opacity = "0";
      }, 2000);
      setTimeout(() => {
        document.querySelector(".loading").style.width = `0%`;
        document.querySelector(".loading").style.opacity = "1";
      }, 100);
      sendAlert("success", "posted");
    }
  } catch (err) {
    sendAlert("fail", "error logged in console");
    console.log(err);
  }
};
