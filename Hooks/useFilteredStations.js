import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
const useFilteredStations = () => {
  const currentClient = useSelector(
    (state) => state.currentClient.currentClient
  );

  const [filteredStationsResult, setFilteredStationsResult] = useState([]);
  const [selectedStation, setSelectedStation] = useState(null);

  // old code
  // * filtering the current client based on selected station
  // const filteredStationsResult = currentClient
  //   .fetchReports()
  //   .filter((report) => report.getData("clientStationId") === selectedStation);

  useEffect(() => {
    async function getReports() {
      if (currentClient) {
        try {
          const reports = await currentClient.fetchReports();
          if (selectedStation) {
            const filteredReports = reports.filter(
              (report) => report.getData("clientStationId") === selectedStation
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
