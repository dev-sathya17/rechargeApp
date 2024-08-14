import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
const Navbar = () => {
  const logout = () => {
    Alert.alert("Confirm", "Are you sure you want to logout?", [
      { text: "OK", onPress: () => loggingOut() },
      {
        text: "Cancel",
        onPress: () => {
          return;
        },
      },
    ]);
  };
  const loggingOut = async () => {
    await AsyncStorage.removeItem("role");
    await AsyncStorage.removeItem("userID");
    await AsyncStorage.removeItem("name");
    router.replace("/");
  };
  return (
    <View style={styles.header}>
      <TouchableOpacity
        onPress={() => {
          router.back();
        }}
      >
        <AntDesign name="arrowleft" size={30} color="black" />
      </TouchableOpacity>
      <TouchableOpacity onPress={logout}>
        <MaterialIcons name="logout" size={30} color="red" />
      </TouchableOpacity>
    </View>
  );
};

export default Navbar;

const styles = StyleSheet.create({
  header: {
    paddingTop: 50,
    paddingLeft: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingRight: 15,
    backgroundColor: "#e4e3fc",
  },
});
