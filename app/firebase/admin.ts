import * as admin from 'firebase-admin';

const serviceAccount = require('../../parkigo-firebase-adminsdk.json');

if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: `https://parkigo.firebaseio.com`
    });
  } catch (error) {
    console.error('Firebase admin initialization error:', error);
  }
}

export { admin };
