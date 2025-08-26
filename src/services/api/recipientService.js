class RecipientService {
  constructor() {
    this.tableName = 'recipient_c';
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
      await this.delay();
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "relationship_c" } },
          { field: { Name: "age_c" } },
          { field: { Name: "interests_c" } },
          { field: { Name: "location_c" } },
          { field: { Name: "photo_url_c" } }
        ],
        orderBy: [{ fieldName: "Id", sorttype: "DESC" }]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      // Transform database response to match UI expectations
      const recipients = (response.data || []).map(record => ({
        Id: record.Id,
        name: record.Name || '',
        relationship: record.relationship_c || '',
        age: record.age_c || 0,
        interests: record.interests_c ? record.interests_c.split(',').map(i => i.trim()).filter(Boolean) : [],
        location: record.location_c || '',
        photoUrl: record.photo_url_c || '',
        occasions: [], // Will be populated from occasion_c table when needed
        giftHistory: []
      }));

      return recipients;
    } catch (error) {
      console.error("Error fetching recipients:", error?.response?.data?.message || error.message);
      throw error;
    }
  }

  async getById(id) {
    try {
      await this.delay(200);
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "relationship_c" } },
          { field: { Name: "age_c" } },
          { field: { Name: "interests_c" } },
          { field: { Name: "location_c" } },
          { field: { Name: "photo_url_c" } }
        ]
      };

      const response = await this.apperClient.getRecordById(this.tableName, parseInt(id), params);
      
      if (!response.success || !response.data) {
        return null;
      }

      // Transform database response to match UI expectations
      const recipient = {
        Id: response.data.Id,
        name: response.data.Name || '',
        relationship: response.data.relationship_c || '',
        age: response.data.age_c || 0,
        interests: response.data.interests_c ? response.data.interests_c.split(',').map(i => i.trim()).filter(Boolean) : [],
        location: response.data.location_c || '',
        photoUrl: response.data.photo_url_c || '',
        occasions: [],
        giftHistory: []
      };

      return recipient;
    } catch (error) {
      console.error(`Error fetching recipient with ID ${id}:`, error?.response?.data?.message || error.message);
      return null;
    }
  }

  async create(recipientData) {
    try {
      await this.delay(400);
      
      // Transform UI data to database format - only include Updateable fields
      const dbData = {
        Name: recipientData.name || '',
        relationship_c: recipientData.relationship || '',
        age_c: parseInt(recipientData.age) || 0,
        interests_c: Array.isArray(recipientData.interests) 
          ? recipientData.interests.join(',') 
          : recipientData.interests || '',
        location_c: recipientData.location || '',
        photo_url_c: recipientData.photoUrl || ''
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
          console.error(`Failed to create recipient ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              console.error(`${error.fieldLabel}: ${error}`);
            });
          });
        }
        
        if (successfulRecords.length > 0) {
          const createdRecord = successfulRecords[0].data;
          // Transform back to UI format
          return {
            Id: createdRecord.Id,
            name: createdRecord.Name || '',
            relationship: createdRecord.relationship_c || '',
            age: createdRecord.age_c || 0,
            interests: createdRecord.interests_c ? createdRecord.interests_c.split(',').map(i => i.trim()).filter(Boolean) : [],
            location: createdRecord.location_c || '',
            photoUrl: createdRecord.photo_url_c || '',
            occasions: recipientData.occasions || [],
            giftHistory: []
          };
        }
      }
    } catch (error) {
      console.error("Error creating recipient:", error?.response?.data?.message || error.message);
      throw error;
    }
  }

  async update(id, recipientData) {
    try {
      await this.delay(350);
      
      // Transform UI data to database format - only include Updateable fields
      const dbData = {
        Id: parseInt(id),
        Name: recipientData.name || '',
        relationship_c: recipientData.relationship || '',
        age_c: parseInt(recipientData.age) || 0,
        interests_c: Array.isArray(recipientData.interests) 
          ? recipientData.interests.join(',') 
          : recipientData.interests || '',
        location_c: recipientData.location || '',
        photo_url_c: recipientData.photoUrl || ''
      };

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
          console.error(`Failed to update recipient ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              console.error(`${error.fieldLabel}: ${error}`);
            });
          });
        }
        
        if (successfulUpdates.length > 0) {
          const updatedRecord = successfulUpdates[0].data;
          // Transform back to UI format
          return {
            Id: updatedRecord.Id,
            name: updatedRecord.Name || '',
            relationship: updatedRecord.relationship_c || '',
            age: updatedRecord.age_c || 0,
            interests: updatedRecord.interests_c ? updatedRecord.interests_c.split(',').map(i => i.trim()).filter(Boolean) : [],
            location: updatedRecord.location_c || '',
            photoUrl: updatedRecord.photo_url_c || '',
            occasions: recipientData.occasions || [],
            giftHistory: recipientData.giftHistory || []
          };
        }
      }
    } catch (error) {
      console.error("Error updating recipient:", error?.response?.data?.message || error.message);
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
          console.error(`Failed to delete recipient ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          failedDeletions.forEach(record => {
            if (record.message) console.error(record.message);
          });
        }
        
        return successfulDeletions.length === 1;
      }
    } catch (error) {
      console.error("Error deleting recipient:", error?.response?.data?.message || error.message);
      throw error;
    }
  }
}

export const recipientService = new RecipientService();