class PriceAlertService {
  constructor() {
    this.alerts = [
      {
        Id: 1,
        giftId: 1,
        recipientId: 1,
        enabled: true,
        priceDropThreshold: 15,
        absoluteThreshold: 5.0,
        stockAlerts: true,
        emailEnabled: true,
        pushEnabled: true,
        frequency: 'immediate',
        createdAt: '2024-01-15T10:30:00Z',
        lastTriggered: '2024-01-20T14:30:00Z',
        totalSavings: 12.50
      },
      {
        Id: 2,
        giftId: 4,
        recipientId: 2,
        enabled: true,
        priceDropThreshold: 10,
        absoluteThreshold: 10.0,
        stockAlerts: true,
        emailEnabled: true,
        pushEnabled: false,
        frequency: 'daily',
        createdAt: '2024-01-18T09:45:00Z',
        lastTriggered: null,
        totalSavings: 0
      },
      {
        Id: 3,
        giftId: 9,
        recipientId: 5,
        enabled: false,
        priceDropThreshold: 20,
        absoluteThreshold: 0,
        stockAlerts: false,
        emailEnabled: true,
        pushEnabled: true,
        frequency: 'immediate',
        createdAt: '2024-01-25T13:30:00Z',
        lastTriggered: null,
        totalSavings: 0
      }
    ];

    this.globalSettings = {
      emailEnabled: true,
      pushEnabled: true,
      frequency: 'immediate',
      priceDropThreshold: 10,
      absoluteThreshold: 0,
      stockAlerts: true
    };
  }

  async getAll() {
    await this.delay(200);
    return [...this.alerts];
  }

  async getById(id) {
    await this.delay(150);
    const alert = this.alerts.find(a => a.Id === parseInt(id));
    return alert ? { ...alert } : null;
  }

  async getByGift(giftId) {
    await this.delay(200);
    return this.alerts.filter(alert => alert.giftId === parseInt(giftId));
  }

  async getActiveAlerts() {
    await this.delay(200);
    return this.alerts.filter(alert => alert.enabled);
  }

  async create(alertData) {
    await this.delay(300);
    const newAlert = {
      Id: this.getNextId(),
      ...alertData,
      enabled: alertData.enabled !== false,
      createdAt: new Date().toISOString(),
      lastTriggered: null,
      totalSavings: 0
    };
    this.alerts.push(newAlert);
    return { ...newAlert };
  }

  async update(id, alertData) {
    await this.delay(250);
    const index = this.alerts.findIndex(a => a.Id === parseInt(id));
    if (index === -1) throw new Error("Alert not found");
    
    this.alerts[index] = { 
      ...this.alerts[index], 
      ...alertData, 
      Id: parseInt(id) 
    };
    return { ...this.alerts[index] };
  }

  async updateConfig(id, config) {
    await this.delay(250);
    return this.update(id, config);
  }

  async toggleAlert(id) {
    await this.delay(200);
    const alert = this.alerts.find(a => a.Id === parseInt(id));
    if (!alert) throw new Error("Alert not found");
    
    return this.update(id, { enabled: !alert.enabled });
  }

  async delete(id) {
    await this.delay(250);
    const index = this.alerts.findIndex(a => a.Id === parseInt(id));
    if (index === -1) throw new Error("Alert not found");
    
    const deleted = this.alerts.splice(index, 1)[0];
    return { ...deleted };
  }

  async triggerAlert(id, newPrice) {
    await this.delay(300);
    const alert = this.alerts.find(a => a.Id === parseInt(id));
    if (!alert || !alert.enabled) return null;

    const updated = await this.update(id, {
      lastTriggered: new Date().toISOString(),
      totalSavings: (alert.totalSavings || 0) + Math.max(0, alert.originalPrice - newPrice)
    });

    return updated;
  }

  async getNotificationSettings() {
    await this.delay(150);
    return { ...this.globalSettings };
  }

  async updateNotificationSettings(settings) {
    await this.delay(250);
    this.globalSettings = { ...this.globalSettings, ...settings };
    return { ...this.globalSettings };
  }

  async checkPriceChanges() {
    await this.delay(500);
    const activeAlerts = await this.getActiveAlerts();
    const triggeredAlerts = [];

    // Simulate price checking logic
    for (const alert of activeAlerts) {
      // Mock price change detection
      if (Math.random() > 0.8) { // 20% chance of price change
        const mockNewPrice = alert.originalPrice * (0.85 + Math.random() * 0.1); // 5-15% drop
        const triggered = await this.triggerAlert(alert.Id, mockNewPrice);
        if (triggered) {
          triggeredAlerts.push(triggered);
        }
      }
    }

    return triggeredAlerts;
  }

  getNextId() {
    return Math.max(...this.alerts.map(a => a.Id), 0) + 1;
  }

  async delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const priceAlertService = new PriceAlertService();