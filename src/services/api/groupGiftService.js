class GroupGiftService {
  constructor() {
    this.tableName = 'group_gift_c';
    // Initialize ApperClient with Project ID and Public Key
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
  }

  async delay(ms = 500) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async getAll() {
    try {
      await this.delay();
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "occasion_type_c" } },
          { field: { Name: "target_amount_c" } },
          { field: { Name: "current_amount_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "deadline_c" } },
          { field: { Name: "created_by_c" } },
          { field: { Name: "created_at_c" } },
          { field: { Name: "recipient_c" } },
          { field: { Name: "gift_c" } }
        ],
        orderBy: [{ fieldName: "Id", sorttype: "DESC" }]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      // Transform database response to match UI expectations
      const groupGifts = (response.data || []).map(record => ({
        Id: record.Id,
        title: record.title_c || record.Name || '',
        description: record.description_c || '',
        recipientId: record.recipient_c?.Id || null,
        giftId: record.gift_c?.Id || null,
        occasionType: record.occasion_type_c || 'General',
        targetAmount: parseFloat(record.target_amount_c) || 0,
        currentAmount: parseFloat(record.current_amount_c) || 0,
        status: record.status_c || 'active',
        deadline: record.deadline_c || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        createdBy: record.created_by_c || 'user@example.com',
        createdAt: record.created_at_c || record.CreatedOn || new Date().toISOString(),
        contributors: [], // Would need separate table for contributors
        invitedContributors: [] // Would need separate table for invitations
      }));

      return groupGifts;
    } catch (error) {
      console.error("Error fetching group gifts:", error?.response?.data?.message || error.message);
      throw error;
    }
  }

  async getById(id) {
    try {
      await this.delay();
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "occasion_type_c" } },
          { field: { Name: "target_amount_c" } },
          { field: { Name: "current_amount_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "deadline_c" } },
          { field: { Name: "created_by_c" } },
          { field: { Name: "created_at_c" } },
          { field: { Name: "recipient_c" } },
          { field: { Name: "gift_c" } }
        ]
      };

      const response = await this.apperClient.getRecordById(this.tableName, parseInt(id), params);
      
      if (!response.success || !response.data) {
        throw new Error(`Group gift with ID ${id} not found`);
      }

      const record = response.data;
      return {
        Id: record.Id,
        title: record.title_c || record.Name || '',
        description: record.description_c || '',
        recipientId: record.recipient_c?.Id || null,
        giftId: record.gift_c?.Id || null,
        occasionType: record.occasion_type_c || 'General',
        targetAmount: parseFloat(record.target_amount_c) || 0,
        currentAmount: parseFloat(record.current_amount_c) || 0,
        status: record.status_c || 'active',
        deadline: record.deadline_c || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        createdBy: record.created_by_c || 'user@example.com',
        createdAt: record.created_at_c || record.CreatedOn || new Date().toISOString(),
        contributors: [], // Would be populated from separate table
        invitedContributors: [] // Would be populated from separate table
      };
    } catch (error) {
      console.error(`Error fetching group gift with ID ${id}:`, error?.response?.data?.message || error.message);
      throw error;
    }
  }

  async getByRecipient(recipientId) {
    try {
      await this.delay();
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "occasion_type_c" } },
          { field: { Name: "target_amount_c" } },
          { field: { Name: "current_amount_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "deadline_c" } },
          { field: { Name: "created_by_c" } },
          { field: { Name: "created_at_c" } },
          { field: { Name: "recipient_c" } },
          { field: { Name: "gift_c" } }
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
        title: record.title_c || record.Name || '',
        description: record.description_c || '',
        recipientId: record.recipient_c?.Id || null,
        giftId: record.gift_c?.Id || null,
        occasionType: record.occasion_type_c || 'General',
        targetAmount: parseFloat(record.target_amount_c) || 0,
        currentAmount: parseFloat(record.current_amount_c) || 0,
        status: record.status_c || 'active',
        deadline: record.deadline_c,
        createdBy: record.created_by_c || 'user@example.com',
        createdAt: record.created_at_c || record.CreatedOn,
        contributors: [],
        invitedContributors: []
      }));
    } catch (error) {
      console.error("Error fetching group gifts by recipient:", error?.response?.data?.message || error.message);
      return [];
    }
  }

  async getByCreator(creatorEmail) {
    try {
      await this.delay();
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "occasion_type_c" } },
          { field: { Name: "target_amount_c" } },
          { field: { Name: "current_amount_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "deadline_c" } },
          { field: { Name: "created_by_c" } },
          { field: { Name: "created_at_c" } },
          { field: { Name: "recipient_c" } },
          { field: { Name: "gift_c" } }
        ],
        where: [
          {
            FieldName: "created_by_c",
            Operator: "EqualTo",
            Values: [creatorEmail]
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
        title: record.title_c || record.Name || '',
        description: record.description_c || '',
        recipientId: record.recipient_c?.Id || null,
        giftId: record.gift_c?.Id || null,
        occasionType: record.occasion_type_c || 'General',
        targetAmount: parseFloat(record.target_amount_c) || 0,
        currentAmount: parseFloat(record.current_amount_c) || 0,
        status: record.status_c || 'active',
        deadline: record.deadline_c,
        createdBy: record.created_by_c || 'user@example.com',
        createdAt: record.created_at_c || record.CreatedOn,
        contributors: [],
        invitedContributors: []
      }));
    } catch (error) {
      console.error("Error fetching group gifts by creator:", error?.response?.data?.message || error.message);
      return [];
    }
  }

  async create(groupGiftData) {
    try {
      await this.delay();
      
      // Transform UI data to database format - only include Updateable fields
      const dbData = {
        Name: groupGiftData.title,
        title_c: groupGiftData.title,
        description_c: groupGiftData.description || '',
        occasion_type_c: groupGiftData.occasionType || 'General',
        target_amount_c: parseFloat(groupGiftData.targetAmount) || 0,
        current_amount_c: 0,
        status_c: 'active',
        deadline_c: groupGiftData.deadline,
        created_by_c: groupGiftData.createdBy || 'user@example.com',
        created_at_c: new Date().toISOString(),
        recipient_c: parseInt(groupGiftData.recipientId),
        gift_c: groupGiftData.giftId ? parseInt(groupGiftData.giftId) : null
      };

      // Remove null values for optional fields
      if (!dbData.gift_c) {
        delete dbData.gift_c;
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
          console.error(`Failed to create group gift ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
        }
        
        if (successfulRecords.length > 0) {
          const createdRecord = successfulRecords[0].data;
          return {
            Id: createdRecord.Id,
            title: createdRecord.title_c || createdRecord.Name,
            description: createdRecord.description_c || '',
            recipientId: createdRecord.recipient_c || null,
            giftId: createdRecord.gift_c || null,
            occasionType: createdRecord.occasion_type_c || 'General',
            targetAmount: parseFloat(createdRecord.target_amount_c) || 0,
            currentAmount: 0,
            status: 'active',
            deadline: createdRecord.deadline_c,
            createdBy: createdRecord.created_by_c || 'user@example.com',
            createdAt: createdRecord.created_at_c || new Date().toISOString(),
            contributors: [],
            invitedContributors: groupGiftData.invitedContributors || []
          };
        }
      }
    } catch (error) {
      console.error("Error creating group gift:", error?.response?.data?.message || error.message);
      throw error;
    }
  }

  async update(id, groupGiftData) {
    try {
      await this.delay();
      
      // Transform UI data to database format - only include Updateable fields
      const dbData = {
        Id: parseInt(id),
        Name: groupGiftData.title,
        title_c: groupGiftData.title,
        description_c: groupGiftData.description,
        occasion_type_c: groupGiftData.occasionType,
        target_amount_c: groupGiftData.targetAmount ? parseFloat(groupGiftData.targetAmount) : undefined,
        current_amount_c: groupGiftData.currentAmount ? parseFloat(groupGiftData.currentAmount) : undefined,
        status_c: groupGiftData.status,
        deadline_c: groupGiftData.deadline
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
          console.error(`Failed to update group gift ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
        }
        
        if (successfulUpdates.length > 0) {
          const updatedRecord = successfulUpdates[0].data;
          return {
            Id: updatedRecord.Id,
            title: updatedRecord.title_c || updatedRecord.Name,
            description: updatedRecord.description_c || '',
            recipientId: updatedRecord.recipient_c || null,
            giftId: updatedRecord.gift_c || null,
            occasionType: updatedRecord.occasion_type_c || 'General',
            targetAmount: parseFloat(updatedRecord.target_amount_c) || 0,
            currentAmount: parseFloat(updatedRecord.current_amount_c) || 0,
            status: updatedRecord.status_c || 'active',
            deadline: updatedRecord.deadline_c,
            createdBy: updatedRecord.created_by_c || 'user@example.com',
            createdAt: updatedRecord.created_at_c || updatedRecord.CreatedOn,
            contributors: groupGiftData.contributors || [],
            invitedContributors: groupGiftData.invitedContributors || []
          };
        }
      }
    } catch (error) {
      console.error("Error updating group gift:", error?.response?.data?.message || error.message);
      throw error;
    }
  }

  async delete(id) {
    try {
      await this.delay();
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
          console.error(`Failed to delete group gift ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
        }
        
        return successfulDeletions.length === 1;
      }
    } catch (error) {
      console.error("Error deleting group gift:", error?.response?.data?.message || error.message);
      throw error;
    }
  }

  // Mock implementations for contributor functionality
  // These would require separate tables in a real implementation
  async addContribution(id, contributionData) {
    await this.delay();
    
    const groupGift = await this.getById(id);
    
    const newContribution = {
      Id: Date.now(), // Mock ID
      name: contributionData.name,
      email: contributionData.email,
      amount: parseFloat(contributionData.amount),
      contributedAt: new Date().toISOString(),
      message: contributionData.message || ''
    };

    // Update current amount in database
    const newCurrentAmount = groupGift.currentAmount + newContribution.amount;
    const newStatus = newCurrentAmount >= groupGift.targetAmount ? 'completed' : 'active';
    
    await this.update(id, {
      currentAmount: newCurrentAmount,
      status: newStatus
    });

    return newContribution;
  }

  async inviteContributors(id, invitations) {
    await this.delay();
    
    const newInvitations = invitations.map(invitation => ({
      email: invitation.email,
      name: invitation.name || invitation.email,
      invitedAt: new Date().toISOString(),
      status: 'pending'
    }));

    // In a real implementation, these would be stored in a separate table
    return newInvitations;
  }

  async removeInvitation(id, email) {
    await this.delay();
    // Mock implementation - in reality would remove from separate table
    return true;
  }

  async getContributionStats() {
    try {
      await this.delay();
      
      const groupGifts = await this.getAll();
      
      const stats = {
        totalGroupGifts: groupGifts.length,
        activeGroupGifts: groupGifts.filter(g => g.status === 'active').length,
        completedGroupGifts: groupGifts.filter(g => g.status === 'completed').length,
        totalAmount: groupGifts.reduce((sum, g) => sum + g.currentAmount, 0),
        averageContribution: 0,
        totalContributors: 0
      };

      // Mock contributor calculation since contributors are not stored in DB yet
      const allContributors = groupGifts.flatMap(g => g.contributors || []);
      stats.totalContributors = allContributors.length;
      
      if (stats.totalContributors > 0) {
        const totalContributions = allContributors.reduce((sum, c) => sum + c.amount, 0);
        stats.averageContribution = totalContributions / stats.totalContributors;
      }

      return stats;
    } catch (error) {
      console.error("Error getting contribution stats:", error?.response?.data?.message || error.message);
      return {
        totalGroupGifts: 0,
        activeGroupGifts: 0,
        completedGroupGifts: 0,
        totalAmount: 0,
        averageContribution: 0,
        totalContributors: 0
      };
    }
  }
}

export const groupGiftService = new GroupGiftService();