import { useIsFocused } from "@react-navigation/native";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { url } from "../env";
import { useLocalSearchParams } from "expo-router";
import Navbar from "./Navbar";
import MyModal from "./MyModal";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const PaymentReports = () => {
  const focus = useIsFocused();
  const [data, setData] = useState([]);
  const { id, role } = useLocalSearchParams();
  var currentDate = new Date();
  const [day, setDay] = useState(currentDate.getDate() + "");
  const [month, setMonth] = useState(currentDate.getMonth() + 1 + "");
  const [year, setYear] = useState(currentDate.getFullYear() + "");
  const [till_day, settill_Day] = useState(currentDate.getDate() + "");
  const [till_month, settill_Month] = useState(currentDate.getMonth() + 1 + "");
  const [till_year, settill_Year] = useState(currentDate.getFullYear() + "");
  const [loading, setLoading] = useState(false);
  const [reciever, setReciever] = useState(id);
  // const [message, setMessage] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  useEffect(() => {
    if (
      day !== "" &&
      month !== "" &&
      year !== "" &&
      till_day !== "" &&
      till_month !== "" &&
      till_year !== ""
    ) {
      setLoading(true);
      axios
        .post(url + "mobilerecharge/paymentReports", {
          id: reciever,
          DAY: day,
          MONTH: month,
          YEAR: year,
          END_DAY: till_day,
          END_MONTH: till_month,
          END_YEAR: till_year,
        })
        .then((response) => {
          console.log(response.data);
          setData(response.data);
          setLoading(false);
        })
        .catch((error) => {
          console.log(error.message);
          setLoading(false);
        });
    }
  }, [focus, day, month, year, till_day, till_month, till_year, reciever]);
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
          <ScrollView style={{ marginBottom: 15 }}>
            <TouchableOpacity
              style={styles.filter}
              onPress={() => {
                setShowFilters(!showFilters);
              }}
            >
              <MaterialCommunityIcons
                name="filter-menu"
                size={30}
                color="#e4e3fc"
              />
            </TouchableOpacity>
            {showFilters ? (
              <MyModal
                day={day}
                month={month}
                year={year}
                till_day={till_day}
                till_month={till_month}
                till_year={till_year}
                setDay={setDay}
                setMonth={setMonth}
                setYear={setYear}
                settill_Day={settill_Day}
                settill_Month={settill_Month}
                settill_Year={settill_Year}
                reciever={reciever}
                setReciever={setReciever}
                role={role}
              />
            ) : (
              <></>
            )}
            {data.map((report, index) => {
              return (
                <View key={index} style={styles.container}>
                  <View style={styles.row}>
                    <View style={styles.id}>
                      <Text style={{ color: "#e4e3fc", fontWeight: "500" }}>
                        {report[0]}
                      </Text>
                    </View>
                    <View>
                      <Text style={styles.text}>{report[4]}</Text>
                    </View>
                    <View>
                      <Text>
                        {id && id === report[5] ? (
                          <MaterialIcons
                            name="call-made"
                            size={24}
                            color="red"
                          />
                        ) : id === report[6] ? (
                          <MaterialIcons
                            name="call-received"
                            size={24}
                            color="green"
                          />
                        ) : (
                          <></>
                        )}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.row}>
                    <View>
                      <View>
                        <Text style={styles.text}>
                          Prev Bal: Rs.{report[1]}
                        </Text>
                      </View>
                      <View>
                        <Text style={styles.text}>Amount: Rs.{report[2]}</Text>
                      </View>
                    </View>
                    <View>
                      <Text style={styles.text}>
                        New Balance: Rs.{report[3]}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.row}>
                    {id && id === report[5] ? (
                      <Text style={styles.text}>To: {report[8]}</Text>
                    ) : id === report[6] ? (
                      <Text style={styles.text}>From: {report[7]}</Text>
                    ) : (
                      <></>
                    )}
                  </View>
                </View>
              );
            })}
          </ScrollView>
        </View>
      )}
    </View>
  );
};

export default PaymentReports;

const styles = StyleSheet.create({
  loadingIndicator: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: "100%",
    transform: [{ scaleX: 2 }, { scaleY: 2 }],
  },
  wrapper: {
    backgroundColor: "#e4e3fc",
    height: "100%",
  },
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    marginVertical: 10,
    borderRadius: 15,
    width: "95%",
    marginLeft: 8,
    elevation: 20,
    paddingVertical: 5,
  },
  text: {
    fontSize: 16,
  },
  filter: {
    marginLeft: 10,
    marginTop: 10,
    backgroundColor: "#433bff",
    width: 50,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 25,
  },
  id: {
    backgroundColor: "#433bff",
    width: 30,
    height: 30,
    borderRadius: 50,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    elevation: 15,
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    marginVertical: 5,
    width: "100%",
    paddingHorizontal: 10,
  },

  box: {
    borderWidth: 2,
    borderColor: "black",
    borderRadius: 15,
    width: "20%",
    height: 50,
    // padding: 5,
  },
  filterContainer: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
    marginTop: 10,
  },
  inputField: {
    // backgroundColor: "red",
    height: "100%",
    borderRadius: 15,
    width: "100%",
    paddingLeft: 10,
    fontSize: 20,
    alignItems: "center",
  },
  message: {
    color: "red",
    alignSelf: "center",
    fontSize: 17,
    marginTop: 5,
  },
});
