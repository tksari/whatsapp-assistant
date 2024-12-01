export class SettingsService {
  constructor({ settingRepository }) {
    this.repository = settingRepository;
  }

  async getFormattedSettings() {
    const settings = await this.getAllSettings();
    return settings?.reduce((map, setting) => {
      map[setting.key] = setting.value;
      return map;
    }, {});
  }

  async getAllSettings() {
    return this.repository.getAllSettings();
  }

  async getAllowedNumbers() {
    return this.repository.getAllowedNumbers();
  }

  async upsertSettings(key, enabled, message) {
    await this.repository.upsertSettings(key, enabled);
    if (message) {
      await this.repository.upsertSettings('auto_reply_message', true, message);
    }
  }

  async addAllowedNumbers(numbers) {
    await this.repository.addAllowedNumbers(numbers);
  }

  async removeAllowedNumbers(numbers) {
    await this.repository.removeAllowedNumbers(numbers);
  }

  async removeAllNumbers() {
    await this.repository.removeAllNumbers();
  }
}
