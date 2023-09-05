//
// This file is to experiment which info given works
//

import ldap from 'ldapjs';

// Connection info of Active Directory(AD)
const adUrl = 'ldap://INTRAINT1.intra.camosun.bc.ca';
const baseDN = 'DC=intra,DC=camosun,DC=bc,DC=ca';

const agentUsername = 'elexagentinv';
const agentPassword = 'T$rP7!4sQ';

const studenUsername = 'elexCapstoneTest';
const studentPassword = 'Camosun123$';

// Create LDAP Client
const client = ldap.createClient({ url: adUrl });


const checkUser = (req, res) => {

  const { username, password } = req.body;

  // bind user
  return new Promise((resolve, reject) => {
    client.bind(username, password, (err) => {
      if (err instanceof ldap.InvalidCredentialsError) {
        // resolve false if invalid credentials
        console.log("resolve false if invalid credentials")
        res.status(401).json({ message: "Authentication failed" });
        client.unbind(() => {
          client.destroy();
          resolve(false);
        });
      } 
      // else if (err) {
      //   // reject if error
      //   console.log("reject")
      //   client.unbind(() => {
      //     client.destroy();
      //     reject(err);
      //   });
      // }
      else {
        // resolve true if valid credentials
        console.log("resolve");
        
        client.unbind(() => {
          client.destroy();
          resolve(true);
        });
      }
    });
  })
}

checkUser(studenUsername, studentPassword)
  .then((result) => {
    if (result) {
      console.log("Authentication succeeded");

      return new Promise((resolve, reject) => {
        client.bind(agentUsername, agentPassword, (err) => {
          console.log("Bind Success with agent cred");
        });
      });
    } else {
      console.log("Authentication failed");
    }
  })












  
// Experiment BASE DN(Distinguished Name):
// Try searching using baseDN
// client.search(baseDN, { scope: 'base', filter: '(objectClass=*)' }, (error, res) => {
//     if (error) {
//       console.error('Error searching for base DN:', error);
//     } else {
//       res.on('searchEntry', (entry) => {
//         console.log('Base DN exists:', entry.object);
//       });
  
//       res.on('error', (searchError) => {
//         console.error('Error searching for base DN:', searchError);
//       });
  
//       res.on('end', () => {
//         console.log('Base DN search completed');
//       });
//     }
//   });