import React from "react";
import { StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const OnBoardingScreen = () => {
  return (
    <SafeAreaView edges={["bottom", "top"]} style={styles.container}>
      <Text>On Boarding Screen</Text>
    </SafeAreaView>
  );
};

export default OnBoardingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
