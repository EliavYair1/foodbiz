import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
  TextInput,
} from "react-native";

import fonts from "../../../../../styles/fonts";
import colors from "../../../../../styles/colors";
import { FlatList } from "react-native-gesture-handler";
import Drawer from "../../../../../Components/ui/Drawer";
import { LinearGradient } from "expo-linear-gradient";
import accordionCloseIcon from "../../../../../assets/imgs/accordionCloseIndicator.png";
import FileIcon from "../../../../../assets/icons/iconImgs/FileIcon.png";
import CloseDrawerIcon from "../../../../../assets/imgs/oncloseDrawerIcon.png";
import {
  RichEditor,
  RichToolbar,
  actions,
} from "react-native-pell-rich-editor";
import ColorPicker from "react-native-wheel-color-picker";
import SummaryAndNote from "./SummaryAndNote";
import CategoryItemName from "./categoryItemName";
import "@env";
import { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";

const SummaryDrawer = ({
  onPrevCategory = false,
  prevCategoryText = false,
  onNextCategory = false,
  nextCategoryText = false,
  onSetContent,
  currentCategoryId = 0,
  currentReportItemsForGrade = [],
  memoizedCategories,
}) => {
  const drawerRef = useRef(null);
  const richText = useRef();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [colorSelected, setColorSelected] = useState(null);

  const currentReport = useSelector(
    (state) => state.currentReport.currentReport
  );
  const [content, setContent] = useState(
    currentReport.getData("newGeneralCommentTopText") ?? ""
  );

  const haveSafetyGrade = currentReport.getData("haveSafetyGrade");
  const haveCulinaryGrade = currentReport.getData("haveCulinaryGrade");
  const haveNutritionGrade = currentReport.getData("haveNutritionGrade");
  const haveCategoriesNameForCriticalItems = currentReport.getData(
    "haveCategoriesNameForCriticalItems"
  );

  const handleDrawerToggle = (isOpen) => {
    setIsDrawerOpen(isOpen);
  };

  const handleCustomAction = () => {
    setColorSelected(!colorSelected);
    console.log("Custom action triggered");
  };
  const [text, setText] = useState("");
  const textInputRef = useRef(null);
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

  // * get the category type value from the categories
  const getCategory = (categoryId) => {
    for (const [key, value] of Object.entries(memoizedCategories.categories)) {
      let found = value.categories.find(
        (category) => category.id == categoryId
      );
      if (found) {
        return found;
      }
    }
    return false;
  };

  // * newGeneralCommentTopText drawer change handler
  const handleContentChange = debounce((content) => {
    console.log("[SummaryDrawer]", content);
    setContent(content);
    onSetContent(content);
  }, 300);

  // * newGeneralCommentTopText color picker
  // useEffect(() => {
  //   if (content == "") {
  //     handleContentChange(currentReport.getData("newGeneralCommentTopText"));
  //   }
  // }, []);

  // ! bug issue it gets undefined becouse the starcture of the data is changed in the backend
  const categoriesDataFromReport = currentReport.getCategoriesData();
  const parsedCategoriesDataFromReport = JSON.parse(categoriesDataFromReport);

  // * summery and notes drawer logic
  const summeryAndNotesManager = (types, condition) => {
    let commentGroups = { critical: [], severe: [], normal: [] };
    // const parsedCategoriesDataFromReport = JSON.parse(categoriesDataFromReport);
    // * looping through the report categories data.
    parsedCategoriesDataFromReport.forEach((category) => {
      const items =
        category.id == currentCategoryId
          ? currentReportItemsForGrade
          : category.items;
      // * inner loop of the categories items.
      for (const currentReportItem of items) {
        for (let type of types) {
          // * looking for the major category base on the type so we can display its subcategories
          const relevantCategoryToFind = memoizedCategories.categories[
            type
          ].categories.find((el) => el.id == category.id);
          if (!relevantCategoryToFind) continue;
          // * looking the relevent category in the items based on their id's.
          const categoriesMatchReportId = relevantCategoryToFind.items.find(
            (categoryItem) => categoryItem.id == currentReportItem.id
          );

          // * checking if the conditions is true base on
          if (condition(category, currentReportItem)) {
            let comment = currentReportItem.comment;

            if (
              currentReportItem.image ||
              currentReportItem.image2 ||
              currentReportItem.image3
            ) {
              comment += " - מצורפת תמונה";
            }

            if (
              categoriesMatchReportId &&
              categoriesMatchReportId.critical == 1 &&
              currentReportItem.grade == 0
            ) {
              if (haveCategoriesNameForCriticalItems == 1) {
                comment = (
                  <Text style={{ color: "red" }}>
                    {comment}
                    <Text style={{ fontFamily: fonts.ABold }}>
                      {" "}
                      *הקטגוריה {getCategory(category.id).name} התאפסה
                    </Text>
                  </Text>
                );
              }

              commentGroups.critical.push(comment);
            } else if (
              categoriesMatchReportId &&
              categoriesMatchReportId.critical == 0 &&
              currentReportItem.grade == 0
            ) {
              commentGroups.severe.push(comment);
            } else {
              commentGroups.normal.push(comment);
            }
          }
        }
      }
    });

    return [
      ...commentGroups.critical,
      ...commentGroups.severe,
      ...commentGroups.normal,
    ];
  };

  return (
    <Drawer
      header={
        <LinearGradient
          colors={["#37549D", "#26489F"]}
          start={[0, 0]}
          end={[1, 0]}
          style={{ width: "100%", padding: 16, height: 76, zIndex: 1 }}
        >
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "row",
            }}
          >
            {isDrawerOpen && (
              <TouchableOpacity
                onPress={() => drawerRef.current.toggleDrawer()}
                style={{ position: "absolute", left: 0, top: 5, zIndex: 1 }}
              >
                <Image
                  source={CloseDrawerIcon}
                  style={{ width: 20, height: 20 }}
                />
              </TouchableOpacity>
            )}

            {!isDrawerOpen && onPrevCategory && (
              <TouchableOpacity
                onPress={onPrevCategory}
                style={{
                  alignSelf: "center",
                  flexDirection: "row",
                  gap: 5,
                  alignItems: "center",
                  position: "absolute",
                  left: 0,
                  top: 10,
                  zIndex: 1,
                }}
              >
                <Image
                  source={accordionCloseIcon}
                  style={{
                    width: 20,
                    height: 20,
                    transform: [{ rotate: "180deg" }],
                  }}
                />

                <Text style={styles.categoryDirButton}>{prevCategoryText}</Text>
              </TouchableOpacity>
            )}
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  drawerRef.current.toggleDrawer();
                }}
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  textAlign: "center",
                  // flex: 1,
                  gap: 12,
                }}
              >
                <Image source={FileIcon} style={{ width: 24, height: 24 }} />
                <Text
                  style={{
                    justifyContent: "center",
                    alignSelf: "center",
                    color: colors.white,
                    fontSize: 24,
                    fontFamily: fonts.ABold,
                  }}
                >
                  תמצית והערות
                </Text>
              </TouchableOpacity>
            </View>
            {!isDrawerOpen && onNextCategory && (
              <TouchableOpacity
                onPress={onNextCategory}
                style={{
                  alignSelf: "center",
                  flexDirection: "row",
                  gap: 5,
                  alignItems: "center",
                  // flex: 0,
                  position: "absolute",
                  right: 0,
                  top: 10,
                }}
              >
                <Text style={styles.categoryDirButton}>{nextCategoryText}</Text>
                <Image
                  source={accordionCloseIcon}
                  style={{ width: 20, height: 20 }}
                />
              </TouchableOpacity>
            )}

            {/* )} */}
          </View>
        </LinearGradient>
      }
      content={[
        <SummaryAndNote
          height={207}
          header={"תמצית הדוח"}
          summaryAndNoteContent={
            <View
              style={{
                flex: 1,
                width: "100%",
                // marginTop: 20,
                height: "100%",
                direction: "rtl",
                paddingHorizontal: 16,
                paddingVertical: 20,
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
                  custom={handleCustomAction}
                />
              </View>
              {colorSelected && (
                <View
                  style={{
                    direction: "ltr",
                    width: 200,
                    position: "absolute",
                    top: -15,
                    zIndex: 3,
                  }}
                >
                  <ColorPicker
                    onColorChange={(color) => {
                      console.log(color);
                      richText.current?.setForeColor(color);
                    }}
                    sliderSize={20}
                    thumbSize={40}
                    gapSize={5}
                    // noSnap={true}
                    color="#000000"
                    palette={[
                      "#000000",
                      "#ffff00",
                      "#0000ff",
                      "#ff0000",
                      "#00ff00",
                    ]}
                    swatches={true}
                  />
                </View>
              )}

              <KeyboardAvoidingView
                behavior={Platform.OS == "ios" ? "height" : "padding"}
                style={{
                  flex: 1,
                  borderWidth: 1,
                  overflow: "visible",
                  direction: "rtl",
                  borderColor: "#eee",
                  textAlign: "right",
                }}
              >
                <RichEditor
                  ref={richText}
                  onChange={handleContentChange}
                  initialContentHTML={content}
                  styleWithCSS={true}
                  useContainer={false}
                  style={{
                    minHeight: 123,
                    // minHeight: Platform.OS == "ios" ? 123 : 123,
                    // borderWidth: 1,
                    height: 123,
                    zIndex: 5,
                    textAlign: "right",
                  }}
                />
              </KeyboardAvoidingView>
            </View>
          }
        />,
        <SummaryAndNote
          header={" הערות ביקורת בטיחות מזון"}
          height={160}
          verticalSpace={16}
          summaryAndNoteContent={
            <>
              <FlatList
                data={
                  haveSafetyGrade == 1
                    ? summeryAndNotesManager(
                        [1],
                        (category, item) =>
                          item.showOnComment == 1 &&
                          item.charge != "הלקוח" &&
                          item.charge != "מנהל המשק" &&
                          item.charge != "בית החולים"
                        // item &&
                        // getCategory(category.id).type == 1
                      )
                    : null
                }
                renderItem={({ item, index }) => {
                  // summeryAndNotesManager(item);
                  // console.log(`currentReportItems:`, currentReportItems);
                  return (
                    <CategoryItemName
                      key={item.id}
                      number={index + 1}
                      item={item}
                    />
                  );
                }}
                keyExtractor={(item, index) =>
                  item.id ? item.id.toString() : index.toString()
                }
              />
            </>
          }
        />,
        <SummaryAndNote
          header={"הערות ביקורת קולינארית"}
          height={160}
          verticalSpace={16}
          summaryAndNoteContent={
            <>
              <FlatList
                data={
                  haveCulinaryGrade == 1
                    ? summeryAndNotesManager(
                        [2],
                        (category, item) =>
                          item.showOnComment == 1 &&
                          item.charge != "הלקוח" &&
                          item.charge != "מנהל המשק" &&
                          item.charge != "בית החולים"
                        // item &&
                        // getCategory(category.id).type == 2
                      )
                    : null
                }
                // data={haveCulinaryGrade == 1 ? categoriesDataFromReport : null}
                renderItem={({ item, index }) => (
                  <CategoryItemName
                    key={item.id}
                    number={index + 1}
                    item={item}
                  />
                )}
                keyExtractor={(item, index) =>
                  item.id ? item.id.toString() : index.toString()
                }
              />
            </>
          }
        />,
        <SummaryAndNote
          header={"הערות תזונה"}
          height={160}
          verticalSpace={16}
          summaryAndNoteContent={
            <>
              <FlatList
                data={
                  haveNutritionGrade == 1
                    ? summeryAndNotesManager(
                        [3],
                        (category, item) =>
                          item.showOnComment == 1 &&
                          item.charge != "הלקוח" &&
                          item.charge != "מנהל המשק" &&
                          item.charge != "בית החולים"
                        // item &&
                        // getCategory(category.id).type == 3
                      )
                    : null
                }
                // data={haveNutritionGrade == 1 ? categoriesDataFromReport : null}
                renderItem={({ item, index }) => (
                  <CategoryItemName
                    key={item.id}
                    number={index + 1}
                    item={item}
                  />
                )}
                keyExtractor={(item, index) =>
                  item.id ? item.id.toString() : index.toString()
                }
              />
            </>
          }
        />,
        <SummaryAndNote
          header={"הערות באחריות לקוח"}
          height={160}
          verticalSpace={16}
          summaryAndNoteContent={
            <>
              <FlatList
                // data={haveSafetyGrade == 1 ? categoriesDataFromReport : null}
                data={summeryAndNotesManager(
                  [1, 2, 3],
                  (category, item) =>
                    item.showOnComment == 1 &&
                    (item.charge == "הלקוח" || item.charge == "מנהל המשק")
                )}
                renderItem={({ item, index }) => (
                  <CategoryItemName
                    key={item.id}
                    number={index + 1}
                    item={item}
                  />
                )}
                keyExtractor={(item, index) =>
                  item.id ? item.id.toString() : index.toString()
                }
              />
            </>
          }
        />,
        <SummaryAndNote
          header={"הערות תשתית (באחריות בית החולים)"}
          height={160}
          verticalSpace={16}
          summaryAndNoteContent={
            <>
              <FlatList
                // data={haveSafetyGrade == 1 ? categoriesDataFromReport : null}
                data={summeryAndNotesManager(
                  [1, 2, 3],
                  (category, item) =>
                    item.showOnComment == 1 && item.charge == "בית החולים"
                )}
                renderItem={({ item, index }) => (
                  <CategoryItemName
                    key={item.id}
                    number={index + 1}
                    item={item}
                  />
                )}
                keyExtractor={(item, index) =>
                  item.id ? item.id.toString() : index.toString()
                }
              />
            </>
          }
        />,
      ]}
      height={647}
      onToggle={handleDrawerToggle}
      ref={drawerRef}
      contentStyling={{ padding: 16 }}
    />
  );
};

export default SummaryDrawer;

const styles = StyleSheet.create({
  categoryDirButton: {
    color: colors.white,
    fontFamily: fonts.ARegular,
    fontSize: 16,
  },
});
