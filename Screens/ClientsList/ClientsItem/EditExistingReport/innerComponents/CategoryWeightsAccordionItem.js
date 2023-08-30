import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
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
import { debounce, get, identity, result } from "lodash";
import Radio from "../../../../../Components/ui/Radio";
import Loader from "../../../../../utiles/Loader";
const gradeLabels = ["ליקוי חמור", "ליקוי בינוני", "ליקוי קל", "תקין"];
const ratingsOptions = [
  { label: "0", value: "0" },
  { label: "1", value: "1" },
  { label: "2", value: "2" },
  { label: "3", value: "3" },
];
const measureTypeOptions = [
  { value: "1", label: "גרם" },
  { value: "2", label: "יחידה" },
  { value: "3", label: "ליטר" },
];
const CategoryWeightsAccordionItem = ({
  control,
  setValue,
  trigger,
  accordionHeight,
  reportItem,
  onWeightReportItem,
  errors,
  id,
}) => {
  // console.log("id", id);
  const [open, setOpen] = useState(false);
  const heightAnim = useState(new Animated.Value(0))[0];
  const [accordionBg, setAccordionBg] = useState(colors.white);
  const [images, setImages] = useState([]);
  const [reportItemState, setReportItemState] = useState(reportItem || {});
  // * counting the weights and
  const findNumOfWeights = (data) => {
    let numberOfWeights = 0;
    let totalWeight = 0;

    for (let i = 1; i <= 5; i++) {
      const weight = parseFloat(data["WeightMeasured" + i]);
      if (!isNaN(weight)) {
        totalWeight += weight;
        numberOfWeights++;
        // AvgWeightsParsed.push(weight);
      }
    }
    return { numberOfWeights, totalWeight };
  };

  const [numsOfWeights, setNumsOfWeights] = useState(
    findNumOfWeights(reportItem).numberOfWeights
  );

  // *  calculating avg of weights
  const AvgWeightCalculation = ({ numberOfWeights, totalWeight }) => {
    return numberOfWeights > 0 ? totalWeight / numberOfWeights : 0;
  };
  const [avgWeight, setAvgWeight] = useState(
    AvgWeightCalculation(findNumOfWeights(reportItem))
  );

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

  // todo to apply loading when component loads
  // todo to nerrow down the amount of input by iterating them

  // * image picker
  const pickImage = useCallback(async () => {
    if (images.length >= 1) {
      alert("You can only select up to 1 images.");
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
  }, [images]);

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
  const handleMeasuredWeightChange = useCallback(
    debounce((value, label) => {
      console.log("handleMeasuredWeightChange triggered with:", value, label);
      setReportItemState((prev) => {
        const temp = { ...prev };
        temp[label] = value;
        if (label !== "grade") {
          const avgWeightsCalculation = AvgWeightCalculation(
            findNumOfWeights(temp)
          );
          // console.log("avgWeightsCalculation:", avgWeightsCalculation);
          if (numsOfWeights > 0) {
            setAvgWeight(avgWeightsCalculation);
            if (
              avgWeightsCalculation >=
              parseInt(temp["WeightTarget"]) * 0.95
            ) {
              temp["grade"] = 3;
            } else if (
              avgWeightsCalculation >=
              parseInt(temp["WeightTarget"]) * 0.9
            ) {
              temp["grade"] = 2;
            } else if (
              avgWeightsCalculation >=
              parseInt(temp["WeightTarget"]) * 0.8
            ) {
              temp["grade"] = 1;
            } else {
              temp["grade"] = 0;
            }
          } else if (numsOfWeights == 0 || numsOfWeights == undefined) {
            setAvgWeight("");
            temp["grade"] = 3;
          }
        }
        // * match the grade to his str based on gradeLabels array
        temp["comment"] = gradeLabels[temp["grade"]];
        console.log("temp:", prev, temp);

        onWeightReportItem(temp);
        return temp;
      });
    }, 300),
    [reportItemState]
  );
  console.log("reportItemState:", reportItemState);
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
            <Text style={{ fontFamily: fonts.ABold }}>שם המנה: </Text>

            <Input
              control={control}
              name={"WeightFoodName"}
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
                // setValue("WeightFoodName", value);
                // trigger("WeightFoodName");
              }}
            />
            <Text style={{ fontFamily: fonts.ABold, marginLeft: -35 }}>
              אמת מידה:
            </Text>
            <SelectMenu
              control={control}
              name={"WeightMeasureType"}
              selectOptions={measureTypeOptions}
              propertyName={"label"}
              selectWidth={80}
              optionsCenterView={"flex-start"}
              optionsHeight={150}
              defaultText={
                // looking for the value inside the reportItemState and display it default value is 1
                reportItemState.WeightMeasureType &&
                measureTypeOptions.some(
                  (option) => option.value == reportItemState.WeightMeasureType
                )
                  ? measureTypeOptions.find(
                      (option) =>
                        option.value == reportItemState.WeightMeasureType
                    ).label
                  : measureTypeOptions[0].label
              }
              optionsLocation={100}
              onChange={(value) => {
                handleMeasuredWeightChange(value, "WeightMeasureType");
                // setValue("foodType", value.value);
                // trigger("foodType");
                // console.log(value);
              }}
              returnObject={true}
              errorMessage={
                errors.WeightMeasureType && errors.WeightMeasureType.message
              }
            />
            <Text style={{ fontFamily: fonts.ABold }}>משקל נטו לפי מפרט:</Text>
            <Input
              control={control}
              name={"WeightTarget"}
              mode={"outlined"}
              defaultValue={reportItemState.WeightTarget}
              label={reportItemState.WeightTarget}
              contentStyle={[
                styles.inputContentStyling,
                { backgroundColor: open ? "white" : colors.accordionOpen },
              ]}
              inputStyle={[styles.inputStyling, { width: 113 }]}
              activeUnderlineColor={colors.black}
              onChangeFunction={(value) => {
                console.log(value, "is selected");
                handleMeasuredWeightChange(value, "WeightTarget");

                // setValue("WeightTarget", value);
                // trigger("WeightTarget");
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
                onChange={(option) =>
                  handleMeasuredWeightChange(option, "grade")
                }
                // disabled={reportItemState.noRelevant}
              />
            </View>
            <Text style={{ fontFamily: fonts.ABold }}> משקל ממוצע:</Text>
            <Input
              control={control}
              name={"avgWeight"}
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
                // handleMeasuredWeightChange(value, "WeightMeasured1");
                // setValue("avgWeight", value);
                // trigger("avgWeight");
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
              name={"WeightMeasured1"}
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
              // onChangeFunction={(value) => {
              //   console.log(value, "is selected");
              //   handleMeasuredWeightChange(value, "WeightMeasured1");

              // }}

              onChangeFunction={(value) =>
                handleMeasuredWeightChange(value, "WeightMeasured1")
              }
              // onBlurFunction={(value) =>
              //   handleMeasuredWeightChange(value, "WeightMeasured1")
              // }
            />
          </View>
          <View
            style={{ flexDirection: "column", alignItems: "center", gap: 0 }}
          >
            <Text style={{ fontFamily: fonts.ABold }}> משקל שנמדד 2:</Text>
            <Input
              control={control}
              name={"WeightMeasured2"}
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
                handleMeasuredWeightChange(value, "WeightMeasured2");
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
              name={"WeightMeasured3"}
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
                handleMeasuredWeightChange(value, "WeightMeasured3");
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
              name={"WeightMeasured4"}
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
                handleMeasuredWeightChange(value, "WeightMeasured4");
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
              name={"WeightMeasured5"}
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
                handleMeasuredWeightChange(value, "WeightMeasured5");
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
            name={"comment"}
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
              handleMeasuredWeightChange(value, "comment");
              // setValue("comment", value);
              // trigger("comment");
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
export default React.memo(CategoryWeightsAccordionItem);
