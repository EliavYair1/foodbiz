import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
const useFilteredStations = () => {
  const currentClient = useSelector(
    (state) => state.currentClient.currentClient
  );

  const [filteredStationsResult, setFilteredStationsResult] = useState([]);
  const [selectedStation, setSelectedStation] = useState(false);
  // todo the selectedStation return the company instead all of the object
  // console.log("[useFilteredStations] selected Station", selectedStation);
  // console.log("filteredStationsResult", filteredStationsResult);
  // console.log("currentClient.getStations()", currentClient.getStations());
  // old code
  // * filtering the current client based on selected station
  // const filteredStationsResult = currentClient
  //   .fetchReports()
  //   .filter((report) => report.getData("clientStationId") === selectedStation);
  // console.log("selectedStation", selectedStation);
  useEffect(() => {
    async function getReports() {
      if (currentClient) {
        try {
          const reports = await currentClient.fetchReports();
          if (selectedStation) {
            const filteredReports = reports.filter(
              (report) =>
                report.getData("clientStationId") == selectedStation?.id
            );
            setFilteredStationsResult(filteredReports);
          }
        } catch (error) {
          console.error("Error fetching or filtering reports:", error);
        }
      }
    }

    getReports();
  }, [currentClient, selectedStation]);

  return {
    filteredStationsResult,
    selectedStation,
    setSelectedStation,
  };
};

export default useFilteredStations;
