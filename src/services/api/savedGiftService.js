class SavedGiftService {
  constructor() {
    this.tableName = 'saved_gift_c';
    // Initialize ApperClient with Project ID and Public Key
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
  }

  async delay(ms = 300) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async getAll() {
    try {
      await this.delay(250);
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "saved_date_c" } },
          { field: { Name: "price_alert_c" } },
          { field: { Name: "notes_c" } },
          { field: { Name: "gift_c" } },
          { field: { Name: "recipient_c" } }
        ],
        orderBy: [{ fieldName: "saved_date_c", sorttype: "DESC" }]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      // Transform database response to match UI expectations
      const savedGifts = (response.data || []).map(record => ({
        Id: record.Id,
        giftId: record.gift_c?.Id || null,
        recipientId: record.recipient_c?.Id || null,
        savedDate: record.saved_date_c || record.CreatedOn || new Date().toISOString(),
        priceAlert: record.price_alert_c || false,
        notes: record.notes_c || '',
        gift: record.gift_c ? { 
          Id: record.gift_c.Id, 
          title: record.gift_c.Name, 
          price: 0, 
          imageUrl: '', 
          category: '',
          vendor: '',
          matchScore: 0,
          reasoning: ''
        } : null,
        recipient: record.recipient_c ? { 
          Id: record.recipient_c.Id, 
          name: record.recipient_c.Name 
        } : null
      }));

      return savedGifts;
    } catch (error) {
      console.error("Error fetching saved gifts:", error?.response?.data?.message || error.message);
      throw error;
    }
  }

  async getById(id) {
    try {
      await this.delay(150);
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "saved_date_c" } },
          { field: { Name: "price_alert_c" } },
          { field: { Name: "notes_c" } },
          { field: { Name: "gift_c" } },
          { field: { Name: "recipient_c" } }
        ]
      };

      const response = await this.apperClient.getRecordById(this.tableName, parseInt(id), params);
      
      if (!response.success || !response.data) {
        return null;
      }

      const record = response.data;
      return {
        Id: record.Id,
        giftId: record.gift_c?.Id || null,
        recipientId: record.recipient_c?.Id || null,
        savedDate: record.saved_date_c || record.CreatedOn || new Date().toISOString(),
        priceAlert: record.price_alert_c || false,
        notes: record.notes_c || '',
        gift: record.gift_c ? { 
          Id: record.gift_c.Id, 
          title: record.gift_c.Name, 
          price: 0 
        } : null,
        recipient: record.recipient_c ? { 
          Id: record.recipient_c.Id, 
          name: record.recipient_c.Name 
        } : null
      };
    } catch (error) {
      console.error(`Error fetching saved gift with ID ${id}:`, error?.response?.data?.message || error.message);
      return null;
    }
  }

  async getByRecipient(recipientId) {
    try {
      await this.delay(200);
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "saved_date_c" } },
          { field: { Name: "price_alert_c" } },
          { field: { Name: "notes_c" } },
          { field: { Name: "gift_c" } },
          { field: { Name: "recipient_c" } }
        ],
        where: [
          {
            FieldName: "recipient_c",
            Operator: "EqualTo",
            Values: [parseInt(recipientId)]
          }
        ],
        orderBy: [{ fieldName: "saved_date_c", sorttype: "DESC" }]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return (response.data || []).map(record => ({
        Id: record.Id,
        giftId: record.gift_c?.Id || null,
        recipientId: record.recipient_c?.Id || null,
        savedDate: record.saved_date_c || record.CreatedOn,
        priceAlert: record.price_alert_c || false,
        notes: record.notes_c || ''
      }));
    } catch (error) {
      console.error("Error fetching saved gifts by recipient:", error?.response?.data?.message || error.message);
      return [];
    }
  }

  async getByGift(giftId) {
    try {
      await this.delay(200);
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "saved_date_c" } },
          { field: { Name: "price_alert_c" } },
          { field: { Name: "notes_c" } },
          { field: { Name: "gift_c" } },
          { field: { Name: "recipient_c" } }
        ],
        where: [
          {
            FieldName: "gift_c",
            Operator: "EqualTo",
            Values: [parseInt(giftId)]
          }
        ]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return (response.data || []).map(record => ({
        Id: record.Id,
        giftId: record.gift_c?.Id || null,
        recipientId: record.recipient_c?.Id || null,
        savedDate: record.saved_date_c || record.CreatedOn,
        priceAlert: record.price_alert_c || false,
        notes: record.notes_c || ''
      }));
    } catch (error) {
      console.error("Error fetching saved gifts by gift:", error?.response?.data?.message || error.message);
      return [];
    }
  }

  async create(savedGiftData) {
    try {
      await this.delay(300);
      
      // Transform UI data to database format - only include Updateable fields
      const dbData = {
        Name: savedGiftData.name || `Saved Gift ${savedGiftData.giftId}`,
        saved_date_c: new Date().toISOString(),
        price_alert_c: savedGiftData.priceAlert || false,
        notes_c: savedGiftData.notes || '',
        gift_c: parseInt(savedGiftData.giftId),
        recipient_c: parseInt(savedGiftData.recipientId)
      };

      const params = {
        records: [dbData]
      };

      const response = await this.apperClient.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create saved gift ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          if (failedRecords[0].message && failedRecords[0].message.includes('already saved')) {
            throw new Error("Gift is already saved for this recipient");
          }
        }
        
        if (successfulRecords.length > 0) {
          const createdRecord = successfulRecords[0].data;
          return {
            Id: createdRecord.Id,
            giftId: createdRecord.gift_c || null,
            recipientId: createdRecord.recipient_c || null,
            savedDate: createdRecord.saved_date_c || new Date().toISOString(),
            priceAlert: createdRecord.price_alert_c || false,
            notes: createdRecord.notes_c || ''
          };
        }
      }
    } catch (error) {
      console.error("Error creating saved gift:", error?.response?.data?.message || error.message);
      throw error;
    }
  }

  async update(id, savedGiftData) {
    try {
      await this.delay(250);
      
      // Transform UI data to database format - only include Updateable fields
      const dbData = {
        Id: parseInt(id),
        Name: savedGiftData.name,
        price_alert_c: savedGiftData.priceAlert,
        notes_c: savedGiftData.notes
      };

      // Remove undefined values
      Object.keys(dbData).forEach(key => {
        if (dbData[key] === undefined) {
          delete dbData[key];
        }
      });

      const params = {
        records: [dbData]
      };

      const response = await this.apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update saved gift ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
        }
        
        if (successfulUpdates.length > 0) {
          const updatedRecord = successfulUpdates[0].data;
          return {
            Id: updatedRecord.Id,
            giftId: updatedRecord.gift_c || null,
            recipientId: updatedRecord.recipient_c || null,
            savedDate: updatedRecord.saved_date_c || updatedRecord.CreatedOn,
            priceAlert: updatedRecord.price_alert_c || false,
            notes: updatedRecord.notes_c || ''
          };
        }
      }
    } catch (error) {
      console.error("Error updating saved gift:", error?.response?.data?.message || error.message);
      throw error;
    }
  }

  async delete(id) {
    try {
      await this.delay(200);
      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await this.apperClient.deleteRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete saved gift ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
        }
        
        return successfulDeletions.length === 1;
      }
    } catch (error) {
      console.error("Error deleting saved gift:", error?.response?.data?.message || error.message);
      throw error;
    }
  }

  async togglePriceAlert(id) {
    try {
      await this.delay(200);
      const savedGift = await this.getById(id);
      if (!savedGift) throw new Error("Saved gift not found");
      
      return this.update(id, { priceAlert: !savedGift.priceAlert });
    } catch (error) {
      console.error("Error toggling price alert:", error?.response?.data?.message || error.message);
      throw error;
    }
  }

  async addNote(id, note) {
    try {
      await this.delay(200);
      return this.update(id, { notes: note });
    } catch (error) {
      console.error("Error adding note:", error?.response?.data?.message || error.message);
      throw error;
    }
  }

  async getPriceAlerts() {
    try {
      await this.delay(200);
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "saved_date_c" } },
          { field: { Name: "price_alert_c" } },
          { field: { Name: "notes_c" } },
          { field: { Name: "gift_c" } },
          { field: { Name: "recipient_c" } }
        ],
        where: [
          {
            FieldName: "price_alert_c",
            Operator: "EqualTo",
            Values: [true]
          }
        ]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return (response.data || []).map(record => ({
        Id: record.Id,
        giftId: record.gift_c?.Id || null,
        recipientId: record.recipient_c?.Id || null,
        savedDate: record.saved_date_c || record.CreatedOn,
        priceAlert: record.price_alert_c || false,
        notes: record.notes_c || ''
      }));
    } catch (error) {
      console.error("Error fetching price alerts:", error?.response?.data?.message || error.message);
      return [];
    }
  }

  async createPriceAlert(savedGiftId, alertConfig) {
    try {
      await this.delay(300);
      const savedGift = await this.getById(savedGiftId);
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
    } catch (error) {
      console.error("Error creating price alert:", error?.response?.data?.message || error.message);
      throw error;
    }
  }

  async updatePriceAlert(savedGiftId, alertConfig) {
    await this.delay(250);
    // Implementation would update existing alert for this saved gift
    return alertConfig;
  }

  async removePriceAlert(savedGiftId) {
    try {
      await this.delay(200);
      const savedGift = await this.update(savedGiftId, { priceAlert: false });
      return savedGift;
    } catch (error) {
      console.error("Error removing price alert:", error?.response?.data?.message || error.message);
      throw error;
    }
  }
}

export const savedGiftService = new SavedGiftService();