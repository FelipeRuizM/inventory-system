import User from "../models/user-schema.js";

const logout = async (req, res) => {
  // On client, also delete accessToken
  const { cookies } = req;
  if (!cookies?.jwt) return res.status(204).send("cookies not found.");
  const refreshToken = cookies.jwt;

  // Is refreshToken in db
  const found = await User.findOne({ where: { refreshtoken: refreshToken } });
  // if not found just clearCookie and sent 204 // sameSite: 'None', secure: true
  if (!found) {
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
    return res.sendStatus(204);
  }

  // if found, clear refreshToken in db also delete cookie // secure: true
  await User.update({ refreshtoken: "", role: "" }, { where: { id: found.id } });
  res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
  res.sendStatus(204);
}

export { logout };