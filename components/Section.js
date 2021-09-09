import React,{useState, useEffect} from 'react';
import geolocation from '@react-native-community/geolocation';
import{  
  View,
  Text,
  StyleSheet,
  ListView,
  ScrollView,
  Button,
  TouchableHighlight,
  Modal,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styled from 'styled-components';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from "react-native-vector-icons/Entypo";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import LottieView from 'lottie-react-native';
import fan from '../assets/lottieAnimation/fan.json';
import yoga1 from '../assets/lottieAnimation/yoga1.json';
import Search from './Search';
import Header from './Header';
import {requestPermission , checkPermission} from "./AppPermission";
import nightCloud from "../assets/lottieAnimation/dark-cloud.json";
import dayCloud from "../assets/lottieAnimation/day-cloud.json";
import dayClear from "../assets/lottieAnimation/day-clear.json";
import nightClear from "../assets/lottieAnimation/night-clear.json";
import rain from "../assets/lottieAnimation/rain.json";
import rainFall  from "../assets/lottieAnimation/bad-weather.json";
import snow  from "../assets/lottieAnimation/snow.json";
import rainFall1  from "../assets/lottieAnimation/rain-fall.json";
import haze  from "../assets/lottieAnimation/mist-weather.json";
import dayBrokenCloud  from "../assets/lottieAnimation/day-broken-cloud";
import nightBrokenCloud  from "../assets/lottieAnimation/night-broken-cloud.json";
import pageNotFound  from "../assets/lottieAnimation/page-not-found.json";
import cloudsOnly  from "../assets/lottieAnimation/only-cloud.json";
import movingEarth  from "../assets/lottieAnimation/earth-location.json";
import loadingAnimation  from "../assets/lottieAnimation/loading.json";

const API_KEY = 'api-key';

export default function Section() {
  const [isLoading, setLoding] = useState(true);
  const [data, setData] = useState([]);
  const [weather, setWeather] = useState([]);
  const [temperature, setTemperature] = useState([]);
  const [windSpeed, setWindSpeed] = useState([]);
  const [searchData, setSearchData] = useState('');
  const [storage, setStorage] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [search, setSearch] = useState("");
  const animation = React.createRef();
  const [error,setError] = useState("");
  const [location, setLocation] = useState("");
  const [networkError,setNetworkError] = useState("");
  const [color , setColor] = useState("");
  const [loader,setLoader] = useState(false);

  useEffect( async () => {
    animation.current.play();
    const cityData = await AsyncStorage.getItem('city');
    const locationData = await AsyncStorage.getItem('city');
    const fetchData = async ()=> {
      try {
        const apiData = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${cityData ? cityData : locationData}&appid=${API_KEY}`,
        );
        const response = await apiData.json();
        const weatherData = await response.weather;
        const tempData = await response.main;
        const WindData = await response.wind;
        setData(response);
        setWeather(weatherData);
        setTemperature(tempData);
        setWindSpeed(WindData);
      } catch (error) {
          alert(error.message);
      }
    };
    fetchData();
  setTimeout( ()=> {
    setLoader(true)
  },2300)

  },[search,storage]);

  const weatherT = weather ? weather.map(type => type.main) : '';
  const weatherType = weatherT.slice(0, 1);
  const weathericon = weather ? weather.map(type => type.icon) : '';
  const weatherIcon = weathericon.slice(0, 1);
  const {name, base, visibility} = data;
  const visible = (visibility / 1000).toFixed(2);
  const {temp, feels_like, temp_min, temp_max, pressure, humidity} = temperature
    ? temperature
    : 'NOT found';
  const {speed, deg} = windSpeed ? windSpeed : 'not found';
  const celcius = (temp - 273.15).toFixed(1);
  const RealFeel = Math.ceil(feels_like - 273.15);
  const dayNightMode = weatherIcon ? weatherIcon.map(type => type.slice(2,3)) : "d";
  const weatherTypeAnimation = weatherIcon == '01d' ? dayClear : weatherIcon == "01n" ? nightClear : weatherIcon == '09n' || weatherIcon == '09d' || weatherIcon == '10d'|| weatherIcon == '10n' ? rain : weatherIcon == '11d' || weatherIcon == '11n' ? rainFall : weatherIcon == '02d' ? dayBrokenCloud : weatherIcon == '02n' ? nightBrokenCloud : weatherIcon == '03d' ? nightCloud : weatherIcon == '03n' ? dayCloud : weatherIcon == '04d' ? nightCloud : weatherIcon == '04n' ? dayCloud : weatherIcon == '13d' ? snow : weatherIcon == '13n' ? snow : weatherIcon == '50d' ? haze : weatherIcon == '50n' ? haze : pageNotFound;
  
  return !loader ? (
    <>
      <Header
        headingStyle={{backgroundColor:dayNightMode == 'n' ? "hsl(220, 50%, 9%)" : "rgba(50, 90, 220, 0.15)"}}
        title={{color: dayNightMode == 'n' ? "white" : "black"}}
        searchButton={{color: dayNightMode == 'n' ? "lightblue" : "dodgerblue"}}
        locationButton={{color: dayNightMode == 'n' ? "firebrick" : "indianred"}}
      />
      <SectionContainer style={{width:"100%",flex:1,justifyContent:"center",alignItems: 'center',backgroundColor: dayNightMode == 'n' ? "hsl(220, 50%, 16%)" : "white"}} >
        <View style={{width:'100%',height:"100%",justifyContent:"center",alignItems: 'center'}}>
        <LottieView  
        style={{width:'100%',height:"80%",alignSelf: 'center',}}
        ref={animation}
        source={loadingAnimation}
        autoPlay
        loop
        />
        </View>
        </SectionContainer>
  </>
  ) : (
    <>
      <Header
        headingStyle={{backgroundColor:dayNightMode == 'n' ? "hsl(220, 50%, 9%)" : "lavender"}}
        title={{color: dayNightMode == 'n' ? "white" : "black"}}
        searchButton={{color: dayNightMode == 'n' ? "lightblue" : "dodgerblue"}}
        locationButton={{color: dayNightMode == 'n' ? "firebrick" : "indianred"}}
        cityName={name}
        animationType={animation}
        dataName={name}
        OnSearch={() => {
          setModalVisible(!modalVisible);
          setSearchData('');
        }}
            onLocation = { async() => {
            try {
            requestPermission();
            const location = await geolocation.getCurrentPosition(async data => {
            const latitude = data.coords.latitude;
            const longitude = data.coords.longitude;
            try {
              const locationAPI = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`
              );
              const locationData = await locationAPI.json();
              const locationName = locationData.name;
              setSearch(locationName)
              await AsyncStorage.removeItem('city');       
              // await AsyncStorage.clear();       
              setNetworkError("")
              await AsyncStorage.setItem('city',locationName);
            } catch (error) {
                setNetworkError(error.message)
            }
            });
              
            }
            catch(error)
            {
              alert(error.message)
            }
        }}
      />
      <SectionContainer backgroundColor={dayNightMode == 'n' ? "hsl(220, 50%, 16%)" : "white"}>
        <Modal  animationType="slide" visible={modalVisible}>
        <ModalView>
         <View style={{width:"100%",flexDirection:"row"}}>
            <Search
              bgcolor={{backgroundColor: dayNightMode == 'n' ? "hsl(220, 50%, 65%)" : "lavender",
              color: dayNightMode == 'n' ? "white" : "gray"}}
              style={styles.searchInput}
              onChangeText={textValue => {
                setSearchData(textValue);
              }}
            />
            {searchData == '' ? (
              <TouchableHighlight
                style={styles.cancel}
                underlayColor="red"
                onPress={()=> {
                  if (searchData == '') {
                    setModalVisible(false);
                  } else if (data.cod === 404) {
                    setModalVisible(false);
                  } else {
                    setModalVisible(false);
                    setSearch(searchData);
                  }
                }}>
                <AntDesign name="arrowright" size={26} color={'white'} />
              </TouchableHighlight>
            ) : (
              <TouchableHighlight
                style={styles.searchbtn}
                underlayColor="#23527c"
                onPress={async ()=> {
                  if (searchData == '') {
                    setModalVisible(false);
                  } else if (data.cod === 404) {
                    setModalVisible(false);
                  } else {
                    await AsyncStorage.removeItem('city');
                    setModalVisible(false);
                    // await AsyncStorage.clear();
                    setSearch(searchData);
                    await AsyncStorage.setItem('city', searchData);
                  }
                }}>
                <AntDesign name={'search1'} size={26} color={'white'} />
              </TouchableHighlight>
            )}
          </View>
          <View style={{backgroundColor: dayNightMode == 'n' ? "hsl(220, 50%, 28%)" : "snow",height:"100%",width:"100%"}}>
          <LottieView
            style={{backgroundColor: dayNightMode == 'n' ? "hsl(220, 50%, 28%)" : "snow",height:380,justifyContent:"center",alignSelf: 'center'}}
            ref={animation}
            source={movingEarth}
            width={'100%'}
            autoPlay
            loop
            speed={1.5}
          />
          <Details1 style={{color: dayNightMode == 'n' ? "hsl(120, 50%, 100%)" : "black",fontWeight:"bold"}}>Developed by - Aman Gupta</Details1>
          <Details2 style={{color: dayNightMode == 'n' ? "hsl(220, 50%, 80%)" : "black",fontWeight:"bold"}}>over 200,000 Cities available.</Details2>
          <Details3 style={{color: dayNightMode == 'n' ? "hsl(220, 50%, 90%)" : "black",fontWeight:"bold"}}>Search Cities at world Level</Details3>
          </View>
          </ModalView>
        </Modal>
        <View style={styles.mainView}>
          <DisplayWeatherData >
            <CityWeather style={{flex: name ? 0.50 : 0.97}}>
              <LottieView
                ref={animation}
                source={weatherTypeAnimation}
                speed={1.3}
                autoPlay
                loop
              />
            </CityWeather>
            {name ? (
            <View style={{width:"100%",alignItems: 'center',flex:0.50,marginTop:10}}>
            <WeatherData style={{color: dayNightMode == 'n' ? "white" : "lightslategray",fontSize: name ? 50 : 0}} >{celcius ? celcius : ""}°C</WeatherData>
            <View style={{flexDirection:"row",width:"100%",justifyContent: 'center',alignItems: 'center'}}>            
            <Weather style={{color: dayNightMode == 'n' ? "cyan" : "black",marginLeft:"15%",fontSize: name ? 25 : 15 , marginTop: name ? 0 : 15,}}>
            {weatherType ? weatherType : "Press location Button"}
            </Weather>
            <Text style={{color:dayNightMode == 'n' ? "white" : "black",marginLeft:15,fontSize: name ? 10 : 0,fontWeight:"bold",textTransform:"uppercase",letterSpacing:3,borderWidth:1,padding:6,borderColor:dayNightMode == 'n'? "white" : "dimgray"}}> 
             {dayNightMode == 'n' ? "Night" : dayNightMode == 'd' ? "Day" : ""}</Text>
            </View>
            </View>
            ) : (
            <View style={{width:"100%",alignItems: 'center'}}>
            <WeatherData style={{color: dayNightMode == 'n' ? "white" : "lightslategray",fontSize: name ? 50 : 0}} >{celcius ? celcius : ""}°C</WeatherData>
            <Weather style={{color: dayNightMode == 'n' ? "white" : "black",fontSize: name ? 23 : 0 , marginTop: name ? 0 : 0}} >
            {weatherType ? weatherType : ( 
            <View>
              <Text style={{fontSize:16,textTransform:"capitalize",fontWeight:"bold",}}><Entypo name={"location-pin"} size={20} color={"red"}/>for current Location</Text>
              <Text style={{fontSize:16,textTransform:"capitalize",fontWeight:"bold",}}><AntDesign name={"search1"} size={20} color={"skyblue"}/>for search locations</Text>
            </View> )}
            </Weather>
            <Text style={{color:dayNightMode == 'n' ? "white" : "teal",fontSize: name ? 15 : 0,fontWeight:"bold",letterSpacing:3,}} > 
            {dayNightMode == 'n' ? "Current Status:" : dayNightMode == 'd' ? "Current Status:": "" }   {dayNightMode == 'n' ? "Night" : dayNightMode == 'd' ? "Day" : ""}</Text>
            </View>
            )}
          </DisplayWeatherData>
          <MainAnimationData style={{backgroundColor:dayNightMode == 'n' ? "rgba(260,260,260,0.15)" : "rgba(0, 0, 0, 0.06)"}} >
            <View style={{width:"50%",height:"100%",justifyContent: 'center',alignItems: 'center',}}>
            <LottieView
              style={{width:"100%",height:"88%",alignSelf: 'center',}}
              ref={animation}
              source={yoga1}
              autoPlay
              loop
            />
            </View>
            <PressureHumidity>
              <PHData style={{color: dayNightMode == 'n' ? "white" : "gray"}}> Pressure:   {pressure} hPa</PHData>
              <PHData style={{color: dayNightMode == 'n' ? "white" : "gray"}}> Humidity:   {humidity}% </PHData>
              <PHData style={{color: dayNightMode == 'n' ? "white" : "gray"}}> RealFeel:   {RealFeel ? RealFeel : ''}°C </PHData>
              <PHData style={{color: dayNightMode == 'n' ? "white" : "gray"}}> Visibility:  {visible ? visible : ''} km </PHData>
            </PressureHumidity>
          </MainAnimationData>
          <DisplayAnimationData style={{backgroundColor:dayNightMode == 'n' ? "rgba(260,260,260,0.01)" : "rgba(0, 0, 0, 0.12)"}}>
            <LottieView
              style={styles.wind}
              ref={animation}
              source={fan}
              width={"30%"}
              height={'100%'}
              speed={2.5}
              autoPlay
              loop
            />
            <Wind style={{color: dayNightMode == 'n' ? "white" : "gray"}}>Wind: {speed} km/h</Wind>
          </DisplayAnimationData>
        </View>
      </SectionContainer>
    </>
  );
}

const styles = StyleSheet.create({
  mainView:{
    height:"100%",
    width: "100%",
  },
  yogaAnimation: {
    width: '50%',
    flex: 1
  },
  searchbtn: {
    backgroundColor: 'skyblue',
    width: '15%',
    height: 55,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancel: {
    backgroundColor: '#fe6656',
    width: '15%',
    height: 55,
    justifyContent: 'center',
    alignItems: 'center',
  },
  wind: {
    marginLeft:"2%"
}
});

const SectionContainer = styled.View`
  align-items: center;
`;

const Weather = styled.Text`
  font-size: 23px;
  color: white;
  text-transform: capitalize;
  letter-spacing: 2px;
  font-weight: bold;
  
`;

const DisplayWeatherData = styled.View`
  flex: 0.4;
  width: 100%;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.018);
`;

const WeatherData = styled.Text`
  font-size: 50px;
  font-weight: bold;
  font-family: arial;
  margin-bottom: 10px;
  width: 100%;
  justify-content: center;
  text-align: center;
`;

const CityWeather = styled.View`
  justify-content: center;
  align-items: center;
  width: 100%;
`;

const DisplayAnimationData = styled.View`
  width: 100%;
  flex:0.17;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
`;

const MainAnimationData = styled.View`
  flex-direction: row;
  flex:0.35;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const Wind = styled.Text`
  font-size: 20px;
  font-weight: bold;
  padding-right: 10%;
`;

const PressureHumidity = styled.View`
  justify-content: center;
  width: 50%;
  flex:1;
`;

const PHData = styled.Text`
  font-size: 14px;
  color: gray;
  letter-spacing: 1px;
  margin-bottom: 8%;
  font-weight: bold;
`;

// search modal

const ModalView = styled.View`
  width: 100%;
  height: 100%;
`;

const Details1 = styled.Text`
    font-size: 20px;
    justify-content: center;
    text-align: center;
    width: 100%;
    letter-spacing: 2px;
    text-transform: capitalize;
    color:white;
    padding: 12px;
`;
const Details2 = styled(Details1)`
font-size: 14px;
`;

const Details3 = styled(Details1)`
font-size: 11px;
`;
