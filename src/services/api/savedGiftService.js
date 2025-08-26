import savedGiftsData from "@/services/mockData/savedGifts.json";

class SavedGiftService {
  constructor() {
    this.data = [...savedGiftsData];
  }

  async getAll() {
    await this.delay(250);
    return [...this.data].sort((a, b) => new Date(b.savedDate) - new Date(a.savedDate));
  }

  async getById(id) {
    await this.delay(150);
    const savedGift = this.data.find(sg => sg.Id === parseInt(id));
    return savedGift ? { ...savedGift } : null;
  }

  async getByRecipient(recipientId) {
    await this.delay(200);
    return this.data
      .filter(savedGift => savedGift.recipientId === parseInt(recipientId))
      .sort((a, b) => new Date(b.savedDate) - new Date(a.savedDate));
  }

  async getByGift(giftId) {
    await this.delay(200);
    return this.data.filter(savedGift => savedGift.giftId === parseInt(giftId));
  }

  async create(savedGiftData) {
    await this.delay(300);
    
    // Check if gift is already saved for this recipient
    const existing = this.data.find(sg => 
      sg.giftId === savedGiftData.giftId && sg.recipientId === savedGiftData.recipientId
    );
    
    if (existing) {
      throw new Error("Gift is already saved for this recipient");
    }
    
    const newSavedGift = {
      Id: this.getNextId(),
      ...savedGiftData,
      savedDate: new Date().toISOString(),
      priceAlert: savedGiftData.priceAlert || false,
      notes: savedGiftData.notes || ""
    };
    
    this.data.push(newSavedGift);
    return { ...newSavedGift };
  }

  async update(id, savedGiftData) {
    await this.delay(250);
    const index = this.data.findIndex(sg => sg.Id === parseInt(id));
    if (index === -1) throw new Error("Saved gift not found");
    
    this.data[index] = { ...this.data[index], ...savedGiftData, Id: parseInt(id) };
    return { ...this.data[index] };
  }

  async delete(id) {
    await this.delay(200);
    const index = this.data.findIndex(sg => sg.Id === parseInt(id));
    if (index === -1) throw new Error("Saved gift not found");
    
    const deleted = this.data.splice(index, 1)[0];
    return { ...deleted };
  }

  async togglePriceAlert(id) {
    await this.delay(200);
    const savedGift = this.data.find(sg => sg.Id === parseInt(id));
    if (!savedGift) throw new Error("Saved gift not found");
    
    return this.update(id, { priceAlert: !savedGift.priceAlert });
  }

  async addNote(id, note) {
    await this.delay(200);
    return this.update(id, { notes: note });
  }

async getPriceAlerts() {
    await this.delay(200);
    return this.data.filter(savedGift => savedGift.priceAlert);
  }

  async createPriceAlert(savedGiftId, alertConfig) {
    await this.delay(300);
    const savedGift = this.data.find(sg => sg.Id === parseInt(savedGiftId));
    if (!savedGift) throw new Error("Saved gift not found");

    // Import priceAlertService dynamically to avoid circular dependency
    const { priceAlertService } = await import('./priceAlertService.js');
    
    const alertData = {
      giftId: savedGift.giftId,
      recipientId: savedGift.recipientId,
      ...alertConfig,
      originalPrice: savedGift.gift?.price || 0
    };

    return await priceAlertService.create(alertData);
  }

  async updatePriceAlert(savedGiftId, alertConfig) {
    await this.delay(250);
    // Implementation would update existing alert for this saved gift
    return alertConfig;
  }

  async removePriceAlert(savedGiftId) {
    await this.delay(200);
    const savedGift = await this.update(savedGiftId, { priceAlert: false });
    return savedGift;
  }
  getNextId() {
    return Math.max(...this.data.map(sg => sg.Id), 0) + 1;
  }

  async delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const savedGiftService = new SavedGiftService();