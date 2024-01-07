import React, { useState, useRef } from "react";
import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Text,
} from "react-native";
import {
  RichEditor,
  RichToolbar,
  actions,
} from "react-native-pell-rich-editor";
import ColorPicker from "react-native-wheel-color-picker";
const SummaryAccordion = ({ handleContentChange, currentReport }) => {
  const [colorSelected, setColorSelected] = useState(false);
  const richText = useRef();

  return (
    <View
      style={{
        flex: 1,
        width: "100%",
        marginTop: 20,
        height: "100%",
        direction: "rtl",
        // backgroundColor: "red",
      }}
    >
      <View
        style={{
          backgroundColor: "#D3E0FF",
          width: "100%",
          alignItems: "flex-start",
          // marginBottom: 200,
          position: "relative",
          zIndex: 3,
        }}
      >
        <RichToolbar
          editor={richText}
          selectedButtonStyle={{ backgroundColor: "#baceff" }}
          unselectedButtonStyle={{ backgroundColor: "#D3E0FF" }}
          iconTint="#000000"
          selectedIconTint="#000000"
          actions={[
            actions.insertOrderedList,
            actions.insertBulletsList,
            actions.setUnderline,
            actions.setItalic,
            actions.setBold,
            "custom",
          ]}
          // onPressAddImage={onPressAddImage}
          // onAction={onAction} // Add the onAction prop for custom actions
          iconMap={{
            ["custom"]: ({}) => <Text>C</Text>,
          }}
          custom={() => {
            setColorSelected(!colorSelected);
            console.log("object");
          }}
        />
      </View>
      {colorSelected && (
        <View
          style={{
            direction: "ltr",
            width: 200,
            position: "absolute",
            top: 20,
            zIndex: 3,
          }}
        >
          <ColorPicker
            onColorChange={(color) => {
              console.log(color);
              richText.current?.setForeColor(color);
            }}
            sliderSize={20}
            thumbSize={60}
            gapSize={5}
            // noSnap={true}
            color="#000000"
            palette={["#000000", "#ffff00", "#0000ff", "#ff0000", "#00ff00"]}
            swatches={true}
          />
        </View>
      )}
      <ScrollView
        onLayout={(event) => {
          // const { height, width } = event.nativeEvent.layout;
          // setRichTextHeight(height);
        }}
        style={{
          flex: 1,
          overflow: "visible",
          // height: 200,
          minHeight: Platform.OS == "ios" ? 200 : 200,
          direction: "rtl",
          borderWidth: 1,
          // borderColor: "#000",
          borderColor: "#eee",
          zIndex: 2,
        }}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS == "ios" ? "height" : "height"}
          style={{ flex: 1, direction: "rtl" }}
        >
          <RichEditor
            ref={richText}
            onChange={handleContentChange}
            initialContentHTML={
              currentReport
                ? currentReport.getData("newGeneralCommentTopText")
                : ""
            }
            styleWithCSS={true}
            useContainer={false}
            style={{
              direction: "rtl",
              // borderWidth: 1,
              // borderColor: "#000",
              height: 200,
            }}
          />
        </KeyboardAvoidingView>
      </ScrollView>
    </View>
  );
};

export default SummaryAccordion;
