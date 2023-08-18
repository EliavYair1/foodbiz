import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Animated,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ScrollView,
} from "react-native";
import { Divider } from "react-native-paper";
import CheckboxItem from "../../../../WorkerNewReport/CheckboxItem/CheckboxItem";
import fonts from "../../../../../styles/fonts";
import colors from "../../../../../styles/colors";
import Input from "../../../../../Components/ui/Input";
import DatePicker from "../../../../../Components/ui/datePicker";
import SelectMenu from "../../../../../Components/ui/SelectMenu";
import ClientItemArrow from "../../../../../assets/imgs/ClientItemArrow.png";
import useMediaPicker from "../../../../../Hooks/useMediaPicker";
import * as ImagePicker from "expo-image-picker";
import criticalIcon from "../../../../../assets/imgs/criticalIcon.png";
import uuid from "uuid-random";
import Radio from "../../../../../Components/ui/Radio";
const CategoryWeightsAccordionItem = ({
  handleRatingCheckboxChange,
  ratingCheckboxItem,
  control,
  setValue,
  trigger,
  errors,
  sectionText,
  grade0,
  grade1,
  grade2,
  grade3,
  itemId,
  // dateSelected,
  // selectedDates,
  accordionHeight,
  reportItem,
}) => {
  const [open, setOpen] = useState(false);
  const heightAnim = useState(new Animated.Value(0))[0];
  const [accordionBg, setAccordionBg] = useState(colors.white);
  const [images, setImages] = useState([]);
  const [reportItemState, setReportItemState] = useState(reportItem || {});
  useEffect(() => {
    setReportItemState((prevReportItemState) => ({
      ...prevReportItemState,
      ...reportItem,
    }));
  }, [reportItem]);
  // * image picker
  const pickImage = async () => {
    if (images.length >= 1) {
      alert("You can only select up to 3 images.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync();
    if (!result.canceled) {
      const selectedAssets = result.assets;
      const selectedImage =
        selectedAssets.length > 0 ? selectedAssets[0].uri : null;
      if (selectedImage) {
        setImages((prevImages) => [...prevImages, selectedImage]);
      }
    }
  };
  const toggleAccordion = () => {
    setOpen(!open);
    if (!open) {
      setAccordionBg(colors.accordionOpen);
    } else {
      setAccordionBg(colors.white);
    }
    Animated.timing(heightAnim, {
      toValue: open ? 0 : accordionHeight,
      duration: 250,
      useNativeDriver: false,
    }).start();
  };
  const gradeLabels = ["ליקוי חמור", "ליקוי בינוני", "ליקוי קל", "תקין"];
  // * change handler
  const handleReportChange = useCallback(
    (value, label) => {
      setReportItemState((prev) => {
        const temp = { ...prev };
        temp[label] = value;
        const measuredTemp = parseFloat(temp["TempMeasured"]);

        // * match the grade to his str based on gradeLabels array
        if (label === "grade") {
          temp["comment"] = gradeLabels[value];
        }
        // * if TempFoodType value is x then change the TempTarget to y
        if (label == "TempFoodType") {
          if (value <= "4") {
            temp["TempTarget"] = "65";
          } else if (value == "5") {
            temp["TempTarget"] = "75";
          } else if (value == "6" || value == "7") {
            temp["TempTarget"] = "5";
          } else {
            temp["TempTarget"] = "80";
          }
        }
        // * TempTarget value is 5 set the following conditions
        if (temp["TempTarget"] == "5" && label === "TempMeasured") {
          // * if TempMeasured <x || y change the grade to z
          if (measuredTemp < 6 || temp["TempMeasured"] == "מתחת ל-0") {
            temp["grade"] = 3;
          } else if (measuredTemp >= 6 && measuredTemp < 11) {
            temp["grade"] = 2;
          } else if (measuredTemp >= 11 && measuredTemp < 16) {
            temp["grade"] = 1;
          } else {
            temp["grade"] = 0;
          }
          // * TempTarget value is 65 set the following conditions
        } else if (temp["TempTarget"] == "65" && label === "TempMeasured") {
          if (measuredTemp > 64 || temp["TempMeasured"] == "מעל 80") {
            temp["grade"] = 3;
          } else if (measuredTemp > 59 && measuredTemp <= 64) {
            temp["grade"] = 2;
          } else if (measuredTemp > 54 && measuredTemp <= 59) {
            temp["grade"] = 1;
          } else {
            temp["grade"] = 0;
          }
          // * TempTarget value is 75 set the following conditions
        } else if (temp["TempTarget"] == "75" && label === "TempMeasured") {
          if (measuredTemp > 74 || temp["TempMeasured"] == "מעל 80") {
            temp["grade"] = 3;
          } else if (measuredTemp > 64 && measuredTemp <= 74) {
            temp["grade"] = 2;
          } else if (measuredTemp > 59 && measuredTemp <= 64) {
            temp["grade"] = 1;
          } else {
            temp["grade"] = 0;
          }
          // * TempTarget value is 80 set the following conditions
        } else if (temp["TempTarget"] == "80" && label === "TempMeasured") {
          if (measuredTemp > 79 || temp["TempMeasured"] == "מעל 80") {
            temp["grade"] = 3;
          } else if (measuredTemp > 74 && measuredTemp <= 79) {
            temp["grade"] = 2;
          } else if (measuredTemp > 69 && measuredTemp <= 74) {
            temp["grade"] = 1;
          } else {
            temp["grade"] = 0;
          }
        }
        return temp;
      });
    },
    [reportItemState]
  );
  useEffect(() => {
    // Initialize reportItemState and compute values
    const initialReportItemState = { ...reportItem };
    // Perform any additional computations here based on initialReportItemState
    setReportItemState(initialReportItemState);
  }, [reportItem]);
  const ratingsOptions = [
    { label: "0", value: "0" },
    { label: "1", value: "1" },
    { label: "2", value: "2" },
    { label: "3", value: "3" },
  ];
  return (
    <View
      style={[
        styles.accordionCategoryItemWrapper,
        { backgroundColor: open ? colors.accordionOpen : colors.white },
      ]}
    >
      <TouchableOpacity onPress={toggleAccordion}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 16,
          }}
        >
          <View
            style={{
              fontFamily: fonts.ABold,
              flexDirection: "row",
              alignItems: "center",
              gap: 12,
            }}
          >
            <Text style={{ fontFamily: fonts.ABold }}>
              שם המנה:{" "}
              {/* <Text style={{ fontFamily: fonts.ARegular }}>{sectionText}</Text>: */}
            </Text>

            <Input
              control={control}
              name={"remarks"}
              mode={"outlined"}
              placeholder={""}
              contentStyle={[
                styles.inputContentStyling,
                { backgroundColor: open ? "white" : colors.accordionOpen },
              ]}
              inputStyle={[styles.inputStyling, { width: 193 }]}
              activeUnderlineColor={colors.black}
              onChangeFunction={(value) => {
                console.log(value, "is selected");
                setValue("remarks", value);
                trigger("remarks");
              }}
            />
            <Text style={{ fontFamily: fonts.ABold }}>משקל נטו לפי מפרט:</Text>
            <Input
              control={control}
              name={"remarks"}
              mode={"outlined"}
              defaultValue={""}
              contentStyle={[
                styles.inputContentStyling,
                { backgroundColor: open ? "white" : colors.accordionOpen },
              ]}
              inputStyle={[styles.inputStyling, { width: 193 }]}
              activeUnderlineColor={colors.black}
              onChangeFunction={(value) => {
                console.log(value, "is selected");
                setValue("remarks", value);
                trigger("remarks");
              }}
            />
          </View>

          {open ? (
            <Image
              source={ClientItemArrow}
              style={{
                width: 20,
                height: 20,
                transform: [{ rotate: "-90deg" }],
              }}
            />
          ) : (
            <Image source={ClientItemArrow} style={{ width: 20, height: 20 }} />
          )}
        </View>

        <Divider />

        <View style={styles.categoryRatingCheckboxWrapper}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
            <Text style={{ fontFamily: fonts.ABold }}>דירוג:</Text>
            <View style={styles.categoryRatingCheckboxWrapper}>
              <Radio
                options={ratingsOptions}
                optionGap={38}
                // optionText="דירוג:"
                disabled={false}
                // selectedOption={
                //   reportItemState?.grade == undefined ? 3 : reportItemState?.grade
                // }
                onChange={(option) => handleReportChange(option, "grade")}
                // disabled={reportItemState.noRelevant}
              />
            </View>
            <Text style={{ fontFamily: fonts.ABold }}> משקל ממוצע:</Text>
            <Input
              control={control}
              name={"remarks"}
              mode={"outlined"}
              defaultValue={""}
              contentStyle={[
                styles.inputContentStyling,
                { backgroundColor: open ? "white" : colors.accordionOpen },
              ]}
              inputStyle={[styles.inputStyling, { width: 213 }]}
              activeUnderlineColor={colors.black}
              onChangeFunction={(value) => {
                console.log(value, "is selected");
                setValue("remarks", value);
                trigger("remarks");
              }}
            />
          </View>
        </View>
        {/* !!!!!!! */}
        <View style={styles.massurementInputsWrapper}>
          <View
            style={{ flexDirection: "column", alignItems: "center", gap: 0 }}
          >
            <Text style={{ fontFamily: fonts.ABold }}> משקל שנמדד 1:</Text>
            <Input
              control={control}
              name={"remarks"}
              mode={"outlined"}
              defaultValue={""}
              contentStyle={[
                styles.inputContentStyling,
                { backgroundColor: open ? "white" : colors.accordionOpen },
              ]}
              inputStyle={[styles.inputStyling, { width: 136 }]}
              activeUnderlineColor={colors.black}
              numeric={true}
              onChangeFunction={(value) => {
                console.log(value, "is selected");
                setValue("remarks", value);
                trigger("remarks");
              }}
            />
          </View>
          <View
            style={{ flexDirection: "column", alignItems: "center", gap: 0 }}
          >
            <Text style={{ fontFamily: fonts.ABold }}> משקל שנמדד 2:</Text>
            <Input
              control={control}
              name={"remarks"}
              mode={"outlined"}
              defaultValue={""}
              contentStyle={[
                styles.inputContentStyling,
                { backgroundColor: open ? "white" : colors.accordionOpen },
              ]}
              inputStyle={[styles.inputStyling, { width: 136 }]}
              activeUnderlineColor={colors.black}
              numeric={true}
              onChangeFunction={(value) => {
                console.log(value, "is selected");
                setValue("remarks", value);
                trigger("remarks");
              }}
            />
          </View>
          <View
            style={{ flexDirection: "column", alignItems: "center", gap: 0 }}
          >
            <Text style={{ fontFamily: fonts.ABold }}> משקל שנמדד 3:</Text>
            <Input
              control={control}
              name={"remarks"}
              mode={"outlined"}
              defaultValue={""}
              contentStyle={[
                styles.inputContentStyling,
                { backgroundColor: open ? "white" : colors.accordionOpen },
              ]}
              inputStyle={[styles.inputStyling, { width: 136 }]}
              activeUnderlineColor={colors.black}
              numeric={true}
              onChangeFunction={(value) => {
                console.log(value, "is selected");
                setValue("remarks", value);
                trigger("remarks");
              }}
            />
          </View>
          <View
            style={{ flexDirection: "column", alignItems: "center", gap: 0 }}
          >
            <Text style={{ fontFamily: fonts.ABold }}> משקל שנמדד 4:</Text>
            <Input
              control={control}
              name={"remarks"}
              mode={"outlined"}
              defaultValue={""}
              contentStyle={[
                styles.inputContentStyling,
                { backgroundColor: open ? "white" : colors.accordionOpen },
              ]}
              inputStyle={[styles.inputStyling, { width: 136 }]}
              activeUnderlineColor={colors.black}
              numeric={true}
              onChangeFunction={(value) => {
                console.log(value, "is selected");
                setValue("remarks", value);
                trigger("remarks");
              }}
            />
          </View>
          <View
            style={{ flexDirection: "column", alignItems: "center", gap: 0 }}
          >
            <Text style={{ fontFamily: fonts.ABold }}> משקל שנמדד 5:</Text>
            <Input
              control={control}
              name={"remarks"}
              mode={"outlined"}
              defaultValue={""}
              contentStyle={[
                styles.inputContentStyling,
                { backgroundColor: open ? "white" : colors.accordionOpen },
              ]}
              inputStyle={[styles.inputStyling, { width: 136 }]}
              activeUnderlineColor={colors.black}
              numeric={true}
              onChangeFunction={(value) => {
                console.log(value, "is selected");
                setValue("remarks", value);
                trigger("remarks");
              }}
            />
          </View>
        </View>
      </TouchableOpacity>

      <Animated.View
        style={{
          overflow: "hidden",
          height: heightAnim,
          transitionProperty: "height",
          transitionDuration: "0.3s",
        }}
      >
        <View style={styles.inputTextWrapper}>
          <Text style={styles.inputLabel}>הערות סוקר:</Text>
          <Input
            control={control}
            name={"remarks"}
            mode={"flat"}
            label={""}
            contentStyle={[
              styles.inputContentStyling,
              { backgroundColor: open ? "white" : colors.accordionOpen },
            ]}
            inputStyle={[styles.inputStyling, { minWidth: "100%" }]}
            activeUnderlineColor={colors.black}
            onChangeFunction={(value) => {
              console.log(value, "is selected");
              setValue("remarks", value);
              trigger("remarks");
            }}
          />
        </View>

        <View style={styles.forthRowInputTextWrapper}>
          <View style={styles.headerWrapper}>
            <Text style={styles.header}>תמונות:</Text>

            <TouchableOpacity onPress={pickImage}>
              <Text style={styles.ImageUploadText}>הוספת תמונה</Text>
            </TouchableOpacity>
            <ScrollView horizontal>
              {images.map((image, index) => (
                <View key={uuid()}>
                  <Image source={{ uri: image }} style={styles.uploadedPhoto} />
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  accordionCategoryItemWrapper: {
    width: 762,
    padding: 16,
    borderWidth: 1,
    borderRadius: 4,
    borderColor: "rgba(83, 104, 180, 0.30)",
  },
  categoryRelevantCheckboxWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 16,
    marginBottom: 16,
  },
  categoryRatingCheckboxWrapper: {
    flexDirection: "row",
    gap: 28,
    alignItems: "center",
    marginTop: 16,
    marginBottom: 16,
    marginRight: 24,
  },
  massurementInputsWrapper: {
    flexDirection: "row",
    gap: 12,
  },
  inputTextWrapper: {
    flexDirection: "row",
    gap: 12,
    paddingVertical: 16,
  },
  secondRowInputTextWrapper: {
    flexDirection: "row",
    justifyContent: "flex-start",
    gap: 32,
    marginBottom: 20,
  },
  thirdRowInputTextWrapper: {
    flexDirection: "row",
    justifyContent: "flex-start",
    gap: 32,
  },
  inputLabel: {
    alignSelf: "center",
  },

  inputContentStyling: { backgroundColor: "white" },
  inputStyling: {
    // minWidth: "100%",
    backgroundColor: "white",
    borderRadius: 4,
  },
  inputContentThirdRow: { backgroundColor: "white" },
  inputThirdRowStyling: {
    minWidth: 213,
    backgroundColor: "white",
    borderRadius: 4,
  },
  forthRowInputTextWrapper: {
    paddingVertical: 16,
    justifyContent: "center",
  },
  ImageUploadText: {
    textAlign: "left",
    fontFamily: fonts.ABold,
    marginLeft: 46,
    marginRight: 26,
  },
  header: {
    textAlign: "left",
  },
  headerWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  uploadedPhoto: {
    width: 40,
    height: 40,
    marginRight: 10,
    alignItems: "center",
    alignSelf: "center",
  },
});
export default CategoryWeightsAccordionItem;
