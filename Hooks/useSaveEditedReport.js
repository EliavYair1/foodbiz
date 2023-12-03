import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import FetchDataService from "../Services/FetchDataService";
import { setCurrentReport } from "../store/redux/reducers/getCurrentReport";
import { setCurrentCategories } from "../store/redux/reducers/getCurrentCategories";
import { setClients } from "../store/redux/reducers/clientSlice";
import Client from "../Components/modals/client";
import "@env";
const useSaveEditedReport = () => {
  const dispatch = useDispatch();
  const { fetchData } = FetchDataService();
  const currentReport = useSelector(
    (state) => state.currentReport.currentReport
  );
  const userId = useSelector((state) => state.user);

  // * post request on the changes of the report edit
  const saveEditedReport = async (formData) => {
    try {
      const bodyFormData = new FormData();
      bodyFormData.append("id", currentReport.getData("id"));
      bodyFormData.append("workerId", currentReport.getData("workerId"));
      bodyFormData.append("clientId", currentReport.getData("clientId"));
      formData.clientStationId &&
        bodyFormData.append("clientStationId", formData.clientStationId);
      formData.accompany &&
        bodyFormData.append("accompany", formData.accompany);
      bodyFormData.append("haveFine", formData.haveFine);
      bodyFormData.append("haveAmountOfItems", formData.haveAmountOfItems);
      bodyFormData.append("haveSafetyGrade", formData.haveSafetyGrade);
      bodyFormData.append("haveCulinaryGrade", formData.haveCulinaryGrade);
      bodyFormData.append("haveNutritionGrade", formData.haveNutritionGrade);
      bodyFormData.append(
        "haveCategoriesNameForCriticalItems",
        formData.haveCategoriesNameForCriticalItems
      );
      formData.reportTime &&
        bodyFormData.append("reportTime", formData.reportTime);
      formData.newGeneralCommentTopText &&
        bodyFormData.append(
          "newGeneralCommentTopText",
          formData.newGeneralCommentTopText
        );
      formData.timeOfReport &&
        bodyFormData.append("timeOfReport", formData.timeOfReport);
      bodyFormData.append("data", []);
      bodyFormData.append("status", currentReport.getData("status"));
      bodyFormData.append(
        "newCategorys",
        ";" + formData.categorys.join("|;") + "|"
      );
      bodyFormData.append("file1", currentReport.getData("file1"));
      bodyFormData.append("file2", currentReport.getData("file2"));
      bodyFormData.append(
        "positiveFeedback",
        currentReport.getData("positiveFeedback")
      );

      const apiUrl = process.env.API_BASE_URL + "ajax/saveReport2.php";
      const response = await axios.post(apiUrl, bodyFormData);
      if (response.status === 200 || response.status === 201) {
        currentReport.setData(
          "newGeneralCommentTopText",
          formData.newGeneralCommentTopText
        );

        const responseClients = await fetchData(
          process.env.API_BASE_URL + "api/clients.php",
          { id: userId }
        );

        if (responseClients.success) {
          const clients = responseClients.data.map(
            (element) => new Client(element)
          );
          dispatch(setClients({ clients }));
        }

        dispatch(setCurrentReport(currentReport));
        dispatch(setCurrentCategories(formData.categorys));
        console.log("success saving the changes...");
      }
      return response.data;
    } catch (error) {
      console.error("Error making POST request:", error);
    }
  };

  return saveEditedReport;
};

export default useSaveEditedReport;
