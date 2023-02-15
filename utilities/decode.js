const decodeToken = (token) => {
  console.log("token", token);
  const base64Url = token.split(".")[1];
  console.log("base64Url", base64Url);

  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  console.log("base64", base64);

  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );
  console.log("jsonPayload", jsonPayload);

  return JSON.parse(jsonPayload);
};

module.exports = { decodeToken };
