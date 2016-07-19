import { observable, computed } from "mobx";

const defaultDomain = "https://api.plot.ly";

const normalizeDomain = (domain) => {
  // Remove trailing slash
  if (domain.slice(-1) === "/") {
    domain = domain.slice(0, domain.length - 1);
  }

  if (domain.indexOf("http://") === 0 || domain.indexOf("https://") === 0) {
    return domain;
  }

  return `http://${domain}`;
};

export default class FileStore {
  @observable domainUrl = defaultDomain;
  @observable user = null;
  @observable csrfToken = null;

  constructor() {
    const userString = localStorage.getItem("user");
    const csrfToken = localStorage.getItem("csrfToken");

    if (userString && csrfToken) {
      this.user = JSON.parse(userString);
      this.csrfToken = csrfToken;
    }
  }

  setDomainUrl(domainUrl) {
    this.domainUrl = normalizeDomain(domainUrl);
  }

  resetDomainUrl() {
    this.domainUrl = defaultDomain;
  }

  setUser(userInfo) {
    // Change relative urls to absolute
    if (userInfo.avatar_url && userInfo.avatar_url.indexOf("/") === 0) {
      userInfo.avatar_url = `${this.domainUrl}${userInfo.avatar_url}`;
    }

    localStorage.setItem("user", JSON.stringify(userInfo));
    localStorage.setItem("csrfToken", userInfo.csrf_token);

    this.csrfToken = userInfo.csrf_token;
    this.user = userInfo;
  }

  signOut() {
    localStorage.removeItem("user");
    localStorage.removeItem("csrfToken");

    this.user = null;
    this.csrfToken = null;
  }
}
