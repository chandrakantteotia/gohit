const admin = require('firebase-admin');
// const serviceAccount = require('./serviceAccountKey.json');
const serviceAccount = require('/etc/secrets/serviceAccountKey.json'); 

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const uid = 'f4LDhgwfLGblAU98AkROdCuTY783';

admin
  .auth()
  .setCustomUserClaims(uid, { admin: true })
  .then(() => {
    console.log('✅ Admin claim set successfully for UID:', uid);
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Error setting admin claim:', error);
    process.exit(1);
  });
