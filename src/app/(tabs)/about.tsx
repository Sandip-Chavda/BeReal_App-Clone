import React from "react";
import { StyleSheet, Text, View } from "react-native";

const AboutScreen = () => {
  return (
    <View style={styles.container}>
      <Text>AboutScreen</Text>
    </View>
  );
};

export default AboutScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
