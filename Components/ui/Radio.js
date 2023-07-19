import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";

const Radio = ({ options }) => {
  //   const options = ["Option 1", "Option 2", "Option 3", "Option 4"];
  const [selectedOption, setSelectedOption] = useState("");

  const handleOptionChange = (option) => {
    setSelectedOption(option);
  };

  return (
    <View>
      {options.map((option) => (
        <TouchableOpacity
          key={option}
          onPress={() => handleOptionChange(option)}
          style={{ flexDirection: "row", alignItems: "center" }}
        >
          <View
            style={{
              height: 20,
              width: 20,
              borderRadius: 5,
              borderWidth: 2,
              borderColor: selectedOption === option ? "#007AFF" : "#000",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {selectedOption === option && (
              <View
                style={{
                  height: 10,
                  width: 10,
                  borderRadius: 3,
                  backgroundColor: "#007AFF",
                }}
              />
            )}
          </View>
          <Text style={{ marginLeft: 8 }}>{option}</Text>
        </TouchableOpacity>
      ))}
      <Text>Selected Option: {selectedOption}</Text>
    </View>
  );
};

export default Radio;
