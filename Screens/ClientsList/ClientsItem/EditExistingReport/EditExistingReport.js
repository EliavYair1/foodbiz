import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import React, { useState, useEffect } from "react";
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
const EditExistingReport = () => {
  const dispatch = useDispatch();
  const currentClient = useSelector(
    (state) => state.currentClient.currentClient
  );
  // console.log(currentClient.getReports().map((item) => item.getSafetyGrade()));
  const [isLoading, setIsLoading] = useState(false);
  const currentStation = useSelector((state) => state.currentStation);
  const { navigateTogoBack } = useScreenNavigator();
  const [categoryGrade, setcategoryGrade] = useState(89);
  const [foodSafetyGrade, setFoodSafetyGrade] = useState(79);
  const [reportGrade, setReportGrade] = useState(64);
  const [releventCheckboxItems, setreleventCheckboxItems] = useState([]);
  const [ratingCheckboxItem, setRatingCheckboxItem] = useState([]);
  // const [media, pickMedia, error] = useMediaPicker(handleInputChange);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const schema = yup.object().shape({
    remarks: yup.string().required("remarks is required"),
    executioner: yup.string().required("executioner is required"),
    violationType: yup.string().required("type of violation is required"),
    executionDate: yup.string().required("execution date is required"),
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

  const handleCheckboxChange = (isChecked, label) => {
    if (isChecked) {
      setreleventCheckboxItems((prevreleventCheckboxItems) => [
        ...prevreleventCheckboxItems,
        label,
      ]);
    } else {
      setreleventCheckboxItems((prevreleventCheckboxItems) =>
        prevreleventCheckboxItems.filter((item) => item !== label)
      );
    }
  };
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
  const onSubmitForm = () => {
    console.log("form values:", getValues());
    if (isFormSubmitted) {
      console.log("form submitted");
    }
  };
  console.log("form values", getValues());
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

  const AccordionCategoriesList = [
    {
      id: 1,
      component: (
        <CategoryAccordionItem
          handleCheckboxChange={handleCheckboxChange}
          handleRatingCheckboxChange={handleRatingCheckboxChange}
          releventCheckboxItems={releventCheckboxItems}
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
      id: 2,
      component: (
        <CategoryAccordionItem
          handleCheckboxChange={handleCheckboxChange}
          handleRatingCheckboxChange={handleRatingCheckboxChange}
          releventCheckboxItems={releventCheckboxItems}
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
          releventCheckboxItems={releventCheckboxItems}
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
        <View style={styles.header}>
          <Text style={styles.header}>
            עריכת דוח עבור {currentClient.getCompany()} - {currentStation}
          </Text>

          {/* <Text style={styles.subheader}>
        עריכת דוח עבור {currentClient.getCompany()} - {currentStation}
      </Text> */}
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
              data={AccordionCategoriesList}
              renderItem={({ item }) => <CategoryAccordion item={item} />}
              keyExtractor={(item) => item.id.toString()}
            />
          </View>
        )}
      </View>
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
});
