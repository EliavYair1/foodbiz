// import {
//   KeyboardAvoidingView,
//   ScrollView,
//   StyleSheet,
//   Text,
//   View,
// } from "react-native";
// import React, { useState, useRef } from "react";
// import fonts from "../../../styles/fonts";
// import colors from "../../../styles/colors";
// import accordionCloseIcon from "../../../assets/imgs/accordionCloseIndicator.png";
// import accordionOpenIcon from "../../../assets/imgs/accordionOpenIndicator.png";
// import ClientItemArrow from "../../../assets/imgs/ClientItemArrow.png";
// import ClientItemArrowOpen from "../../../assets/imgs/accodionOpenIndicatorBlack.png";
// import onDragIcon from "../../../assets/imgs/onDragIcon.png";
// import SelectMenu from "../../../Components/ui/SelectMenu";
// import { useSelector } from "react-redux";
// import ToggleSwitch from "../../../Components/ui/ToggleSwitch";
// import Input from "../../../Components/ui/Input";
// import DatePicker from "../../../Components/ui/datePicker";
// import {
//   RichEditor,
//   RichToolbar,
//   actions,
// } from "react-native-pell-rich-editor";
// import { HelperText } from "react-native-paper";
// import Accordion from "../../../Components/ui/Accordion";
// import ColorPicker from "react-native-wheel-color-picker";
// import CheckboxItem from "../CheckboxItem/CheckboxItem";
// import { useForm } from "react-hook-form";
// import { yupResolver } from "@hookform/resolvers/yup";
// // todo need to check how to pass the control
// const AccordionData = ({
//   control,
//   errors,
//   selectedStation,
//   switchStates,
//   toggleSwitch,
//   formData,
//   currentReportTime,
//   reportsTimes,
//   memoizedCategories,
//   checkboxStatus,
//   handleContentChange,
// }) => {
//   const richText = useRef();
//   // * accordion FlatList array of Content
//   const currentClient = useSelector(
//     (state) => state.currentClient.currentClient
//   );
//   const currentReport = useSelector(
//     (state) => state.currentReport.currentReport
//   );
//   const [colorSelected, setColorSelected] = useState(false);
//   const [categoryAccordionHeight, setCategoryAccordionHeight] = useState(172);
//   //   console.log(reportsTimes);
//   // * filtering the current client based on selected station
//   const filteredStationsResult = currentClient
//     .getReports()
//     .filter((report) => report.getData("clientStationId") === selectedStation);

//   // * redefine the Accordion height
//   const changeCategoryAccordionHeight = (height, toggle) => {
//     if (toggle) {
//       setCategoryAccordionHeight((prev) => prev + height);
//     } else {
//       setCategoryAccordionHeight((prev) => prev - height);
//     }
//   };
//   //   console.log("A checkboxStatus", checkboxStatus);

//   // * checkbox counter
//   const getCheckedCount = (category) => {
//     if (checkboxStatus) {
//       const categoryStatus = checkboxStatus[`${category}Status`];
//       return categoryStatus ? categoryStatus.length : 0;
//     }
//   };

//   // * inner accordionCategoriesItem
//   function accordionCategoriesItem(names, categoryName) {
//     // console.log("names", names);

//     return names.map((item, index) => {
//       // console.log("checkboxStatus", checkboxStatus);
//       if (checkboxStatus) {
//         const checkboxKey = `${categoryName}${index + 1}`;
//         const categoryStatus = checkboxStatus[`${categoryName}Status`];
//         const checkboxValue =
//           categoryStatus && Array.isArray(categoryStatus)
//             ? categoryStatus.includes(parseInt(item.id))
//             : false;
//         // console.log("checkboxValue:", checkboxValue);

//         return {
//           id: item.id,
//           text: (
//             <View>
//               <CheckboxItem
//                 key={checkboxKey + checkboxValue}
//                 label={checkboxKey}
//                 checkboxItemText={item.name}
//                 checked={checkboxValue}
//                 handleChange={(checked) => {
//                   handleCategoriesCheckboxesToggle(
//                     `${categoryName}Status`,
//                     checked,
//                     item.id
//                   );
//                 }}
//               />
//             </View>
//           ),
//           boxItem: (
//             <Image style={{ width: 9, height: 14 }} source={onDragIcon} />
//           ),
//         };
//       }
//     });
//   }

//   // * get the array of categories from the report and updates the state
//   const handleCategoriesCheckboxesToggle = (category, checked, label) => {
//     // console.log("handleCategoriesCheckboxesToggle:", category, checked);

//     setCheckboxStatus((prevStatus) => {
//       const updatedCategoryStatus = [...prevStatus[category]];
//       // find && parsing the index of the array
//       const index = updatedCategoryStatus.indexOf(parseInt(label));

//       //if checked and label is not found in the array add to the array
//       if (checked && index === -1) {
//         updatedCategoryStatus.push(parseInt(label));
//         // if unchecked and label is found in the array remove to the array
//       } else if (!checked && index !== -1) {
//         updatedCategoryStatus.splice(index, 1);
//       }

//       return { ...prevStatus, [category]: updatedCategoryStatus };
//     });
//   };

//   //   console.log("selectedStation", selectedStation);
//   const NewReportAccordionContent = [
//     {
//       key: "settings",
//       headerText: "הגדרות הדוח",
//       contentText: "world",
//       contentHeight: 959,
//       headerHeight: 48,
//       headerTogglerStyling: styles.headerStyle,
//       iconDisplay: true,
//       boxHeight: 80.5,
//       hasDivider: true,
//       draggable: false,
//       accordionCloseIndicator: accordionCloseIcon,
//       accordionOpenIndicator: accordionOpenIcon,
//       contentItemStyling: styles.contentBoxSetting,
//       accordionContent: [
//         {
//           id: 0,
//           text: <Text>תחנה</Text>,
//           boxItem: (
//             <SelectMenu
//               control={control}
//               selectWidth={240}
//               optionsHeight={200}
//               defaultText={
//                 currentReport ? currentReport.getData("station_name") : "בחירה"
//               }
//               //   displayedValue={getValues()?.clientStationId}
//               selectMenuStyling={{
//                 flexDirection: "column",
//                 justifyContent: "center",
//                 alignItems: "flex-start",
//               }}
//               centeredViewStyling={
//                 {
//                   // marginRight: 12,
//                   // alignItems: "flex-end",
//                   // marginTop: -530,
//                 }
//               }
//               selectOptions={currentClient.getStations()}
//               name={"clientStationId"}
//               errorMessage={
//                 errors?.clientStationId && errors?.clientStationId.message
//               }
//               onChange={(value) => {
//                 handleFormChange("clientStationId", value.id);
//                 setSelectedStation(value.id);
//                 setValue("clientStationId", value.company);
//                 trigger("clientStationId");
//                 console.log("value-station:", value);
//               }}
//               propertyName="company"
//               returnObject={true}
//             />
//           ),
//         },

//         {
//           id: 1,
//           text: <Text>התבסס על דוח קודם</Text>,
//           boxItem: (
//             <SelectMenu
//               control={control}
//               selectWidth={240}
//               optionsHeight={750}
//               defaultText={"בחירה"}
//               selectMenuStyling={{
//                 flexDirection: "column",
//                 justifyContent: "center",
//                 alignItems: "flex-start",
//               }}
//               centeredViewStyling={
//                 {
//                   // marginRight: 12,
//                   // alignItems: "flex-end",
//                   // marginTop: 180,
//                 }
//               }
//               selectOptions={[
//                 { timeOfReport: "דוח חדש", id: 0 },
//                 ...filteredStationsResult, //clientStationId
//               ]}
//               name={"previousReports"}
//               errorMessage={
//                 errors?.previousReports && errors?.previousReports.message
//               }
//               onChange={(value) => {
//                 handleFormChange("previousReports", value);
//                 // setSelectedReport(value);
//                 setValue("previousReports", value);
//                 trigger("previousReports");
//                 console.log("previousReports:", value);
//               }}
//               propertyName="timeOfReport"
//             />
//           ),
//         },
//         {
//           id: 2,
//           text: <Text>יש קנסות</Text>,
//           boxItem: (
//             <ToggleSwitch
//               id={"haveFine"}
//               switchStates={switchStates}
//               toggleSwitch={toggleSwitch}
//               truthyText={"כן"}
//               falsyText={"לא"}
//             />
//           ),
//         },
//         {
//           id: 3,
//           text: <Text>להציג כמות סעיפים</Text>,
//           boxItem: (
//             <ToggleSwitch
//               id={"haveAmountOfItems"}
//               switchStates={switchStates}
//               toggleSwitch={toggleSwitch}
//               truthyText={"כן"}
//               falsyText={"לא"}
//             />
//           ),
//         },
//         {
//           id: 4,
//           text: <Text>הצג ציון ביקורת בטיחות מזון</Text>,
//           boxItem: (
//             <ToggleSwitch
//               id={"haveSafetyGrade"}
//               switchStates={switchStates}
//               toggleSwitch={toggleSwitch}
//               truthyText={"כן"}
//               falsyText={"לא"}
//             />
//           ),
//         },
//         {
//           id: 5,
//           text: <Text>הצג ציון ביקורת קולינארית</Text>,
//           boxItem: (
//             <ToggleSwitch
//               id={"haveCulinaryGrade"}
//               switchStates={switchStates}
//               toggleSwitch={toggleSwitch}
//               truthyText={"כן"}
//               falsyText={"לא"}
//             />
//           ),
//         },
//         {
//           id: 6,
//           text: <Text>הצג ציון תזונה</Text>,
//           boxItem: (
//             <ToggleSwitch
//               id={"haveNutritionGrade"}
//               switchStates={switchStates}
//               toggleSwitch={toggleSwitch}
//               truthyText={"כן"}
//               falsyText={"לא"}
//             />
//           ),
//         },
//         {
//           id: 7,
//           text: <Text>הצג שמות קטגוריות בתמצית עבור ליקויים קריטיים</Text>,
//           boxItem: (
//             <ToggleSwitch
//               id={"haveCategoriesNameForCriticalItems"}
//               switchStates={switchStates}
//               toggleSwitch={toggleSwitch}
//               truthyText={"כן"}
//               falsyText={"לא"}
//             />
//           ),
//         },
//         {
//           id: 8,
//           text: <Text>שם המלווה</Text>,
//           boxItem: (
//             <View style={{ justifyContent: "flex-end", alignSelf: "center" }}>
//               <Input
//                 mode={"outlined"}
//                 control={control}
//                 name={"accompany"}
//                 inputStyle={{
//                   backgroundColor: colors.white,
//                   width: 240,
//                   alignSelf: "center",
//                 }}
//                 activeOutlineColor={colors.blue}
//                 // label={accompanySelected ? accompanySelected : "ללא  מלווה"}
//                 // label={null}
//                 defaultValue={
//                   currentReport
//                     ? currentReport.getData("accompany")
//                     : formData?.accompany
//                 }
//                 // placeholder={" "}
//                 outlineColor={"rgba(12, 20, 48, 0.2)"}
//                 onChangeFunction={(value) => {
//                   handleFormChange("accompany", value);
//                 }}
//               />
//             </View>
//           ),
//         },
//         {
//           id: 9,
//           text: <Text>תאריך ביקורת</Text>,
//           boxItem: (
//             <DatePicker
//               control={control}
//               name={"timeOfReport"}
//               errorMessage={
//                 errors?.timeOfReport && errors?.timeOfReport.message
//               }
//               onchange={(value) => {
//                 const date = new Date(value);
//                 const formattedDate = date.toLocaleDateString("en-GB");
//                 handleFormChange("timeOfReport", formattedDate);
//                 setValue("timeOfReport", formattedDate);
//                 trigger("timeOfReport");
//               }}
//               dateInputWidth={240}
//               defaultDate={currentReport?.getData("timeOfReport")}
//             />
//           ),
//         },
//         {
//           id: 10,
//           text: <Text>זמן הביקורת</Text>,
//           boxItem: (
//             <SelectMenu
//               control={control}
//               selectWidth={240}
//               optionsHeight={200}
//               defaultText={currentReport ? currentReportTime : "בחירה"}
//               displayedValue={currentReportTime}
//               selectMenuStyling={{
//                 flexDirection: "column",
//                 justifyContent: "center",
//                 alignItems: "flex-start",
//               }}
//               selectOptions={reportsTimes}
//               name={"reportTime"}
//               errorMessage={errors?.reportTime && errors?.reportTime.message}
//               onChange={(value) => {
//                 setCurrentReportTime(value.id);
//                 handleFormChange("reportTime", value.id);
//                 setValue("reportTime");
//                 trigger("reportTime");
//                 console.log("reportTime:", value);
//               }}
//               propertyName={"name"}
//               returnObject={true}
//             />
//           ),
//         },
//       ],
//     },
//     {
//       key: "categories",
//       headerText: "קטגוריות",
//       contentText: "world",
//       contentHeight: categoryAccordionHeight,
//       headerHeight: 48,
//       headerTogglerStyling: styles.headerStyle,
//       iconDisplay: true,
//       boxHeight: 46,
//       hasDivider: true,
//       draggable: true,
//       // toggleHandler: () => resetCategoryAccordionHeight,
//       accordionCloseIndicator: accordionCloseIcon,
//       accordionOpenIndicator: accordionOpenIcon,
//       contentItemStyling: styles.contentBoxCategories,
//       scrollEnabled: true,
//       accordionContent: [
//         {
//           id: 0,
//           boxItem: (
//             <>
//               {errors?.categorys && errors?.categorys.message && (
//                 <HelperText type="error" style={{ marginBottom: 10 }}>
//                   {errors?.categorys.message}
//                 </HelperText>
//               )}
//             </>
//           ),
//         },
//         {
//           id: 1,
//           boxItem: (
//             <Accordion
//               headerText={`${
//                 memoizedCategories &&
//                 memoizedCategories.categories &&
//                 memoizedCategories.categories[1].name
//               } (נבחרו ${getCheckedCount("foodSafetyReviewCb")} דוחות)`}
//               contentHeight={336}
//               headerHeight={50}
//               accordionCloseIndicator={ClientItemArrow}
//               accordionOpenIndicator={ClientItemArrowOpen}
//               toggleHandler={changeCategoryAccordionHeight}
//               iconText={"בחר קטגוריות"}
//               headerTogglerStyling={{
//                 backgroundColor: "#D3E0FF",
//               }}
//               iconDisplay={true}
//               draggable={true}
//               boxHeight={56}
//               headerTextStyling={{
//                 color: colors.black,
//                 fontFamily: fonts.ABold,
//               }}
//               scrollEnabled={true}
//               accordionContent={accordionCategoriesItem(
//                 formData && formData?.categorys
//                   ? [...foodSafetyReviewTexts].sort((a, b) => {
//                       const aIdx = formData?.categorys.indexOf(Number(a.id));
//                       const bIdx = formData?.categorys.indexOf(Number(b.id));

//                       if (aIdx >= 0 && bIdx >= 0) {
//                         return aIdx - bIdx;
//                       } else if (aIdx >= 0) {
//                         return -1;
//                       } else if (bIdx >= 0) {
//                         return 1;
//                       } else {
//                         return 0;
//                       }
//                     })
//                   : [],
//                 "foodSafetyReviewCb"
//               )}
//               onDragEndCb={(data) => {
//                 const { from, to } = data;

//                 // deepcopy the current checkboxStatus.foodSafetyReviewCbStatus array
//                 const newCheckboxStatus = [
//                   ...checkboxStatus.foodSafetyReviewCbStatus,
//                 ];

//                 // reordering the checkbox statuses to match the new item order
//                 newCheckboxStatus.splice(
//                   to,
//                   0,
//                   newCheckboxStatus.splice(from, 1)[0]
//                 );

//                 // updateing the checkboxStatus state
//                 setCheckboxStatus({
//                   ...checkboxStatus,
//                   foodSafetyReviewCbStatus: newCheckboxStatus,
//                 });

//                 // reorder the items in foodSafetyReviewTexts to match the new order
//                 const newData = [...foodSafetyReviewTexts];
//                 newData.splice(to, 0, newData.splice(from, 1)[0]);

//                 // update the newData state
//                 setFoodSafetyReviewTexts(newData);

//                 setIsRearrangement(true);
//               }}
//               contentItemStyling={{
//                 width: "100%",
//                 height: 56,
//                 alignItems: "center",
//                 paddingHorizontal: 16,
//               }}
//               hasDivider={true}
//             />
//           ),
//         },
//         {
//           id: 2,
//           boxItem: (
//             <Accordion
//               headerText={`${
//                 memoizedCategories &&
//                 memoizedCategories.categories &&
//                 memoizedCategories.categories[2].name
//               } (נבחרו  ${getCheckedCount("culinaryReviewCb")} דוחות)`}
//               contentHeight={336}
//               headerHeight={50}
//               draggable={true}
//               accordionCloseIndicator={ClientItemArrow}
//               accordionOpenIndicator={ClientItemArrowOpen}
//               iconText={"בחר קטגוריות"}
//               toggleHandler={changeCategoryAccordionHeight}
//               headerTogglerStyling={{
//                 ...styles.headerStyle,
//                 backgroundColor: "#D3E0FF",
//               }}
//               iconDisplay={true}
//               boxHeight={50}
//               scrollEnabled={true}
//               headerTextStyling={{
//                 color: colors.black,
//                 fontFamily: fonts.ABold,
//               }}
//               accordionContent={accordionCategoriesItem(
//                 formData && formData?.categorys
//                   ? [...culinaryReviewTexts].sort((a, b) => {
//                       const aIdx = formData?.categorys.indexOf(Number(a.id));
//                       const bIdx = formData?.categorys.indexOf(Number(b.id));

//                       if (aIdx >= 0 && bIdx >= 0) {
//                         return aIdx - bIdx;
//                       } else if (aIdx >= 0) {
//                         return -1;
//                       } else if (bIdx >= 0) {
//                         return 1;
//                       } else {
//                         return 0;
//                       }
//                     })
//                   : [],
//                 "culinaryReviewCb"
//               )}
//               onDragEndCb={(data) => {
//                 const { from, to } = data;

//                 // deepcopy the current checkboxStatus.culinaryReviewCbStatus array
//                 const newCheckboxStatus = [
//                   ...checkboxStatus.culinaryReviewCbStatus,
//                 ];

//                 // reordering the checkbox statuses to match the new item order
//                 newCheckboxStatus.splice(
//                   to,
//                   0,
//                   newCheckboxStatus.splice(from, 1)[0]
//                 );

//                 // updateing the checkboxStatus state
//                 setCheckboxStatus({
//                   ...checkboxStatus,
//                   culinaryReviewCbStatus: newCheckboxStatus,
//                 });

//                 // reorder the items in culinaryReviewTexts to match the new order
//                 const newData = [...culinaryReviewTexts];
//                 newData.splice(to, 0, newData.splice(from, 1)[0]);

//                 // update the newData state
//                 setCulinaryReviewTexts(newData);

//                 setIsRearrangement(true);
//               }}
//               contentItemStyling={{
//                 width: "100%",
//                 height: 56,
//                 alignItems: "center",
//                 paddingHorizontal: 16,
//               }}
//               hasDivider={true}
//             />
//           ),
//         },
//         {
//           id: 3,
//           boxItem: (
//             <>
//               <Accordion
//                 headerText={`${
//                   memoizedCategories &&
//                   memoizedCategories.categories &&
//                   memoizedCategories.categories[3].name
//                 } (נבחרו  ${getCheckedCount("nutritionReviewCb")} דוחות)`}
//                 contentHeight={336}
//                 headerHeight={50}
//                 draggable={true}
//                 accordionCloseIndicator={ClientItemArrow}
//                 accordionOpenIndicator={ClientItemArrowOpen}
//                 iconText={"בחר קטגוריות"}
//                 toggleHandler={changeCategoryAccordionHeight}
//                 headerTogglerStyling={{
//                   ...styles.headerStyle,
//                   backgroundColor: "#D3E0FF",
//                 }}
//                 iconDisplay={true}
//                 scrollEnabled={true}
//                 boxHeight={50}
//                 headerTextStyling={{
//                   color: colors.black,
//                   fontFamily: fonts.ABold,
//                 }}
//                 accordionContent={accordionCategoriesItem(
//                   formData && formData?.categorys
//                     ? [...nutritionReviewTexts].sort((a, b) => {
//                         const aIdx = formData?.categorys.indexOf(Number(a.id));
//                         const bIdx = formData?.categorys.indexOf(Number(b.id));

//                         if (aIdx >= 0 && bIdx >= 0) {
//                           return aIdx - bIdx;
//                         } else if (aIdx >= 0) {
//                           return -1;
//                         } else if (bIdx >= 0) {
//                           return 1;
//                         } else {
//                           return 0;
//                         }
//                       })
//                     : [],
//                   "nutritionReviewCb"
//                 )}
//                 onDragEndCb={(data) => {
//                   const { from, to } = data;

//                   // deepcopy the current checkboxStatus.nutritionReviewCbStatus array
//                   const newCheckboxStatus = [
//                     ...checkboxStatus.nutritionReviewCbStatus,
//                   ];

//                   // reordering the checkbox statuses to match the new item order
//                   newCheckboxStatus.splice(
//                     to,
//                     0,
//                     newCheckboxStatus.splice(from, 1)[0]
//                   );

//                   // updateing the checkboxStatus state
//                   setCheckboxStatus({
//                     ...checkboxStatus,
//                     nutritionReviewCbStatus: newCheckboxStatus,
//                   });

//                   // reorder the items in nutritionReviewTexts to match the new order
//                   const newData = [...nutritionReviewTexts];
//                   newData.splice(to, 0, newData.splice(from, 1)[0]);

//                   // update the newData state
//                   setNutritionReviewTexts(newData);

//                   setIsRearrangement(true);
//                 }}
//                 contentItemStyling={{
//                   width: "100%",
//                   height: 56,
//                   alignItems: "center",
//                   paddingHorizontal: 16,
//                 }}
//                 hasDivider={true}
//               />
//             </>
//           ),
//         },
//       ],
//     },
//     {
//       key: "summary",
//       headerText: "תמצית הדוח",
//       contentText: "world",
//       contentHeight: 300,
//       headerHeight: 48,
//       headerTogglerStyling: styles.headerStyle,
//       iconDisplay: true,
//       // boxHeight: 80.5,
//       draggable: false,
//       contentItemStyling: styles.contentBoxSettingSummery,
//       hasDivider: false,
//       accordionCloseIndicator: accordionCloseIcon,
//       accordionOpenIndicator: accordionOpenIcon,
//       accordionContent: [
//         {
//           id: 0,
//           boxItem: (
//             <View
//               style={{
//                 flex: 1,
//                 width: "100%",
//                 marginTop: 20,
//                 height: "100%",
//                 direction: "rtl",
//                 // backgroundColor: "red",
//               }}
//             >
//               <View
//                 style={{
//                   backgroundColor: "#D3E0FF",
//                   width: "100%",
//                   alignItems: "flex-start",
//                   // marginBottom: 200,
//                   position: "relative",
//                   zIndex: 3,
//                 }}
//               >
//                 <RichToolbar
//                   editor={richText}
//                   selectedButtonStyle={{ backgroundColor: "#baceff" }}
//                   unselectedButtonStyle={{ backgroundColor: "#D3E0FF" }}
//                   iconTint="#000000"
//                   selectedIconTint="#000000"
//                   actions={[
//                     actions.insertOrderedList,
//                     actions.insertBulletsList,
//                     actions.setUnderline,
//                     actions.setItalic,
//                     actions.setBold,
//                     "custom",
//                   ]}
//                   // onPressAddImage={onPressAddImage}
//                   // onAction={onAction} // Add the onAction prop for custom actions
//                   iconMap={{
//                     ["custom"]: ({}) => <Text>C</Text>,
//                   }}
//                   custom={() => {
//                     setColorSelected(!colorSelected);
//                     console.log("object");
//                   }}
//                 />
//               </View>
//               {colorSelected && (
//                 <View
//                   style={{
//                     direction: "ltr",
//                     width: 200,
//                     position: "absolute",
//                     top: 20,
//                     zIndex: 3,
//                   }}
//                 >
//                   <ColorPicker
//                     onColorChange={(color) => {
//                       console.log(color);
//                       richText.current?.setForeColor(color);
//                     }}
//                     sliderSize={20}
//                     thumbSize={60}
//                     gapSize={5}
//                     // noSnap={true}
//                     color="#000000"
//                     palette={[
//                       "#000000",
//                       "#ffff00",
//                       "#0000ff",
//                       "#ff0000",
//                       "#00ff00",
//                     ]}
//                     swatches={true}
//                   />
//                 </View>
//               )}
//               <ScrollView
//                 onLayout={(event) => {
//                   const { height, width } = event.nativeEvent.layout;
//                   // setRichTextHeight(height);
//                 }}
//                 style={{
//                   flex: 1,
//                   overflow: "visible",
//                   // height: 200,
//                   minHeight: Platform.OS == "ios" ? 200 : 200,
//                   direction: "rtl",
//                   borderWidth: 1,
//                   // borderColor: "#000",
//                   borderColor: "#eee",
//                   zIndex: 2,
//                 }}
//               >
//                 <KeyboardAvoidingView
//                   behavior={Platform.OS == "ios" ? "height" : "height"}
//                   style={{ flex: 1, direction: "rtl" }}
//                 >
//                   <RichEditor
//                     ref={richText}
//                     onChange={handleContentChange}
//                     initialContentHTML={
//                       currentReport
//                         ? currentReport.getData("newGeneralCommentTopText")
//                         : ""
//                     }
//                     styleWithCSS={true}
//                     useContainer={false}
//                     style={{
//                       direction: "rtl",
//                       // borderWidth: 1,
//                       // borderColor: "#000",
//                       height: 200,
//                     }}
//                   />
//                 </KeyboardAvoidingView>
//               </ScrollView>
//             </View>
//           ),
//         },
//       ],
//     },
//   ];
//   // * filtering out timeofReport when on edit mode.
//   const modifiedAccordionContent = currentReport
//     ? NewReportAccordionContent.map((section) => {
//         if (section.key === "settings") {
//           const modifiedAccordionContent = section.accordionContent.filter(
//             (item) => item.id !== 1
//           );
//           return { ...section, accordionContent: modifiedAccordionContent };
//         }
//         return section;
//       })
//     : NewReportAccordionContent;

//   return modifiedAccordionContent;
// };
// export default AccordionData;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     paddingHorizontal: 0,
//   },
//   headerWrapper: {
//     flex: 1,
//     flexDirection: "column",
//     gap: 8,
//     marginTop: 26,
//     marginBottom: 16,
//     paddingHorizontal: 16,
//   },
//   header: {
//     alignSelf: "flex-start",
//     fontFamily: fonts.ABold,
//     fontSize: 24,
//   },
//   navigationWrapper: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 5,
//   },
//   navigationText: {
//     fontFamily: fonts.ARegular,
//     fontSize: 16,
//   },
//   icon: {
//     width: 20,
//     height: 20,
//   },
//   headerStyle: {
//     backgroundColor: "#6886D2",
//   },
//   contentBox: {
//     flexDirection: "column",
//   },
//   contentBoxSetting: {
//     alignItems: "center",
//     height: 80.5,
//     paddingHorizontal: 16,
//     flex: 1,
//     direction: "rtl",
//   },
//   contentBoxSettingSummery: {
//     alignItems: "center",
//     // height: 80.5,
//     paddingHorizontal: 16,
//     flex: 1,
//     direction: "rtl",
//   },
//   contentBoxCategories: {
//     alignItems: "center",
//     // height: 200.5,
//   },
//   categoryDirButton: {
//     color: colors.white,
//     fontFamily: fonts.ARegular,
//     fontSize: 16,
//   },
// });
