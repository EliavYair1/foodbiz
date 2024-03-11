import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentReport } from "../store/redux/reducers/getCurrentReport";
import { setCurrentCategories } from "../store/redux/reducers/getCurrentCategories";
import { setClients } from "../store/redux/reducers/clientSlice";
// import Client from "../Components/modals/client";
import FetchDataService from "../Services/FetchDataService";
import "@env";
import { fetchAllClients } from "../Services/fetchClients";
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
      const date = new Date(formData.timeOfReport);
      const formattedDate = date.toLocaleDateString("en-GB");
      formData.timeOfReport = formattedDate;

      formData.id = currentReport.getData("id");
      formData.data = [];
      formData.newCategorys = ";" + formData.categorys.join("|;") + "|";
      formData.status = currentReport.getData("status");
      formData.file1 = currentReport.getData("file1");
      formData.file2 = currentReport.getData("file2");
      formData.positiveFeedback = currentReport.getData("positiveFeedback");

      console.log("form data", formData);
      const apiUrl = process.env.API_BASE_URL + "ajax/saveReport2.php";
      // console.log(
      //   "bodyFormData",
      //   JSON.stringify(Object.fromEntries(bodyFormData))
      // );
      const response = await fetchData(apiUrl, formData);
      // const response = await axios.post(apiUrl, bodyFormData);

      console.log("response123", response);
      // console.log("response", response.status);

      if (response.success) {
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
        // console.log("clients", clients);
        if (clients) {
          dispatch(setClients({ clients: clients }));
        }

        dispatch(setCurrentReport(currentReport));
        dispatch(setCurrentCategories(formData.categorys));
        console.log("success saving the changes...");
      }
      return response;
    } catch (error) {
      console.error("[saveEditedReport]Error making POST request:", error);
    }
  };

  return saveEditedReport;
};

export default useSaveEditedReport;
