import React, { useState } from "react";
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
  // imagesArray,
  grade0,
  grade1,
  grade2,
  grade3,
  itemId,
  critical,
  noCalculate,
  lastDate,
  charge,
  noRelevant,
  showOnComment,
  categoryReset,
  dateSelected,
  selectedDates,
  fineLabel,
  disabledViolation,
  violationLabel,
  chargeSelections,
}) => {
  const [open, setOpen] = useState(false);
  const heightAnim = useState(new Animated.Value(0))[0];
  const [accordionBg, setAccordionBg] = useState(colors.white);
  const [images, setImages] = useState([]);

  const pickImage = async () => {
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
          <View
            style={{
              fontFamily: fonts.ABold,
              flexDirection: "row",
              alignItems: "center",
              gap: 12,
            }}
          >
            <Text style={{ fontFamily: fonts.ABold }}>
              סוג המזון שנבדק:{" "}
              <Text style={{ fontFamily: fonts.ARegular }}>{sectionText}</Text>:
            </Text>
            <SelectMenu
              control={control}
              name={"lastDate"}
              selectOptions={selectedDates}
              propertyName={null}
              selectWidth={188}
              optionsCenterView={"flex-start"}
              optionsHeight={150}
              displayedValue={dateSelected}
              optionsLocation={100}
              // centeredViewStyling={{ marginLeft: 480 }}
              onChange={(value) => {
                setValue("lastDate", value);
                trigger("lastDate");
              }}
              returnObject={true}
              errorMessage={errors.lastDate && errors.lastDate.message}
            />
            <Text style={{ fontFamily: fonts.ABold }}>שם המנה: :</Text>
            <Input
              control={control}
              name={"remarks"}
              mode={"flat"}
              placeholder={"יש לנקות *ממטרות* מדיח כלים"}
              contentStyle={styles.inputContentStyling}
              inputStyle={[styles.inputStyling, { width: 150 }]}
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
            <Text style={{ fontFamily: fonts.ABold }}>טמפ׳:</Text>
            <SelectMenu
              control={control}
              name={"lastDate"}
              selectOptions={selectedDates}
              propertyName={null}
              selectWidth={188}
              optionsCenterView={"flex-start"}
              optionsHeight={150}
              displayedValue={dateSelected}
              optionsLocation={100}
              // centeredViewStyling={{ marginLeft: 480 }}
              onChange={(value) => {
                setValue("lastDate", value);
                trigger("lastDate");
              }}
              returnObject={true}
              errorMessage={errors.lastDate && errors.lastDate.message}
            />
            <Text style={{ fontFamily: fonts.ABold }}> טמפ׳ יעד:</Text>
            <Input
              control={control}
              name={"remarks"}
              mode={"flat"}
              placeholder={"יש לנקות *ממטרות* מדיח כלים"}
              contentStyle={styles.inputContentStyling}
              inputStyle={[styles.inputStyling, { width: 50 }]}
              activeUnderlineColor={colors.black}
              onChangeFunction={(value) => {
                console.log(value, "is selected");
                setValue("remarks", value);
                trigger("remarks");
              }}
            />
          </View>
          <Text> דירוג:</Text>
          <CheckboxItem
            label={`${grade3}_${itemId}`}
            checkboxItemText="3"
            handleChange={handleRatingCheckboxChange}
            checked={ratingCheckboxItem.includes(`${grade3}_${itemId}`)}
            isChecked={
              releventCheckboxItems.includes(`grade3_${itemId}`) || grade3
            }
          />
          <CheckboxItem
            label={`${grade2}_${itemId}`}
            checkboxItemText="2"
            handleChange={handleRatingCheckboxChange}
            checked={ratingCheckboxItem.includes(`${grade2}_${itemId}`)}
            isChecked={
              releventCheckboxItems.includes(`grade2_${itemId}`) || grade2
            }
          />
          <CheckboxItem
            label={`${grade1}_${itemId}`}
            checkboxItemText="1"
            handleChange={handleRatingCheckboxChange}
            checked={ratingCheckboxItem.includes(`${grade1}_${itemId}`)}
            isChecked={
              releventCheckboxItems.includes(`grade1_${itemId}`) || grade1
            }
          />
          <CheckboxItem
            label={`${grade0}_${itemId}`}
            checkboxItemText="0"
            handleChange={handleRatingCheckboxChange}
            checked={ratingCheckboxItem.includes(`${grade0}_${itemId}`)}
            isChecked={
              releventCheckboxItems.includes(`grade0_${itemId}`) || grade0
            }
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
            inputStyle={[styles.inputStyling, { minWidth: "100%" }]}
            activeUnderlineColor={colors.black}
            onChangeFunction={(value) => {
              console.log(value, "is selected");
              setValue("remarks", value);
              trigger("remarks");
            }}
          />
        </View>
        {/* <View style={styles.secondRowInputTextWrapper}>
          <View style={{ flexDirection: "row", gap: 12 }}>
            <Text style={styles.inputLabel}>אחראי לביצוע:</Text>
            <SelectMenu
              control={control}
              name={"executioner"}
              selectOptions={chargeSelections}
              propertyName={null}
              selectWidth={237}
              optionsCenterView={"flex-start"}
              optionsHeight={150}
              displayedValue={charge}
              optionsLocation={100}
              //   centeredViewStyling={{ marginLeft: 120 }}
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
            <View style={{ marginBottom: 0 }}>
              <SelectMenu
                control={control}
                name={"lastDate"}
                selectOptions={selectedDates}
                propertyName={null}
                selectWidth={237}
                optionsCenterView={"flex-start"}
                optionsHeight={150}
                displayedValue={dateSelected}
                optionsLocation={100}
                // centeredViewStyling={{ marginLeft: 480 }}
                onChange={(value) => {
                  console.log(value, "is selected");
                  setValue("lastDate", value);
                  trigger("lastDate");
                }}
                returnObject={true}
                errorMessage={errors.lastDate && errors.lastDate.message}
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
              label={violationLabel}
              disabled={disabledViolation}
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
              label={fineLabel}
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
        </View> */}
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
export default CategoryAccordionItem;
