// utils/googleSignIn.ts
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import Constants from 'expo-constants';

const extras = (Constants.expoConfig?.extra ?? {}) as Record<string, string>;
const webClientId = extras.webClientId; // si lo usas también en native para obtener idToken

let configured = false;

export function ensureGoogleSigninConfigured() {
  if (configured) return;
  GoogleSignin.configure({
    webClientId, // para obtener idToken usable con Firebase (en Android suele ser suficiente)
    offlineAccess: true,
    // si tienes iosClientId/other, agrégalos aquí también
    // iosClientId: '<TU_IOS_CLIENT_ID>',
  });
  configured = true;
}
