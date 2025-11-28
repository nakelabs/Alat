import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Modal, 
  Animated, 
  Image,
  Dimensions,
  TextInput,
  ScrollView 
} from 'react-native';

interface RatingPopupProps {
  visible: boolean;
  onClose: () => void;
  onNext: (rating: number, feedback?: { reason: string; improvement: string }) => void;
}

const { width, height } = Dimensions.get('window');

const RatingPopup: React.FC<RatingPopupProps> = ({ visible, onClose, onNext }) => {
  const [selectedRating, setSelectedRating] = useState(0);
  const [currentStep, setCurrentStep] = useState<'rating' | 'feedback' | 'thankyou'>('rating');
  const [feedbackReason, setFeedbackReason] = useState('');
  const [improvementSuggestion, setImprovementSuggestion] = useState('');
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // Reset all state when popup opens
      setSelectedRating(0);
      setCurrentStep('rating');
      setFeedbackReason('');
      setImprovementSuggestion('');
      
      // Animate popup entrance
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          tension: 100,
          friction: 8,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Reset animations
      scaleAnim.setValue(0);
      fadeAnim.setValue(0);
    }
  }, [visible]);

  const handleClose = () => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onClose();
    });
  };

  const handleNext = () => {
    if (selectedRating > 0) {
      console.log('Rating selected:', selectedRating);
      if (selectedRating >= 4) {
        // High rating - complete directly
        console.log('High rating (>=4) - completing directly');
        onNext(selectedRating);
        handleClose();
      } else {
        // Low rating - go to feedback step
        console.log('Low rating (<4) - requesting feedback');
        setCurrentStep('feedback');
      }
    }
  };

  const handleFeedbackSubmit = () => {
    // Submit feedback and show thank you
    onNext(selectedRating, {
      reason: feedbackReason,
      improvement: improvementSuggestion
    });
    setCurrentStep('thankyou');
  };

  const handleFinalClose = () => {
    handleClose();
  };

  const renderStar = (index: number) => {
    const filled = index <= selectedRating;
    return (
      <TouchableOpacity
        key={index}
        onPress={() => setSelectedRating(index)}
        style={styles.starButton}
        hitSlop={{ top: 10, bottom: 10, left: 5, right: 5 }}
      >
        <Text style={[styles.star, filled && styles.starFilled]}>
          {filled ? '★' : '☆'}
        </Text>
      </TouchableOpacity>
    );
  };

  if (!visible) {
    return null;
  }

  return (
    <Modal
      transparent={true}
      visible={visible}
      onRequestClose={handleClose}
      statusBarTranslucent={true}
    >
      <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
        <Animated.View 
          style={[
            styles.popupContainer,
            {
              transform: [{ scale: scaleAnim }]
            }
          ]}
        >
          {/* Header with close button and logo */}
          <View style={styles.header}>
            <TouchableOpacity 
              onPress={handleClose} 
              style={styles.closeButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
            
            <View style={styles.logoContainer}>
              <View style={styles.logoTriangle} />
              <View style={styles.logoTriangle2} />
              <Text style={styles.logoText}>ALAT</Text>
            </View>
          </View>

          {/* Main Content */}
          <View style={styles.content}>
            {currentStep === 'rating' && (
              <>
                {/* Title */}
                <Text style={styles.title}>
                  We Care About{'\n'}Your Experience!
                </Text>

                {/* Subtitle */}
                <Text style={styles.subtitle}>
                  Rate The Transaction On A{'\n'}Scale Of 1-5.
                </Text>

                {/* Star Rating */}
                <View style={styles.ratingContainer}>
                  {[1, 2, 3, 4, 5].map(renderStar)}
                </View>

                {/* Next Button */}
                <TouchableOpacity 
                  style={[
                    styles.nextButton,
                    selectedRating === 0 && styles.nextButtonDisabled
                  ]}
                  onPress={handleNext}
                  disabled={selectedRating === 0}
                >
                  <View style={styles.nextButtonContent}>
                    <Text style={[
                      styles.nextButtonText,
                      selectedRating === 0 && styles.nextButtonTextDisabled
                    ]}>
                      NEXT
                    </Text>
                    <Text style={[
                      styles.nextButtonArrow,
                      selectedRating === 0 && styles.nextButtonTextDisabled
                    ]}>
                      ›
                    </Text>
                  </View>
                </TouchableOpacity>
              </>
            )}

            {currentStep === 'feedback' && (
              <ScrollView style={styles.feedbackContainer} showsVerticalScrollIndicator={false}>
                <Text style={styles.feedbackTitle}>
                  Help Us Improve!
                </Text>

                <Text style={styles.feedbackSubtitle}>
                  We'd love to know how we can serve you better.
                </Text>

                {/* Rating Display */}
                <View style={styles.selectedRatingContainer}>
                  <Text style={styles.selectedRatingText}>Your Rating: </Text>
                  <View style={styles.selectedStars}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Text key={star} style={[
                        styles.selectedStar,
                        star <= selectedRating && styles.selectedStarFilled
                      ]}>
                        {star <= selectedRating ? '★' : '☆'}
                      </Text>
                    ))}
                  </View>
                </View>

                {/* Reason Input */}
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>What went wrong?</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="Tell us what didn't meet your expectations..."
                    placeholderTextColor="#999"
                    value={feedbackReason}
                    onChangeText={setFeedbackReason}
                    multiline
                    numberOfLines={3}
                    maxLength={200}
                  />
                </View>

                {/* Improvement Input */}
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>How can we improve?</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="Share your suggestions for improvement..."
                    placeholderTextColor="#999"
                    value={improvementSuggestion}
                    onChangeText={setImprovementSuggestion}
                    multiline
                    numberOfLines={3}
                    maxLength={200}
                  />
                </View>

                {/* Submit Button */}
                <TouchableOpacity 
                  style={[
                    styles.nextButton,
                    (!feedbackReason.trim() && !improvementSuggestion.trim()) && styles.nextButtonDisabled
                  ]}
                  onPress={handleFeedbackSubmit}
                  disabled={!feedbackReason.trim() && !improvementSuggestion.trim()}
                >
                  <View style={styles.nextButtonContent}>
                    <Text style={[
                      styles.nextButtonText,
                      (!feedbackReason.trim() && !improvementSuggestion.trim()) && styles.nextButtonTextDisabled
                    ]}>
                      SUBMIT
                    </Text>
                  </View>
                </TouchableOpacity>
              </ScrollView>
            )}

            {currentStep === 'thankyou' && (
              <>
                <View style={styles.thankYouIcon}>
                  <Text style={styles.thankYouEmoji}>🙏</Text>
                </View>

                <Text style={styles.thankYouTitle}>
                  Thank You For{'\n'}Your Feedback!
                </Text>

                <Text style={styles.thankYouMessage}>
                  We truly appreciate your input and will use it to improve our services. Your experience matters to us!
                </Text>

                <TouchableOpacity 
                  style={styles.thankYouButton}
                  onPress={handleFinalClose}
                >
                  <Text style={styles.thankYouButtonText}>DONE</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  popupContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    width: width * 0.85,
    maxWidth: 350,
    paddingVertical: 25,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 15,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  closeButton: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 18,
    color: '#666',
    fontWeight: 'bold',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  logoTriangle: {
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderBottomWidth: 14,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#9E1E33',
    marginRight: -8,
  },
  logoTriangle2: {
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderBottomWidth: 10,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#9E1E33',
    marginRight: 5,
    opacity: 0.7,
  },
  logoText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#9E1E33',
    letterSpacing: 0.5,
  },
  content: {
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#9E1E33',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 20,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 12,
    color: '#9E1E33',
    textAlign: 'center',
    lineHeight: 16,
    marginBottom: 30,
    opacity: 0.8,
  },
  ratingContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 35,
    gap: 8,
  },
  starButton: {
    padding: 5,
  },
  star: {
    fontSize: 24,
    color: '#D3D3D3',
  },
  starFilled: {
    color: '#FFD700',
  },
  nextButton: {
    backgroundColor: '#9E1E33',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 40,
    shadowColor: '#9E1E33',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  nextButtonDisabled: {
    backgroundColor: '#D3D3D3',
    shadowOpacity: 0,
    elevation: 0,
  },
  nextButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  nextButtonTextDisabled: {
    color: '#999',
  },
  nextButtonArrow: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 2,
  },
  // Feedback Screen Styles
  feedbackContainer: {
    maxHeight: 400,
    width: '100%',
  },
  feedbackTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#9E1E33',
    textAlign: 'center',
    marginBottom: 10,
    letterSpacing: -0.3,
  },
  feedbackSubtitle: {
    fontSize: 12,
    color: '#9E1E33',
    textAlign: 'center',
    lineHeight: 16,
    marginBottom: 20,
    opacity: 0.8,
  },
  selectedRatingContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 25,
    padding: 10,
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
  },
  selectedRatingText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
  },
  selectedStars: {
    flexDirection: 'row',
    marginLeft: 5,
  },
  selectedStar: {
    fontSize: 16,
    color: '#D3D3D3',
    marginHorizontal: 1,
  },
  selectedStarFilled: {
    color: '#FFD700',
  },
  inputContainer: {
    marginBottom: 20,
    width: '100%',
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#9E1E33',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: '#333',
    backgroundColor: '#FAFAFA',
    textAlignVertical: 'top',
    minHeight: 80,
  },
  // Thank You Screen Styles
  thankYouIcon: {
    alignItems: 'center',
    marginBottom: 20,
  },
  thankYouEmoji: {
    fontSize: 48,
  },
  thankYouTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#9E1E33',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 15,
    letterSpacing: -0.3,
  },
  thankYouMessage: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 30,
    paddingHorizontal: 10,
  },
  thankYouButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 40,
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  thankYouButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
});

export default RatingPopup;