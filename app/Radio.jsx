import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
const Radio = ({ setParam }) => {
  const [check, setCheck] = useState(false);
  const [check1, setCheck1] = useState(false);
  return (
    <View style={styles.buttonGroup}>
      <View style={styles.wrapper}>
        <TouchableOpacity
          style={styles.radioCircle}
          onPress={() => {
            setCheck(!check);
            setParam("Mobile");
            setCheck1(false);
          }}
        >
          {check && !check1 ? <View style={styles.radio}></View> : <></>}
        </TouchableOpacity>
        <Text style={styles.text}>Mobile</Text>
      </View>
      <View style={styles.wrapper}>
        <TouchableOpacity
          style={styles.radioCircle}
          onPress={() => {
            setCheck(false);
            setParam("DTH");
            setCheck1(!check1);
          }}
        >
          {check1 && !check ? <View style={styles.radio}></View> : <></>}
        </TouchableOpacity>
        <Text style={styles.text}>DTH</Text>
      </View>
    </View>
  );
};
export default Radio;

const styles = StyleSheet.create({
  radio: {
    width: 22,
    height: 22,
    backgroundColor: "#a7a2ff",
    borderRadius: 15,
  },
  radioCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    borderColor: "#a7a2ff",
  },
  wrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  text: {
    fontSize: 17,
    color: "#433bff",
  },
  buttonGroup: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
    marginTop: 10,
  },
});
