//
// Simple Server made for testing
// This file is not used for Inventory System
//

import ldap from 'ldapjs';

// Create LDAP Server
const server = ldap.createServer();

// Event handler for "bind" operation
server.bind('cn=admin,dc=mydomain,dc=com', (req, res, next) => {
  // Perform authentication logic here
  // Check credentials and determine if the bind operation is successful

  // Example: Allow bind if the username is "admin" and the password is "password"
  if (req.dn.toString() === 'cn=admin,dc=mydomain,dc=com' && req.credentials === 'password') {
    res.end();
    return next();
  }

  // If the credentials are incorrect, return an LDAP "InvalidCredentialsError"
  return next(new ldap.InvalidCredentialsError());
});

// Event handler for "add" operation to add users and groups
server.add('ou=users,dc=mydomain,dc=com', (req, res, next) => {
  const isUser = req.dn.toString().startsWith('cn=');

  if (isUser) {
    const username = req.dn.rdns[0].cn;
    const userAttributes = req.toObject().attributes;

    // Perform user-specific logic here
    // Create the user entry with the provided attributes
    // You can customize the attributes and the way you store the user information

    const userEntry = {
      cn: username,
      sn: userAttributes.sn,
      givenName: userAttributes.givenName,
      // Add more attributes as needed
    };

    // Add the user entry to the LDAP server
    server.backend.add(req, res, next, [userEntry]);
  } else {
    // If it is not a user entry, handle it accordingly (e.g., ignore or reject)
    return next();
  }
});

server.add('ou=groups,dc=mydomain,dc=com', (req, res, next) => {
  const isGroup = req.dn.toString().startsWith('cn=');

  if (isGroup) {
    const groupName = req.dn.rdns[0].cn;
    const groupAttributes = req.toObject().attributes;

    // Perform group-specific logic here
    // Create the group entry with the provided attributes
    // You can customize the attributes and the way you store the group information

    const groupEntry = {
      cn: groupName,
      description: groupAttributes.description,
      // Add more attributes as needed
    };

    // Add the group entry to the LDAP server
    server.backend.add(req, res, next, [groupEntry]);
  } else {
    // If it is not a group entry, handle it accordingly (e.g., ignore or reject)
    return next();
  }
});

// Start the LDAP server
server.listen(1389, 'localhost', () => {
  console.log('LDAP server is running on ldap://localhost:1389');
});
