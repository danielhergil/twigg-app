// app.config.js
import 'dotenv/config';

export default ({ config }) => ({
  // 1) Copiamos TODO lo que haya en app.json
  ...config,
  // 2) Sobre escribimos/añadimos en `extra`
  extra: {
    ...config.extra,               // TODO lo que ya tenías en app.json -> extra
    firebaseApiKey: process.env.FIREBASE_API_KEY,
    firebaseAuthDomain: process.env.FIREBASE_AUTH_DOMAIN,
    firebaseProjectId: process.env.FIREBASE_PROJECT_ID,
    firebaseStorageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    firebaseMessagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    firebaseAppId: process.env.FIREBASE_APP_ID,
    firebaseMeasurementId: process.env.FIREBASE_MEASUREMENT_ID,
    webClientId: process.env.WEB_CLIENT_ID
  },
});
