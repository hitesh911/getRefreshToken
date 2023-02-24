# About

This is a dependencies module of [dirvedownloader](https://github.com/hitesh911/driveDownloader)

### USAGE

It is used to generate a access and refresh token of drive scope by using credentials file of [google cloud console](https://console.cloud.google.com)

```
const generateToken = require("getRefreshToken");
await getRefreshToken(pathOfCreditialFile, TokenSavePath); // You must have to pass the path of your cred file and token path is optional it will save token in pwd (Present working directory but its optional )
```
Please check this out to get clear idea about this library : https://github.com/hitesh911/driveDownloader#readme
