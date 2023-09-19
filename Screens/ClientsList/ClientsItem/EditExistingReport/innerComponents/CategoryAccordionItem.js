import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Animated,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ScrollView,
  Modal,
  Dimensions,
  Alert,
} from "react-native";
import { Divider } from "react-native-paper";
import CheckboxItem from "../../../../WorkerNewReport/CheckboxItem/CheckboxItem";
import fonts from "../../../../../styles/fonts";
import Input from "../../../../../Components/ui/Input";
import DatePicker from "../../../../../Components/ui/datePicker";
import SelectMenu from "../../../../../Components/ui/SelectMenu";
import ClientItemArrow from "../../../../../assets/imgs/ClientItemArrow.png";
import * as ImagePicker from "expo-image-picker";
import criticalIcon from "../../../../../assets/imgs/criticalIcon.png";
import { FlatList } from "react-native-gesture-handler";
import uuid from "uuid-random";
import Radio from "../../../../../Components/ui/Radio";
import moment from "moment";
import colors from "../../../../../styles/colors";
import "@env";
import * as FileSystem from "expo-file-system";
import axios from "axios";
const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
const relevantOptions = [
  { id: 0, label: "לא רלוונטי", value: "noRelevant" },
  { id: 1, label: "לא לשקלול", value: "noCalculate" },
  { id: 2, label: "הצג בתמצית", value: "showOnComment" },
  { id: 3, label: "אפס קטגוריה", value: "categoryReset" },
];
const ratingsOptions = [
  { label: "0", value: "0" },
  { label: "1", value: "1" },
  { label: "2", value: "2" },
  { label: "3", value: "3" },
];

const chargeSelections = [
  "קבלן ההסעדה",
  "מנהל המשק",
  "הלקוח",
  "מנהל המטבח",
  "בית החולים",
  "שירותי בריאות כללית",
  "צוות הקולנוע",
];
// * memorizing memoizing the result to prevents unnecessary re-renders
const areEqual = (prevProps, nextProps) => {
  return (
    prevProps.itemId === nextProps.itemId &&
    prevProps.noCalculate === nextProps.noCalculate &&
    prevProps.lastDate === nextProps.lastDate
  );
};

const CategoryAccordionItem = ({
  control,
  setValue,
  trigger,
  errors,
  dateSelected,
  reportItem,
  item,
  haveFine,
  onReportChange,
  accordionHeight,
}) => {
  // console.log("render id ", item.id);
  const [open, setOpen] = useState(false);
  const heightAnim = useState(new Animated.Value(0))[0];
  const [accordionBg, setAccordionBg] = useState(colors.white);
  const [reportItemState, setReportItemState] = useState(reportItem || {});
  const [images, setImages] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const openModal = (index) => {
    setSelectedImageIndex(index);
    setModalVisible(true);
  };
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
  // todo 2. displayed images coming from the api.
  // todo 3. handle the changes

  // * image picker
  const pickImage = useCallback(async () => {
    if (images.length >= 3) {
      alert("You can only select up to 3 images.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync();
    if (!result.canceled) {
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
      const response = await FileSystem.uploadAsync(apiUrl, fileToUpload.uri, {
        fieldName: "ax-file-name",
        httpMethod: "POST",
        uploadType: FileSystem.FileSystemUploadType.BINARY_CONTENT,
      });

      if (response.status == 200) {
        let responseBody = JSON.parse(response.body);
        if (responseBody.status == "error") {
          Alert.alert("Error", responseBody.info);
        } else {
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
  }, [images]);
  // const takePhoto = async () => {
  //   if (images.length >= 3) {
  //     alert("You can only select up to 3 images.");
  //     return;
  //   }

  //   const result = await ImagePicker.launchCameraAsync();

  //   if (!result.cancelled) {
  //     const selectedImage = result.uri;
  //     if (selectedImage) {
  //       setImages((prevImages) => [...prevImages, selectedImage]);
  //     }
  //   }
  // };
  // * accordion toggler
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

  // * change handler
  const handleReportChange = useCallback(
    debounce((value, label) => {
      setReportItemState((prev) => {
        const temp = { ...prev };
        temp[label] = value;

        // * Update comment and showOnComment based on the grade number value
        if (label === "grade") {
          temp["comment"] = item["grade" + value];

          relevantOptions.forEach((option) => {
            temp[option.value] =
              prev[option.value] || prev[option.value] == 1 ? 1 : 0;
          });
          temp["charge"] =
            temp["charge"] != "" ? temp["charge"] : chargeSelections[0];
          temp["lastDate"] =
            temp["lastDate"] != "" ? temp["lastDate"] : selectedDates[0];
          temp["showOnComment"] = value == 0 || value == 1 ? 1 : 0;
        }

        // * Set grade and comment for noRelevant case
        if (label === "noRelevant" && value) {
          temp["grade"] = "3";
          temp["comment"] = item["grade3"];
        }

        onReportChange(temp);

        return temp;
      });
    }, 0),
    [item]
  );

  // useEffect(() => {
  //   onReportChange({ ...reportItemState });
  // }, [reportItemState]);

  // * adding days for the lastDate selectMenu
  const addDaysToDate = (numberOfDays) => {
    let timeOfReport = dateSelected;
    const dateObject = moment.utc(timeOfReport, "DD/MM/YYYY");
    const formattedDate = dateObject.format("DD/MM/YYYY");
    const date = moment(formattedDate, "DD/MM/YYYY");
    const newDateObject = date.add(numberOfDays, "days");
    const newFormattedDate = newDateObject.format("DD/MM/YYYY");
    return newFormattedDate;
  };

  const selectedDates = [
    `${addDaysToDate(0)}`,
    `עד ה-${addDaysToDate(3)} `,
    `עד ה-${addDaysToDate(7)} `,
    `עד ה-${addDaysToDate(14)} `,
    `עד ה-${addDaysToDate(31)} `,
    " נא לשלוח תאריך מדויק לביצוע",
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
          <Text style={{ fontFamily: fonts.ABold }}>
            סעיף :{" "}
            <Text
              style={{
                fontFamily:
                  item.critical == 1 && reportItemState.grade == 0
                    ? fonts.ABold
                    : fonts.ARegular,
                color:
                  item.critical == 1 && reportItemState.grade == 0
                    ? "red"
                    : "black",
              }}
            >
              {item.name}
            </Text>
            {item.critical == 1 && (
              <Image source={criticalIcon} style={{ width: 20, height: 20 }} />
            )}
          </Text>

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
        <View style={styles.categoryRelevantCheckboxWrapper}>
          {relevantOptions.map((option) => (
            <CheckboxItem
              key={option.id}
              label={option.value}
              checkboxItemText={option.label}
              handleChange={handleReportChange}
              checked={
                reportItemState[option.value] ||
                reportItemState[option.value] == 1
              }
            />
          ))}
        </View>
        <Divider />
        <View style={styles.categoryRatingCheckboxWrapper}>
          <Radio
            options={ratingsOptions}
            optionGap={75}
            optionText="דירוג:"
            selectedOption={reportItemState.grade}
            onChange={(option) => handleReportChange(option, "grade")}
            disabled={reportItemState.noRelevant}
          />
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
            mode={"outlined"}
            defaultValue={reportItemState.comment}
            label={""}
            placeholder={""}
            // contentStyle={styles.inputContentStyling}
            inputStyle={styles.inputStyling}
            disabled={reportItemState.grade == 3}
            activeUnderlineColor={colors.black}
            onChangeFunction={(value) => {
              console.log(value, "is selected");
              handleReportChange(value, "comment");
              setValue("remarks", value);
              trigger("remarks");
            }}
          />
        </View>
        <View style={styles.secondRowInputTextWrapper}>
          <View style={{ flexDirection: "row", gap: 12 }}>
            <Text style={styles.inputLabel}>אחראי לביצוע:</Text>
            <SelectMenu
              control={control}
              name={"executioner"}
              selectOptions={
                reportItemState.grade == 3 ? null : chargeSelections
              }
              propertyName={null}
              selectWidth={237}
              optionsCenterView={"flex-start"}
              optionsHeight={150}
              disabled={reportItemState.grade == 3}
              displayedValue={reportItemState.charge}
              optionsLocation={100}
              defaultText={chargeSelections[0]}
              centeredViewStyling={{ marginLeft: 120 }}
              onChange={(value) => {
                console.log(value, "is selected");
                handleReportChange(value, "charge");
                setValue("executioner", value);
                trigger("executioner");
              }}
              returnObject={true}
              errorMessage={errors.executioner && errors.executioner.message}
            />
          </View>
          <View
            style={{
              flexDirection: "row",
              gap: 12,
            }}
          >
            <Text style={styles.inputLabel}>תאריך לביצוע:</Text>
            <View style={{ marginBottom: 0 }}>
              <SelectMenu
                control={control}
                name={"lastDate"}
                selectOptions={selectedDates}
                propertyName={null}
                selectWidth={237}
                optionsCenterView={"flex-start"}
                optionsHeight={150}
                defaultText={"בחירה"}
                disabled={reportItemState.grade == 3}
                displayedValue={dateSelected}
                optionsLocation={100}
                centeredViewStyling={{ marginLeft: 480 }}
                onChange={(value) => {
                  console.log(value, "is selected");
                  handleReportChange(value, "lastDate");
                  setValue("lastDate", value);
                  trigger("lastDate");
                }}
                returnObject={true}
                errorMessage={errors.lastDate && errors.lastDate.message}
              />
            </View>
          </View>
        </View>
        {haveFine == 1 && (
          <View style={styles.thirdRowInputTextWrapper}>
            <View style={{ flexDirection: "row", gap: 32 }}>
              <Text style={styles.inputLabel}>סוג הפרה:</Text>
              <Input
                control={control}
                name={"violationType"}
                placeholder={""}
                mode={"outlined"}
                label={""}
                defaultValue={reportItemState.violation}
                disabled={reportItemState.grade == 3}
                // contentStyle={styles.inputContentThirdRow}
                inputStyle={styles.inputThirdRowStyling}
                onChangeFunction={(value) => {
                  console.log(value, "is selected");
                  handleReportChange(value, "violation");
                  setValue("violationType", value);
                  trigger("violationType");
                }}
                errorMessage={
                  errors.violationType && errors.violationType.message
                }
              />
            </View>
            <View
              style={{
                flexDirection: "row",
                gap: 12,
              }}
            >
              <Text style={styles.inputLabel}>קנס בש״ח:</Text>
              <Input
                control={control}
                name={"fineNis"}
                placeholder={""}
                mode={"outlined"}
                numeric={true}
                label={""}
                defaultValue={reportItemState.fine}
                disabled={reportItemState.grade == 3}
                // contentStyle={styles.inputContentThirdRow}
                inputStyle={styles.inputThirdRowStyling}
                onChangeFunction={(value) => {
                  console.log(value, "is selected");
                  handleReportChange(value, "fine");
                  setValue("fineNis", value);
                  trigger("fineNis");
                }}
                errorMessage={errors.fineNis && errors.fineNis.message}
              />
            </View>
          </View>
        )}

        <View style={styles.forthRowInputTextWrapper}>
          <View style={styles.headerWrapper}>
            <Text style={styles.header}>תמונות:</Text>

            <TouchableOpacity onPress={pickImage}>
              <Text style={styles.ImageUploadText}>הוספת תמונה</Text>
            </TouchableOpacity>
            <ScrollView horizontal>
              {images.map((image, index) => (
                <TouchableOpacity
                  key={uuid()}
                  onPress={(value) => console.log("open modal", value)}
                >
                  <Image source={{ uri: image }} style={styles.uploadedPhoto} />
                </TouchableOpacity>
              ))}
            </ScrollView>
            {modalVisible && (
              <Modal
                animationType="slide"
                transparent={false}
                visible={modalVisible}
                // style={{ width: 380, height: 346 }}
                onRequestClose={() => {
                  setModalVisible(!modalVisible);
                }}
              >
                <View
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                  }}
                >
                  <View
                    style={{
                      width: 380,
                      height: 346,
                      backgroundColor: "white",
                    }}
                  >
                    <FlatList
                      data={images}
                      renderItem={({ item }) => (
                        <TouchableOpacity
                          style={{
                            justifyContent: "center",
                            alignItems: "center",
                            gap: 30,

                            // width: "100%",
                          }}
                          onPress={() => {
                            setModalVisible(false);
                          }}
                        >
                          <Image
                            source={{ uri: item }}
                            style={{
                              width: 300,
                              height: 300,
                              resizeMode: "contain",
                            }}
                          />
                        </TouchableOpacity>
                      )}
                      horizontal
                      pagingEnabled
                      initialScrollIndex={selectedImageIndex}
                    />
                  </View>
                </View>
              </Modal>
            )}
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
    gap: 75,
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
    minWidth: "80%",
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
    height: 50,
  },
  uploadedPhoto: {
    width: 40,
    height: 40,
    marginRight: 10,
    alignItems: "center",
    alignSelf: "center",
  },
});
export default React.memo(CategoryAccordionItem, areEqual);
