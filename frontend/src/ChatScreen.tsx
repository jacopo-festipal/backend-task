import axios, { AxiosError } from 'axios';
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  FlatList,
} from 'react-native';

import { SelectPicker } from './components/SelectPicker';

interface ChatMessage {
  role: 'user' | 'assistant';
  text: string;
  correction?: string;
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

const models: { code: string; name: string }[] = [
  { code: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo' },
  { code: 'gpt-4o-mini', name: 'GPT-4o Mini' },
  { code: 'gpt-4o', name: 'GPT-4o' },
  { code: 'gpt-4', name: 'GPT-4' },
];

const ChatScreen: React.FC = () => {
  const [messageInput, setMessageInput] = useState<string>('');
  const [language, setLanguage] = useState<string>('en');
  const [cefrLevel, setCefrLevel] = useState<string>('B1');
  const [model, setModel] = useState<string>('gpt-3.5-turbo');
  const [conversation, setConversation] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleSendMessage = async () => {
    if (!messageInput.trim()) return;

    setError('');
    setLoading(true);

    const currentMessage = messageInput;

    try {
      // parallel call for both endpoints
      const [chatResponse, correctionResponse] = await Promise.all([
        axios.post(
          'http://localhost:3000/api/chat',
          {
            userMessage: currentMessage,
            language: language,
            cefrLevel: cefrLevel,
            model: model,
          },
          {
            headers: { 'Content-Type': 'application/json' },
          },
        ),
        axios.post(
          'http://localhost:3000/api/correct',
          {
            userMessage: currentMessage,
            language: language,
          },
          {
            headers: { 'Content-Type': 'application/json' },
          },
        ),
      ]);

      const correction = correctionResponse.data.correction;
      const hasError = correction && correction !== 'No corrections needed.';

      setConversation((prev) => [
        ...prev,
        {
          role: 'user',
          text: currentMessage,
          correction: hasError ? correction : undefined,
        },
      ]);

      // The backend should return something like { response: "<AI reply>" }
      setConversation((prev) => [
        ...prev,
        { role: 'assistant', text: chatResponse.data.response || '(No response)' },
      ]);

      setMessageInput('');
    } catch (err) {
      console.error(err);
      const errorMessage =
        err instanceof AxiosError && err.response?.data?.error
          ? err.response.data.error
          : 'Failed to send message. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>AI Chat</Text>

      {/* Language and level selection */}
      <View style={styles.selectionContainer}>
        <SelectPicker
          label="Language"
          selectedValue={language}
          items={languages}
          onValueChange={setLanguage}
        />

        <SelectPicker
          label="Level"
          selectedValue={cefrLevel}
          items={cefrLevels}
          onValueChange={setCefrLevel}
        />

        <SelectPicker
          label="Model"
          selectedValue={model}
          items={models}
          onValueChange={setModel}
        />
      </View>

      {/* Chat History */}
      <FlatList
        style={styles.chatList}
        data={conversation}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => (
          <View>
            <View
              style={[
                styles.messageContainer,
                item.role === 'user'
                  ? item.correction
                    ? styles.userMessageError
                    : styles.userMessage
                  : styles.assistantMessage,
              ]}
            >
              <Text style={styles.messageAuthor}>
                {item.role === 'user' ? 'You' : 'AI'}
              </Text>
              <Text style={styles.messageText}>{item.text}</Text>
            </View>
            {item.role === 'user' && !item.correction && (
              <Text style={styles.correctionSuccess}>Perfect!</Text>
            )}
            {item.correction && (
              <Text style={styles.correctionText}>
                Correction: {item.correction}
              </Text>
            )}
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
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
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
  userMessageError: {
    alignSelf: 'flex-end',
    backgroundColor: '#FCADD1',
  },
  assistantMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#F0F0F0',
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
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  errorContainer: {
    position: 'absolute',
    bottom: 80,
    left: 16,
    right: 16,
    backgroundColor: '#BF3B30',
    padding: 12,
    borderRadius: 8,
    elevation: 5,
  },
  errorText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '500',
  },
  correctionText: {
    alignSelf: 'flex-end',
    fontSize: 12,
    color: '#A62828',
    marginTop: 4,
    marginRight: 8,
    fontStyle: 'italic',
  },
  correctionSuccess: {
    alignSelf: 'flex-end',
    fontSize: 12,
    color: '#2E7D32',
    marginTop: 4,
    marginRight: 8,
    fontWeight: '600',
  },
});
