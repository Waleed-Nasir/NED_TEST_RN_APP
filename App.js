import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, ScrollView } from 'react-native';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';


function App() {
  // Set an initializing state whilst Firebase connects
  const [initializing, setInitializing] = useState(true);
  const [firstName, setfirstName] = useState('');
  const [lastName, setlastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [userType, setuserType] = useState('');
  const [user, setUser] = useState();
  const [qualification, setQualification] = useState('');
  const [SchoolName, setSchoolName] = useState('');
  const [dashboardListing, setDashboardListing] = useState([]);
  const [login, setlogin] = useState(false);
  const [profileDetails, setProfileDetails] = useState(false);

  // Handle user state changes
  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
    renderDashboard(user?.userType?.toLowerCase())
  }

  renderDashboard=(role)=>{
    database()
  .ref(`/dashboard/${role === 'teacher'?"student":'teacher'}`)
  .on('value', snapshot => {
    console.log('User data: ', snapshot.val());
    setDashboardListing(Object.values(snapshot.val()))
  });
  }


  onlogin=()=>{
    console.log( email,password,phone,userType,firstName,lastName)
    let status = true
    auth()
  .signInWithEmailAndPassword(email,password,)
  .then((data) => {
    console.log('User account created & signed in!',data);
  })
  .catch(error => {
    if (error.code === 'auth/email-already-in-use') {
      console.log('That email address is already in use!');
    }
    if (error.code === 'auth/invalid-email') {
      console.log('That email address is invalid!');
    }
    console.error(error);
  });
  }



  onRegister=()=>{
    console.log( email,password,phone,userType,firstName,lastName)
    let status = true
    auth()
  .createUserWithEmailAndPassword(email,password,)
  .then((data) => {
    console.log('User account created & signed in!',data);
    database()
  .ref(`/users/${data.user.uid}`)
  .set({
    email,password,phone,userType,firstName,lastName,status
  })
  .then(() => console.log('Data set.'));


  database()
  .ref(`/dashboard/${userType.toLowerCase()}`)
  .push({
    email,
    phone,
    firstName,
    lastName,
    status,
    qualification,
    SchoolName,
    id:data.user.uid
  })
  .then(() => console.log('Data set.'));

  })
  .catch(error => {
    if (error.code === 'auth/email-already-in-use') {
      console.log('That email address is already in use!');
    }
    if (error.code === 'auth/invalid-email') {
      console.log('That email address is invalid!');
    }
    console.error(error);
  });
  }
  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  loggout=()=>{
    auth().signOut()
  }

  if (initializing) return null;

  if (!user && !login) {
    return (
      <View style={{flex:1,justifyContent:'center',alignContent:'center',paddingHorizontal:20}}>
        <Text>Register</Text>
        <TextInput style={{width:'100%',height:40,padding:10,color:'black',borderColor:'black',borderWidth:1,marginVertical:4}}  placeholder={'First Name'} onChangeText={setfirstName}/>
        <TextInput style={{width:'100%',height:40,padding:10,color:'black',borderColor:'black',borderWidth:1,marginVertical:4}}  placeholder={'Last Name'} onChangeText={setlastName}/>
        <TextInput style={{width:'100%',height:40,padding:10,color:'black',borderColor:'black',borderWidth:1,marginVertical:4}}  placeholder={'SchoolName'} onChangeText={setSchoolName}/>
        <TextInput style={{width:'100%',height:40,padding:10,color:'black',borderColor:'black',borderWidth:1,marginVertical:4}}  placeholder={'Qualification'} onChangeText={setQualification}/>
        <TextInput style={{width:'100%',height:40,padding:10,color:'black',borderColor:'black',borderWidth:1,marginVertical:4}}   placeholder={'Phone'} onChangeText={setPhone}/>
        <TextInput style={{width:'100%',height:40,padding:10,color:'black',borderColor:'black',borderWidth:1,marginVertical:4}}   placeholder={'Role   Teacher/Student'} onChangeText={setuserType}/>
        <TextInput style={{width:'100%',height:40,padding:10,color:'black',borderColor:'black',borderWidth:1,marginVertical:4}}  placeholder={'Email'} onChangeText={setEmail}/>
        <TextInput style={{width:'100%',height:40,padding:10,color:'black',borderColor:'black',borderWidth:1,marginVertical:4}}   placeholder={'Password'} onChangeText={setPassword}/>
        <TouchableOpacity
        style={{
          marginVertical:13,
          backgroundColor: 'blue',
          alignItems: 'center',
          justifyContent: 'center',
          width:'100%',
          height:40,
          textAlign:'center'
        }}
        onPress={onRegister}>
    <Text style={{fontSize:16,color:'white'}}>
      Register
    </Text>
   </TouchableOpacity>
        <Button title={'Go to Login'} onPress={()=>(setlogin(true))}/>
      </View>
    );
  }
  if (!user && login) {
    return (
      <View style={{flex:1,justifyContent:'center',alignContent:'center',paddingHorizontal:20}}>
        <Text>Login</Text>
        <TextInput style={{width:'100%',height:40,padding:10,color:'black',borderColor:'black',borderWidth:1,marginVertical:4}}  placeholder={'Email'} onChangeText={setEmail}/>
        <TextInput style={{width:'100%',height:40,padding:10,color:'black',borderColor:'black',borderWidth:1,marginVertical:4}}   placeholder={'Password'} onChangeText={setPassword}/>
        <TouchableOpacity
        style={{
          backgroundColor: 'blue',
          alignItems: 'center',
          justifyContent: 'center',
          width:'100%',
          height:40,
          textAlign:'center',
          marginVertical:13
        }}
        onPress={onlogin}>
    <Text style={{fontSize:16,color:'white'}}>
      Login
    </Text>
   </TouchableOpacity>
        <Button title={'Go to Register'} onPress={()=>(setlogin(false))}/>
      </View>
    );
  }

  showCardDetails=(user)=>{
    database()
    .ref(`/users/${user.id}`)
    .once('value')
    .then(snapshot => {
      setProfileDetails(snapshot.val())
      console.log('User data: ', snapshot.val());
    });
  }

  if(profileDetails.firstName){
return(
  <View style={{flex:1,justifyContent:'flex-start',alignContent:'center',paddingHorizontal:20,marginTop:45}}>
      <Text style={{width:'100%',color:'black', fontSize:14,fontWeight:'800',marginVertical:20,marginBottom:20}}>Profile Detials</Text>
        <Text style={{width:'100%',color:'black', fontSize:14,fontWeight:'800',marginVertical:4}}>Name: <Text style={{paddingHorizontal:10,color:'black', fontSize:14,paddingHorizontal:10}}>{profileDetails.firstName}{profileDetails.lastName}</Text></Text>
        <Text style={{width:'100%',color:'black', fontSize:14,fontWeight:'800',marginVertical:4}}>SchoolName: <Text style={{paddingHorizontal:10,color:'black', fontSize:14,paddingHorizontal:10}}>{profileDetails.SchoolName}</Text></Text>
        <Text style={{width:'100%',color:'black', fontSize:14,fontWeight:'800',marginVertical:4}}>Qualification: <Text style={{paddingHorizontal:10,color:'black', fontSize:14,paddingHorizontal:10}}>{profileDetails.Qualification}</Text></Text>
        <Text style={{width:'100%',color:'black', fontSize:14,fontWeight:'800',marginVertical:4}}>Phone: <Text style={{paddingHorizontal:10,color:'black', fontSize:14,paddingHorizontal:10}}>{profileDetails.phone}</Text></Text>
        <Text style={{width:'100%',color:'black', fontSize:14,fontWeight:'800',marginVertical:4}}>Status: <Text style={{paddingHorizontal:10,color:'black', fontSize:14,paddingHorizontal:10}}>{profileDetails.status?'Available':'Unavailable'}</Text></Text>
    
     <TouchableOpacity
        style={{
          backgroundColor: 'blue',
          alignItems: 'center',
          justifyContent: 'center',
          width:'100%',
          height:40,
          textAlign:'center',
          marginVertical:30
        }}
        onPress={()=>setProfileDetails({})}>
    <Text style={{fontSize:16,color:'white'}}>
    Back to Home
    </Text>
   </TouchableOpacity>
  </View>
)

  }


  return (
    <View style={{flex:1,justifyContent:'flex-start',alignContent:'center',paddingHorizontal:20,paddingTop:50}}>
    <Text style={{width:'100%',color:'black', fontSize:14,fontWeight:'800',marginVertical:20,marginBottom:20}}>Welcome</Text>
    <ScrollView>
    {dashboardListing?.map((item,index)=>(
      <TouchableOpacity onPress={()=>showCardDetails(item)} activeOpacity={0.6} style={{width:'100%', minHeight:120,borderColor:'gray',borderRadius:6,borderWidth:2,paddingVertical:10,marginVertical:10}}>
        <Text style={{width:'100%',paddingHorizontal:10,color:'black', fontSize:14,fontWeight:'800',marginVertical:4}}>{user?.userType?.toLowerCase() === 'teacher'?"Student":'Teacher'}</Text>
        <Text style={{width:'100%',paddingHorizontal:10,color:'black', fontSize:14,fontWeight:'800',marginVertical:4}}>Name: <Text style={{paddingHorizontal:10,color:'black', fontSize:14,paddingHorizontal:10}}>{item.firstName}{item.lastName}</Text></Text>
        <Text style={{width:'100%',paddingHorizontal:10,color:'black', fontSize:14,fontWeight:'800',marginVertical:4}}>SchoolName: <Text style={{paddingHorizontal:10,color:'black', fontSize:14,paddingHorizontal:10}}>{item.SchoolName}</Text></Text>
        <Text style={{width:'100%',paddingHorizontal:10,color:'black', fontSize:14,fontWeight:'800',marginVertical:4}}>Qualification: <Text style={{paddingHorizontal:10,color:'black', fontSize:14,paddingHorizontal:10}}>{item.Qualification}</Text></Text>
        <Text style={{width:'100%',paddingHorizontal:10,color:'black', fontSize:14,fontWeight:'800',marginVertical:4}}>Phone: <Text style={{paddingHorizontal:10,color:'black', fontSize:14,paddingHorizontal:10}}>{item.phone}</Text></Text>
        <Text style={{width:'100%',paddingHorizontal:10,color:'black', fontSize:14,fontWeight:'800',marginVertical:4}}>Status: <Text style={{paddingHorizontal:10,color:'black', fontSize:14,paddingHorizontal:10}}>{item.status?'Available':'Unavailable'}</Text></Text>
        </TouchableOpacity>
    ))}
    </ScrollView>
    <TouchableOpacity
        style={{
          backgroundColor: 'blue',
          alignItems: 'center',
          justifyContent: 'center',
          width:'100%',
          height:40,
          textAlign:'center',
          marginVertical:30
        }}
        onPress={loggout}>
    <Text style={{fontSize:16,color:'white'}}>
    Logout
    </Text>
   </TouchableOpacity>
  </View>
  );
}

export default App