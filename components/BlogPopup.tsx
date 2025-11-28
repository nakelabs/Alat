import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Animated,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

interface BlogPost {
  id: number;
  title: string;
  subtitle: string;
  category: string;
  gradient: string[];
  icon: string;
  readTime: string;
  author: string;
  publishDate: string;
  content: string;
}

interface BlogPopupProps {
  visible: boolean;
  blogPost: BlogPost | null;
  onClose: () => void;
}

const { width, height } = Dimensions.get('window');

export default function BlogPopup({ visible, blogPost, onClose }: BlogPopupProps) {
  if (!blogPost) return null;

  const formatContent = (content: string) => {
    // Split content into paragraphs and format special text
    const paragraphs = content.split('\n\n');
    
    return paragraphs.map((paragraph, index) => {
      // Check if it's a heading (starts with **)
      if (paragraph.startsWith('**') && paragraph.includes('**')) {
        const title = paragraph.replace(/\*\*/g, '');
        return (
          <Text key={index} style={styles.contentHeading}>
            {title}
          </Text>
        );
      }
      
      // Check if it's a bullet point list
      if (paragraph.includes('•')) {
        const lines = paragraph.split('\n');
        return (
          <View key={index} style={styles.bulletContainer}>
            {lines.map((line, lineIndex) => {
              if (line.trim().startsWith('•')) {
                return (
                  <Text key={lineIndex} style={styles.bulletPoint}>
                    {line}
                  </Text>
                );
              } else if (line.trim()) {
                return (
                  <Text key={lineIndex} style={styles.contentText}>
                    {line}
                  </Text>
                );
              }
              return null;
            })}
          </View>
        );
      }
      
      // Regular paragraph
      return (
        <Text key={index} style={styles.contentText}>
          {paragraph}
        </Text>
      );
    });
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
      transparent={false}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Blog Post</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          {/* Blog Card Header */}
          <View style={styles.blogHeader}>
            <LinearGradient
              colors={blogPost.gradient as any}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.gradientHeader}
            >
              <View style={styles.blogHeaderContent}>
                <View style={styles.categoryContainer}>
                  <Text style={styles.categoryText}>{blogPost.category.toUpperCase()}</Text>
                </View>
                <Text style={styles.blogTitle}>{blogPost.title}</Text>
                <Text style={styles.blogSubtitle}>{blogPost.subtitle}</Text>
                <View style={styles.blogIconContainer}>
                  <Text style={styles.blogIcon}>{blogPost.icon}</Text>
                </View>
              </View>
            </LinearGradient>
          </View>

          {/* Meta Information */}
          <View style={styles.metaContainer}>
            <View style={styles.metaRow}>
              <View style={styles.metaItem}>
                <Ionicons name="person-outline" size={16} color="#8B0038" />
                <Text style={styles.metaText}>{blogPost.author}</Text>
              </View>
              <View style={styles.metaItem}>
                <Ionicons name="calendar-outline" size={16} color="#8B0038" />
                <Text style={styles.metaText}>{blogPost.publishDate}</Text>
              </View>
              <View style={styles.metaItem}>
                <Ionicons name="time-outline" size={16} color="#8B0038" />
                <Text style={styles.metaText}>{blogPost.readTime}</Text>
              </View>
            </View>
          </View>

          {/* Content */}
          <View style={styles.contentContainer}>
            {formatContent(blogPost.content)}
          </View>

          {/* Call to Action */}
          <View style={styles.ctaContainer}>
            <TouchableOpacity style={styles.ctaButton}>
              <Text style={styles.ctaButtonText}>Start Your Financial Journey</Text>
              <Ionicons name="arrow-forward" size={20} color="#fff" />
            </TouchableOpacity>
            
            <View style={styles.socialContainer}>
              <Text style={styles.socialTitle}>Share this article</Text>
              <View style={styles.socialButtons}>
                <TouchableOpacity style={styles.socialButton}>
                  <Ionicons name="logo-whatsapp" size={24} color="#25D366" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.socialButton}>
                  <Ionicons name="logo-twitter" size={24} color="#1DA1F2" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.socialButton}>
                  <Ionicons name="logo-linkedin" size={24} color="#0077B5" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.socialButton}>
                  <Ionicons name="share-social" size={24} color="#8B0038" />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Bottom Spacing */}
          <View style={styles.bottomSpacing} />
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2a2a2a',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 15,
    borderBottomWidth: 2,
    borderBottomColor: '#8B0038',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#8B0038',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  placeholder: {
    width: 40,
  },
  scrollContainer: {
    flex: 1,
  },
  blogHeader: {
    margin: 20,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#8B0038',
  },
  gradientHeader: {
    padding: 24,
    minHeight: 200,
    justifyContent: 'space-between',
  },
  blogHeaderContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  categoryContainer: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 16,
  },
  categoryText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
  },
  blogTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#fff',
    lineHeight: 30,
    marginBottom: 8,
  },
  blogSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 22,
    marginBottom: 20,
  },
  blogIconContainer: {
    alignSelf: 'flex-end',
    width: 50,
    height: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  blogIcon: {
    fontSize: 24,
  },
  metaContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#3a3a3a',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#8B0038',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  contentContainer: {
    paddingHorizontal: 20,
  },
  contentHeading: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    marginTop: 24,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#8B0038',
    paddingLeft: 16,
  },
  contentText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#e0e0e0',
    marginBottom: 16,
    textAlign: 'justify',
  },
  bulletContainer: {
    marginBottom: 16,
  },
  bulletPoint: {
    fontSize: 16,
    lineHeight: 24,
    color: '#e0e0e0',
    marginBottom: 8,
    paddingLeft: 8,
  },
  ctaContainer: {
    paddingHorizontal: 20,
    marginTop: 30,
  },
  ctaButton: {
    backgroundColor: '#8B0038',
    borderRadius: 12,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 24,
    shadowColor: '#8B0038',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  ctaButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  socialContainer: {
    alignItems: 'center',
  },
  socialTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 16,
  },
  socialButtons: {
    flexDirection: 'row',
    gap: 16,
  },
  socialButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#3a3a3a',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#4a4a4a',
  },
  bottomSpacing: {
    height: 40,
  },
});