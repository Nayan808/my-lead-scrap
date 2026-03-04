import axios from 'axios';

export class EmailExtractor {
  private static emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;

  static async extractEmailFromWebsite(websiteUrl: string): Promise<string | null> {
    try {
      if (!websiteUrl || !websiteUrl.startsWith('http')) {
        return null;
      }

      // Add user agent to avoid being blocked
      const response = await axios.get(websiteUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        },
        timeout: 10000
      });

      const html = response.data;
      const emails = html.match(this.emailRegex);

      if (emails && emails.length > 0) {
        // Filter out common false positives and prioritize business emails
        const businessEmails = emails.filter((email: string) =>
          !email.includes('example.com') &&
          !email.includes('test.com') &&
          !email.includes('sample.com') &&
          (email.includes('contact') ||
            email.includes('info') ||
            email.includes('support') ||
            email.includes('sales') ||
            email.includes('service') ||
            !email.includes('.jpg') &&
            !email.includes('.png') &&
            !email.includes('.gif'))
        );

        return businessEmails.length > 0 ? businessEmails[0] : emails[0];
      }

      return null;
    } catch (error) {
      console.error('Error extracting email from website:', error);
      return null;
    }
  }

  static async extractEmailsFromMultipleWebsites(businesses: any[]): Promise<any[]> {
    const updatedBusinesses = [...businesses];

    for (let i = 0; i < updatedBusinesses.length; i++) {
      const business = updatedBusinesses[i];
      if (business.hasWebsite && business.website && !business.email) {
        try {
          const email = await this.extractEmailFromWebsite(business.website);
          if (email) {
            updatedBusinesses[i] = {
              ...business,
              email,
              hasEmail: true
            };
          }
        } catch (error) {
          console.error(`Failed to extract email for ${business.name}:`, error);
        }
      }
    }

    return updatedBusinesses;
  }
}
