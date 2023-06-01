import React, { useState } from "react";
import {
  Button,
  View,
  TouchableWithoutFeedback,
  Text,
  StyleSheet,
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useForm, Controller } from "react-hook-form";
import { HelperText } from "react-native-paper";
import fonts from "../../styles/fonts";
import colors from "../../styles/colors";
const DatePicker = ({ errorMessage, label, control, name, onchange }) => {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [datePicked, setDatePicked] = useState("");
  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    console.log("A date has been picked: ", date);
    setDatePicked(date);
    onchange(date);
    hideDatePicker();
  };
  //   console.log(datePicked);
  const styles = StyleSheet.create({
    text: {
      fontSize: datePicked ? 22 : 18,
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
      fontFamily: datePicked ? fonts.AMedium : fonts.ABold,
      color: errorMessage && !datePicked ? "#b3261e" : colors.black,
    },
    label: {
      marginBottom: 10,
      alignSelf: "flex-start",
      color: errorMessage && !datePicked ? "#b3261e" : colors.black,
      fontFamily: fonts.ARegular,
    },
  });
  return (
    <View>
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, value } }) => (
          <View>
            {/* <Text style={styles.label}>{label}</Text> */}
            <TouchableWithoutFeedback
              title="Show Date Picker"
              onPress={showDatePicker}
            >
              <Text
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  paddingHorizontal: 20,
                  paddingVertical: 14,
                  borderWidth: errorMessage && !datePicked ? 1.5 : 0.5,
                  borderColor:
                    errorMessage && !datePicked ? "#b3261e" : colors.black,
                  borderRadius: 8,
                  textAlign: "left",
                  color: errorMessage && !datePicked ? "#b3261e" : colors.black,
                }}
              >
                {datePicked ? datePicked.toDateString() : "Date Picker"}
              </Text>
            </TouchableWithoutFeedback>
            <DateTimePickerModal
              isVisible={isDatePickerVisible}
              mode="date"
              onConfirm={handleConfirm}
              onCancel={hideDatePicker}
            />
          </View>
        )}
        rules={{ required: true }}
        defaultValue=""
      />
      <HelperText
        type="error"
        style={{
          fontFamily: fonts.AMedium,
        }}
      >
        {datePicked ? null : errorMessage}
      </HelperText>
    </View>
  );
};

export default DatePicker;
