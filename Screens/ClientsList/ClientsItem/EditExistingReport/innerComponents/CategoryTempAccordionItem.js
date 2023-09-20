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
import * as ImagePicker from "expo-image-picker";
import criticalIcon from "../../../../../assets/imgs/criticalIcon.png";
import uuid from "uuid-random";
import Radio from "../../../../../Components/ui/Radio";
import * as FileSystem from "expo-file-system";
import { useActionSheet } from "@expo/react-native-action-sheet";
import Loader from "../../../../../utiles/Loader";
const ratingsOptions = [
  { label: "0", value: "0" },
  { label: "1", value: "1" },
  { label: "2", value: "2" },
  { label: "3", value: "3" },
];
const tempFoodTypeOptions = [
  { value: "1", label: "טמפרטורת מזון חם בהגשה" },
  { value: "2", label: "טמפרטורת מזון חם בקבלה" },
  { value: "3", label: "טמפרטורת מזון חם בארון חימום" },
  { value: "4", label: "טמפרטורת מזון חם בשילוח" },
  { value: "5", label: "טמפרטורת מזון חם בבישול" },
  { value: "6", label: "טמפרטורת מזון קר" },
  { value: "7", label: "טמפרטורת מזון קר בקבלה" },
  { value: "8", label: "טמפרטורה מזון לאחר שיחזור המזון" },
];
const gradeLabels = ["ליקוי חמור", "ליקוי בינוני", "ליקוי קל", "תקין"];

const CategoryTempAccordionItem = ({
  control,
  setValue,
  trigger,
  errors,
  accordionHeight,
  reportItem,
  onTempReportItem,
}) => {
  // console.log("render id ", reportItem);
  const { showActionSheetWithOptions } = useActionSheet();
  const [open, setOpen] = useState(false);
  const heightAnim = useState(new Animated.Value(0))[0];
  const [accordionBg, setAccordionBg] = useState(colors.white);
  const [images, setImages] = useState([]);
  const [reportItemState, setReportItemState] = useState(reportItem || {});
  const [imageLoader, setImageLoader] = useState(false);
  // * Simulating your debounce function
  const debounce = (fn, delay) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        fn(...args);
      }, delay);
    };
  };
  // * change handler
  const handleReportChange = useMemo(() => {
    return debounce((value, label) => {
      const temp = { ...reportItemState };
      temp[label] = value;
      const measuredTemp = parseFloat(temp["TempMeasured"]);
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
      if (label == "TempMeasured" || label == "TempFoodType") {
        // * TempTarget value is 5 set the following conditions
        if (temp["TempTarget"] == "5") {
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
        } else if (temp["TempTarget"] == "65") {
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
        } else if (temp["TempTarget"] == "75") {
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
        } else if (temp["TempTarget"] == "80") {
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
      }

      temp["comment"] = gradeLabels[temp["grade"]];
      onTempReportItem(temp);
      setReportItemState(temp);
    }, 300);
  }, [reportItemState]);

  // * image picker
  const showImagePickerOptions = useCallback(async () => {
    const options = ["Take a Photo", "Choose from Library", "Cancel"];

    if (images.length >= 1) {
      alert("You can only select up to 1 images.");
      return;
    }

    try {
      const buttonIndex = await new Promise((resolve) => {
        showActionSheetWithOptions(
          {
            options,
            cancelButtonIndex: 2,
          },
          (buttonIndex) => {
            resolve(buttonIndex);
          }
        );
      });

      if (buttonIndex === 0) {
        // Take a photo
        const result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        });

        if (!result.cancelled) {
          setImages((prevImages) => [...prevImages, result.uri]);
        }
      } else if (buttonIndex === 1) {
        // Choose from library
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: false,
          aspect: [4, 3],
          quality: 1,
        });
        if (!result.canceled) {
          setImageLoader(true);
          const selectedAssets = result.assets;

          let fileName = selectedAssets[0].fileName;
          let fileSize = selectedAssets[0].fileSize;
          const fileToUpload = selectedAssets[0];
          const apiUrl =
            process.env.API_BASE_URL +
            "imageUpload.php?ax-file-path=uploads%2F&ax-allow-ext=jpg%7Cgif%7Cpng&ax-file-name=" +
            fileName +
            "&ax-thumbHeight=0&ax-thumbWidth=0&ax-thumbPostfix=_thumb&ax-thumbPath=&ax-thumbFormat=&ax-maxFileSize=1001M&ax-fileSize=" +
            fileSize +
            "&ax-start-byte=0&isLast=true";
          const response = await FileSystem.uploadAsync(
            apiUrl,
            fileToUpload.uri,
            {
              fieldName: "ax-file-name",
              httpMethod: "POST",
              uploadType: FileSystem.FileSystemUploadType.BINARY_CONTENT,
            }
          );

          if (response.status == 200) {
            let responseBody = JSON.parse(response.body);
            if (responseBody.status == "error") {
              setImageLoader(false);
              Alert.alert("Error", responseBody.info);
            } else {
              setImageLoader(false);
              // Check and push the image into the appropriate field
              if (images.length === 0) {
                handleReportChange("uploads/" + responseBody.name, "image");
              } else if (images.length === 1) {
                handleReportChange("uploads/" + responseBody.name, "image2");
              } else if (images.length === 2) {
                handleReportChange("uploads/" + responseBody.name, "image3");
              }
              setImages((prevImages) => [...prevImages, fileToUpload.uri]);
              console.log("images", fileToUpload.uri);
            }
          }
        }
      }
    } catch (error) {
      console.error("Error while showing image picker:", error);
    }
  }, [images]);

  // console.log(selectedOption);
  const toggleAccordion = useCallback(() => {
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
  }, [open]);

  const temperatureOptions = ["מתחת ל-0", ...Array(81).keys(), "מעל 80"].map(
    (item) => {
      return { value: item + "", label: item + "" };
    }
  );

  const selectedTempFoodType = tempFoodTypeOptions.find(
    (option) => option.value == reportItemState.TempFoodType
  );
  // console.log(tempFoodTypeOptions[3]);
  const selectedTemperature = temperatureOptions.find(
    (option) => option.value == reportItemState.TempMeasured
  );
  // console.log(reportItemState.grade == undefined);
  // todo add the image to the accordion after picked
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
            <Text style={{ fontFamily: fonts.ABold }}>סוג המזון שנבדק:</Text>
            <SelectMenu
              control={control}
              name={"TempFoodType"}
              selectOptions={tempFoodTypeOptions}
              propertyName={"label"}
              selectWidth={188}
              optionsCenterView={"flex-start"}
              optionsHeight={150}
              defaultText={
                selectedTempFoodType
                  ? selectedTempFoodType.label
                  : tempFoodTypeOptions[0].label
              }
              // displayedValue={
              //   selectedTempFoodType ? selectedTempFoodType.value : "בחירה"
              // }
              optionsLocation={100}
              // centeredViewStyling={{ marginLeft: 480 }}
              onChange={(value) => {
                handleReportChange(value.value, "TempFoodType");
                setValue("foodType", value.value);
                // trigger("foodType");
                console.log("value", value.value);
              }}
              returnObject={true}
              errorMessage={errors.foodType && errors.foodType.message}
            />
            <Text style={{ fontFamily: fonts.ABold, marginLeft: 20 }}>
              שם המנה:{" "}
            </Text>
            <Input
              control={control}
              name={"nameOfDish"}
              mode={"outlined"}
              // label={"חזה עוף"}
              defaultValue={reportItemState.TempFoodName}
              contentStyle={[
                styles.inputContentStyling,
                { backgroundColor: open ? "white" : colors.accordionOpen },
              ]}
              inputStyle={[styles.inputStyling, { width: 270 }]}
              activeUnderlineColor={colors.black}
              onChangeFunction={(value) => {
                console.log(value, "is selected");
                handleReportChange(value, "TempFoodName");
                setValue("nameOfDish", value);
                trigger("nameOfDish");
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
            <Text style={{ fontFamily: fonts.ABold }}>טמפ׳ שנמדדה:</Text>
            <SelectMenu
              control={control}
              name={"TempMeasured"}
              selectOptions={temperatureOptions}
              propertyName={"label"}
              selectWidth={90}
              foodTypeOptions
              optionsCenterView={"flex-start"}
              optionsHeight={150}
              defaultText={
                selectedTemperature
                  ? selectedTemperature.label
                  : temperatureOptions[0].label
              }
              // displayedValue={dateSelected}
              optionsLocation={100}
              // centeredViewStyling={{ marginLeft: 480 }}
              onChange={(value) => {
                // setValue("temp", value);
                handleReportChange(value.value, "TempMeasured");

                // trigger("temp");
                // console.log("val:", value);
              }}
              returnObject={true}
              errorMessage={errors.TempMeasured && errors.TempMeasured.message}
            />
            <Text style={{ fontFamily: fonts.ABold }}> טמפ׳ יעד:</Text>
            <Input
              control={control}
              name={"TempTarget"}
              mode={"flat"}
              // label={"65c"}
              // defaultValue={
              //   !reportItemState.TempTarget ? "65" : reportItemState.TempTarget
              // }
              value={reportItemState.TempTarget ?? "65"}
              disabled
              // placeholder={"יש לנקות *ממטרות* מדיח כלים"}
              contentStyle={[
                styles.inputContentStyling,
                { backgroundColor: open ? "white" : colors.accordionOpen },
              ]}
              inputStyle={[styles.inputStyling, { width: 70 }]}
              activeUnderlineColor={colors.black}
              onChangeFunction={(value) => {
                // console.log(value.value, "is selected");
                // handleReportChange(value.value, "TempTarget");
                setValue("TempTarget", value.value);
                trigger("TempTarget");
              }}
            />
          </View>
          {/* <Text> דירוג:</Text> */}

          <View style={styles.categoryRatingCheckboxWrapper}>
            <Radio
              options={ratingsOptions}
              optionGap={38}
              optionText="דירוג:"
              disabled={false}
              selectedOption={
                reportItemState?.grade == undefined ? 3 : reportItemState?.grade
              }
              onChange={(option) => handleReportChange(option, "grade")}
              // disabled={reportItemState.noRelevant}
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
            // label={'"יש לנקות *ממטרות* מדיח כלים"'}
            defaultValue={reportItemState.comment}
            // placeholder={"יש לנקות *ממטרות* מדיח כלים"}
            contentStyle={styles.inputContentStyling}
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

            <TouchableOpacity onPress={showImagePickerOptions}>
              <Text style={styles.ImageUploadText}>הוספת תמונה</Text>
            </TouchableOpacity>
            <ScrollView horizontal>
              {images.map((image, index) => (
                <TouchableOpacity
                  key={uuid()}
                  onPress={(value) => console.log("open modal", value)}
                >
                  {imageLoader ? (
                    <Loader
                      visible={imageLoader}
                      loaderStyling={{
                        width: 12,
                        height: 12,
                      }}
                      loaderWrapperStyle={{
                        zIndex: 1,
                        alignSelf: "center",
                        justifyContent: "center",
                      }}
                      color={colors.black}
                    />
                  ) : (
                    <Image
                      source={{ uri: image }}
                      style={styles.uploadedPhoto}
                    />
                  )}
                </TouchableOpacity>
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
    // gap: 5,
    alignItems: "center",
    marginTop: 16,
    marginBottom: 16,
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
export default React.memo(CategoryTempAccordionItem);
