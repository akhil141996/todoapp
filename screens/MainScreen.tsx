import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import React, { useEffect, useRef, useState } from "react";
import {
  StyleSheet, Text, View, TextInput, Button,
  CheckBox, ToastAndroid, ActivityIndicator, StatusBar,
  SafeAreaView, Platform, ScrollView, TouchableOpacity, Pressable, Modal as ModalForAndroid,
  TouchableHighlight, Alert
} from "react-native";
import { MaterialIcons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import Modal from "modal-react-native-web";

interface IToDo {
  text: string;
  completed: boolean;
  color: string;
  subTodo?: Array<IToDo>;
}

function randomPick() {
  const colorList = ['#E3E29D', '#FAEAB9', '#E3BF9D', '#FFC2B8', '#D2EAFE', '#C6E6C5', '#FAEAB9', '#DED7FC', '#E3A09D', '#FFD4F0']

  return colorList[Math.floor(Math.random() * 10)]
}

async function getMyObject() {
  try {
    const jsonValue = await AsyncStorage.getItem('key')
    return jsonValue !== null ? JSON.parse(jsonValue) : []
  } catch (e) {
    // read error
  }
  console.log('Done.')
}

export default function MainScreen({
  navigation,
}: StackScreenProps<RootStackParamList, 'MainPage'>) {


  const [value, setValue] = useState<string>("");
  const [isLoading, setLoading] = useState(true);
  const [toDoList, setToDos] = useState<IToDo[]>([]);
  const [error, showError] = useState<Boolean>(false);
  const mainInput = useRef(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    // fetch('http://localhost:5000/todo', { method: 'POST', body: JSON.stringify({ user: 'shiva' }), headers: { 'Content-Type': 'application/json' } })
    //   .then((res: any) => { return res.json() })
    //   .then((json) => { console.log(json); setToDos(json) })
    //   .catch((error) => console.error(error))
    //   .finally(() => setLoading(false));
    getMyObject().then(res => { console.log('=========>', res); setToDos(res) })
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
  }, []);

  const setObjectValue = async (value: any) => {
    try {
      const jsonValue = JSON.stringify(value)
      await AsyncStorage.setItem('key', jsonValue)
    } catch (e) {
      // save error
    }
    console.log('Done.')
  }

  const addNewSubTodo = (index: number): void => {
    if (!toDoList[index].completed) {
      const subList = toDoList[index]['subTodo'] || []
      if (subList.length) {
        toDoList[index]['subTodo']?.push({ text: value, completed: false, color: randomPick() })
      } else {
        toDoList[index]['subTodo'] = [{ text: value, completed: false, color: randomPick() }];
      }
      setToDos([...toDoList])
      // setObjectValue(toDoList);
      setValue("");
    } else {
      if (Platform.OS === 'android') {
        disableSubTaskAddingAfterMainTaskComplete()
      } else {
        alert('Cannot add subtask after main task complete')
      }
    }
  }

  const handleSubmit = (): void => {
    if (value.trim()) {
      setToDos([...toDoList, { text: value, completed: false, color: randomPick() }]);
      setObjectValue([...toDoList, { text: value, completed: false, color: randomPick() }]);
    } else {
      showError(true);
    }
    setValue("");
  };

  const removeItem = (index: number): void => {
    const newToDoList = [...toDoList];
    newToDoList.splice(index, 1);
    setToDos(newToDoList);
    setObjectValue(newToDoList);
  };

  const removeSubItem = (index: number, subIndex: number) => {
    const list = toDoList[index].subTodo
    list?.splice(subIndex, 1)
    toDoList[index].subTodo = list
    setToDos([...toDoList])
    setObjectValue([...toDoList]);
  }

  const toggleComplete = (index: number): void => {
    const newToDoList = [...toDoList];
    newToDoList[index].completed = !newToDoList[index].completed;
    newToDoList[index].subTodo?.forEach(r => {
      r.completed = newToDoList[index].completed ? true : false;
    })
    setToDos(newToDoList);
    setObjectValue(newToDoList);
  };

  const toggleSubComplete = (index: number, subindex: number): void => {
    const newToDoList = [...toDoList];
    newToDoList[index].subTodo[subindex].completed = !newToDoList[index].subTodo[subindex].completed;
    setToDos(newToDoList);
    setObjectValue(newToDoList);
  };

  const editValue = (text: string, index: number) => {
    toDoList[index].text = text;
    setToDos(toDoList)
    setObjectValue(toDoList);
  }

  const editSubValue = (text: string, index: number, subindex: number) => {
    if (toDoList[index].subTodo?.length) {
      toDoList[index].subTodo[subindex].text = text;
      setToDos(toDoList)
      setObjectValue(toDoList);
      addNewSubTodo(index);
    }
  }

  const workInProgressToast = () => {
    ToastAndroid.showWithGravity(
      "Work in Progress",
      ToastAndroid.SHORT,
      ToastAndroid.BOTTOM
    );
  };

  const disableSubTaskAddingAfterMainTaskComplete = () => {
    ToastAndroid.showWithGravity(
      "Cannot add subtask after main task complete",
      ToastAndroid.SHORT,
      ToastAndroid.CENTER
    );
  }


  return (
    <>{<View style={{ flex: 1, justifyContent: 'flex-end' }}>
      <>{<ScrollView><SafeAreaView style={{ flex: 1 }}>
        <>{<StatusBar
          hidden={false}
          animated={true}
          backgroundColor="#61dafb" />}
          {isLoading ? <ActivityIndicator /> :
            <View style={styles.container}>
              <View style={styles.inputWrapper}>
                <TextInput
                  placeholder="Enter your todo task..."
                  value={value}
                  ref={mainInput}
                  onChangeText={e => {
                    setValue(e);
                    showError(false);
                  }}
                  autoCapitalize="words"
                  style={styles.inputBox}
                  onSubmitEditing={handleSubmit}
                  returnKeyType="done"
                  returnKeyLabel="done"
                  contextMenuHidden={true}
                />
              </View>
              {error && (
                <Text style={styles.error}>Error: Input field is empty...</Text>
              )}
              <Text style={styles.subtitle}>Your Tasks :</Text>
              {toDoList.length === 0 && <StartScreenMessage props={mainInput} />}
              {toDoList.map((toDo: IToDo, index: number) => (
                <>
                  <View style={styles.listItem} key={`${index}_${toDo.text}`}>
                    <CheckBox
                      disabled={false}
                      value={toDo.completed}
                      style={styles.checkbox}
                      onValueChange={() => toggleComplete(index)}
                    />
                    <View style={{
                      flexDirection: "row",
                      width: "100%",
                      maxWidth: Platform.OS === 'android' ? 320 : 1180,
                      height: 35,
                      alignItems: "center",
                      borderRadius: 8,
                      borderWidth: 2,
                      paddingLeft: 8,
                      backgroundColor: toDo.color,
                      borderColor: toDo.color,
                      elevation: 5,
                      shadowOffset: {
                        width: 0,
                        height: 3
                      },
                      shadowRadius: 3.84,
                      shadowOpacity: 0.25,
                    }} key={`${index}_${toDo.text}`}>
                      <Todo toDo={toDo} index={index} subindex={undefined} setTodoList={editValue}></Todo>
                      <Ionicons name="md-add-circle" style={{ alignItems: "flex-end", padding: Platform.OS === 'android' ? 16 : 3 }} size={19} color={!toDo.completed ? "green" : "grey"} onPress={() => {
                        addNewSubTodo(index)
                        setValue('')
                      }} />
                      <MaterialIcons name="delete" size={20} color="red" style={{ alignItems: "flex-end", padding: 3 }} onPress={() => {
                        removeItem(index);
                      }} />
                    </View>
                  </View>
                  {toDo.subTodo && toDo.subTodo.map((subtoDo: IToDo, subindex: number) => (
                    <View style={styles.sublistItem} key={`${subindex}_${subtoDo.text}`}>
                      <CheckBox
                        disabled={false}
                        value={subtoDo.completed}
                        style={styles.checkbox}
                        onValueChange={() => toggleSubComplete(index, subindex)}
                      />
                      <View style={{
                        flexDirection: "row",
                        width: "100%",
                        maxWidth: Platform.OS === 'android' ? 270 : 1130,
                        height: 35,
                        alignItems: "center",
                        borderRadius: 8,
                        borderWidth: 2,
                        paddingLeft: 8,
                        backgroundColor: subtoDo.color,
                        borderColor: subtoDo.color,
                        elevation: 5,
                        shadowOffset: {
                          width: 0,
                          height: 3
                        },
                        shadowRadius: 3.84,
                        shadowOpacity: 0.25,
                      }} key={`${subindex}_${subtoDo.text}`}>
                        <Todo toDo={subtoDo} index={index} subindex={subindex} setTodoList={editSubValue}></Todo>

                        <MaterialIcons name="delete" size={20} color="red" style={{ alignItems: "flex-end", padding: Platform.OS === 'android' ? 0 : 3 }} onPress={() => {
                          removeSubItem(index, subindex);
                        }} />
                      </View>
                    </View>
                  ))}
                </>
              ))}
            </View>
          }</></SafeAreaView></ScrollView>}</>
      <TouchableOpacity
        style={{
          width: '100%', height: 40, backgroundColor: '#B2EBE7',
          alignItems: 'center', justifyContent: 'center'
        }}
        onPress={() => { setModalVisible(true) }}
      >
        <Text style={{ color: 'black', fontSize: 16, fontFamily: 'sans-serif', fontWeight: "600" }}>Click here to send us feedback!<FontAwesome name="heart" style={{ paddingLeft: 3 }} size={16} color="red" /> </Text>
      </TouchableOpacity>
      {modalVisible && (Platform.OS === 'android' || Platform.OS === 'ios') && <FeedbackScreen modalVisible={modalVisible} setModalVisible={setModalVisible} />}
      {modalVisible && Platform.OS === 'web' && <View style={{ marginTop: 22 }}>
        <Modal
          animationType="slide"
          transparent={false}
          visible={modalVisible}
          onShow={() => {
            // alert("Modal has been opened.");
          }}
          onDismiss={() => {
            alert("Modal has been closed.");
            setModalVisible(false)
          }}
        >
          <View style={{ marginTop: 22 }}>
            <View>
              <Text style={{ color: "black" }}>Feedback Page</Text>
              <TouchableHighlight
                style={styles.button}
                onPress={() => {
                  setModalVisible(false)
                }}
              >
                <Text style={{ color: "black" }}>Close Feedback Page</Text>
              </TouchableHighlight>
            </View>
          </View></Modal></View>}
    </View>}</>
  );
}

function Todo({ toDo, index, setTodoList, subindex }) {
  const todoRef = useRef(null);
  useEffect(() => {
    // if (todoRef.current.isFocused() && !toDo.completed) {
    //   handleSubmit()
    // }
  })
  const cannotEditAfterCompleteToast = () => {
    ToastAndroid.showWithGravity(
      "Cannot Edit After Complete",
      ToastAndroid.LONG,
      ToastAndroid.CENTER
    );
  };

  const [value, setValue] = useState<string>(toDo.text);
  function handleSubmit() {
    setTodoList(value, index, subindex)
  }
  return (
    <TextInput
      style={[
        styles.task,
        { textDecorationLine: toDo.completed ? "line-through" : "none", fontSize: 20 }
      ]}
      ref={todoRef}
      onChangeText={e => { if (!toDo.completed) setValue(e); else { Platform.OS === 'android' ? cannotEditAfterCompleteToast() : alert('Cannot Edit After Complete') } }}
      value={value}
      disableFullscreenUI={true}
      editable={!toDo.completed}
      onSubmitEditing={handleSubmit}
      selectTextOnFocus={false}
      placeholder='Enter your task here!!'
    />
  )
}

function StartScreenMessage({ props }) {
  const onPress = () => {
    props.current.focus();
  }
  return (
    <View style={styles.startUpMessage}>
      <Pressable onPress={onPress}>
        <Text style={{ textAlign: "center", fontSize: 23 }}>Start adding tasks to become Productive</Text>
        <Text style={{ textAlign: "center", fontSize: 15, fontStyle: "italic", paddingTop: 25 }}>"Focus on being productive instead of busy"</Text>
        <Text style={{ textAlign: "center", fontSize: 13, paddingTop: 8 }}>- Tim Ferriss, American podcaster, author and entrepreneur</Text>
      </Pressable>
    </View>
  )
}

const FeedbackScreen = ({ modalVisible, setModalVisible }) => {
  return (
    <View style={styles.centeredView}>
      <ModalForAndroid
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setModalVisible(false);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Send your feedback here!</Text>

            <TouchableHighlight
              style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
              onPress={() => {
                setModalVisible(false);
              }}
            >
              <Text style={styles.textStyle}>Close Feedback Page</Text>
            </TouchableHighlight>
          </View>
        </View>
      </ModalForAndroid>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: Platform.OS === 'android' ? 15 : 35,
    alignItems: "flex-start"
  },
  startUpMessage: {
    display: "flex",
    alignSelf: "center",
    justifyContent: "center",
    width: Platform.OS === 'android' ? 300 : 450,
    height: 200,
    backgroundColor: "#EAF8DE",
    borderColor: "grey",
    borderRadius: 30,
    borderWidth: 1,
    shadowOffset: {
      width: 0,
      height: 3
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  checkbox: {
    marginRight: 8,
    marginTop: 8
  },
  inputWrapper: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  inputBox: {
    width: Platform.OS === 'android' ? 350 : 1200,
    height: 40,
    borderColor: "purple",
    borderRadius: 8,
    borderWidth: 2,
    paddingLeft: 8,
    fontSize: 20,
  },
  title: {
    fontSize: 40,
    marginBottom: 40,
    fontWeight: "bold",
    textDecorationLine: "underline"
  },
  subtitle: {
    fontSize: 20,
    marginBottom: 20,
    color: "purple"
  },
  listItem: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    width: "100%",
    marginBottom: 8,
  },
  sublistItem: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    width: "100%",
    marginBottom: 8,
    paddingLeft: 50,
  },
  task: {
    width: Platform.OS === 'android' ? 230 : 1200,
  },
  error: {
    color: "red"
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    height: "100%",
    width: "100%"
  },
  openButton: {
    backgroundColor: "#F194FF",
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  },
  button: {
    flex: 1,
    backgroundColor: "#cccccc"
  }
});