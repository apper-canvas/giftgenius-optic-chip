class GiftService {
  constructor() {
    this.tableName = 'gift_c';
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
      await this.delay(200);
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title_c" } },
          { field: { Name: "category_c" } },
          { field: { Name: "price_c" } },
          { field: { Name: "image_url_c" } },
          { field: { Name: "reasoning_c" } },
          { field: { Name: "match_score_c" } },
          { field: { Name: "delivery_days_c" } },
          { field: { Name: "vendor_c" } },
          { field: { Name: "purchase_url_c" } },
          { field: { Name: "Tags" } }
        ],
        orderBy: [{ fieldName: "Id", sorttype: "DESC" }]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      // Transform database response to match UI expectations
      const gifts = (response.data || []).map(record => ({
        Id: record.Id,
        title: record.title_c || record.Name || '',
        category: record.category_c || 'Products',
        price: parseFloat(record.price_c) || 0,
        imageUrl: record.image_url_c || '',
        reasoning: record.reasoning_c || '',
        matchScore: parseInt(record.match_score_c) || 0,
        deliveryDays: parseInt(record.delivery_days_c) || 7,
        vendor: record.vendor_c || '',
        purchaseUrl: record.purchase_url_c || '',
        tags: record.Tags ? record.Tags.split(',').map(t => t.trim()).filter(Boolean) : []
      }));

      return gifts;
    } catch (error) {
      console.error("Error fetching gifts:", error?.response?.data?.message || error.message);
      throw error;
    }
  }

  async getById(id) {
    try {
      await this.delay(150);
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title_c" } },
          { field: { Name: "category_c" } },
          { field: { Name: "price_c" } },
          { field: { Name: "image_url_c" } },
          { field: { Name: "reasoning_c" } },
          { field: { Name: "match_score_c" } },
          { field: { Name: "delivery_days_c" } },
          { field: { Name: "vendor_c" } },
          { field: { Name: "purchase_url_c" } },
          { field: { Name: "Tags" } }
        ]
      };

      const response = await this.apperClient.getRecordById(this.tableName, parseInt(id), params);
      
      if (!response.success || !response.data) {
        return null;
      }

      // Transform database response to match UI expectations
      const gift = {
        Id: response.data.Id,
        title: response.data.title_c || response.data.Name || '',
        category: response.data.category_c || 'Products',
        price: parseFloat(response.data.price_c) || 0,
        imageUrl: response.data.image_url_c || '',
        reasoning: response.data.reasoning_c || '',
        matchScore: parseInt(response.data.match_score_c) || 0,
        deliveryDays: parseInt(response.data.delivery_days_c) || 7,
        vendor: response.data.vendor_c || '',
        purchaseUrl: response.data.purchase_url_c || '',
        tags: response.data.Tags ? response.data.Tags.split(',').map(t => t.trim()).filter(Boolean) : []
      };

      return gift;
    } catch (error) {
      console.error(`Error fetching gift with ID ${id}:`, error?.response?.data?.message || error.message);
      return null;
    }
  }

  async getRecommendations({ recipientId, occasionId, budget, interests }) {
    try {
      await this.delay(800); // Simulate AI processing time
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title_c" } },
          { field: { Name: "category_c" } },
          { field: { Name: "price_c" } },
          { field: { Name: "image_url_c" } },
          { field: { Name: "reasoning_c" } },
          { field: { Name: "match_score_c" } },
          { field: { Name: "delivery_days_c" } },
          { field: { Name: "vendor_c" } },
          { field: { Name: "purchase_url_c" } },
          { field: { Name: "Tags" } }
        ],
        orderBy: [{ fieldName: "match_score_c", sorttype: "DESC" }],
        pagingInfo: { limit: 15, offset: 0 }
      };

      // Add budget filter if provided
      if (budget) {
        params.where = [
          {
            FieldName: "price_c",
            Operator: "LessThanOrEqualTo",
            Values: [budget * 1.2] // Allow 20% over budget
          }
        ];
      }

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      // Transform database response to match UI expectations
      let recommendations = (response.data || []).map(record => ({
        Id: record.Id,
        title: record.title_c || record.Name || '',
        category: record.category_c || 'Products',
        price: parseFloat(record.price_c) || 0,
        imageUrl: record.image_url_c || '',
        reasoning: record.reasoning_c || '',
        matchScore: parseInt(record.match_score_c) || 0,
        deliveryDays: parseInt(record.delivery_days_c) || 7,
        vendor: record.vendor_c || '',
        purchaseUrl: record.purchase_url_c || '',
        tags: record.Tags ? record.Tags.split(',').map(t => t.trim()).filter(Boolean) : []
      }));

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
      return recommendations.sort((a, b) => b.matchScore - a.matchScore);
    } catch (error) {
      console.error("Error getting gift recommendations:", error?.response?.data?.message || error.message);
      throw error;
    }
  }

  async generateDIYInstructions(giftId) {
    try {
      await this.delay(500);
      const gift = await this.getById(giftId);
      
      if (!gift || gift.category !== 'DIY') {
        throw new Error('Gift not found or not a DIY project');
      }

      // Generate detailed instructions based on gift type
      const instructionTemplates = {
        'DIY Terrarium Kit': {
          materials: [
            { item: 'Glass container or jar', quantity: '1', essential: true },
            { item: 'Small rocks or pebbles', quantity: '1 cup', essential: true },
            { item: 'Activated charcoal', quantity: '2 tbsp', essential: true },
            { item: 'Potting soil', quantity: '2 cups', essential: true },
            { item: 'Small plants (succulents recommended)', quantity: '2-3', essential: true },
            { item: 'Decorative elements (stones, figures)', quantity: 'as desired', essential: false },
            { item: 'Spray bottle', quantity: '1', essential: true },
            { item: 'Small spoon or tweezers', quantity: '1', essential: true }
          ],
          tools: ['Small spoon', 'Tweezers', 'Spray bottle'],
          difficulty: 'Beginner',
          timeEstimate: '45 minutes',
          steps: [
            {
              title: 'Prepare the Base Layer',
              description: 'Add a layer of small rocks or pebbles to the bottom of your container for drainage.',
              image: '/images/diy/terrarium-step1.jpg',
              duration: '5 minutes',
              tips: ['Use rocks about 1/4 to 1/2 inch in size', 'Layer should be about 1 inch deep']
            },
            {
              title: 'Add Charcoal Layer',
              description: 'Sprinkle activated charcoal over the rocks to prevent odors and bacterial growth.',
              image: '/images/diy/terrarium-step2.jpg',
              duration: '3 minutes',
              tips: ['A thin layer is sufficient', 'Charcoal helps keep the terrarium fresh']
            },
            {
              title: 'Create Soil Foundation',
              description: 'Add a layer of potting soil, making it deeper where you plan to plant.',
              image: '/images/diy/terrarium-step3.jpg',
              duration: '7 minutes',
              tips: ['Soil layer should be 2-3 inches deep', 'Create small hills for visual interest']
            },
            {
              title: 'Plant Your Greenery',
              description: 'Carefully plant your chosen plants, starting with the largest ones first.',
              image: '/images/diy/terrarium-step4.jpg',
              duration: '15 minutes',
              tips: ['Use tweezers for precise placement', 'Leave space for plants to grow']
            },
            {
              title: 'Add Decorative Elements',
              description: 'Place decorative stones, moss, or small figurines to personalize your terrarium.',
              image: '/images/diy/terrarium-step5.jpg',
              duration: '10 minutes',
              tips: ['Less is more with decorations', 'Consider the scale of your container']
            },
            {
              title: 'Final Watering and Setup',
              description: 'Lightly mist the terrarium and place it in a location with indirect sunlight.',
              image: '/images/diy/terrarium-step6.jpg',
              duration: '5 minutes',
              tips: ['Avoid overwatering', 'Bright, indirect light is best']
            }
          ]
        }
      };

      // Default template for other DIY projects
      const defaultTemplate = {
        materials: [
          { item: 'Basic craft materials', quantity: 'varies', essential: true },
          { item: 'Decorative elements', quantity: 'as needed', essential: false }
        ],
        tools: ['Basic crafting tools'],
        difficulty: 'Intermediate',
        timeEstimate: '1-2 hours',
        steps: [
          {
            title: 'Gather Materials',
            description: 'Collect all necessary materials and prepare your workspace.',
            image: '/images/diy/generic-step1.jpg',
            duration: '10 minutes',
            tips: ['Read through all instructions first', 'Organize materials within easy reach']
          },
          {
            title: 'Create Your Project',
            description: 'Follow the specific instructions for your chosen DIY project.',
            image: '/images/diy/generic-step2.jpg',
            duration: '60-90 minutes',
            tips: ['Take your time', 'Don\'t be afraid to get creative']
          },
          {
            title: 'Finishing Touches',
            description: 'Add final details and let your project dry or set as needed.',
            image: '/images/diy/generic-step3.jpg',
            duration: '15 minutes',
            tips: ['Allow proper drying time', 'Consider packaging for gifting']
          }
        ]
      };

      const instructions = instructionTemplates[gift.title] || defaultTemplate;

      return {
        giftId: gift.Id,
        gift: { ...gift },
        ...instructions,
        createdAt: new Date().toISOString()
      };
    } catch (error) {
      console.error("Error generating DIY instructions:", error?.response?.data?.message || error.message);
      throw error;
    }
  }

  async getByCategory(category) {
    try {
      await this.delay(250);
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title_c" } },
          { field: { Name: "category_c" } },
          { field: { Name: "price_c" } },
          { field: { Name: "image_url_c" } },
          { field: { Name: "reasoning_c" } },
          { field: { Name: "match_score_c" } },
          { field: { Name: "delivery_days_c" } },
          { field: { Name: "vendor_c" } },
          { field: { Name: "purchase_url_c" } },
          { field: { Name: "Tags" } }
        ],
        where: [
          {
            FieldName: "category_c",
            Operator: "EqualTo",
            Values: [category]
          }
        ]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      // Transform database response to match UI expectations
      const gifts = (response.data || []).map(record => ({
        Id: record.Id,
        title: record.title_c || record.Name || '',
        category: record.category_c || 'Products',
        price: parseFloat(record.price_c) || 0,
        imageUrl: record.image_url_c || '',
        reasoning: record.reasoning_c || '',
        matchScore: parseInt(record.match_score_c) || 0,
        deliveryDays: parseInt(record.delivery_days_c) || 7,
        vendor: record.vendor_c || '',
        purchaseUrl: record.purchase_url_c || '',
        tags: record.Tags ? record.Tags.split(',').map(t => t.trim()).filter(Boolean) : []
      }));

      return gifts;
    } catch (error) {
      console.error("Error fetching gifts by category:", error?.response?.data?.message || error.message);
      throw error;
    }
  }

  async create(giftData) {
    try {
      await this.delay(300);
      
      // Transform UI data to database format - only include Updateable fields
      const dbData = {
        Name: giftData.title || giftData.name || '',
        title_c: giftData.title || '',
        category_c: giftData.category || 'Products',
        price_c: parseFloat(giftData.price) || 0,
        image_url_c: giftData.imageUrl || '',
        reasoning_c: giftData.reasoning || '',
        match_score_c: parseInt(giftData.matchScore) || 0,
        delivery_days_c: parseInt(giftData.deliveryDays) || 7,
        vendor_c: giftData.vendor || '',
        purchase_url_c: giftData.purchaseUrl || '',
        Tags: Array.isArray(giftData.tags) ? giftData.tags.join(',') : giftData.tags || ''
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
          console.error(`Failed to create gift ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
        }
        
        if (successfulRecords.length > 0) {
          const createdRecord = successfulRecords[0].data;
          return {
            Id: createdRecord.Id,
            title: createdRecord.title_c || createdRecord.Name || '',
            category: createdRecord.category_c || 'Products',
            price: parseFloat(createdRecord.price_c) || 0,
            imageUrl: createdRecord.image_url_c || '',
            reasoning: createdRecord.reasoning_c || '',
            matchScore: parseInt(createdRecord.match_score_c) || 0,
            deliveryDays: parseInt(createdRecord.delivery_days_c) || 7,
            vendor: createdRecord.vendor_c || '',
            purchaseUrl: createdRecord.purchase_url_c || '',
            tags: createdRecord.Tags ? createdRecord.Tags.split(',').map(t => t.trim()).filter(Boolean) : []
          };
        }
      }
    } catch (error) {
      console.error("Error creating gift:", error?.response?.data?.message || error.message);
      throw error;
    }
  }

  async update(id, giftData) {
    try {
      await this.delay(350);
      
      // Transform UI data to database format - only include Updateable fields
      const dbData = {
        Id: parseInt(id),
        Name: giftData.title || giftData.name || '',
        title_c: giftData.title || '',
        category_c: giftData.category || 'Products',
        price_c: parseFloat(giftData.price) || 0,
        image_url_c: giftData.imageUrl || '',
        reasoning_c: giftData.reasoning || '',
        match_score_c: parseInt(giftData.matchScore) || 0,
        delivery_days_c: parseInt(giftData.deliveryDays) || 7,
        vendor_c: giftData.vendor || '',
        purchase_url_c: giftData.purchaseUrl || '',
        Tags: Array.isArray(giftData.tags) ? giftData.tags.join(',') : giftData.tags || ''
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
          console.error(`Failed to update gift ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
        }
        
        if (successfulUpdates.length > 0) {
          const updatedRecord = successfulUpdates[0].data;
          return {
            Id: updatedRecord.Id,
            title: updatedRecord.title_c || updatedRecord.Name || '',
            category: updatedRecord.category_c || 'Products',
            price: parseFloat(updatedRecord.price_c) || 0,
            imageUrl: updatedRecord.image_url_c || '',
            reasoning: updatedRecord.reasoning_c || '',
            matchScore: parseInt(updatedRecord.match_score_c) || 0,
            deliveryDays: parseInt(updatedRecord.delivery_days_c) || 7,
            vendor: updatedRecord.vendor_c || '',
            purchaseUrl: updatedRecord.purchase_url_c || '',
            tags: updatedRecord.Tags ? updatedRecord.Tags.split(',').map(t => t.trim()).filter(Boolean) : []
          };
        }
      }
    } catch (error) {
      console.error("Error updating gift:", error?.response?.data?.message || error.message);
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
          console.error(`Failed to delete gift ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
        }
        
        return successfulDeletions.length === 1;
      }
    } catch (error) {
      console.error("Error deleting gift:", error?.response?.data?.message || error.message);
      throw error;
    }
  }
}