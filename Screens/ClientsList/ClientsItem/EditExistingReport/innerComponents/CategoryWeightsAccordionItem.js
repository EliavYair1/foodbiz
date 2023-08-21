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
import { debounce, get, result } from "lodash";
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
  onWeightReportItem,
}) => {
  const [open, setOpen] = useState(false);
  const heightAnim = useState(new Animated.Value(0))[0];
  const [accordionBg, setAccordionBg] = useState(colors.white);
  const [images, setImages] = useState([]);
  const [reportItemState, setReportItemState] = useState(reportItem || {});
  const [avgWeight, setAvgWeight] = useState(0);
  const [numsOfWeights, setNumsOfWeights] = useState(0);
  useEffect(() => {
    setReportItemState((prevReportItemState) => ({
      ...prevReportItemState,
      ...reportItem,
    }));
    setAvgWeight(AvgWeightCalculation(reportItem));
    // console.log("reportItem", reportItem);
  }, [reportItem]);
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
  // todo to optimize performance in the component
  // todo to nerrow down the amount of input by iterating them
  // todo to restyle the avg field && the target field
  // * counting the weights and calculating
  const AvgWeightCalculation = (reportItem) => {
    const AvgWeightsParsed = [];
    let totalWeight = 0;
    let numberOfWeights = 0;
    // console.log("reportItem", reportItem);

    for (let i = 1; i <= 5; i++) {
      const weight = parseFloat(reportItem["WeightMeasured" + i]);
      if (!isNaN(weight)) {
        totalWeight += weight;
        numberOfWeights++;
        AvgWeightsParsed.push(weight);
      }
    }
    if (numberOfWeights > 0) {
      console.log("after", totalWeight, numberOfWeights, AvgWeightsParsed);
      setNumsOfWeights(numberOfWeights);
    }

    return numberOfWeights > 0 ? totalWeight / numberOfWeights : 0;
  };

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

        // * match the grade to his str based on gradeLabels array
        if (label === "grade") {
          temp["comment"] = gradeLabels[value];
        }
        const avgWeightsCalculation = AvgWeightCalculation(temp);
        console.log("avgWeightsCalculation:", avgWeightsCalculation);
        if (numsOfWeights > 0) {
          setAvgWeight(avgWeightsCalculation);
          if (
            avgWeightsCalculation < temp["WeightTarget"] * 0.95 ||
            avgWeightsCalculation == temp["WeightTarget"] * 0.95
          ) {
            temp["grade"] = 3;
          } else if (
            avgWeightsCalculation < temp["WeightTarget"] * 0.9 ||
            avgWeightsCalculation == temp["WeightTarget"] * 0.9
          ) {
            temp["grade"] = 2;
          } else if (
            avgWeightsCalculation < temp["WeightTarget"] * 0.8 ||
            avgWeightsCalculation == temp["WeightTarget"] * 0.8
          ) {
            temp["grade"] = 1;
          } else {
            temp["grade"] = 0;
          }
        } else if (numsOfWeights == 0) {
          setAvgWeight("");
          temp["grade"] = 3;
        }
        return temp;
      });
    },
    [reportItemState]
  );
  useEffect(() => {
    onWeightReportItem({ ...reportItemState });
  }, []);
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
              label={reportItemState.WeightFoodName}
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
              label={reportItemState.WeightMeasureType}
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
                selectedOption={
                  reportItemState?.grade == undefined
                    ? 3
                    : reportItemState?.grade
                }
                onChange={(option) => handleReportChange(option, "grade")}
                // disabled={reportItemState.noRelevant}
              />
            </View>

            <Text style={{ fontFamily: fonts.ABold }}> משקל יעד:</Text>
            <Input
              control={control}
              name={"remarks"}
              mode={"outlined"}
              disabled
              label={reportItemState.WeightTarget}
              defaultValue={reportItemState.WeightTarget}
              contentStyle={[
                styles.inputContentStyling,
                { backgroundColor: open ? "white" : colors.accordionOpen },
              ]}
              inputStyle={[styles.inputStyling, { width: 65 }]}
              activeUnderlineColor={colors.black}
              onChangeFunction={(value) => {
                console.log(value, "is selected");
                handleReportChange(value, "WeightTarget");
                // setValue("remarks", value);
                // trigger("remarks");
              }}
            />
            <Text style={{ fontFamily: fonts.ABold }}> משקל ממוצע:</Text>
            <Input
              control={control}
              name={"remarks"}
              mode={"outlined"}
              disabled
              label={avgWeight}
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
              label={reportItemState.WeightMeasured1}
              defaultValue={reportItemState.WeightMeasured1}
              contentStyle={[
                styles.inputContentStyling,
                { backgroundColor: open ? "white" : colors.accordionOpen },
              ]}
              inputStyle={[styles.inputStyling, { width: 136 }]}
              activeUnderlineColor={colors.black}
              numeric={true}
              onChangeFunction={(value) => {
                console.log(value, "is selected");
                handleReportChange(value, "WeightMeasured1");
                // setValue("remarks", value);
                // trigger("remarks");
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
              defaultValue={reportItemState.WeightMeasured2}
              // defaultValue={""}
              contentStyle={[
                styles.inputContentStyling,
                { backgroundColor: open ? "white" : colors.accordionOpen },
              ]}
              inputStyle={[styles.inputStyling, { width: 136 }]}
              activeUnderlineColor={colors.black}
              numeric={true}
              onChangeFunction={(value) => {
                console.log(value, "is selected");
                handleReportChange(value, "WeightMeasured2");
                // setValue("remarks", value);
                // trigger("remarks");
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
              defaultValue={reportItemState.WeightMeasured3}
              // defaultValue={""}
              contentStyle={[
                styles.inputContentStyling,
                { backgroundColor: open ? "white" : colors.accordionOpen },
              ]}
              inputStyle={[styles.inputStyling, { width: 136 }]}
              activeUnderlineColor={colors.black}
              numeric={true}
              onChangeFunction={(value) => {
                console.log(value, "is selected");
                handleReportChange(value, "WeightMeasured3");
                // setValue("remarks", value);
                // trigger("remarks");
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
              defaultValue={reportItemState.WeightMeasured4}
              // defaultValue={""}
              contentStyle={[
                styles.inputContentStyling,
                { backgroundColor: open ? "white" : colors.accordionOpen },
              ]}
              inputStyle={[styles.inputStyling, { width: 136 }]}
              activeUnderlineColor={colors.black}
              numeric={true}
              onChangeFunction={(value) => {
                console.log(value, "is selected");
                handleReportChange(value, "WeightMeasured4");
                // setValue("remarks", value);
                // trigger("remarks");
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
              defaultValue={reportItemState.WeightMeasured5}
              // defaultValue={""}
              contentStyle={[
                styles.inputContentStyling,
                { backgroundColor: open ? "white" : colors.accordionOpen },
              ]}
              inputStyle={[styles.inputStyling, { width: 136 }]}
              activeUnderlineColor={colors.black}
              numeric={true}
              onChangeFunction={(value) => {
                console.log(value, "is selected");
                handleReportChange(value, "WeightMeasured5");
                // setValue("remarks", value);
                // trigger("remarks");
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
            label={reportItemState.comment}
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
