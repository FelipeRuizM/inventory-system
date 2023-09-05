//
// Client made for testing to connect with the simple server(ldap_server.js)
// This file is not used for Inventory System
//

import ldap from 'ldapjs';
// Connection info
const serverUrl = 'ldap://localhost:1389';
const bindDN = 'cn=admin,dc=mydomain,dc=com';
const bindPassword = 'password';

export const checkUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Create LDAP Client
    const client = ldap.createClient({
      url: serverUrl
    });

    return new Promise((resolve, reject) => {
      client.bind(`cn=${username},${bindDN}`, password, (err) => {
        if (err) {
          console.error('Bind Error:', err);
          reject(err);
          res.status(401).json({ message: 'Invalid credentials' });
        } else {
          console.log('Bind Successful');
          resolve(true);
          res.status(200).json({ message: 'Authentication Successful' });
        }
      })
    });
    // Perform the bind operation

    // client.bind(`cn=${username},${bindDN}`, password, (err) => {
    //   if (err) {
    //     console.error('Bind Error:', err);
    //     res.status(401).json({ message: 'Invalid credentials' });
    //   } else {
    //     console.log('Bind Successful');
    // Perform other LDAP operations
    // ...

    // 1.
    // Check user's attributes to determine role
    // if (/* Check if user is in "admin" group */) {
    //   res.status(200).json({ role: 'admin' }); // or return the string "admin"
    // } else {
    //   res.status(200).json({ role: 'student' });
    // }


    // 2. 
    //client.search()


    // Unbind when finished
    // client.unbind((err) => {
    //   if (err) {
    //     console.error('Unbind Error:', err);
    //   } else {
    //     console.log('Unbind Successful');
    //   }
    // });

    //res.status(200).json({ message: 'Authentication Successful' });

    // });
  } catch (err) {
    console.log(err);
  }
};
