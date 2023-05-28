import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Image,
  FlatList,
  ScrollView,
} from "react-native";
import { List, Divider } from "react-native-paper";
import fonts from "../../styles/fonts";
import colors from "../../styles/colors";
import Tabs from "./Tabs";
import Button from "./Button";
import ClientTable from "../../Screens/ClientsList/ClientsItem/ClientTable/ClientTable";
import Category from "../modals/category";
const Accordion = ({
  children,
  contentHeight,
  accordionSection,
  accordionSectionHeight,
  headerContent,
  items,
}) => {
  const [open, setOpen] = useState(false);
  const heightAnim = useRef(new Animated.Value(0)).current;
  const contentRef = useRef();

  const handleClick = () => {
    setOpen(!open);
  };
  useEffect(() => {
    Animated.timing(heightAnim, {
      toValue: open ? 320 : 0,
      duration: 250,
      useNativeDriver: false,
    }).start();
  }, [open, heightAnim]);

  const styles = StyleSheet.create({
    newReportButton: {
      borderRadius: 100,
      backgroundColor: colors.lightBlue,
      paddingHorizontal: 15,
      paddingVertical: 8,
    },
    newReportButtonText: {
      color: colors.black,
    },
  });

  const renderItem = ({ item }) => {
    console.log(item);
    return (
      <List.Accordion
        onPress={handleClick}
        expanded={open}
        title={item.name}
        id={item.id}
        key={item.id}
        left={(props) => (
          <Image
            source={require("../../assets/imgs/fileIcon.png")}
            style={{
              width: 20,
              height: 20,
              alignSelf: "center",
              marginLeft: 10,
            }}
          />
        )}
        right={(props) => (
          <View
            style={{
              flexDirection: "row-reverse",
              alignItems: "center",
              gap: 85,
            }}
          >
            <Text>{open ? "v" : "^"}</Text>
            <View style={{ alignSelf: "center" }}>
              <Button
                buttonText={"דוח חדש"}
                buttonStyle={styles.newReportButton}
                buttonTextStyle={styles.newReportButtonText}
                icon={true}
                IconColor={colors.black}
                iconSize={20}
                iconName={"plus"}
                buttonWidth={113}
                buttonFunction={() => console.log("new report")}
              />
            </View>
          </View>
        )}
      >
        <View style={{ height: "100%" }}>{children}</View>
      </List.Accordion>
    );
  };

  return (
    <List.AccordionGroup>
      <ScrollView style={[{ height: contentHeight }]}>
        <FlatList
          data={items}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
        />
      </ScrollView>
    </List.AccordionGroup>
  );
};

export default Accordion;
