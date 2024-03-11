import Client from "../Components/modals/client";
import Report from "../Components/modals/report";

export const fetchGeneral = async ({
  endpoint,
  body,
  successCallback,
  errorCallback,
  finallyCallback,
}) => {
  try {
    const url = process.env.API_BASE_URL + endpoint;
    // console.log("fetchgeneral url", url, JSON.stringify(body));
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (response.ok) {
      successCallback(data);
      return data;
    } else {
      errorCallback(data.error);
    }
  } catch (error) {
    errorCallback(error.message);
  } finally {
    finallyCallback();
  }
  return false;
};

export const fetchAllClients = async ({
  user,
  successCallback = () => {},
  errorCallback = () => {},
  finallyCallback = () => {},
}) => {
  let data = await fetchGeneral({
    endpoint: "api/clients_new.php",
    body: { id: user },
    successCallback,
    errorCallback,
    finallyCallback,
  });
  if (data) {
    return data.data.map((element) => new Client(element));
  }
  return false;
};

export const fetchClientLastReport = async ({
  user,
  client,
  successCallback = () => {},
  errorCallback = () => {},
  finallyCallback = () => {},
}) => {
  let data = await fetchGeneral({
    endpoint: "api/client_last_report.php",
    body: { id: user, client_id: client },
    successCallback,
    errorCallback,
    finallyCallback,
  });
  if (data) {
    return new Report(data.data);
  }
  return false;
};

export const fetchClientLast5Reports = async ({
  user,
  client,
  successCallback = () => {},
  errorCallback = () => {},
  finallyCallback = () => {},
}) => {
  let data = await fetchGeneral({
    endpoint: "api/client_last_5_reports.php",
    body: { id: user, client_id: client },
    successCallback,
    errorCallback,
    finallyCallback,
  });
  if (data) {
    return data.data;
  }
  return false;
};

export const fetchClientReports = async ({
  user,
  client,
  successCallback = () => {},
  errorCallback = () => {},
  finallyCallback = () => {},
}) => {
  // console.log("fetchGeneral");
  let data = await fetchGeneral({
    endpoint: "api/client_reports.php",
    body: { id: user, client_id: client },
    successCallback,
    errorCallback,
    finallyCallback,
  });
  if (data) {
    // console.log("data", data.data);
    return data.data.map((element) => new Report(element));
  }
  return false;
};
export default {
  fetchAllClients,
  fetchClientLastReport,
  fetchClientLast5Reports,
  fetchClientReports,
};
