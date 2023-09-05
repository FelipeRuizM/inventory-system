import ldap from 'ldapjs';
import jwt from 'jsonwebtoken';
import User from '../models/user-schema.js';

// Connection info of Active Directory(AD)
const adUrl = process.env.AD_BASE_URL;
const baseDN = process.env.AD_BASE_DN;
//const baseDN = 'OU=Agents,OU=TT Users and Groups,OU=Trades and Tech,OU=Workstations,DC=intra,DC=camosun,DC=bc,DC=ca';


// Agent Credential 
const agentUsername = process.env.AGENT_USERNAME;
const agentPassword = process.env.AGENT_PASSWORD;


export const checkUser = async (req, res) => {
  // Create LDAP Client
  const client = ldap.createClient({ url: adUrl });

  const { username, password } = req.body;

  // Authenticate user by bind
  return new Promise((resolve, reject) => {
    if (username.length === 0 || password.length === 0) {
      reject({ message: "Missing username or password" });
      res.status(400).json({ message: "Missing username or password" });
    } else {
      client.bind(username, password, (err) => {
        if (err instanceof ldap.InvalidCredentialsError) {
          // resolve false if invalid credentials
          // console.log("checkUser: resolve false if invalid credentials")

          res.status(401).json({ message: "Authentication failed" });
          client.unbind();
          client.destroy();
          resolve(false);
        }
        else if (err) {
          console.error(err);
          client.unbind();
          client.destroy();
          reject(err);
        } else {
          // resolve true if valid credentials
          // console.log("checkUser: resolve");

          client.unbind();
          client.destroy();
          resolve(true);
        }
      });
    }
  }).then((result) => {
    //console.log(result);
    // if Promise return true which means Authentication succeed
    if (result) {
      // Start the query
      return searchUser(username, res);
    }
    //return false;
  }).catch((err) => {
    console.error(err);
  });
}


// Client Search to identify roles (authorization) 
const searchUser = (username, res) => { // user credential passed
  // Create a LDAP Client
  const client = ldap.createClient({ url: adUrl });

  return new Promise((resolve, reject) => {
    client.bind(agentUsername, agentPassword, (err) => {
      if (err instanceof ldap.InvalidCredentialsError) {
        console.log("Invalid agent credential");
        resolve(false);
      }
      else if (err) {
        console.log("Bind Failed with agent cred");
        console.log(err);
        reject(err);
      } else {
        // console.log("Bind Success with agent cred");

        // Remove the "@intra.camosun.bc.ca" part from the username
        const usernameWithoutDomain = username.replace('@intra.camosun.bc.ca', ''); // work with samaccountname

        // Options for searching the group the user is in ""
        const opts = {
          //filter: `(&(&(objectClass=user)(memberOf=CN=ELEXInventoryAdmin,OU=TT Users and Groups,OU=Trades and Tech,OU=Workstations,DC=intra,DC=camosun,DC=bc,DC=ca))`, // To search which user is in ELEXInventoryAdmin group
          //filter: `(&(&(objectClass=user)(memberOf=CN=TECN-290-BX01,OU=Sections,OU=Groups,DC=intra,DC=camosun,DC=bc,DC=ca))`, // To search which user is in TECN-290-BX01 group
          //filter: `(&(&(&(objectClass=user)(samaccountname=elexInvAdmin)(memberOf=CN=ELEXInventoryAdmin,OU=TT Users and Groups,OU=Trades and Tech,OU=Workstations,DC=intra,DC=camosun,DC=bc,DC=ca))))`,
          //filter: `(&(&(objectClass=group)(cn=ELEXInventoryStandard)))`, // search for the group in cn=""

          filter: `(&(&(objectClass=user)(samaccountname=${usernameWithoutDomain})))`, // search for the user in samaccountname=""
          scope: 'sub',
          attributes: ['samaccountname', 'cn', 'memberOf']
        }

        let adminGroup = process.env.ADMIN_GROUP;
        let standardGroup = process.env.STANDARD_GROUP;

        // client search
        client.search(baseDN, opts, function (err, searchRes) { // function
          if (err) {
            // reject if error
            client.unbind()
            client.destroy()
            reject(err)
          }
          else {
            let isAdmin = false;
            let isStudent = false;

            // searchEntry only returns the result when it finds based on the "opts"
            searchRes.on('searchEntry', (entry) => {
              //console.log('entry: ' + JSON.stringify(entry.attributes));
              // resolve true if entry found (user/group combo found)

              const memberOfAttribute = entry.attributes.find(attr => attr.type === 'memberOf'); // Look for the group in the user information based on the opts

              if (memberOfAttribute) {
                const memberOfValues = memberOfAttribute.values; // Take the group info out of the 'memberOf'
                //console.log('memberOfValues: ', memberOfValues);

                // Check if the user is admin or student
                if (memberOfValues.includes(adminGroup)) {
                  isAdmin = true;
                }

                if (memberOfValues.includes(standardGroup)) {
                  isStudent = true;
                }

              }
              // console.log("isAdmin: ", isAdmin);
              // console.log("isStudent: ", isStudent);

              client.unbind()
              client.destroy()
              resolve(true)
            })

            searchRes.on('end', async (result) => {
              // resolve false if search ended (would have already resolved true if an entry was found)
              console.log('Search ended:', result.status); // Search ended: 0 means search finished successfully

              const role = isAdmin ? 'admin' : isStudent ? 'student' : 'user';
              const token = await generateJWT(usernameWithoutDomain, role);

              // Save token through cookie (httpOnly cookie is not available to javascript)
              // If need to test through Thunder Client, you'll need to remove secure: true parameter. (remember to remove secure: true on logout controller too)
              // If test through Chrome, you'll need to add secure: true back. secure: true, sameSite: 'None', secure: true
              res.cookie('jwt', token.refreshToken, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000, sameSite: 'None', secure: true }); // 60 minutes (60*60*1000)
              const response = { "role": token.role, "accessToken": token.accessToken }

              // Return token to Front-end
              res.status(200).json(response);   // Error [ERR_HTTP_HEADERS_SENT]: Cannot set headers after they are sent to the client

              client.unbind()
              client.destroy()
              resolve(false)
            })

            searchRes.on('error', (err) => {
              // reject if search error
              console.error('Search error:', err);
              client.unbind()
              client.destroy()
              reject(err)
            })
          }
        })
      }
    });
  });
}

const generateJWT = async (username, role) => {
  // Access Token: Issued at Authorization. Client uses for API/Front-end Page access until expires. Verified with middleware. New token issued at Refesh request.
  // Refresh Token: Issued at Authorization. Use to request new Access Token. Verified with endpoint & database. Must be allowed to expire or logout.
  // Generate both token
  const accessToken = jwt.sign(
    {
      "username": username, // C-number or account
      "role": role // admin or student or user 
    },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: '5m' },
  );
  const refreshToken = jwt.sign(
    {
      "username": username,
      "role": role
    },
    process.env.JWT_REFRESH_SECRET, // JWT secret key
    { expiresIn: '1d' },
  );
  // Save refresh token with current user to DB
  const [user, created] = await User.findOrCreate({
    where: { username: username },
    defaults: { // if not found, create user with refreshtoken
      role: role,
      refreshtoken: refreshToken
    }
  });
  if (!created) { // if user already existed, update refreshtoken
    await User.update({ refreshtoken: refreshToken, role: role }, {
      where: { username: username }
    });
  }

  return { role, accessToken, refreshToken };
}
