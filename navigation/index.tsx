import { NavigationContainer, DefaultTheme, DarkTheme, useNavigationState } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React, { useEffect, useRef, useState } from "react";
import { ColorSchemeName, Image, Modal, Platform, Pressable, Text, TextInput, TouchableHighlight, View, StyleSheet } from 'react-native';
import MainScreen from '../screens/MainScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NotFoundScreen from '../screens/NotFoundScreen';
import { RootStackParamList } from '../types';
import BottomTabNavigator from './BottomTabNavigator';
import LinkingConfiguration from './LinkingConfiguration';
import ModalEnhanced from './ModalEnhanced';

// If you are not familiar with React Navigation, we recommend going through the
// "Fundamentals" guide: https://reactnavigation.org/docs/getting-started
export default function Navigation({ colorScheme }: { colorScheme: ColorSchemeName }) {
  return (
    <NavigationContainer
      linking={LinkingConfiguration}
      theme={DefaultTheme}>
      <RootNavigator />
    </NavigationContainer>
  );
}

const setObjectValue = async (value: any) => {
  await AsyncStorage.setItem('title', value)
  console.log('Done.')
}

async function getMyObject() {
  const title = await AsyncStorage.getItem('title')
  return title || 'My To-Do List';
}

function LogoTitle({ props }) {
  console.log("LogoTitle -> props", props)

  const [modalVisible, setModalVisible] = React.useState(false)
  const [headerTitle, setHeaderTitle] = React.useState('My To-Do List')

  useEffect(() => {

    getMyObject().then(res => { console.log('=========>', res); setHeaderTitle(res) })
      .catch((error) => console.error(error))
  }, []);

  const handleSubmit = (value) => {
    setHeaderTitle(value)
    setObjectValue(value)
  }

  return (
    <View style={{ flex: 1, display: "flex", flexDirection: "row", alignItems: "center" }}>
      <View>
        <Image
          style={{ width: 40, height: 40 }}
          source={require('../assets/images/icon.png')}
        />
      </View>
      <View style={{ flexBasis: Platform.OS === 'android' ? "80%" : "90%" }}>
        <Pressable onPress={() => setModalVisible(true)}>
          <Text style={{ fontSize: 20, textAlign: "center" }} >
            {headerTitle}
          </Text>
        </Pressable>
      </View>
      {modalVisible && (Platform.OS === 'android' || Platform.OS === 'ios') && <HeaderEditScreen modalVisible={modalVisible} setModalVisible={setModalVisible} handleSubmit={handleSubmit} />}
      {modalVisible && Platform.OS === 'web' && <ModalEnhanced modalNumber={4} setModalVisible={setModalVisible} handleSubmit={handleSubmit} headerTitle={headerTitle}></ModalEnhanced>}
    </View>
  );
}

const HeaderEditScreen = ({ modalVisible, setModalVisible, handleSubmit }) => {
  const [value, setValue] = React.useState('')
  return (
    <View style={styles.centeredView}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text>Update your Todo List Name here</Text>
            <TextInput
              placeholder="Update your To-do List name here!"
              value={value}
              onChangeText={e => {
                setValue(e);
              }}
              autoCapitalize="words"
              style={styles.modalText}
              onSubmitEditing={() => {
                handleSubmit(value)
              }}
            />
            <View style={{ display: "flex", flexDirection: "row" }}>
              <TouchableHighlight
                style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
                onPress={() => {
                  handleSubmit(value)
                  setModalVisible(false);
                }}
              >
                <Text style={styles.textStyle}>Update</Text>
              </TouchableHighlight>
              <TouchableHighlight
                style={{ ...styles.openButton, backgroundColor: "red" }}
                onPress={() => {
                  setModalVisible(false);
                }}
              >
                <Text style={styles.textStyle}>Cancel</Text>
              </TouchableHighlight>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

// A root stack navigator is often used for displaying modals on top of all other content
// Read more here: https://reactnavigation.org/docs/modal
const Stack = createStackNavigator<RootStackParamList>();

function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: true }}>
      {/* <Stack.Screen name="Root" component={BottomTabNavigator} /> */}
      <Stack.Screen name="MainPage" component={MainScreen} options={{ headerTitle: (props) => <LogoTitle props={props} /> }} />
      <Stack.Screen name="NotFound" component={NotFoundScreen} options={{ title: 'Oops!' }} />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
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
    elevation: 5
  },
  openButton: {
    backgroundColor: "#F194FF",
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    margin: 5
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    borderColor: "grey",
    borderRadius: 8,
    borderWidth: 2,
    padding: 5
  }
});
