import axios from "axios";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { url } from "../env";
import DropdownComponent from "./DropDownComponent";

const MyModal = ({
  day,
  month,
  year,
  till_day,
  till_month,
  till_year,
  setDay,
  setMonth,
  setYear,
  settill_Day,
  settill_Month,
  settill_Year,
  reciever,
  setReciever,
  role,
}) => {
  const [message, setMessage] = useState("");
  const [distributors, setDistributors] = useState([]);

  useEffect(() => {
    if (role === "Admin") {
      axios
        .post(url + "mobilerecharge/viewinitiators")
        .then((response) => {
          let arr = [];
          for (let r of response.data.retailers) {
            var obj = {};
            obj["label"] = r[5] + "-" + r[1];
            obj["value"] = r[0];
            arr.push(obj);
            var ob = {};
            ob["id"] = r[0];
          }

          for (let r of response.data.distributors) {
            var obj = {};
            obj["label"] = r[5] + "-" + r[1];
            obj["value"] = r[0];
            arr.push(obj);
            var ob = {};
            ob["id"] = r[0];
          }

          setDistributors(arr);
        })
        .catch((error) => {
          console.log(error.message);
        });
    }
  }, []);

  return (
    <View style={styles.wrapper}>
      <View style={styles.from_and_to_container}>
        <Text style={styles.filterText}>From:</Text>
        <View style={styles.filterContainer}>
          <View style={styles.box}>
            <TextInput
              style={styles.inputField}
              placeholder="DD"
              value={day}
              onChangeText={(e) => {
                setDay(e);
                if (parseInt(e) < 1 || parseInt(e) > 31) {
                  setMessage("Please enter a date value within 1 and 31.");
                } else if (e === "") {
                  setMessage("Date must not be empty");
                } else {
                  setMessage("");
                }
              }}
              keyboardType="numeric"
            />
          </View>
          <View style={styles.box}>
            <TextInput
              style={styles.inputField}
              placeholder="MM"
              value={month}
              onChangeText={(e) => {
                setMonth(e);
                if (parseInt(e) < 1 || parseInt(e) > 12) {
                  setMessage("Please enter a Month value between 1 and 12.");
                } else if (e === "") {
                  setMessage("Month must not be empty");
                } else {
                  setMessage("");
                }
              }}
              keyboardType="numeric"
            />
          </View>
          <View style={[styles.box, styles.yearBox]}>
            <TextInput
              style={styles.inputField}
              placeholder="YYYY"
              value={year}
              onChangeText={(e) => {
                setYear(e);
                if (parseInt(e) < 2000) {
                  setMessage("Please enter a year value greater than 2000.");
                } else if (e === "") {
                  setMessage("Year must not be empty");
                } else {
                  setMessage("");
                }
              }}
              keyboardType="numeric"
            />
          </View>
        </View>
      </View>
      <View style={styles.from_and_to_container}>
        <Text style={styles.filterText}>To:</Text>
        <View style={[styles.filterContainer, styles.toContainer]}>
          <View style={styles.box}>
            <TextInput
              style={styles.inputField}
              placeholder="DD"
              value={till_day}
              onChangeText={(e) => {
                settill_Day(e);
                if (parseInt(e) < 1 || parseInt(e) > 31) {
                  setMessage("Please enter a date value within 1 and 31.");
                } else if (e === "") {
                  setMessage("Date must not be empty");
                } else {
                  setMessage("");
                }
              }}
              keyboardType="numeric"
            />
          </View>
          <View style={styles.box}>
            <TextInput
              style={styles.inputField}
              placeholder="MM"
              value={till_month}
              onChangeText={(e) => {
                settill_Month(e);
                if (parseInt(e) < 1 || parseInt(e) > 12) {
                  setMessage("Please enter a Month value between 1 and 12.");
                } else if (e === "") {
                  setMessage("Month must not be empty");
                } else {
                  setMessage("");
                }
              }}
              keyboardType="numeric"
            />
          </View>

          <View style={[styles.box, styles.yearBox]}>
            <TextInput
              style={styles.inputField}
              placeholder="YYYY"
              value={till_year}
              onChangeText={(e) => {
                settill_Year(e);
                if (parseInt(e) < 2000) {
                  setMessage("Please enter a year value greater than 2000.");
                } else if (e === "") {
                  setMessage("Year must not be empty");
                } else {
                  setMessage("");
                }
              }}
              keyboardType="numeric"
            />
          </View>
        </View>
      </View>
      {message === "" ? <></> : <Text style={styles.message}>{message}</Text>}
      {role === "Admin" ? (
        <View style={styles.filterContainer}>
          <Text style={styles.filterText}>USER:</Text>
          <View style={styles.dropdown}>
            <DropdownComponent
              data={distributors}
              param={reciever}
              setParam={setReciever}
            />
          </View>
        </View>
      ) : (
        <></>
      )}
    </View>
  );
};

export default MyModal;

const styles = StyleSheet.create({
  box: {
    borderWidth: 2,
    borderColor: "black",
    borderRadius: 15,
    width: 50,
    height: 40,
    // padding: 5,
  },
  dropdown: {
    width: "85%",
    alignSelf: "center",
  },
  yearBox: {
    width: 70,
  },
  filterContainer: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
    marginTop: 10,
    marginLeft: 10,
  },
  message: {
    color: "red",
    alignSelf: "center",
    fontSize: 17,
    // marginTop: 5,
  },
  inputField: {
    backgroundColor: "white",
    height: "100%",
    borderRadius: 15,
    width: "100%",
    paddingLeft: 10,
    fontSize: 20,
    alignItems: "center",
  },
  wrapper: {
    marginTop: 15,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    width: "90%",
    alignItems: "center",
    elevation: 5,
    alignSelf: "center",
    marginBottom: 15,
  },
  from_and_to_container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    gap: 10,
  },
  filterText: {
    fontSize: 20,
    textTransform: "uppercase",
    fontWeight: "bold",
    marginTop: 5,
  },
  toContainer: {
    marginLeft: 38,
  },
});
