const github = {
  loginUrl: 'http://github.com/login/oauth/authorize',
  accessTokenUrl: 'https://github.com/login/oauth/access_token',
  profileUrl: 'https://api.github.com/user',
  clientId: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  scope: 'user:email',
  getLoginUrl() {
    return `${this.loginUrl}?client_id=${this.clientId}&scope=${this.scope}`;
  }
};

const instagram = {
  loginUrl: 'https://api.instagram.com/oauth/authorize/',
  accessTokenUrl: 'https://api.instagram.com/oauth/access_token',
  redirectUri: process.env.NODE_ENV === 'production' ? 'https://infogram-app.herokuapp.com/oauth/instagram' : 'http://localhost:8000/oauth/instagram',
  clientId: process.env.INTSA_CLIENT_ID,
  clientSecret: process.env.INSTA_CLIENT_SECRET,
  responseCode: 'code',
  getLoginUrl() {
    return `${this.loginUrl}?client_id=${this.clientId}&redirect_uri=${this.redirectUri}&response_type=${this.responseCode}`;
  }
};

module.exports = {
  github,
  instagram
};
