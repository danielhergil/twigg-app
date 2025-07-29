import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  Dimensions,
} from 'react-native';
import { Sparkles, ArrowRight } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';
import { getFontSize, getSpacing, isWeb, isDesktop } from '@/utils/responsive';

const { width } = Dimensions.get('window');

export default function CreateScreen() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState('');
  const [level, setLevel] = useState('Básico');
  const [isGenerating, setIsGenerating] = useState(false);

  const levels = ['Básico', 'Intermedio', 'Avanzado'];

  const handleGenerateCourse = async () => {
    if (!title.trim() || !description.trim() || !duration.trim()) {
      Alert.alert('Error', 'Por favor completa todos los campos requeridos');
      return;
    }

    setIsGenerating(true);
    
    // Simulamos la generación del curso
    setTimeout(() => {
      setIsGenerating(false);
      Alert.alert(
        'Curso Generado',
        '¡Tu curso ha sido generado exitosamente con IA!',
        [{ text: 'Ver Curso', onPress: () => console.log('Ver curso generado') }]
      );
    }, 3000);
  };

  const LevelButton = ({ levelOption }: { levelOption: string }) => (
    <TouchableOpacity
      style={[
        styles.levelButton,
        level === levelOption && styles.levelButtonActive
      ]}
      onPress={() => setLevel(levelOption)}
    >
      <Text
        style={[
          styles.levelButtonText,
          level === levelOption && styles.levelButtonTextActive
        ]}
      >
        {levelOption}
      </Text>
    </TouchableOpacity>
  );

  const renderWebLayout = () => (
    <View style={styles.webContainer}>
      <View style={styles.webSidebar}>
        <View style={styles.webHeader}>
          <Sparkles size={40} color={Colors.primary} />
          <Text style={styles.webTitle}>Crear Curso con IA</Text>
          <Text style={styles.webSubtitle}>
            Describe tu curso y la IA generará el contenido completo para ti
          </Text>
        </View>

        <View style={styles.webInfoBox}>
          <Text style={styles.webInfoTitle}>¿Cómo funciona?</Text>
          <Text style={styles.webInfoText}>
            1. Completa la información básica del curso{'\n'}
            2. Nuestra IA generará módulos, lecciones y evaluaciones{'\n'}
            3. Podrás editar y personalizar el contenido generado{'\n'}
            4. Publica tu curso para que otros puedan acceder
          </Text>
        </View>
      </View>

      <View style={styles.webMainContent}>
        <ScrollView style={styles.webScrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.webForm}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Título del Curso *</Text>
              <TextInput
                style={styles.webInput}
                placeholder="Ej: Introducción a React Native"
                placeholderTextColor={Colors.textLight}
                value={title}
                onChangeText={setTitle}
                multiline
                numberOfLines={2}
              />
            </View>

            <View style={styles.webInputRow}>
              <View style={[styles.inputGroup, { flex: 1, marginRight: getSpacing('md') }]}>
                <Text style={styles.label}>Duración (semanas) *</Text>
                <TextInput
                  style={styles.webInput}
                  placeholder="Ej: 8"
                  placeholderTextColor={Colors.textLight}
                  value={duration}
                  onChangeText={setDuration}
                  keyboardType="numeric"
                />
              </View>

              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.label}>Nivel de Dificultad</Text>
                <View style={styles.webLevelContainer}>
                  {levels.map((levelOption) => (
                    <LevelButton key={levelOption} levelOption={levelOption} />
                  ))}
                </View>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Descripción y Enfoque del Curso *</Text>
              <Text style={styles.labelSubtext}>
                Describe qué quieres enseñar, objetivos, público objetivo, etc.
              </Text>
              <TextInput
                style={[styles.webInput, styles.webTextArea]}
                placeholder="Describe el enfoque, objetivos y contenido que quieres que tenga tu curso..."
                placeholderTextColor={Colors.textLight}
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={8}
                textAlignVertical="top"
              />
            </View>

            <TouchableOpacity
              style={[
                styles.generateButton,
                isGenerating && styles.generateButtonDisabled
              ]}
              onPress={handleGenerateCourse}
              disabled={isGenerating}
            >
              <View style={styles.generateButtonContent}>
                <Sparkles 
                  size={20} 
                  color={Colors.white} 
                  style={isGenerating ? styles.spinningIcon : {}} 
                />
                <Text style={styles.generateButtonText}>
                  {isGenerating ? 'Generando Curso...' : 'Generar Curso con IA'}
                </Text>
                {!isGenerating && (
                  <ArrowRight size={20} color={Colors.white} />
                )}
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </View>
  );

  const renderMobileLayout = () => (
    <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Sparkles size={32} color={Colors.primary} />
        <Text style={styles.title}>Crear Curso con IA</Text>
        <Text style={styles.subtitle}>
          Describe tu curso y la IA generará el contenido completo para ti
        </Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Título del Curso *</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej: Introducción a React Native"
            placeholderTextColor={Colors.textLight}
            value={title}
            onChangeText={setTitle}
            multiline
            numberOfLines={2}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Duración (en semanas) *</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej: 8"
            placeholderTextColor={Colors.textLight}
            value={duration}
            onChangeText={setDuration}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Nivel de Dificultad</Text>
          <View style={styles.levelContainer}>
            {levels.map((levelOption) => (
              <LevelButton key={levelOption} levelOption={levelOption} />
            ))}
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Descripción y Enfoque del Curso *</Text>
          <Text style={styles.labelSubtext}>
            Describe qué quieres enseñar, objetivos, público objetivo, etc.
          </Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Describe el enfoque, objetivos y contenido que quieres que tenga tu curso..."
            placeholderTextColor={Colors.textLight}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={6}
            textAlignVertical="top"
          />
        </View>

        <TouchableOpacity
          style={[
            styles.generateButton,
            isGenerating && styles.generateButtonDisabled
          ]}
          onPress={handleGenerateCourse}
          disabled={isGenerating}
        >
          <View style={styles.generateButtonContent}>
            <Sparkles 
              size={20} 
              color={Colors.white} 
              style={isGenerating ? styles.spinningIcon : {}} 
            />
            <Text style={styles.generateButtonText}>
              {isGenerating ? 'Generando Curso...' : 'Generar Curso con IA'}
            </Text>
            {!isGenerating && (
              <ArrowRight size={20} color={Colors.white} />
            )}
          </View>
        </TouchableOpacity>

        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>¿Cómo funciona?</Text>
          <Text style={styles.infoText}>
            1. Completa la información básica del curso{'\n'}
            2. Nuestra IA generará módulos, lecciones y evaluaciones{'\n'}
            3. Podrás editar y personalizar el contenido generado{'\n'}
            4. Publica tu curso para que otros puedan acceder
          </Text>
        </View>
      </View>
    </ScrollView>
  );

  return (
    <SafeAreaView style={styles.container}>
      {isWeb && isDesktop ? renderWebLayout() : renderMobileLayout()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundSecondary,
  },
  // Web-specific styles
  webContainer: {
    flex: 1,
    flexDirection: 'row',
    maxWidth: 1400,
    alignSelf: 'center',
    width: '100%',
  },
  webSidebar: {
    width: 400,
    backgroundColor: Colors.surface,
    padding: getSpacing('xl'),
    borderRightWidth: 1,
    borderRightColor: Colors.borderLight,
  },
  webMainContent: {
    flex: 1,
    padding: getSpacing('xl'),
  },
  webHeader: {
    alignItems: 'center',
    textAlign: 'center',
    marginBottom: getSpacing('xl'),
  },
  webTitle: {
    fontSize: getFontSize('xxl'),
    fontWeight: 'bold',
    color: Colors.text,
    marginTop: getSpacing('md'),
    marginBottom: getSpacing('sm'),
  },
  webSubtitle: {
    fontSize: getFontSize('lg'),
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: getFontSize('lg') * 1.4,
  },
  webScrollView: {
    flex: 1,
  },
  webForm: {
    gap: getSpacing('xl'),
  },
  webInputRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  webInput: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    padding: getSpacing('lg'),
    fontSize: getFontSize('md'),
    backgroundColor: Colors.surface,
    color: Colors.text,
    minHeight: 50,
  },
  webTextArea: {
    minHeight: 150,
    maxHeight: 250,
  },
  webLevelContainer: {
    flexDirection: 'row',
    gap: getSpacing('sm'),
    flexWrap: 'wrap',
    marginTop: getSpacing('sm'),
  },
  webInfoBox: {
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 12,
    padding: getSpacing('lg'),
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
  },
  webInfoTitle: {
    fontSize: getFontSize('lg'),
    fontWeight: '600',
    color: Colors.text,
    marginBottom: getSpacing('md'),
  },
  webInfoText: {
    fontSize: getFontSize('md'),
    color: Colors.textSecondary,
    lineHeight: getFontSize('md') * 1.5,
  },
  // Mobile styles
  scrollView: {
    flex: 1,
  },
  header: {
    backgroundColor: Colors.surface,
    padding: getSpacing('lg'),
    alignItems: 'center',
    textAlign: 'center',
  },
  title: {
    fontSize: getFontSize('xl'),
    fontWeight: 'bold',
    color: Colors.text,
    marginTop: getSpacing('md'),
    marginBottom: getSpacing('sm'),
  },
  subtitle: {
    fontSize: getFontSize('md'),
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: getFontSize('md') * 1.4,
  },
  form: {
    padding: getSpacing('lg'),
    gap: getSpacing('lg'),
  },
  inputGroup: {
    gap: getSpacing('sm'),
  },
  label: {
    fontSize: getFontSize('sm'),
    fontWeight: '600',
    color: Colors.text,
  },
  labelSubtext: {
    fontSize: getFontSize('xs'),
    color: Colors.textSecondary,
    marginTop: -getSpacing('xs'),
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    padding: getSpacing('md'),
    fontSize: getFontSize('md'),
    backgroundColor: Colors.surface,
    color: Colors.text,
  },
  textArea: {
    minHeight: 120,
    maxHeight: 120,
  },
  levelContainer: {
    flexDirection: 'row',
    gap: getSpacing('sm'),
    flexWrap: 'wrap',
  },
  levelButton: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 20,
    paddingHorizontal: getSpacing('lg'),
    paddingVertical: getSpacing('sm'),
  },
  levelButtonActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  levelButtonText: {
    fontSize: getFontSize('sm'),
    fontWeight: '500',
    color: Colors.textSecondary,
  },
  levelButtonTextActive: {
    color: Colors.white,
  },
  generateButton: {
    backgroundColor: Colors.primary,
    borderRadius: 16,
    padding: getSpacing('lg'),
    alignItems: 'center',
    marginTop: getSpacing('md'),
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  generateButtonDisabled: {
    backgroundColor: Colors.textLight,
    shadowOpacity: 0,
    elevation: 0,
  },
  generateButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: getSpacing('sm'),
  },
  generateButtonText: {
    color: Colors.white,
    fontSize: getFontSize('md'),
    fontWeight: '600',
  },
  spinningIcon: {
    // En React Native no tenemos CSS animations nativas, pero esto es una referencia visual
  },
  infoBox: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: getSpacing('lg'),
    marginTop: getSpacing('md'),
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
  },
  infoTitle: {
    fontSize: getFontSize('md'),
    fontWeight: '600',
    color: Colors.text,
    marginBottom: getSpacing('sm'),
  },
  infoText: {
    fontSize: getFontSize('sm'),
    color: Colors.textSecondary,
    lineHeight: getFontSize('sm') * 1.5,
  },
});