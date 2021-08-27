import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import Section from "./components/Section";

const App = () => {

  return (
    <>
    <StatusBar backgroundColor="hsl(220, 50%, 9%)"/>
    <Section/>
    </>
  );
};


export default App;