const { DataTypes } = require('sequelize')

module.exports = {
    up: async ({ context: queryInterface }) => {
        await queryInterface.createTable('reading_lists', {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            user_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: { model: 'users', key: 'id' },
            },
            blog_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: { model: 'blogs', key: 'id' },
            },
            read: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false
            },
            created_at: {
                type: DataTypes.DATE,
                allowNull: false
            },
            updated_at: {
                type: DataTypes.DATE,
                allowNull: false
            }
        })
        await queryInterface.addConstraint('reading_lists', {
            fields: ['user_id', 'blog_id'],
            type: 'unique',
            name: 'unique_user_blog_reading_list'
        })
    },
    down: async ({ context: queryInterface }) => {
        await queryInterface.dropTable('reading_lists')
    },
}