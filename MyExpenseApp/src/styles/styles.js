import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#333',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 8,
    width: '100%',
    color: '#fff',
    backgroundColor: '#555',
  },
  label: {
    alignSelf: 'flex-start',
    marginLeft: 10,
    marginBottom: 5,
    fontWeight: 'bold',
    color: '#fff',
  },
  button: {
    color: '#007BFF', // example button color
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
  }
});
