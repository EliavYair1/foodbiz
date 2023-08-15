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
const CategoryTempAccordionItem = ({
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
  dateSelected,
  selectedDates,
  accordionHeight,
}) => {
  const [open, setOpen] = useState(false);
  const heightAnim = useState(new Animated.Value(0))[0];
  const [accordionBg, setAccordionBg] = useState(colors.white);
  const [images, setImages] = useState([]);

  // * image picker
  const pickImage = async () => {
    if (images.length >= 3) {
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
              name={"lastDate"}
              selectOptions={selectedDates}
              propertyName={null}
              selectWidth={188}
              optionsCenterView={"flex-start"}
              optionsHeight={150}
              defaultText={"בחירה"}
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
            <Text style={{ fontFamily: fonts.ABold, marginLeft: 20 }}>
              שם המנה:{" "}
            </Text>
            <Input
              control={control}
              name={"remarks"}
              mode={"outlined"}
              label={"יש לנקות *ממטרות* מדיח כלים"}
              contentStyle={[
                styles.inputContentStyling,
                { backgroundColor: open ? "white" : colors.accordionOpen },
              ]}
              inputStyle={[styles.inputStyling, { width: 270 }]}
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
            <Text style={{ fontFamily: fonts.ABold }}>טמפ׳ שנמדדה:</Text>
            <SelectMenu
              control={control}
              name={"lastDate"}
              selectOptions={selectedDates}
              propertyName={null}
              selectWidth={70}
              optionsCenterView={"flex-start"}
              optionsHeight={150}
              defaultText={"בחר"}
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
              contentStyle={[
                styles.inputContentStyling,
                { backgroundColor: open ? "white" : colors.accordionOpen },
              ]}
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
          />
          <CheckboxItem
            label={`${grade2}_${itemId}`}
            checkboxItemText="2"
            handleChange={handleRatingCheckboxChange}
            checked={ratingCheckboxItem.includes(`${grade2}_${itemId}`)}
          />
          <CheckboxItem
            label={`${grade1}_${itemId}`}
            checkboxItemText="1"
            handleChange={handleRatingCheckboxChange}
            checked={ratingCheckboxItem.includes(`${grade1}_${itemId}`)}
          />
          <CheckboxItem
            label={`${grade0}_${itemId}`}
            checkboxItemText="0"
            handleChange={handleRatingCheckboxChange}
            checked={ratingCheckboxItem.includes(`${grade0}_${itemId}`)}
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
            label={'"יש לנקות *ממטרות* מדיח כלים"'}
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
export default CategoryTempAccordionItem;
