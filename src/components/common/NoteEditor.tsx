import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Animated,
  Easing,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  useWindowDimensions,
} from 'react-native';
import {
  RichEditor,
  RichToolbar,
  actions,
} from 'react-native-pell-rich-editor';
import { RenderHTML } from 'react-native-render-html';

interface NoteEditorProps {
  onSave: (note: { title: string; content: string }) => void;
  initialTitle?: string;
  initialContent?: string;
}

const NoteEditor: React.FC<NoteEditorProps> = ({
  onSave,
  initialTitle = '',
  initialContent = '',
}) => {
  const { width } = useWindowDimensions();
  const richText = useRef<RichEditor | null>(null);

  const [noteTitle, setNoteTitle] = useState<string>(initialTitle);
  const [noteContent, setNoteContent] = useState<string>(initialContent);

  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isEditorReady, setIsEditorReady] = useState(false);
  const editorHeight = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    setNoteTitle(initialTitle);
  }, [initialTitle]);

  useEffect(() => {
    setNoteContent(initialContent);
  }, [initialContent]);

  const openEditor = () => {
    setIsEditorOpen(true);
    Animated.timing(editorHeight, {
      toValue: 1,
      duration: 300,
      easing: Easing.ease,
      useNativeDriver: false,
    }).start();
  };

  const closeEditor = () => {
    Animated.timing(editorHeight, {
      toValue: 0,
      duration: 300,
      easing: Easing.ease,
      useNativeDriver: false,
    }).start(() => {
      setIsEditorOpen(false);
    });
  };

  const handleSave = () => {
    if (noteTitle || noteContent) {
      onSave({ title: noteTitle, content: noteContent });
    }
    closeEditor();
  };

  const handleCancel = () => {
    closeEditor();
  };

  if (!isEditorOpen) {
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.simpleInput} onPress={openEditor}>
          {noteTitle || noteContent ? (
            <View>
              {noteTitle ? (
                <Text style={styles.savedTitle}>{noteTitle}</Text>
              ) : null}
              {noteContent ? (
                <RenderHTML
                  contentWidth={width}
                  source={{ html: noteContent }}
                  tagsStyles={{
                    body: { color: '#000', fontSize: 14 },

                    // Text styles
                    b: { fontWeight: 'bold' },
                    strong: { fontWeight: 'bold' },
                    i: { fontStyle: 'italic' },
                    u: { textDecorationLine: 'underline' },
                    s: { textDecorationLine: 'line-through' },
                    strike: { textDecorationLine: 'line-through' },
                    del: { textDecorationLine: 'line-through' },
                    code: {
                      fontFamily: 'monospace',
                      backgroundColor: '#f4f4f4',
                      padding: 2,
                      borderRadius: 4,
                    },

                    // Lists
                    ul: { marginVertical: 4, paddingLeft: 20 },
                    ol: { marginVertical: 4, paddingLeft: 20 },
                    li: { marginBottom: 2 },

                    // Blockquote
                    blockquote: {
                      borderLeftWidth: 4,
                      borderLeftColor: '#ccc',
                      paddingLeft: 10,
                      color: '#555',
                      fontStyle: 'italic',
                    },

                    // Alignments (RichEditor uses inline styles like text-align)
                    p: { marginVertical: 4 },
                    div: { marginVertical: 4 },
                  }}
                />
              ) : null}
            </View>
          ) : (
            <Text style={styles.placeholderText}>📝 Enter a note...</Text>
          )}
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Animated.View
        style={[
          styles.editorContainer,
          {
            opacity: editorHeight,
            transform: [
              {
                translateY: editorHeight.interpolate({
                  inputRange: [0, 1],
                  outputRange: [50, 0],
                }),
              },
            ],
          },
        ]}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Note</Text>
           <View style={styles.headerControls}>
            {isEditorReady && (
              <RichToolbar
                editor={richText}
                actions={[
                  actions.undo,
                  actions.redo,
                  actions.alignLeft,
                  actions.code,
                ]}
                // style={styles.toolbar}
                iconTint="rgba(0, 0, 0, 1)"
              />
            )}
          </View>
        </View>

        {/* Title Input */}
        <TextInput
          style={styles.titleInput}
          placeholder="Enter Note Title"
          value={noteTitle}
          onChangeText={setNoteTitle}
          placeholderTextColor="#707070"
        />

        {/* Rich Text Toolbar */}
        {isEditorReady && (
          <RichToolbar
            editor={richText}
            actions={[
              actions.setBold,
              actions.setItalic,
              actions.setUnderline,
              actions.setStrikethrough,
              actions.insertLink,
              actions.insertBulletsList,
              actions.insertOrderedList,
              actions.insertImage,
              actions.blockquote,
              actions.line,
              actions.undo,
              actions.redo,
              actions.alignLeft,
              actions.code,
            ]}
            style={styles.toolbar}
            iconTint="#0F6CBD"
          />
        )}

        {/* Rich Text Editor */}
        <View style={styles.richEditorWrapper}>
          <RichEditor
            ref={richText}
            placeholder="📝 Enter a note"
            initialContentHTML={noteContent}
            onChange={(text: string) => {
              setNoteContent(text);
              if (!isEditorReady) setIsEditorReady(true);
            }}
            editorStyle={{
              backgroundColor: '#F9FBFF',
              color: '#242424',
              placeholderColor: '#999',
            }}
            style={styles.richEditor}
          />
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.addButton} onPress={handleSave}>
            <Text style={styles.addText}>Add Note and Close</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </KeyboardAvoidingView>
  );
};

export default NoteEditor;

const styles = StyleSheet.create({
  savedTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  savedContent: {
    fontSize: 14,
    color: '#555',
  },
  container: {
    flex: 1,
  },
  simpleInput: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 20,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  placeholderText: {
    color: '#999',
    fontSize: 16,
  },
  editorContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    flex: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    justifyContent: 'flex-start',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    marginBottom: 8,
    flex:1
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
   headerControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
  },
  titleInput: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    marginVertical: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  toolbar: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingVertical: 8,
    marginBottom: 8,
  },
  richEditorWrapper: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    backgroundColor: '#F9FBFF',
    minHeight: 120,
    marginBottom: 16,
    padding: 4,
  },
  richEditor: {
    minHeight: 100,
    flex: 1,
    borderRadius: 8,
    backgroundColor: '#F9FBFF',
    color: '#242424',
    padding: 8,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
    marginTop: 8,
  },
  addButton: {
    flex: 1,
    backgroundColor: '#0F6CBD',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginRight: 8,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#F9FBFF',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginLeft: 8,
  },
  addText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 15,
  },
  cancelText: {
    color: '#242424',
    fontWeight: 'bold',
    fontSize: 15,
  },
});

