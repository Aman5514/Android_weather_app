import React from 'react'
import { View, Text , TextInput} from 'react-native'
import styled from "styled-components"
const Search = ({onChangeText , onSubmit , bgcolor}) => {
    return (
        <SearchBox style={bgcolor} placeholder="Search City..." onChangeText={onChangeText} onSubmit={onSubmit}/>
    )
} 

const SearchBox = styled.TextInput`
height: 55px;
width: 85%;
background-color: lavender;
font-size: 20px;
padding:0 12px;
font-weight: normal;
letter-spacing:1px;
`;


export default Search
