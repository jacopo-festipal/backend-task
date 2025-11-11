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

const ChatScreen: React.FC = () => {
  const [messageInput, setMessageInput] = useState<string>('');
  const [language, setLanguage] = useState<string>('en');
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

      {/* Simple language selection */}
      <View style={styles.languageContainer}>
        <Text>Select language: </Text>
        <TextInput
          style={styles.languageInput}
          value={language}
          onChangeText={setLanguage}
          placeholder="e.g., en, es, de"
          autoCapitalize="none"
        />
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
  languageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  languageInput: {
    borderColor: '#ccc',
    borderWidth: 1,
    marginLeft: 8,
    paddingHorizontal: 8,
    width: 80,
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
