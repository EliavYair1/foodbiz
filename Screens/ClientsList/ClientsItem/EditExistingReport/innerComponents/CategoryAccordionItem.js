import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Animated,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import { Divider } from "react-native-paper";
import CheckboxItem from "../../../../WorkerNewReport/CheckboxItem/CheckboxItem";
import fonts from "../../../../../styles/fonts";
import colors from "../../../../../styles/colors";
import Input from "../../../../../Components/ui/Input";
import DatePicker from "../../../../../Components/ui/datePicker";
import SelectMenu from "../../../../../Components/ui/SelectMenu";
import ClientItemArrow from "../../../../../assets/imgs/ClientItemArrow.png";

const CategoryAccordionItem = ({
  handleCheckboxChange,
  handleRatingCheckboxChange,
  releventCheckboxItems,
  ratingCheckboxItem,
  control,
  setValue,
  trigger,
  errors,
  sectionText,
}) => {
  const [open, setOpen] = useState(false);
  const heightAnim = useState(new Animated.Value(0))[0];
  const [accordionBg, setAccordionBg] = useState(colors.white);

  const toggleAccordion = () => {
    setOpen(!open);
    if (!open) {
      setAccordionBg(colors.accordionOpen);
    } else {
      setAccordionBg(colors.white);
    }
    Animated.timing(heightAnim, {
      toValue: open ? 0 : 350, // Adjust the expanded height as desired
      duration: 250, // Adjust the duration as desired
      useNativeDriver: false,
    }).start();
  };

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
            סעיף :
            <Text style={{ fontFamily: fonts.ARegular }}>{sectionText}</Text>
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
          <CheckboxItem
            label="Checkbox 1"
            checkboxItemText="לא רלוונטי"
            handleChange={handleCheckboxChange}
            checked={releventCheckboxItems.includes("Checkbox 1")}
          />
          <CheckboxItem
            label="Checkbox 2"
            checkboxItemText="לא לשיקלול"
            handleChange={handleCheckboxChange}
            checked={releventCheckboxItems.includes("Checkbox 2")}
          />
          <CheckboxItem
            label="Checkbox 3"
            checkboxItemText="הצג בתמצית"
            handleChange={handleCheckboxChange}
            checked={releventCheckboxItems.includes("Checkbox 3")}
          />
          <CheckboxItem
            label="Checkbox 4"
            checkboxItemText="מאפס קטגוריה"
            handleChange={handleCheckboxChange}
            checked={releventCheckboxItems.includes("Checkbox 4")}
          />
        </View>
        <Divider />
        <View style={styles.categoryRatingCheckboxWrapper}>
          <Text> דירוג:</Text>
          <CheckboxItem
            label="Checkbox 1"
            checkboxItemText="3"
            handleChange={handleRatingCheckboxChange}
            checked={ratingCheckboxItem.includes("Checkbox 1")}
          />
          <CheckboxItem
            label="Checkbox 2"
            checkboxItemText="2"
            handleChange={handleRatingCheckboxChange}
            checked={ratingCheckboxItem.includes("Checkbox 2")}
          />
          <CheckboxItem
            label="Checkbox 3"
            checkboxItemText="1"
            handleChange={handleRatingCheckboxChange}
            checked={ratingCheckboxItem.includes("Checkbox 3")}
          />
          <CheckboxItem
            label="Checkbox 4"
            checkboxItemText="0"
            handleChange={handleRatingCheckboxChange}
            checked={ratingCheckboxItem.includes("Checkbox 4")}
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
            mode={"flat"}
            placeholder={"יש לנקות *ממטרות* מדיח כלים"}
            contentStyle={styles.inputContentStyling}
            inputStyle={styles.inputStyling}
            activeUnderlineColor={colors.black}
            onChangeFunction={(value) => {
              console.log(value, "is selected");
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
              selectOptions={[1, 2, 3, 4, 5]}
              propertyName={null}
              selectWidth={237}
              optionsCenterView={"flex-start"}
              optionsHeight={150}
              optionsLocation={100}
              centeredViewStyling={{ marginLeft: 120 }}
              onChange={(value) => {
                console.log(value, "is selected");
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
            <View style={{ marginTop: 20 }}>
              <DatePicker
                control={control}
                name={"executionDate"}
                dateInputWidth={274}
                onchange={(value) => {
                  console.log(value, "is selected");
                  const date = new Date(value);
                  const formattedDate = date.toLocaleDateString("en-GB");
                  setValue("executionDate", formattedDate);
                  trigger("executionDate");
                }}
                errorMessage={
                  errors.executionDate && errors.executionDate.message
                }
              />
            </View>
          </View>
        </View>
        <View style={styles.thirdRowInputTextWrapper}>
          <View style={{ flexDirection: "row", gap: 32 }}>
            <Text style={styles.inputLabel}>סוג הפרה:</Text>
            <Input
              control={control}
              name={"violationType"}
              placeholder={""}
              contentStyle={styles.inputContentThirdRow}
              inputStyle={styles.inputThirdRowStyling}
              onChangeFunction={(value) => {
                console.log(value, "is selected");
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
              contentStyle={styles.inputContentThirdRow}
              inputStyle={styles.inputThirdRowStyling}
              onChangeFunction={(value) => {
                console.log(value, "is selected");
                setValue("fineNis", value);
                trigger("fineNis");
              }}
              errorMessage={errors.fineNis && errors.fineNis.message}
            />
          </View>
        </View>
        <View style={styles.forthRowInputTextWrapper}></View>
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
    minWidth: "100%",
    backgroundColor: "white",
    borderRadius: 4,
  },
  inputContentThirdRow: { backgroundColor: "white" },
  inputThirdRowStyling: {
    minWidth: 213,
    backgroundColor: "white",
    borderRadius: 4,
  },
  forthRowInputTextWrapper: {},
});
export default CategoryAccordionItem;
