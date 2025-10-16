import mysql from 'mysql2/promise';
import 'dotenv/config'

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

class UserRegistrationModel {

    // Create user (equivalent to mongoose create)
    static async create(userData) {
        try {
            const {
                fullName,
                email,
                password,
                role = 'Patient',
                profileImage = '',
                speciality = '',
                address = '',
                phone = '',
                gender = '',
                age = '',
                bloodGroup = ''
            } = userData;

            const query = `
                INSERT INTO userregistrations
                (fullName, email, password, role, profileImage, speciality, address, phone, gender, age, bloodGroup, createdAt, updatedAt)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
            `;

            const [result] = await pool.execute(query, [
                fullName, email, password, role, profileImage, speciality,
                address, phone, gender, age, bloodGroup
            ]);

            // Fetch the created user
            const [users] = await pool.execute(
                'SELECT * FROM userregistrations WHERE id = ?',
                [result.insertId]
            );

            return users[0];
        } catch (error) {
            throw error;
        }
    }

    // Find all users (equivalent to mongoose find)
    static async find(filter = {}) {
        try {
            let query = 'SELECT * FROM userregistrations';
            let params = [];

            if (Object.keys(filter).length > 0) {
                const conditions = Object.keys(filter).map(key => `${key} = ?`);
                query += ` WHERE ${conditions.join(' AND ')}`;
                params = Object.values(filter);
            }

            query += ' ORDER BY createdAt DESC';

            const [users] = await pool.execute(query, params);
            return users;
        } catch (error) {
            throw error;
        }
    }

    // Find one user (equivalent to mongoose findOne)
    static async findOne(filter) {
        try {
            const conditions = Object.keys(filter).map(key => `${key} = ?`);
            const query = `SELECT * FROM userregistrations WHERE ${conditions.join(' AND ')} LIMIT 1`;
            const params = Object.values(filter);

            const [users] = await pool.execute(query, params);
            return users[0] || null;
        } catch (error) {
            throw error;
        }
    }

    // Find by ID (equivalent to mongoose findById)
    static async findById(id) {
        try {
            const [users] = await pool.execute(
                'SELECT * FROM userregistrations WHERE id = ?',
                [id]
            );
            return users[0] || null;
        } catch (error) {
            throw error;
        }
    }

    // Update user (equivalent to mongoose findByIdAndUpdate)
    static async findByIdAndUpdate(id, updates, options = {}) {
        try {
            // Build update query
            const updateFields = Object.keys(updates).map(key => `${key} = ?`);
            const query = `UPDATE userregistrations SET ${updateFields.join(', ')}, updatedAt = NOW() WHERE id = ?`;
            const params = [...Object.values(updates), id];

            await pool.execute(query, params);

            // Return updated user if requested
            if (options.new) {
                return await this.findById(id);
            }

            return { id, ...updates };
        } catch (error) {
            throw error;
        }
    }

    // Delete user (equivalent to mongoose findByIdAndDelete)
    static async findByIdAndDelete(id) {
        try {
            const user = await this.findById(id);
            if (!user) return null;

            await pool.execute('DELETE FROM userregistrations WHERE id = ?', [id]);
            return user;
        } catch (error) {
            throw error;
        }
    }

    // Count users (equivalent to mongoose countDocuments)
    static async countDocuments(filter = {}) {
        try {
            let query = 'SELECT COUNT(*) as count FROM userregistrations';
            let params = [];

            if (Object.keys(filter).length > 0) {
                const conditions = Object.keys(filter).map(key => `${key} = ?`);
                query += ` WHERE ${conditions.join(' AND ')}`;
                params = Object.values(filter);
            }

            const [result] = await pool.execute(query, params);
            return result[0].count;
        } catch (error) {
            throw error;
        }
    }
}

export default UserRegistrationModel;