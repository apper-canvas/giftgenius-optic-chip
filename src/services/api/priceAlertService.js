class PriceAlertService {
  constructor() {
    this.tableName = 'price_alert_c';
    // Initialize ApperClient with Project ID and Public Key
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    
    this.globalSettings = {
      emailEnabled: true,
      pushEnabled: true,
      frequency: 'immediate',
      priceDropThreshold: 10,
      absoluteThreshold: 0,
      stockAlerts: true
    };
  }

  async delay(ms = 300) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async getAll() {
    try {
      await this.delay(200);
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "enabled_c" } },
          { field: { Name: "price_drop_threshold_c" } },
          { field: { Name: "absolute_threshold_c" } },
          { field: { Name: "stock_alerts_c" } },
          { field: { Name: "email_enabled_c" } },
          { field: { Name: "push_enabled_c" } },
          { field: { Name: "frequency_c" } },
          { field: { Name: "created_at_c" } },
          { field: { Name: "last_triggered_c" } },
          { field: { Name: "total_savings_c" } },
          { field: { Name: "gift_c" } },
          { field: { Name: "recipient_c" } }
        ],
        orderBy: [{ fieldName: "Id", sorttype: "DESC" }]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      // Transform database response to match UI expectations
      const alerts = (response.data || []).map(record => ({
        Id: record.Id,
        giftId: record.gift_c?.Id || null,
        recipientId: record.recipient_c?.Id || null,
        enabled: record.enabled_c || false,
        priceDropThreshold: parseInt(record.price_drop_threshold_c) || 10,
        absoluteThreshold: parseFloat(record.absolute_threshold_c) || 0,
        stockAlerts: record.stock_alerts_c || false,
        emailEnabled: record.email_enabled_c !== false,
        pushEnabled: record.push_enabled_c !== false,
        frequency: record.frequency_c || 'immediate',
        createdAt: record.created_at_c || record.CreatedOn || new Date().toISOString(),
        lastTriggered: record.last_triggered_c || null,
        totalSavings: parseFloat(record.total_savings_c) || 0,
        gift: record.gift_c ? { Id: record.gift_c.Id, title: record.gift_c.Name, price: 0 } : null,
        recipient: record.recipient_c ? { Id: record.recipient_c.Id, name: record.recipient_c.Name } : null
      }));

      return alerts;
    } catch (error) {
      console.error("Error fetching price alerts:", error?.response?.data?.message || error.message);
      throw error;
    }
  }

  async getById(id) {
    try {
      await this.delay(150);
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "enabled_c" } },
          { field: { Name: "price_drop_threshold_c" } },
          { field: { Name: "absolute_threshold_c" } },
          { field: { Name: "stock_alerts_c" } },
          { field: { Name: "email_enabled_c" } },
          { field: { Name: "push_enabled_c" } },
          { field: { Name: "frequency_c" } },
          { field: { Name: "created_at_c" } },
          { field: { Name: "last_triggered_c" } },
          { field: { Name: "total_savings_c" } },
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
        enabled: record.enabled_c || false,
        priceDropThreshold: parseInt(record.price_drop_threshold_c) || 10,
        absoluteThreshold: parseFloat(record.absolute_threshold_c) || 0,
        stockAlerts: record.stock_alerts_c || false,
        emailEnabled: record.email_enabled_c !== false,
        pushEnabled: record.push_enabled_c !== false,
        frequency: record.frequency_c || 'immediate',
        createdAt: record.created_at_c || record.CreatedOn || new Date().toISOString(),
        lastTriggered: record.last_triggered_c || null,
        totalSavings: parseFloat(record.total_savings_c) || 0,
        gift: record.gift_c ? { Id: record.gift_c.Id, title: record.gift_c.Name, price: 0 } : null,
        recipient: record.recipient_c ? { Id: record.recipient_c.Id, name: record.recipient_c.Name } : null
      };
    } catch (error) {
      console.error(`Error fetching price alert with ID ${id}:`, error?.response?.data?.message || error.message);
      return null;
    }
  }

  async getByGift(giftId) {
    try {
      await this.delay(200);
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "enabled_c" } },
          { field: { Name: "price_drop_threshold_c" } },
          { field: { Name: "absolute_threshold_c" } },
          { field: { Name: "stock_alerts_c" } },
          { field: { Name: "email_enabled_c" } },
          { field: { Name: "push_enabled_c" } },
          { field: { Name: "frequency_c" } },
          { field: { Name: "created_at_c" } },
          { field: { Name: "last_triggered_c" } },
          { field: { Name: "total_savings_c" } },
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
        enabled: record.enabled_c || false,
        priceDropThreshold: parseInt(record.price_drop_threshold_c) || 10,
        absoluteThreshold: parseFloat(record.absolute_threshold_c) || 0,
        stockAlerts: record.stock_alerts_c || false,
        emailEnabled: record.email_enabled_c !== false,
        pushEnabled: record.push_enabled_c !== false,
        frequency: record.frequency_c || 'immediate',
        createdAt: record.created_at_c || record.CreatedOn || new Date().toISOString(),
        lastTriggered: record.last_triggered_c || null,
        totalSavings: parseFloat(record.total_savings_c) || 0
      }));
    } catch (error) {
      console.error("Error fetching price alerts by gift:", error?.response?.data?.message || error.message);
      return [];
    }
  }

  async getActiveAlerts() {
    try {
      await this.delay(200);
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "enabled_c" } },
          { field: { Name: "price_drop_threshold_c" } },
          { field: { Name: "absolute_threshold_c" } },
          { field: { Name: "stock_alerts_c" } },
          { field: { Name: "email_enabled_c" } },
          { field: { Name: "push_enabled_c" } },
          { field: { Name: "frequency_c" } },
          { field: { Name: "created_at_c" } },
          { field: { Name: "last_triggered_c" } },
          { field: { Name: "total_savings_c" } },
          { field: { Name: "gift_c" } },
          { field: { Name: "recipient_c" } }
        ],
        where: [
          {
            FieldName: "enabled_c",
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
        enabled: record.enabled_c || false,
        priceDropThreshold: parseInt(record.price_drop_threshold_c) || 10,
        absoluteThreshold: parseFloat(record.absolute_threshold_c) || 0,
        stockAlerts: record.stock_alerts_c || false,
        emailEnabled: record.email_enabled_c !== false,
        pushEnabled: record.push_enabled_c !== false,
        frequency: record.frequency_c || 'immediate',
        createdAt: record.created_at_c || record.CreatedOn || new Date().toISOString(),
        lastTriggered: record.last_triggered_c || null,
        totalSavings: parseFloat(record.total_savings_c) || 0
      }));
    } catch (error) {
      console.error("Error fetching active price alerts:", error?.response?.data?.message || error.message);
      return [];
    }
  }

  async create(alertData) {
    try {
      await this.delay(300);
      
      // Transform UI data to database format - only include Updateable fields
      const dbData = {
        Name: alertData.name || `Alert for ${alertData.giftId}`,
        enabled_c: alertData.enabled !== false,
        price_drop_threshold_c: parseInt(alertData.priceDropThreshold) || 10,
        absolute_threshold_c: parseFloat(alertData.absoluteThreshold) || 0,
        stock_alerts_c: alertData.stockAlerts !== false,
        email_enabled_c: alertData.emailEnabled !== false,
        push_enabled_c: alertData.pushEnabled !== false,
        frequency_c: alertData.frequency || 'immediate',
        created_at_c: new Date().toISOString(),
        last_triggered_c: null,
        total_savings_c: 0,
        gift_c: parseInt(alertData.giftId),
        recipient_c: parseInt(alertData.recipientId)
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
          console.error(`Failed to create price alert ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
        }
        
        if (successfulRecords.length > 0) {
          const createdRecord = successfulRecords[0].data;
          return {
            Id: createdRecord.Id,
            giftId: createdRecord.gift_c || null,
            recipientId: createdRecord.recipient_c || null,
            enabled: createdRecord.enabled_c || false,
            priceDropThreshold: parseInt(createdRecord.price_drop_threshold_c) || 10,
            absoluteThreshold: parseFloat(createdRecord.absolute_threshold_c) || 0,
            stockAlerts: createdRecord.stock_alerts_c || false,
            emailEnabled: createdRecord.email_enabled_c !== false,
            pushEnabled: createdRecord.push_enabled_c !== false,
            frequency: createdRecord.frequency_c || 'immediate',
            createdAt: createdRecord.created_at_c || new Date().toISOString(),
            lastTriggered: null,
            totalSavings: 0
          };
        }
      }
    } catch (error) {
      console.error("Error creating price alert:", error?.response?.data?.message || error.message);
      throw error;
    }
  }

  async update(id, alertData) {
    try {
      await this.delay(250);
      
      // Transform UI data to database format - only include Updateable fields
      const dbData = {
        Id: parseInt(id),
        Name: alertData.name || `Alert for ${alertData.giftId}`,
        enabled_c: alertData.enabled,
        price_drop_threshold_c: parseInt(alertData.priceDropThreshold),
        absolute_threshold_c: parseFloat(alertData.absoluteThreshold),
        stock_alerts_c: alertData.stockAlerts,
        email_enabled_c: alertData.emailEnabled,
        push_enabled_c: alertData.pushEnabled,
        frequency_c: alertData.frequency,
        last_triggered_c: alertData.lastTriggered,
        total_savings_c: parseFloat(alertData.totalSavings) || 0
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
          console.error(`Failed to update price alert ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
        }
        
        if (successfulUpdates.length > 0) {
          const updatedRecord = successfulUpdates[0].data;
          return {
            Id: updatedRecord.Id,
            giftId: updatedRecord.gift_c || null,
            recipientId: updatedRecord.recipient_c || null,
            enabled: updatedRecord.enabled_c || false,
            priceDropThreshold: parseInt(updatedRecord.price_drop_threshold_c) || 10,
            absoluteThreshold: parseFloat(updatedRecord.absolute_threshold_c) || 0,
            stockAlerts: updatedRecord.stock_alerts_c || false,
            emailEnabled: updatedRecord.email_enabled_c !== false,
            pushEnabled: updatedRecord.push_enabled_c !== false,
            frequency: updatedRecord.frequency_c || 'immediate',
            createdAt: updatedRecord.created_at_c || updatedRecord.CreatedOn,
            lastTriggered: updatedRecord.last_triggered_c,
            totalSavings: parseFloat(updatedRecord.total_savings_c) || 0
          };
        }
      }
    } catch (error) {
      console.error("Error updating price alert:", error?.response?.data?.message || error.message);
      throw error;
    }
  }

  async updateConfig(id, config) {
    await this.delay(250);
    return this.update(id, config);
  }

  async toggleAlert(id) {
    try {
      const alert = await this.getById(id);
      if (!alert) throw new Error("Alert not found");
      
      return this.update(id, { enabled: !alert.enabled });
    } catch (error) {
      console.error("Error toggling price alert:", error?.response?.data?.message || error.message);
      throw error;
    }
  }

  async delete(id) {
    try {
      await this.delay(250);
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
          console.error(`Failed to delete price alert ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
        }
        
        return successfulDeletions.length === 1;
      }
    } catch (error) {
      console.error("Error deleting price alert:", error?.response?.data?.message || error.message);
      throw error;
    }
  }

  async triggerAlert(id, newPrice) {
    try {
      await this.delay(300);
      const alert = await this.getById(id);
      if (!alert || !alert.enabled) return null;

      const updated = await this.update(id, {
        lastTriggered: new Date().toISOString(),
        totalSavings: (alert.totalSavings || 0) + Math.max(0, (alert.originalPrice || 0) - newPrice)
      });

      return updated;
    } catch (error) {
      console.error("Error triggering price alert:", error?.response?.data?.message || error.message);
      return null;
    }
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
    try {
      await this.delay(500);
      const activeAlerts = await this.getActiveAlerts();
      const triggeredAlerts = [];

      // Simulate price checking logic
      for (const alert of activeAlerts) {
        // Mock price change detection
        if (Math.random() > 0.8) { // 20% chance of price change
          const mockNewPrice = (alert.originalPrice || 100) * (0.85 + Math.random() * 0.1); // 5-15% drop
          const triggered = await this.triggerAlert(alert.Id, mockNewPrice);
          if (triggered) {
            triggeredAlerts.push(triggered);
          }
        }
      }

      return triggeredAlerts;
    } catch (error) {
      console.error("Error checking price changes:", error?.response?.data?.message || error.message);
      return [];
    }
  }
}

export const priceAlertService = new PriceAlertService();