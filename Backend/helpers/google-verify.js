const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client( '119178675271-6j9hbbado471d1m36gncl3qv8t8ptemr.apps.googleusercontent.com' );


const googleVerify = async( token ) => {

    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_ID  // Specify the CLIENT_ID of the app that accesses the backend
            // Or, if multiple clients access the backend:
            //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
        });

        const payload = ticket.getPayload();   
        const { name, email, picture } = payload;

        return { name, email, picture };  
    } catch (error) {
        console.log(error)
    }
    
  // If request specified a G Suite domain:
  // const domain = payload['hd'];
}

module.exports = {
    googleVerify
}