import { useIsFocused } from "@react-navigation/native";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Alert,
  Pressable,
  ScrollView,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { url } from "./../env";
import { AntDesign } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import DropdownComponent from "./DropDownComponent";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
const Users = () => {
  const focus = useIsFocused();
  const [render, setRender] = useState(1);
  const [users, setUsers] = useState([]);
  const [usersCopy, setUsersCopy] = useState([]);
  const [viewUser, setViewUser] = useState([]);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [updateID, setUpdateID] = useState("");
  const [USER_NAME, setUSER_NAME] = useState("");
  const [PROFIT, setPROFIT] = useState("");
  const [PASSWORD, setPASSWORD] = useState("");
  const [MOBILE, setMOBILE] = useState("");
  const [EMAIL, setEMAIL] = useState("");
  const [BALANCE, setBALANCE] = useState("");
  const [LOCATION, setLOCATION] = useState("");
  const [distributors, setDistributors] = useState([]);
  const [reportingTo, setReportingTo] = useState(null);
  const roles = [
    {
      label: "Admin",
      value: "Admin",
    },
    {
      label: "Distributor",
      value: "Distributor",
    },
    {
      label: "Retailer",
      value: "Retailer",
    },
  ];
  useEffect(() => {
    setLoading(true);
    axios
      .post(url + "mobilerecharge/viewusers")
      .then((response) => {
        setLoading(false);
        setUsers(response.data);
        setUsersCopy(response.data);
      })
      .catch((error) => {
        setLoading(false);
        console.log(error.message);
      });
    setLoading(true);
    axios
      .post(url + "mobilerecharge/viewdistributors")
      .then((response) => {
        var arr = [];
        for (let dist of response.data) {
          var obj = {};
          obj["label"] = dist[1];
          obj["value"] = dist[0];
          arr.push(obj);
        }
        setDistributors(arr);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        console.log(error.message);
      });
  }, [focus, render]);

  const updateUser = () => {
    setLoading(true);
    axios
      .post(url + "mobilerecharge/updateusers", {
        USER_ID: updateID,
        PASSWORD: PASSWORD,
        MOBILE: MOBILE,
      })
      .then((response) => {
        if (response.data === "s") {
          setUpdateID("");
          setUpdateModalVisible(false);
          setPASSWORD("");
          setMOBILE("");
          setLoading(false);
          setRender(render + 1);
        }
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  };

  const confirmDelete = (id, name) => {
    Alert.alert("Confirm", `Are you sure you want to delete user ${name}?`, [
      { text: "OK", onPress: () => deleteUser(id) },
      {
        text: "Cancel",
        onPress: () => {
          return;
        },
      },
    ]);
  };

  const deleteUser = (id) => {
    setLoading(true);
    axios
      .post(url + "mobilerecharge/deleteusers", {
        id: id,
      })
      .then((response) => {
        // console.log(response);
        Alert.alert("Success", "Deleted Successfully");
        setLoading(false);
        setRender(render + 1);
      })
      .catch((error) => {
        setLoading(false);
        console.log(error);
      });
  };

  const addUser = () => {
    if (MOBILE.length !== 10) {
      alert("Please enter a valid mobile number with 10 digits");
      return;
    }
    if (USER_NAME.length === 0) {
      alert("Name field is empty!");
      return;
    }
    if (PASSWORD.length === 0) {
      alert("password field is empty!");
      return;
    }
    if (MOBILE.length === 0) {
      alert("Mobile field is empty!");
      return;
    }
    if (LOCATION.length === 0) {
      alert("Address field is empty!");
      return;
    }
    const value = {
      USER_NAME: USER_NAME,
      PROFIT: 0,
      PASSWORD: PASSWORD,
      MOBILE: MOBILE,
      EMAIL: EMAIL,
      BALANCE: 0,
      LOCATION: LOCATION,
      ROLE: role,
      REPORTING_TO: reportingTo,
    };
    setLoading(true);
    axios
      .post(url + "mobilerecharge/insertusers", value)
      .then((response) => {
        console.log(response.data);
        if (response.data === "e") {
          setModalVisible(false);
          setUSER_NAME("");
          setPROFIT("");
          setPASSWORD("");
          setMOBILE("");
          setEMAIL("");
          setBALANCE("");
          setRole("");
          setLOCATION("");
          setLoading(false);
          setRender(render + 1);
        }
      })
      .catch((err) => {
        console.log(err.message);
        console.log(err);
        setLoading(false);
      });
  };
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

  const searchdata = (e) => {
    const r = [];

    for (var k of usersCopy) {
      if (k[1].indexOf(e) !== -1 || k[3].indexOf(e) !== -1) {
        r.push(k);
      }
      setUsers(r);
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
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => {
                router.back();
              }}
            >
              <AntDesign name="arrowleft" size={30} color="black" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.addUserBtn}
              onPress={() => {
                setModalVisible(true);
              }}
            >
              <AntDesign name="adduser" size={30} color="white" />
            </TouchableOpacity>
            <TouchableOpacity onPress={logout}>
              <MaterialIcons name="logout" size={30} color="red" />
            </TouchableOpacity>
          </View>
          <View style={styles.search}>
            <FontAwesome name="search" size={24} color="#433bff" />
            <TextInput
              placeholder="Search Users"
              style={styles.searchBar}
              onChangeText={(e) => searchdata(e)}
            />
          </View>
          <ScrollView>
            {users.map((user, index) => {
              return (
                <View key={index} style={styles.container}>
                  <View style={styles.row}>
                    <View style={styles.id}>
                      <Text style={{ color: "#e4e3fc", fontWeight: "500" }}>
                        {user[0]}
                      </Text>
                    </View>
                    <View style={styles.name}>
                      <Text style={styles.nameText}>{user[1]}</Text>
                    </View>
                    <View>
                      {user[2] === "Admin" ? (
                        <FontAwesome
                          name="user-secret"
                          size={24}
                          color="black"
                        />
                      ) : user[2] === "Distributor" ? (
                        <FontAwesome5 name="user-cog" size={24} color="black" />
                      ) : user[2] === "Retailer" ? (
                        <FontAwesome name="users" size={24} color="black" />
                      ) : (
                        <></>
                      )}
                    </View>
                  </View>
                  <View style={styles.contents}>
                    <View>
                      <Text style={styles.text}>Role: {user[2]}</Text>
                    </View>
                    <View>
                      <Text style={styles.text}>Mobile: {user[3]}</Text>
                    </View>
                    {user[2] === "Retailer" ? (
                      <View>
                        <Text style={styles.text}>
                          Sub-account of: {user[6]}
                        </Text>
                      </View>
                    ) : (
                      <></>
                    )}
                  </View>
                  <View style={styles.row}>
                    <TouchableOpacity
                      onPress={() => {
                        setViewUser(user);
                        setViewModalVisible(true);
                      }}
                    >
                      <AntDesign name="infocirlceo" size={24} color="black" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        setUpdateID(user[0]);
                        setMOBILE(user[3]);
                        setUpdateModalVisible(true);
                        setPASSWORD(user[5]);
                      }}
                    >
                      <Feather name="edit" size={24} color="black" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        confirmDelete(user[0], user[1]);
                      }}
                    >
                      <MaterialCommunityIcons
                        name="delete-outline"
                        size={24}
                        color="red"
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
          </ScrollView>
          <Modal
            animationType="slide"
            transparent={true}
            visible={viewModalVisible}
            onRequestClose={() => {
              Alert.alert("Modal has been closed.");
              setViewModalVisible(!viewModalVisible);
            }}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <MaterialIcons
                  name="cancel"
                  size={24}
                  color="red"
                  style={styles.cancelBtn}
                  onPress={() => {
                    setViewModalVisible(!viewModalVisible);
                  }}
                />
                <View style={styles.viewText}>
                  <Text style={styles.stockText}>Balance:</Text>
                  <Text style={styles.stockText}>{viewUser[4]}</Text>
                </View>
                <Pressable
                  style={[styles.button, styles.buttonClose]}
                  onPress={() => {
                    setViewModalVisible(false);
                  }}
                >
                  <Text style={styles.textStyle}>Close</Text>
                </Pressable>
              </View>
            </View>
          </Modal>
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              Alert.alert("Modal has been closed.");
              setModalVisible(!modalVisible);
            }}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <MaterialIcons
                  name="cancel"
                  size={24}
                  color="red"
                  style={styles.cancelBtn}
                  onPress={() => {
                    setModalVisible(!modalVisible);
                  }}
                />
                <TextInput
                  placeholder="Name:"
                  value={USER_NAME}
                  onChangeText={setUSER_NAME}
                  style={styles.captionBar}
                />
                <TextInput
                  placeholder="Mobile:"
                  value={MOBILE}
                  keyboardType="numeric"
                  onChangeText={setMOBILE}
                  style={styles.captionBar}
                />
                <TextInput
                  placeholder="Password:"
                  value={PASSWORD}
                  secureTextEntry={true}
                  onChangeText={setPASSWORD}
                  style={styles.captionBar}
                />
                <TextInput
                  placeholder="Location:"
                  value={LOCATION}
                  onChangeText={setLOCATION}
                  style={styles.captionBar}
                />
                <TextInput
                  placeholder="E-mail:"
                  value={EMAIL}
                  onChangeText={setEMAIL}
                  style={styles.captionBar}
                />
                <View style={{ width: "90%", marginVertical: 10 }}>
                  <DropdownComponent
                    data={roles}
                    param={role}
                    setParam={setRole}
                  />
                </View>
                {role === "Retailer" ? (
                  <View style={{ width: "90%", marginVertical: 10 }}>
                    <DropdownComponent
                      data={distributors}
                      param={reportingTo}
                      setParam={setReportingTo}
                    />
                  </View>
                ) : (
                  <></>
                )}
                <Pressable
                  style={[styles.button, styles.buttonClose]}
                  onPress={() => addUser()}
                >
                  <Text style={styles.textStyle}>Add User</Text>
                </Pressable>
              </View>
            </View>
          </Modal>
          <Modal
            animationType="slide"
            transparent={true}
            visible={updateModalVisible}
            onRequestClose={() => {
              Alert.alert("Modal has been closed.");
              setUpdateModalVisible(!updateModalVisible);
            }}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <MaterialIcons
                  name="cancel"
                  size={24}
                  color="red"
                  style={styles.cancelBtn}
                  onPress={() => {
                    setUpdateModalVisible(!updateModalVisible);
                    setUpdateID("");
                    setMOBILE("");
                    setPASSWORD("");
                  }}
                />
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Text>Mobile:</Text>
                  <TextInput
                    placeholder="Mobile:"
                    value={MOBILE}
                    keyboardType="numeric"
                    onChangeText={setMOBILE}
                    style={styles.captionBar}
                  />
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Text>PIN:</Text>
                  <TextInput
                    placeholder="Password:"
                    value={PASSWORD}
                    keyboardType="numeric"
                    onChangeText={setPASSWORD}
                    style={[
                      styles.captionBar,
                      { marginLeft: 20, marginBottom: 10 },
                    ]}
                  />
                </View>

                <Pressable
                  style={[styles.button, styles.buttonClose]}
                  onPress={() => updateUser()}
                >
                  <Text style={styles.textStyle}>Update User</Text>
                </Pressable>
              </View>
            </View>
          </Modal>
        </View>
      )}
    </View>
  );
};

export default Users;

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
  captionBar: {
    borderWidth: 0.5,
    width: 200,
    padding: 5,
    borderRadius: 15,
    backgroundColor: "#e4e3fc",
    color: "#000",
    fontSize: 17,
    margin: 5,
    alignSelf: "center",
    elevation: 10,
    borderColor: "#a7a2ff",
  },
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
    borderRadius: 15,
    width: "95%",
    marginLeft: 8,
    backgroundColor: "#fff",
    elevation: 20,
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
  contents: {
    display: "flex",
    justifyContent: "space-between",
    marginVertical: 10,
    width: "100%",
    paddingHorizontal: 10,
    gap: 10,
  },
  name: {
    backgroundColor: "#433bff",
    width: "50%",
    borderRadius: 25,
    alignItems: "center",
    height: 25,
    justifyContent: "center",
  },
  text: {
    fontSize: 16,
  },
  nameText: {
    fontSize: 17,
    fontWeight: "500",
    color: "#fff",
  },
  //   Modal styles
  cancelBtn: {
    margin: 5,
    alignSelf: "flex-end",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  viewText: {
    display: "flex",
    flexDirection: "row",
    margin: 10,
  },
  stockText: {
    fontSize: 18,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    width: "80%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    backgroundColor: "#a7a2ff",
  },
  buttonOpen: {
    backgroundColor: "#a7a2ff",
  },
  buttonClose: {
    backgroundColor: "#a7a2ff",
  },
  header: {
    // height: 80,
    marginTop: 50,
    marginLeft: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    marginRight: 15,
  },
  addUserBtn: {
    backgroundColor: "#a7a2ff",
    width: 70,
    height: 40,
    borderRadius: 50,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    elevation: 10,
    marginBottom: 10,
  },
  search: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    borderWidth: 3,
    borderRadius: 25,
    marginHorizontal: 10,
    marginVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
    borderColor: "#433bff",
  },
  searchBar: {
    width: "80%",
    height: 40,
    paddingLeft: 15,
    fontSize: 17,
    backgroundColor: "#fff",
  },
});
