import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from "@react-navigation/native";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { Octicons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import Radio from "./Radio";
import axios from "axios";
import { url } from "../env";
const Dashboard = () => {
  const [id, setId] = useState("");
  const [role, setRole] = useState("");
  const [name, setName] = useState("");
  const [balance, setBalance] = useState("");
  const focus = useIsFocused();
  const getCredentials = async () => {
    let id = await AsyncStorage.getItem("userID");
    let r = await AsyncStorage.getItem("role");
    let name = await AsyncStorage.getItem("name");
    setId(id);
    setRole(r);
    setName(name);
  };
  useEffect(() => {
    getCredentials();
    if (id === undefined) {
      getCredentials();
    }
    axios
      .post(url + "mobilerecharge/getBalance", {
        ID: id,
      })
      .then((response) => {
        setBalance(response.data[0]);
      })
      .catch((error) => {
        console.log(error.message);
      });
  }, [focus, id]);
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
    <View style={{ backgroundColor: "#e4e3fc" }}>
      <View style={styles.userDetails}>
        <View style={styles.bar}>
          <Text style={styles.text}>Customer Care Support: 9629738884</Text>
        </View>
        <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
          <MaterialIcons name="logout" size={24} color="white" />
          <Text style={styles.logoutTxt}>Logout</Text>
        </TouchableOpacity>
        <View style={{ marginTop: "10%" }}>
          <View style={styles.curBal}>
            <Text style={styles.curBalText}>Welcome, </Text>
            <Text style={styles.curBalValue}>{name}</Text>
            <Text style={styles.curBalText}> [ </Text>
            <Text style={styles.curBalValue}>{role}</Text>
            <Text style={styles.curBalText}> ] </Text>
          </View>
          <View style={styles.curBal}>
            <Text style={styles.curBalText}>Current Balance: </Text>
            <Text style={styles.curBalValue}>{balance}</Text>
          </View>
        </View>
      </View>
      <View style={styles.container}>
        <View style={styles.card}>
          <View style={styles.title}>
            <Text style={styles.titleText}>Recharge</Text>
          </View>
          <View>
            <TouchableOpacity
              style={styles.icon}
              onPress={() => {
                router.push({
                  pathname: "/Recharge",
                  params: { id: id, role: role },
                });
              }}
            >
              <Image
                source={require("../assets/recharge.png")}
                style={styles.image}
              />
            </TouchableOpacity>
          </View>
        </View>
        {role !== "Retailer" ? (
          <View style={styles.card}>
            <View style={styles.title}>
              <Text style={styles.titleText}>Transfer</Text>
            </View>
            <View>
              <TouchableOpacity
                style={styles.icon}
                onPress={() => {
                  router.push({
                    pathname: "/Transfer",
                    params: { id: id, role: role },
                  });
                }}
              >
                <FontAwesome5 name="exchange-alt" size={35} color="#433bff" />
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <></>
        )}
        <View style={styles.card}>
          <View style={styles.title}>
            <Text style={styles.titleText}>Reports</Text>
          </View>
          <View>
            <TouchableOpacity
              style={styles.icon}
              onPress={() => {
                router.push({
                  pathname: "/Reports",
                  params: { id: id, role: role },
                });
              }}
            >
              <Octicons name="graph" size={35} color="#433bff" />
            </TouchableOpacity>
          </View>
        </View>

        {role === "Admin" ? (
          <View style={styles.card}>
            <View style={styles.title}>
              <Text style={styles.titleText}>Users</Text>
            </View>
            <View>
              <TouchableOpacity
                style={styles.icon}
                onPress={() => {
                  router.push("/Users");
                }}
              >
                <Feather name="user" size={40} color="#433bff" />
              </TouchableOpacity>
            </View>
          </View>
        ) : role === "Distributor" ? (
          <View style={styles.card}>
            <View style={styles.title}>
              <Text style={styles.titleText}>Retailers</Text>
            </View>
            <View>
              <TouchableOpacity
                style={styles.icon}
                onPress={() => {
                  router.push({
                    pathname: "/Retailers",
                    params: { id: id },
                  });
                }}
              >
                <FontAwesome name="users" size={35} color="#433bff" />
              </TouchableOpacity>
            </View>
          </View>
        ) : role === "Retailer" ? (
          <View style={styles.card}>
            <View style={styles.title}>
              <Text style={styles.titleText}>Profile</Text>
            </View>
            <View>
              <TouchableOpacity
                style={styles.icon}
                onPress={() => {
                  router.push({
                    pathname: "/Profile",
                    params: { id: id },
                  });
                }}
              >
                <FontAwesome name="user" size={40} color="#433bff" />
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <></>
        )}
      </View>
    </View>
  );
};

export default Dashboard;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#e4e3fc",
    height: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 20,
    justifyContent: "center",
    paddingTop: "10%",
  },
  card: {
    width: 150,
    height: 200,
    backgroundColor: "#a7a2ff",
    borderRadius: 20,

    justifyContent: "center",
    shadowColor: "#000",
    elevation: 10,
  },
  title: {
    alignSelf: "center",
    borderBottomColor: "white",
    borderBottomWidth: 2,
    padding: 2,
    width: 105,
    borderRadius: 15,
  },
  titleText: {
    textAlign: "center",
    fontSize: 16,
    textTransform: "uppercase",
    fontWeight: "bold",
    color: "#fff",
  },
  icon: {
    width: 80,
    backgroundColor: "#e4e3fc",
    height: 80,
    alignSelf: "center",
    marginTop: 20,
    borderRadius: 40,
    // borderWidth: 1,
    borderColor: "black",
    alignItems: "center",
    justifyContent: "center",
  },
  btn: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
    backgroundColor: "#e4e3fc",
    width: 60,
    height: 35,
    alignSelf: "center",
    borderRadius: 5,
    gap: 2,
    shadowColor: "#433bff",
    elevation: 5,
  },
  btnText: {
    fontSize: 19,
    color: "black",
  },
  image: {
    height: 60,
    width: 60,
  },
  logoutBtn: {
    backgroundColor: "#433bff",
    marginTop: 20,
    height: 40,
    width: 100,
    borderRadius: 10,
    left: 240,
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    paddingHorizontal: 7,
    elevation: 10,
  },
  logoutTxt: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "bold",
    elevation: 10,
  },
  text: {
    color: "#e4e3fc",
    fontSize: 18,
    fontWeight: "bold",
  },
  curBal: {
    marginTop: 10,
    alignItems: "center",
    flexDirection: "row",
    marginLeft: 25,
  },
  curBalText: {
    fontSize: 20,
  },
  curBalValue: {
    fontSize: 20,
    fontWeight: "bold",
    textDecorationLine: "underline",
    color: "#433bff",
  },
  userDetails: {
    marginTop: "5%",
  },
  bar: {
    backgroundColor: "#433bff",
    height: 35,
    marginTop: "9%",
    alignItems: "center",
    justifyContent: "center",
  },
});
