// // FormScreen.js this code works and hits the API Gateway endpoint and lambda tiggers correctly
import Config from 'react-native-config';
import React, {useState, useContext} from 'react';
import {
  ScrollView,
  View,
  Text,
  TextInput,
  Switch,
  Button,
  Alert,
} from 'react-native';
import axios from 'axios';
import AuthContext from '../services/AuthContext';
import styles from '../styles/styles'; // Import common styles

const FormScreen = ({route}) => {
  const {token} = useContext(AuthContext);

  const [employeeDepartment, setEmployeeDepartment] = useState('');
  const [school, setSchool] = useState('');
  const [periodEnding, setPeriodEnding] = useState('');
  const [tripPurpose, setTripPurpose] = useState('');
  const [travel, setTravel] = useState(false);
  const [travelStartDate, setTravelStartDate] = useState('');
  const [travelEndDate, setTravelEndDate] = useState('');

  const handleSubmit = async () => {
    const payload = {
      employeeDepartment,
      school,
      periodEnding,
      tripPurpose,
      travel: travel ? 'Yes' : 'No',
      travelStartDate,
      travelEndDate,
    };

    try {
      const response = await axios.post(Config.API_ENDPOINT, payload, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      Alert.alert('Success', 'Form submitted successfully');
      console.log(response.data);
    } catch (error) {
      console.error('Form submission failed', error);
      Alert.alert('Error', 'Form submission failed');
    }
  };

  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Employee/Department:</Text>
        <TextInput
          style={styles.input}
          value={employeeDepartment}
          onChangeText={setEmployeeDepartment}
          placeholder="Employee/Department"
        />
      </View>
      <View style={styles.formGroup}>
        <Text style={styles.label}>School:</Text>
        <TextInput
          style={styles.input}
          value={school}
          onChangeText={setSchool}
          placeholder="School"
        />
      </View>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Period Ending (YYYY-MM-DD):</Text>
        <TextInput
          style={styles.input}
          value={periodEnding}
          onChangeText={setPeriodEnding}
          placeholder="YYYY-MM-DD"
        />
      </View>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Trip Purpose:</Text>
        <TextInput
          style={styles.input}
          value={tripPurpose}
          onChangeText={setTripPurpose}
          placeholder="Trip Purpose"
        />
      </View>
      <View style={styles.formGroup}>
        <Text style={styles.label}>
          Travel (includes per diem *not implemented*):
        </Text>
        <Switch
          style={styles.switchBase}
          value={travel}
          onValueChange={setTravel}
        />
      </View>
      {travel && (
        <>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Travel Start Date (YYYY-MM-DD):</Text>
            <TextInput
              style={styles.input}
              value={travelStartDate}
              onChangeText={setTravelStartDate}
              placeholder="YYYY-MM-DD"
            />
          </View>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Travel End Date (YYYY-MM-DD):</Text>
            <TextInput
              style={styles.input}
              value={travelEndDate}
              onChangeText={setTravelEndDate}
              placeholder="YYYY-MM-DD"
            />
          </View>
        </>
      )}
      <View style={styles.buttonContainer}>
        <Button title="Submit" onPress={handleSubmit} color="#555" />
      </View>
    </ScrollView>
  );
};

export default FormScreen;

//below contains css where above the css has been pull into styles.cs
// import Config from 'react-native-config';
// import React, {useState, useContext} from 'react';
// import {
//   ScrollView,
//   View,
//   Text,
//   TextInput,
//   Switch,
//   Button,
//   StyleSheet,
//   Alert,
// } from 'react-native';
// import axios from 'axios';
// import AuthContext from '../services/AuthContext';

// const FormScreen = ({route}) => {
//   const {token} = useContext(AuthContext);

//   const [employeeDepartment, setEmployeeDepartment] = useState('');
//   const [school, setSchool] = useState('');
//   const [periodEnding, setPeriodEnding] = useState('');
//   const [tripPurpose, setTripPurpose] = useState('');
//   const [travel, setTravel] = useState(false);
//   const [travelStartDate, setTravelStartDate] = useState('');
//   const [travelEndDate, setTravelEndDate] = useState('');

//   const handleSubmit = async () => {
//     const payload = {
//       employeeDepartment,
//       school,
//       periodEnding,
//       tripPurpose,
//       travel: travel ? 'Yes' : 'No',
//       travelStartDate,
//       travelEndDate,
//     };

//     try {
//       const response = await axios.post(
//         Config.API_ENDPOINT, // Use the API_ENDPOINT from .env
//         payload,
//         {
//           headers: {
//             'Content-Type': 'application/json',
//             Authorization: `Bearer ${token}`,
//           },
//         },
//       );

//       Alert.alert('Success', 'Form submitted successfully');
//       console.log(response.data);
//     } catch (error) {
//       console.error('Form submission failed', error);
//       Alert.alert('Error', 'Form submission failed');
//     }
//   };

//   return (
//     <ScrollView style={styles.container}>
//       <View style={styles.formGroup}>
//         <Text style={styles.label}>Employee/Department:</Text>
//         <TextInput
//           style={styles.input}
//           value={employeeDepartment}
//           onChangeText={setEmployeeDepartment}
//           placeholder="Employee/Department"
//         />
//       </View>

//       <View style={styles.formGroup}>
//         <Text style={styles.label}>School:</Text>
//         <TextInput
//           style={styles.input}
//           value={school}
//           onChangeText={setSchool}
//           placeholder="School"
//         />
//       </View>

//       <View style={styles.formGroup}>
//         <Text style={styles.label}>Period Ending (YYYY-MM-DD):</Text>
//         <TextInput
//           style={styles.input}
//           value={periodEnding}
//           onChangeText={setPeriodEnding}
//           placeholder="YYYY-MM-DD"
//         />
//       </View>

//       <View style={styles.formGroup}>
//         <Text style={styles.label}>Trip Purpose:</Text>
//         <TextInput
//           style={styles.input}
//           value={tripPurpose}
//           onChangeText={setTripPurpose}
//           placeholder="Trip Purpose"
//         />
//       </View>

//       <View style={styles.formGroup}>
//         <Text style={styles.label}>
//           Travel (includes per diem *not implemented*):
//         </Text>
//         <Switch value={travel} onValueChange={setTravel} />
//       </View>

//       {travel && (
//         <>
//           <View style={styles.formGroup}>
//             <Text style={styles.label}>Travel Start Date (YYYY-MM-DD):</Text>
//             <TextInput
//               style={styles.input}
//               value={travelStartDate}
//               onChangeText={setTravelStartDate}
//               placeholder="YYYY-MM-DD"
//             />
//           </View>

//           <View style={styles.formGroup}>
//             <Text style={styles.label}>Travel End Date (YYYY-MM-DD):</Text>
//             <TextInput
//               style={styles.input}
//               value={travelEndDate}
//               onChangeText={setTravelEndDate}
//               placeholder="YYYY-MM-DD"
//             />
//           </View>
//         </>
//       )}

//       <Button title="Submit" onPress={handleSubmit} color="#555" />
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#333',
//     padding: 20,
//   },
//   formGroup: {
//     marginBottom: 20,
//   },
//   label: {
//     color: '#fff',
//     marginBottom: 5,
//   },
//   input: {
//     backgroundColor: '#222',
//     color: '#ddd',
//     paddingHorizontal: 10,
//     paddingVertical: 8,
//     borderRadius: 4,
//     borderWidth: 1,
//     borderColor: '#555',
//   },
// });

// export default FormScreen;
