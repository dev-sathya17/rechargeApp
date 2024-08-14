import axios from "axios";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import { url } from "../env";
import { useIsFocused } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { Fontisto } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { Octicons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Navbar from "./Navbar";
const Profile = () => {
  const { id } = useLocalSearchParams();
  const [data, setData] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const focus = useIsFocused();
  useEffect(() => {
    setLoading(true);
    if (id === undefined) {
      router.back();
    }
    axios
      .post(url + "mobilerecharge/profile", { id: id })
      .then((response) => {
        setData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, [focus]);
  return (
    <View>
      {loading ? (
        <ActivityIndicator
          size="large"
          color="#0000ff"
          style={styles.loadingIndicator}
        />
      ) : (
        <View style={styles.wrapper}>
          <Navbar />
          <View style={styles.container}>
            <View style={styles.header}>
              <View style={styles.circle}>
                <Image
                  source={require("../assets/user_logo.png")}
                  style={styles.circle}
                />
              </View>
              <View>
                <View>
                  <Text style={styles.nameText}>{data[0]?.[1]}</Text>
                </View>
                <View>
                  <View style={styles.reportingTo}>
                    <Text style={styles.text}>Sub-account of: </Text>
                    <Text style={styles.nameText}>{data[0]?.[10]}</Text>
                  </View>
                </View>
              </View>
            </View>
            <View>
              <View style={styles.data_cells}>
                <Feather name="phone-call" size={24} color="black" />
                <Text style={styles.text}>{data[0]?.[5]}</Text>
                <View></View>
              </View>
              <View style={styles.data_cells}>
                <MaterialIcons name="attach-money" size={24} color="black" />
                <Text style={styles.text}>{data[0]?.[6]}</Text>
                <View></View>
              </View>
              <View style={styles.data_cells}>
                <Fontisto name="email" size={24} color="black" />
                <Text style={styles.text}>{data[0]?.[8]}</Text>
                <View></View>
              </View>
              <View style={styles.data_cells}>
                <Ionicons name="location-sharp" size={24} color="black" />
                <Text style={styles.text}>{data[0]?.[7]}</Text>
                <View></View>
              </View>
              <View style={styles.data_cells}>
                <Feather name="lock" size={24} color="black" />
                <Text style={styles.text}>
                  {showPassword ? data[0]?.[4] : "****"}
                </Text>
                <View style={styles.passwordEye}>
                  {showPassword ? (
                    <TouchableOpacity
                      onPress={() => {
                        setShowPassword(false);
                      }}
                    >
                      <MaterialCommunityIcons
                        name="eye"
                        size={24}
                        color="black"
                      />
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      onPress={() => {
                        setShowPassword(true);
                      }}
                    >
                      <Octicons name="eye-closed" size={24} color="black" />
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  header: {
    marginTop: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    borderRadius: 15,
    height: 150,
    marginHorizontal: 5,
    width: 320,
    backgroundColor: "#fff",
    elevation: 10,
    marginBottom: 15,
  },
  loadingIndicator: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: "100%",
    transform: [{ scaleX: 2 }, { scaleY: 2 }],
  },
  circle: {
    width: 100,
    backgroundColor: "blue",
    height: 100,
    borderRadius: 75,
  },
  reportingTo: {
    // flexDirection: "row",
  },
  data_cells: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: 300,
    margin: 15,
    gap: 20,
    padding: 8,
    borderRadius: 10,
    backgroundColor: "#fff",
    elevation: 10,
  },
  passwordEye: {
    alignContent: "flex-end",
  },
  container: {
    alignItems: "center",
    width: "100%",
    height: "100%",
    padding: 50,
  },
  text: {
    fontSize: 17,
  },
  nameText: {
    fontWeight: "bold",
    fontSize: 17,
    textTransform: "uppercase",
  },
  wrapper: {
    backgroundColor: "#e4e3fc",
    height: "100%",
  },
});
