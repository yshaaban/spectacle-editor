const parseText = (response) => response.text().then(text => ({ response, text }));

const parseJSON = ({ response, text }) => {
  try {
    return { response, json: JSON.parse(text) };
  } catch (e) {
    // No content is a valid API response
    return { response, json: {} };
  }
};

export const login = (username, password) => fetch(`https://api.plot.ly/v2/users/login`, {
  method: "post",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    "Plotly-Client-Platform": "Python 0.2"
  },
  body: JSON.stringify({
    username,
    password
  })
})
.then(parseText)
.then(parseJSON)
.then(({ response, json }) => {
  if (!response.ok) {
    return Promise.reject(json.errors);
  }

  return json;
});
