import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
// import * as MediaLibrary from 'expo-media-library';
// import * as Permissions from 'expo-permissions';
// import * as Location from 'expo-location';

export default function App() {
  const [jsonText, setJsonText] = useState('')
  const [csvText, setCsvText] = useState('')

  function handleConvert() {
    if (jsonText === '') return Alert.alert('Obs, ocorreu um erro', 'É preciso digitar um JSON.')
    try {
      const json = JSON.parse(jsonText) as Object[]
      const keys = Object.keys(json[0])

      const fields = keys.join(',') + "\n"
      const lines = json.map((obj: any) => keys.map(key => obj[key]).join(',')).join("\n")

      setCsvText(fields + lines)
    } catch (error) {
      console.log(error)
      Alert.alert('Obs, ocorreu um erro', 'Digite um JSON válido.')
    }
  }

  function handleCopy() {
    Clipboard.setString(csvText)
  }

  function handleDelete() {
    setJsonText('')
    setCsvText('')
  }

  async function handleUploadDocument() {
    try {
      const upload = await DocumentPicker.getDocumentAsync({ type: 'text/*' })

      if (upload.type === 'success') {
        const text = await FileSystem.readAsStringAsync(upload.uri)
        await FileSystem.deleteAsync(upload.uri)
        setJsonText(text)
      }
    } catch (error) {
      Alert.alert('Obs, ocorreu um erro', 'Não foi possivel carregar o JSON!')
    }
  }

  // async function handleDownloadDocument() {
  //   if (csvText === '') return Alert.alert('Obs, ocorreu um erro', 'É preciso ter um CSV para fazer o download!')

  //   try {
  //     // const permissions = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync()

  //     // if (permissions.granted) {
  //     //   const uri = permissions.directoryUri
  //     //   const fileName = '/newCsv'
  //     //   const mimeType = "text/csv"
  //     //   const filePath = `${uri}/${fileName}.csv`

  //     //   await FileSystem.StorageAccessFramework.createFileAsync(uri, fileName, mimeType)
  //     //   // await FileSystem.writeAsStringAsync(filePath, csvText)
  //     //   Alert.alert('Download Completo!')
  //     // }


  //     // const permissions = await Permissions.askAsync(Permissions.MEDIA_LIBRARY)
  //     const { status } = await MediaLibrary.requestPermissionsAsync()
  //     if (status !== 'granted') return Alert.alert('Obs, ocorreu um erro', 'Você precisa permitir o download!')

  //     const permissions = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync()

  //     if (permissions.granted) {
  //       const uri = permissions.directoryUri
  //       console.log(permissions.directoryUri)
  //       const fileName = 'newCsv'
  //       const mimeType = "text/csv"

  //       const files = await FileSystem.readDirectoryAsync(uri);
  //       console.log(`Files inside ${uri}:\n\n${JSON.stringify(files)}`);

  //       // const safeUri = await FileSystem.StorageAccessFramework.createFileAsync(uri, fileName, mimeType)
  //       // console.log(safeUri)
  //       // await FileSystem.writeAsStringAsync(safeUri, csvText)
  //       Alert.alert('Download Completo!')
  //     }

  //   } catch (error) {
  //     console.log('Não foi possivel fazer o download do CSV: ', error)
  //     Alert.alert('Obs, ocorreu um erro', 'Não foi possivel fazer o download do CSV!')
  //   }
  // }

  return (
    <>
      <StatusBar style="dark" backgroundColor="transparent" translucent={false} />
      <View style={styles.container}>
        <TouchableOpacity
          onPress={handleCopy}
          style={styles.textOutput}
        >
          <Text style={styles.textConvertTitle}>CSV</Text>

          <View style={styles.convertContent}>
            <Text style={styles.textConvertCopy}>COPIAR</Text>
            <Text style={styles.textOutputContent}>
              {csvText}
            </Text>
          </View>

        </TouchableOpacity>

        <View style={styles.dividerContent}>
          <TouchableOpacity
            onPress={handleDelete}
            style={styles.dividerButtonDelete}
          >
            <Text style={styles.dividerButtonTitle}>DELETAR</Text>
          </TouchableOpacity>

          <Feather name="arrow-up" size={30} />

          {/* <TouchableOpacity
            onPress={handleDownloadDocument}
            style={styles.dividerButtonDownload}
          >
            <Text style={styles.dividerButtonTitle}>DOWNLOAD</Text>
          </TouchableOpacity> */}
        </View>

        <View style={styles.textInputContainer}>
          <Text style={styles.textConvertTitle}>JSON</Text>
          <TextInput
            textAlignVertical='top'
            style={styles.textInput}
            placeholder='Digite o JSON'
            autoCorrect={false}
            autoCapitalize='none'
            onChangeText={setJsonText}
            value={jsonText}
            multiline
          />
        </View>

        <View style={styles.footer}>
          <TouchableOpacity
            onPress={handleUploadDocument}
            style={styles.uploadButton}
          >
            <Text style={styles.convertTitle}>CARREGAR JSON</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleConvert}
            style={styles.convertButton}
          >
            <Text style={styles.convertTitle}>CONVERTER</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    padding: 12
  },
  textOutput: {
    width: '100%',
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#dfdfdf',
    borderRadius: 10,
  },
  textConvertTitle: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    backgroundColor: '#139992',
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  convertContent: {
    flex: 1
  },
  textConvertCopy: {
    backgroundColor: '#2197ac',
    color: '#FFFFFF',
    fontWeight: 'bold',
    position: 'absolute',
    top: 10,
    right: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  textOutputContent: {
    flex: 1,
    padding: 10
  },
  dividerContent: {
    paddingVertical: 10,
    width: '100%',
    alignItems: 'center',
    flexDirection: 'row',
    // justifyContent: 'space-between',
    justifyContent: 'center',
  },
  dividerButtonDelete: {
    backgroundColor: '#aa1616',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    position: 'absolute',
    right: 0,
  },
  dividerButtonDownload: {
    backgroundColor: '#4f16aa',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  dividerButtonTitle: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#fff'
  },
  textInputContainer: {
    backgroundColor: '#dfdfdf',
    width: '100%',
    flex: 1,
    borderRadius: 10,
  },
  textInput: {
    flex: 1,
    padding: 10
  },
  footer: {
    flexDirection: 'row'
  },
  convertButton: {
    flex: 1,
    height: 50,
    backgroundColor: '#109617',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    marginTop: 10
  },
  uploadButton: {
    flex: 1,
    height: 50,
    backgroundColor: '#106096',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    marginTop: 10,
    marginRight: 10
  },
  convertTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#fff'
  }
});
