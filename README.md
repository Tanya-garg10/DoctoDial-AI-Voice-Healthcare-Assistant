# 🏥 DoctoDial - AI Healthcare Triage 

DoctoDial is a voice-based AI healthcare triage application that helps users assess their medical symptoms and provides urgency classification along with nearby hospital recommendations.

## ✨ Features

- 🎤 **Voice Input Support**: Record symptoms in Hindi or English
- 🔊 **Speech-to-Text**: Automatic conversion using Google Speech Recognition
- 🧠 **NLP-based Symptom Extraction**: Intelligent extraction of medical symptoms
- 🩺 **Condition Mapping**: Maps symptoms to possible medical conditions
- 🚨 **Urgency Classification**: Classifies into Emergency / Doctor Visit / Home Care
- 🏥 **Hospital Finder**: Shows nearby hospitals based on urgency and location
- 🌐 **Bilingual**: Supports English and Hindi input

### Google Speech Recognition API

Currently using the free tier. For production, consider:
- Google Cloud Speech-to-Text API
- Azure Speech Service
- AWS Transcribe

### Privacy & Data

- Voice recordings are not stored
- All processing happens locally
- No patient data is transmitted to external servers (except for speech recognition)

## 🔐 Security Considerations

For production deployment:

1. **Data Encryption**: Encrypt all medical data in transit and at rest
2. **User Authentication**: Implement secure user login
3. **HIPAA Compliance**: Ensure compliance with medical data regulations
4. **Secure APIs**: Use environment variables for API keys
5. **Rate Limiting**: Implement rate limiting to prevent abuse

## 🚀 Future Enhancements

- [ ] User authentication and profile management
- [ ] Medical history tracking
- [ ] Doctor appointment booking integration
- [ ] Prescription management
- [ ] Telemedicine video consultation
- [ ] Multi-language support (Tamil, Telugu, Bengali, etc.)
- [ ] Mobile app version (React Native / Flutter)
- [ ] Integration with Electronic Health Records (EHR)
- [ ] AI chatbot for follow-up questions
- [ ] Medication reminders
- [ ] Health tips and preventive care suggestions

## 🐛 Troubleshooting

### Microphone Not Working

- Check browser permissions for microphone access
- Try refreshing the page

### Speech Recognition Errors

- Speak clearly and slowly
- Ensure stable internet connection
- Reduce background noise

## 📚 Tech Stack

- **Frontend**: React / Vite, TypeScript, HTML5, CSS3
- **NLP**: spaCy
- **Backend**: Python, FastAPI
- **Speech Recognition**: SpeechRecognition (Google Speech API)

## 📄 License

This project is licensed under the MIT License

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

**Built with ❤️ for better healthcare accessibility**

