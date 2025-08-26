import groupGiftsData from '@/services/mockData/groupGifts.json';

class GroupGiftService {
  constructor() {
    this.groupGifts = [...groupGiftsData];
  }

  async delay(ms = 500) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  getNextId() {
    return Math.max(...this.groupGifts.map(g => g.Id), 0) + 1;
  }

  getNextContributorId(groupGift) {
    const allContributors = [
      ...groupGift.contributors,
      ...groupGift.invitedContributors.map(inv => ({ Id: 0, ...inv }))
    ];
    return Math.max(...allContributors.map(c => c.Id || 0), 0) + 1;
  }

  async getAll() {
    await this.delay();
    return [...this.groupGifts];
  }

  async getById(id) {
    await this.delay();
    const groupGift = this.groupGifts.find(g => g.Id === parseInt(id));
    if (!groupGift) {
      throw new Error(`Group gift with ID ${id} not found`);
    }
    return { ...groupGift };
  }

  async getByRecipient(recipientId) {
    await this.delay();
    return this.groupGifts.filter(g => g.recipientId === parseInt(recipientId));
  }

  async getByCreator(creatorEmail) {
    await this.delay();
    return this.groupGifts.filter(g => g.createdBy === creatorEmail);
  }

  async create(groupGiftData) {
    await this.delay();
    
    const newGroupGift = {
      Id: this.getNextId(),
      title: groupGiftData.title,
      recipientId: parseInt(groupGiftData.recipientId),
      giftId: groupGiftData.giftId ? parseInt(groupGiftData.giftId) : null,
      occasionType: groupGiftData.occasionType || 'General',
      targetAmount: parseFloat(groupGiftData.targetAmount) || 0,
      currentAmount: 0,
      createdBy: groupGiftData.createdBy,
      createdAt: new Date().toISOString(),
      deadline: groupGiftData.deadline,
      status: 'active',
      description: groupGiftData.description || '',
      contributors: [],
      invitedContributors: groupGiftData.invitedContributors || []
    };

    this.groupGifts.push(newGroupGift);
    return { ...newGroupGift };
  }

  async update(id, groupGiftData) {
    await this.delay();
    
    const index = this.groupGifts.findIndex(g => g.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Group gift with ID ${id} not found`);
    }

    this.groupGifts[index] = {
      ...this.groupGifts[index],
      ...groupGiftData,
      Id: parseInt(id) // Ensure ID doesn't change
    };

    return { ...this.groupGifts[index] };
  }

  async delete(id) {
    await this.delay();
    
    const index = this.groupGifts.findIndex(g => g.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Group gift with ID ${id} not found`);
    }

    const deleted = this.groupGifts.splice(index, 1)[0];
    return { ...deleted };
  }

  async addContribution(id, contributionData) {
    await this.delay();
    
    const groupGift = await this.getById(id);
    
    const newContribution = {
      Id: this.getNextContributorId(groupGift),
      name: contributionData.name,
      email: contributionData.email,
      amount: parseFloat(contributionData.amount),
      contributedAt: new Date().toISOString(),
      message: contributionData.message || ''
    };

    // Add to contributors
    groupGift.contributors.push(newContribution);
    
    // Update current amount
    groupGift.currentAmount += newContribution.amount;
    
    // Remove from invited if they were invited
    groupGift.invitedContributors = groupGift.invitedContributors.filter(
      inv => inv.email !== contributionData.email
    );

    // Update status if target reached
    if (groupGift.currentAmount >= groupGift.targetAmount) {
      groupGift.status = 'completed';
    }

    await this.update(id, groupGift);
    return newContribution;
  }

  async inviteContributors(id, invitations) {
    await this.delay();
    
    const groupGift = await this.getById(id);
    
    const newInvitations = invitations.map(invitation => ({
      email: invitation.email,
      name: invitation.name || invitation.email,
      invitedAt: new Date().toISOString(),
      status: 'pending'
    }));

    // Add new invitations, avoiding duplicates
    const existingEmails = [
      ...groupGift.contributors.map(c => c.email),
      ...groupGift.invitedContributors.map(i => i.email)
    ];

    const uniqueInvitations = newInvitations.filter(
      inv => !existingEmails.includes(inv.email)
    );

    groupGift.invitedContributors.push(...uniqueInvitations);
    
    await this.update(id, groupGift);
    return uniqueInvitations;
  }

  async removeInvitation(id, email) {
    await this.delay();
    
    const groupGift = await this.getById(id);
    
    groupGift.invitedContributors = groupGift.invitedContributors.filter(
      inv => inv.email !== email
    );
    
    await this.update(id, groupGift);
    return true;
  }

  async getContributionStats() {
    await this.delay();
    
    const stats = {
      totalGroupGifts: this.groupGifts.length,
      activeGroupGifts: this.groupGifts.filter(g => g.status === 'active').length,
      completedGroupGifts: this.groupGifts.filter(g => g.status === 'completed').length,
      totalAmount: this.groupGifts.reduce((sum, g) => sum + g.currentAmount, 0),
      averageContribution: 0,
      totalContributors: 0
    };

    const allContributors = this.groupGifts.flatMap(g => g.contributors);
    stats.totalContributors = allContributors.length;
    
    if (stats.totalContributors > 0) {
      const totalContributions = allContributors.reduce((sum, c) => sum + c.amount, 0);
      stats.averageContribution = totalContributions / stats.totalContributors;
    }

    return stats;
  }
}

export const groupGiftService = new GroupGiftService();