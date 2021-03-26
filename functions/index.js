const functions = require("firebase-functions");
const admin = require('firebase-admin');
const { DEFAULT_MIN_VERSION } = require("tls");
admin.initializeApp(functions.config().firebase);

exports.updUser = functions.firestore
.document('users/{uid}')
.onUpdate((chg, ctx) => {
    const userId = ctx.params.userId;

    const newUserName = chg.after.data().displayName;
    const newEmail = chg.after.data().email;

    admin.auth().updateUser(userId, {
        email: newEmail,
        displayName: newUserName
    })
    .then((userRec) => {
        console.log('User updated!', userRec);
    })
    .catch (error => {
        console.log(error.message);
    })
})
