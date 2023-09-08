import { View, Text } from "react-native";
import React from "react";
import { TextInput, HelperText } from "react-native-paper";
import { Controller } from "react-hook-form";
import fonts from "../../styles/fonts";
const Input = ({
  name,
  label,
  rules,
  control,
  underlineColor,
  activeUnderlineColor,
  contentStyle,
  mode,
  onChangeFunction = false,
  inputStyle,
  proxyRef,
  returnKeyType,
  textContentType,
  onSubmitEditing,
  secureTextEntry = false,
  inputIcon = false,
  outlineColor,
  activeOutlineColor,
  placeholder = false,
  disabled = false,
  defaultValue,
  numeric = false,
  onBlurFunction = false,
}) => {
  return (
    <>
      <Controller
        control={control}
        name={name}
        // rules={rules}
        rules={{
          ...rules,
          validate: {
            ...(rules?.validate ?? {}),
            isNumeric: (value) => (numeric ? !isNaN(parseFloat(value)) : true),
          },
        }}
        render={({
          field: { onChange, onBlur, value },
          fieldState: { error },
        }) => (
          <>
            <TextInput
              ref={proxyRef}
              placeholder={placeholder}
              label={
                <Text
                  style={{
                    fontFamily: fonts.AMedium,
                    fontSize: 20,
                  }}
                >
                  {label}
                </Text>
              }
              onChangeText={(value) => {
                onChange(value);
                onChangeFunction && onChangeFunction(value);
                console.log(`field ${name} : ${value}`);
              }}
              onBlur={(value) => {
                onBlur(value);
                onBlurFunction && onBlurFunction(value);
                console.log(`field ${name} : ${value}`);
              }}
              // onBlur={onBlur}
              // value={defaultValue ?? value} // replacing withe defaultValue
              mode={mode}
              activeOutlineColor={activeOutlineColor}
              outlineColor={outlineColor}
              underlineColor={underlineColor}
              activeUnderlineColor={activeUnderlineColor}
              contentStyle={contentStyle}
              secureTextEntry={secureTextEntry}
              defaultValue={defaultValue} // replaced with value
              right={inputIcon}
              style={inputStyle}
              error={!!error}
              disabled={disabled}
              returnKeyType={returnKeyType}
              // textContentType={textContentType}
              keyboardType={numeric ? "numeric" : "default"}
              textContentType={numeric ? "none" : textContentType}
              onSubmitEditing={onSubmitEditing}
            />
            <HelperText type="error">{error?.message}</HelperText>
          </>
        )}
      />
    </>
  );
};

export default Input;
