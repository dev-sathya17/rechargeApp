import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Navbar from "./Navbar";
import { FontAwesome } from "@expo/vector-icons";
const Reports = () => {
  const { id, role } = useLocalSearchParams();
  useEffect(() => {
    if (id === undefined) {
      router.back();
    }
  }, []);
  return (
    <View>
      <Navbar />
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            router.push({
              pathname: "/Statement",
              params: {
                id: id,
                role: role,
              },
            });
          }}
        >
          <Text style={styles.text}>Account Statement</Text>
          <FontAwesome name="arrow-right" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            router.push({
              pathname: "/PaymentReports",
              params: { id: id, role: role },
            });
          }}
        >
          <Text style={styles.text}>Payment Reports</Text>
          <FontAwesome name="arrow-right" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            router.push({
              pathname: "/Success",
              params: { id: id, role: role },
            });
          }}
        >
          <Text style={styles.text}>Success Reports</Text>
          <FontAwesome name="arrow-right" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            router.push({
              pathname: "/Suspense",
              params: { id: id, role: role },
            });
          }}
        >
          <Text style={styles.text}>Suspense Reports</Text>
          <FontAwesome name="arrow-right" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            router.push({
              pathname: "/Failure",
              params: { id: id, role: role },
            });
          }}
        >
          <Text style={styles.text}>Failure Reports</Text>
          <FontAwesome name="arrow-right" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Reports;

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#a7a2ff",
    width: "90%",
    height: 100,
    marginVertical: 10,
    borderRadius: 25,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    elevation: 15,
  },
  text: {
    color: "white",
    fontSize: 18,
    textTransform: "uppercase",
    // fontWeight: "bold",
    letterSpacing: 2,
    elevation: 15,
  },
  container: {
    width: "100%",
    height: "90%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: "green",
    // marginTop: "10%",
    backgroundColor: "#e4e3fc",
  },
});
