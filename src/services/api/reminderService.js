class ReminderService {
  constructor() {
    this.tableName = 'reminder_c';
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
          { field: { Name: "alert_date_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "occasion_c" } },
          { field: { Name: "recipient_c" } }
        ],
        orderBy: [{ fieldName: "alert_date_c", sorttype: "ASC" }]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      // Transform database response to match UI expectations
      const reminders = (response.data || []).map(record => ({
        Id: record.Id,
        alertDate: record.alert_date_c || new Date().toISOString(),
        status: record.status_c || 'active',
        occasionId: record.occasion_c?.Id || null,
        recipientId: record.recipient_c?.Id || null,
        occasion: record.occasion_c ? {
          Id: record.occasion_c.Id,
          type: record.occasion_c.Name,
          date: record.alert_date_c
        } : null,
        recipient: record.recipient_c ? {
          Id: record.recipient_c.Id,
          name: record.recipient_c.Name
        } : null
      }));

      return reminders.sort((a, b) => new Date(a.alertDate) - new Date(b.alertDate));
    } catch (error) {
      console.error("Error fetching reminders:", error?.response?.data?.message || error.message);
      throw error;
    }
  }

  async getById(id) {
    try {
      await this.delay(150);
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "alert_date_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "occasion_c" } },
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
        alertDate: record.alert_date_c || new Date().toISOString(),
        status: record.status_c || 'active',
        occasionId: record.occasion_c?.Id || null,
        recipientId: record.recipient_c?.Id || null,
        occasion: record.occasion_c ? {
          Id: record.occasion_c.Id,
          type: record.occasion_c.Name,
          date: record.alert_date_c
        } : null,
        recipient: record.recipient_c ? {
          Id: record.recipient_c.Id,
          name: record.recipient_c.Name
        } : null
      };
    } catch (error) {
      console.error(`Error fetching reminder with ID ${id}:`, error?.response?.data?.message || error.message);
      return null;
    }
  }

  async getUpcoming(days = 30) {
    try {
      await this.delay(300);
      const now = new Date();
      const future = new Date();
      future.setDate(now.getDate() + days);
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "alert_date_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "occasion_c" } },
          { field: { Name: "recipient_c" } }
        ],
        where: [
          {
            FieldName: "alert_date_c",
            Operator: "GreaterThanOrEqualTo",
            Values: [now.toISOString()]
          },
          {
            FieldName: "alert_date_c",
            Operator: "LessThanOrEqualTo", 
            Values: [future.toISOString()]
          },
          {
            FieldName: "status_c",
            Operator: "EqualTo",
            Values: ["active"]
          }
        ],
        orderBy: [{ fieldName: "alert_date_c", sorttype: "ASC" }]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return (response.data || []).map(record => ({
        Id: record.Id,
        alertDate: record.alert_date_c || new Date().toISOString(),
        status: record.status_c || 'active',
        occasionId: record.occasion_c?.Id || null,
        recipientId: record.recipient_c?.Id || null
      }));
    } catch (error) {
      console.error("Error fetching upcoming reminders:", error?.response?.data?.message || error.message);
      return [];
    }
  }

  async getByRecipient(recipientId) {
    try {
      await this.delay(200);
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "alert_date_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "occasion_c" } },
          { field: { Name: "recipient_c" } }
        ],
        where: [
          {
            FieldName: "recipient_c",
            Operator: "EqualTo",
            Values: [parseInt(recipientId)]
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
        alertDate: record.alert_date_c || new Date().toISOString(),
        status: record.status_c || 'active',
        occasionId: record.occasion_c?.Id || null,
        recipientId: record.recipient_c?.Id || null
      }));
    } catch (error) {
      console.error("Error fetching reminders by recipient:", error?.response?.data?.message || error.message);
      return [];
    }
  }

  async create(reminderData) {
    try {
      await this.delay(350);
      
      // Transform UI data to database format - only include Updateable fields
      const dbData = {
        Name: reminderData.name || `Reminder for ${reminderData.recipientId}`,
        alert_date_c: reminderData.alertDate || new Date().toISOString(),
        status_c: reminderData.status || 'active',
        occasion_c: reminderData.occasionId ? parseInt(reminderData.occasionId) : null,
        recipient_c: parseInt(reminderData.recipientId)
      };

      // Remove null values for optional fields
      if (!dbData.occasion_c) {
        delete dbData.occasion_c;
      }

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
          console.error(`Failed to create reminder ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
        }
        
        if (successfulRecords.length > 0) {
          const createdRecord = successfulRecords[0].data;
          return {
            Id: createdRecord.Id,
            alertDate: createdRecord.alert_date_c || new Date().toISOString(),
            status: createdRecord.status_c || 'active',
            occasionId: createdRecord.occasion_c || null,
            recipientId: createdRecord.recipient_c || null
          };
        }
      }
    } catch (error) {
      console.error("Error creating reminder:", error?.response?.data?.message || error.message);
      throw error;
    }
  }

  async update(id, reminderData) {
    try {
      await this.delay(300);
      
      // Transform UI data to database format - only include Updateable fields
      const dbData = {
        Id: parseInt(id),
        Name: reminderData.name,
        alert_date_c: reminderData.alertDate,
        status_c: reminderData.status,
        occasion_c: reminderData.occasionId ? parseInt(reminderData.occasionId) : undefined,
        recipient_c: reminderData.recipientId ? parseInt(reminderData.recipientId) : undefined
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
          console.error(`Failed to update reminder ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
        }
        
        if (successfulUpdates.length > 0) {
          const updatedRecord = successfulUpdates[0].data;
          return {
            Id: updatedRecord.Id,
            alertDate: updatedRecord.alert_date_c || new Date().toISOString(),
            status: updatedRecord.status_c || 'active',
            occasionId: updatedRecord.occasion_c || null,
            recipientId: updatedRecord.recipient_c || null
          };
        }
      }
    } catch (error) {
      console.error("Error updating reminder:", error?.response?.data?.message || error.message);
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
          console.error(`Failed to delete reminder ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
        }
        
        return successfulDeletions.length === 1;
      }
    } catch (error) {
      console.error("Error deleting reminder:", error?.response?.data?.message || error.message);
      throw error;
    }
  }

  async snooze(id, hours = 24) {
    try {
      await this.delay(200);
      const reminder = await this.getById(id);
      if (!reminder) throw new Error("Reminder not found");
      
      const newAlertDate = new Date();
      newAlertDate.setHours(newAlertDate.getHours() + hours);
      
      return this.update(id, {
        alertDate: newAlertDate.toISOString(),
        status: "snoozed"
      });
    } catch (error) {
      console.error("Error snoozing reminder:", error?.response?.data?.message || error.message);
      throw error;
    }
  }
}

export const reminderService = new ReminderService();