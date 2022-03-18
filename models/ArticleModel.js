import db from '#app/db';

/**
 * ArticleModel typedef
 * @typedef {Object} Article
 * @property {number} id
 * @property {string} title
 * @property {string} description
 * @property {string} body
 * @property {Date} created_at
 * @property {Date} updated_at
 */

class ArticleModel {
  /**
   * Get list of articles
   * @returns {Promise<Array<Article>>} List of articles
   */
  static async getAll() {
    try {
      const data = await db.client.query('SELECT * FROM "articles"');
      return data.rows;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get article by `id`
   *
   * @param {string} id Id of article
   * @returns {Promise<Article | null>} Founded article
   */
  static async getById(id) {
    try {
      const data = await db.client.query(
        'SELECT * from "articles" WHERE "id" = $1',
        [id]
      );

      if (data.rows.length === 0) return null;

      return data.rows[0];
    } catch (error) {
      throw error;
    }
  }

  /**
   * Create new article in database
   *
   * @param {{ title: string, description: string, body: string }} data Data for creating
   * @returns {Promise<Article>} Created article
   */
  static async create(data) {
    try {
      const count = await db.client.query('SELECT COUNT(*) FROM "articles"');
      const values = Object.values({
        id: String(parseInt(count.rows[0].count, 10) + 1),
        title: data.title,
        description: data.description,
        body: data.body,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
      const article = await db.client.query(
        `INSERT INTO "articles" ("id", "title", "description", "body", "created_at", "updated_at") VALUES($1, $2, $3, $4, $5, $6)`,
        values
      );

      return article;
    } catch (error) {
      throw error;
    }
  }
}

export default ArticleModel;
