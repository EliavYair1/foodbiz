import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentReport } from "../store/redux/reducers/getCurrentReport";
import { setCurrentCategories } from "../store/redux/reducers/getCurrentCategories";
import { setClients } from "../store/redux/reducers/clientSlice";
// import Client from "../Components/modals/client";
// import FetchDataService from "../Services/FetchDataService";
import "@env";
import { fetchAllClients } from "../Services/fetchClients";
const useSaveEditedReport = () => {
  const dispatch = useDispatch();
  // const { fetchData } = FetchDataService();
  const currentReport = useSelector(
    (state) => state.currentReport.currentReport
  );
  const userId = useSelector((state) => state.user);

  // * post request on the changes of the report edit
  const saveEditedReport = async (formData) => {
    try {
      console.log("[saveEditedReport]formData in", formData);
      const bodyFormData = new FormData();
      bodyFormData.append("id", currentReport.getData("id")); // !required
      bodyFormData.append("workerId", currentReport.getData("workerId")); // !required
      bodyFormData.append("clientId", currentReport.getData("clientId")); // !required
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
      bodyFormData.append("data", []); // !required
      bodyFormData.append("status", currentReport.getData("status")); // !required
      bodyFormData.append(
        "newCategorys",
        ";" + formData.categorys.join("|;") + "|"
      ); // !required
      bodyFormData.append("file1", currentReport.getData("file1"));
      bodyFormData.append("file2", currentReport.getData("file2"));
      bodyFormData.append(
        "positiveFeedback",
        currentReport.getData("positiveFeedback")
      );
      bodyFormData.append(
        "newGeneralCommentTopText",
        formData.newGeneralCommentTopText
      ); // !required

      const apiUrl = process.env.API_BASE_URL + "ajax/saveReport2.php";
      console.log("url", apiUrl);
      console.log("bodyFormData", typeof bodyFormData);
      const response = await axios.post(apiUrl, bodyFormData);
      console.log("response", response);
      console.log("response", response.status);

      if (response.status === 200 || response.status === 201) {
        currentReport.setData(
          "newGeneralCommentTopText",
          formData.newGeneralCommentTopText
        );

        const clients = await fetchAllClients({
          user: userId,
          errorCallback: (error) => {
            console.log("useSaveEditedReport]:error:", error);
          },
        });
        console.log("clients", clients);
        if (clients) {
          dispatch(setClients({ clients: clients }));
        }

        dispatch(setCurrentReport(currentReport));
        dispatch(setCurrentCategories(formData.categorys));
        console.log("success saving the changes...");
      }
      return response.data;
    } catch (error) {
      console.log("message", error.message);
      console.error("[saveEditedReport]Error making POST request:", error);
    }
  };

  return saveEditedReport;
};

export default useSaveEditedReport;
