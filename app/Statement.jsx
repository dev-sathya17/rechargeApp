import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { url } from "../env";
import { useIsFocused } from "@react-navigation/native";
import { Entypo } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import { Fontisto } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Navbar from "./Navbar";
import MyModal from "./MyModal";

const Statement = () => {
  const { id, role } = useLocalSearchParams();
  var currentDate = new Date();
  const focus = useIsFocused();
  const [data, setData] = useState([]);
  const [day, setDay] = useState(currentDate.getDate() + "");
  const [month, setMonth] = useState(currentDate.getMonth() + 1 + "");
  const [reciever, setReciever] = useState(id);
  const [year, setYear] = useState(currentDate.getFullYear() + "");
  const [till_day, settill_Day] = useState(currentDate.getDate() + "");
  const [till_month, settill_Month] = useState(currentDate.getMonth() + 1 + "");
  const [till_year, settill_Year] = useState(currentDate.getFullYear() + "");
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(false);
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
        .post(url + "mobilerecharge/accountstatement", {
          id: reciever,
          DAY: day,
          MONTH: month,
          YEAR: year,
          END_DAY: till_day,
          END_MONTH: till_month,
          END_YEAR: till_year,
        })
        .then((response) => {
          setData(response.data);
          setShowFilters(false);
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
                        {report.id}
                      </Text>
                    </View>
                    <View style={styles.cell}>
                      <Text style={styles.text}>{report.transaction_date}</Text>
                    </View>
                    <View style={styles.cell}>
                      <Text>
                        {report.status.toLowerCase() === "suspense" ? (
                          <>
                            <Ionicons name="warning" size={24} color="orange" />
                          </>
                        ) : report.status.toLowerCase() === "requested" ? (
                          <Entypo name="time-slot" size={20} color="orange" />
                        ) : report.status.toLowerCase() === "success" ? (
                          <FontAwesome name="check" size={20} color="green" />
                        ) : report.status.toLowerCase() === "failure" ? (
                          <FontAwesome name="times" size={20} color="red" />
                        ) : report.status !== "" ? (
                          <></>
                        ) : report.sender_id === id ? (
                          <MaterialIcons
                            name="call-made"
                            size={24}
                            color="red"
                          />
                        ) : report.receiver_id === id ? (
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
                    {report.type === "" ? (
                      <></>
                    ) : (
                      <View style={styles.cell}>
                        <Text>
                          {report.type === "Mobile" ? (
                            <Entypo name="mobile" size={20} color="black" />
                          ) : report.type === "DTH" ? (
                            <FontAwesome5
                              name="satellite-dish"
                              size={20}
                              color="black"
                            />
                          ) : (
                            <></>
                          )}
                        </Text>
                      </View>
                    )}
                    {report.network === "" ? (
                      <></>
                    ) : (
                      <View style={styles.cell}>
                        <Text style={styles.text}>{report.network}</Text>
                      </View>
                    )}
                    {report.type === "" ? (
                      <View style={styles.cell}>
                        <Fontisto name="arrow-swap" size={24} color="black" />
                      </View>
                    ) : (
                      <></>
                    )}
                    <View style={styles.cell}>
                      {report.sender_id === id ? (
                        <Text style={styles.text}>
                          To: {report.receiver_name}
                        </Text>
                      ) : report.receiver_id === id ? (
                        <Text style={styles.text}>
                          From: {report.receiver_name}
                        </Text>
                      ) : (
                        <></>
                      )}
                    </View>
                  </View>
                  <View style={styles.row}>
                    <View style={styles.cell}>
                      <Text style={styles.text}>
                        Prev Balance: {report.previous_balance}
                      </Text>
                    </View>
                    <View style={styles.cell}>
                      <Text style={styles.text}>Rs.{report.amount}</Text>
                    </View>
                  </View>
                  <View style={styles.row}>
                    <View style={styles.cell}>
                      <Text style={styles.text}>
                        Cur Bal: Rs.{report.new_balance}
                      </Text>
                    </View>
                  </View>
                  {report.yourref === "" ? (
                    <></>
                  ) : (
                    <View style={styles.row}>
                      <View style={styles.cell}>
                        <Text style={styles.text}>
                          Yourref: {report.yourref}
                        </Text>
                      </View>
                    </View>
                  )}
                  {report.status === "Success" ? (
                    <View style={styles.row}>
                      <View style={styles.cell}>
                        <Text style={styles.text}>
                          Transaction ID: {report.transaction_id}
                        </Text>
                      </View>
                    </View>
                  ) : (
                    <></>
                  )}
                </View>
              );
            })}
          </ScrollView>
        </View>
      )}
    </View>
  );
};

export default Statement;

const styles = StyleSheet.create({
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
  row: {
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    marginVertical: 5,
    width: "100%",
    paddingHorizontal: 10,
  },
  cell: {
    marginHorizontal: 5,
  },

  wrapper: {
    backgroundColor: "#e4e3fc",
    height: "100%",
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
  loadingIndicator: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: "100%",
    transform: [{ scaleX: 2 }, { scaleY: 2 }],
  },
});
