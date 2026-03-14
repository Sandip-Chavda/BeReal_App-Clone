import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase/client";
import { uploadProfileImage } from "@/lib/supabase/storage";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const OnBoardingScreen = () => {
  const router = useRouter();

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { user, updateUser } = useAuth();

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "Permission needed",
        "We need camera roll permission to select a profile image.",
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "Permission needed",
        "We need camera permission to select a profile image.",
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const showImagePicker = () => {
    Alert.alert("Select Profile Image", "Choose an option", [
      { text: "Camera", onPress: takePhoto },
      { text: "From Gallery", onPress: pickImage },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const handleComplete = async () => {
    if (!name || !username) {
      Alert.alert("Error", "Please fill in all fields.");
    }
    if (username.length < 4) {
      Alert.alert("Error", "Username must be atleast 4 characters long");
    }

    try {
      setIsLoading(true);

      if (!user) {
        throw new Error("User not authorized");
      }

      const { data: existingUser } = await supabase
        .from("profiles")
        .select("id")
        .eq("username", username)
        .neq("id", user.id)
        .single();

      if (existingUser) {
        Alert.alert("Error", "Username is already taken, Choose another!");
        setIsLoading(false);
        return;
      }

      let profileImageUrl: string | undefined;
      if (profileImage) {
        try {
          profileImageUrl = await uploadProfileImage(user.id, profileImage);
        } catch (error) {
          Alert.alert(
            "Warning",
            "Failed to upload profile image. Continuing without image. or try again.",
          );
        }
      }

      await updateUser({
        name,
        username,
        profileImage: profileImageUrl,
        onboardingCompleted: true,
      });

      router.replace("/(tabs)");
    } catch (error) {
      Alert.alert("Error", "Failed onboading, Try again later!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView edges={["bottom", "top"]} style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require("@/assets/images/bereal-icon.png")}
          style={styles.logo}
        />
        <Text style={styles.logoText}>BeReal - Clone</Text>
      </View>

      <TouchableOpacity style={styles.imageContainer} onPress={showImagePicker}>
        {profileImage ? (
          <Image source={{ uri: profileImage }} style={styles.profileImage} />
        ) : (
          <View style={styles.placeholderImage}>
            <Text style={styles.placeholderImageText}>+</Text>
          </View>
        )}

        <View style={styles.editBadge}>
          <Text style={styles.editBadgeText}>Edit</Text>
        </View>
      </TouchableOpacity>

      <Text style={styles.label}>
        Let&apos;s get started, what&apos;s your name?
      </Text>

      <TextInput
        placeholder="Full Name"
        style={styles.inputName}
        value={name}
        onChangeText={setName}
        autoCapitalize="words"
        autoComplete="name"
      />

      <TextInput
        placeholder="Username"
        style={styles.inputName}
        value={username}
        onChangeText={setUsername}
        autoComplete="username"
        autoCapitalize="none"
      />

      <TouchableOpacity
        style={styles.button}
        disabled={isLoading}
        onPress={handleComplete}
      >
        {isLoading ? (
          <ActivityIndicator size={"large"} color={"white"} />
        ) : (
          <Text style={styles.buttonText}>Continue</Text>
        )}
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default OnBoardingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "black",
  },
  header: {
    marginTop: 30,
    gap: 10,
    // flexDirection: "row",
    alignItems: "center",
  },
  logo: {
    width: 60,
    height: 60,
    borderRadius: 12,
  },
  logoText: {
    color: "white",
    fontSize: 30,
    fontWeight: "700",
  },
  profileImage: {
    width: 110,
    height: 110,
    borderRadius: 18,
  },
  imageContainer: {
    // backgroundColor: "yellow",
    // borderColor: "white",
    // borderWidth: 1,
    position: "relative",
    marginBottom: 30,
    marginTop: 25,
  },
  placeholderImage: {
    position: "relative",
    width: 110,
    height: 110,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#8e8e8e",
    borderRadius: 18,
    borderStyle: "dashed",
  },
  placeholderImageText: {
    color: "#8e8e8e",
    fontSize: 50,
  },
  editBadge: {
    position: "absolute",
    bottom: -5,
    right: -5,
    backgroundColor: "white",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 20,
  },
  editBadgeText: {
    fontWeight: "500",
  },
  label: {
    color: "#d2d2d2",
    fontSize: 16,
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  inputName: {
    width: "85%",
    height: 60,
    color: "white",
    fontSize: 25,
    textAlign: "center",
    borderRadius: 70,
    paddingHorizontal: 20,
    marginTop: 5,
    fontWeight: "600",
    borderBottomWidth: 1,
    borderBottomColor: "white",
    marginBottom: 15,
  },
  button: {
    backgroundColor: "white",
    height: 50,
    width: "85%",
    borderRadius: 12,
    justifyContent: "center",
    marginTop: 30,
  },
  buttonText: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: "600",
  },
});
