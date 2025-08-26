import recipientsData from "@/services/mockData/recipients.json";

class RecipientService {
  constructor() {
    this.data = [...recipientsData];
  }

  async getAll() {
    await this.delay(300);
    return [...this.data].sort((a, b) => b.Id - a.Id);
  }

  async getById(id) {
    await this.delay(200);
    const recipient = this.data.find(r => r.Id === parseInt(id));
    return recipient ? { ...recipient } : null;
  }

  async create(recipientData) {
    await this.delay(400);
    const newRecipient = {
      Id: this.getNextId(),
      ...recipientData,
      giftHistory: recipientData.giftHistory || []
    };
    this.data.push(newRecipient);
    return { ...newRecipient };
  }

  async update(id, recipientData) {
    await this.delay(350);
    const index = this.data.findIndex(r => r.Id === parseInt(id));
    if (index === -1) throw new Error("Recipient not found");
    
    this.data[index] = { ...this.data[index], ...recipientData, Id: parseInt(id) };
    return { ...this.data[index] };
  }

  async delete(id) {
    await this.delay(250);
    const index = this.data.findIndex(r => r.Id === parseInt(id));
    if (index === -1) throw new Error("Recipient not found");
    
    const deleted = this.data.splice(index, 1)[0];
    return { ...deleted };
  }

  getNextId() {
    return Math.max(...this.data.map(r => r.Id), 0) + 1;
  }

  async delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const recipientService = new RecipientService();