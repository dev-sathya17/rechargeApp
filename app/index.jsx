import axios from "axios";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { url } from "../env";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Feather } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
const index = () => {
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");

  const checkSession = async () => {
    const token = await AsyncStorage.getItem("role");
    if (token !== null) {
      router.replace("/Home");
    }
  };

  useEffect(() => {
    try {
      checkSession();
    } catch (error) {
      console.log(error);
    }
  }, []);

  const setSession = async (role, id, name) => {
    console.log(role, id, name);
    await AsyncStorage.setItem("role", role);
    await AsyncStorage.setItem("userID", id + "");
    await AsyncStorage.setItem("name", name);
  };

  const login = () => {
    if (mobile === "" || password === "") {
      Alert.alert("Error", "Mobile or Password is required");
      return;
    }
    axios
      .post(url + "mobilerecharge/login", {
        MOBILE: mobile,
        PASSWORD: password,
      })
      .then((response) => {
        console.log(response.data);
        if (response.data.message === "success") {
          setMobile("");
          setPassword("");
          setSession(response.data.role, response.data.id, response.data.name);
          // Alert.alert("Success", "Logged in successfully");
          router.push("/Home");
        }
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  return (
    <View style={{ flex: 1, height: "100%" }}>
      <ImageBackground
        source={require("./../assets/bg.jpg")}
        style={{ height: "100%" }}
      >
        <View>
          <View styles={styles.top}>
            <View>
              <Image
                source={require("./../assets/logo.png")}
                style={styles.logo}
              />
            </View>
            <View
              style={{
                alignItems: "center",
                flexDirection: "row",
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  color: "#e3e4fc",
                  textAlign: "center",
                  marginTop: 20,
                  fontSize: 21,
                }}
              >
                Recharge, Now made{" "}
              </Text>
              <Text
                style={{
                  color: "#e3e4fc",
                  textAlign: "center",
                  marginTop: 20,
                  fontSize: 23,
                  fontStyle: "italic",
                  textDecorationLine: "underline",
                }}
              >
                Easy!
              </Text>
            </View>
          </View>
          <View style={styles.bottom}>
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "row",
                borderRadius: 15,
                alignSelf: "center",
              }}
            >
              <Feather name="phone-call" size={30} color="#a7a2ff" />
              <TextInput
                placeholder="Mobile:"
                // placeholderTextColor="#e3e4fc"
                onChangeText={setMobile}
                value={mobile}
                keyboardType="number-pad"
                style={styles.input}
              />
            </View>
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "row",
                borderRadius: 15,
                alignSelf: "center",
              }}
            >
              <Feather name="lock" size={30} color="#a7a2ff" />
              <TextInput
                placeholder="Password:"
                // placeholderTextColor="#e3e4fc"
                onChangeText={setPassword}
                value={password}
                secureTextEntry={true}
                style={styles.input}
              />
            </View>
            <TouchableOpacity onPress={login} style={styles.button}>
              <Text style={styles.textColor}>LOGIN</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};

export default index;

const styles = StyleSheet.create({
  input: {
    width: "80%",
    // borderColor: "black",
    // borderWidth: 1,
    marginLeft: "5%",
    marginVertical: 15,
    borderRadius: 15,
    paddingLeft: 10,
    height: 50,
    fontSize: 19,
    backgroundColor: "#a7a2ff",
    elevation: 15,
    color: "black",
    fontWeight: "bold",
  },
  top: {
    // height: "50%",
    // backgroundColor: "red",
    // marginTop: "50%",
  },
  button: {
    backgroundColor: "#a7a2ff",
    width: "60%",
    height: 45,
    borderRadius: 25,
    display: "flex",
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    elevation: 15,
  },
  textColor: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  dropdown: {
    marginLeft: "20%",
    marginBottom: 20,
  },
  bottom: {
    height: "50%",
    // backgroundColor: "blue",
    marginTop: "20%",
    alignItems: "",
  },
  logo: {
    height: 200,
    width: 200,
    marginLeft: 75,
    marginTop: 100,
    borderRadius: 200,
  },
});
