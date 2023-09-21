import { Image, Text, TouchableOpacity, View } from "react-native";
import fonts from "../../../../../styles/fonts";
import colors from "../../../../../styles/colors";

const ImageText = ({ imageSource, ImageText, onIconPress }) => {
  return (
    <TouchableOpacity
      style={{ flexDirection: "column", alignItems: "center", gap: 10 }}
      onPress={onIconPress}
    >
      <Image source={imageSource} style={{ width: 24, height: 24 }} />
      <Text
        style={{
          fontFamily: fonts.ARegular,
          fontSize: 12,
          color: colors.black,
        }}
      >
        {ImageText}
      </Text>
    </TouchableOpacity>
  );
};

export default ImageText;
