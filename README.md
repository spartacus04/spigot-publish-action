# spigot-publish-action

>This GitHub Action publishes a Spigot plugin to SpigotMC.

## Inputs

- `UPDATE_PAGE`: The full Spigot update page URL. (Example: https://www.spigotmc.org/resources/infinite-villager-trades.88098/add-version)

- `EMAIL`: The email used to login to Spigot.

- `PASSWORD`: The password used to login to Spigot.

- `OTP_SECRET`: The TOTP secret used to login to Spigot. The one you inputted when you enabled 2FA. Don't worry, you can use both 2FA and the GitHub Action.

- `DOWNLOAD_URL`: Download URL for the plugin. This can either be a link to a file or a link to a GitHub release.

- `IS_FILE`: Whether the download URL is a file link or a GitHub release link.

- `FILE_NAME` (optional): The file name of the uploaded file. (Only needed when IS_FILE is true)

- `VERSION`: The version set for the plugin update.

- `TITLE`: The title set for the plugin update.

- `DESCRIPTION` (optional): The description set for the plugin update.

## Example Usage

```yaml
uses: spartacus04/spigot-publish-action@v1
with:
  UPDATE_PAGE: 'https://www.spigotmc.org/resources/infinite-villager-trades.88098/add-version'
  EMAIL: 'your-email@example.com'
  PASSWORD: 'your-password'
  OTP_SECRET: 'your-otp-secret'
  DOWNLOAD_URL: 'https://example.com/plugins/your-plugin.jar'
  IS_FILE: true
  FILE_NAME: 'your-plugin.jar'
  VERSION: '1.0.0'
  TITLE: 'New Plugin Update'
  DESCRIPTION: 'This update includes bug fixes and new features.'
```