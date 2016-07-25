export const create = (domain, csrfToken, presJSON) =>
  fetch(`${domain}/v2/spectacle-presentations`, {
    method: "post",
    credentials: "include",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "Plotly-Client-Platform": "Python 0.2",
      "X-CSRFToken": csrfToken
    },
    body: JSON.stringify({
      filename: "TEST",
      world_readable: true,
      content: JSON.stringify({
        presentation: {
          slides: presJSON
        }
      })
    })
  })
  .then((response) => {
    console.log(csrfToken);
    console.log(response);
  });
