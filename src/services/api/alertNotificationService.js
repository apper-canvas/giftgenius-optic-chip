import { toast } from "react-toastify";

class AlertNotificationService {
  constructor() {
    this.notificationQueue = [];
    this.emailService = {
      send: this.mockEmailSend.bind(this)
    };
    this.pushService = {
      send: this.mockPushSend.bind(this)
    };
  }

  async sendPriceDropAlert(alert, oldPrice, newPrice) {
    const savings = oldPrice - newPrice;
    const percentageDrop = ((oldPrice - newPrice) / oldPrice * 100).toFixed(1);
    
    const notification = {
      type: 'price_drop',
      alert,
      oldPrice,
      newPrice,
      savings,
      percentageDrop,
      timestamp: new Date().toISOString()
    };

    await this.processNotification(notification);
  }

  async sendStockAlert(alert, inStock) {
    const notification = {
      type: 'stock_change',
      alert,
      inStock,
      timestamp: new Date().toISOString()
    };

    await this.processNotification(notification);
  }

  async sendBulkPriceUpdate(alerts) {
    const notification = {
      type: 'bulk_update',
      alerts,
      timestamp: new Date().toISOString()
    };

    await this.processNotification(notification);
  }

  async processNotification(notification) {
    try {
      const { alert } = notification;
      
      // Show toast notification
      this.showToastNotification(notification);

      // Send email if enabled
      if (alert.emailEnabled) {
        await this.sendEmailNotification(notification);
      }

      // Send push notification if enabled
      if (alert.pushEnabled) {
        await this.sendPushNotification(notification);
      }

      // Add to notification queue for batch processing
      this.notificationQueue.push(notification);

      return true;
    } catch (error) {
      console.error('Failed to process notification:', error);
      return false;
    }
  }

  showToastNotification(notification) {
    const { type, alert } = notification;

    switch (type) {
      case 'price_drop':
        toast.success(
          `💰 Price drop alert! ${alert.gift?.title} is now $${notification.newPrice} (${notification.percentageDrop}% off)`,
          {
            autoClose: 8000,
            onClick: () => window.open(alert.gift?.purchaseUrl, '_blank')
          }
        );
        break;
      
      case 'stock_change':
        if (notification.inStock) {
          toast.info(
            `📦 Back in stock! ${alert.gift?.title} is now available`,
            {
              autoClose: 6000,
              onClick: () => window.open(alert.gift?.purchaseUrl, '_blank')
            }
          );
        } else {
          toast.warning(
            `⚠️ Out of stock: ${alert.gift?.title} is currently unavailable`,
            {
              autoClose: 5000
            }
          );
        }
        break;
      
      case 'bulk_update':
        toast.info(
          `🔔 ${notification.alerts.length} price alerts have been updated`,
          {
            autoClose: 4000,
            onClick: () => window.location.href = '/price-alerts'
          }
        );
        break;
    }
  }

  async sendEmailNotification(notification) {
    const { type, alert } = notification;
    let subject, body;

    switch (type) {
      case 'price_drop':
        subject = `Price Drop Alert: ${alert.gift?.title}`;
        body = this.generatePriceDropEmail(notification);
        break;
      
      case 'stock_change':
        subject = `Stock Alert: ${alert.gift?.title}`;
        body = this.generateStockEmail(notification);
        break;
      
      case 'bulk_update':
        subject = 'Price Alert Summary';
        body = this.generateBulkEmail(notification);
        break;
    }

    return await this.emailService.send({
      subject,
      body,
      recipient: alert.recipient?.email || 'user@example.com'
    });
  }

  async sendPushNotification(notification) {
    const { type, alert } = notification;
    let title, body;

    switch (type) {
      case 'price_drop':
        title = 'Price Drop Alert! 💰';
        body = `${alert.gift?.title} dropped ${notification.percentageDrop}% to $${notification.newPrice}`;
        break;
      
      case 'stock_change':
        title = notification.inStock ? 'Back in Stock! 📦' : 'Out of Stock ⚠️';
        body = `${alert.gift?.title} ${notification.inStock ? 'is now available' : 'is out of stock'}`;
        break;
      
      case 'bulk_update':
        title = 'Price Alert Update 🔔';
        body = `${notification.alerts.length} alerts have been updated`;
        break;
    }

    return await this.pushService.send({
      title,
      body,
      icon: '/icon-192x192.png',
      data: {
        url: alert.gift?.purchaseUrl || '/price-alerts',
        alertId: alert.Id
      }
    });
  }

  generatePriceDropEmail(notification) {
    const { alert, oldPrice, newPrice, savings, percentageDrop } = notification;
    
    return `
      <h2>Great news! The price dropped for "${alert.gift?.title}"</h2>
      <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3>Price Details:</h3>
        <p><strong>Previous Price:</strong> $${oldPrice}</p>
        <p><strong>Current Price:</strong> $${newPrice}</p>
        <p><strong>You Save:</strong> $${savings.toFixed(2)} (${percentageDrop}%)</p>
      </div>
      <p>For: ${alert.recipient?.name}</p>
      <p><a href="${alert.gift?.purchaseUrl}" style="background: #6B46C1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">Buy Now</a></p>
    `;
  }

  generateStockEmail(notification) {
    const { alert, inStock } = notification;
    
    return `
      <h2>${inStock ? 'Back in Stock!' : 'Out of Stock Alert'}</h2>
      <p>"${alert.gift?.title}" is ${inStock ? 'now available for purchase' : 'currently out of stock'}.</p>
      <p>For: ${alert.recipient?.name}</p>
      <p>Current Price: $${alert.gift?.price}</p>
      ${inStock ? `<p><a href="${alert.gift?.purchaseUrl}" style="background: #6B46C1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">Buy Now</a></p>` : ''}
    `;
  }

  generateBulkEmail(notification) {
    const { alerts } = notification;
    
    let body = '<h2>Price Alert Summary</h2><ul>';
    alerts.forEach(alert => {
      body += `<li>${alert.gift?.title} - Current: $${alert.gift?.price}</li>`;
    });
    body += '</ul>';
    body += '<p><a href="/price-alerts" style="background: #6B46C1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">View All Alerts</a></p>';
    
    return body;
  }

  async mockEmailSend({ subject, body, recipient }) {
    await this.delay(500);
    console.log(`Email sent to ${recipient}: ${subject}`);
    return { success: true, messageId: Math.random().toString(36) };
  }

  async mockPushSend({ title, body, icon, data }) {
    await this.delay(200);
    console.log(`Push notification: ${title} - ${body}`);
    
    // Mock browser notification if supported
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, { body, icon, data });
    }
    
    return { success: true };
  }

  async getNotificationHistory(limit = 50) {
    await this.delay(200);
    return this.notificationQueue
      .slice(-limit)
      .reverse()
      .map(notification => ({
        ...notification,
        id: Math.random().toString(36)
      }));
  }

  async markAsRead(notificationId) {
    await this.delay(100);
    // Mock implementation
    return true;
  }

  async delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const alertNotificationService = new AlertNotificationService();