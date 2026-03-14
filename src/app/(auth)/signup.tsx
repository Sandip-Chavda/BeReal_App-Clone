import { useAuth } from "@/context/AuthContext";
import { Image } from "expo-image";
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

const SignupScreen = () => {
  const router = useRouter();
  const { signUp } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields!");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Password", "Password must be atleast 6 character long!");
      return;
    }

    try {
      setIsLoading(true);
      await signUp(email, password);

      router.push("/(auth)/onboarding");
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Failed to Create Account, Please try again!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView edges={["bottom", "top"]} style={styles.container}>
      <Text style={[styles.headerText]}>Create a</Text>
      <Text style={styles.headerText}>New Account</Text>
      <Text style={styles.headerSubText}>Create an account for free</Text>

      <View style={styles.formContainer}>
        <View>
          <Text style={styles.label}>Email Address</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="sandip@berealapp.com"
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
          />
        </View>

        <View>
          <Text style={styles.label}>Password</Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="●●●●●●●●●●●●●●"
            style={styles.input}
            secureTextEntry
          />
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={handleSignup}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size={"large"} color={"white"} />
          ) : (
            <Text style={styles.buttonText}>Create Account</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            marginTop: -15,
            gap: 5,
          }}
          onPress={() => router.replace("/(auth)/login")}
        >
          <Text style={styles.signupLinkText}>Already have an account?</Text>
          <Text style={styles.signupLinkTextBold}>Login</Text>
        </TouchableOpacity>

        <View style={styles.devider}>
          <View style={styles.horizontalLine} />
          <Text style={styles.deviderText}>Or</Text>
          <View style={styles.horizontalLine} />
        </View>

        <TouchableOpacity style={styles.googleLoginButton} onPress={() => {}}>
          <Image
            source={require("@/assets/icons/GoogleIcon.png")}
            style={styles.googleIcon}
          />
          <Text style={styles.googleLoginButtonText}>Login with Google</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default SignupScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "black",
    paddingHorizontal: 16,
  },
  headerText: {
    fontSize: 32,
    fontWeight: 700,
    letterSpacing: 1,
    fontStyle: "italic",
    color: "white",
  },
  headerSubText: {
    color: "#a0a0a0",
    fontSize: 16,
    letterSpacing: 0.5,
    marginTop: 10,
  },
  formContainer: {
    marginTop: 25,
    width: "100%",
    gap: 25,
  },
  label: { color: "#d2d2d2", marginLeft: 10, marginBottom: 5 },
  input: {
    borderWidth: 1,
    borderColor: "#a0a0a0",
    width: "100%",
    height: 50,
    paddingHorizontal: 16,
    borderRadius: 12,
    color: "white",
  },
  button: {
    backgroundColor: "white",
    height: 50,
    borderRadius: 12,
    justifyContent: "center",
  },
  buttonText: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: "600",
  },
  signupLinkText: {
    color: "#a0a0a0",
    textAlign: "center",
    fontSize: 14,
    letterSpacing: 0.5,
  },
  signupLinkTextBold: {
    fontWeight: "600",
    color: "white",
  },
  devider: {
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    // marginTop: -15,
  },
  horizontalLine: {
    width: 140,
    height: 1,
    backgroundColor: "#5a5a5a",
  },
  deviderText: {
    color: "#a0a0a0",
  },
  googleLoginButton: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "white",
    height: 50,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    gap: 15,
  },
  googleIcon: {
    height: 30,
    width: 30,
  },
  googleLoginButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
});
