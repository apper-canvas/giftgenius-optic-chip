import giftsData from "@/services/mockData/gifts.json";

class GiftService {
  constructor() {
    this.data = [...giftsData];
  }

  async getAll() {
    await this.delay(200);
    return [...this.data];
  }

  async getById(id) {
    await this.delay(150);
    const gift = this.data.find(g => g.Id === parseInt(id));
    return gift ? { ...gift } : null;
  }

  async getRecommendations({ recipientId, occasionId, budget, interests }) {
    await this.delay(800); // Simulate AI processing time
    
    let recommendations = [...this.data];
    
    // Filter by budget if provided
    if (budget) {
      recommendations = recommendations.filter(gift => gift.price <= budget * 1.2); // Allow 20% over budget
    }
    
    // Boost match scores based on interests
    if (interests && interests.length > 0) {
      recommendations = recommendations.map(gift => {
        let scoreBoost = 0;
        const giftTags = gift.tags || [];
        const giftTitle = gift.title.toLowerCase();
        const giftReasoning = gift.reasoning.toLowerCase();
        
        interests.forEach(interest => {
          const interestLower = interest.toLowerCase();
          // Check if interest matches tags, title, or reasoning
          if (giftTags.some(tag => tag.toLowerCase().includes(interestLower)) ||
              giftTitle.includes(interestLower) ||
              giftReasoning.includes(interestLower)) {
            scoreBoost += 15;
          }
        });
        
        return {
          ...gift,
          matchScore: Math.min(99, gift.matchScore + scoreBoost)
        };
      });
    }
    
    // Sort by match score and return top recommendations
    return recommendations
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 15); // Return top 15 recommendations
  }

  async getByCategory(category) {
    await this.delay(250);
    return this.data.filter(gift => gift.category === category);
  }

  async create(giftData) {
    await this.delay(400);
    const newGift = {
      Id: this.getNextId(),
      ...giftData,
      tags: giftData.tags || []
    };
    this.data.push(newGift);
    return { ...newGift };
  }

  async update(id, giftData) {
    await this.delay(350);
    const index = this.data.findIndex(g => g.Id === parseInt(id));
    if (index === -1) throw new Error("Gift not found");
    
    this.data[index] = { ...this.data[index], ...giftData, Id: parseInt(id) };
    return { ...this.data[index] };
  }

  async delete(id) {
    await this.delay(250);
    const index = this.data.findIndex(g => g.Id === parseInt(id));
    if (index === -1) throw new Error("Gift not found");
    
    const deleted = this.data.splice(index, 1)[0];
    return { ...deleted };
  }

  getNextId() {
    return Math.max(...this.data.map(g => g.Id), 0) + 1;
  }

  async delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const giftService = new GiftService();