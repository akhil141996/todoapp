import * as Linking from 'expo-linking';
import MainScreen from '../screens/MainScreen';

export default {
  prefixes: [Linking.makeUrl('/')],
  config: {
    screens: {
      Root: {
        screens: {
          TabOne: {
            screens: {
              TabOneScreen: 'one',
            },
          },
          TabTwo: {
            screens: {
              TabTwoScreen: 'two',
            },
          },
        },
      },
      MainPage: 'MainPage',
      NotFound: '*',
    },
  },
};
