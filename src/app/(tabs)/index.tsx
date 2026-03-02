import { Button, Host } from "@expo/ui/jetpack-compose";
import { Link, useRouter } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

export default function Index() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text>Welcome to BeReal Clone App</Text>

      <Link href={"/about"}>sasas</Link>

      <Host matchContents>
        <Button onPress={() => alert("Pressed!")}>Press me</Button>
      </Host>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
