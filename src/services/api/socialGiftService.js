class SocialGiftService {
  constructor() {
    this.friendsTableName = 'friend_c';
    this.wishlistsTableName = 'shared_wishlist_c';
    this.activitiesTableName = 'social_gift_c';
    
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

  // Friends Management
  async getFriends() {
    try {
      await this.delay();
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "email_c" } },
          { field: { Name: "photo_url_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "mutual_friends_c" } },
          { field: { Name: "joined_at_c" } },
          { field: { Name: "last_active_c" } }
        ],
        orderBy: [{ fieldName: "Id", sorttype: "DESC" }]
      };

      const response = await this.apperClient.fetchRecords(this.friendsTableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      // Transform database response to match UI expectations
      const friends = (response.data || []).map(record => ({
        Id: record.Id,
        name: record.Name || '',
        email: record.email_c || '',
        photoUrl: record.photo_url_c || '',
        status: record.status_c || 'pending',
        mutualFriends: parseInt(record.mutual_friends_c) || 0,
        joinedAt: record.joined_at_c || record.CreatedOn || new Date().toISOString(),
        lastActive: record.last_active_c || record.ModifiedOn || new Date().toISOString()
      }));

      return friends;
    } catch (error) {
      console.error("Error fetching friends:", error?.response?.data?.message || error.message);
      throw error;
    }
  }

  async addFriend(friendData) {
    try {
      await this.delay();
      
      // Transform UI data to database format - only include Updateable fields
      const dbData = {
        Name: friendData.name || friendData.email.split('@')[0],
        email_c: friendData.email,
        photo_url_c: friendData.photoUrl || '',
        status_c: 'pending',
        mutual_friends_c: 0,
        joined_at_c: new Date().toISOString(),
        last_active_c: new Date().toISOString()
      };

      const params = {
        records: [dbData]
      };

      const response = await this.apperClient.createRecord(this.friendsTableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create friend ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
        }
        
        if (successfulRecords.length > 0) {
          const createdRecord = successfulRecords[0].data;
          return {
            Id: createdRecord.Id,
            name: createdRecord.Name || '',
            email: createdRecord.email_c || '',
            photoUrl: createdRecord.photo_url_c || '',
            status: createdRecord.status_c || 'pending',
            mutualFriends: parseInt(createdRecord.mutual_friends_c) || 0,
            joinedAt: createdRecord.joined_at_c || new Date().toISOString(),
            lastActive: createdRecord.last_active_c || new Date().toISOString()
          };
        }
      }
    } catch (error) {
      console.error("Error adding friend:", error?.response?.data?.message || error.message);
      throw error;
    }
  }

  async removeFriend(id) {
    try {
      await this.delay();
      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await this.apperClient.deleteRecord(this.friendsTableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete friend ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
        }
        
        return successfulDeletions.length === 1;
      }
    } catch (error) {
      console.error("Error removing friend:", error?.response?.data?.message || error.message);
      throw error;
    }
  }

  // Shared Wishlists
  async getSharedWishlists() {
    try {
      await this.delay();
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "is_public_c" } },
          { field: { Name: "allow_contributions_c" } },
          { field: { Name: "created_by_c" } },
          { field: { Name: "created_at_c" } }
        ],
        orderBy: [{ fieldName: "Id", sorttype: "DESC" }]
      };

      const response = await this.apperClient.fetchRecords(this.wishlistsTableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      // Transform database response to match UI expectations
      const wishlists = (response.data || []).map(record => ({
        Id: record.Id,
        title: record.title_c || record.Name || '',
        description: record.description_c || '',
        isPublic: record.is_public_c || false,
        allowContributions: record.allow_contributions_c !== false,
        createdBy: record.created_by_c || 'current-user@example.com',
        createdAt: record.created_at_c || record.CreatedOn || new Date().toISOString(),
        collaborators: [{
          Id: 1,
          name: 'You',
          email: record.created_by_c || 'current-user@example.com',
          role: 'owner'
        }],
        items: [] // Would need separate table for wishlist items
      }));

      return wishlists;
    } catch (error) {
      console.error("Error fetching shared wishlists:", error?.response?.data?.message || error.message);
      throw error;
    }
  }

  async createSharedWishlist(wishlistData) {
    try {
      await this.delay();
      
      // Transform UI data to database format - only include Updateable fields
      const dbData = {
        Name: wishlistData.title,
        title_c: wishlistData.title,
        description_c: wishlistData.description || '',
        is_public_c: wishlistData.isPublic || false,
        allow_contributions_c: wishlistData.allowContributions !== false,
        created_by_c: 'current-user@example.com',
        created_at_c: new Date().toISOString()
      };

      const params = {
        records: [dbData]
      };

      const response = await this.apperClient.createRecord(this.wishlistsTableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create wishlist ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
        }
        
        if (successfulRecords.length > 0) {
          const createdRecord = successfulRecords[0].data;
          return {
            Id: createdRecord.Id,
            title: createdRecord.title_c || createdRecord.Name,
            description: createdRecord.description_c || '',
            isPublic: createdRecord.is_public_c || false,
            allowContributions: createdRecord.allow_contributions_c !== false,
            createdBy: createdRecord.created_by_c || 'current-user@example.com',
            createdAt: createdRecord.created_at_c || new Date().toISOString(),
            collaborators: [{
              Id: 1,
              name: 'You',
              email: createdRecord.created_by_c || 'current-user@example.com',
              role: 'owner'
            }],
            items: []
          };
        }
      }
    } catch (error) {
      console.error("Error creating shared wishlist:", error?.response?.data?.message || error.message);
      throw error;
    }
  }

  async updateWishlistPrivacy(id, isPublic) {
    try {
      await this.delay();
      
      const dbData = {
        Id: parseInt(id),
        is_public_c: !isPublic
      };

      const params = {
        records: [dbData]
      };

      const response = await this.apperClient.updateRecord(this.wishlistsTableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update wishlist privacy ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
        }
        
        if (successfulUpdates.length > 0) {
          const updatedRecord = successfulUpdates[0].data;
          return {
            Id: updatedRecord.Id,
            title: updatedRecord.title_c || updatedRecord.Name,
            description: updatedRecord.description_c || '',
            isPublic: updatedRecord.is_public_c || false,
            allowContributions: updatedRecord.allow_contributions_c !== false,
            createdBy: updatedRecord.created_by_c || 'current-user@example.com',
            createdAt: updatedRecord.created_at_c || updatedRecord.CreatedOn,
            collaborators: [{
              Id: 1,
              name: 'You',
              email: updatedRecord.created_by_c || 'current-user@example.com',
              role: 'owner'
            }],
            items: []
          };
        }
      }
    } catch (error) {
      console.error("Error updating wishlist privacy:", error?.response?.data?.message || error.message);
      throw error;
    }
  }

  async addItemToWishlist(wishlistId, item) {
    // This would require a separate wishlist_items table or storing as JSON
    // For now, return the item as if it was added
    await this.delay();
    
    const newItem = {
      Id: Date.now(), // Mock ID generation
      ...item,
      addedAt: new Date().toISOString(),
      addedBy: 'current-user@example.com'
    };

    return newItem;
  }

  // Gift Activities
  async getGiftActivities() {
    try {
      await this.delay();
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "type_c" } },
          { field: { Name: "friend_id_c" } },
          { field: { Name: "friend_name_c" } },
          { field: { Name: "friend_photo_url_c" } },
          { field: { Name: "gift_id_c" } },
          { field: { Name: "gift_title_c" } },
          { field: { Name: "recipient_id_c" } },
          { field: { Name: "recipient_name_c" } },
          { field: { Name: "occasion_c" } },
          { field: { Name: "price_c" } },
          { field: { Name: "timestamp_c" } },
          { field: { Name: "privacy_c" } },
          { field: { Name: "notes_c" } },
          { field: { Name: "can_view_c" } }
        ],
        orderBy: [{ fieldName: "timestamp_c", sorttype: "DESC" }]
      };

      const response = await this.apperClient.fetchRecords(this.activitiesTableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      // Transform database response to match UI expectations
      const activities = (response.data || []).map(record => ({
        Id: record.Id,
        type: record.type_c || 'shared',
        friendId: parseInt(record.friend_id_c) || 0,
        friendName: record.friend_name_c || '',
        friendPhotoUrl: record.friend_photo_url_c || '',
        giftId: parseInt(record.gift_id_c) || 0,
        giftTitle: record.gift_title_c || '',
        recipientId: record.recipient_id_c ? parseInt(record.recipient_id_c) : null,
        recipientName: record.recipient_name_c || '',
        occasion: record.occasion_c || '',
        price: record.price_c ? parseFloat(record.price_c) : null,
        timestamp: record.timestamp_c || record.CreatedOn || new Date().toISOString(),
        privacy: record.privacy_c || 'public',
        notes: record.notes_c || '',
        canView: record.can_view_c !== false,
        reactions: [] // Would need separate table for reactions
      }));

      return activities;
    } catch (error) {
      console.error("Error fetching gift activities:", error?.response?.data?.message || error.message);
      throw error;
    }
  }

  async shareGift(giftId, friendIds, message = '') {
    try {
      await this.delay();
      const friends = await this.getFriends();
      
      const activities = await Promise.all(friendIds.map(async friendId => {
        const friend = friends.find(f => f.Id === parseInt(friendId));
        
        const dbData = {
          Name: `Shared Gift ${giftId} with ${friend?.name || 'Friend'}`,
          type_c: 'shared',
          friend_id_c: parseInt(friendId),
          friend_name_c: friend?.name || 'Unknown Friend',
          friend_photo_url_c: friend?.photoUrl || '',
          gift_id_c: parseInt(giftId),
          gift_title_c: `Gift #${giftId}`,
          recipient_id_c: null,
          recipient_name_c: '',
          timestamp_c: new Date().toISOString(),
          privacy_c: 'public',
          notes_c: message,
          can_view_c: true
        };

        const params = {
          records: [dbData]
        };

        const response = await this.apperClient.createRecord(this.activitiesTableName, params);
        
        if (response.success && response.results?.[0]?.success) {
          const createdRecord = response.results[0].data;
          return {
            Id: createdRecord.Id,
            type: 'shared',
            friendId: parseInt(friendId),
            friendName: friend?.name || 'Unknown Friend',
            friendPhotoUrl: friend?.photoUrl || '',
            giftId: parseInt(giftId),
            giftTitle: `Gift #${giftId}`,
            recipientId: null,
            recipientName: '',
            timestamp: createdRecord.timestamp_c || new Date().toISOString(),
            privacy: 'public',
            message: message,
            canView: true,
            reactions: []
          };
        }
        return null;
      }));

      return activities.filter(Boolean);
    } catch (error) {
      console.error("Error sharing gift:", error?.response?.data?.message || error.message);
      throw error;
    }
  }

  async recordGiftActivity(activityData) {
    try {
      await this.delay();
      
      // Transform UI data to database format - only include Updateable fields
      const dbData = {
        Name: `${activityData.type} activity for ${activityData.giftTitle}`,
        type_c: activityData.type || 'shared',
        friend_id_c: parseInt(activityData.friendId),
        friend_name_c: activityData.friendName,
        friend_photo_url_c: activityData.friendPhotoUrl || '',
        gift_id_c: parseInt(activityData.giftId),
        gift_title_c: activityData.giftTitle,
        recipient_id_c: activityData.recipientId ? parseInt(activityData.recipientId) : null,
        recipient_name_c: activityData.recipientName || '',
        occasion_c: activityData.occasion || '',
        price_c: activityData.price ? parseFloat(activityData.price) : null,
        timestamp_c: new Date().toISOString(),
        privacy_c: activityData.privacy || 'public',
        notes_c: activityData.notes || '',
        can_view_c: activityData.canView !== false
      };

      const params = {
        records: [dbData]
      };

      const response = await this.apperClient.createRecord(this.activitiesTableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create gift activity ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
        }
        
        if (successfulRecords.length > 0) {
          const createdRecord = successfulRecords[0].data;
          return {
            Id: createdRecord.Id,
            type: createdRecord.type_c || 'shared',
            friendId: parseInt(createdRecord.friend_id_c) || 0,
            friendName: createdRecord.friend_name_c || '',
            friendPhotoUrl: createdRecord.friend_photo_url_c || '',
            giftId: parseInt(createdRecord.gift_id_c) || 0,
            giftTitle: createdRecord.gift_title_c || '',
            recipientId: createdRecord.recipient_id_c ? parseInt(createdRecord.recipient_id_c) : null,
            recipientName: createdRecord.recipient_name_c || '',
            occasion: createdRecord.occasion_c || '',
            price: createdRecord.price_c ? parseFloat(createdRecord.price_c) : null,
            timestamp: createdRecord.timestamp_c || new Date().toISOString(),
            privacy: createdRecord.privacy_c || 'public',
            notes: createdRecord.notes_c || '',
            canView: createdRecord.can_view_c !== false,
            reactions: []
          };
        }
      }
    } catch (error) {
      console.error("Error recording gift activity:", error?.response?.data?.message || error.message);
      throw error;
    }
  }

  // Social Stats
  async getSocialStats() {
    try {
      await this.delay();
      
      const [friends, wishlists, activities] = await Promise.all([
        this.getFriends(),
        this.getSharedWishlists(),
        this.getGiftActivities()
      ]);
      
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      
      const stats = {
        totalFriends: friends.length,
        connectedFriends: friends.filter(f => f.status === 'connected').length,
        totalWishlists: wishlists.length,
        publicWishlists: wishlists.filter(w => w.isPublic).length,
        recentActivities: activities.filter(a => {
          const activityDate = new Date(a.timestamp);
          return activityDate > weekAgo;
        }).length
      };

      return stats;
    } catch (error) {
      console.error("Error getting social stats:", error?.response?.data?.message || error.message);
      return {
        totalFriends: 0,
        connectedFriends: 0,
        totalWishlists: 0,
        publicWishlists: 0,
        recentActivities: 0
      };
    }
  }
}

export const socialGiftService = new SocialGiftService();