import {
  View,
  Text,
  Modal,
  Pressable,
  StyleSheet,
  Platform,
  Image,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import { BlurView } from "expo-blur";
import colors from "../../styles/colors";
import fonts from "../../styles/fonts";
import CloseIcon from "../../assets/imgs/CloseModalIcon.png";
import SelectMenu from "./SelectMenu";
import { FlatList } from "react-native-gesture-handler";
import { Divider, PaperProvider } from "react-native-paper";
import Input from "./Input";
import uuid from "uuid-random";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { TextInput } from "react-native-paper";
import DatePicker from "./datePicker";
import Button from "../ui/Button";
const PopUp = ({
  animationType,
  modalHeaderText,
  onCloseModal = false,
  modalHeight,
  modalWidth,
  visible,
  firstButtonFunction,
  secondButtonFunction,
  icon1,
  icon2,
  buttonText1,
  buttonText2,
  buttonHeaderText,
  submitButtonFunction,
  submitText,
  selectWidth,
  selectOptions,
  selectHeader,
  inputData,
  remarksInputText,
  firstInputText, //temp
  secondInputText, //temp
  thirdInputText, //temp
  selectedMedia,
  deleteSelectedMedia,
}) => {
  const [isSchemaValid, setIsSchemaValid] = useState(false);
  const [formData, setFormData] = useState({});
  const [ImagePicked, setImagePicked] = useState(null);
  const schema = yup.object().shape({
    station: yup.string().required("station is required"),
    fileName: yup.string().required("file name is required"),
    authorName: yup.string().required("author name is required"),
    date: yup.string().required("date is required"),
    libraryChoice: yup.string().required("image is required"),
    phone: yup.string().required("image pick is required"),
    remarks: yup.string(),
  });
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const styles = StyleSheet.create({
    buttonWrapper: {
      flexDirection: "row",
      // gap: 16,
      justifyContent: "space-between",
    },
    button: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 1,
      borderRadius: 8,
      paddingVertical: 13,
      // width: 194,
      gap: 8,
    },
    buttonText: {},
    buttonOpen: {
      backgroundColor: "#F194FF",
    },
    buttonClose: {
      backgroundColor: "#2196F3",
    },
    textStyle: {
      color: colors.black,
      textAlign: "center",
      fontFamily: fonts.ABold,
      fontSize: 20,
    },
    subtextStyle: {
      color: colors.black,
      textAlign: "left",
      fontFamily: fonts.ARegular,
      fontSize: 16,
      // marginBottom: 4,
    },
    modalText: {
      marginBottom: 15,
      textAlign: "center",
    },
    closeIconStyle: {
      width: 12.5,
      height: 12.5,
    },
    inputWrapper: {
      // flex: 1,
    },

    IconStyle: {
      width: 16,
      height: 16,
    },
    selectHeaderStyle: {},
    remarksInputWrapper: {},
    submitButton: {
      width: "100%",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: colors.blue,
      paddingVertical: 8,
      borderRadius: 8,
      opacity: !isSchemaValid ? 0.6 : 1,
    },
    submitButtonText: {
      color: colors.white,
    },
    inputContentStyling: { backgroundColor: "white" },
    inputStyling: { minWidth: "100%", backgroundColor: "white" },
    contentContainer: {},
  });
  const inputRef = useRef();
  const popUpInputInformation = [
    {
      id: 0,
      ref: useRef(),
      name: "station",
      label: "תחנה",
      styleInput: [{ writingDirection: "rtl", textAlign: "right" }],

      control: control,
      returnKeyType: "next",
      activeUnderlineColor: "#0C1430",
      underlineColor: "#0C1430",
      mode: "outline",
      contentStyle: styles.inputContentStyling,
      inputStyle: styles.inputStyling,
      onSubmitEditing: () => {
        popUpInputInformation[1].ref.current.focus();
      },
    },
    {
      id: 1,
      ref: useRef(),
      name: "fileName",
      // value: "fileName",
      label: "שם קובץ",

      control: control,
      returnKeyType: "next",
      // inputIcon: <TextInput.Icon icon="eye" onPress={handlepasswordToggle} />,
      // secureTextEntry: passwordShowToggle,
      activeUnderlineColor: "#0C1430",
      underlineColor: "#0C1430",
      mode: "outline",
      contentStyle: styles.inputContentStyling,
      inputStyle: styles.inputStyling,
      onSubmitEditing: () => {
        popUpInputInformation[2].ref.current.focus();
      },
    },
    {
      id: 2,
      ref: useRef(),
      name: "authorName",
      // value: "fileName",
      label: "כותב",

      control: control,
      returnKeyType: "next",
      // inputIcon: <TextInput.Icon icon="eye" onPress={handlepasswordToggle} />,
      // secureTextEntry: passwordShowToggle,
      activeUnderlineColor: "#0C1430",
      underlineColor: "#0C1430",
      mode: "outline",
      contentStyle: styles.inputContentStyling,
      inputStyle: styles.inputStyling,
      onSubmitEditing: () => {
        popUpInputInformation[3].ref.current.focus();
      },
    },
    {
      id: 3,
      ref: useRef(),
      name: "date",
      // value: "fileName",
      label: "תאריך",

      control: control,
      returnKeyType: "next",
      // inputIcon: <TextInput.Icon icon="eye" onPress={handlepasswordToggle} />,
      // secureTextEntry: passwordShowToggle,
      activeUnderlineColor: "#0C1430",
      underlineColor: "#0C1430",
      mode: "outline",
      contentStyle: styles.inputContentStyling,
      inputStyle: styles.inputStyling,
      onSubmitEditing: () => {
        popUpInputInformation[4].ref.current.focus();
      },
    },
    {
      id: 4,
      ref: useRef(),
      name: "fileName",
      // value: "fileName",
      label: "שם קובץ",

      control: control,
      returnKeyType: "done",
      // inputIcon: <TextInput.Icon icon="eye" onPress={handlepasswordToggle} />,
      // secureTextEntry: passwordShowToggle,
      activeUnderlineColor: "#0C1430",
      underlineColor: "#0C1430",
      mode: "outline",
      contentStyle: styles.inputContentStyling,
      inputStyle: styles.inputStyling,
    },
  ];

  // handling the input change
  const handleInputChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
    setIsSchemaValid(true);
  };

  // validate the scheme on every change of the state
  useEffect(() => {
    schema
      .validate(formData)
      .then(() => setIsSchemaValid(true))
      .catch(() => setIsSchemaValid(false));
  }, [formData, schema]);

  const onSubmitForm = async () => {
    // checking if scheme is valid
    console.log("formData:", formData);
    if (isSchemaValid) {
      console.log("scheme is valid");
    }
  };
  // console.log(isSchemaValid, formData);
  // console.log(selectedMedia);

  return (
    <Modal
      visible={visible}
      transparent
      animationType={animationType}
      presentationStyle="overFullScreen"
    >
      <PaperProvider>
        <BlurView style={{ flex: 1 }} intensity={100} tint="dark">
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              zIndex: 10,
            }}
          >
            <View
              style={{
                backgroundColor: "white",
                borderRadius: 10,
                width: modalWidth,
                height: modalHeight,
                paddingHorizontal: 40,
                paddingVertical: 20,
                zIndex: 10,
              }}
            >
              <TouchableOpacity onPress={onCloseModal} style={{}}>
                <Image source={CloseIcon} style={styles.closeIconStyle} />
              </TouchableOpacity>
              {/* HEADER */}
              <Text style={styles.textStyle}>{modalHeaderText}</Text>
              {/* selector */}

              {/* inputs */}
              <View style={styles.inputWrapper}>
                <Text style={styles.subtextStyle}>{selectHeader}</Text>
                <SelectMenu
                  control={control}
                  selectWidth={selectWidth}
                  selectOptions={selectOptions}
                  name={"station"}
                  errorMessage={errors.date && errors.station.message}
                  onChange={(value) => {
                    handleInputChange("station", value);
                  }}
                />
                <Text style={styles.subtextStyle}>{firstInputText}</Text>
                <Input
                  proxyRef={inputRef}
                  name={"fileName"}
                  // label={firstInputText}
                  activeOutlineColor={"grey"}
                  outlineColor={"grey"}
                  control={control}
                  mode={"outlined"}
                  inputStyle={{ backgroundColor: "white" }}
                  onChangeFunction={(value) => {
                    handleInputChange("fileName", value);
                  }}
                />
                <Text style={styles.subtextStyle}>{secondInputText}</Text>
                <Input
                  proxyRef={inputRef}
                  name={"authorName"}
                  // label={secondInputText}
                  outlineColor={"grey"}
                  activeOutlineColor={"grey"}
                  control={control}
                  mode={"outlined"}
                  onChangeFunction={(value) => {
                    handleInputChange("authorName", value);
                  }}
                  inputStyle={{ backgroundColor: "white" }}
                />
                <Text style={styles.subtextStyle}>{thirdInputText}</Text>
                <DatePicker
                  label={thirdInputText}
                  control={control}
                  name={"date"}
                  errorMessage={errors.date && errors.date.message}
                  onchange={(value) => {
                    handleInputChange("date", value);
                  }}
                />
              </View>
              {/* upload buttons */}
              <View>
                <Text style={styles.subtextStyle}>{buttonHeaderText}</Text>
                <View style={styles.buttonWrapper}>
                  <Button
                    buttonStyle={styles.button}
                    icon={true}
                    buttonFunction={firstButtonFunction}
                    iconPath={icon1}
                    iconStyle={styles.IconStyle}
                    buttonTextStyle={styles.buttonText}
                    buttonText={buttonText1}
                    buttonWidth={184}
                    errorMessage={
                      !selectedMedia
                        ? errors.libraryChoice && errors.libraryChoice.message
                        : null
                    }
                  />
                  <Button
                    buttonWidth={194}
                    buttonStyle={styles.button}
                    buttonFunction={secondButtonFunction}
                    icon={true}
                    iconPath={icon2}
                    iconStyle={styles.IconStyle}
                    buttonTextStyle={styles.buttonText}
                    buttonText={buttonText2}
                    errorMessage={errors.phone && errors.phone.message}
                  />
                </View>
              </View>
              {/* input remarks */}
              <View style={styles.remarksInputWrapper}>
                <Text style={styles.subtextStyle}>{remarksInputText}</Text>
                <Input
                  control={control}
                  name={"remarks"}
                  multiline
                  numberOfLines={4}
                  maxLength={40}
                  mode="outlined"
                  onChangeFunction={(value) => {
                    handleInputChange("remarks", value);
                  }}
                  activeOutlineColor="grey"
                  inputStyle={{
                    backgroundColor: colors.white,
                    width: 400,
                    height: 80,
                    borderRadius: 8,
                    borderColor: "rgba(12, 20, 48, 0.2)",
                  }}
                />
              </View>
              {/* submit button */}
              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleSubmit(onSubmitForm)}
                // disabled={!isSchemaValid}
              >
                <Text style={styles.submitButtonText}>{submitText}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </BlurView>
      </PaperProvider>
    </Modal>
  );
};

export default PopUp;
