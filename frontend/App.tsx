import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';

import ChatScreen from './src/ChatScreen';

console.info('[app]: starting');

export default function App() {
  console.log('starting');
  return (
    <SafeAreaView style={styles.container}>
      <ChatScreen />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
