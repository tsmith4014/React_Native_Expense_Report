import {StyleSheet} from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#333', // Background color is set to a dark shade for visibility
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 8,
    width: '100%',
    color: '#fff', // Input text color is white for contrast
    backgroundColor: '#555', // Input background is darker for contrast
  },
  label: {
    alignSelf: 'flex-start',
    marginLeft: 10,
    marginBottom: 5,
    fontWeight: 'bold',
    color: '#fff', // Label color is white for better visibility
  },
  button: {
    color: '#007BFF', // Example button color
  },
  image: {
    width: 300,
    height: 300,
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#000',
  },
  linkText: {
    color: 'blue',
    marginTop: 10,
    textDecorationLine: 'underline',
  },
  formContainer: {
    marginTop: 20,
    width: '100%',
    padding: 10,
  },
  dateInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    justifyContent: 'center',
    paddingLeft: 8,
    width: '100%',
  },
  inputText: {
    color: '#fff', // Ensuring the text inside the date picker is also white
  },
  formGroup: {
    marginBottom: 20,
  },
  scrollView: {
    backgroundColor: '#333',
    padding: 20,
  },
  switchBase: {
    marginVertical: 10,
  },
  buttonContainer: {
    marginTop: 12,
  },
  textButton: {
    textDecorationLine: 'underline',
    color: 'blue',
    padding: 10,
  },
  picker: {
    height: 216,
    width: '100%',
    backgroundColor: '#555',
  },
  pickerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)', // Semi-transparent background for the modal
  },
  pickerInputText: {
    color: '#fff', // White color for better visibility
    paddingVertical: 10, // Center the text vertically within the picker input
  },
});
