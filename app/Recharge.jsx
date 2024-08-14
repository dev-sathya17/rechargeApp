import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Button,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  View,
} from "react-native";
import { url } from "../env";
import DropdownComponent from "./DropDownComponent";
import { useIsFocused } from "@react-navigation/native";
import RadioButtonRN from "radio-buttons-react-native";
import Radio from "./Radio";
import { router, useLocalSearchParams } from "expo-router";
import Navbar from "./Navbar";
import { Feather } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { FontAwesome6 } from "@expo/vector-icons";
const Recharge = () => {
  const [type, setType] = useState("Mobile");
  const [mobile, setMobile] = useState("");
  const [amount, setAmount] = useState(0);
  const [network, setNetwork] = useState(null);
  const [plan, setPlan] = useState("");
  const [detail, setDetail] = useState("");
  const [balance, setBalance] = useState("");
  const [rerender, setRerender] = useState(0);
  const [mobileMessage, setMobileMessage] = useState("");
  const [message, setMessage] = useState("");
  const focus = useIsFocused();
  const { id, role } = useLocalSearchParams();
  const [loading, setLoading] = useState(false);

  const types = [
    {
      label: "Mobile",
    },
    {
      label: "DTH",
    },
  ];

  const networks = [
    { label: "Airtel", value: 2 },
    { label: "Jio", value: 5 },
    { label: "Vodafone", value: 1 },
    { label: "BSNL", value: 4 },
  ];

  const providers = [
    { label: "Sun Direct", value: 12 },
    { label: "Airtel Mitra DTH", value: 24 },
    { label: "Tata Play", value: 7 },
    { label: "VideoconApp", value: 11 },
    { label: "Dish TV", value: 6 },
  ];

  useEffect(() => {
    setLoading(true);
    if (id === undefined) {
      router.back();
    }
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

  const makeRecharge = () => {
    if (message === "" && mobileMessage === "") {
      setLoading(true);
      var userid = "5000552";
      var password = "Feb@2023";
      var authno = "9629738884";

      if (network === "Airtel Digital TV") {
        var reqcommand = `RG${mobile}A${amount}`;
      } else {
        var reqcommand = `R${network[0]}${mobile}A${amount}`;
      }

      const currentDateTime = new Date();

      const year = currentDateTime.getFullYear();
      const month = String(currentDateTime.getMonth() + 1).padStart(2, "0"); // Months are 0-based
      const day = String(currentDateTime.getDate()).padStart(2, "0");
      const hour = String(currentDateTime.getHours()).padStart(2, "0");
      const minute = String(currentDateTime.getMinutes()).padStart(2, "0");
      const second = String(currentDateTime.getSeconds()).padStart(2, "0");
      const millisecond = String(currentDateTime.getMilliseconds()).padStart(
        3,
        "0"
      );
      const sourceref = `${year}${day}${hour}${minute}${second}${millisecond}`;
      // console.log(sourceref);

      const formatter2 = new Intl.DateTimeFormat("en-US", {
        month: "2-digit",
        day: "2-digit",
        year: "2-digit",
      });
      var y = String(year).substring(2);
      const reqdate = `${day}/${month}/${y}`;
      // console.log(reqdate);
      const reqtime = `${hour}:${minute}:${second}`;
      var urllink = `http://202.170.204.109:92/MARSExinRequest?userid=${userid}&password=${password}&authno=${authno}&reqcommand=${reqcommand}&sourceref=${sourceref}&reqdate=${reqdate}&reqtime=${reqtime}`;
      // console.log(urllink);
      // if (network === "Tata Play") {
      //   // const data = {
      //   //   api_token: api_token,
      //   //   mobile_no: mobile + "",
      //   //   amount: amount + "",
      //   //   order_id: sourceref + "",
      //   //   is_stv: false,
      //   //   company_id: 7,
      //   // };
      //   axios
      //     .post(`https://mrobotics.in/api/recharge`, data)
      //     .then((response) => {
      //       setLoading(false);
      //       console.log(response.data);
      //       if (response.data.status === "success") {
      //         axios
      //           .post(url + "mobilerecharge/insertrechargehistory", {
      //             INITIATOR_ID: id,
      //             CUSTOMER_MOBILE: mobile,
      //             TYPE: type,
      //             AMOUNT: amount,
      //             PLAN: plan,
      //             detail: detail,
      //             ROLE: role,
      //             NETWORK: network,
      //             BALANCE: balance[0],
      //             URL: urllink,
      //             SOURCEREF: sourceref,
      //             TRANSACTION_ID: response.data.tnx_id,
      //             STATUS:
      //               response.data.status[0].toUpperCase() +
      //               "" +
      //               response.data.status.slice(1),
      //           })
      //           .then((response) => {
      //             if (response.data === "Success") {
      //               Alert.alert("Success", "Your recharge has been Initiated.");
      //               setAmount(0);
      //               setMobile("");
      //               setType("");
      //               setNetwork("");
      //               setPlan("");
      //               setDetail("");
      //               setLoading(false);
      //               setRerender(rerender + 1);
      //             }
      //           })
      //           .catch((err) => {
      //             console.log(err.message);
      //             setLoading(false);
      //           });
      //       }
      //     })
      //     .catch((err) => {
      //       setLoading(false);
      //       console.log(err);
      //     });
      // }
      //  else {
      axios
        .post(url + "mobilerecharge/insertrechargehistory", {
          INITIATOR_ID: id,
          CUSTOMER_MOBILE: mobile,
          TYPE: type,
          AMOUNT: amount,
          PLAN: plan,
          detail: detail,
          // ROLE: role,
          NETWORK: network,
          BALANCE: balance[0],
          URL: urllink,
          SOURCEREF: sourceref,
        })
        .then((response) => {
          if (response.data === "Success") {
            Alert.alert("Success", "Your recharge has been Initiated.");
            setAmount(0);
            setMobile("");
            setType("");
            setNetwork("");
            setPlan("");
            setDetail("");
            setRerender(rerender + 1);
          }
          if (response.data === "Failure") {
            Alert.alert("Failure", "Your transaction has failed.");
            setAmount(0);
            setMobile("");
            setType("");
            setNetwork("");
            setPlan("");
            setDetail("");
            setRerender(rerender + 1);
          }
          setLoading(false);
        })
        .catch((err) => {
          console.log(err.message);
          setLoading(false);
        });
    }
    // }
    else {
      console.log("else block");
      setLoading(false);
      return;
    }
  };

  return (
    <View>
      {loading ? (
        <ActivityIndicator
          size="100"
          color="#0000ff"
          style={styles.loadingIndicator}
        />
      ) : (
        <View style={styles.wrapper}>
          <Navbar />
          <View style={styles.form}>
            <Text style={styles.title}>Recharge</Text>
            <View style={styles.curBal}>
              <Text style={styles.curBalText}>Current Balance: </Text>
              <Text style={styles.curBalValue}>{balance}</Text>
            </View>
            <Radio setParam={setType} />
            <View>
              {type === "Mobile" ? (
                <View>
                  <View style={styles.field}>
                    <Entypo
                      name="old-mobile"
                      size={30}
                      color="#433bff"
                      style={{ left: -5 }}
                    />
                    <TextInput
                      placeholder="Mobile Number:"
                      placeholderTextColor="#433bff"
                      style={styles.input}
                      keyboardType="number-pad"
                      onChangeText={(e) => {
                        setMobile(e);
                        // console.log(e, e.length, mobile);
                        if (e.length !== 10 && e.length > 0) {
                          setMobileMessage("Mobile number must be 10 digits");
                        } else {
                          setMobileMessage("");
                        }
                      }}
                    />
                  </View>
                  {mobileMessage === "" ? (
                    <></>
                  ) : (
                    <View style={styles.messageContainer}>
                      <MaterialIcons
                        name="error-outline"
                        size={30}
                        color="red"
                      />
                      <Text style={styles.message}>{mobileMessage}</Text>
                    </View>
                  )}
                  <View style={styles.field}>
                    <MaterialIcons
                      name="sim-card"
                      size={35}
                      color="#433bff"
                      style={{ left: -5 }}
                    />
                    <View style={{ width: 250, marginLeft: 10 }}>
                      <DropdownComponent
                        data={networks}
                        param={network}
                        setParam={setNetwork}
                      />
                    </View>
                  </View>
                  {network === "" && type === "Mobile" ? (
                    <View style={styles.messageContainer}>
                      <MaterialIcons
                        name="error-outline"
                        size={30}
                        color="red"
                      />
                      <Text style={styles.message}>
                        {"Please Choose a network to Proceed."}
                      </Text>
                    </View>
                  ) : (
                    <></>
                  )}
                </View>
              ) : type === "DTH" ? (
                <View>
                  <View style={styles.field}>
                    <FontAwesome5
                      name="satellite-dish"
                      size={30}
                      color="#433bff"
                    />
                    <TextInput
                      placeholder="Customer ID:"
                      placeholderTextColor="#433bff"
                      style={styles.input}
                      keyboardType="number-pad"
                      onChangeText={(e) => {
                        setMobile(e);
                        if (e.length < 9 && e.length > 0) {
                          setMobileMessage(
                            "Customer ID must be 9 to 11 digits"
                          );
                        } else {
                          setMobileMessage("");
                        }
                      }}
                    />
                  </View>
                  {mobileMessage === "" ? (
                    <></>
                  ) : (
                    <View style={styles.messageContainer}>
                      <MaterialIcons
                        name="error-outline"
                        size={30}
                        color="red"
                      />
                      <Text style={styles.message}>{mobileMessage}</Text>
                    </View>
                  )}
                  <View style={styles.field}>
                    <MaterialIcons
                      name="sim-card"
                      size={35}
                      color="#433bff"
                      style={{ left: -5 }}
                    />
                    <View style={{ width: 250, marginLeft: 10 }}>
                      <DropdownComponent
                        data={providers}
                        param={network}
                        setParam={setNetwork}
                      />
                    </View>
                  </View>
                  {network === "" && type === "DTH" ? (
                    <View style={styles.messageContainer}>
                      <MaterialIcons
                        name="error-outline"
                        size={30}
                        color="red"
                      />
                      <Text style={styles.message}>
                        Please choose a Provider to proceed.
                      </Text>
                    </View>
                  ) : (
                    <></>
                  )}
                </View>
              ) : (
                <></>
              )}

              <View style={styles.field}>
                <FontAwesome name="rupee" size={30} color="#433bff" />
                <TextInput
                  placeholder="Enter Amount:"
                  placeholderTextColor="#433bff"
                  style={[styles.input, { marginLeft: 25 }]}
                  keyboardType="number-pad"
                  onChangeText={(e) => {
                    setAmount(e);
                    if (parseInt(e) > parseInt(balance)) {
                      setMessage("Amount is greater than your balance.");
                    } else if (parseInt(e) < 5 || parseInt(e) > 5000) {
                      setMessage("Amount should be from 5 to 5000.");
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
            </View>
            <TouchableOpacity style={styles.button} onPress={makeRecharge}>
              <Text style={styles.textColor}>Make Recharge</Text>
              <MaterialIcons name="bolt" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

export default Recharge;

const styles = StyleSheet.create({
  messageContainer: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffdada",
    flexDirection: "row",
    marginVertical: 10,
    height: 50,
  },
  wrapper: {
    backgroundColor: "#e4e3fc",
    height: "100%",
  },
  loadingIndicator: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: "100%",
    transform: [{ scaleX: 2 }, { scaleY: 2 }],
  },
  field: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 20,
    marginHorizontal: 15,
    // borderWidth: 1,
    // gap: 10,
  },
  input: {
    backgroundColor: "#e4e3fc",
    width: 250,
    elevation: 10,
    borderColor: "#433bff",
    borderWidth: 1,
    marginLeft: 10,
    borderRadius: 15,
    paddingLeft: 10,
    height: 42,
    fontSize: 18,
    borderBottomColor: "#433bff",
    borderBottomWidth: 4,
    color: "#433bff",
    // marginTop: 10,
  },
  button: {
    backgroundColor: "#433bff",
    width: 170,
    height: 40,
    borderRadius: 8,
    marginLeft: 10,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginTop: 20,
    flexDirection: "row",
  },
  textColor: {
    color: "white",
    fontSize: 17,
  },
  form: {
    backgroundColor: "#fff",
    alignSelf: "center",
    width: "90%",
    height: 650,
    borderRadius: 25,
    justifyContent: "center",
    marginVertical: 10,
    // borderWidth: 1,
    elevation: 15,
    gap: 12,
  },
  curBal: {
    alignSelf: "center",
    marginTop: 10,
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
  message: {
    color: "red",
    // marginTop: 15,
    alignSelf: "center",
    fontSize: 17,
    margin: 10,
  },
  title: {
    textAlign: "center",
    fontSize: 25,
  },
});
