//
// This file is made to test to make a query against the the simple ldap server(ldap_server.js)
//

import ldap from 'ldapjs';
// Connection info
const serverUrl = 'ldap://localhost:1389';
const baseDN = 'cn=admin,dc=mydomain,dc=com';

const bindUsername = 'cn=admin,dc=mydomain,dc=com';
const bindPassword = 'password';



export const checkUser = async (req, res) => {
  try {

    // Create LDAP Client
    const client = ldap.createClient({
      url: serverUrl
    });
    
    const { username, password } = req.body;

    const searchOptions = {
      filter: `(cn=${username})`,
      scope: 'sub',
    };

    // Perform the admin bind operation
    client.bind(bindUsername, bindPassword, (err) => { // Bind as a admin 
      if (err) {
        console.error('Admin Bind Error:', err);
        //res.status(401).json({ message: 'Invalid credentials (Admin)' });
      } else {
        console.log('Admin Bind Successful');
        //res.status(200).json({ message: 'Authentication Successful (Admin)' });
        //console.log('statusCode: ' + res);

        // Perform the user bind operation
        client.bind(`cn=${username},ou=users,dc=mydomain,dc=com`, password, (userBindErr) => {
          if (userBindErr) {
            console.error('User Bind Error:', userBindErr);
            //res.status(401).json({ message: 'Invalid credentials' });
          } else {
            console.log('User Bind Successful');
            //res.status(200).json({ message: 'Authentication Successful' });

            client.search(baseDN, searchOptions, (searchErr, searchRes) => {
              if (searchErr) {
                console.error('Search Error:', searchErr);
              } else {
                searchRes.on('searchEntry', (entry) => {
                  console.log('User Found:', entry.object);
        
                  // Check group membership
                  const userDN = entry.object.dn;
                  const groupDN = 'ou=admin,dc=mydomain,dc=com'; 
        
                  client.compare(groupDN, 'member', userDN, (compareErr, isMember) => {
                    if (compareErr) {
                      console.error('Group Membership Check Error:', compareErr);
                    } else {
                      if (isMember) {
                        console.log('User is a member of the group');
                      } else {
                        console.log('User is not a member of the group');
                      }
                    }
                  });
                });
        
                searchRes.on('error', (error) => {
                  console.error('Search Response Error:', error);
                });
        
                searchRes.on('end', () => {
                  console.log('Search Completed');
                });
              }
            });
          }
        }); 
      }
    });
  } catch (err) {
    console.log(err);
  }
};
