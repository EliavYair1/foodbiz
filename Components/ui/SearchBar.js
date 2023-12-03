import { Searchbar } from "react-native-paper";
import colors from "../../styles/colors";
import React, { useRef } from "react";
import { StyleSheet } from "react-native";
const SearchBar = ({
  placeholder,
  onChangeText,
  onSearch,
  searchBarStyling,
  loading = false,
}) => {
  const searchbarRef = useRef(null);

  const handleIconPress = () => {
    if (searchbarRef && searchbarRef.current) {
      searchbarRef.current.focus();
    }
  };

  return (
    <Searchbar
      ref={searchbarRef}
      style={[styles.barStyle, searchBarStyling ?? ""]}
      placeholder={placeholder}
      onChangeText={onChangeText}
      onSubmitEditing={onSearch}
      mode="bar"
      showDivider={true}
      loading={loading}
      onIconPress={handleIconPress}
    />
  );
};
const styles = StyleSheet.create({
  barStyle: {
    width: 286,
    backgroundColor: colors.white,
    borderColor: "rgba(255, 255, 255, 0.5)",
    borderWidth: 1,
    flexDirection: "row-reverse",
    paddingRight: 12,
    elevation: 4,
    shadowColor: "rgba(0, 0, 0, 0.07)",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 1,
    shadowRadius: 4,
  },
});
export default SearchBar;
