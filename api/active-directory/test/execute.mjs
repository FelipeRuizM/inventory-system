import { checkUser } from './ldap_testC.js';

const run = async () => {
  try {
    const result = await checkUser({ body: { username: 'exampleuser', password: 'examplepassword' } });
    console.log(result);
  } catch (error) {
    console.error(error);
  }
};

run();
