import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  FlatList,
} from 'react-native';

interface ChatMessage {
  role: 'user' | 'assistant';
  text: string;
}

const languages: { code: string; name: string }[] = [
  { code: 'en', name: 'English' },
  { code: 'it', name: 'Italian' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
];

const cefrLevels: { code: string; name: string }[] = [
  { code: 'A1', name: 'A1 - Beginner' },
  { code: 'A2', name: 'A2 - Elementary' },
  { code: 'B1', name: 'B1 - Intermediate' },
  { code: 'B2', name: 'B2 - Upper Intermediate' },
  { code: 'C1', name: 'C1 - Advanced' },
  { code: 'C2', name: 'C2 - Proficient' },
];

const ChatScreen: React.FC = () => {
  const [messageInput, setMessageInput] = useState<string>('');
  const [language, setLanguage] = useState<string>('en');
  const [cefrLevel, setCefrLevel] = useState<string>('B1');
  const [conversation, setConversation] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleSendMessage = async () => {
    if (!messageInput.trim()) return;

    setError('');
    setLoading(true);

    // Add the user message to the conversation
    setConversation((prev) => [...prev, { role: 'user', text: messageInput }]);

    try {
      const response = await axios.post(
        'http://localhost:3000/api/chat',
        {
          userMessage: messageInput,
          language: language,
          cefrLevel: cefrLevel,
        },
        {
          headers: { 'Content-Type': 'application/json' },
        },
      );

      // The backend should return something like { response: "<AI reply>" }
      setConversation((prev) => [
        ...prev,
        { role: 'assistant', text: response.data.response || '(No response)' },
      ]);

      setMessageInput('');
    } catch (err: unknown) {
      console.error(err);
      setError('Error sending message. Check server logs or try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>AI Chat</Text>

      {/* Language and level selection */}
      <View style={styles.selectionContainer}>
        <View>
          <Text style={styles.label}>Language:</Text>
          <Picker
            selectedValue={language}
            onValueChange={(value) => setLanguage(value)}
            style={styles.picker}
            dropdownIconColor="#333"
          >
            {languages.map((lang) => (
              <Picker.Item
                key={lang.code}
                label={lang.name}
                value={lang.code}
              />
            ))}
          </Picker>
        </View>

        <View>
          <Text style={styles.label}>Level:</Text>
          <Picker
            selectedValue={cefrLevel}
            onValueChange={(value) => setCefrLevel(value)}
            style={styles.picker}
            dropdownIconColor="#333"
          >
            {cefrLevels.map((level) => (
              <Picker.Item
                key={level.code}
                label={level.name}
                value={level.code}
              />
            ))}
          </Picker>
        </View>
      </View>

      {/* Chat History */}
      <FlatList
        style={styles.chatList}
        data={conversation}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => (
          <View
            style={[
              styles.messageContainer,
              item.role === 'user'
                ? styles.userMessage
                : styles.assistantMessage,
            ]}
          >
            <Text style={styles.messageAuthor}>
              {item.role === 'user' ? 'You' : 'AI'}
            </Text>
            <Text style={styles.messageText}>{item.text}</Text>
          </View>
        )}
      />

      {/* Input Container */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={messageInput}
          onChangeText={setMessageInput}
          placeholder="Type your message..."
          editable={!loading}
        />
        <Button
          title={loading ? 'Sending...' : 'Send'}
          onPress={handleSendMessage}
          disabled={loading}
        />
      </View>

      {/* Error Display */}
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  heading: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
  selectionContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 12,
    gap: 16,
  },
  label: {
    fontSize: 12,
    marginBottom: 8,
    color: '#666',
  },
  picker: {
    borderColor: '#ccc',
    borderWidth: 1,
    width: 180,
  },
  chatList: {
    flex: 1,
    marginBottom: 12,
  },
  messageContainer: {
    padding: 8,
    marginVertical: 4,
    borderRadius: 8,
    maxWidth: '80%',
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#e1ffc7',
  },
  assistantMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#f0f0f0',
  },
  messageAuthor: {
    fontWeight: '700',
  },
  messageText: {
    marginTop: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  input: {
    flex: 1,
    borderColor: '#ccc',
    borderWidth: 1,
    marginRight: 8,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  error: {
    color: 'red',
    textAlign: 'center',
  },
});
