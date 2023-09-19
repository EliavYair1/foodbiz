import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Alert,
  SafeAreaView,
  Dimensions,
  Platform,
} from "react-native";
import React, { useState, useRef, useEffect, useMemo } from "react";
import useScreenNavigator from "../../Hooks/useScreenNavigator";
import ScreenWrapper from "../../utiles/ScreenWrapper";
import fonts from "../../styles/fonts";
import { LinearGradient } from "expo-linear-gradient";
import colors from "../../styles/colors";
import Accordion from "../../Components/ui/Accordion";
import { FlatList } from "react-native-gesture-handler";
import SelectMenu from "../../Components/ui/SelectMenu";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import Input from "../../Components/ui/Input";
import ToggleSwitch from "../../Components/ui/ToggleSwitch";
import DatePicker from "../../Components/ui/datePicker";
import {
  RichEditor,
  RichToolbar,
  actions,
} from "react-native-pell-rich-editor";
import ColorPicker from "react-native-wheel-color-picker";

import accordionCloseIcon from "../../assets/imgs/accordionCloseIndicator.png";
import accordionOpenIcon from "../../assets/imgs/accordionOpenIndicator.png";
import ClientItemArrow from "../../assets/imgs/ClientItemArrow.png";
import ClientItemArrowOpen from "../../assets/imgs/accodionOpenIndicatorBlack.png";
import onDragIcon from "../../assets/imgs/onDragIcon.png";
import { debounce } from "lodash";
import "@env";
import axios from "axios";
import CheckboxItem from "./CheckboxItem/CheckboxItem";
import Loader from "../../utiles/Loader";
import { HelperText } from "react-native-paper";
import Drawer from "../../Components/ui/Drawer";
import FileIcon from "../../assets/icons/iconImgs/FileIcon.png";
import routes from "../../Navigation/routes";
import { getCurrentCategory } from "../../store/redux/reducers/getCurrentCategory";
import { setCurrentCategories } from "../../store/redux/reducers/getCurrentCategories";
import { setCurrentReport } from "../../store/redux/reducers/getCurrentReport";
import "@env";
import Header from "../../Components/ui/Header";
import GoBackNavigator from "../../utiles/GoBackNavigator";
import Client from "../../Components/modals/client";
import { setClients, changeClientOnIndex } from "../../store/redux/reducers/clientSlice";
import FetchDataService from "../../Services/FetchDataService";
import Report from "../../Components/modals/report";


const windowWidth = Dimensions.get("window").width;
const WorkerNewReport = () => {
  const { fetchData } = FetchDataService();
  const richText = useRef();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const { navigateToRoute } = useScreenNavigator();
  const [colorSelected, setColorSelected] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const currentClient = useSelector(
    (state) => state.currentClient.currentClient
  );
  const currentReport = useSelector(
    (state) => state.currentReport.currentReport
  );

  const userId = useSelector((state) => state.user);
  const reportsTimes = useSelector((state) => state.reportsTimes.reportsTimes);
  const currentCategories = useSelector((state) => state.currentCategories);
  const globalCategories = useSelector((state) => state.globalCategories);
  let clients = useSelector((state) => state.clients);

  const memoizedCategories = useMemo(
    () => globalCategories,
    [globalCategories]
  );
  // console.log("currentCategories", currentCategories);
  const [isSchemaValid, setIsSchemaValid] = useState(false);
  const [IsRearrangement, setIsRearrangement] = useState(false);
  const [formData, setFormData] = useState({
    clientId: currentClient?.id,
    id: userId,
    haveNewGeneralCommentsVersion: 1,
    haveFine: false,
    haveAmountOfItems: false,
    haveSafetyGrade: true,
    haveCulinaryGrade: true,
    haveNutritionGrade: true,
    haveCategoriesNameForCriticalItems: false,
    rearrangement: IsRearrangement,
  });
  const [checkboxStatus, setCheckboxStatus] = useState({
    foodSafetyReviewCbStatus: [],
    culinaryReviewCbStatus: [],
    nutritionReviewCbStatus: [],
  });
  const [selectedStation, setSelectedStation] = useState(null);
  const [currentReportTime, setCurrentReportTime] = useState(null);
  const [accompanySelected, setAccompanySelected] = useState(null);
  const [categoryAccordionHeight, setCategoryAccordionHeight] = useState(172);
  const [switchStates, setSwitchStates] = useState({
    haveFine: false,
    haveAmountOfItems: false,
    haveSafetyGrade: true,
    haveCulinaryGrade: true,
    haveNutritionGrade: true,
    haveCategoriesNameForCriticalItems: false,
  });
  const [currentReportDate, setCurrentReportDate] = useState(null);

  // * categories checkboxes Texts
  const [foodSafetyReviewTexts, setFoodSafetyReviewTexts] = useState(
    memoizedCategories?.categories?.[1]?.categories ?? []
  );
  const [culinaryReviewTexts, setCulinaryReviewTexts] = useState(
    memoizedCategories?.categories?.[2]?.categories ?? []
  );
  const [nutritionReviewTexts, setNutritionReviewTexts] = useState(
    memoizedCategories?.categories?.[3]?.categories ?? []
  );
  const schema = yup.object().shape({
    clientStationId: yup.string().required("station is required"),
    previousReports: yup.string().required("previous report is required"),
    accompany: yup.string().required("accompany is required"),
    timeOfReport: yup.string().required("date is required"),
    reportTime: yup.string(),
    categorys: yup
      .array()
      .of(yup.number())
      .test("please choose at least one category", (value) => {
        const foodSafetyReviewSelected =
          Array.isArray(value) &&
          value.some(
            (id) =>
              Array.isArray(checkboxStatus.foodSafetyReviewCbStatus) &&
              checkboxStatus.foodSafetyReviewCbStatus.includes(id)
          );

        const culinaryReviewSelected =
          Array.isArray(value) &&
          value.some(
            (id) =>
              Array.isArray(checkboxStatus.culinaryReviewCbStatus) &&
              checkboxStatus.culinaryReviewCbStatus.includes(id)
          );

        const nutritionReviewSelected =
          Array.isArray(value) &&
          value.some(
            (id) =>
              Array.isArray(checkboxStatus.nutritionReviewCbStatus) &&
              checkboxStatus.nutritionReviewCbStatus.includes(id)
          );
        return (
          foodSafetyReviewSelected ||
          culinaryReviewSelected ||
          nutritionReviewSelected
        );
      }),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
    getValues,
    setValue,
    watch,
    trigger,
  } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    schema
      .validate(formData)
      .then(() => setIsSchemaValid(true))
      .catch((err) => {
        // console.log("err:", err);
        setIsSchemaValid(false);
      });
    setValue("clientId", currentClient?.id);
  }, [formData, schema]);

  const findReportTimeName = (data) => {
    const reportTimeId = currentReport?.getReportTime();
    const reportTime = data.find((item) => item.id === reportTimeId);
    return reportTime ? reportTime.name : "";
  };

  //  * edit mode existing current report initialization
  useEffect(() => {
    const reportTimeName = findReportTimeName(reportsTimes);
    if (currentReport) {
      setSwitchStates({
        haveFine: currentReport.getData("haveFine") == "1",
        haveAmountOfItems: currentReport.getData("haveAmountOfItems") == "1",
        haveSafetyGrade: currentReport.getData("haveSafetyGrade") == "1",
        haveCulinaryGrade: currentReport.getData("haveCulinaryGrade") == "1",
        haveNutritionGrade: currentReport.getData("haveNutritionGrade") == "1",
        haveCategoriesNameForCriticalItems:
          currentReport.getData("haveCategoriesNameForCriticalItems") == "1",
      });
      setSelectedStation(currentReport.getData("station_name"));
      setAccompanySelected(currentReport.getData("accompany"));
      setCurrentReportDate(currentReport.getData("timeOfReport"));
      setCurrentReportTime(reportTimeName);
      handleContentChange(currentReport.getData("newGeneralCommentTopText"));
      handleCheckboxStatusChange(
        parsedArrayOfStr(currentReport.getData("categorys"))
      );
    }
  }, [currentReport]);

  // * inner accordionCategoriesItem
  function accordionCategoriesItem(names, categoryName) {
    // console.log("names", names);
    return names.map((item, index) => {
      // console.log("checkboxStatus", checkboxStatus);
      const checkboxKey = `${categoryName}${index + 1}`;
      const categoryStatus = checkboxStatus[`${categoryName}Status`];
      const checkboxValue =
        categoryStatus && Array.isArray(categoryStatus)
          ? categoryStatus.includes(parseInt(item.id))
          : false;
      // console.log("checkboxValue:", checkboxValue);

      return {
        id: item.id,
        text: (
          <View>
            <CheckboxItem
              key={checkboxKey + checkboxValue}
              label={checkboxKey}
              checkboxItemText={item.name}
              checked={checkboxValue}
              handleChange={(checked) => {
                handleCategoriesCheckboxesToggle(
                  `${categoryName}Status`,
                  checked,
                  item.id
                );
              }}
            />
          </View>
        ),
        boxItem: <Image style={{ width: 9, height: 14 }} source={onDragIcon} />,
      };
    });
  }

  // * checkbox counter
  const getCheckedCount = (category) => {
    const categoryStatus = checkboxStatus[`${category}Status`];
    return categoryStatus ? categoryStatus.length : 0;
  };

  // * redefine the Accordion height
  const changeCategoryAccordionHeight = (height, toggle) => {
    if (toggle) {
      setCategoryAccordionHeight((prev) => prev + height);
    } else {
      setCategoryAccordionHeight((prev) => prev - height);
    }
  };

  // * filtering the current client based on selected station
  const filteredStationsResult = currentClient
    .getReports()
    .filter((report) => report.getData("clientStationId") === selectedStation);

  // * newGeneralCommentTopText change handler
  const handleContentChange = debounce((content) => {
    // console.log(content);
    const strippedContent = content.replace(/<\/?div[^>]*>/g, "");
    richText.current?.setContentHTML(strippedContent);
    setValue("newGeneralCommentTopText", strippedContent);
    trigger("newGeneralCommentTopText");
    setFormData((prevFormData) => ({
      ...prevFormData,
      newGeneralCommentTopText: strippedContent,
    }));
  }, 0);

  // * setting the oldReportId from selected report
  const handleReportIdAndWorkerId = (selectedReport) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      oldReportId: selectedReport.getData("id"),
      // workerId: selectedReport.getData("workerId"),
    }));
    // setValue("workerId", selectedReport.getData("workerId"));
    setValue("oldReportId", selectedReport.getData("id"));
    trigger("clientStationId");
    trigger("oldReportId");
  };

  // * parsing the data coming from the current report
  const parsedArrayOfStr = (arr) => {
    const parsedSelectedReportCategory = new Set(
      arr
        .split("|")
        .map((str) => str.replace(";", ""))
        .filter(Boolean)
        .map((numStr) => parseInt(numStr, 10))
    );
    return parsedSelectedReportCategory;
  };

  // * parsing the categories coming from the report
  const handleSelectedReportCategory = (selectedReport) => {
    const selectedReportCategory = selectedReport.getData("categorys");

    const parsedSelectedReportCategory = parsedArrayOfStr(
      selectedReportCategory
    );

    return parsedSelectedReportCategory;
  };

  //  * 1. checking if the ids of the categories match to the selected report
  // *  2.  sorting them by type to their right location of major category
  const handleCheckboxStatusChange = (parsedSelectedReportCategory) => {
    const memoRizedCats = memoizedCategories?.categories;
    const globalStateCategories = memoRizedCats
      ? Object.values(memoRizedCats).flatMap((category) => category.categories)
      : null;

    let newCheckboxStatus = {
      foodSafetyReviewCbStatus: [],
      culinaryReviewCbStatus: [],
      nutritionReviewCbStatus: [],
    };
    let newOrderedCategories = {
      foodSafetyReviewCbStatus: [],
      culinaryReviewCbStatus: [],
      nutritionReviewCbStatus: [],
    };
    // todo to change the way the categories change according to the onDragCb function logic

    if (globalStateCategories) {
      newCheckboxStatus = globalStateCategories.reduce((status, category) => {
        const categoryId = parseInt(category.id, 10);
        const categoryType = parseInt(category.type, 10);
        if (parsedSelectedReportCategory.has(categoryId)) {
          if (categoryType === 1) {
            status.foodSafetyReviewCbStatus.push(categoryId);
          } else if (categoryType === 2) {
            status.culinaryReviewCbStatus.push(categoryId);
          } else if (categoryType === 3) {
            status.nutritionReviewCbStatus.push(categoryId);
          }
        }
        return status;
      }, newCheckboxStatus);

      const myArray = Array.from(parsedSelectedReportCategory);
      myArray.map((element) => {
        let index = newCheckboxStatus.foodSafetyReviewCbStatus.findIndex(
          (id) => id == element
        );

        if (index !== -1) {
          newOrderedCategories.foodSafetyReviewCbStatus.push(element);
          return element;
        }
        index = newCheckboxStatus.culinaryReviewCbStatus.findIndex(
          (id) => id == element
        );
        if (index !== -1) {
          newOrderedCategories.culinaryReviewCbStatus.push(element);
          return element;
        }

        index = newCheckboxStatus.nutritionReviewCbStatus.findIndex(
          (id) => id == element
        );
        if (index !== -1) {
          newOrderedCategories.nutritionReviewCbStatus.push(element);
          return element;
        }
      });
    }

    // Saving the categories checkbox status
    const categories = [
      ...newOrderedCategories.foodSafetyReviewCbStatus,
      ...newOrderedCategories.culinaryReviewCbStatus,
      ...newOrderedCategories.nutritionReviewCbStatus,
    ];
    // console.log(typeof categories);
    setFormData((prevFormData) => ({
      ...prevFormData,
      categorys:
        categories.length > 0 || Object.keys(categories).length > 0
          ? categories
          : parsedSelectedReportCategory,
    }));

    setValue("categorys", categories);
    trigger("categorys");
    setCheckboxStatus(newOrderedCategories);
  };
  // * get the array of categories from the report and updates the state
  const handleCategoriesCheckboxesToggle = (category, checked, label) => {
    // console.log("handleCategoriesCheckboxesToggle:", category, checked);

    setCheckboxStatus((prevStatus) => {
      const updatedCategoryStatus = [...prevStatus[category]];
      // find && parsing the index of the array
      const index = updatedCategoryStatus.indexOf(parseInt(label));

      //if checked and label is not found in the array add to the array
      if (checked && index === -1) {
        updatedCategoryStatus.push(parseInt(label));
        // if unchecked and label is found in the array remove to the array
      } else if (!checked && index !== -1) {
        updatedCategoryStatus.splice(index, 1);
      }
      // handleFormChange(category, updatedCategoryStatus);
      return { ...prevStatus, [category]: updatedCategoryStatus };
    });
  };

  useEffect(() => {
    const categories = [
      ...checkboxStatus.foodSafetyReviewCbStatus,
      ...checkboxStatus.culinaryReviewCbStatus,
      ...checkboxStatus.nutritionReviewCbStatus,
    ];

    // console.log("categories:", categories);
    setFormData((prevFormData) => ({
      ...prevFormData,
      categorys: categories,
    }));

    setValue("categorys", categories);
    trigger("categorys");
  }, [checkboxStatus]);

  // * checking if the report parameters match to their state true / false
  const handleSwitchStateChange = (selectedReport) => {
    const newSwitchStates = {
      haveFine: selectedReport.getData("haveFine") == 0 ? 0 : 1,
      haveAmountOfItems:
        selectedReport.getData("haveAmountOfItems") == 0 ? 0 : 1,
      haveSafetyGrade: selectedReport.getData("haveSafetyGrade") == 0 ? 0 : 1,
      haveCulinaryGrade:
        selectedReport.getData("haveCulinaryGrade") == 0 ? 0 : 1,
      haveNutritionGrade:
        selectedReport.getData("haveNutritionGrade") == 0 ? 0 : 1,
      haveCategoriesNameForCriticalItems:
        selectedReport.getData("haveCategoriesNameForCriticalItems") == 0
          ? 0
          : 1,
    };
    setFormData((prevFormData) => ({
      ...prevFormData,
      ...Object.fromEntries(
        Object.entries(newSwitchStates).map(([key, value]) => [
          key,
          value ? 1 : 0,
        ])
      ),
    }));

    Object.entries(newSwitchStates).forEach(([key, value]) => {
      setValue(key, value ? 1 : 0);
    });

    setSwitchStates(newSwitchStates);
  };

  // * setting the accompany
  const handleAccompanyChange = (selectedReport) => {
    const accompanyName = selectedReport.getData("accompany");
    if (accompanyName == "ללא ליווי") {
      setFormData((prevFormData) => ({
        ...prevFormData,
        accompany: "ללא ליווי",
      }));
      setValue("accompany", "ללא ליווי");
      trigger("accompany");
    } else {
      setAccompanySelected(accompanyName);
      setValue("accompany", accompanyName);
      trigger("accompany");
      setFormData((prevFormData) => ({
        ...prevFormData,
        accompany: accompanyName,
      }));
    }
  };

  //  * handling report time
  const handleReportTime = (selectedReport) => {
    const reportTimeDisplayed = selectedReport.getData("reportTime");
    setValue("reportTime", reportTimeDisplayed);
    trigger("reportTime");
  };
  // * general handle form change
  const handleFormChange = debounce((name, value) => {
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
    setIsSchemaValid(true);

    if (name === "previousReports") {
      let newCheckboxStatus = {
        foodSafetyReviewCbStatus: [],
        culinaryReviewCbStatus: [],
        nutritionReviewCbStatus: [],
      };

      let newSwitchStates = {
        haveFine: false,
        haveAmountOfItems: false,
        haveSafetyGrade: true,
        haveCulinaryGrade: true,
        haveNutritionGrade: true,
        haveCategoriesNameForCriticalItems: false,
      };

      if (value === "דוח חדש") {
        // console.log("Setting newSwitchStates and formData");
        setCheckboxStatus(newCheckboxStatus);
        setSwitchStates(newSwitchStates);

        setFormData((prevFormData) => ({
          ...prevFormData,
          oldReportId: "0",
        }));
        Object.entries(newSwitchStates).forEach(([key, value]) => {
          setValue(key, value ? 1 : 0);
        });
      } else {
        const selectedReport = filteredStationsResult.find(
          (report) => report.getData("timeOfReport") === value
        );

        if (selectedReport) {
          handleReportIdAndWorkerId(selectedReport);
          const parsedSelectedReportCategory =
            handleSelectedReportCategory(selectedReport);

          handleCheckboxStatusChange(parsedSelectedReportCategory);

          handleSwitchStateChange(selectedReport);
          handleAccompanyChange(selectedReport);
          handleReportTime(selectedReport);
        } else {
          setIsSchemaValid(true);
          setSwitchStates(newSwitchStates);
        }
      }
    }
  }, 300);
  // todo to return error for date picker
  // * toggle switch function
  const toggleSwitch = (id) => {
    setSwitchStates((prevState) => {
      const newState = {
        ...prevState,
        [id]: !prevState[id],
      };
      const value = newState[id] ? 1 : 0;
      handleFormChange(id, value); // Call handleFormChange with the new switch state
      return newState;
    });
  };

  const memoRizedCats = memoizedCategories?.categories;
  const globalCategoriesObj = memoRizedCats
    ? Object.values(memoRizedCats).flatMap((category) => category.categories)
    : null;
  // * comparing between the categories names to the ids in the forms to display it in the drawer
  const idToNameMap = {};
  globalCategoriesObj && formData.categorys
    ? globalCategoriesObj?.forEach((item) => {
        idToNameMap[item.id] = item.name;
      })
    : [];
  const checkedCategories =
    formData && formData.categorys?.map((id) => idToNameMap[id]);

  // * post request on the changes of the report edit
  const saveEditedReport = async (formData) => {
    // console.log(formData);
    const bodyFormData = new FormData();
    bodyFormData.append("id", currentReport.getData("id")); //checked expected output : 19150(reportid)
    bodyFormData.append("workerId", currentReport.getData("workerId")); //checked expected output : 4069114 (userid)
    bodyFormData.append("clientId", currentReport.getData("clientId")); //checked expected output : 34
    bodyFormData.append(
      "clientStationId",
      currentReport.getData("clientStationId")
    ); //checked expected output : 66
    bodyFormData.append("accompany", currentReport.getData("accompany")); //checked expected output : 66
    bodyFormData.append("haveFine", currentReport.getData("haveFine")); //checked expected output : 66
    bodyFormData.append(
      "haveAmountOfItems",
      currentReport.getData("haveAmountOfItems")
    ); //checked expected output : 1
    bodyFormData.append(
      "haveSafetyGrade",
      currentReport.getData("haveSafetyGrade")
    ); //checked expected output : 1
    bodyFormData.append(
      "haveCulinaryGrade",
      currentReport.getData("haveCulinaryGrade")
    ); //checked expected output : 1
    bodyFormData.append(
      "haveNutritionGrade",
      currentReport.getData("haveNutritionGrade")
    ); //checked expected output : 1
    bodyFormData.append(
      "haveCategoriesNameForCriticalItems",
      currentReport.getData("haveCategoriesNameForCriticalItems")
    ); //checked expected output : 0
    bodyFormData.append("reportTime", currentReport.getData("reportTime")); //checked expected output : 11
    bodyFormData.append(
      "newGeneralCommentTopText",
      formData.newGeneralCommentTopText
    );
    bodyFormData.append("timeOfReport", currentReport.getData("timeOfReport")); //checked expected output : 12/09/2023
    bodyFormData.append("data", []);

    bodyFormData.append("status", currentReport.getData("status")); //checked expected output : 1
    bodyFormData.append(
      "newCategorys",
      ";" + formData.categorys.join("|;") + "|"
    );

    bodyFormData.append("file1", currentReport.getData("file1")); //checked expected output : ""
    bodyFormData.append("file2", currentReport.getData("file2")); //checked expected output : ""
    bodyFormData.append(
      "positiveFeedback",
      currentReport.getData("positiveFeedback")
    ); //checked expected output: ""

    try {
      setIsLoading(true);
      const apiUrl = process.env.API_BASE_URL + "ajax/saveReport2.php";
      const response = await axios.post(apiUrl, bodyFormData);
      console.log("out");
      if (response.status == 200 || response.status == 201) {
        console.log(`in ,status :${response.status}`);
        currentReport.setData(
          "newGeneralCommentTopText",
          formData.newGeneralCommentTopText
        );
        console.log("[WorkerNewReport]currentCategories:", currentCategories);
        dispatch(setCurrentReport(currentReport));
        dispatch(setCurrentCategories(formData.categorys));
        setIsLoading(false);
      }
      return response.data;
    } catch (error) {
      setIsLoading(false);
      console.error("Error making POST request:", error);
    }
  };

  const postNewReport = async (formData) => {
    try {
      const response = await axios.post(
        process.env.API_BASE_URL + "api/duplicateReport.php",
        { ...formData, rearrangement: IsRearrangement }
      );
      console.log("(postNewReport)response:", response.status);
      if (response.status === 200) {
        const responseClients = await fetchData(
          process.env.API_BASE_URL + "api/clients.php",
          { id: userId }
        );
        if (responseClients.success) {

          let clients = [];
          responseClients.data.forEach((element) => {
            clients.push(new Client(element));
          });
          dispatch(setClients({ clients: clients }));
          
          Alert.alert(
            "Success",
            "Data posted successfully!",
            [
              {
                text: "ok",
                onPress: () => {

                  navigateToRoute(routes.ONBOARDING.ClientsList);
                },
              },
              {
                text: "Cancel",
                onPress: () => {},
                style: "cancel",
              },
            ],
            { cancelable: false }
          );
        }
        
      }
      return response.data;
    } catch (error) {
      console.error("(postNewReport)Error posting data:", error);
      throw error; // You can handle the error or throw it to be caught elsewhere
    }
  };
  // * submit the form
  const onSubmitForm = async () => {
    // checking if scheme is valid
    console.log("on submit...");
    // const formValues = getValues();

    console.log("formData:", formData);
    if (isSchemaValid) {
      console.log("scheme is valid");

      try {
        const response = await postNewReport(formData);
        // console.log("new report response:", response);
      } catch (error) {
        console.error("Error posting data:", error);
      }
    }
  };

  // * Drawer
  const handleDrawerToggle = (isOpen) => {
    setIsDrawerOpen(isOpen);
  };

  // * paginations between categories names : Prev
  // const handlePrevCategory = () => {
  //   setCurrentCategoryIndex((prevIndex) => {
  //     const newIndex = prevIndex > 0 ? prevIndex - 1 : prevIndex;
  //     const currentItem = checkedCategoryNameById[newIndex];
  //     // dispatch(setCurrentCategory(currentItem));
  //     return newIndex;
  //   });
  // };

  // * paginations between categories names : Next
  const handleNextCategory = async () => {
    // setCurrentCategoryIndex((prevIndex) => {
    //   const newIndex =
    //     prevIndex < checkedCategoryNameById.length - 1
    //       ? prevIndex + 1
    //       : prevIndex;
    //   const currentItem = checkedCategoryNameById[newIndex];
    //   // dispatch(setCurrentCategory(currentItem));
    //   // console.log(currentItem);
    //   return newIndex;
    // });
    if (currentReport) {
      try {
        const response = await saveEditedReport(formData);
        console.log("edit post response:", response);
      } catch (error) {
        console.error("Error posting data:", error);
      }
    }

    // dispatch(getCurrentCategories(formData.categorys));
    // dispatch(getCurrentReport(currentReport));
    dispatch(getCurrentCategory(formData.categorys[0]));
    navigateToRoute(routes.ONBOARDING.EditExistingReport);
  };

  // * accordion FlatList array of Content
  const NewReportAccordionContent = [
    {
      key: "settings",
      headerText: "הגדרות הדוח",
      contentText: "world",
      contentHeight: 959,
      headerHeight: 48,
      headerTogglerStyling: styles.headerStyle,
      iconDisplay: true,
      boxHeight: 80.5,
      hasDivider: true,
      draggable: false,
      accordionCloseIndicator: accordionCloseIcon,
      accordionOpenIndicator: accordionOpenIcon,
      contentItemStyling: styles.contentBoxSetting,
      accordionContent: [
        {
          id: 0,
          text: <Text>תחנה</Text>,
          boxItem: (
            <SelectMenu
              control={control}
              selectWidth={240}
              optionsHeight={200}
              defaultText={
                currentReport ? currentReport.getData("station_name") : "בחירה"
              }
              displayedValue={getValues().clientStationId}
              selectMenuStyling={{
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "flex-start",
              }}
              centeredViewStyling={
                {
                  // marginRight: 12,
                  // alignItems: "flex-end",
                  // marginTop: -530,
                }
              }
              selectOptions={currentClient.getStations()}
              name={"clientStationId"}
              errorMessage={
                errors.clientStationId && errors.clientStationId.message
              }
              onChange={(value) => {
                handleFormChange("clientStationId", value.id);
                setSelectedStation(value.id);
                setValue("clientStationId", value.company);
                trigger("clientStationId");
                console.log("value-station:", value);
              }}
              propertyName="company"
              returnObject={true}
            />
          ),
        },

        {
          id: 1,
          text: <Text>התבסס על דוח קודם</Text>,
          boxItem: (
            <SelectMenu
              control={control}
              selectWidth={240}
              optionsHeight={750}
              defaultText={"בחירה"}
              selectMenuStyling={{
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "flex-start",
              }}
              centeredViewStyling={
                {
                  // marginRight: 12,
                  // alignItems: "flex-end",
                  // marginTop: 180,
                }
              }
              selectOptions={[
                { timeOfReport: "דוח חדש", id: 0 },
                ...filteredStationsResult, //clientStationId
              ]}
              name={"previousReports"}
              errorMessage={
                errors.previousReports && errors.previousReports.message
              }
              onChange={(value) => {
                handleFormChange("previousReports", value);
                // setSelectedReport(value);
                setValue("previousReports", value);
                trigger("previousReports");
                console.log("value-previousReports:", value);
              }}
              propertyName="timeOfReport"
            />
          ),
        },
        {
          id: 2,
          text: <Text>יש קנסות</Text>,
          boxItem: (
            <ToggleSwitch
              id={"haveFine"}
              switchStates={switchStates}
              toggleSwitch={toggleSwitch}
              truthyText={"כן"}
              falsyText={"לא"}
            />
          ),
        },
        {
          id: 3,
          text: <Text>להציג כמות סעיפים</Text>,
          boxItem: (
            <ToggleSwitch
              id={"haveAmountOfItems"}
              switchStates={switchStates}
              toggleSwitch={toggleSwitch}
              truthyText={"כן"}
              falsyText={"לא"}
            />
          ),
        },
        {
          id: 4,
          text: <Text>הצג ציון ביקורת בטיחות מזון</Text>,
          boxItem: (
            <ToggleSwitch
              id={"haveSafetyGrade"}
              switchStates={switchStates}
              toggleSwitch={toggleSwitch}
              truthyText={"כן"}
              falsyText={"לא"}
            />
          ),
        },
        {
          id: 5,
          text: <Text>הצג ציון ביקורת קולינרית</Text>,
          boxItem: (
            <ToggleSwitch
              id={"haveCulinaryGrade"}
              switchStates={switchStates}
              toggleSwitch={toggleSwitch}
              truthyText={"כן"}
              falsyText={"לא"}
            />
          ),
        },
        {
          id: 6,
          text: <Text>הצג ציון תזונה</Text>,
          boxItem: (
            <ToggleSwitch
              id={"haveNutritionGrade"}
              switchStates={switchStates}
              toggleSwitch={toggleSwitch}
              truthyText={"כן"}
              falsyText={"לא"}
            />
          ),
        },
        {
          id: 7,
          text: <Text>הצג שמות קטגוריות בתמצית עבור ליקויים קריטיים</Text>,
          boxItem: (
            <ToggleSwitch
              id={"haveCategoriesNameForCriticalItems"}
              switchStates={switchStates}
              toggleSwitch={toggleSwitch}
              truthyText={"כן"}
              falsyText={"לא"}
            />
          ),
        },
        {
          id: 8,
          text: <Text>שם המלווה</Text>,
          boxItem: (
            <View style={{ justifyContent: "flex-end", alignSelf: "center" }}>
              <Input
                mode={"outlined"}
                control={control}
                name={"accompany"}
                inputStyle={{
                  backgroundColor: colors.white,
                  width: 240,
                  alignSelf: "center",
                }}
                activeOutlineColor={colors.blue}
                // label={accompanySelected ? accompanySelected : "ללא  מלווה"}
                // label={null}
                defaultValue={
                  currentReport
                    ? currentReport.getData("accompany")
                    : formData.accompany
                }
                // placeholder={" "}
                outlineColor={"rgba(12, 20, 48, 0.2)"}
                onChangeFunction={(value) => {
                  handleFormChange("accompany", value);
                }}
              />
            </View>
          ),
        },
        {
          id: 9,
          text: <Text>תאריך ביקורת</Text>,
          boxItem: (
            <DatePicker
              control={control}
              name={"timeOfReport"}
              errorMessage={errors.timeOfReport && errors.timeOfReport.message}
              onchange={(value) => {
                const date = new Date(value);
                const formattedDate = date.toLocaleDateString("en-GB");
                handleFormChange("timeOfReport", formattedDate);
                setValue("timeOfReport", formattedDate);
                trigger("timeOfReport");
              }}
              dateInputWidth={240}
              defaultDate={currentReport?.getData("timeOfReport")}
            />
          ),
        },
        {
          id: 10,
          text: <Text>זמן הביקורת</Text>,
          boxItem: (
            <SelectMenu
              control={control}
              selectWidth={240}
              optionsHeight={200}
              defaultText={"בחירה"}
              selectMenuStyling={{
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "flex-start",
              }}
              centeredViewStyling={
                {
                  // marginRight: 12,
                  // alignItems: "flex-end",
                  // marginTop: 300,
                }
              }
              selectOptions={reportsTimes}
              name={"reportTime"}
              errorMessage={errors.reportTime && errors.reportTime.message}
              onChange={(value) => {
                handleFormChange("reportTime", value.id);
                setCurrentReportTime(value.id);
                setValue("reportTime");
                trigger("reportTime");
                console.log("reportTime:", value.id);
              }}
              propertyName={"name"}
              // defaultValue={currentReportTime}
              displayedValue={currentReportTime}
              returnObject={true}
            />
          ),
        },
      ],
    },
    {
      key: "categories",
      headerText: "קטגוריות",
      contentText: "world",
      contentHeight: categoryAccordionHeight,
      headerHeight: 48,
      headerTogglerStyling: styles.headerStyle,
      iconDisplay: true,
      boxHeight: 46,
      hasDivider: true,
      draggable: true,
      // toggleHandler: () => resetCategoryAccordionHeight,
      accordionCloseIndicator: accordionCloseIcon,
      accordionOpenIndicator: accordionOpenIcon,
      contentItemStyling: styles.contentBoxCategories,
      scrollEnabled: true,
      accordionContent: [
        {
          id: 0,
          boxItem: (
            <>
              {errors.categorys && errors.categorys.message && (
                <HelperText type="error" style={{ marginBottom: 10 }}>
                  {errors.categorys.message}
                </HelperText>
              )}
            </>
          ),
        },
        {
          id: 1,
          boxItem: (
            <Accordion
              headerText={`${
                memoizedCategories &&
                memoizedCategories.categories &&
                memoizedCategories.categories[1].name
              } (נבחרו ${getCheckedCount("foodSafetyReviewCb")} דוחות)`}
              contentHeight={336}
              headerHeight={50}
              accordionCloseIndicator={ClientItemArrow}
              accordionOpenIndicator={ClientItemArrowOpen}
              toggleHandler={changeCategoryAccordionHeight}
              iconText={"בחר קטגוריות"}
              headerTogglerStyling={{
                backgroundColor: "#D3E0FF",
              }}
              iconDisplay={true}
              draggable={true}
              boxHeight={56}
              headerTextStyling={{
                color: colors.black,
                fontFamily: fonts.ABold,
              }}
              scrollEnabled={true}
              accordionContent={accordionCategoriesItem(
                formData && formData.categorys
                  ? [...foodSafetyReviewTexts].sort((a, b) => {
                      const aIdx = formData.categorys.indexOf(Number(a.id));
                      const bIdx = formData.categorys.indexOf(Number(b.id));

                      if (aIdx >= 0 && bIdx >= 0) {
                        return aIdx - bIdx;
                      } else if (aIdx >= 0) {
                        return -1;
                      } else if (bIdx >= 0) {
                        return 1;
                      } else {
                        return 0;
                      }
                    })
                  : [],
                "foodSafetyReviewCb"
              )}
              onDragEndCb={(data) => {
                let originalData = [...foodSafetyReviewTexts];
                const movedData = originalData[data.from];
                originalData.splice(data.from, 1);
                const newData = [
                  ...originalData.slice(0, data.to),
                  movedData,
                  ...originalData.slice(data.to),
                ];
                let newCategoryArrangemnet = [];
                newData.forEach((item) => {
                  const index = checkboxStatus[
                    "foodSafetyReviewCbStatus"
                  ].findIndex((category) => category == item.id);
                  index !== -1 && newCategoryArrangemnet.push(Number(item.id));

                  // console.log(item);
                });
                setCheckboxStatus((prev) => ({
                  ...prev,
                  foodSafetyReviewCbStatus: newCategoryArrangemnet,
                }));
                setFoodSafetyReviewTexts(newData);
                setIsRearrangement(true);
              }}
              contentItemStyling={{
                width: "100%",
                height: 56,
                alignItems: "center",
                paddingHorizontal: 16,
              }}
              hasDivider={true}
            />
          ),
        },
        {
          id: 2,
          boxItem: (
            <Accordion
              headerText={`${
                memoizedCategories &&
                memoizedCategories.categories &&
                memoizedCategories.categories[2].name
              } (נבחרו  ${getCheckedCount("culinaryReviewCb")} דוחות)`}
              contentHeight={336}
              headerHeight={50}
              draggable={true}
              accordionCloseIndicator={ClientItemArrow}
              accordionOpenIndicator={ClientItemArrowOpen}
              iconText={"בחר קטגוריות"}
              toggleHandler={changeCategoryAccordionHeight}
              headerTogglerStyling={{
                ...styles.headerStyle,
                backgroundColor: "#D3E0FF",
              }}
              iconDisplay={true}
              boxHeight={50}
              scrollEnabled={true}
              headerTextStyling={{
                color: colors.black,
                fontFamily: fonts.ABold,
              }}
              accordionContent={accordionCategoriesItem(
                formData && formData.categorys
                  ? [...culinaryReviewTexts].sort((a, b) => {
                      const aIdx = formData.categorys.indexOf(Number(a.id));
                      const bIdx = formData.categorys.indexOf(Number(b.id));

                      if (aIdx >= 0 && bIdx >= 0) {
                        return aIdx - bIdx;
                      } else if (aIdx >= 0) {
                        return -1;
                      } else if (bIdx >= 0) {
                        return 1;
                      } else {
                        return 0;
                      }
                    })
                  : [],
                "culinaryReviewCb"
              )}
              onDragEndCb={(data) => {
                let originalData = [...culinaryReviewTexts];
                const movedData = originalData[data.from];
                originalData.splice(data.from, 1);
                const newData = [
                  ...originalData.slice(0, data.to),
                  movedData,
                  ...originalData.slice(data.to),
                ];

                setCulinaryReviewTexts(newData);
                setIsRearrangement(true);
              }}
              contentItemStyling={{
                width: "100%",
                height: 56,
                alignItems: "center",
                paddingHorizontal: 16,
              }}
              hasDivider={true}
            />
          ),
        },
        {
          id: 3,
          boxItem: (
            <>
              <Accordion
                headerText={`${
                  memoizedCategories &&
                  memoizedCategories.categories &&
                  memoizedCategories.categories[3].name
                } (נבחרו  ${getCheckedCount("nutritionReviewCb")} דוחות)`}
                contentHeight={336}
                headerHeight={50}
                draggable={true}
                accordionCloseIndicator={ClientItemArrow}
                accordionOpenIndicator={ClientItemArrowOpen}
                iconText={"בחר קטגוריות"}
                toggleHandler={changeCategoryAccordionHeight}
                headerTogglerStyling={{
                  ...styles.headerStyle,
                  backgroundColor: "#D3E0FF",
                }}
                iconDisplay={true}
                scrollEnabled={true}
                boxHeight={50}
                headerTextStyling={{
                  color: colors.black,
                  fontFamily: fonts.ABold,
                }}
                accordionContent={accordionCategoriesItem(
                  formData && formData.categorys
                    ? [...nutritionReviewTexts].sort((a, b) => {
                        const aIdx = formData.categorys.indexOf(Number(a.id));
                        const bIdx = formData.categorys.indexOf(Number(b.id));

                        if (aIdx >= 0 && bIdx >= 0) {
                          return aIdx - bIdx;
                        } else if (aIdx >= 0) {
                          return -1;
                        } else if (bIdx >= 0) {
                          return 1;
                        } else {
                          return 0;
                        }
                      })
                    : [],
                  "nutritionReviewCb"
                )}
                onDragEndCb={(data) => {
                  let originalData = [...nutritionReviewTexts];
                  const movedData = originalData[data.from];
                  originalData.splice(data.from, 1);
                  const newData = [
                    ...originalData.slice(0, data.to),
                    movedData,
                    ...originalData.slice(data.to),
                  ];
                  setNutritionReviewTexts(newData);
                  setIsRearrangement(true);
                }}
                contentItemStyling={{
                  width: "100%",
                  height: 56,
                  alignItems: "center",
                  paddingHorizontal: 16,
                }}
                hasDivider={true}
              />
            </>
          ),
        },
      ],
    },
    {
      key: "summary",
      headerText: "תמצית הדוח",
      contentText: "world",
      contentHeight: 300,
      headerHeight: 48,
      headerTogglerStyling: styles.headerStyle,
      iconDisplay: true,
      boxHeight: 80.5,
      draggable: false,
      contentItemStyling: styles.contentBoxSetting,
      hasDivider: false,

      accordionCloseIndicator: accordionCloseIcon,
      accordionOpenIndicator: accordionOpenIcon,
      accordionContent: [
        {
          id: 0,
          boxItem: (
            <View
              style={{
                flex: 1,
                width: "100%",
                marginTop: 20,
                height: "100%",
                direction: "rtl",
              }}
            >
              <View
                style={{
                  backgroundColor: "#D3E0FF",
                  width: "100%",
                  alignItems: "flex-start",
                  // marginBottom: 200,
                  position: "relative",
                  zIndex: 3,
                }}
              >
                <RichToolbar
                  editor={richText}
                  selectedButtonStyle={{ backgroundColor: "#baceff" }}
                  unselectedButtonStyle={{ backgroundColor: "#D3E0FF" }}
                  iconTint="#000000"
                  selectedIconTint="#000000"
                  actions={[
                    actions.insertOrderedList,
                    actions.insertBulletsList,
                    actions.setUnderline,
                    actions.setItalic,
                    actions.setBold,
                    "custom",
                  ]}
                  // onPressAddImage={onPressAddImage}
                  // onAction={onAction} // Add the onAction prop for custom actions
                  iconMap={{
                    ["custom"]: ({}) => <Text>C</Text>,
                  }}
                  custom={() => {
                    setColorSelected(!colorSelected);
                    console.log("object");
                  }}
                />
              </View>
              {colorSelected && (
                <View
                  style={{
                    direction: "ltr",
                    width: 200,
                    position: "absolute",
                    top: 20,
                    zIndex: 3,
                  }}
                >
                  <ColorPicker
                    onColorChange={(color) => {
                      console.log(color);
                      richText.current?.setForeColor(color);
                    }}
                    sliderSize={20}
                    thumbSize={60}
                    gapSize={5}
                    // noSnap={true}
                    color="#000000"
                    palette={[
                      "#000000",
                      "#ffff00",
                      "#0000ff",
                      "#ff0000",
                      "#00ff00",
                    ]}
                    swatches={true}
                  />
                </View>
              )}
              <ScrollView
                style={{
                  // flex: Platform.OS === "ios" ? 1 : 0,
                  flex: 1,
                  // direction: "ltr",
                  // direction: "rtl",
                  overflow: "visible",
                  height: "100%",
                  minHeight: 250,
                }}
              >
                <KeyboardAvoidingView
                  behavior={Platform.OS === "ios" ? "padding" : "height"}
                  style={{ flex: 1 }}
                >
                  <RichEditor
                    ref={richText}
                    onChange={handleContentChange}
                    // initialContentHTML="<div></div>"
                    initialContentHTML={
                      currentReport
                        ? currentReport.getData("newGeneralCommentTopText")
                        : "<div></div>"
                    }
                    // placeholder={
                    //   "פה יכתב תמצית הדוח באופן אוטומטי או ידני או משולב בהתאם לבחירת הסוקר"
                    // }
                    // shouldStartLoadWithRequest={(request) => {
                    //   return true;
                    // }}
                    style={{
                      minHeight: 123,
                      // direction: "ltr",
                      // direction: "rtl",
                      borderWidth: 1,
                      borderColor: "#eee",
                      zIndex: 2,
                      overflow: "visible",
                    }}
                  />
                </KeyboardAvoidingView>
              </ScrollView>
            </View>
          ),
        },
      ],
    },
  ];

  // * accordion item
  const renderAccordion = ({ item }) => (
    <Accordion
      headerText={item.headerText}
      contentText={item.contentText}
      contentHeight={item.contentHeight}
      headerHeight={item.headerHeight}
      headerTogglerStyling={styles.headerStyle}
      iconDisplay={true}
      boxHeight={item.boxHeight}
      accordionContent={item.accordionContent}
      contentItemStyling={item.contentItemStyling}
      hasDivider={item.hasDivider}
      headerTextStyling={item.headerTextStyling}
      accordionCloseIndicator={item.accordionCloseIndicator}
      accordionOpenIndicator={item.accordionOpenIndicator}
      scrollEnabled={item.scrollEnabled}
      toggleHandler={item.toggleHandler}
      draggable={item.draggable}
    />
  );
  // * filtering out timeofReport when on edit mode.
  const modifiedAccordionContent = currentReport
    ? NewReportAccordionContent.map((section) => {
        if (section.key === "settings") {
          const modifiedAccordionContent = section.accordionContent.filter(
            (item) => item.id !== 1
          );
          return { ...section, accordionContent: modifiedAccordionContent };
        }
        return section;
      })
    : NewReportAccordionContent;

  return (
    <>
      {isLoading ? (
        <Loader visible={isLoading} />
      ) : (
        <ScreenWrapper
          newReportBackGroundImg={true}
          isConnectedUser
          wrapperStyle={[styles.container, {}]}
          edges={[]}
        >
          <View style={styles.headerWrapper}>
            <GoBackNavigator text={"חזרה לרשימת הלקוחות"} />
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Header
                HeaderText={
                  currentReport
                    ? `עריכת דוח עבור ${currentReport.data.station_name}`
                    : `יצירת דוח חדש עבור ${currentClient.getCompany()}`
                }
                iconList={currentReport}
                onCategoriesIconPress={() => {
                  navigateToRoute(routes.ONBOARDING.EditExistingReport);
                }}
              />
            </View>

            <FlatList
              data={modifiedAccordionContent}
              renderItem={renderAccordion}
              keyExtractor={(item, index) => index.toString()}
            />
          </View>
          {currentReport ? (
            <SafeAreaView
              style={{
                width: "100%",
                // flex: 1,
                // width: windowWidth,
                // justifyContent: "center",
                // alignItems: "center",
                marginBottom: Platform.OS === "ios" ? 50 : 100,
              }}
            >
              <Drawer
                content={
                  <LinearGradient
                    colors={["#37549D", "#26489F"]}
                    start={[0, 0]}
                    end={[1, 0]}
                    style={{
                      // width: windowWidth,
                      padding: 16,
                      height: 76,
                      zIndex: 1,
                      // alignItems: "center",
                      // justifyContent: "center",
                    }}
                  >
                    <View
                      style={{
                        maxWidthwidth: windowWidth,
                        justifyContent: "space-evenly",
                        alignItems: "center",
                        flexDirection: "row",
                      }}
                    >
                      {formData &&
                        formData.categorys &&
                        formData.categorys[0] && (
                          <TouchableOpacity
                            // onPress={handlePrevCategory}
                            style={{
                              // alignSelf: "center",
                              // justifyContent: "flex-end",
                              // marginLeft: "auto",
                              flexDirection: "row",
                              gap: 5,
                              alignItems: "center",
                              // width: "30%",
                            }}
                          >
                            {/* <Image
                              source={accordionCloseIcon}
                              style={{
                                width: 20,
                                height: 20,
                                transform: [{ rotate: "180deg" }],
                              }}
                            />
                            <Text style={styles.categoryDirButton}>
                              הקטגוריה הקודמת:{" "}
                              {
                                checkedCategoryNameById[
                                  currentCategoryIndex - 1
                                ]?.name
                              }
                            </Text> */}
                          </TouchableOpacity>
                        )}
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "center",
                          alignItems: "center",
                          alignSelf: "center",
                          textAlign: "center",
                          // width: "30%",
                          flexGrow: 1,
                          gap: 12,
                          marginLeft:
                            formData &&
                            formData.categorys &&
                            formData.categorys[0]
                              ? 180
                              : 0,
                        }}
                      >
                        <Image
                          source={FileIcon}
                          style={{ width: 24, height: 24 }}
                        />
                        <Text
                          style={{
                            justifyContent: "center",
                            alignSelf: "center",
                            color: colors.white,
                            fontSize: 24,
                            fontFamily: fonts.ABold,
                          }}
                        >
                          תמצית והערות
                        </Text>
                      </View>
                      {formData &&
                        formData.categorys &&
                        formData.categorys[0] && (
                          <TouchableOpacity
                            onPress={handleNextCategory}
                            style={{
                              alignSelf: "center",
                              justifyContent: "center",
                              flexDirection: "row",
                              gap: 5,
                              alignItems: "center",
                              // marginLeft: "auto",
                              // width: "30%",
                            }}
                          >
                            <Text style={styles.categoryDirButton}>
                              הקטגוריה הבאה:{" "}
                              {/* {
                                checkedCategoryNameById[currentCategoryIndex]
                                  .name
                              } */}
                              {checkedCategories[0]}
                            </Text>
                            <Image
                              source={accordionCloseIcon}
                              style={{ width: 20, height: 20 }}
                            />
                          </TouchableOpacity>
                        )}
                    </View>
                  </LinearGradient>
                }
                height={0}
                onToggle={handleDrawerToggle}
                contentStyling={{ padding: 0 }}
              />
            </SafeAreaView>
          ) : (
            <LinearGradient
              colors={["#37549D", "#26489F"]}
              start={[0, 0]}
              end={[1, 0]}
            >
              <TouchableOpacity
                style={{
                  width: "100%",
                  justifyContent: "center",
                  alignItems: "center",
                }}
                onPress={
                  handleSubmit(onSubmitForm)
                  // console.log("new report");
                }
              >
                <Text
                  style={{
                    alignSelf: "center",
                    paddingVertical: 12,
                    fontSize: 24,
                    fontFamily: fonts.ABold,
                    color: colors.white,
                  }}
                >
                  יצירת הדוח
                </Text>
              </TouchableOpacity>
            </LinearGradient>
          )}
        </ScreenWrapper>
      )}
    </>
  );
};

export default React.memo(WorkerNewReport);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 0,
  },
  headerWrapper: {
    flex: 1,
    flexDirection: "column",
    gap: 8,
    marginTop: 26,
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  header: {
    alignSelf: "flex-start",
    fontFamily: fonts.ABold,
    fontSize: 24,
  },
  navigationWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  navigationText: {
    fontFamily: fonts.ARegular,
    fontSize: 16,
  },
  icon: {
    width: 20,
    height: 20,
  },
  headerStyle: {
    backgroundColor: "#6886D2",
  },
  contentBox: {
    flexDirection: "column",
  },
  contentBoxSetting: {
    alignItems: "center",
    height: 80.5,
    paddingHorizontal: 16,
  },
  contentBoxCategories: {
    alignItems: "center",
    // height: 200.5,
  },
  categoryDirButton: {
    color: colors.white,
    fontFamily: fonts.ARegular,
    fontSize: 16,
  },
});
