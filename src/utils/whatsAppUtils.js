export class WhatsAppUtils {
  phone = {
    clean: (number) => {
      if (!number) return '';
      const match = String(number).match(/\d+@|@\d+/);
      return match ? match[0].replace('@', '') : '';
    },

    cleanMultiple: (numbers) => {
      if (!Array.isArray(numbers)) return [];
      return numbers.map((num) => this.phone.clean(num));
    },

    includesNumber: (numbers, searchNumber) => {
      if (!Array.isArray(numbers)) return false;
      const cleanSearchNumber = this.phone.clean(searchNumber);
      return numbers.some((num) => num === cleanSearchNumber);
    },

    format: (number) => {
      const clean = this.phone.clean(number);
      if (clean.length >= 10) {
        const countryCode = clean.slice(0, -10);
        const areaCode = clean.slice(-10, -7);
        const firstPart = clean.slice(-7, -4);
        const lastPart = clean.slice(-4);
        return countryCode
          ? `+${countryCode} (${areaCode}) ${firstPart}-${lastPart}`
          : `(${areaCode}) ${firstPart}-${lastPart}`;
      }
      return clean;
    },
  };

  templates = {
    settingsStatus: (settings, allowedNumCount) => {
      return `📊 Current Settings:\n\n${settings
        .map((s) => `${s.key}: ${s.value ? '✅ ON' : '❌ OFF'}`)
        .join('\n')}\n\n📱 Allowed Numbers: ${allowedNumCount}`;
    },

    allowedNumbers: (numbers, formatter) => {
      return numbers.length > 0
        ? `📱 Allowed numbers (${numbers.length}):\n${numbers.map(formatter).join('\n')}`
        : '📱 No allowed numbers';
    },
  };
}
