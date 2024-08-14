import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { url } from "../env";
import { useIsFocused } from "@react-navigation/native";
import DropdownComponent from "./DropDownComponent";
import { router, useLocalSearchParams } from "expo-router";
import { FontAwesome5 } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import Navbar from "./Navbar";
import TransferRadio from "./TransferRadio";
const Transfer = () => {
  const [distributors, setDistributors] = useState([]);
  const [amount, setAmount] = useState(0);
  const [reciever, setReciever] = useState("");
  const [userBalances, setUserBalances] = useState([]);
  const [balance, setBalance] = useState("");
  const [rerender, setRerender] = useState(0);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState("Transfer");
  const focus = useIsFocused();
  const { id, role } = useLocalSearchParams();
  useEffect(() => {
    if (id === undefined) {
      router.back();
    }
    setLoading(true);
    axios
      .post(url + "mobilerecharge/viewinitiators")
      .then((response) => {
        let arr = [];
        let bal = [];
        for (let r of response.data.retailers) {
          var obj = {};
          obj["label"] = r[5] + "-" + r[1];
          obj["value"] = r[0];
          arr.push(obj);
          var ob = {};
          ob["id"] = r[0];
          ob["bal"] = r[6];
          bal.push(ob);
        }
        if (role === "Admin") {
          for (let r of response.data.distributors) {
            var obj = {};
            obj["label"] = r[5] + "-" + r[1];
            obj["value"] = r[0];
            arr.push(obj);
            var ob = {};
            ob["id"] = r[0];
            ob["bal"] = r[6];
            bal.push(ob);
          }
        }
        setUserBalances(bal);
        setDistributors(arr);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        console.log(error.message);
      });

    axios
      .post(url + "mobilerecharge/getBalance", {
        ID: id,
      })
      .then((response) => {
        setLoading(false);
        setBalance(response.data[0]);
      })
      .catch((error) => {
        setLoading(false);
        console.log(error.message);
      });
  }, [rerender, focus]);

  const transfer = () => {
    setLoading(true);
    var recieverBalance = 0;
    for (let i of userBalances) {
      if (i.id === reciever) {
        recieverBalance = i.bal;
      }
    }
    if (type === "Pull") {
      if (parseInt(recieverBalance) < parseInt(amount)) {
        alert("There is not enough balance with the person!");
        return;
      }
    }
    if (parseInt(amount) <= 0) {
      alert("Choose a valid value for Amount to be transferred");
      return;
    }
    if (parseInt(balance) < parseInt(amount)) {
      alert("There is not enough balance with you!");
      return;
    }
    if (type === "Pull") {
      axios
        .post(url + "mobilerecharge/inserttransactions", {
          AMOUNT: amount,
          RECIEVER_ID: id,
          SENDER_ID: reciever,
          PREVIOUS_BALANCE: balance[0],
        })
        .then((response) => {
          if (response.data === "Success") {
            Alert.alert("Success", "Amount transferred successfully");
            setAmount("");
            setReciever("");
            setRerender(rerender + 1);
            setLoading(false);
          }
        })
        .catch((err) => {
          alert(err.message);
          setLoading(false);
        });
    } else if (type === "Transfer") {
      axios
        .post(url + "mobilerecharge/inserttransactions", {
          AMOUNT: amount,
          RECIEVER_ID: reciever,
          SENDER_ID: id,
          PREVIOUS_BALANCE: recieverBalance,
        })
        .then((response) => {
          if (response.data === "Success") {
            Alert.alert("Success", "Amount transferred successfully");
            setAmount("");
            setReciever("");
            setRerender(rerender + 1);
            setLoading(false);
          } else {
            Alert.alert("Error", "Some error occurred");
          }
        })
        .catch((err) => {
          alert(err.message);
          setLoading(false);
        });
    }
  };
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
            <View style={styles.curBal}>
              <Text style={styles.curBalText}>Current Balance: </Text>
              <Text style={styles.curBalValue}>{balance}</Text>
            </View>
            <TransferRadio setParam={setType} />
            <View style={styles.recipient}>
              <AntDesign name="user" size={40} color="#433bff" />
              <View style={styles.dropdown}>
                <DropdownComponent
                  data={distributors}
                  param={reciever}
                  setParam={setReciever}
                />
              </View>
            </View>
            {reciever === "" ? (
              <View style={styles.messageContainer}>
                <MaterialIcons name="error-outline" size={30} color="red" />
                <Text style={styles.message}>Choose a Recipient</Text>
              </View>
            ) : (
              <></>
            )}
            {reciever &&
              userBalances.map((user, index) => {
                return (
                  <View key={index} style={styles.curBal}>
                    {reciever === user.id ? (
                      <>
                        <Text key={index} style={styles.curBalText}>
                          Current Recipient Balance: {user.bal}
                        </Text>
                      </>
                    ) : (
                      <></>
                    )}
                  </View>
                );
              })}
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "row",
              }}
            >
              <FontAwesome5 name="rupee-sign" size={30} color="#433bff" />
              <TextInput
                placeholder="Enter Amount:"
                style={styles.input}
                value={amount}
                keyboardType="number-pad"
                onChangeText={(e) => {
                  setAmount(e);
                  if (parseInt(e) > parseInt(balance)) {
                    setMessage("Amount is greater than your balance.");
                  } else if (parseInt(e) <= 0) {
                    setMessage("Amount is negative or Zero.");
                  } else {
                    setMessage("");
                  }
                }}
              />
            </View>
            {message === "" ? (
              <></>
            ) : (
              <View style={styles.messageContainer}>
                <MaterialIcons name="error-outline" size={30} color="red" />
                <Text style={styles.message}>{message}</Text>
              </View>
            )}
            <TouchableOpacity style={styles.button} onPress={transfer}>
              <Text style={styles.textColor}>{type}</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

export default Transfer;

const styles = StyleSheet.create({
  loadingIndicator: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: "100%",
    transform: [{ scaleX: 2 }, { scaleY: 2 }],
  },

  input: {
    backgroundColor: "#e4e3fc",
    width: 250,
    elevation: 10,
    borderColor: "#433bff",
    borderWidth: 1,
    marginLeft: "5%",
    // marginVertical: 15,
    borderRadius: 15,
    paddingLeft: 10,
    height: 50,
    borderBottomColor: "#433bff",
    borderBottomWidth: 4,
    color: "#433bff",
    fontSize: 17,
  },
  button: {
    backgroundColor: "blue",
    width: 120,
    height: 40,
    borderRadius: 8,
    marginLeft: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginTop: 10,
  },
  textColor: {
    color: "white",
    fontSize: 17,
  },
  flexBox: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  container: {
    backgroundColor: "white",
    height: 500,
    width: "90%",
    alignSelf: "center",
    marginTop: "20%",
    justifyContent: "center",
    borderRadius: 15,
    elevation: 15,
    gap: 15,
  },
  message: {
    color: "red",
    margin: 10,
    alignSelf: "center",
    fontSize: 17,
  },
  messageContainer: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffdada",
    flexDirection: "row",
  },
  curBal: {
    alignSelf: "center",
    // marginTop: 15,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
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
  wrapper: {
    backgroundColor: "#e4e3fc",
    height: "100%",
  },
  dropdown: {
    width: "75%",
    alignSelf: "center",
  },
  recipient: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    marginTop: 15,
    gap: 10,
  },
});
