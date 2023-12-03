import { StyleSheet } from "react-native";
import React from "react";
import { FlatList } from "react-native-gesture-handler";
import Accordion from "../../../Components/ui/Accordion";
// import AccordionData from "./AccordionData";

const AccordionContentList = ({ data }) => {
  // const data = AccordionData(
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
  //   handleContentChange
  // );

  const renderAccordion = ({ item }) => (
    <Accordion
      headerText={item.headerText}
      contentText={item.contentText}
      contentHeight={item.contentHeight}
      headerHeight={item.headerHeight}
      headerTogglerStyling={styles.headerStyle}
      iconDisplay={true}
      boxHeight={item.boxHeight}
      accordionContent={item.accordionContent}
      contentItemStyling={item.contentItemStyling}
      hasDivider={item.hasDivider}
      headerTextStyling={item.headerTextStyling}
      accordionCloseIndicator={item.accordionCloseIndicator}
      accordionOpenIndicator={item.accordionOpenIndicator}
      scrollEnabled={item.scrollEnabled}
      toggleHandler={item.toggleHandler}
      draggable={item.draggable}
    />
  );

  return (
    <FlatList
      data={data}
      renderItem={renderAccordion}
      keyExtractor={(item, index) => index.toString()}
    />
  );
};

export default AccordionContentList;

const styles = StyleSheet.create({
  headerStyle: {
    backgroundColor: "#6886D2",
  },
});
