import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Button,
  Dimensions,
} from "react-native";

import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import ScreenWrapper from "../../../../utiles/ScreenWrapper";
import useScreenNavigator from "../../../../Hooks/useScreenNavigator";
import fonts from "../../../../styles/fonts";
import colors from "../../../../styles/colors";
import ImageText from "./innerComponents/ImageText";
import { FlatList } from "react-native-gesture-handler";
import uuid from "uuid-random";
import Loader from "../../../../utiles/Loader";
import ReportGrade from "./innerComponents/ReportGrade";
import CategoryAccordion from "./innerComponents/CategoryAccordion";
import { Divider } from "react-native-paper";
import CheckboxItem from "../../../WorkerNewReport/CheckboxItem/CheckboxItem";
import Input from "../../../../Components/ui/Input";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import SelectMenu from "../../../../Components/ui/SelectMenu";
import DatePicker from "../../../../Components/ui/datePicker";
import useMediaPicker from "../../../../Hooks/useMediaPicker";
import CategoryAccordionItem from "./innerComponents/CategoryAccordionItem";
import Drawer from "../../../../Components/ui/Drawer";
import { LinearGradient } from "expo-linear-gradient";
import accordionCloseIcon from "../../../../assets/imgs/accordionCloseIndicator.png";
import FileIcon from "../../../../assets/icons/iconImgs/FileIcon.png";
import { fetchCategories } from "../../../../store/redux/reducers/categoriesSlice";
import Category from "../../../../Components/modals/category";
import ModalUi from "../../../../Components/ui/ModalUi";
// import Radio from "../../../../Components/ui/radio";

const EditExistingReport = () => {
  const dispatch = useDispatch();
  const currentClient = useSelector(
    (state) => state.currentClient.currentClient
  );
  const [modalVisible, setModalVisible] = useState(false);

  const handleModalClose = () => {
    setModalVisible(false);
  };
  const currentReport = useSelector(
    (state) => state.currentReport.currentReport
  );

  const [isLoading, setIsLoading] = useState(false);
  const currentStation = useSelector((state) => state.currentStation);
  const categories = useSelector((state) => state.categories);
  const currentCategoryId = useSelector((state) => state.currentCategory);
  const { navigateTogoBack } = useScreenNavigator();
  const [categoryGrade, setCategoryGrade] = useState(89);
  const [foodSafetyGrade, setFoodSafetyGrade] = useState(79);
  const [reportGrade, setReportGrade] = useState(64);
  const [relevantCheckboxItems, setRelevantCheckboxItems] = useState([]);
  const [ratingCheckboxItem, setRatingCheckboxItem] = useState([]);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [selectedModalCategory, setSelectedModalCategory] = useState([]);
  const [categoryArray, setCategoryArray] = useState([]);
  const memoizedCategories = useMemo(() => categories, [categories]);
  const memoRizedCats = memoizedCategories?.categories;
  const passedDownCategoryId = currentCategoryId.currentCategory;
  const [categoryHeader, setCategoryHeader] = useState(false);
  const [categorySubHeader, setCategorySubHeader] = useState(false);
  const [CategoriesItems, setCategoriesItems] = useState([]);
  const [currentReportItems, setCurrentReportItems] = useState([]);
  // console.log(ratingCheckboxItem);
  // todo: find the categoryid in the categories and display his name by the id by the currentCategoryId // done
  // todo: find items from the current Report with the categories items
  const desiredCategory = () => {
    let parentCategory = false;
    let indexSubcategory = false;

    for (const [key, value] of Object.entries(categories.categories)) {
      value.categories.find((subcategory, index) => {
        if (subcategory.id == passedDownCategoryId) {
          indexSubcategory = index;
          parentCategory = key;
          return subcategory;
        }
      });
    }
    setCategoriesItems(
      categories.categories[parentCategory].categories[indexSubcategory].items
    );
    setCategorySubHeader(
      categories.categories[parentCategory].categories[indexSubcategory].name
    );
    setCategoryHeader(categories.categories[parentCategory].name);
  };

  useEffect(() => {
    desiredCategory();
  }, [desiredCategory]);

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const schema = yup.object().shape({
    remarks: yup.string().required("remarks is required"),
    executioner: yup.string().required("executioner is required"),
    violationType: yup.string().required("type of violation is required"),
    lastDate: yup.string().required("execution date is required"),
    fineNis: yup.string().required("defining a fine in NIS is required"),
    imagePick: yup.string().required("picking an image is required"),
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
    dispatch(fetchCategories());
  }, [dispatch]);

  // * modal pick handler
  const handleOptionClick = (option) => {
    setSelectedModalCategory((prevSelectedOptions) => [
      ...prevSelectedOptions,
      option,
    ]);
  };
  // * drawer handler
  const handleDrawerToggle = (isOpen) => {
    setIsDrawerOpen(isOpen);
  };
  // * relevant checkbox handler (need to be change)
  const handleCheckboxChange = (isChecked, label) => {
    if (isChecked) {
      setRelevantCheckboxItems((prevreleventCheckboxItems) => [
        ...prevreleventCheckboxItems,
        label,
      ]);
    } else {
      setRelevantCheckboxItems((prevreleventCheckboxItems) =>
        prevreleventCheckboxItems.filter((item) => item !== label)
      );
    }
  };
  // * rating checkbox handler (need to be change)
  const handleRatingCheckboxChange = (isChecked, label) => {
    if (isChecked) {
      setRatingCheckboxItem((prevreleventCheckboxItems) => [
        ...prevreleventCheckboxItems,
        label,
      ]);
    } else {
      setRatingCheckboxItem((prevreleventCheckboxItems) =>
        prevreleventCheckboxItems.filter((item) => item !== label)
      );
    }
  };
  // * form submit function
  const onSubmitForm = () => {
    // console.log("form values:", getValues());
    if (isFormSubmitted) {
      console.log("form submitted");
    }
  };
  // console.log("form values", getValues());
  const imageTextsAndFunctionality = [
    {
      id: 0,
      text: "קבצים",
      source: require("../../../../assets/icons/iconImgs/folder.png"),
      iconPress: () => {
        console.log("folder");
      },
    },
    {
      id: 1,
      text: "מפרט",
      source: require("../../../../assets/icons/iconImgs/paperSheet.png"),
      iconPress: () => {
        console.log("paperSheet");
      },
    },
    {
      id: 2,
      text: "הגדרות",
      source: require("../../../../assets/icons/iconImgs/settings.png"),
      iconPress: () => {
        console.log("settings");
      },
    },
    {
      id: 3,
      text: "קטגוריות",
      source: require("../../../../assets/icons/iconImgs/categories.png"),
      iconPress: () => {
        console.log("categories");
        setModalVisible(true);
      },
    },
    {
      id: 4,
      text: "סיכום",

      source: require("../../../../assets/icons/iconImgs/notebook.png"),
      iconPress: () => {
        console.log("notebook");
      },
    },
    {
      id: 5,
      text: "צפייה",

      source: require("../../../../assets/icons/iconImgs/eye.png"),
      iconPress: () => {
        console.log("eye");
      },
    },
  ];
  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  }, []);

  // * determain the color of the gradewrapper based on the grade value
  const gradeBackgroundColor = (grade) => {
    if (grade >= 90) {
      return colors.toggleColor1;
    } else if (grade < 90 && grade >= 85) {
      return colors.green;
    } else if (grade <= 84 && grade >= 79) {
      return colors.orange;
    } else if (grade < 79 && grade >= 70) {
      return colors.pink;
    } else {
      return colors.redish;
    }
  };
  const renderImageTextItem = ({ item }) => {
    return (
      <View style={{ marginRight: 10 }}>
        <ImageText
          imageSource={item.source}
          ImageText={item.text}
          id={item.id}
          onIconPress={item.iconPress}
        />
      </View>
    );
  };
  // * finding the current report data based on the category id from the report edit mode.
  const getRelevantData = (data) => {
    // * parsing the data
    const CategoriesArrayOfData = JSON.parse(data);

    const relevantData = CategoriesArrayOfData.find(
      (category) => category.id == passedDownCategoryId
    );
    if (relevantData) {
      setCurrentReportItems(relevantData.items);
      setCategoryGrade(relevantData.grade);
    } else {
      console.log("Failed to find Relevant Data");
    }
  };
  useEffect(() => {
    const categoriesDataReport = currentReport.getCategoriesData();
    getRelevantData(categoriesDataReport);
    // console.log("currentReportItems:", currentReportItems);
    // console.log(CategoriesItems);
    console.log(relevantCheckboxItems, ratingCheckboxItem);
  }, [ratingCheckboxItem]);

  const AccordionCategoriesGeneralList = CategoriesItems.map((item) => {
    let reportItem = currentReportItems.find(
      (element) => element.id == item.id
    );
    // console.log(reportItem);
    return {
      id: item.id,
      component: (
        <CategoryAccordionItem
          handleCheckboxChange={handleCheckboxChange}
          handleRatingCheckboxChange={handleRatingCheckboxChange}
          releventCheckboxItems={relevantCheckboxItems}
          ratingCheckboxItem={ratingCheckboxItem}
          control={control}
          setValue={setValue}
          trigger={trigger}
          errors={errors}
          sectionText={item.name}
          grade0={item.grade0}
          grade1={item.grade1}
          grade2={item.grade2}
          grade3={item.grade3}
          itemId={item.id}
          critical={item.critical}
          noCalculate={reportItem?.noCalculate ?? false}
          lastDate={reportItem?.lastDate}
          charge={reportItem?.charge}
        />
      ),
    };
  });

  const AccordionCategoriesTemperatureList = [
    {
      id: 1,
      component: (
        <CategoryAccordionItem
          handleCheckboxChange={handleCheckboxChange}
          handleRatingCheckboxChange={handleRatingCheckboxChange}
          releventCheckboxItems={relevantCheckboxItems}
          ratingCheckboxItem={ratingCheckboxItem}
          control={control}
          setValue={setValue}
          trigger={trigger}
          errors={errors}
          sectionText="האם נצפה זיהום ויזאולי על ציוד וכלים, כולל ציוד שטיפה לכלים"
          // imagesArray={images}
        />
      ),
    },
    {
      id: 2,
      component: (
        <CategoryAccordionItem
          handleCheckboxChange={handleCheckboxChange}
          handleRatingCheckboxChange={handleRatingCheckboxChange}
          releventCheckboxItems={relevantCheckboxItems}
          ratingCheckboxItem={ratingCheckboxItem}
          control={control}
          setValue={setValue}
          trigger={trigger}
          errors={errors}
          sectionText="האם נצפה זיהום ויזאולי על ציוד וכלים, כולל ציוד שטיפה לכלים"
        />
      ),
    },
    {
      id: 3,
      component: (
        <CategoryAccordionItem
          handleCheckboxChange={handleCheckboxChange}
          handleRatingCheckboxChange={handleRatingCheckboxChange}
          releventCheckboxItems={relevantCheckboxItems}
          ratingCheckboxItem={ratingCheckboxItem}
          control={control}
          setValue={setValue}
          trigger={trigger}
          errors={errors}
          sectionText="האם נצפה זיהום ויזאולי על ציוד וכלים, כולל ציוד שטיפה לכלים"
        />
      ),
    },
  ];
  const categoriesModal = [
    {
      subheader: "Section 1",
      options: [
        "Option 1",
        "Option 2",
        "Option 3",
        "Option 3",
        "Option 3",
        "Option 3",
      ],
    },
    {
      subheader: "Section 2",
      options: ["Option 4", "Option 5", "Option 6"],
    },
    {
      subheader: "Section 3",
      options: ["Option 7", "Option 8", "Option 9"],
    },
  ];

  return (
    <ScreenWrapper
      isConnectedUser
      wrapperStyle={{ backgroundColor: colors.white }}
    >
      <View style={styles.goBackWrapper}>
        <TouchableOpacity onPress={navigateTogoBack}>
          <Image
            source={require("../../../../assets/imgs/rightDirIcon.png")}
            style={styles.goBackIcon}
          />
        </TouchableOpacity>
        <Text style={styles.goBackText}>חזרה לרשימת הלקוחות</Text>
      </View>

      <View style={styles.headerWrapper}>
        <View style={styles.headerContainer}>
          <Text style={styles.header}>
            עריכת דוח עבור {currentClient.getCompany()} - {currentStation}
          </Text>

          <Text style={styles.subheader}>
            {categoryHeader}
            {" > "}
            {categorySubHeader}
          </Text>
        </View>
        <View style={styles.imageTextList}>
          <FlatList
            data={imageTextsAndFunctionality}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderImageTextItem}
            horizontal={true}
          />
        </View>
      </View>

      <View style={styles.categoryContainer}>
        <View style={styles.gradesContainer}>
          <ReportGrade
            reportGradeBoxColor={gradeBackgroundColor(categoryGrade)}
            reportGradeNumber={categoryGrade}
            reportGradeText={"ציון קטגוריה"}
          />
          <ReportGrade
            reportGradeBoxColor={gradeBackgroundColor(foodSafetyGrade)}
            reportGradeNumber={foodSafetyGrade}
            reportGradeText={"ציון ביקורת בטיחות מזון"}
          />
          <ReportGrade
            reportGradeBoxColor={gradeBackgroundColor(reportGrade)}
            reportGradeNumber={reportGrade}
            reportGradeText={"ציון לדוח"}
          />
        </View>
        {isLoading ? (
          <Loader visible={isLoading} />
        ) : (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              padding: 16,
              borderWidth: 1,
              borderColor: "rgba(83, 104, 180, 0.30)",
            }}
          >
            <FlatList
              data={AccordionCategoriesGeneralList}
              renderItem={({ item }) => <CategoryAccordion item={item} />}
              keyExtractor={(item) => item.id.toString()}
            />
          </View>
        )}
      </View>

      {/* <View
        style={{
          width: "100%",
          justifyContent: "center",
          alignItems: "center",
          // marginBottom: 50,
        }}
      >
        <Drawer
          content={
            <LinearGradient
              colors={["#37549D", "#26489F"]}
              start={[0, 0]}
              end={[1, 0]}
              style={{ width: "100%", padding: 16, height: 76, zIndex: 1 }}
            >
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "row",
                }}
              >
                <TouchableOpacity
                  onPress={() => console.log("prev category")}
                  style={{
                    alignSelf: "center",
                    // justifyContent: "flex-end",
                    // marginLeft: "auto",
                    flexDirection: "row",
                    gap: 5,
                    alignItems: "center",
                  }}
                >
                  <Image
                    source={accordionCloseIcon}
                    style={{
                      width: 20,
                      height: 20,
                      transform: [{ rotate: "180deg" }],
                    }}
                  />
                  <Text style={styles.categoryDirButton}>
                    הקטגוריה הקודמת:{" "}
                  </Text>
                </TouchableOpacity>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    textAlign: "center",
                    marginLeft: "auto",
                    // marginRight: -30,
                    gap: 12,
                  }}
                >
                  <Image source={FileIcon} style={{ width: 24, height: 24 }} />
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
                <TouchableOpacity
                  onPress={() => console.log("next category")}
                  style={{
                    alignSelf: "center",
                    // justifyContent: "flex-end",
                    flexDirection: "row",
                    gap: 5,
                    alignItems: "center",
                    marginLeft: "auto",
                  }}
                >
                  <Text style={styles.categoryDirButton}>הקטגוריה הבאה: </Text>
                  <Image
                    source={accordionCloseIcon}
                    style={{ width: 20, height: 20 }}
                  />
                </TouchableOpacity>
              </View>
            </LinearGradient>
          }
          height={300}
          onToggle={handleDrawerToggle}
        />
      </View> */}
      {modalVisible && (
        <View>
          <ModalUi
            header="קטגוריות"
            modalContent={categoriesModal}
            onClose={handleModalClose}
            handleOptionClick={handleOptionClick}
          />
        </View>
      )}
    </ScreenWrapper>
  );
};

export default EditExistingReport;

const styles = StyleSheet.create({
  goBackWrapper: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
    marginTop: 16,
  },
  goBackText: {
    fontSize: 14,
    fontFamily: fonts.ARegular,
  },
  goBackIcon: { width: 20, height: 20 },
  headerWrapper: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 30,
  },
  headerContainer: {},
  header: {
    alignItems: "center",
    justifyContent: "flex-start",
    textAlign: "left",
    fontSize: 24,
    fontFamily: fonts.ABold,
  },
  subheader: {
    alignItems: "center",
    width: "100%",
    justifyContent: "flex-start",
    textAlign: "left",
  },
  imageTextList: {},
  categoryContainer: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#5368B4",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,

    // maxHeight: 548,
    overflow: "hidden",
  },
  gradesContainer: {
    flexDirection: "row",
    gap: 16,
    backgroundColor: colors.accordionOpen,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  categoryDirButton: {
    color: colors.white,
    fontFamily: fonts.ARegular,
    fontSize: 16,
  },
});
