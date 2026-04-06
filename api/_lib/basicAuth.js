function parseAuthHeader(header) {
  if (!header || !header.startsWith("Basic ")) {
    return null;
  }

  try {
    const encoded = header.slice(6);
    const decoded = Buffer.from(encoded, "base64").toString("utf8");
    const separatorIndex = decoded.indexOf(":");

    if (separatorIndex === -1) {
      return null;
    }

    return {
      username: decoded.slice(0, separatorIndex),
      password: decoded.slice(separatorIndex + 1),
    };
  } catch {
    return null;
  }
}

export function requireBasicAuth(req, res) {
  const expectedUsername = process.env.ADMIN_USERNAME;
  const expectedPassword = process.env.ADMIN_PASSWORD;

  if (!expectedUsername || !expectedPassword) {
    res.status(500).send(
      "ADMIN_USERNAME and ADMIN_PASSWORD must be configured for the leads dashboard.",
    );
    return false;
  }

  const credentials = parseAuthHeader(req.headers.authorization);

  if (
    !credentials ||
    credentials.username !== expectedUsername ||
    credentials.password !== expectedPassword
  ) {
    res
      .status(401)
      .setHeader("WWW-Authenticate", 'Basic realm="The Quiet Cost Leads"')
      .send("Authentication required.");
    return false;
  }

  return true;
}
