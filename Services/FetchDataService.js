import { useState, useEffect } from "react";
import axios from "axios";

const FetchDataService = () => {
  const fetchData = async (url, data, method = "post") => {
    try {
      const config = {
        method: method,
        url: url,
        headers: {
          "Content-Type": "application/json",
        },
        data: JSON.stringify(data),
      };

      return { success: true, ...(await axios(config)).data };
    } catch (error) {
      return { success: false, ...error.response.data };
    }
  };

  return { fetchData };
};

export default FetchDataService;
