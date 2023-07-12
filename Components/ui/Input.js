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
  onChangeFunction,
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
}) => {
  return (
    <>
      <Controller
        control={control}
        name={name}
        rules={rules}
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
                onChangeFunction(value);
                console.log(`field ${name} : ${value}`);
              }}
              onBlur={onBlur}
              value={value}
              mode={mode}
              activeOutlineColor={activeOutlineColor}
              outlineColor={outlineColor}
              underlineColor={underlineColor}
              activeUnderlineColor={activeUnderlineColor}
              contentStyle={contentStyle}
              secureTextEntry={secureTextEntry}
              right={inputIcon}
              style={inputStyle}
              error={!!error}
              returnKeyType={returnKeyType}
              textContentType={textContentType}
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
