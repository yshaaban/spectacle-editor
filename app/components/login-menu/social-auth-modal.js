import { ipcRenderer } from "electron";
import { find } from "lodash";

const SocialAuthProviders = {
  Facebook: {
    authUrl: "https://plot.ly/login/facebook/"
  },
  Twitter: {
    authUrl: "https://plot.ly/login/twitter/"
  },
  GitHub: {
    authUrl: "https://plot.ly/login/github/"
  },
  Google: {
    authUrl: "https://plot.ly/login/google-oauth2/"
  }
};

class SocialAuth {
  constructor() {
    this.Facebook = SocialAuthProviders.Facebook;
    this.Twitter = SocialAuthProviders.Twitter;
    this.GitHub = SocialAuthProviders.GitHub;
    this.Google = SocialAuthProviders.Google;

    ipcRenderer.on("social-login", (event, cookies) => {
      console.log("COOKIES RECIEVED", cookies);

      const csrfToken = find(cookies, { name: "csrftoken" }).value;
      const plotlySession = find(cookies, { name: "plotly_sess_pr" }).value;

      console.log(csrfToken, plotlySession, "token", "session");

      fetch(`https://api.plot.ly/v2/users/current`, {
        method: "get",
        credentials: "include",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          "Plotly-Client-Platform": "Python 0.2",
          "X-CSRFToken": csrfToken
        }
      })
      .then((res) => {console.log(res); return res.json();})
      .then((resJson) => {console.log(resJson);});
    });
  }

  authenticate(provider) {
    this.openPopUp(provider.authUrl);
  }

  openPopUp(url) {
    ipcRenderer.send("social-login", url);
  }
}

export default new SocialAuth();
