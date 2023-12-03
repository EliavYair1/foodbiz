import Client from "../Components/modals/client";

const fetchClients = async (
  user,
  endpoint,
  successCallback,
  errorCallback,
  finallyCallback
) => {
  try {
    const url = process.env.API_BASE_URL + endpoint;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: user }),
    });

    const data = await response.json();

    if (response.ok) {
      let clients = data.data.map((element) => new Client(element));
      successCallback(clients);
    } else {
      errorCallback(data.error);
    }
  } catch (error) {
    errorCallback(error.message);
  } finally {
    finallyCallback();
  }
};
export default fetchClients;
