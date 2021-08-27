import React from 'react';
import {View, Text,TouchableHighlight,StyleSheet} from 'react-native';
import styled from 'styled-components';
import Entypo from "react-native-vector-icons/Entypo";
import AntDesign from "react-native-vector-icons/AntDesign";
import locationNotFound  from "../assets/lottieAnimation/location.json";
import LottieView from 'lottie-react-native';
export default function Header({OnSearch,onLocation,headingStyle,title,cityName,searchButton,locationButton,animationType,dataName}) {

  return (
    <HeaderView style={headingStyle}>
      <TouchableHighlight style={styles.searchIcon} underlayColor="transparent" onPress={onLocation}>
     {dataName ? (
      <LottieView
        source={locationNotFound}
        height="80%"
        speed={0}
      /> ):(
        <LottieView
        ref={animationType}
        source={locationNotFound}
        height="90%"
        speed={1.2}
        autoPlay
        loop
      /> 
      )

    }
      </TouchableHighlight>
      <HeaderText style={title}>{cityName ? cityName : "weather+"}</HeaderText>
      <TouchableHighlight style={styles.searchIcon} underlayColor="transparent" onPress={OnSearch}>
      <AntDesign style={searchButton} name={"search1"} size={25}
      />
      </TouchableHighlight>
    </HeaderView>
  );
}
const styles = StyleSheet.create({
  searchIcon:{
    width:60,
    height:60,
    justifyContent: 'center',
    alignItems: 'center',
      }
  })
const HeaderView = styled.View`
  height: 60px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;
const HeaderText = styled.Text`
  font-size: 20px;
  text-transform: capitalize;
  font-weight:bold;
  color: gray;
  letter-spacing: 1px;
`;

