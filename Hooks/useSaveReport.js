import { useState } from "react";
import axios from "axios";
import "@env";
const useSaveReport = () => {
  const [isLoading, setIsLoading] = useState(false);

  const saveReport = async (reportData) => {
    try {
      setIsLoading(true);
      const apiUrl = process.env.API_BASE_URL + "ajax/saveReport.php";
      const response = await axios.post(apiUrl, reportData);
      if (response.status == 200 || response.status == 201) {
        setIsLoading(false);
        return true;
      }
    } catch (error) {
      setIsLoading(false);
      console.error("Error making POST request:", error);
      return false;
    }
  };

  return { saveReport, isLoading };
};

export default useSaveReport;
